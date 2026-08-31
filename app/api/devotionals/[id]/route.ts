// GET /api/devotionals/[id]
// Supports both MongoDB ObjectId and stable slug lookup.
import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Devotional from '@/models/Devotional'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await connectDB()

    let devotional: any = null

    // 1. Try direct ObjectId lookup
    if (/^[a-f0-9]{24}$/i.test(id)) {
      devotional = await Devotional.findById(id, { __v: 0 }).lean()
    }

    // 2. Try direct slug field lookup (O(1) with index)
    if (!devotional) {
      devotional = await Devotional.findOne(
        { slug: id, status: { $ne: 'rejected' } },
        { __v: 0 }
      ).lean()
    }

    if (!devotional) {
      return NextResponse.json({ error: 'Devotional not found' }, { status: 404 })
    }

    return NextResponse.json(devotional, {
      headers: { 'Cache-Control': 'private, no-store, max-age=0' },
    })
  } catch (error) {
    console.error('Error fetching devotional:', error)
    return NextResponse.json({ error: 'Failed to fetch devotional' }, { status: 500 })
  }
}