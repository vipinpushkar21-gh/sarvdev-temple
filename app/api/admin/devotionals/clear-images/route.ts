import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { AUTH_COOKIE_NAME, verifyToken } from '@/lib/auth'
import Devotional from '@/models/Devotional'
import ActivityLog from '@/models/ActivityLog'

const ALLOWED_IMAGE_FIELDS = ['image', 'imageCard', 'imageHero', 'ogImage', 'thumbnail', 'coverImage'] as const
type ImageField = (typeof ALLOWED_IMAGE_FIELDS)[number]

function getAdmin(req: NextRequest) {
  const token = req.cookies.get(AUTH_COOKIE_NAME)?.value
  if (!token) return null
  const payload = verifyToken(token)
  return payload?.role === 'admin' ? payload : null
}

function getSelectedFields(input: unknown): ImageField[] {
  if (!Array.isArray(input)) return [...ALLOWED_IMAGE_FIELDS]
  const selected = input.filter((field): field is ImageField =>
    typeof field === 'string' && (ALLOWED_IMAGE_FIELDS as readonly string[]).includes(field)
  )
  return Array.from(new Set(selected))
}

function buildImageFieldQuery(fields: ImageField[]) {
  return {
    $or: fields.map((field) => ({
      [field]: { $exists: true, $nin: [null, ''] },
    })),
  }
}

function getFieldsPresent(doc: Record<string, unknown>, fields: ImageField[]) {
  return fields.filter((field) => typeof doc[field] === 'string' && String(doc[field]).trim().length > 0)
}

async function createLog(admin: NonNullable<ReturnType<typeof getAdmin>>, details: Record<string, unknown>) {
  try {
    await ActivityLog.create({
      action: 'clear-devotional-images',
      entity: 'devotional',
      adminId: admin.id,
      adminName: admin.name || admin.email,
      details: JSON.stringify(details),
    })
    return true
  } catch {
    return false
  }
}

export async function POST(req: NextRequest) {
  const admin = getAdmin(req)
  if (!admin) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })

  let body: any = {}
  try {
    body = await req.json()
  } catch {
    body = {}
  }

  const fields = getSelectedFields(body.fields)
  if (fields.length === 0) {
    return NextResponse.json({ ok: false, error: 'No valid image fields selected' }, { status: 400 })
  }

  const apply = body.apply === true

  try {
    await connectDB()

    const projection = fields.reduce<Record<string, 1>>((acc, field) => {
      acc[field] = 1
      return acc
    }, { title: 1, slug: 1 } as Record<string, 1>)

    const totalScanned = await Devotional.collection.countDocuments({})
    const query = buildImageFieldQuery(fields)
    const affectedDocs = await Devotional.collection.find(query).project(projection).toArray()
    const affectedRecords = affectedDocs.map((doc: any) => ({
      id: String(doc._id),
      title: doc.title || '',
      slug: doc.slug || '',
      fields: getFieldsPresent(doc, fields),
    }))
    const imagesFound = affectedRecords.reduce((sum, record) => sum + record.fields.length, 0)

    let clearedRecords = 0
    let logCreated = false

    if (apply && affectedRecords.length > 0) {
      const unset = fields.reduce<Record<string, ''>>((acc, field) => {
        acc[field] = ''
        return acc
      }, {})
      const result = await Devotional.collection.updateMany(query, { $unset: unset })
      clearedRecords = result.modifiedCount || 0
      logCreated = await createLog(admin, {
        source: 'deity-image-derived-devotionals',
        fields,
        totalScanned,
        affectedCount: affectedRecords.length,
        imagesFound,
        clearedRecords,
      })
    } else if (apply) {
      logCreated = await createLog(admin, {
        source: 'deity-image-derived-devotionals',
        fields,
        totalScanned,
        affectedCount: 0,
        imagesFound: 0,
        clearedRecords: 0,
      })
    }

    return NextResponse.json({
      ok: true,
      dryRun: !apply,
      totalScanned,
      affectedCount: affectedRecords.length,
      imagesFound,
      fields,
      sampleAffectedRecords: affectedRecords.slice(0, 10),
      clearedRecords,
      clearedFields: apply ? imagesFound : 0,
      logCreated,
    })
  } catch (error) {
    const reason = error instanceof Error ? error.message : 'Failed to clear devotional images'
    return NextResponse.json({ ok: false, error: reason }, { status: 500 })
  }
}
