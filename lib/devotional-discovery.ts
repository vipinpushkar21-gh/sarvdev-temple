import Devotional from '@/models/Devotional'
import Deity from '@/models/Deity'
import { connectDB } from '@/lib/db'
import type { SarvdevMediaAsset } from '@/lib/media-asset'

export const DEVOTIONAL_PAGE_SIZE = 24

export const DEVOTIONAL_CARD_FIELDS =
  'title titleHi slug category categoryHi categorySlug subcategory deity deityHi deitySlug language description descriptionHi featured audio audioUrl duration primaryMedia cardMedia heroMedia createdAt'

export const DEVOTIONAL_READER_FIELDS =
  'title titleHi slug category categoryHi categorySlug subcategory deity deityHi deitySlug language description descriptionHi content contentHi lyrics audio audioUrl duration artist tags featured primaryMedia cardMedia heroMedia galleryMedia image imageCard imageHero createdAt updatedAt'

export type DevotionalCardRecord = {
  _id: string
  slug?: string
  title: string
  titleHi?: string
  category?: string
  categoryHi?: string
  categorySlug?: string
  subcategory?: string
  deity?: string
  deityHi?: string
  deitySlug?: string
  language?: string
  description?: string
  descriptionHi?: string
  featured?: boolean
  audio?: string
  audioUrl?: string
  duration?: string
  primaryMedia?: SarvdevMediaAsset | null
  cardMedia?: SarvdevMediaAsset | null
  heroMedia?: SarvdevMediaAsset | null
}

export type DevotionalReaderRecord = DevotionalCardRecord & {
  content?: string
  contentHi?: string
  lyrics?: string
  artist?: string
  tags?: string[]
  galleryMedia?: SarvdevMediaAsset[]
  metaTitle?: string
  metaDescription?: string
  metaKeywords?: string
  image?: string
  imageCard?: string
  imageHero?: string
  ogMedia?: SarvdevMediaAsset | null
}

export type DevotionalSort = 'featured' | 'newest' | 'oldest' | 'title'

export type DevotionalQuery = {
  q?: string
  category?: string
  categorySlug?: string
  subcategory?: string
  deity?: string
  deitySlug?: string
  language?: string
  sort?: DevotionalSort
  page?: number
  pageSize?: number
}

/** Deity name variants used for devotional grouping. Text-only: no Deity record is implied. */
export const DEITY_ALIASES: Record<string, string[]> = {
  shiva: ['shiva', 'shiv', 'mahadev', 'bholenath', 'shankar'],
  vishnu: ['vishnu', 'narayan', 'hari'],
  krishna: ['krishna', 'kanha', 'gopal', 'govind', 'banke bihari', 'dwarkadhish'],
  rama: ['rama', 'ram', 'shri ram', 'sita ram'],
  hanuman: ['hanuman', 'bajrangbali', 'maruti', 'anjaneya'],
  ganesha: ['ganesha', 'ganesh', 'ganpati', 'vinayak'],
  durga: ['durga', 'ambe', 'jagdamba'],
  lakshmi: ['lakshmi', 'laxmi', 'mahalakshmi', 'mahalaxmi'],
  saraswati: ['saraswati', 'sharada'],
  kali: ['kali', 'mahakali'],
  parvati: ['parvati', 'gauri', 'uma'],
  'sai-baba': ['sai baba', 'shirdi sai', 'sai'],
  surya: ['surya'],
  shani: ['shani'],
  radha: ['radha', 'radha rani'],
}

export function publicDevotionalFilter() {
  return {
    $or: [
      { status: 'approved' },
      { status: { $exists: false } },
      { status: '' },
      { status: null },
    ],
  }
}

export function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export function slugifyDevotionalText(value: string) {
  return (value || '')
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

export function titleFromSlug(slug: string) {
  return slug
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function anchored(value: string) {
  return new RegExp(`^${escapeRegex(value)}$`, 'i')
}

/** Alias-aware deity grouping used by both the deity collection page and its API. */
export function deityAliasNames(slug: string) {
  const key = slug.toLowerCase().trim()
  return Array.from(new Set([key, titleFromSlug(key), ...(DEITY_ALIASES[key] || [])].filter(Boolean)))
}

export function deityGroupFilter(slug: string) {
  const key = slug.toLowerCase().trim()
  if (key === 'other') {
    return { $or: [{ deity: { $exists: false } }, { deity: null }, { deity: '' }] }
  }
  const aliases = deityAliasNames(key)
  const exact = aliases.map((alias) => new RegExp(`^${escapeRegex(alias).replace(/-/g, '[-\\s]')}$`, 'i'))
  return { $or: [{ deitySlug: key }, { deity: { $in: exact } }] }
}

export function normalizeDevotionalSort(value: unknown): DevotionalSort {
  if (value === 'newest' || value === 'oldest' || value === 'title') return value
  return 'featured'
}

function sortSpec(sort: DevotionalSort): Record<string, 1 | -1> {
  if (sort === 'newest') return { createdAt: -1, _id: -1 }
  if (sort === 'oldest') return { createdAt: 1, _id: 1 }
  if (sort === 'title') return { title: 1, _id: 1 }
  return { featured: -1, createdAt: -1, _id: -1 }
}

/**
 * Public discovery filter. Category, deity and language clauses target indexed fields;
 * the free-text clause stays a small bounded set of name fields.
 */
export function buildDevotionalFilter(query: DevotionalQuery) {
  const and: Record<string, unknown>[] = [publicDevotionalFilter()]

  const q = (query.q || '').trim()
  if (q) {
    const loose = new RegExp(escapeRegex(q), 'i')
    const slug = slugifyDevotionalText(q)
    and.push({
      $or: [
        { title: loose },
        { titleHi: loose },
        { slug: slug ? new RegExp(`^${escapeRegex(slug)}`, 'i') : loose },
        { deity: loose },
        { deityHi: loose },
        { deitySlug: slug || undefined },
        { categorySlug: slug || undefined },
        { subcategory: loose },
        { tags: loose },
      ].filter((clause) => Object.values(clause)[0] !== undefined),
    })
  }

  const categorySlug = (query.categorySlug || '').trim()
  if (categorySlug) {
    const or: Record<string, unknown>[] = [{ categorySlug }]
    if (categorySlug === 'namavali') or.push({ category: { $in: ['Namavali', '108 Namavali'] } })
    and.push(or.length === 1 ? or[0] : { $or: or })
  }

  const category = (query.category || '').trim()
  if (category) and.push({ category: anchored(category) })

  const subcategory = (query.subcategory || '').trim()
  if (subcategory) and.push({ subcategory })

  const deitySlug = (query.deitySlug || '').trim()
  if (deitySlug) and.push(deityGroupFilter(deitySlug))

  const deity = (query.deity || '').trim()
  if (deity) and.push({ $or: [{ deitySlug: slugifyDevotionalText(deity) }, { deity: anchored(deity) }] })

  const language = (query.language || '').trim()
  if (language) and.push({ language: anchored(language) })

  return and.length === 1 ? and[0] : { $and: and }
}

function serialize<T>(rows: unknown): T {
  return JSON.parse(JSON.stringify(rows)) as T
}

export async function findDevotionals(query: DevotionalQuery) {
  const pageSize = Math.min(48, Math.max(1, query.pageSize || DEVOTIONAL_PAGE_SIZE))
  const page = Math.max(1, query.page || 1)
  const filter = buildDevotionalFilter(query)

  await connectDB()
  const [rows, total] = await Promise.all([
    Devotional.find(filter, DEVOTIONAL_CARD_FIELDS)
      .sort(sortSpec(normalizeDevotionalSort(query.sort)))
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .lean(),
    Devotional.countDocuments(filter),
  ])

  return {
    devotionals: serialize<DevotionalCardRecord[]>(rows),
    total,
    page,
    pageSize,
    pages: Math.max(1, Math.ceil(total / pageSize)),
  }
}

const OBJECT_ID = /^[a-f0-9]{24}$/i

/** Direct indexed resolution only: stored slug first, then ObjectId. No collection scan. */
export async function findDevotionalByRoute(idOrSlug: string, fields = DEVOTIONAL_READER_FIELDS) {
  const value = (idOrSlug || '').trim()
  if (!value) return null

  await connectDB()
  const bySlug = await Devotional.findOne(
    { $and: [publicDevotionalFilter(), { slug: value }] },
    fields
  ).lean()
  if (bySlug) return serialize<DevotionalReaderRecord>(bySlug)

  if (OBJECT_ID.test(value)) {
    const byId = await Devotional.findOne(
      { $and: [publicDevotionalFilter(), { _id: value }] },
      fields
    ).lean()
    if (byId) return serialize<DevotionalReaderRecord>(byId)
  }

  return null
}

export type DevotionalFacet = { value: string; label: string; count: number }

async function facet(field: string, extraMatch: Record<string, unknown>, limit: number) {
  await connectDB()
  const rows = await Devotional.aggregate([
    { $match: { $and: [publicDevotionalFilter(), { [field]: { $nin: [null, ''] } }, extraMatch] } },
    { $group: { _id: `$${field}`, count: { $sum: 1 } } },
    { $sort: { count: -1, _id: 1 } },
    { $limit: limit },
  ])
  return rows
    .filter((row: { _id?: string }) => Boolean(row._id))
    .map((row: { _id: string; count: number }) => ({ value: row._id, label: row._id, count: row.count }))
}

export function categoryFacets(limit = 40): Promise<DevotionalFacet[]> {
  return facet('category', {}, limit)
}

export function languageFacets(limit = 12): Promise<DevotionalFacet[]> {
  return facet('language', {}, limit)
}

export function deityFacets(limit = 24, extraMatch: Record<string, unknown> = {}): Promise<DevotionalFacet[]> {
  return facet('deity', extraMatch, limit)
}

export function subcategoryFacets(categorySlug: string, limit = 24): Promise<DevotionalFacet[]> {
  return facet('subcategory', categorySlug ? { categorySlug } : {}, limit)
}

/** Related devotionals: same deity first, then same category. Bounded, indexed, no client filtering. */
export async function findRelatedDevotionals(
  devotional: Pick<DevotionalCardRecord, '_id' | 'deitySlug' | 'categorySlug'>,
  limit = 6
) {
  await connectDB()
  const exclude = { _id: { $ne: devotional._id } }
  const collected = new Map<string, DevotionalCardRecord>()

  async function collect(match: Record<string, unknown>) {
    if (collected.size >= limit) return
    const rows = await Devotional.find(
      { $and: [publicDevotionalFilter(), exclude, match] },
      DEVOTIONAL_CARD_FIELDS
    )
      .sort({ featured: -1, createdAt: -1 })
      .limit(limit * 2)
      .lean()
    for (const row of serialize<DevotionalCardRecord[]>(rows)) {
      if (collected.size >= limit) break
      if (!collected.has(row._id)) collected.set(row._id, row)
    }
  }

  if (devotional.deitySlug) await collect({ deitySlug: devotional.deitySlug })
  if (devotional.categorySlug) await collect({ categorySlug: devotional.categorySlug })

  return Array.from(collected.values())
}

/** Confirms a devotional's deity text actually resolves to a published Deity profile. */
export async function resolveDeityProfile(deitySlug?: string) {
  if (!deitySlug) return null
  await connectDB()
  const deity = await Deity.findOne(
    { slug: deitySlug, status: 'approved' },
    'slug name nameHi'
  ).lean()
  return deity ? serialize<{ slug: string; name?: string; nameHi?: string }>(deity) : null
}

export function devotionalHref(devotional: { slug?: string; _id?: string }) {
  return `/devotionals/${devotional.slug || devotional._id}`
}

export function devotionalCategoryHref(devotional: { categorySlug?: string; category?: string }) {
  const slug = devotional.categorySlug || slugifyDevotionalText(devotional.category || '')
  return slug ? `/devotionals/category/${slug}` : '/devotionals'
}

export function devotionalHasAudio(devotional: { audio?: string; audioUrl?: string }) {
  return Boolean((devotional.audioUrl || devotional.audio || '').trim())
}

export function devotionalSacredText(devotional: { lyrics?: string; content?: string }) {
  return (devotional.lyrics || devotional.content || '').trim()
}
