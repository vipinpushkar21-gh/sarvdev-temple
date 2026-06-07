import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { AUTH_COOKIE_NAME, verifyToken } from '@/lib/auth'
import { getCategoryByName, getCategoryBySlug } from '@/lib/sacred-categories'
import { normalizeTempleText, normalizeTempleWrite, slugifyTemple } from '@/lib/temple-normalization'
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

type ParsedRow = {
  rowNumber: number
  payload: Record<string, any>
}

function getAdmin(req: NextRequest) {
  const token = req.cookies.get(AUTH_COOKIE_NAME)?.value
  if (!token) return null
  const payload = verifyToken(token)
  return payload?.role === 'admin' ? payload : null
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
  return getCategoryByName(trimmed)?.name || getCategoryBySlug(slugifyTemple(trimmed))?.name || trimmed
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
    slug: row.slug?.trim() || (title ? slugifyTemple(title) : ''),
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

function unique(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)))
}

export async function POST(req: NextRequest) {
  const admin = getAdmin(req)
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const form = await req.formData()
    const dryRun = form.get('dryRun') === '1' || form.get('dryRun') === 'true'
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

    const result = {
      ok: true,
      dryRun,
      totalRows: rows.length - 1,
      created: 0,
      updated: 0,
      skipped: 0,
      failed: 0,
      errors: [] as { row: number; title?: string; reason: string }[],
      warnings: [] as { row: number; title?: string; reason: string }[],
    }

    const parsedRows: ParsedRow[] = []
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

      parsedRows.push({ rowNumber: parsed.rowNumber, payload: normalizeTempleWrite(parsed.payload) })
    }

    await connectDB()

    const slugs = unique(parsedRows.map((row) => slugifyTemple(row.payload.slug || row.payload.title)))
    const titleNormalized = unique(parsedRows.map((row) => normalizeTempleText(row.payload.title)))
    const titles = unique(parsedRows.map((row) => String(row.payload.title || '').trim()))
    const existingQuery: Record<string, any>[] = []
    if (slugs.length > 0) existingQuery.push({ slug: { $in: slugs } })
    if (titleNormalized.length > 0) existingQuery.push({ titleNormalized: { $in: titleNormalized } })
    if (titles.length > 0) existingQuery.push({ title: { $in: titles } })

    const existingTemples = existingQuery.length > 0
      ? await Temple.find(
        { $or: existingQuery },
        'title slug titleNormalized sacredCategories categories sacredCategorySlugs templeType templeTypes titleHi location city cityNormalized district state stateNormalized country deity deitySlug description descriptionHi speciality specialityHi status verified'
      ).lean()
      : []

    const bySlug = new Map<string, any>()
    const byTitle = new Map<string, any>()
    for (const temple of existingTemples as any[]) {
      if (temple.slug) bySlug.set(slugifyTemple(temple.slug), temple)
      if (temple.title) {
        bySlug.set(slugifyTemple(temple.title), temple)
        byTitle.set(normalizeTempleText(temple.title), temple)
      }
      if (temple.titleNormalized) byTitle.set(temple.titleNormalized, temple)
    }

    const pendingInserts = new Set<string>()
    const bulkOps: any[] = []

    for (const parsed of parsedRows) {
      const matchSlug = slugifyTemple(parsed.payload.slug || parsed.payload.title)
      const matchTitle = normalizeTempleText(parsed.payload.title)
      const existing = bySlug.get(matchSlug) || byTitle.get(matchTitle)

      if (existing) {
        const safeUpdate = buildSafeUpdate(existing, parsed.payload)
        if (Object.keys(safeUpdate).length === 0) {
          result.skipped += 1
          continue
        }

        const update = normalizeTempleWrite(safeUpdate, existing)
        bulkOps.push({
          updateOne: {
            filter: { _id: existing._id },
            update: { $set: update },
          },
        })
        Object.assign(existing, update)
        result.updated += 1
        continue
      }

      if (pendingInserts.has(matchSlug)) {
        result.skipped += 1
        result.warnings.push({ row: parsed.rowNumber, title: parsed.payload.title, reason: 'Duplicate temple in CSV skipped' })
        continue
      }

      pendingInserts.add(matchSlug)
      bulkOps.push({ insertOne: { document: parsed.payload } })
      result.created += 1
    }

    if (!dryRun && bulkOps.length > 0) {
      try {
        await Temple.bulkWrite(bulkOps, { ordered: false })
      } catch (error: any) {
        const failedWrites = Array.isArray(error?.writeErrors) ? error.writeErrors.length : 1
        result.failed += failedWrites
        result.errors.push({
          row: 0,
          reason: error?.message || 'Some CSV rows failed during bulk write',
        })
      }
    }

    if (!dryRun) {
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
    }

    return NextResponse.json(result)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to import CSV'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
