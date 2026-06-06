import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { AUTH_COOKIE_NAME, verifyToken } from '@/lib/auth'
import { getCategoryByName, getCategoryBySlug } from '@/lib/sacred-categories'
import Temple from '@/models/Temple'
import ActivityLog from '@/models/ActivityLog'

const HEADER_MAP: Record<string, string> = {
  title: 'title',
  templetitle: 'title',
  slug: 'slug',
  templenamehi: 'titleHi',
  titlehi: 'titleHi',
  location: 'location',
  city: 'city',
  district: 'district',
  state: 'state',
  country: 'country',
  deity: 'deity',
  type: 'templeType',
  templetype: 'templeType',
  sacredcategories: 'sacredCategories',
  categories: 'sacredCategories',
  description: 'description',
  descriptionhi: 'descriptionHi',
  speciality: 'speciality',
  specialty: 'speciality',
  specialityhi: 'specialityHi',
  specialtyhi: 'specialityHi',
  status: 'status',
  verified: 'verified',
}

const SCALAR_FIELDS = [
  'slug',
  'titleHi',
  'location',
  'city',
  'district',
  'state',
  'country',
  'deity',
  'templeType',
  'description',
  'descriptionHi',
  'speciality',
  'specialityHi',
  'status',
  'verified',
] as const

function getAdmin(req: NextRequest) {
  const token = req.cookies.get(AUTH_COOKIE_NAME)?.value
  if (!token) return null
  const payload = verifyToken(token)
  return payload?.role === 'admin' ? payload : null
}

function slugify(value: string) {
  return (value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function normalizeTitle(value: string) {
  return (value || '').toLowerCase().replace(/\s+/g, ' ').trim()
}

function normalizeHeader(value: string) {
  return value.trim().replace(/^\uFEFF/, '').toLowerCase().replace(/[^a-z0-9]/g, '')
}

function parseCsv(text: string) {
  const rows: string[][] = []
  let row: string[] = []
  let field = ''
  let inQuotes = false

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i]
    const next = text[i + 1]

    if (char === '"') {
      if (inQuotes && next === '"') {
        field += '"'
        i += 1
      } else {
        inQuotes = !inQuotes
      }
      continue
    }

    if (char === ',' && !inQuotes) {
      row.push(field)
      field = ''
      continue
    }

    if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && next === '\n') i += 1
      row.push(field)
      if (row.some((cell) => cell.trim())) rows.push(row)
      row = []
      field = ''
      continue
    }

    field += char
  }

  row.push(field)
  if (row.some((cell) => cell.trim())) rows.push(row)
  return rows
}

function normalizeStatus(value: string) {
  const normalized = value.trim().toLowerCase()
  if (!normalized) return undefined
  if (['approved', 'pending', 'rejected'].includes(normalized)) return normalized
  return null
}

function normalizeVerified(value: string) {
  const normalized = value.trim().toLowerCase()
  if (!normalized) return undefined
  if (['verified', 'yes', 'true', '1', 'y'].includes(normalized)) return 'verified'
  if (['not-verified', 'not verified', 'unverified', 'no', 'false', '0', 'n'].includes(normalized)) return 'not-verified'
  return null
}

function normalizeSacredCategory(value: string) {
  const trimmed = value.trim()
  if (!trimmed) return null
  return getCategoryByName(trimmed)?.name || getCategoryBySlug(slugify(trimmed))?.name || trimmed
}

function parseSacredCategories(value: string) {
  return Array.from(
    new Set(
      value
        .split(';')
        .map(normalizeSacredCategory)
        .filter(Boolean) as string[]
    )
  )
}

function hasValue(value: unknown) {
  if (Array.isArray(value)) return value.length > 0
  return typeof value === 'string' ? value.trim().length > 0 : value !== undefined && value !== null
}

function mergeUnique(existing: unknown, incoming: string[]) {
  const current = Array.isArray(existing) ? existing.map((item) => String(item || '').trim()).filter(Boolean) : []
  return Array.from(new Set([...current, ...incoming]))
}

function rowToPayload(row: Record<string, string>, rowNumber: number) {
  const errors: string[] = []
  const warnings: string[] = []
  const title = row.title?.trim()

  if (!title) errors.push('Title is required')

  const status = normalizeStatus(row.status || '')
  if (status === null) errors.push('Status must be approved, pending, or rejected')

  const verified = normalizeVerified(row.verified || '')
  if (verified === null) errors.push('Verified must be verified/not-verified or yes/no')

  const sacredCategories = parseSacredCategories(row.sacredCategories || '')
  for (const category of sacredCategories) {
    if (!getCategoryByName(category)) warnings.push(`Unknown sacred category: ${category}`)
  }

  const templeType = row.templeType?.trim()
  const payload: Record<string, any> = {
    title,
    slug: row.slug?.trim() || (title ? slugify(title) : ''),
    titleHi: row.titleHi?.trim(),
    location: row.location?.trim(),
    city: row.city?.trim(),
    district: row.district?.trim(),
    state: row.state?.trim(),
    country: row.country?.trim() || 'India',
    deity: row.deity?.trim(),
    templeType,
    templeTypes: templeType ? [templeType] : [],
    sacredCategories,
    categories: sacredCategories,
    description: row.description?.trim(),
    descriptionHi: row.descriptionHi?.trim(),
    speciality: row.speciality?.trim(),
    specialityHi: row.specialityHi?.trim(),
    status: status || 'approved',
    verified: verified || 'not-verified',
  }

  for (const [key, value] of Object.entries(payload)) {
    if (!hasValue(value)) delete payload[key]
  }

  return { payload, errors, warnings, rowNumber }
}

function buildSafeUpdate(existing: any, incoming: Record<string, any>) {
  const update: Record<string, any> = {}

  for (const field of SCALAR_FIELDS) {
    if (hasValue(incoming[field]) && !hasValue(existing[field])) {
      update[field] = incoming[field]
    }
  }

  if (Array.isArray(incoming.sacredCategories) && incoming.sacredCategories.length > 0) {
    const sacredCategories = mergeUnique(existing.sacredCategories, incoming.sacredCategories)
    const categories = mergeUnique(existing.categories, incoming.sacredCategories)
    if (sacredCategories.length !== (existing.sacredCategories || []).length) update.sacredCategories = sacredCategories
    if (categories.length !== (existing.categories || []).length) update.categories = categories
  }

  if (hasValue(incoming.templeType) && !hasValue(existing.templeTypes)) {
    update.templeTypes = [incoming.templeType]
  }

  return update
}

export async function POST(req: NextRequest) {
  const admin = getAdmin(req)
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const form = await req.formData()
    const file = form.get('file')
    if (!file || typeof (file as any).text !== 'function') {
      return NextResponse.json({ error: 'CSV file is required' }, { status: 400 })
    }

    const csvText = await (file as any).text()
    const rows = parseCsv(csvText)
    if (rows.length < 2) {
      return NextResponse.json({ error: 'CSV must include a header row and at least one temple row' }, { status: 400 })
    }

    const headers = rows[0].map((header) => HEADER_MAP[normalizeHeader(header)] || '')
    if (!headers.includes('title')) {
      return NextResponse.json({ error: 'CSV header must include Title' }, { status: 400 })
    }

    await connectDB()
    const existingTemples = await Temple.find({}, 'title slug sacredCategories categories templeType templeTypes titleHi location city district state country deity description descriptionHi speciality specialityHi status verified').lean()
    const bySlug = new Map<string, any>()
    const byTitle = new Map<string, any>()

    for (const temple of existingTemples as any[]) {
      if (temple.slug) bySlug.set(slugify(temple.slug), temple)
      if (temple.title) {
        bySlug.set(slugify(temple.title), temple)
        byTitle.set(normalizeTitle(temple.title), temple)
      }
    }

    const result = {
      ok: true,
      totalRows: rows.length - 1,
      created: 0,
      updated: 0,
      skipped: 0,
      failed: 0,
      errors: [] as { row: number; title?: string; reason: string }[],
      warnings: [] as { row: number; title?: string; reason: string }[],
    }

    for (let index = 1; index < rows.length; index += 1) {
      const rawRow = rows[index]
      const record: Record<string, string> = {}
      headers.forEach((field, columnIndex) => {
        if (field) record[field] = (rawRow[columnIndex] || '').trim()
      })

      const parsed = rowToPayload(record, index + 1)
      parsed.warnings.forEach((warning) => result.warnings.push({ row: parsed.rowNumber, title: parsed.payload.title, reason: warning }))

      if (parsed.errors.length > 0) {
        result.failed += 1
        result.errors.push({ row: parsed.rowNumber, title: parsed.payload.title, reason: parsed.errors.join('; ') })
        continue
      }

      const matchKey = slugify(parsed.payload.slug || parsed.payload.title)
      const existing = bySlug.get(matchKey) || byTitle.get(normalizeTitle(parsed.payload.title))

      if (existing) {
        const update = buildSafeUpdate(existing, parsed.payload)
        if (Object.keys(update).length === 0) {
          result.skipped += 1
          continue
        }

        await Temple.findByIdAndUpdate(existing._id, { $set: update }, { new: true })
        Object.assign(existing, update)
        result.updated += 1
        continue
      }

      const created = await Temple.create(parsed.payload)
      bySlug.set(slugify(created.slug || created.title), created)
      byTitle.set(normalizeTitle(created.title), created)
      result.created += 1
    }

    try {
      await ActivityLog.create({
        action: 'import-temples-csv',
        entity: 'temple',
        adminId: (admin as any).id,
        details: JSON.stringify({
          totalRows: result.totalRows,
          created: result.created,
          updated: result.updated,
          skipped: result.skipped,
          failed: result.failed,
        }),
      })
    } catch {}

    return NextResponse.json(result)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to import CSV'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
