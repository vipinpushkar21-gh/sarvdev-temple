import { getCategoryByName, getCategoryBySlug } from './sacred-categories'

export function slugifyTemple(value: unknown): string {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function normalizeTempleText(value: unknown): string {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')
}

export function uniqueStrings(values: unknown[]): string[] {
  return Array.from(
    new Set(
      values
        .map((value) => String(value || '').trim())
        .filter(Boolean)
    )
  )
}

export function sacredCategorySlug(value: unknown): string {
  const raw = String(value || '').trim()
  if (!raw) return ''
  const slug = slugifyTemple(raw)
  return getCategoryBySlug(slug)?.slug || getCategoryByName(raw)?.slug || slug
}

export function sacredCategoryName(value: unknown): string {
  const raw = String(value || '').trim()
  if (!raw) return ''
  return getCategoryByName(raw)?.name || getCategoryBySlug(slugifyTemple(raw))?.name || raw
}

export function normalizeSacredCategoryNames(values: unknown): string[] {
  if (!Array.isArray(values)) return []
  return uniqueStrings(values.map(sacredCategoryName))
}

export function getSacredCategorySlugs(values: unknown): string[] {
  if (!Array.isArray(values)) return []
  return uniqueStrings(values.map(sacredCategorySlug))
}

export function normalizeTempleWrite<T extends Record<string, any>>(input: T, existing?: Record<string, any> | null): T {
  const data = { ...input } as T

  const title = typeof data.title === 'string' ? data.title : existing?.title
  const city = typeof data.city === 'string' ? data.city : existing?.city
  const state = typeof data.state === 'string' ? data.state : existing?.state
  const deity = typeof data.deity === 'string' ? data.deity : existing?.deity

  if (typeof data.slug === 'string') {
    const cleanedSlug = slugifyTemple(data.slug)
    if (cleanedSlug) {
      ;(data as any).slug = cleanedSlug
    } else {
      delete (data as any).slug
    }
  } else if (!existing?.slug && title) {
    ;(data as any).slug = slugifyTemple(title)
  }

  if (title) (data as any).titleNormalized = normalizeTempleText(title)
  if (city) (data as any).cityNormalized = normalizeTempleText(city)
  if (state) (data as any).stateNormalized = normalizeTempleText(state)
  if (deity) (data as any).deitySlug = slugifyTemple(deity)

  const incomingSacred = Array.isArray(data.sacredCategories) ? data.sacredCategories : undefined
  const incomingCategories = Array.isArray(data.categories) ? data.categories : undefined
  const existingSacred = Array.isArray(existing?.sacredCategories) ? existing?.sacredCategories : []
  const existingCategories = Array.isArray(existing?.categories) ? existing?.categories : []
  const allCategoryValues = uniqueStrings([
    ...(incomingSacred || []),
    ...(incomingCategories || []),
    ...(!incomingSacred && !incomingCategories ? existingSacred : []),
    ...(!incomingSacred && !incomingCategories ? existingCategories : []),
  ])

  if (allCategoryValues.length > 0) {
    ;(data as any).sacredCategorySlugs = getSacredCategorySlugs(allCategoryValues)
  }

  ;(data as any).updatedAt = new Date()
  return data
}
