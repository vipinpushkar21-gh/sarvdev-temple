import { NextRequest, NextResponse } from 'next/server'
import { Types } from 'mongoose'
import { connectDB } from '@/lib/db'
import Temple from '@/models/Temple'
import ActivityLog from '@/models/ActivityLog'
import { verifyToken, AUTH_COOKIE_NAME } from '@/lib/auth'
import { buildTempleSuggestions, TempleSuggestionInput } from '@/lib/temple-suggestions'

type ApplyField =
  | 'deity'
  | 'templeType'
  | 'templeTypes'
  | 'sacredCategories'
  | 'categories'
  | 'metaTitle'
  | 'metaDescription'
  | 'metaKeywords'
  | 'speciality'
  | 'timingSlots'
  | 'timings'
  | 'imagePrompt'

type TempleRecord = TempleSuggestionInput & {
  _id: unknown
  title?: unknown
  deity?: unknown
  templeType?: unknown
  templeTypes?: unknown
  sacredCategories?: unknown
  categories?: unknown
  metaTitle?: unknown
  metaDescription?: unknown
  metaKeywords?: unknown
  speciality?: unknown
  timingSlots?: unknown
  timings?: unknown
}

type SkippedField = { field: string; reason: string }

const REQUESTABLE_FIELDS = new Set<ApplyField>([
  'deity',
  'templeType',
  'templeTypes',
  'sacredCategories',
  'categories',
  'metaTitle',
  'metaDescription',
  'metaKeywords',
  'speciality',
  'timingSlots',
  'timings',
  'imagePrompt',
])

type AdminPayload = NonNullable<ReturnType<typeof verifyToken>>

function getAdmin(req: NextRequest): AdminPayload | null {
  const token = req.cookies.get(AUTH_COOKIE_NAME)?.value
  if (!token) return null
  const payload = verifyToken(token)
  return payload?.role === 'admin' ? payload : null
}

function stringValue(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

function stringList(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value.map(item => stringValue(item)).filter(Boolean)
}

function hasText(value: unknown): boolean {
  return stringValue(value).length > 0
}

function hasList(value: unknown): boolean {
  return stringList(value).length > 0
}

function isWeakText(value: unknown, minLength: number): boolean {
  const text = stringValue(value)
  return !text || text.length < minLength
}

function hasWeakKeywords(value: unknown): boolean {
  return stringValue(value)
    .split(',')
    .map(item => item.trim())
    .filter(Boolean).length < 3
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

function normalizeRequestField(field: string): ApplyField | null {
  if (!REQUESTABLE_FIELDS.has(field as ApplyField)) return null
  return field as ApplyField
}

function addApplied(applied: string[], field: string) {
  if (!applied.includes(field)) applied.push(field)
}

function addSkipped(skipped: SkippedField[], field: string, reason: string) {
  skipped.push({ field, reason })
}

/**
 * POST /api/admin/temples/apply-suggestions
 *
 * Applies selected deterministic suggestions only after recomputing them from
 * the current temple document. Client-provided suggestion values are ignored.
 */
export async function POST(req: NextRequest) {
  const admin = getAdmin(req)
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const templeId = typeof body?.templeId === 'string' ? body.templeId : ''
    const rawFields: string[] = Array.isArray(body?.fields)
      ? body.fields.map((field: unknown) => String(field))
      : []
    const fields = Array.from(new Set(rawFields))

    if (!Types.ObjectId.isValid(templeId)) {
      return NextResponse.json({ error: 'Invalid temple id' }, { status: 400 })
    }

    if (fields.length === 0) {
      return NextResponse.json({ error: 'No fields selected' }, { status: 400 })
    }

    await connectDB()

    const temple = (await Temple.findById(templeId).lean()) as TempleRecord | null
    if (!temple) {
      return NextResponse.json({ error: 'Temple not found' }, { status: 404 })
    }

    const suggestions = buildTempleSuggestions(temple)
    const update: Record<string, string | string[]> = {}
    const applied: string[] = []
    const skipped: SkippedField[] = []

    for (const rawField of fields) {
      const field = normalizeRequestField(rawField)

      if (!field) {
        addSkipped(skipped, rawField, 'Field is not allowed for deterministic apply.')
        continue
      }

      if (field === 'imagePrompt') {
        addSkipped(skipped, field, 'Image prompt is preview-only and is not saved to the temple record.')
        continue
      }

      if (field === 'deity') {
        const suggestion = suggestions.deity
        if (!suggestion) {
          addSkipped(skipped, field, 'No deterministic deity suggestion is available for the current temple data.')
          continue
        }

        const current = stringValue(temple.deity)
        if (current && current.toLowerCase() !== 'other') {
          addSkipped(skipped, field, 'Existing deity is already populated.')
          continue
        }

        update.deity = suggestion.value
        addApplied(applied, 'deity')
        continue
      }

      if (field === 'templeType' || field === 'templeTypes') {
        const suggestion = suggestions.templeType
        if (!suggestion) {
          addSkipped(skipped, field, 'No deterministic temple type suggestion is available for the current temple data.')
          continue
        }

        let changed = false
        if (!hasText(temple.templeType)) {
          update.templeType = suggestion.value
          addApplied(applied, 'templeType')
          changed = true
        }
        if (!hasList(temple.templeTypes)) {
          update.templeTypes = [suggestion.value]
          addApplied(applied, 'templeTypes')
          changed = true
        }

        if (!changed) addSkipped(skipped, field, 'Existing temple type data is already populated.')
        continue
      }

      if (field === 'sacredCategories' || field === 'categories') {
        const suggestion = suggestions.sacredCategories
        if (!suggestion) {
          addSkipped(skipped, field, 'No deterministic sacred category suggestion is available for the current temple data.')
          continue
        }

        const values = compactUnique(suggestion.value)
        let changed = false
        if (!hasList(temple.sacredCategories)) {
          update.sacredCategories = values
          addApplied(applied, 'sacredCategories')
          changed = true
        }
        if (!hasList(temple.categories)) {
          update.categories = values
          addApplied(applied, 'categories')
          changed = true
        }

        if (!changed) addSkipped(skipped, field, 'Existing sacred category data is already populated.')
        continue
      }

      if (field === 'metaTitle') {
        const suggestion = suggestions.metaTitle
        if (!suggestion) {
          addSkipped(skipped, field, 'No deterministic SEO title suggestion is available for the current temple data.')
          continue
        }
        if (!isWeakText(temple.metaTitle, 15)) {
          addSkipped(skipped, field, 'Existing SEO title is already strong enough.')
          continue
        }
        update.metaTitle = suggestion.value
        addApplied(applied, 'metaTitle')
        continue
      }

      if (field === 'metaDescription') {
        const suggestion = suggestions.metaDescription
        if (!suggestion) {
          addSkipped(skipped, field, 'No deterministic SEO description suggestion is available for the current temple data.')
          continue
        }
        if (!isWeakText(temple.metaDescription, 70)) {
          addSkipped(skipped, field, 'Existing SEO description is already strong enough.')
          continue
        }
        update.metaDescription = suggestion.value
        addApplied(applied, 'metaDescription')
        continue
      }

      if (field === 'metaKeywords') {
        const suggestion = suggestions.metaKeywords
        if (!suggestion) {
          addSkipped(skipped, field, 'No deterministic SEO keyword suggestion is available for the current temple data.')
          continue
        }
        if (!hasWeakKeywords(temple.metaKeywords)) {
          addSkipped(skipped, field, 'Existing SEO keywords are already populated.')
          continue
        }
        update.metaKeywords = suggestion.value
        addApplied(applied, 'metaKeywords')
        continue
      }

      if (field === 'speciality') {
        const suggestion = suggestions.speciality
        if (!suggestion) {
          addSkipped(skipped, field, 'No deterministic speciality suggestion is available for the current temple data.')
          continue
        }
        if (!isWeakText(temple.speciality, 12)) {
          addSkipped(skipped, field, 'Existing speciality is already strong enough.')
          continue
        }
        update.speciality = suggestion.value
        addApplied(applied, 'speciality')
        continue
      }

      if (field === 'timingSlots' || field === 'timings') {
        const suggestion = suggestions.timingSlots
        if (!suggestion) {
          addSkipped(skipped, field, 'No deterministic timing suggestion is available for the current temple data.')
          continue
        }

        let changed = false
        if (!hasList(temple.timingSlots)) {
          update.timingSlots = suggestion.value
          addApplied(applied, 'timingSlots')
          changed = true
        }
        if (!hasText(temple.timings)) {
          update.timings = suggestion.value.join('; ')
          addApplied(applied, 'timings')
          changed = true
        }

        if (!changed) addSkipped(skipped, field, 'Existing timing data is already populated.')
      }
    }

    if (Object.keys(update).length > 0) {
      await Temple.findByIdAndUpdate(templeId, { $set: update }, { runValidators: true })
    }

    let logCreated = false
    try {
      const templeTitle = stringValue(temple.title) || 'Untitled temple'
      await ActivityLog.create({
        action: 'apply-suggestions',
        entity: 'temple',
        entityId: templeId,
        entityTitle: templeTitle,
        adminId: admin.id,
        adminName: admin.name || admin.email,
        details: JSON.stringify({
          templeId,
          templeTitle,
          adminEmail: admin.email,
          appliedFields: applied,
          skippedFields: skipped,
          source: 'deterministic-suggestions',
          note: 'Only empty/weak fields were applied',
        }),
        timestamp: new Date(),
      })
      logCreated = true
    } catch (logError) {
      console.error('Temple suggestion apply audit log failed:', logError)
    }

    return NextResponse.json({
      ok: true,
      applied,
      skipped,
      templeId,
      logCreated,
    })
  } catch (error) {
    console.error('Apply temple suggestions error:', error)
    return NextResponse.json({ error: 'Failed to apply temple suggestions' }, { status: 500 })
  }
}
