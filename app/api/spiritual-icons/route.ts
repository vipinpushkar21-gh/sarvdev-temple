import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { normalizeSpiritualIcon, resolveSpiritualIconCategorySlug } from '@/lib/spiritual-icons'
import SpiritualIcon from '@/models/SpiritualIcon'
import { buildCursorFilter, paginateCursor, parseCursorLimit, SPIRITUAL_ICON_CARD_PROJ } from '@/lib/cursor-pagination'

let cache: { data: any[]; ts: number } | null = null
const CACHE_TTL = 60_000
const DEFAULT_LIMIT = 30
const MAX_LIMIT = 100

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function toPositiveInt(value: string | null, fallback: number, max: number) {
  const parsed = parseInt(value || '', 10)
  if (!Number.isFinite(parsed) || parsed < 1) return fallback
  return Math.min(max, parsed)
}

function buildPublicFilter(searchParams: URLSearchParams) {
  const filter: Record<string, any> = { status: 'active' }
  const category = searchParams.get('category')
  const state = searchParams.get('state')
  const language = searchParams.get('language')
  const featured = searchParams.get('featured')
  const slug = searchParams.get('slug')
  const q = searchParams.get('search') || searchParams.get('q')

  if (slug) filter.slug = slug
  if (category) filter.categorySlug = resolveSpiritualIconCategorySlug(category)
  if (state) filter.state = state
  if (language) filter.languages = new RegExp(`^${escapeRegex(language.trim())}$`, 'i')
  if (featured === 'true') filter.featured = true
  if (q?.trim()) {
    const regex = new RegExp(escapeRegex(q.trim()), 'i')
    filter.$or = [
      { name: regex },
      { nameHi: regex },
      { title: regex },
      { category: regex },
      { city: regex },
      { state: regex },
      { location: regex },
      { specializations: regex },
      { notableWorks: regex },
      { languages: regex },
    ]
  }

  return filter
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const pageParam = searchParams.get('page')
    const limit = toPositiveInt(searchParams.get('limit'), DEFAULT_LIMIT, MAX_LIMIT)
    const hasFilters = ['category', 'state', 'language', 'featured', 'slug', 'search', 'q']
      .some((key) => Boolean(searchParams.get(key)))
    await connectDB()

    // ── Cursor-based pagination (scale mode) ──
    if (searchParams.has('cursor')) {
      const cursorToken = searchParams.get('cursor') || undefined
      const cursorLimit = parseCursorLimit(searchParams.get('limit'), DEFAULT_LIMIT)
      const cursorFilter = buildCursorFilter(cursorToken, buildPublicFilter(searchParams))
      const docs = await SpiritualIcon.find(cursorFilter, SPIRITUAL_ICON_CARD_PROJ)
        .sort({ createdAt: -1, _id: -1 })
        .limit(cursorLimit + 1)
        .lean()
      const result = paginateCursor(docs.map(normalizeSpiritualIcon) as any[], cursorLimit)
      return NextResponse.json(result, { headers: { 'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=1200' } })
    }

    let records: any[]
    if (pageParam) {
      const page = toPositiveInt(pageParam, 1, Number.MAX_SAFE_INTEGER)
      const skip = (page - 1) * limit
      const filter = buildPublicFilter(searchParams)
      const [items, total] = await Promise.all([
        SpiritualIcon.find(filter, { __v: 0 }).sort({ featured: -1, priority: 1, name: 1 }).skip(skip).limit(limit).lean(),
        SpiritualIcon.countDocuments(filter),
      ])
      records = items
      const normalized = records.map(normalizeSpiritualIcon)
      return NextResponse.json({
        items: normalized,
        data: normalized,
        total,
        page,
        pages: Math.ceil(total / limit),
        limit,
        hasMore: page * limit < total,
      }, { headers: { 'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=1200' } })
    }

    if (!hasFilters && cache && Date.now() - cache.ts < CACHE_TTL) {
      records = cache.data
    } else {
      records = await SpiritualIcon.find(buildPublicFilter(searchParams), { __v: 0 })
        .sort({ featured: -1, priority: 1, name: 1 })
        .limit(limit)
        .lean()
      if (!hasFilters) cache = { data: records, ts: Date.now() }
    }

    const normalized = records.map(normalizeSpiritualIcon)
    return NextResponse.json(normalized, { headers: { 'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=1200' } })
  } catch (error) {
    return NextResponse.json({ error: 'Unable to load Spiritual Icons.' }, { status: 503 })
  }
}
