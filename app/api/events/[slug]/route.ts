import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Event from '@/models/Event'
import { eventToPlain } from '@/lib/events'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    await connectDB()
    const event = await Event.findOne({
      slug,
      status: { $in: ['published', 'approved'] },
    }, { __v: 0 }).lean()

    if (!event) return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    return NextResponse.json(eventToPlain(event))
  } catch {
    return NextResponse.json({ error: 'Failed to fetch event' }, { status: 500 })
  }
}
