/**
 * lib/cursor-pagination.ts — Cursor-based pagination for 11L+ scale
 *
 * Replaces skip()/countDocuments() with a keyset cursor on
 * { createdAt, _id } for all list endpoints.
 *
 * Why cursor over offset:
 *  - skip(N) scans N documents — O(n), catastrophic at 11L scale
 *  - cursor reads from the last seen position — O(1) regardless of depth
 *  - countDocuments() on 11L collection with regex filter is very slow
 *
 * Usage:
 *   const token = searchParams.get('cursor') ?? undefined
 *   const filter = buildCursorFilter(token, baseFilter)
 *   const docs   = await Model.find(filter, projection)
 *                            .sort({ createdAt: -1, _id: -1 })
 *                            .limit(limit + 1).lean()
 *   return NextResponse.json(paginateCursor(docs, limit))
 *
 * Client:
 *   GET /api/temples?limit=24              — first page
 *   GET /api/temples?cursor=<nextCursor>   — next page
 *   GET /api/temples?cursor=<nextCursor>&cursor=<nextCursor>  — next next…
 *
 * Response shape:
 *   { items, nextCursor, hasMore, limit }
 *
 * Backward compat:
 *   Only activated when ?cursor= is in the URL.
 *   Existing ?page=/ offset callers are 100% unaffected.
 */

import { Types } from 'mongoose'

// ── Cursor token types ────────────────────────────────────────────────────────

export interface CursorPoint {
  createdAt: string  // ISO-8601
  _id: string        // 24-char hex ObjectId
}

// ── Encode / decode ───────────────────────────────────────────────────────────

export function encodeCursor(doc: { createdAt: any; _id: any }): string {
  const p: CursorPoint = {
    createdAt: doc.createdAt instanceof Date
      ? doc.createdAt.toISOString()
      : new Date(doc.createdAt ?? 0).toISOString(),
    _id: String(doc._id),
  }
  return Buffer.from(JSON.stringify(p)).toString('base64url')
}

export function decodeCursor(token: string): CursorPoint | null {
  try {
    if (!token) return null
    const raw = Buffer.from(token, 'base64url').toString('utf-8')
    const p = JSON.parse(raw) as CursorPoint
    if (!p._id || !p.createdAt) return null
    if (!/^[a-f0-9]{24}$/i.test(p._id)) return null
    const d = new Date(p.createdAt)
    if (isNaN(d.getTime())) return null
    return p
  } catch {
    return null
  }
}

// ── Filter builder ────────────────────────────────────────────────────────────

/**
 * Merges the cursor continuation condition into an existing baseFilter.
 * Assumes sort: { createdAt: -1, _id: -1 }.
 */
export function buildCursorFilter(
  token: string | null | undefined,
  baseFilter: Record<string, any>
): Record<string, any> {
  if (!token) return baseFilter

  const p = decodeCursor(token)
  if (!p) return baseFilter

  const cursorDate = new Date(p.createdAt)
  const cursorId   = new Types.ObjectId(p._id)

  const cursorCond: Record<string, any> = {
    $or: [
      { createdAt: { $lt: cursorDate } },
      { createdAt: cursorDate, _id: { $lt: cursorId } },
    ],
  }

  const keys = Object.keys(baseFilter)
  if (keys.length === 0) return cursorCond

  // Merge with existing $and chain if present
  if (keys.includes('$and') && Array.isArray(baseFilter.$and)) {
    return { $and: [...(baseFilter.$and as any[]), cursorCond] }
  }

  return { $and: [baseFilter, cursorCond] }
}

// ── Response builder ──────────────────────────────────────────────────────────

export interface CursorPage<T> {
  items: T[]
  nextCursor: string | null
  hasMore: boolean
  limit: number
}

/**
 * Slice the fetched docs (which has limit+1 items) into a cursor page.
 * docs MUST be sorted { createdAt: -1, _id: -1 } already.
 */
export function paginateCursor<T extends { createdAt: any; _id: any }>(
  docs: T[],
  limit: number
): CursorPage<T> {
  const hasMore = docs.length > limit
  const items   = hasMore ? docs.slice(0, limit) : docs
  const nextCursor = hasMore ? encodeCursor(items[items.length - 1]) : null
  return { items, nextCursor, hasMore, limit }
}

// ── Card projection constants (export for API routes) ─────────────────────────

/** Temple list card — ~500 bytes vs 10-50 KB full document */
export const TEMPLE_CARD_PROJ = {
  title: 1, titleHi: 1, slug: 1,
  deity: 1, deitySlug: 1, mainDeity: 1,
  city: 1, district: 1, state: 1, location: 1,
  latitude: 1, longitude: 1,
  imageCard: 1, imageHero: 1, heroImage: 1, image: 1, cardMedia: 1, heroMedia: 1, primaryMedia: 1,
  sacredCategorySlugs: 1, categories: 1,
  status: 1, verified: 1,
  shortDescription: 1, description: 1,
  createdAt: 1,
} as const

/** Deity list card */
export const DEITY_CARD_PROJ = {
  name: 1, nameHi: 1, slug: 1,
  categoryName: 1, categorySlug: 1, categoryNameHi: 1,
  imageCard: 1, image: 1, cardMedia: 1, primaryMedia: 1,
  order: 1, status: 1,
  createdAt: 1,
} as const

/** Devotional list card (lyrics/content already excluded elsewhere) */
export const DEVOTIONAL_CARD_PROJ = {
  title: 1, titleHi: 1, slug: 1,
  category: 1, categorySlug: 1,
  subcategory: 1,
  deity: 1, deitySlug: 1,
  imageCard: 1, image: 1, cardMedia: 1, primaryMedia: 1,
  language: 1, featured: 1, status: 1,
  createdAt: 1,
} as const

/** Blog list card */
export const BLOG_CARD_PROJ = {
  title: 1, titleHi: 1, slug: 1,
  category: 1, excerpt: 1,
  imageCard: 1, image: 1, cardMedia: 1, primaryMedia: 1,
  author: 1, featured: 1, status: 1,
  publishedAt: 1, createdAt: 1,
} as const

/** Event list card */
export const EVENT_CARD_PROJ = {
  title: 1, titleHi: 1, slug: 1,
  category: 1,
  imageCard: 1, image: 1, cardMedia: 1, primaryMedia: 1,
  city: 1, state: 1,
  startDate: 1, date: 1,
  featured: 1, priority: 1, status: 1,
  deitySlug: 1, deityName: 1,
  createdAt: 1,
} as const

/** Darshan list card */
export const DARSHAN_CARD_PROJ = {
  title: 1, titleHi: 1, slug: 1,
  temple: 1, templeName: 1,
  templeSlug: 1, deity: 1, deitySlug: 1, city: 1, state: 1,
  imageCard: 1, image: 1, thumbnail: 1, cardMedia: 1, primaryMedia: 1,
  youtubeId: 1, youtubeUrl: 1, videoUrl: 1, externalUrl: 1, provider: 1,
  darshanType: 1, isLive: 1, streamStatus: 1,
  isFeatured: 1, featured: 1, priority: 1,
  status: 1, createdAt: 1,
} as const

/** Spiritual Icon list card */
export const SPIRITUAL_ICON_CARD_PROJ = {
  name: 1, nameHi: 1, slug: 1,
  category: 1, categorySlug: 1,
  imageCard: 1, image: 1, cardMedia: 1, primaryMedia: 1,
  city: 1, state: 1, location: 1,
  featured: 1, priority: 1, status: 1,
  shortBio: 1,
  createdAt: 1,
} as const

// ── Cursor limit helpers ──────────────────────────────────────────────────────

/** Parse and clamp limit for cursor mode (max 50 to prevent over-fetching) */
export function parseCursorLimit(
  raw: string | null,
  defaultLimit = 24,
  maxLimit = 50
): number {
  const n = parseInt(raw || '', 10)
  if (!Number.isFinite(n) || n < 1) return defaultLimit
  return Math.min(maxLimit, n)
}
