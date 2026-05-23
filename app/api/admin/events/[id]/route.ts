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

function clean(payload: Record<string, any>) {
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
    relatedDevotionalSlugs: Array.isArray(payload.relatedDevotionalSlugs) ? payload.relatedDevotionalSlugs : String(payload.relatedDevotionalSlugs || '').split(/\r?\n|,/).map((x) => x.trim()).filter(Boolean),
    galleryImages: Array.isArray(payload.galleryImages) ? payload.galleryImages : String(payload.galleryImages || '').split(/\r?\n|,/).map((x) => x.trim()).filter(Boolean),
    updatedAt: new Date(),
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  await connectDB()
  const event = await Event.findByIdAndUpdate(id, { $set: clean(await req.json()) }, { new: true })
  if (!event) return NextResponse.json({ error: 'Event not found' }, { status: 404 })
  return NextResponse.json(eventToPlain(event))
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  await connectDB()
  const event = await Event.findByIdAndUpdate(id, { $set: { status: 'archived', updatedAt: new Date() } }, { new: true })
  if (!event) return NextResponse.json({ error: 'Event not found' }, { status: 404 })
  return NextResponse.json(eventToPlain(event))
}
