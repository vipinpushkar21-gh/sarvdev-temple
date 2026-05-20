import { NextRequest, NextResponse } from 'next/server'
import { Types } from 'mongoose'
import { connectDB } from '@/lib/db'
import Temple from '@/models/Temple'
import ActivityLog from '@/models/ActivityLog'
import { verifyToken, AUTH_COOKIE_NAME } from '@/lib/auth'

type ApplyAIField =
  | 'description'
  | 'descriptionHi'
  | 'speciality'
  | 'specialityHi'
  | 'metaTitle'
  | 'metaDescription'
  | 'metaKeywords'

type SkippedField = { field: string; reason: string }

type AdminPayload = NonNullable<ReturnType<typeof verifyToken>>

type TempleRecord = {
  _id: unknown
  title?: unknown
  description?: unknown
  descriptionHi?: unknown
  speciality?: unknown
  specialityHi?: unknown
  metaTitle?: unknown
  metaDescription?: unknown
  metaKeywords?: unknown
}

type ValidatedPreview = Partial<Record<Exclude<ApplyAIField, 'metaKeywords'>, string>> & {
  metaKeywords?: string
}

const ALLOWED_FIELDS: ApplyAIField[] = [
  'description',
  'descriptionHi',
  'speciality',
  'specialityHi',
  'metaTitle',
  'metaDescription',
  'metaKeywords',
]

const ALLOWED_FIELD_SET = new Set<string>(ALLOWED_FIELDS)

const MIN_TEXT_LENGTH: Record<Exclude<ApplyAIField, 'description' | 'descriptionHi' | 'metaKeywords'>, number> = {
  speciality: 12,
  specialityHi: 12,
  metaTitle: 15,
  metaDescription: 70,
}

const MAX_TEXT_LENGTH: Record<Exclude<ApplyAIField, 'metaKeywords'>, number> = {
  description: 12_000,
  descriptionHi: 12_000,
  speciality: 240,
  specialityHi: 240,
  metaTitle: 70,
  metaDescription: 180,
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

function stripHtml(value: string): string {
  return value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
}

function wordCount(value: unknown): number {
  const text = stringValue(value)
  if (!text) return 0
  return stripHtml(text).split(/\s+/).filter(Boolean).length
}

function hindiTokenCount(value: unknown): number {
  const text = stringValue(value)
  if (!text) return 0
  return stripHtml(text).match(/[\u0900-\u097F\w]+/g)?.length ?? 0
}

function hasDevanagari(value: string): boolean {
  return /[\u0900-\u097F]/.test(value)
}

function keywordList(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map(item => stringValue(item)).filter(Boolean)
  }

  return stringValue(value)
    .split(',')
    .map(item => item.trim())
    .filter(Boolean)
}

function compactUnique(values: string[]): string[] {
  const seen = new Set<string>()
  const result: string[] = []

  for (const value of values) {
    const trimmed = value.trim()
    const key = trimmed.toLowerCase()
    if (!trimmed || seen.has(key)) continue
    seen.add(key)
    result.push(trimmed)
  }

  return result
}

function normalizeField(field: unknown): ApplyAIField | null {
  if (typeof field !== 'string' || !ALLOWED_FIELD_SET.has(field)) return null
  return field as ApplyAIField
}

function isWeakCurrentField(field: ApplyAIField, value: unknown): boolean {
  if (field === 'description') return wordCount(value) < 300
  if (field === 'descriptionHi') return hindiTokenCount(value) < 250
  if (field === 'metaKeywords') return keywordList(value).length < 3
  return stringValue(value).length < MIN_TEXT_LENGTH[field]
}

function validateTextField(field: Exclude<ApplyAIField, 'metaKeywords'>, value: unknown): string | null {
  if (typeof value !== 'string') return `${field} must be a string.`

  const text = value.trim()
  if (!text) return `${field} is required.`

  if (text.length > MAX_TEXT_LENGTH[field]) {
    return `${field} is too long.`
  }

  if (field === 'description' && wordCount(text) < 300) {
    return 'description must be at least 300 words.'
  }

  if (field === 'descriptionHi') {
    if (!hasDevanagari(text)) return 'descriptionHi must contain Hindi Devanagari text.'
    if (hindiTokenCount(text) < 250) return 'descriptionHi must be at least 250 Hindi/word-like tokens.'
  }

  if (field === 'specialityHi' && !hasDevanagari(text)) {
    return 'specialityHi must contain Hindi Devanagari text.'
  }

  if (field !== 'description' && field !== 'descriptionHi' && text.length < MIN_TEXT_LENGTH[field]) {
    return `${field} is too short.`
  }

  return null
}

function validateKeywords(value: unknown): { error: string } | { value: string } {
  if (!Array.isArray(value)) {
    return { error: 'metaKeywords must be an array of strings.' }
  }

  if (value.some(item => typeof item !== 'string')) {
    return { error: 'metaKeywords must contain only strings.' }
  }

  const keywords = compactUnique(value.map(item => item.trim()))
  if (keywords.length < 5) {
    return { error: 'metaKeywords must include at least 5 useful keywords.' }
  }

  if (keywords.length > 12) {
    return { error: 'metaKeywords must include no more than 12 keywords.' }
  }

  const invalidKeyword = keywords.find(keyword => keyword.length < 2 || keyword.length > 60)
  if (invalidKeyword) {
    return { error: `metaKeywords contains an invalid keyword: ${invalidKeyword}` }
  }

  return { value: keywords.join(', ') }
}

function validateSelectedPreview(preview: Record<string, unknown>, fields: ApplyAIField[]): { error?: string; values?: ValidatedPreview } {
  const values: ValidatedPreview = {}

  for (const field of fields) {
    if (!(field in preview)) {
      return { error: `${field} is missing from preview.` }
    }

    if (field === 'metaKeywords') {
      const result = validateKeywords(preview.metaKeywords)
      if ('error' in result) return { error: result.error }
      values.metaKeywords = result.value
      continue
    }

    const error = validateTextField(field, preview[field])
    if (error) return { error }
    values[field] = (preview[field] as string).trim()
  }

  return { values }
}

async function logApplyAttempt(input: {
  templeId: string
  templeTitle: string
  admin: AdminPayload
  applied: string[]
  skipped: SkippedField[]
}) {
  try {
    await ActivityLog.create({
      action: 'apply-ai-preview',
      entity: 'temple',
      entityId: input.templeId,
      entityTitle: input.templeTitle,
      adminId: input.admin.id,
      adminName: input.admin.name || input.admin.email,
      details: JSON.stringify({
        appliedFields: input.applied,
        skippedFields: input.skipped,
        source: 'openai-preview-reviewed',
      }),
      timestamp: new Date(),
    })
    return true
  } catch (logError) {
    console.error('Temple AI preview apply audit log failed:', logError)
    return false
  }
}

/**
 * POST /api/admin/temples/apply-ai-preview
 *
 * Applies only admin-selected AI preview fields after validating the preview
 * and rechecking that each current temple field is still empty or weak.
 */
export async function POST(req: NextRequest) {
  const admin = getAdmin(req)
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const templeId = typeof body?.templeId === 'string' ? body.templeId : ''
    const preview = body?.preview && typeof body.preview === 'object' && !Array.isArray(body.preview)
      ? body.preview as Record<string, unknown>
      : null
    const rawFields = Array.isArray(body?.fields) ? body.fields : []

    if (!Types.ObjectId.isValid(templeId)) {
      return NextResponse.json({ error: 'Invalid temple id' }, { status: 400 })
    }

    if (!preview) {
      return NextResponse.json({ error: 'Invalid preview payload' }, { status: 400 })
    }

    const unknownPreviewFields = Object.keys(preview).filter(field => !ALLOWED_FIELD_SET.has(field))
    if (unknownPreviewFields.length > 0) {
      return NextResponse.json({ error: `Unsupported preview field: ${unknownPreviewFields.join(', ')}` }, { status: 400 })
    }

    const fields = Array.from(new Set(rawFields.map(normalizeField)))
    if (fields.some(field => field === null)) {
      return NextResponse.json({ error: 'Unsupported apply field selected' }, { status: 400 })
    }

    const selectedFields = fields.filter((field): field is ApplyAIField => field !== null)
    if (selectedFields.length === 0) {
      return NextResponse.json({ error: 'No fields selected' }, { status: 400 })
    }

    const validated = validateSelectedPreview(preview, selectedFields)
    if (validated.error || !validated.values) {
      return NextResponse.json({ error: validated.error || 'Invalid preview payload' }, { status: 400 })
    }

    await connectDB()

    const temple = (await Temple.findById(templeId)
      .select([
        'title',
        'description',
        'descriptionHi',
        'speciality',
        'specialityHi',
        'metaTitle',
        'metaDescription',
        'metaKeywords',
      ].join(' '))
      .lean()) as TempleRecord | null

    if (!temple) {
      return NextResponse.json({ error: 'Temple not found' }, { status: 404 })
    }

    const update: Partial<Record<ApplyAIField, string>> = {}
    const applied: string[] = []
    const skipped: SkippedField[] = []

    for (const field of selectedFields) {
      if (!isWeakCurrentField(field, temple[field])) {
        skipped.push({ field, reason: 'Existing field is already strong enough.' })
        continue
      }

      const value = validated.values[field]
      if (!value) {
        skipped.push({ field, reason: 'Validated preview value is unavailable.' })
        continue
      }

      update[field] = value
      applied.push(field)
    }

    if (Object.keys(update).length > 0) {
      await Temple.findByIdAndUpdate(templeId, { $set: update }, { runValidators: true })
    }

    const templeTitle = stringValue(temple.title) || 'Untitled temple'
    const logCreated = await logApplyAttempt({
      templeId,
      templeTitle,
      admin,
      applied,
      skipped,
    })

    return NextResponse.json({
      ok: true,
      applied,
      skipped,
      logCreated,
    })
  } catch (error) {
    console.error('Apply temple AI preview error:', error)
    return NextResponse.json({ error: 'Failed to apply AI preview' }, { status: 500 })
  }
}
