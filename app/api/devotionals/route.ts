// API Route for Devotionals CRUD operations
import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Devotional from '@/models/Devotional'
import sarvdev from '@/data/sarvdev'
import { AUTH_COOKIE_NAME, verifyToken } from '@/lib/auth'
import {
  categoryNameToSlug,
  categorySlugToName,
  getCategoryByName,
  getCategoryBySlug,
} from '@/lib/devotional-categories'
import { buildCursorFilter, paginateCursor, parseCursorLimit, DEVOTIONAL_CARD_PROJ } from '@/lib/cursor-pagination'
import { applyRateLimit } from '@/lib/rate-limit'
import { expandQuery } from '@/lib/transliteration'

export const dynamic = 'force-dynamic'
export const revalidate = 0

// -- In-memory cache (60s TTL) --
let _cache: { data: any[]; ts: number } | null = null
const CACHE_TTL = 60_000
const DEVOTIONAL_IMAGE_FIELDS = ['image', 'imageCard', 'imageHero', 'ogImage', 'thumbnail', 'coverImage'] as const
const ALLOW_REMOTE_FALLBACK = process.env.NODE_ENV === 'production'

function isAdmin(request: NextRequest) {
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value
  if (!token) return false
  const payload = verifyToken(token)
  return payload?.role === 'admin'
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function buildSearchRegex(value: string) {
  const terms = Array.from(new Set([value, ...expandQuery(value)].map((term) => term.trim()).filter(Boolean)))
  const pattern = terms.map(escapeRegex).join('|')
  return new RegExp(pattern || escapeRegex(value), 'i')
}

function buildDevotionalSearchCondition(search: string) {
  const regex = buildSearchRegex(search)
  return {
    $or: [
      { title: regex },
      { titleHi: regex },
      { slug: regex },
      { deity: regex },
      { deityHi: regex },
      { deitySlug: regex },
      { category: regex },
      { categoryHi: regex },
      { categorySlug: regex },
      { tags: regex },
      { aliases: regex },
    ],
  }
}

function normalizeForScore(value: unknown) {
  return String(value || '').toLowerCase().trim().replace(/[-_]+/g, ' ').replace(/\s+/g, ' ')
}

function valuesForScore(doc: Record<string, any>, field: string): string[] {
  const value = doc[field]
  if (Array.isArray(value)) return value.map(normalizeForScore).filter(Boolean)
  return [normalizeForScore(value)].filter(Boolean)
}

function scoreDevotional(doc: Record<string, any>, query: string) {
  const q = normalizeForScore(query)
  if (!q) return 0
  const weightedFields = [
    ['title', 120],
    ['titleHi', 120],
    ['slug', 110],
    ['deity', 95],
    ['deityHi', 95],
    ['deitySlug', 90],
    ['category', 75],
    ['categoryHi', 75],
    ['categorySlug', 70],
    ['tags', 55],
    ['aliases', 50],
  ] as const

  let best = 0
  for (const [field, weight] of weightedFields) {
    for (const value of valuesForScore(doc, field)) {
      if (value === q) best = Math.max(best, weight + 1000)
      else if (value.startsWith(q)) best = Math.max(best, weight + 700)
      else if (value.includes(q)) best = Math.max(best, weight + 400)
    }
  }
  return best
}

function sortDevotionalSearchResults(items: any[], search: string) {
  return [...items].sort((a, b) => {
    const scoreDiff = scoreDevotional(b, search) - scoreDevotional(a, search)
    if (scoreDiff !== 0) return scoreDiff
    return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
  })
}

function countsFromAggregation(rows: { _id: unknown; count: number }[]) {
  const counts: Record<string, number> = {}
  for (const row of rows) {
    const key = String(row._id || '').trim()
    if (key) counts[key] = Number(row.count || 0)
  }
  return counts
}

async function getAdminDevotionalFacets() {
  const [categoryRows, statusRows, languageRows, deityRows, totalAll, withAudio, withLyrics] = await Promise.all([
    Devotional.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }]),
    Devotional.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    Devotional.aggregate([{ $group: { _id: '$language', count: { $sum: 1 } } }]),
    Devotional.aggregate([{ $group: { _id: '$deity', count: { $sum: 1 } } }]),
    Devotional.countDocuments({}),
    Devotional.countDocuments({ $or: [{ audio: { $exists: true, $ne: '' } }, { audioUrl: { $exists: true, $ne: '' } }] }),
    Devotional.countDocuments({ lyrics: { $exists: true, $ne: '' } }),
  ])

  return {
    totalAll,
    withAudio,
    withLyrics,
    categories: countsFromAggregation(categoryRows),
    statuses: countsFromAggregation(statusRows),
    languages: countsFromAggregation(languageRows),
    deities: countsFromAggregation(deityRows),
  }
}

function removeDevotionalImageFields<T extends Record<string, any>>(input: T): T {
  const output = { ...input }
  for (const field of DEVOTIONAL_IMAGE_FIELDS) {
    delete output[field]
  }
  return output
}

// Slug generation — stable, extracted from English text in parens if present
function createApiDevotionalSlug(value: string) {
  const englishMatch = value.match(/\(([^)]+)\)/)
  const text = englishMatch ? englishMatch[1] : value
  const slug = text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
  return slug || value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    || 'devotional'
}

function prepareFallbackList(items: any[]) {
  return (items || []).map((d: any) => ({
    _id: d.id || d._id || Math.random().toString(36).slice(2),
    title: d.title,
    description: d.description,
    audio: d.audio,
    category: d.category,
    language: d.language,
    deity: d.deity,
    status: 'approved',
  }))
}

const DEVOTIONALS_CACHE_CC = 'public, s-maxage=120, stale-while-revalidate=300'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const singleId = searchParams.get('id')
    const slug = searchParams.get('slug')

    // -- Single devotional fetch by ID (WITH lyrics for detail page) --
    if (singleId) {
      await connectDB()
      const doc = await Devotional.findById(singleId, { __v: 0 }).lean()
      if (doc) return NextResponse.json(removeDevotionalImageFields(doc as any))
      return NextResponse.json(null, { status: 404 })
    }

    // -- Single devotional fetch by slug --
    if (slug) {
      await connectDB()
      let doc: any = null
      if (/^[a-f0-9]{24}$/i.test(slug)) {
        doc = await Devotional.findById(slug, { __v: 0 }).lean()
      }
      if (!doc) {
        // Direct slug field lookup first (O(1) with index)
        const normalizedSlug = createApiDevotionalSlug(slug)
        doc = await Devotional.findOne(
          { slug: normalizedSlug, status: { $ne: 'rejected' } },
          { __v: 0 }
        ).lean()
      }
      if (!doc) {
        // Fallback: title regex scan capped at 10 candidates
        const normalizedSlug = createApiDevotionalSlug(slug)
        const titlePattern = normalizedSlug.replace(/-/g, '[\\s\\-]+')
        const candidates = await Devotional.find(
          { title: { $regex: new RegExp(titlePattern, 'i') }, status: { $ne: 'rejected' } },
          { __v: 0 }
        ).limit(10).lean()
        doc = candidates.find((item: any) => createApiDevotionalSlug(item.title || '') === normalizedSlug) || null

        // Last resort: check in-memory listing cache
        if (!doc && _cache) {
          const cachedMatch = _cache.data.find(
            (item: any) => createApiDevotionalSlug(item.title || '') === normalizedSlug
          )
          if (cachedMatch?._id) {
            doc = await Devotional.findById(cachedMatch._id, { __v: 0 }).lean()
          }
        }
      }
      if (doc) return NextResponse.json(removeDevotionalImageFields(doc as any))
      return NextResponse.json(null, { status: 404 })
    }

    // Rate limit public list requests
    const limited = applyRateLimit(request, 'devotionals')
    if (limited) return limited

    // -- List mode --
    const pageParam    = searchParams.get('page')
    const limitParam   = searchParams.get('limit')
    const adminRequest = isAdmin(request)
    const search       = searchParams.get('search') || searchParams.get('q') || ''
    const category     = searchParams.get('category') || ''
    const categorySlugParam = searchParams.get('categorySlug') || ''
    const deity        = searchParams.get('deity') || ''
    const deitySlugParam    = searchParams.get('deitySlug') || ''
    const status       = searchParams.get('status') || ''
    const language     = searchParams.get('language') || ''
    const featuredParam = searchParams.get('featured') || ''
    const sortParam    = searchParams.get('sort') || 'newest'
    const includeFacets = searchParams.get('includeFacets') === '1' || searchParams.get('facets') === '1'

    await connectDB()

    // Build filter using $and to allow multiple independent conditions
    const conditions: any[] = []

    // Category filter — prefer canonical categorySlug, fall back to category name
    if (categorySlugParam) {
      const catName = getCategoryBySlug(categorySlugParam)?.id
      const catOr: any[] = [{ categorySlug: categorySlugParam }]
      if (catName) catOr.push({ category: catName })
      if (categorySlugParam === 'namavali') catOr.push({ category: '108 Namavali' })
      conditions.push(catOr.length === 1 ? catOr[0] : { $or: catOr })
    } else if (category) {
      const catSlug = categoryNameToSlug(category)
      const catOr: any[] = [{ category }]
      if (catSlug) catOr.push({ categorySlug: catSlug })
      if (category.toLowerCase() === 'namavali') catOr.push({ category: '108 Namavali' })
      conditions.push({ $or: catOr })
    }

    // Deity filter — prefer canonical deitySlug, fall back to deity name regex
    if (deitySlugParam) {
      conditions.push({ $or: [
        { deitySlug: deitySlugParam },
        { deity: { $regex: new RegExp(escapeRegex(deitySlugParam.replace(/-/g, ' ')), 'i') } },
      ]})
    } else if (deity) {
      conditions.push({ deity: { $regex: new RegExp(escapeRegex(deity), 'i') } })
    }

    if (status) {
      conditions.push({ status })
    } else if (!adminRequest) {
      conditions.push({ $or: [{ status: 'approved' }, { status: { $exists: false } }, { status: null }, { status: '' }] })
    }
    if (language) conditions.push({ language })
    if (featuredParam === '1' || featuredParam === 'true') conditions.push({ featured: true })
    if (search)   conditions.push(buildDevotionalSearchCondition(search))

    const filter: Record<string, any> = conditions.length === 0
      ? {}
      : conditions.length === 1
        ? conditions[0]
        : { $and: conditions }

    // Sort order
    const sortOptions: Record<string, any> = {
      newest:        { createdAt: -1 },
      oldest:        { createdAt: 1 },
      az:            { title: 1 },
      za:            { title: -1 },
      featured:      { featured: -1, audio: -1, createdAt: -1 },
      'audio-first': { audio: -1, createdAt: -1 },
    }
    const sort = sortOptions[sortParam] || { createdAt: -1 }

    // -- Cursor-based pagination (scale mode) --
    if (searchParams.has('cursor')) {
      const cursorToken = searchParams.get('cursor') || undefined
      const cursorLimit = parseCursorLimit(searchParams.get('limit'), 20)
      const cursorFilter = buildCursorFilter(cursorToken, filter)
      const docs = await Devotional.find(cursorFilter, DEVOTIONAL_CARD_PROJ)
        .sort({ createdAt: -1, _id: -1 })
        .limit(cursorLimit + 1)
        .lean()
      const result = paginateCursor(docs as any[], cursorLimit)
      return NextResponse.json(result, { headers: { 'Cache-Control': DEVOTIONALS_CACHE_CC } })
    }

    // -- Paginated mode --
    if (pageParam) {
      const page  = Math.max(1, parseInt(pageParam, 10) || 1)
      const limit = Math.min(100, Math.max(1, parseInt(limitParam || '20', 10)))
      const skip  = (page - 1) * limit

      const queryLimit = search ? Math.min(500, Math.max(limit, skip + limit * 4)) : limit
      const [rawItems, total, facets] = await Promise.all([
        Devotional.find(filter, { lyrics: 0, content: 0, __v: 0, updatedAt: 0, descriptionHi: 0 })
          .sort(search ? { createdAt: -1 } : sort)
          .skip(search ? 0 : skip)
          .limit(queryLimit)
          .lean(),
        Devotional.countDocuments(filter),
        includeFacets && adminRequest ? getAdminDevotionalFacets() : Promise.resolve(undefined),
      ])
      const items = search
        ? sortDevotionalSearchResults(rawItems, search).slice(skip, skip + limit)
        : rawItems

      const trimmed = items.map((d: any) => removeDevotionalImageFields({
        ...d,
        description: d.description?.length > 200 ? d.description.slice(0, 200) + '...' : d.description,
      }))

      return NextResponse.json({
        items: trimmed,
        data: trimmed,
        total,
        page,
        pages: Math.ceil(total / limit),
        limit,
        hasMore: page * limit < total,
        ...(facets ? { facets } : {}),
      }, { headers: { 'Cache-Control': adminRequest ? 'private, no-store' : DEVOTIONALS_CACHE_CC } })
    }

    // -- Legacy array mode (backward-compatible, capped) --
    const hasFilters = !!(search || category || categorySlugParam || deity || deitySlugParam || status || language || featuredParam || limitParam)
    if (!hasFilters && _cache && Date.now() - _cache.ts < CACHE_TTL) {
      return NextResponse.json(_cache.data)
    }

    const legacyLimit = Math.min(100, Math.max(1, parseInt(limitParam || '50', 10) || 50))
    const rawDevotionals = await Devotional.find(
      hasFilters ? filter : {},
      { lyrics: 0, content: 0, __v: 0, updatedAt: 0, descriptionHi: 0 }
    ).sort(search ? { createdAt: -1 } : sort).limit(search ? Math.min(500, legacyLimit * 4) : legacyLimit).lean()
    const devotionals = search
      ? sortDevotionalSearchResults(rawDevotionals, search).slice(0, legacyLimit)
      : rawDevotionals

    if (!devotionals || devotionals.length === 0) {
      try {
        if (ALLOW_REMOTE_FALLBACK) {
          const ctrl = new AbortController()
          const timer = setTimeout(() => ctrl.abort(), 1200)
          const liveRes = await fetch('https://sarvdev-temple-live.vercel.app/api/devotionals', { cache: 'no-store', signal: ctrl.signal })
          clearTimeout(timer)
          if (liveRes.ok) {
            const liveData = await liveRes.json()
            const safeLiveData = Array.isArray(liveData)
              ? liveData.map((item: any) => removeDevotionalImageFields(item))
              : liveData
            return NextResponse.json(safeLiveData)
          }
        }
      } catch (_) {}
      return NextResponse.json(prepareFallbackList(sarvdev.devotionals || []))
    }

    const trimmed = devotionals.map((d: any) => removeDevotionalImageFields({
      ...d,
      description: d.description?.length > 200 ? d.description.slice(0, 200) + '...' : d.description,
    }))
    if (!hasFilters) {
      _cache = { data: trimmed, ts: Date.now() }
    }
    return NextResponse.json(trimmed, { headers: { 'Cache-Control': DEVOTIONALS_CACHE_CC } })
  } catch (error) {
    try {
      if (ALLOW_REMOTE_FALLBACK) {
        const ctrl = new AbortController()
        const timer = setTimeout(() => ctrl.abort(), 1200)
        const liveRes = await fetch('https://sarvdev-temple-live.vercel.app/api/devotionals', { cache: 'no-store', signal: ctrl.signal })
        clearTimeout(timer)
        if (liveRes.ok) {
          const liveData = await liveRes.json()
          const safeLiveData = Array.isArray(liveData)
            ? liveData.map((item: any) => removeDevotionalImageFields(item))
            : liveData
          return NextResponse.json(safeLiveData)
        }
      }
    } catch (_) {}
    return NextResponse.json(prepareFallbackList(sarvdev.devotionals || []))
  }
}

export async function POST(request: NextRequest) {
  if (!isAdmin(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    await connectDB()
    const body = await request.json()
    const safe = removeDevotionalImageFields(body)

    // Auto-generate slug from title if not provided
    if (!safe.slug && safe.title) {
      safe.slug = createApiDevotionalSlug(safe.title)
    }

    // Derive canonical category fields if missing
    if (safe.category && !safe.categorySlug) {
      safe.categorySlug = categoryNameToSlug(safe.category)
    }
    if (safe.category && !safe.categoryHi) {
      const cat = getCategoryByName(safe.category)
      if (cat) safe.categoryHi = cat.nameHi
    }

    safe.source = safe.source || 'manual'
    safe.isCustomized = true
    safe.updatedAt = new Date()

    const devotional = await Devotional.create(safe)
    _cache = null
    return NextResponse.json(devotional, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create devotional' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  if (!isAdmin(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    await connectDB()
    const body = await request.json()
    const { id, ...updateData } = body
    const safe = removeDevotionalImageFields(updateData)

    // Preserve existing slug — only update if explicitly provided and non-empty
    if (!safe.slug) delete safe.slug

    // Derive canonical category fields when category changes
    if (safe.category && !safe.categorySlug) {
      safe.categorySlug = categoryNameToSlug(safe.category)
    }
    if (safe.category && !safe.categoryHi) {
      const cat = getCategoryByName(safe.category)
      if (cat) safe.categoryHi = cat.nameHi
    }

    safe.isCustomized = true
    safe.updatedAt = new Date()

    const devotional = await Devotional.findByIdAndUpdate(
      id,
      safe,
      { new: true, runValidators: true }
    )
    if (!devotional) {
      return NextResponse.json({ error: 'Devotional not found' }, { status: 404 })
    }
    _cache = null
    return NextResponse.json(devotional)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update devotional' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  if (!isAdmin(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    await connectDB()
    const body = await request.json()
    const { id } = body
    const devotional = await Devotional.findByIdAndDelete(id)
    if (!devotional) {
      return NextResponse.json({ error: 'Devotional not found' }, { status: 404 })
    }
    _cache = null
    return NextResponse.json({ message: 'Devotional deleted successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete devotional' }, { status: 500 })
  }
}
