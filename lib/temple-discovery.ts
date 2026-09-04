import Temple from '@/models/Temple'
import { connectDB } from '@/lib/db'
import {
  normalizeTempleText,
  sacredCategorySlug,
  slugifyTemple,
} from '@/lib/temple-normalization'
import { getCategoryBySlug, getCategoryByName } from '@/lib/sacred-categories'
import type { SarvdevMediaAsset } from '@/lib/media-asset'

export const TEMPLE_PAGE_SIZE = 24

export const TEMPLE_CARD_FIELDS =
  'title titleHi slug city cityHi district state stateHi deity deityHi deitySlug shortDescription description descriptionHi timings categories sacredCategories sacredCategorySlugs templeType primaryMedia cardMedia heroMedia'

export type TempleCardRecord = {
  _id: string
  slug?: string
  title: string
  titleHi?: string
  city?: string
  district?: string
  state?: string
  deity?: string
  deityHi?: string
  timings?: string
  description?: string
  descriptionHi?: string
  shortDescription?: string
  categories?: string[]
  sacredCategories?: string[]
  sacredCategorySlugs?: string[]
  primaryMedia?: SarvdevMediaAsset | null
  cardMedia?: SarvdevMediaAsset | null
  heroMedia?: SarvdevMediaAsset | null
}

export type TempleSort = 'newest' | 'oldest' | 'title' | 'place'

export type TempleQuery = {
  q?: string
  state?: string
  stateSlug?: string
  states?: string[]
  district?: string
  districtSlug?: string
  city?: string
  citySlug?: string
  category?: string
  deity?: string
  deitySlug?: string
  sort?: TempleSort
  page?: number
  pageSize?: number
}

export function publicTempleFilter() {
  return {
    $or: [
      { status: 'approved' },
      { status: { $exists: false } },
      { status: '' },
      { status: null },
    ],
  }
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function anchored(value: string) {
  return new RegExp(`^${escapeRegex(value)}$`, 'i')
}

/** Matches a stored place name against a URL slug without needing a stored slug field. */
export function placeSlugRegex(slug: string) {
  const parts = slug.split('-').filter(Boolean).map(escapeRegex)
  if (parts.length === 0) return /^$/
  return new RegExp(`^${parts.join('[^a-z0-9]+')}$`, 'i')
}

export function stateMatch(slugOrName: string, isSlug = true) {
  return isSlug
    ? { stateNormalized: placeSlugRegex(slugOrName) }
    : { stateNormalized: normalizeTempleText(slugOrName) }
}

export function cityMatch(slugOrName: string, isSlug = true) {
  return isSlug
    ? { cityNormalized: placeSlugRegex(slugOrName) }
    : { cityNormalized: normalizeTempleText(slugOrName) }
}

export function districtMatch(slugOrName: string, isSlug = true) {
  return isSlug ? { district: placeSlugRegex(slugOrName) } : { district: anchored(slugOrName) }
}

export function normalizeSort(value: unknown): TempleSort {
  if (value === 'oldest' || value === 'title' || value === 'place') return value
  return 'newest'
}

function sortSpec(sort: TempleSort): Record<string, 1 | -1> {
  if (sort === 'oldest') return { createdAt: 1, _id: 1 }
  if (sort === 'title') return { titleNormalized: 1, _id: 1 }
  if (sort === 'place') return { stateNormalized: 1, cityNormalized: 1, titleNormalized: 1 }
  return { createdAt: -1, _id: -1 }
}

/**
 * Public discovery filter. Every clause targets an indexed or normalized field so
 * geography and category browsing never degrades into a collection scan.
 */
export function buildTempleFilter(query: TempleQuery) {
  const and: Record<string, unknown>[] = [publicTempleFilter()]

  const q = (query.q || '').trim()
  if (q) {
    const normalized = normalizeTempleText(q)
    const prefix = new RegExp(`^${escapeRegex(normalized || q)}`, 'i')
    const loose = new RegExp(escapeRegex(q), 'i')
    and.push({
      $or: [
        { titleNormalized: prefix },
        { cityNormalized: prefix },
        { stateNormalized: prefix },
        { deitySlug: slugifyTemple(q) },
        { sacredCategorySlugs: slugifyTemple(q) },
        { title: loose },
        { titleHi: loose },
        { deity: loose },
      ],
    })
  }

  const state = (query.state || '').trim()
  if (state) and.push(stateMatch(state, false))

  const stateSlug = (query.stateSlug || '').trim()
  if (stateSlug) and.push(stateMatch(stateSlug))

  if (query.states && query.states.length > 0) {
    and.push({ stateNormalized: { $in: query.states.map((value) => normalizeTempleText(value)) } })
  }

  const city = (query.city || '').trim()
  if (city) and.push(cityMatch(city, false))

  const citySlug = (query.citySlug || '').trim()
  if (citySlug) and.push(cityMatch(citySlug))

  const district = (query.district || '').trim()
  if (district) and.push(districtMatch(district, false))

  const districtSlug = (query.districtSlug || '').trim()
  if (districtSlug) and.push(districtMatch(districtSlug))

  const category = (query.category || '').trim()
  if (category) {
    const slug = sacredCategorySlug(category)
    const known = getCategoryBySlug(slug) || getCategoryByName(category)
    const names = [known?.name, category].filter(Boolean) as string[]
    and.push({
      $or: [
        { sacredCategorySlugs: slug },
        { categories: { $in: names } },
        { sacredCategories: { $in: names } },
      ],
    })
  }

  const deity = (query.deity || '').trim()
  if (deity) {
    and.push({ $or: [{ deitySlug: slugifyTemple(deity) }, { deity: anchored(deity) }] })
  }

  const deitySlug = (query.deitySlug || '').trim()
  if (deitySlug) and.push({ deitySlug })

  return and.length === 1 ? and[0] : { $and: and }
}

export async function findTemples(query: TempleQuery) {
  const pageSize = Math.min(48, Math.max(1, query.pageSize || TEMPLE_PAGE_SIZE))
  const page = Math.max(1, query.page || 1)
  const filter = buildTempleFilter(query)

  await connectDB()
  const [rows, total] = await Promise.all([
    Temple.find(filter, TEMPLE_CARD_FIELDS)
      .sort(sortSpec(normalizeSort(query.sort)))
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .lean(),
    Temple.countDocuments(filter),
  ])

  return {
    temples: JSON.parse(JSON.stringify(rows)) as TempleCardRecord[],
    total,
    page,
    pageSize,
    pages: Math.max(1, Math.ceil(total / pageSize)),
  }
}

export type PlaceCount = { name: string; count: number }

async function groupCount(field: string, match: Record<string, unknown>, limit: number): Promise<PlaceCount[]> {
  await connectDB()
  const rows = await Temple.aggregate([
    { $match: { $and: [publicTempleFilter(), { [field]: { $nin: [null, ''] } }, match] } },
    { $group: { _id: `$${field}`, count: { $sum: 1 } } },
    { $sort: { count: -1, _id: 1 } },
    { $limit: limit },
  ])
  return rows
    .filter((row: { _id?: string }) => Boolean(row._id))
    .map((row: { _id: string; count: number }) => ({ name: row._id, count: row.count }))
}

export function statesWithCounts(limit = 60) {
  return groupCount('state', {}, limit)
}

export function districtsInPlace(match: Record<string, unknown>, limit = 200) {
  return groupCount('district', match, limit)
}

export function citiesInPlace(match: Record<string, unknown>, limit = 200) {
  return groupCount('city', match, limit)
}

export function statesInPlace(match: Record<string, unknown>, limit = 60) {
  return groupCount('state', match, limit)
}

export function deitiesInPlace(match: Record<string, unknown>, limit = 24) {
  return groupCount('deity', match, limit)
}

export async function sacredCategoryCounts(limit = 40): Promise<PlaceCount[]> {
  await connectDB()
  const rows = await Temple.aggregate([
    { $match: { $and: [publicTempleFilter(), { 'sacredCategorySlugs.0': { $exists: true } }] } },
    { $unwind: '$sacredCategorySlugs' },
    { $group: { _id: '$sacredCategorySlugs', count: { $sum: 1 } } },
    { $sort: { count: -1, _id: 1 } },
    { $limit: limit },
  ])
  return rows
    .filter((row: { _id?: string }) => Boolean(row._id))
    .map((row: { _id: string; count: number }) => ({ name: row._id, count: row.count }))
}

export function templeHref(temple: { slug?: string; title?: string }) {
  return `/temples/${temple.slug || slugifyTemple(temple.title || '')}`
}

export function templePlace(temple: { city?: string; district?: string; state?: string }) {
  return [temple.city, temple.district && temple.district !== temple.city ? temple.district : '', temple.state]
    .filter(Boolean)
    .join(', ')
}
