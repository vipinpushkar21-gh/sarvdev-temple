import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Event from '@/models/Event'
import { AUTH_COOKIE_NAME, verifyToken } from '@/lib/auth'
import { eventToPlain, normalizeEventStatus, slugifyEvent } from '@/lib/events'

function isAdmin(req: NextRequest) {
  const token = req.cookies.get(AUTH_COOKIE_NAME)?.value
  const payload = token ? verifyToken(token) : null
  return payload?.role === 'admin'
}

function normalizePayload(payload: Record<string, any>) {
  const startDate = payload.startDate || payload.date
  return {
    ...payload,
    slug: payload.slug || slugifyEvent(payload.title || 'event', startDate),
    date: startDate,
    startDate,
    endDate: payload.endDate || startDate,
    status: normalizeEventStatus(payload.status),
    rituals: Array.isArray(payload.rituals) ? payload.rituals : String(payload.rituals || '').split(/\r?\n|,/).map((x) => x.trim()).filter(Boolean),
    ritualsHi: Array.isArray(payload.ritualsHi) ? payload.ritualsHi : String(payload.ritualsHi || '').split(/\r?\n|,/).map((x) => x.trim()).filter(Boolean),
    relatedTempleIds: Array.isArray(payload.relatedTempleIds) ? payload.relatedTempleIds : [],
    relatedDeityIds: Array.isArray(payload.relatedDeityIds) ? payload.relatedDeityIds : [],
    relatedDevotionalSlugs: Array.isArray(payload.relatedDevotionalSlugs) ? payload.relatedDevotionalSlugs : String(payload.relatedDevotionalSlugs || '').split(/\r?\n|,/).map((x) => x.trim()).filter(Boolean),
    galleryImages: Array.isArray(payload.galleryImages) ? payload.galleryImages : String(payload.galleryImages || '').split(/\r?\n|,/).map((x) => x.trim()).filter(Boolean),
    updatedAt: new Date(),
  }
}

export async function GET(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await connectDB()
  const { searchParams } = new URL(req.url)
  const pageParam = searchParams.get('page')
  const limitParam = searchParams.get('limit')
  const limit = Math.min(100, Math.max(1, parseInt(limitParam || '50', 10) || 50))
  const filter: Record<string, any> = {}
  const q = searchParams.get('search') || searchParams.get('q')
  const status = searchParams.get('status')
  const category = searchParams.get('category')
  const city = searchParams.get('city')
  if (status) filter.status = status
  if (category) filter.category = category
  if (city) {
    const regex = new RegExp(city.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')
    filter.$or = [{ city: regex }, { state: regex }, { locationName: regex }, { location: regex }]
  }
  if (q?.trim()) {
    const regex = new RegExp(q.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')
    const searchOr = [
      { title: regex },
      { titleHi: regex },
      { festival: regex },
      { category: regex },
      { location: regex },
      { state: regex },
    ]
    if (filter.$or) filter.$and = [{ $or: filter.$or }, { $or: searchOr }]
    else filter.$or = searchOr
  }

  if (pageParam) {
    const page = Math.max(1, parseInt(pageParam, 10) || 1)
    const skip = (page - 1) * limit
    const [events, total] = await Promise.all([
      Event.find(filter, { __v: 0 }).sort({ startDate: 1, date: 1 }).skip(skip).limit(limit).lean(),
      Event.countDocuments(filter),
    ])
    return NextResponse.json({
      items: events.map(eventToPlain),
      data: events.map(eventToPlain),
      total,
      page,
      pages: Math.ceil(total / limit),
      limit,
      hasMore: page * limit < total,
    })
  }

  const events = await Event.find(filter, { __v: 0 }).sort({ startDate: 1, date: 1 }).limit(limit).lean()
  return NextResponse.json(events.map(eventToPlain))
}

export async function POST(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await connectDB()
  const payload = normalizePayload(await req.json())
  const event = await Event.create(payload)
  return NextResponse.json(eventToPlain(event), { status: 201 })
}
