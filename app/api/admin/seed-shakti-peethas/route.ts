import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Temple from '@/models/Temple'
import ActivityLog from '@/models/ActivityLog'
import { verifyToken, AUTH_COOKIE_NAME } from '@/lib/auth'
import {
  SHAKTI_PEETH_52,
  SHAKTI_PEETH_CATEGORY,
  getShaktiPeethMatch,
  normalizeTempleName,
  type ShaktiPeethReference,
} from '@/data/shakti-peethas'

function getAdmin(req: NextRequest) {
  const token = req.cookies.get(AUTH_COOKIE_NAME)?.value
  if (!token) return null
  const payload = verifyToken(token)
  return payload?.role === 'admin' ? payload : null
}

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

type TempleDoc = {
  _id: any
  title?: string
  slug?: string
  deity?: string
  city?: string
  state?: string
  country?: string
  description?: string
  descriptionHi?: string
  image?: string
  contact?: string
  phone?: string
  email?: string
  website?: string
  mapsLink?: string
  timings?: string
  sacredCategories?: string[]
  templeType?: string
  canonicalShaktiPeeth?: boolean
  canonicalShaktiPeethKey?: string
  canonicalShaktiPeethName?: string
  shaktiPeethMeta?: any
  status?: string
}

function findBestMatch(entry: ShaktiPeethReference, temples: TempleDoc[]): TempleDoc | null {
  // 1. Exact key match (already mapped)
  const keyMatch = temples.find(
    t => t.canonicalShaktiPeeth === true && t.canonicalShaktiPeethKey === entry.key
  )
  if (keyMatch) return keyMatch

  // 2. Fuzzy match via the shared matcher
  const fuzzyMatch = temples.find(t => {
    const match = getShaktiPeethMatch(t as any)
    return match?.key === entry.key
  })
  if (fuzzyMatch) return fuzzyMatch

  // 3. Slug-based match
  const entrySlug = slugify(entry.name)
  const slugMatch = temples.find(t => {
    const tSlug = t.slug || slugify(t.title || '')
    return tSlug === entrySlug
  })
  if (slugMatch) return slugMatch

  // 4. City + State + deity keyword match
  const entryCity = normalizeTempleName(entry.city)
  const entryState = normalizeTempleName(entry.state)
  const entryShakti = normalizeTempleName(entry.shaktiName || '')
  if (entryCity && entryState) {
    const locationMatch = temples.find(t => {
      const tCity = normalizeTempleName(t.city)
      const tState = normalizeTempleName(t.state)
      const tTitle = normalizeTempleName(t.title)
      const tDeity = normalizeTempleName(t.deity)
      const cityMatch = tCity && (tCity.includes(entryCity) || entryCity.includes(tCity))
      const stateMatch = tState && (tState.includes(entryState) || entryState.includes(tState))
      const nameHint = entryShakti && (tTitle.includes(entryShakti) || tDeity.includes(entryShakti))
      return cityMatch && stateMatch && nameHint
    })
    if (locationMatch) return locationMatch
  }

  return null
}

// Required fields checklist
const REQUIRED_FIELDS: (keyof TempleDoc)[] = [
  'title', 'deity', 'city', 'state', 'country',
  'description', 'descriptionHi', 'sacredCategories', 'templeType',
]

function getMissingFields(temple: TempleDoc): string[] {
  const missing: string[] = []
  for (const field of REQUIRED_FIELDS) {
    const val = temple[field]
    if (val === undefined || val === null || val === '' || (Array.isArray(val) && val.length === 0)) {
      missing.push(field)
    }
  }
  return missing
}

// GET: Dry-run report (no mutations)
export async function GET(req: NextRequest) {
  const admin = getAdmin(req)
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await connectDB()
    const temples = await Temple.find(
      {},
      'title slug deity city state country description descriptionHi image contact phone email website mapsLink timings sacredCategories templeType canonicalShaktiPeeth canonicalShaktiPeethKey canonicalShaktiPeethName shaktiPeethMeta status'
    ).lean() as TempleDoc[]

    const results: any[] = []
    let matchedCount = 0
    let toCreateCount = 0

    for (const entry of SHAKTI_PEETH_52) {
      const match = findBestMatch(entry, temples)
      if (match) {
        matchedCount++
        results.push({
          canonicalKey: entry.key,
          canonicalName: entry.name,
          action: match.canonicalShaktiPeeth === true && match.canonicalShaktiPeethKey === entry.key
            ? 'already-mapped'
            : 'will-map',
          existingTempleId: String(match._id),
          existingTempleTitle: match.title,
          missingFields: getMissingFields(match),
        })
      } else {
        toCreateCount++
        results.push({
          canonicalKey: entry.key,
          canonicalName: entry.name,
          action: 'will-create',
          existingTempleId: null,
          existingTempleTitle: null,
          missingFields: [],
        })
      }
    }

    // Extra non-canonical tagged temples
    const canonicalKeys = new Set(SHAKTI_PEETH_52.map(e => e.key))
    const extraTagged = temples.filter(t => {
      const cats = [...(t.sacredCategories || []), t.templeType || '']
      const isTagged = cats.some(c => /shakti.*peeth/i.test(c))
      const isCanonical = t.canonicalShaktiPeeth === true && canonicalKeys.has(t.canonicalShaktiPeethKey || '')
      return isTagged && !isCanonical && !results.some(r => r.existingTempleId === String(t._id))
    }).map(t => ({ id: String(t._id), title: t.title, city: t.city, state: t.state }))

    return NextResponse.json({
      ok: true,
      dryRun: true,
      summary: {
        totalCanonical: SHAKTI_PEETH_52.length,
        matchedExisting: matchedCount,
        toCreate: toCreateCount,
        alreadyMapped: results.filter(r => r.action === 'already-mapped').length,
        extraNonCanonicalTagged: extraTagged.length,
      },
      entries: results,
      extraNonCanonicalTagged: extraTagged,
    })
  } catch (error) {
    console.error('Seed Shakti Peethas dry-run error:', error)
    return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 })
  }
}

// POST: Execute seed (map existing + create missing)
export async function POST(req: NextRequest) {
  const admin = getAdmin(req)
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await connectDB()
    const temples = await Temple.find(
      {},
      'title slug deity city state country description descriptionHi image contact phone email website mapsLink timings sacredCategories templeType canonicalShaktiPeeth canonicalShaktiPeethKey canonicalShaktiPeethName shaktiPeethMeta status'
    ).lean() as TempleDoc[]

    const mapped: any[] = []
    const created: any[] = []
    const skipped: any[] = []
    const errors: any[] = []
    const now = new Date()

    for (const entry of SHAKTI_PEETH_52) {
      try {
        const match = findBestMatch(entry, temples)

        if (match) {
          // Already fully mapped — skip
          if (match.canonicalShaktiPeeth === true && match.canonicalShaktiPeethKey === entry.key) {
            skipped.push({
              canonicalKey: entry.key,
              templeId: String(match._id),
              title: match.title,
              reason: 'already-mapped',
            })
            continue
          }

          // Map existing temple — only add canonical metadata, do NOT overwrite existing data
          const meta = {
            key: entry.key,
            name: entry.name,
            aliases: entry.aliases,
            city: entry.city,
            state: entry.state,
            country: entry.country,
            shaktiName: entry.shaktiName || '',
            bhairavName: entry.bhairavName || '',
            bodyPart: entry.bodyPart || '',
            mappedAt: now.toISOString(),
            mappedByAdminId: admin.id,
            source: 'seed-shakti-peethas',
          }

          const updateFields: any = {
            canonicalShaktiPeeth: true,
            canonicalShaktiPeethKey: entry.key,
            canonicalShaktiPeethName: entry.name,
            shaktiPeethMeta: meta,
          }

          // Only fill empty fields — never overwrite existing data
          if (!match.description && entry.description) updateFields.description = entry.description
          if (!match.descriptionHi && entry.descriptionHi) updateFields.descriptionHi = entry.descriptionHi
          if (!match.templeType) updateFields.templeType = entry.templeType
          if (!match.timings && entry.timings) updateFields.timings = entry.timings
          if (!match.mapsLink && entry.mapsLink) updateFields.mapsLink = entry.mapsLink
          if (!match.deity && entry.shaktiName) updateFields.deity = entry.shaktiName

          // Add sacred category if missing
          const existingCats = match.sacredCategories || []
          if (!existingCats.includes(SHAKTI_PEETH_CATEGORY)) {
            updateFields.sacredCategories = [...existingCats, SHAKTI_PEETH_CATEGORY]
          }

          await Temple.findByIdAndUpdate(match._id, { $set: updateFields })

          // Activity log
          try {
            await ActivityLog.create({
              action: 'map-canonical-shakti-peeth',
              entity: 'temple',
              entityId: String(match._id),
              entityTitle: match.title,
              adminId: admin.id,
              adminName: admin.name || admin.email,
              details: JSON.stringify({ canonicalKey: entry.key, canonicalName: entry.name, source: 'seed-shakti-peethas' }),
              timestamp: now,
            })
          } catch { /* log failure non-fatal */ }

          mapped.push({
            canonicalKey: entry.key,
            templeId: String(match._id),
            title: match.title,
          })
        } else {
          // Create new temple record
          const newTemple = await Temple.create({
            title: entry.name,
            deity: entry.shaktiName || 'Devi',
            templeType: entry.templeType,
            sacredCategories: entry.sacredCategories,
            description: entry.description || '',
            descriptionHi: entry.descriptionHi || '',
            speciality: entry.speciality || '',
            city: entry.city,
            state: entry.state,
            country: entry.country,
            timings: entry.timings || '',
            mapsLink: entry.mapsLink || '',
            canonicalShaktiPeeth: true,
            canonicalShaktiPeethKey: entry.key,
            canonicalShaktiPeethName: entry.name,
            shaktiPeethMeta: {
              key: entry.key,
              name: entry.name,
              aliases: entry.aliases,
              city: entry.city,
              state: entry.state,
              country: entry.country,
              shaktiName: entry.shaktiName || '',
              bhairavName: entry.bhairavName || '',
              bodyPart: entry.bodyPart || '',
              createdAt: now.toISOString(),
              createdByAdminId: admin.id,
              source: 'seed-shakti-peethas',
            },
            status: 'approved',
          })

          // Activity log
          try {
            await ActivityLog.create({
              action: 'create-canonical-shakti-peeth',
              entity: 'temple',
              entityId: String(newTemple._id),
              entityTitle: entry.name,
              adminId: admin.id,
              adminName: admin.name || admin.email,
              details: JSON.stringify({ canonicalKey: entry.key, canonicalName: entry.name, source: 'seed-shakti-peethas' }),
              timestamp: now,
            })
          } catch { /* log failure non-fatal */ }

          created.push({
            canonicalKey: entry.key,
            templeId: String(newTemple._id),
            title: entry.name,
          })
        }
      } catch (entryError: any) {
        errors.push({
          canonicalKey: entry.key,
          canonicalName: entry.name,
          error: entryError?.message || 'Unknown error',
        })
      }
    }

    // Extra non-canonical tagged temples
    const canonicalKeys = new Set(SHAKTI_PEETH_52.map(e => e.key))
    const refreshedTemples = await Temple.find(
      {},
      'title sacredCategories templeType canonicalShaktiPeeth canonicalShaktiPeethKey city state'
    ).lean() as TempleDoc[]

    const extraTagged = refreshedTemples.filter(t => {
      const cats = [...(t.sacredCategories || []), t.templeType || '']
      const isTagged = cats.some(c => /shakti.*peeth/i.test(c))
      const isCanonical = t.canonicalShaktiPeeth === true && canonicalKeys.has(t.canonicalShaktiPeethKey || '')
      return isTagged && !isCanonical
    }).map(t => ({ id: String(t._id), title: t.title, city: t.city, state: t.state }))

    // Missing fields per canonical temple
    const allCanonical = refreshedTemples.filter(
      t => t.canonicalShaktiPeeth === true && canonicalKeys.has(t.canonicalShaktiPeethKey || '')
    )
    const missingFieldsReport = allCanonical.map(t => ({
      id: String(t._id),
      title: t.title,
      canonicalKey: t.canonicalShaktiPeethKey,
      missingFields: getMissingFields(t),
    })).filter(r => r.missingFields.length > 0)

    return NextResponse.json({
      ok: true,
      summary: {
        totalCanonical: SHAKTI_PEETH_52.length,
        mapped: mapped.length,
        created: created.length,
        skippedDuplicates: skipped.length,
        errors: errors.length,
        extraNonCanonicalTagged: extraTagged.length,
        templesWithMissingFields: missingFieldsReport.length,
      },
      mapped,
      created,
      skipped,
      errors,
      extraNonCanonicalTagged: extraTagged,
      missingFieldsReport,
    })
  } catch (error) {
    console.error('Seed Shakti Peethas error:', error)
    return NextResponse.json({ error: 'Failed to seed Shakti Peethas' }, { status: 500 })
  }
}
