// API Route for Devotionals CRUD operations
import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Devotional from '@/models/Devotional'
import sarvdev from '@/data/sarvdev'

export async function GET() {
  try {
    await connectDB()
    const devotionals = await Devotional.find({}).sort({ createdAt: -1 })
    // If DB has no devotionals, fall back to local data (useful for dev/local)
    if (!devotionals || devotionals.length === 0) {
      // First try fetching from live API to mirror production content locally
      try {
        const liveRes = await fetch('https://sarvdev-temple-live.vercel.app/api/devotionals', { cache: 'no-store' })
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
    return NextResponse.json(devotionals)
  } catch (error) {
    // On DB error, try live API first, then local static data
    try {
      const liveRes = await fetch('https://sarvdev-temple-live.vercel.app/api/devotionals', { cache: 'no-store' })
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
    
    return NextResponse.json({ message: 'Devotional deleted successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete devotional' }, { status: 500 })
  }
}
