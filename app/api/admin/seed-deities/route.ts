// POST /api/admin/seed-deities - safely seed missing static deities into DB.
import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { AUTH_COOKIE_NAME, verifyToken } from '@/lib/auth'
import Deity from '@/models/Deity'
import ActivityLog from '@/models/ActivityLog'
import { findBestDeityMatch } from '@/lib/deity-identity'
import { resolveCategoryForDeity } from '@/lib/deity-categories'

type SeedError = {
  slug?: string
  name?: string
  reason: string
}

const MERGEABLE_EMPTY_FIELDS = [
  'name',
  'nameHi',
  'description',
  'descriptionHi',
  'mantra',
  'attributes',
  'category',
  'categoryId',
  'metaTitle',
  'metaDescription',
  'metaKeywords',
  'staticSlug',
  'order',
] as const

const MEDIA_FIELDS = new Set(['image', 'imageCard', 'imageHero', 'images', 'ogImage'])

function getAdmin(req: NextRequest) {
  const token = req.cookies.get(AUTH_COOKIE_NAME)?.value
  if (!token) return null
  const payload = verifyToken(token)
  return payload?.role === 'admin' ? payload : null
}

function getErrorReason(error: unknown) {
  if (error instanceof Error) return error.message
  return typeof error === 'string' ? error : 'Unknown error'
}

function isEmptyValue(value: unknown) {
  if (value === undefined || value === null) return true
  if (typeof value === 'string') return value.trim().length === 0
  if (Array.isArray(value)) return value.length === 0
  return false
}

function cleanString(value: unknown) {
  return typeof value === 'string' ? value.trim() : ''
}

function cleanStringArray(value: unknown) {
  if (!Array.isArray(value)) return []
  return value.map((item) => cleanString(item)).filter(Boolean)
}

function normalizeSeedRecord(input: any, order: number) {
  const slug = cleanString(input?.slug)
  const name = cleanString(input?.name)
  const nameHi = cleanString(input?.nameHi)

  if (!slug) throw new Error('Missing required slug')
  if (!name) throw new Error('Missing required name')
  if (!nameHi) throw new Error('Missing required Hindi name')
  const canonicalCategory = resolveCategoryForDeity(input?.category, input?.categoryId)
  if (!canonicalCategory) throw new Error('Invalid deity category')

  return {
    name,
    nameHi,
    slug,
    description: cleanString(input?.description),
    descriptionHi: cleanString(input?.descriptionHi),
    mantra: cleanString(input?.mantra),
    attributes: cleanStringArray(input?.attributes),
    image: cleanString(input?.image),
    imageCard: cleanString(input?.imageCard),
    imageHero: cleanString(input?.imageHero),
    images: cleanStringArray(input?.images),
    category: canonicalCategory,
    categoryId: canonicalCategory,
    staticSlug: slug,
    slugAliases: [],
    order,
    metaTitle: cleanString(input?.metaTitle),
    metaDescription: cleanString(input?.metaDescription),
    metaKeywords: cleanString(input?.metaKeywords),
    ogImage: cleanString(input?.ogImage),
    status: 'approved',
    source: 'seeded',
    isCustomized: false,
    lastSeededAt: new Date(),
    updatedAt: new Date(),
  }
}

function buildEmptyFieldMerge(existing: any, seedRecord: ReturnType<typeof normalizeSeedRecord>) {
  const update: Record<string, unknown> = {}

  for (const field of MERGEABLE_EMPTY_FIELDS) {
    if (MEDIA_FIELDS.has(field)) continue
    const currentValue = existing?.[field]
    const seedValue = (seedRecord as any)[field]

    if (isEmptyValue(currentValue) && !isEmptyValue(seedValue)) {
      update[field] = seedValue
    }
  }

  return update
}

async function logSeedAction(admin: NonNullable<ReturnType<typeof getAdmin>>, details: Record<string, unknown>) {
  try {
    await ActivityLog.create({
      action: 'seed-deities',
      entity: 'deity',
      adminId: admin.id,
      adminName: admin.name || admin.email,
      details: JSON.stringify(details),
    })
  } catch {
    // Activity logging should not block safe seed imports.
  }
}

export async function POST(req: NextRequest) {
  const admin = getAdmin(req)
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let body: any = {}
  try {
    body = await req.json()
  } catch {
    body = {}
  }

  const deities = body?.deities
  if (!Array.isArray(deities)) {
    return NextResponse.json({
      ok: false,
      created: 0,
      skippedExisting: 0,
      mergedMissingFields: 0,
      protectedCustomized: 0,
      failed: 0,
      errors: [{ reason: 'Invalid deities data' }],
    }, { status: 400 })
  }

  try {
    await connectDB()
  } catch (error) {
    return NextResponse.json({
      ok: false,
      created: 0,
      skippedExisting: 0,
      mergedMissingFields: 0,
      protectedCustomized: 0,
      failed: deities.length,
      errors: [{ reason: `Database connection failed: ${getErrorReason(error)}` }],
    }, { status: 500 })
  }

  let created = 0
  let skippedExisting = 0
  let mergedMissingFields = 0
  let protectedCustomized = 0
  let failed = 0
  const errors: SeedError[] = []
  const results: Array<{ slug?: string; name?: string; action: string; mergedFields?: string[]; reason?: string }> = []
  const existingDeities = await Deity.find({}).lean()

  for (let index = 0; index < deities.length; index += 1) {
    const input = deities[index]
    const seedRecord = (() => {
      try {
        return normalizeSeedRecord(input, index)
      } catch (error) {
        failed += 1
        const reason = getErrorReason(error)
        errors.push({ slug: input?.slug, name: input?.name, reason })
        results.push({ slug: input?.slug, name: input?.name, action: 'failed', reason })
        return null
      }
    })()

    if (!seedRecord) continue

    try {
      const existing = findBestDeityMatch(seedRecord, existingDeities as any[])?.deity as any

      if (existing) {
        if ((existing as any).isCustomized) {
          protectedCustomized += 1
          results.push({ slug: seedRecord.slug, name: seedRecord.name, action: 'protected-customized' })
          continue
        }

        const update = buildEmptyFieldMerge(existing, seedRecord)
        const mergedFields = Object.keys(update)

        if (mergedFields.length > 0) {
          update.lastSeededAt = new Date()
          update.updatedAt = new Date()
          await Deity.updateOne({ _id: (existing as any)._id }, { $set: update })
          Object.assign(existing, update)
          mergedMissingFields += 1
          results.push({ slug: seedRecord.slug, name: seedRecord.name, action: 'merged-empty-fields', mergedFields })
        } else {
          skippedExisting += 1
          results.push({ slug: seedRecord.slug, name: seedRecord.name, action: 'skipped-existing' })
        }

        continue
      }

      await Deity.create(seedRecord)
      existingDeities.push(seedRecord as any)
      created += 1
      results.push({ slug: seedRecord.slug, name: seedRecord.name, action: 'created' })
    } catch (error) {
      failed += 1
      const reason = getErrorReason(error)
      errors.push({ slug: seedRecord.slug, name: seedRecord.name, reason })
      results.push({ slug: seedRecord.slug, name: seedRecord.name, action: 'failed', reason })
    }
  }

  const details = {
    created,
    skippedExisting,
    mergedMissingFields,
    protectedCustomized,
    failed,
    errors,
    source: 'safe-static-deity-seed',
  }
  await logSeedAction(admin, details)

  return NextResponse.json({
    ok: true,
    success: true,
    ...details,
    results,
  })
}
