import { NextRequest, NextResponse } from 'next/server'
import { Types } from 'mongoose'
import { connectDB } from '@/lib/db'
import Temple from '@/models/Temple'
import ActivityLog from '@/models/ActivityLog'
import { verifyToken, AUTH_COOKIE_NAME } from '@/lib/auth'
import { checkRateLimit } from '@/lib/rate-limit'
import { generateTempleDescriptionPreview, TEMPLE_AI_MODEL, TempleAIPreviewInput } from '@/lib/temple-ai'

type AdminPayload = NonNullable<ReturnType<typeof verifyToken>>

type TempleRecord = {
  _id: unknown
  title?: unknown
  deity?: unknown
  templeType?: unknown
  templeTypes?: unknown
  categories?: unknown
  sacredCategories?: unknown
  city?: unknown
  state?: unknown
  establishedYear?: unknown
  speciality?: unknown
  description?: unknown
  descriptionHi?: unknown
}

function getAdmin(req: NextRequest): AdminPayload | null {
  const token = req.cookies.get(AUTH_COOKIE_NAME)?.value
  if (!token) return null
  const payload = verifyToken(token)
  return payload?.role === 'admin' ? payload : null
}

function stringValue(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

async function logPreviewAttempt(input: {
  templeId: string
  templeTitle: string
  admin: AdminPayload
  status: 'success' | 'failed'
  error?: string
}) {
  try {
    await ActivityLog.create({
      action: 'ai-preview',
      entity: 'temple',
      entityId: input.templeId,
      entityTitle: input.templeTitle,
      adminId: input.admin.id,
      adminName: input.admin.name || input.admin.email,
      details: JSON.stringify({
        templeId: input.templeId,
        templeTitle: input.templeTitle,
        adminEmail: input.admin.email,
        source: 'openai-temple-description-preview',
        model: TEMPLE_AI_MODEL,
        status: input.status,
        error: input.error || '',
        note: 'AI-generated content must be reviewed before applying',
      }),
      timestamp: new Date(),
    })
    return true
  } catch (logError) {
    console.error('Temple AI preview audit log failed:', logError)
    return false
  }
}

/**
 * GET /api/admin/temples/ai-preview?id=<templeId>
 *
 * Generates an admin-only AI preview. This route never writes generated content
 * to a temple record.
 */
export async function GET(req: NextRequest) {
  const admin = getAdmin(req)
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { ok } = checkRateLimit(`temple-ai-preview:${admin.id}`, 4, 60_000)
  if (!ok) {
    return NextResponse.json({ error: 'Too many AI preview requests. Please wait a minute and try again.' }, { status: 429 })
  }

  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id') || ''

  if (!Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: 'Invalid temple id' }, { status: 400 })
  }

  let templeId = id
  let templeTitle = 'Untitled temple'

  try {
    await connectDB()

    const temple = (await Temple.findById(id)
      .select([
        'title',
        'deity',
        'templeType',
        'templeTypes',
        'categories',
        'sacredCategories',
        'city',
        'state',
        'establishedYear',
        'speciality',
        'description',
        'descriptionHi',
      ].join(' '))
      .lean()) as TempleRecord | null

    if (!temple) {
      return NextResponse.json({ error: 'Temple not found' }, { status: 404 })
    }

    templeId = String(temple._id)
    templeTitle = stringValue(temple.title) || 'Untitled temple'

    if (!process.env.OPENAI_API_KEY) {
      const message = 'OPENAI_API_KEY is not configured.'
      const logCreated = await logPreviewAttempt({
        templeId,
        templeTitle,
        admin,
        status: 'failed',
        error: message,
      })

      return NextResponse.json({ error: message, logCreated }, { status: 503 })
    }

    const previewInput: TempleAIPreviewInput = {
      title: temple.title,
      deity: temple.deity,
      templeType: temple.templeType,
      templeTypes: temple.templeTypes,
      categories: temple.categories,
      sacredCategories: temple.sacredCategories,
      city: temple.city,
      state: temple.state,
      establishedYear: temple.establishedYear,
      speciality: temple.speciality,
      existingDescription: temple.description,
      existingDescriptionHi: temple.descriptionHi,
    }

    const preview = await generateTempleDescriptionPreview(previewInput)
    const logCreated = await logPreviewAttempt({
      templeId,
      templeTitle,
      admin,
      status: 'success',
    })

    return NextResponse.json({
      temple: {
        id: templeId,
        title: templeTitle,
        deity: stringValue(temple.deity) || undefined,
        city: stringValue(temple.city) || undefined,
        state: stringValue(temple.state) || undefined,
      },
      model: TEMPLE_AI_MODEL,
      preview,
      logCreated,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'AI preview failed.'
    const logCreated = await logPreviewAttempt({
      templeId,
      templeTitle,
      admin,
      status: 'failed',
      error: message,
    })

    console.error('Temple AI preview error:', error)
    return NextResponse.json({
      error: message,
      logCreated,
    }, { status: message.toLowerCase().includes('timeout') ? 504 : 500 })
  }
}
