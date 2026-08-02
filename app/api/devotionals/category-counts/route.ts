import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Devotional from '@/models/Devotional'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    await connectDB()
    const agg = await Devotional.aggregate([
      { $match: { status: { $nin: ['rejected', 'draft', 'pending'] } } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ])
    const counts: Record<string, number> = {}
    for (const item of agg) {
      if (item._id) counts[String(item._id)] = Number(item.count)
    }
    return NextResponse.json(counts, {
      headers: { 'Cache-Control': 'no-store' },
    })
  } catch (err) {
    console.error('[devotionals/category-counts]', err)
    return NextResponse.json({}, { status: 500 })
  }
}
