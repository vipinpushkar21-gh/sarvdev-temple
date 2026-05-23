import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Event from '@/models/Event'
import { eventToPlain } from '@/lib/events'

export const revalidate = 60

function buildPublicFilter(searchParams: URLSearchParams) {
  const filter: Record<string, any> = { status: { $in: ['published', 'approved'] } }
  const category = searchParams.get('category')
  const city = searchParams.get('city')
  const state = searchParams.get('state')
  const deity = searchParams.get('deity')
  const featured = searchParams.get('featured')
  const online = searchParams.get('online')
  const from = searchParams.get('from')
  const to = searchParams.get('to')
  const q = searchParams.get('q') || searchParams.get('search')

  if (category && category !== 'all') filter.category = category
  if (city) filter.city = new RegExp(city, 'i')
  if (state) filter.state = new RegExp(state, 'i')
  if (deity) filter.deityName = new RegExp(deity, 'i')
  if (featured === 'true') filter.featured = true
  if (online === 'true') filter.isOnline = true
  if (from || to) {
    filter.startDate = {}
    if (from) filter.startDate.$gte = from
    if (to) filter.startDate.$lte = to
  }
  if (q) {
    filter.$or = [
      { title: new RegExp(q, 'i') },
      { titleHi: new RegExp(q, 'i') },
      { description: new RegExp(q, 'i') },
      { city: new RegExp(q, 'i') },
      { state: new RegExp(q, 'i') },
      { templeName: new RegExp(q, 'i') },
      { deityName: new RegExp(q, 'i') },
    ]
  }
  return filter
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const pageParam = searchParams.get('page')
    const limitParam = searchParams.get('limit')
    const filter = buildPublicFilter(searchParams)

    await connectDB()

    if (pageParam) {
      const page = Math.max(1, parseInt(pageParam, 10) || 1)
      const limit = Math.min(100, Math.max(1, parseInt(limitParam || '24', 10)))
      const skip = (page - 1) * limit
      const [items, total] = await Promise.all([
        Event.find(filter, { __v: 0 }).sort({ featured: -1, priority: -1, startDate: 1, date: 1 }).skip(skip).limit(limit).lean(),
        Event.countDocuments(filter),
      ])
      return NextResponse.json({ items: items.map(eventToPlain), total, page, pages: Math.ceil(total / limit), limit })
    }

    const events = await Event.find(filter, { __v: 0 }).sort({ featured: -1, priority: -1, startDate: 1, date: 1 }).lean()
    return NextResponse.json(events.map(eventToPlain))
  } catch (error) {
    console.error('Events API Error:', error)
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 })
  }
}
