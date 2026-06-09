/**
 * GET /api/search
 *
 * Unified global search across all Sarvdev content types.
 *
 * Query params:
 *   q        — search query (required, min 2 chars)
 *   type     — 'all' | 'temple' | 'deity' | 'devotional' | 'blog' | 'event' | 'darshan' | 'spiritualIcon' | 'sacredCategory'
 *   page     — page number (default 1)
 *   limit    — results per content type (default 6, max 20)
 *   state    — filter temples/events by state
 *   city     — filter temples by city
 *   category — filter by category slug
 *   deity    — filter temples/devotionals by deity
 *   language — filter devotionals by language
 *
 * Response includes:
 *   - Structured { results, counts, hasMore }
 *   - Backward-compat flat arrays at top level (temples, devotionals, etc.)
 */

import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Temple from '@/models/Temple'
import Devotional from '@/models/Devotional'
import Blog from '@/models/Blog'
import Event from '@/models/Event'
import Darshan from '@/models/Darshan'
import Deity from '@/models/Deity'
import SpiritualIcon from '@/models/SpiritualIcon'
import SearchLog from '@/models/SearchLog'
import { SACRED_CATEGORIES } from '@/lib/sacred-categories'
import {
  buildRegex,
  clamp,
  emptySearchResponse,
  formatBlogResult,
  formatDarshanResult,
  formatDeityResult,
  formatDevotionalResult,
  formatEventResult,
  formatSacredCategoryResult,
  formatSpiritualIconResult,
  formatTempleResult,
  normalizeQuery,
  type SearchResult,
} from '@/lib/search'
import { expandQuery, buildExpandedRegex, rankByRelevance } from '@/lib/transliteration'
import { applyRateLimit } from '@/lib/rate-limit'
import { ACTIVE_PROVIDER_NAME } from '@/lib/search-providers'

const DEFAULT_LIMIT = 6
const MAX_LIMIT = 20
const HARD_CAP = 20   // never return more than this per type even with high limit

/**
 * Text search with automatic fallback to regex when no text index exists.
 * @param searchFields — text fields to match against in regex fallback (never image/url fields)
 */
async function textWithFallback<T>(
  model: any,
  q: string,
  extraFilter: Record<string, any>,
  projection: Record<string, unknown>,
  searchFields: string[],
  sortOverride?: Record<string, any>,
  limit = DEFAULT_LIMIT,
  expandedTerms?: string[]
): Promise<T[]> {
  const terms = expandedTerms && expandedTerms.length > 0 ? expandedTerms : [q]
  const expandedRegex = terms.length > 1 ? buildExpandedRegex(terms) : buildRegex(q)
  // For $text: join all terms with space — MongoDB treats this as OR
  const textSearch = terms.join(' ')
  try {
    const docs = await model
      .find(
        { $text: { $search: textSearch }, ...extraFilter },
        { ...projection, score: { $meta: 'textScore' } }
      )
      .sort(sortOverride ?? { score: { $meta: 'textScore' } })
      .limit(limit)
      .lean()
    if ((docs as any[]).length > 0) return docs as T[]
    throw new Error('empty')
  } catch {
    const orQuery = searchFields.map((field) => ({ [field]: expandedRegex }))
    return model
      .find({ $or: orQuery, ...extraFilter }, projection)
      .sort(sortOverride ?? { _id: -1 })
      .limit(limit)
      .lean() as Promise<T[]>
  }
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const sp = url.searchParams

  const limited = applyRateLimit(req, 'search')
  if (limited) return limited

  const q = sp.get('q')?.trim() ?? ''
  if (q.length < 2) {
    return NextResponse.json(emptySearchResponse(q))
  }

  const type    = sp.get('type')?.trim() || 'all'
  const page    = Math.max(1, parseInt(sp.get('page') || '1', 10) || 1)
  const limit   = clamp(parseInt(sp.get('limit') || String(DEFAULT_LIMIT), 10) || DEFAULT_LIMIT, 1, MAX_LIMIT)
  const cap     = Math.min(limit, HARD_CAP)
  const skip    = (page - 1) * cap
  const state   = sp.get('state')?.trim()
  const city    = sp.get('city')?.trim()
  const cat     = sp.get('category')?.trim()
  const deity   = sp.get('deity')?.trim()
  const lang    = sp.get('language')?.trim()

  const wantAll = type === 'all'
  const wants = (t: string) => wantAll || type === t

  const regex = buildRegex(q)
  const expandedTerms = expandQuery(q)
  const t0 = Date.now()

  try {
    await connectDB()

    const proj = <T extends string>(fields: T[]) =>
      Object.fromEntries(fields.map((f) => [f, 1])) as Record<T, 1>

    // ── Temples ───────────────────────────────────────────────────────────────
    let temples: SearchResult[] = []
    if (wants('temple')) {
      const extraFilter: Record<string, any> = { status: { $ne: 'rejected' } }
      if (state) extraFilter.$or = [{ state: buildRegex(state) }, { stateNormalized: state.toLowerCase().replace(/\s+/g, '-') }]
      if (city)  extraFilter.city = buildRegex(city)
      if (deity) extraFilter.$or  = [...(extraFilter.$or ?? []), { deity: buildRegex(deity) }, { deitySlug: deity.toLowerCase().replace(/\s+/g, '-') }]

      const rawTemples: any[] = await textWithFallback(
        Temple, q,
        extraFilter,
        proj(['title', 'titleHi', 'slug', 'image', 'imageCard', 'shortDescription', 'location', 'city', 'state', 'deity']),
        ['title', 'titleHi', 'location', 'city', 'state', 'deity', 'speciality', 'titleNormalized'],
        undefined, cap + skip, expandedTerms
      )
      temples = rankByRelevance(rawTemples, q, ['title', 'titleHi', 'deity']).slice(skip, skip + cap).map(formatTempleResult)
    }

    // ── Deities ───────────────────────────────────────────────────────────────
    let deities: SearchResult[] = []
    if (wants('deity')) {
      const deityFilter: Record<string, any> = { status: { $ne: 'rejected' } }
      if (cat) deityFilter.categorySlug = cat

      const rawDeities: any[] = await textWithFallback(
        Deity, q,
        deityFilter,
        proj(['name', 'nameHi', 'slug', 'image', 'imageCard', 'description', 'categoryName', 'category']),
        ['name', 'nameHi', 'description', 'categoryName', 'category', 'aliases', 'slug'],
        undefined, cap + skip, expandedTerms
      )
      deities = rankByRelevance(rawDeities, q, ['name', 'nameHi']).slice(skip, skip + cap).map(formatDeityResult)
    }

    // ── Devotionals ───────────────────────────────────────────────────────────
    let devotionals: SearchResult[] = []
    if (wants('devotional')) {
      const devFilter: Record<string, any> = {}
      if (cat)   devFilter.categorySlug = cat
      if (deity) devFilter.$or = [{ deitySlug: deity }, { deity: buildRegex(deity) }]
      if (lang)  devFilter.language = buildRegex(lang)

      const rawDevs: any[] = await textWithFallback(
        Devotional, q,
        devFilter,
        proj(['title', 'titleHi', 'slug', 'image', 'imageCard', 'category', 'deity']),
        ['title', 'titleHi', 'category', 'deity', 'slug', 'categorySlug', 'tags'],
        undefined, cap + skip, expandedTerms
      )
      devotionals = rankByRelevance(rawDevs, q, ['title', 'titleHi', 'deity']).slice(skip, skip + cap).map(formatDevotionalResult)
    }

    // ── Blogs ─────────────────────────────────────────────────────────────────
    let blogs: SearchResult[] = []
    if (wants('blog')) {
      const blogFilter: Record<string, any> = { status: 'published' }
      if (cat) blogFilter.category = buildRegex(cat)

      const rawBlogs: any[] = await textWithFallback(
        Blog, q,
        blogFilter,
        proj(['title', 'titleHi', 'slug', 'image', 'imageCard', 'excerpt', 'category']),
        ['title', 'titleHi', 'excerpt', 'category', 'slug', 'tags'],
        undefined, cap + skip, expandedTerms
      )
      blogs = rankByRelevance(rawBlogs, q, ['title', 'titleHi']).slice(skip, skip + cap).map(formatBlogResult)
    }

    // ── Events ────────────────────────────────────────────────────────────────
    let events: SearchResult[] = []
    if (wants('event')) {
      const eventFilter: Record<string, any> = { status: { $in: ['approved', 'published', 'active'] } }
      if (state) eventFilter.state = buildRegex(state)
      if (city)  eventFilter.city  = buildRegex(city)
      if (deity) eventFilter.deity = buildRegex(deity)

      const rawEvents: any[] = await textWithFallback(
        Event, q,
        eventFilter,
        proj(['title', 'titleHi', 'slug', 'image', 'imageCard', 'description', 'category', 'city', 'state']),
        ['title', 'titleHi', 'description', 'category', 'city', 'state', 'deity'],
        undefined, cap + skip, expandedTerms
      )
      events = rankByRelevance(rawEvents, q, ['title', 'titleHi']).slice(skip, skip + cap).map(formatEventResult)
    }

    // ── Darshan ───────────────────────────────────────────────────────────────
    let darshan: SearchResult[] = []
    if (wants('darshan')) {
      const darshanFilter: Record<string, any> = {}
      if (state) darshanFilter.state = buildRegex(state)

      const rawDarshan: any[] = await textWithFallback(
        Darshan, q,
        darshanFilter,
        proj(['title', 'slug', 'image', 'imageCard', 'thumbnail', 'temple', 'location', 'city', 'state']),
        ['title', 'temple', 'location', 'city', 'state'],
        undefined, cap + skip, expandedTerms
      )
      darshan = rankByRelevance(rawDarshan, q, ['title', 'temple']).slice(skip, skip + cap).map(formatDarshanResult)
    }

    // ── Spiritual Icons ───────────────────────────────────────────────────────
    let spiritualIcons: SearchResult[] = []
    if (wants('spiritualIcon')) {
      const iconFilter: Record<string, any> = { status: 'active' }
      if (cat)   iconFilter.categorySlug = cat
      if (state) iconFilter.state = buildRegex(state)

      const rawIcons: any[] = await textWithFallback(
        SpiritualIcon, q,
        iconFilter,
        proj(['name', 'nameHi', 'slug', 'image', 'imageCard', 'shortBio', 'category', 'city', 'location']),
        ['name', 'nameHi', 'shortBio', 'category', 'city', 'location', 'slug'],
        undefined, cap + skip, expandedTerms
      )
      spiritualIcons = rankByRelevance(rawIcons, q, ['name', 'nameHi']).slice(skip, skip + cap).map(formatSpiritualIconResult)
    }

    // ── Sacred Categories (static data — no DB) ───────────────────────────────
    let sacredCategories: SearchResult[] = []
    if (wants('sacredCategory')) {
      const ql = q.toLowerCase()
      const matches = SACRED_CATEGORIES.filter(
        (c) =>
          c.isActive &&
          (c.name.toLowerCase().includes(ql) ||
           c.nameHi.includes(q) ||
           c.slug.includes(ql.replace(/\s+/g, '-')))
      ).slice(skip, skip + cap)
      sacredCategories = matches.map((c) => formatSacredCategoryResult({
        slug: c.slug, name: c.name, nameHi: c.nameHi,
        description: (c as any).description,
        pilgrimage: (c as any).pilgrimage ?? (c as any).isPilgrimage,
      }))
    }

    // ── Assemble response ─────────────────────────────────────────────────────
    const results = { temples, deities, devotionals, blogs, events, darshan, spiritualIcons, sacredCategories }
    const counts = {
      temples: temples.length,
      deities: deities.length,
      devotionals: devotionals.length,
      blogs: blogs.length,
      events: events.length,
      darshan: darshan.length,
      spiritualIcons: spiritualIcons.length,
      sacredCategories: sacredCategories.length,
    }
    const totalResults = Object.values(counts).reduce((a, b) => a + b, 0)
    const hasMore = totalResults >= cap || page > 1

    const durationMs = Date.now() - t0

    // Fire-and-forget analytics log (server-side impression)
    SearchLog.create({
      query:           q,
      normalizedQuery: normalizeQuery(q),
      provider:        ACTIVE_PROVIDER_NAME,
      type,
      resultCount:     totalResults,
      clickedResult:   null,
      clickedType:     null,
      durationMs,
      timestamp:       new Date(),
    }).catch(() => { /* non-critical — never block the response */ })

    return NextResponse.json({
      // Structured response
      query: q,
      results,
      counts,
      hasMore,
      totalResults,
      provider: ACTIVE_PROVIDER_NAME,
      durationMs,
      // Backward-compat flat arrays (SmartSearch reads these)
      temples,
      deities,
      devotionals,
      blogs,
      events,
      darshan,
      spiritualIcons,
      sacredCategories,
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
        'X-Search-Provider': ACTIVE_PROVIDER_NAME,
      },
    })
  } catch (error: any) {
    console.error('[search] error:', error?.message)
    return NextResponse.json(emptySearchResponse(q))
  }
}
