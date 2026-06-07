// API Route for Devotionals CRUD operations
import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Devotional from '@/models/Devotional'
import sarvdev from '@/data/sarvdev'
import { AUTH_COOKIE_NAME, verifyToken } from '@/lib/auth'

// ─── In-memory cache (60s TTL) ───
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

function removeDevotionalImageFields<T extends Record<string, any>>(input: T): T {
  const output = { ...input }
  for (const field of DEVOTIONAL_IMAGE_FIELDS) {
    delete output[field]
  }
  return output
}

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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const singleId = searchParams.get('id')
    const slug = searchParams.get('slug')

    // ─── Single devotional fetch (WITH lyrics for detail page) ───
    if (singleId) {
      await connectDB()
      const doc = await Devotional.findById(singleId, { __v: 0 }).lean()
      if (doc) return NextResponse.json(removeDevotionalImageFields(doc as any))
      return NextResponse.json(null, { status: 404 })
    }

    if (slug) {
      await connectDB()
      let doc: any = null
      if (/^[a-f0-9]{24}$/i.test(slug)) {
        doc = await Devotional.findById(slug, { __v: 0 }).lean()
      }
      if (!doc) {
        const normalizedSlug = createApiDevotionalSlug(slug)
        // Convert slug back to a title regex to avoid a full-collection scan.
        // "om-namah-shivaya" → /om[\s\-]+namah[\s\-]+shivaya/i — matches ≤10 docs.
        const titlePattern = normalizedSlug.replace(/-/g, '[\\s\\-]+')
        const candidates = await Devotional.find(
          { title: { $regex: new RegExp(titlePattern, 'i') }, status: { $ne: 'rejected' } },
          { __v: 0 }
        ).limit(10).lean()
        doc = candidates.find((item: any) => createApiDevotionalSlug(item.title || '') === normalizedSlug) || null

        // Fallback: check in-memory listing cache (zero extra DB hit)
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

    const pageParam = searchParams.get('page')
    const limitParam = searchParams.get('limit')
    const search = searchParams.get('search') || searchParams.get('q') || ''
    const category = searchParams.get('category') || ''
    const deity = searchParams.get('deity') || ''
    const status = searchParams.get('status') || ''

    await connectDB()

    // Build filter
    const filter: Record<string, any> = {}
    if (category) filter.category = category
    if (deity) filter.deity = { $regex: new RegExp(escapeRegex(deity), 'i') }
    if (status) filter.status = status
    if (search) filter.$text = { $search: search }

    // ─── Paginated mode ───
    if (pageParam) {
      const page = Math.max(1, parseInt(pageParam, 10) || 1)
      const limit = Math.min(100, Math.max(1, parseInt(limitParam || '20', 10)))
      const skip = (page - 1) * limit

      const [items, total] = await Promise.all([
        Devotional.find(filter, { lyrics: 0, __v: 0, updatedAt: 0 })
          .sort(search ? { score: { $meta: 'textScore' }, createdAt: -1 } : { createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        Devotional.countDocuments(filter),
      ])

      const trimmed = items.map((d: any) => removeDevotionalImageFields({
        ...d,
        description: d.description?.length > 200 ? d.description.slice(0, 200) + '…' : d.description,
      }))

      return NextResponse.json({ items: trimmed, total, page, pages: Math.ceil(total / limit), limit })
    }

    // ─── Legacy mode (returns all) ───
    if (_cache && !search && !category && !deity && !status && !limitParam && Date.now() - _cache.ts < CACHE_TTL) {
      return NextResponse.json(_cache.data)
    }

    let query = Devotional.find(
      search || category || deity || status ? filter : {},
      { lyrics: 0, __v: 0, updatedAt: 0, descriptionHi: 0 }
    ).sort({ createdAt: -1 })

    if (limitParam) {
      const limit = Math.min(100, Math.max(1, parseInt(limitParam, 10) || 20))
      query = query.limit(limit)
    }

    const devotionals = await query.lean()

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
      description: d.description?.length > 200 ? d.description.slice(0, 200) + '…' : d.description,
    }))
    if (!search && !category && !deity && !status && !limitParam) {
      _cache = { data: trimmed, ts: Date.now() }
    }
    return NextResponse.json(trimmed)
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
    const devotional = await Devotional.create(removeDevotionalImageFields(body))
    _cache = null // invalidate listing cache
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
    const safeUpdateData = removeDevotionalImageFields(updateData)
    
    const devotional = await Devotional.findByIdAndUpdate(
      id,
      safeUpdateData,
      { new: true, runValidators: true }
    )
    
    if (!devotional) {
      return NextResponse.json({ error: 'Devotional not found' }, { status: 404 })
    }
    
    _cache = null // invalidate listing cache
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
    
    _cache = null // invalidate listing cache
    return NextResponse.json({ message: 'Devotional deleted successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete devotional' }, { status: 500 })
  }
}
