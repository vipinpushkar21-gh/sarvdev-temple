// API Route for Devotionals CRUD operations
import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Devotional from '@/models/Devotional'
import sarvdev from '@/data/sarvdev'

// ─── In-memory cache (60s TTL) ───
let _cache: { data: any[]; ts: number } | null = null
const CACHE_TTL = 60_000

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

    // ─── Listing: Return cached data if fresh ───
    if (_cache && Date.now() - _cache.ts < CACHE_TTL) {
      return NextResponse.json(_cache.data)
    }

    await connectDB()
    const devotionals = await Devotional.find({}, { lyrics: 0, __v: 0, updatedAt: 0 }).sort({ createdAt: -1 }).lean()
    // If DB has no devotionals, fall back to local data (useful for dev/local)
    if (!devotionals || devotionals.length === 0) {
      // First try fetching from live API (with 3s timeout to avoid hanging)
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
      // Fallback to minimal static seed data
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
    // Truncate descriptions for listing (cards show max 2 lines)
    const trimmed = devotionals.map((d: any) => ({
      ...d,
      description: d.description?.length > 200 ? d.description.slice(0, 200) + '…' : d.description,
    }))
    // Store in cache
    _cache = { data: trimmed, ts: Date.now() }
    return NextResponse.json(trimmed)
  } catch (error) {
    // On DB error, try live API first (with 3s timeout), then local static data
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
