// lib/devotional-import.ts
// CSV import for devotionals — round-trips the columns produced by
// /api/admin/devotionals/export, scoped to a single category like the export is.
import mongoose from 'mongoose'
import Devotional from '@/models/Devotional'
import { categoryNameToSlug, categorySlugToName, getCategoryByName } from '@/lib/devotional-categories'
import { MANTRA_SUBCATEGORIES, isValidMantraSubcategory } from '@/lib/mantra-subcategories'

export type DevotionalImportMode = 'dry-run' | 'execute'

export type DevotionalImportRowResult = {
  row: number
  title: string
  action: 'create' | 'update' | 'skip'
  matchedBy?: 'id' | 'slug' | 'title'
  id?: string
  changedFields?: string[]
  reason?: string
}

export type DevotionalImportResult = {
  ok: boolean
  mode: DevotionalImportMode
  category: string
  totalRows: number
  created: number
  updated: number
  skipped: number
  errors: string[]
  rows: DevotionalImportRowResult[]
}

/** Column header (as emitted by the export) → Devotional document field. */
const COLUMN_TO_FIELD: Record<string, string> = {
  id: '_id',
  title: 'title',
  titlehi: 'titleHi',
  slug: 'slug',
  category: 'category',
  categoryslug: 'categorySlug',
  categoryhi: 'categoryHi',
  subcategory: 'subcategory',
  deity: 'deity',
  deityhi: 'deityHi',
  deityslug: 'deitySlug',
  language: 'language',
  description: 'description',
  descriptionhi: 'descriptionHi',
  content: 'content',
  contenthi: 'contentHi',
  lyrics: 'lyrics',
  audio: 'audio',
  audiourl: 'audioUrl',
  duration: 'duration',
  artist: 'artist',
  tags: 'tags',
  featured: 'featured',
  status: 'status',
  source: 'source',
  iscustomized: 'isCustomized',
  metatitle: 'metaTitle',
  metadescription: 'metaDescription',
  metakeywords: 'metaKeywords',
  image: 'image',
  imagecard: 'imageCard',
  imagehero: 'imageHero',
  ogimage: 'ogImage',
}

const BOOLEAN_FIELDS = new Set(['featured', 'isCustomized'])
const LIST_FIELDS = new Set(['tags'])
const VALID_STATUSES = new Set(['pending', 'approved', 'rejected'])

/** Fields never written from a CSV — they are derived or managed by the server. */
const DERIVED_FIELDS = new Set(['_id', 'categorySlug', 'categoryHi'])

/** RFC4180-style parser: handles quoted fields, escaped quotes and embedded newlines. */
export function parseCsv(text: string): string[][] {
  const input = text.charCodeAt(0) === 0xfeff ? text.slice(1) : text
  const rows: string[][] = []
  let row: string[] = []
  let field = ''
  let inQuotes = false

  for (let i = 0; i < input.length; i++) {
    const char = input[i]

    if (inQuotes) {
      if (char === '"') {
        if (input[i + 1] === '"') { field += '"'; i++ } else { inQuotes = false }
      } else {
        field += char
      }
      continue
    }

    if (char === '"') { inQuotes = true }
    else if (char === ',') { row.push(field); field = '' }
    else if (char === '\r' && input[i + 1] === '\n') { /* consumed with the \n below */ }
    else if (char === '\n' || char === '\r') { row.push(field); rows.push(row); row = []; field = '' }
    else { field += char }
  }

  if (field.length > 0 || row.length > 0) { row.push(field); rows.push(row) }
  return rows.filter((cells) => cells.some((cell) => cell.trim() !== ''))
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

/** Prefers the parenthesised English form of a bilingual title, e.g. "शिव आरती (Shiv Aarti)". */
function slugifyTitle(title: string): string {
  const englishMatch = title.match(/\(([^)]+)\)/)
  return slugify(englishMatch ? englishMatch[1] : title) || slugify(title)
}

function toBoolean(value: string) {
  return ['true', '1', 'yes', 'y'].includes(value.trim().toLowerCase())
}

function toList(value: string) {
  return value.split(/[;,]/).map((item) => item.trim()).filter(Boolean)
}

function normalizeCategoryName(value: string) {
  const trimmed = (value || '').trim()
  if (!trimmed) return ''
  return getCategoryByName(trimmed)?.id ?? categorySlugToName(categoryNameToSlug(trimmed))
}

/** Values are compared loosely so a CSV round-trip does not report phantom changes. */
function isSameValue(field: string, current: unknown, next: unknown) {
  if (BOOLEAN_FIELDS.has(field)) return Boolean(current) === Boolean(next)
  if (Array.isArray(current) || Array.isArray(next)) {
    const a = (Array.isArray(current) ? current : []).map(String)
    const b = (Array.isArray(next) ? next : []).map(String)
    return a.length === b.length && a.every((item, i) => item === b[i])
  }
  return String(current ?? '') === String(next ?? '')
}

function buildDocFromRow(headers: string[], cells: string[], category: string) {
  const doc: Record<string, any> = {}
  let csvId = ''
  let csvCategory = ''

  headers.forEach((header, index) => {
    const field = COLUMN_TO_FIELD[header]
    if (!field) return
    const raw = (cells[index] ?? '').trim()

    if (field === '_id') { csvId = raw; return }
    if (field === 'category') { csvCategory = normalizeCategoryName(raw); return }
    if (DERIVED_FIELDS.has(field)) return
    if (!raw) return

    if (BOOLEAN_FIELDS.has(field)) doc[field] = toBoolean(raw)
    else if (LIST_FIELDS.has(field)) doc[field] = toList(raw)
    else if (field === 'status') doc[field] = VALID_STATUSES.has(raw.toLowerCase()) ? raw.toLowerCase() : 'pending'
    else doc[field] = raw
  })

  // The import is category-scoped, so the selected category always wins.
  doc.category = category
  doc.categorySlug = categoryNameToSlug(category)
  const categoryMeta = getCategoryByName(category)
  if (categoryMeta) doc.categoryHi = categoryMeta.nameHi
  if (!doc.deitySlug && doc.deity) {
    const deitySlug = slugify(String(doc.deity))
    if (deitySlug) doc.deitySlug = deitySlug
  }
  if (!doc.slug && doc.title) {
    const titleSlug = slugifyTitle(String(doc.title))
    if (titleSlug) doc.slug = titleSlug
  }

  return { doc, csvId, csvCategory }
}

export async function runDevotionalImport(options: {
  csvText: string
  category: string
  mode: DevotionalImportMode
}): Promise<DevotionalImportResult> {
  const category = normalizeCategoryName(options.category)
  const result: DevotionalImportResult = {
    ok: false,
    mode: options.mode,
    category,
    totalRows: 0,
    created: 0,
    updated: 0,
    skipped: 0,
    errors: [],
    rows: [],
  }

  if (!category) {
    result.errors.push('Select a category before importing.')
    return result
  }

  const table = parseCsv(options.csvText)
  if (table.length < 2) {
    result.errors.push('CSV needs a header row and at least one data row.')
    return result
  }

  const headers = table[0].map((header) => header.trim().toLowerCase().replace(/\s+/g, ''))
  if (!headers.includes('title')) {
    result.errors.push('CSV is missing the required "Title" column.')
    return result
  }

  const dataRows = table.slice(1)
  result.totalRows = dataRows.length

  // Validate the complete Mantra file before any write, preventing partial imports.
  if (category === 'Mantra') {
    const subcategoryIndex = headers.indexOf('subcategory')
    if (subcategoryIndex === -1) {
      result.errors.push('Mantra CSV is missing the required "Subcategory" column.')
      return result
    }
    dataRows.forEach((cells, index) => {
      const value = String(cells[subcategoryIndex] ?? '').trim()
      const rowNumber = index + 2
      if (!value) {
        result.errors.push(`Row ${rowNumber}: Mantra Subcategory is required.`)
      } else if (!isValidMantraSubcategory(value)) {
        result.errors.push(`Row ${rowNumber}: Invalid Mantra Subcategory "${value}". Allowed values: ${MANTRA_SUBCATEGORIES.join(' | ')}`)
      }
    })
    if (result.errors.length > 0) return result
  }

  for (let i = 0; i < dataRows.length; i++) {
    const rowNumber = i + 2 // 1-based, and the header occupies row 1
    const { doc, csvId, csvCategory } = buildDocFromRow(headers, dataRows[i], category)
    const title = String(doc.title || '')

    if (!title) {
      result.skipped++
      result.rows.push({ row: rowNumber, title: '', action: 'skip', reason: 'Missing title' })
      continue
    }

    if (csvCategory && csvCategory !== category) {
      result.skipped++
      result.rows.push({ row: rowNumber, title, action: 'skip', reason: `Row category "${csvCategory}" does not match "${category}"` })
      continue
    }

    let existing: any = null
    let matchedBy: DevotionalImportRowResult['matchedBy']

    if (csvId && mongoose.Types.ObjectId.isValid(csvId)) {
      existing = await Devotional.findById(csvId).lean()
      if (existing) matchedBy = 'id'
    }
    if (!existing && doc.slug) {
      existing = await Devotional.findOne({ slug: doc.slug }).lean()
      if (existing) matchedBy = 'slug'
    }
    if (!existing) {
      existing = await Devotional.findOne({ title, category }).lean()
      if (existing) matchedBy = 'title'
    }

    if (!existing) {
      if (options.mode === 'execute') {
        await Devotional.create({ ...doc, createdAt: new Date(), updatedAt: new Date() })
      }
      result.created++
      result.rows.push({ row: rowNumber, title, action: 'create' })
      continue
    }

    const changedFields = Object.keys(doc).filter((field) => !isSameValue(field, existing[field], doc[field]))
    if (changedFields.length === 0) {
      result.skipped++
      result.rows.push({ row: rowNumber, title, action: 'skip', matchedBy, id: String(existing._id), reason: 'No changes' })
      continue
    }

    if (options.mode === 'execute') {
      await Devotional.updateOne({ _id: existing._id }, { $set: { ...doc, updatedAt: new Date() } })
    }
    result.updated++
    result.rows.push({ row: rowNumber, title, action: 'update', matchedBy, id: String(existing._id), changedFields })
  }

  result.ok = true
  return result
}
