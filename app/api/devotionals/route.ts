// API Route for Devotionals CRUD operations
import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Devotional from '@/models/Devotional'
import sarvdev from '@/data/sarvdev'

// ─── In-memory cache (60s TTL) ───
let _cache: { data: any[]; ts: number } | null = null
const CACHE_TTL = 60_000

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const singleId = searchParams.get('id')

    // ─── Single devotional fetch (WITH lyrics for detail page) ───
    if (singleId) {
      await connectDB()
      const doc = await Devotional.findById(singleId, { __v: 0 }).lean()
      if (doc) return NextResponse.json(doc)
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

      const trimmed = items.map((d: any) => ({
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
      { lyrics: 0, __v: 0, updatedAt: 0 }
    ).sort({ createdAt: -1 })

    if (limitParam) {
      const limit = Math.min(100, Math.max(1, parseInt(limitParam, 10) || 20))
      query = query.limit(limit)
    }

    const devotionals = await query.lean()

    if (!devotionals || devotionals.length === 0) {
      try {
        const ctrl = new AbortController()
        const timer = setTimeout(() => ctrl.abort(), 3000)
        const liveRes = await fetch('https://sarvdev-temple-live.vercel.app/api/devotionals', { cache: 'no-store', signal: ctrl.signal })
        clearTimeout(timer)
        if (liveRes.ok) {
          const liveData = await liveRes.json()
          return NextResponse.json(liveData)
        }
      } catch (_) {}
      const fallback = (sarvdev.devotionals || []).map((d: any) => ({
        _id: d.id || d._id || Math.random().toString(36).slice(2),
        title: d.title,
        description: d.description,
        audio: d.audio,
        category: d.category,
        language: d.language,
        deity: d.deity,
        status: 'approved',
      }))
      return NextResponse.json(fallback)
    }

    const trimmed = devotionals.map((d: any) => ({
      ...d,
      description: d.description?.length > 200 ? d.description.slice(0, 200) + '…' : d.description,
    }))
    if (!search && !category && !deity && !status && !limitParam) {
      _cache = { data: trimmed, ts: Date.now() }
    }
    return NextResponse.json(trimmed)
  } catch (error) {
    try {
      const ctrl = new AbortController()
      const timer = setTimeout(() => ctrl.abort(), 3000)
      const liveRes = await fetch('https://sarvdev-temple-live.vercel.app/api/devotionals', { cache: 'no-store', signal: ctrl.signal })
      clearTimeout(timer)
      if (liveRes.ok) {
        const liveData = await liveRes.json()
        return NextResponse.json(liveData)
      }
    } catch (_) {}
    const fallback = (sarvdev.devotionals || []).map((d: any) => ({
      _id: d.id || d._id || Math.random().toString(36).slice(2),
      title: d.title,
      description: d.description,
      audio: d.audio,
      category: d.category,
      language: d.language,
      deity: d.deity,
      status: 'approved',
    }))
    return NextResponse.json(fallback)
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    const body = await request.json()
    const devotional = await Devotional.create(body)
    _cache = null // invalidate listing cache
    return NextResponse.json(devotional, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create devotional' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB()
    const body = await request.json()
    const { id, ...updateData } = body
    
    const devotional = await Devotional.findByIdAndUpdate(
      id,
      updateData,
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
