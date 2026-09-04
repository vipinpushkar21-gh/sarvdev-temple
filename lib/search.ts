/**
 * lib/search.ts — Sarvdev Global Search Architecture
 *
 * Pure utilities: types, string helpers, result formatters.
 * No Mongoose model imports — safe to import in any context.
 *
 * DB queries live in app/api/search/route.ts which imports this.
 * Client components import only `type` from here.
 */

// ── Content type registry ────────────────────────────────────────────────────

export type SearchContentType =
  | 'temple'
  | 'deity'
  | 'devotional'
  | 'blog'
  | 'event'
  | 'darshan'
  | 'spiritualIcon'
  | 'sacredCategory'

export const SEARCH_CONTENT_TYPES: SearchContentType[] = [
  'temple', 'deity', 'devotional', 'blog', 'event', 'darshan', 'spiritualIcon', 'sacredCategory',
]

// ── Canonical search result ───────────────────────────────────────────────────

export type SearchResult = {
  type: SearchContentType
  id: string
  title: string
  titleHi?: string
  slug?: string
  url: string
  excerpt?: string
  image?: string
  category?: string
  deity?: string
  location?: string
  city?: string
  state?: string
}

// ── Structured search response ────────────────────────────────────────────────

export type SearchResults = {
  temples:        SearchResult[]
  deities:        SearchResult[]
  devotionals:    SearchResult[]
  blogs:          SearchResult[]
  events:         SearchResult[]
  darshan:        SearchResult[]
  spiritualIcons: SearchResult[]
  sacredCategories: SearchResult[]
}

export type SearchCounts = {
  temples:        number
  deities:        number
  devotionals:    number
  blogs:          number
  events:         number
  darshan:        number
  spiritualIcons: number
  sacredCategories: number
}

export type SearchResponse = {
  query: string
  results: SearchResults
  counts: SearchCounts
  hasMore: boolean
  totalResults: number
}

// ── Search parameters ─────────────────────────────────────────────────────────

export type SearchParams = {
  q: string
  type?: string         // 'all' | SearchContentType
  page?: number
  limit?: number        // per content type
  state?: string
  city?: string
  category?: string
  deity?: string
  language?: string
  status?: string
}

// ── Suggestion type ───────────────────────────────────────────────────────────

export type Suggestion = {
  type: SearchContentType
  title: string
  titleHi?: string
  url: string
  image?: string
  category?: string
}

// ── Provider interface (future extensibility) ─────────────────────────────────

export interface SearchProvider {
  search: (params: SearchParams) => Promise<SearchResponse>
  suggest?: (q: string, limit?: number) => Promise<Suggestion[]>
}

// ── String utilities ──────────────────────────────────────────────────────────

/** Escapes all regex special characters in a string. */
export function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/** Builds a case-insensitive regex from a raw query string. */
export function buildRegex(q: string): RegExp {
  return new RegExp(escapeRegex(q.trim()), 'i')
}

/**
 * Normalizes a query string for Devanagari-aware matching.
 * Lowercases, removes extra whitespace.
 */
export function normalizeQuery(q: string): string {
  return q.trim().toLowerCase().replace(/\s+/g, ' ')
}

/** Returns true if the query contains Devanagari characters. */
export function isDevanagari(q: string): boolean {
  return /[\u0900-\u097F]/.test(q)
}

/**
 * Caps a number between min and max.
 */
export function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n))
}

// ── Result formatters ─────────────────────────────────────────────────────────
// Convert raw lean() DB documents into canonical SearchResult objects.

export function formatTempleResult(doc: Record<string, any>): SearchResult {
  return {
    type: 'temple',
    id: String(doc._id),
    title: String(doc.title || ''),
    titleHi: doc.titleHi || undefined,
    slug: doc.slug || undefined,
    url: `/temples/${doc.slug || String(doc._id)}`,
    excerpt: doc.shortDescription || doc.description
      ? String(doc.shortDescription || doc.description || '').slice(0, 120)
      : undefined,
    image: doc.imageCard || doc.image || doc.imageHero || undefined,
    deity: doc.deity || undefined,
    location: doc.location || undefined,
    city: doc.city || undefined,
    state: doc.state || undefined,
  }
}

export function formatDeityResult(doc: Record<string, any>): SearchResult {
  return {
    type: 'deity',
    id: String(doc._id),
    title: String(doc.name || doc.title || ''),
    titleHi: doc.nameHi || undefined,
    slug: doc.slug || undefined,
    url: `/deities/${doc.slug || String(doc._id)}`,
    excerpt: doc.description
      ? String(doc.description).slice(0, 120)
      : undefined,
    image: doc.imageCard || doc.image || doc.imageHero || undefined,
    category: doc.categoryName || doc.category || undefined,
  }
}

export function formatDevotionalResult(doc: Record<string, any>): SearchResult {
  return {
    type: 'devotional',
    id: String(doc._id),
    title: String(doc.title || ''),
    titleHi: doc.titleHi || undefined,
    slug: doc.slug || undefined,
    url: `/devotionals/${doc.slug || doc._id}`,
    image: doc.imageCard || doc.image || undefined,
    category: doc.category || undefined,
    deity: doc.deity || undefined,
  }
}

export function formatBlogResult(doc: Record<string, any>): SearchResult {
  return {
    type: 'blog',
    id: String(doc._id),
    title: String(doc.title || ''),
    titleHi: doc.titleHi || undefined,
    slug: doc.slug || undefined,
    url: `/blog/${doc.slug || String(doc._id)}`,
    excerpt: doc.excerpt ? String(doc.excerpt).slice(0, 120) : undefined,
    image: doc.imageCard || doc.image || undefined,
    category: doc.category || undefined,
  }
}

export function formatEventResult(doc: Record<string, any>): SearchResult {
  return {
    type: 'event',
    id: String(doc._id),
    title: String(doc.title || ''),
    titleHi: doc.titleHi || undefined,
    slug: doc.slug || undefined,
    url: `/events/${doc.slug || String(doc._id)}`,
    excerpt: doc.description ? String(doc.description).slice(0, 120) : undefined,
    image: doc.imageCard || doc.image || undefined,
    category: doc.category || undefined,
    city: doc.city || undefined,
    state: doc.state || undefined,
  }
}

export function formatDarshanResult(doc: Record<string, any>): SearchResult {
  return {
    type: 'darshan',
    id: String(doc._id),
    title: String(doc.title || ''),
    slug: doc.slug || undefined,
    url: '/daily-darshan',
    image: doc.imageCard || doc.image || doc.thumbnail || undefined,
    location: doc.temple || doc.location || undefined,
    city: doc.city || undefined,
    state: doc.state || undefined,
  }
}

export function formatSpiritualIconResult(doc: Record<string, any>): SearchResult {
  return {
    type: 'spiritualIcon',
    id: String(doc._id || doc.id || doc.slug || ''),
    title: String(doc.name || doc.title || ''),
    titleHi: doc.nameHi || undefined,
    slug: doc.slug || undefined,
    url: `/spiritual-icons/${doc.slug || String(doc._id)}`,
    excerpt: doc.shortBio ? String(doc.shortBio).slice(0, 120) : undefined,
    image: doc.imageCard || doc.image || undefined,
    category: doc.category || doc.tradition || undefined,
    location: doc.location || doc.city || undefined,
  }
}

export function formatSacredCategoryResult(cat: {
  slug: string
  name: string
  nameHi: string
  description?: string
  pilgrimage?: boolean
}): SearchResult {
  return {
    type: 'sacredCategory',
    id: cat.slug,
    title: cat.name,
    titleHi: cat.nameHi,
    slug: cat.slug,
    url: `/temples/pilgrimage/${cat.slug}`,
    excerpt: cat.description,
  }
}

// ── Empty results helpers ─────────────────────────────────────────────────────

export function emptyResults(): SearchResults {
  return {
    temples: [], deities: [], devotionals: [], blogs: [],
    events: [], darshan: [], spiritualIcons: [], sacredCategories: [],
  }
}

export function emptyCounts(): SearchCounts {
  return {
    temples: 0, deities: 0, devotionals: 0, blogs: 0,
    events: 0, darshan: 0, spiritualIcons: 0, sacredCategories: 0,
  }
}

export function emptySearchResponse(q = ''): SearchResponse {
  return {
    query: q,
    results: emptyResults(),
    counts: emptyCounts(),
    hasMore: false,
    totalResults: 0,
  }
}
