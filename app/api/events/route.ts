import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Event from '@/models/Event';

// ─── In-memory cache (60s TTL) ───
let _cache: { data: any[]; ts: number } | null = null;
const CACHE_TTL = 60_000;

// GET all events
export async function GET() {
  try {
    if (_cache && Date.now() - _cache.ts < CACHE_TTL) {
      return NextResponse.json(_cache.data);
    }
    await connectDB();
    const events = await Event.find({}, { __v: 0 }).sort({ createdAt: -1 }).lean();
    _cache = { data: events, ts: Date.now() };
    return NextResponse.json(events);
  } catch (error) {
    console.error('Events API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}

// POST create new event
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const data = await req.json();
    const event = await Event.create(data);
    _cache = null;
    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
  }
}

// PUT update event
export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const { id, ...update } = await req.json();
    const event = await Event.findByIdAndUpdate(id, update, { new: true });
    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }
    _cache = null;
    return NextResponse.json(event);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update event' }, { status: 500 });
  }
}

// DELETE event
export async function DELETE(req: NextRequest) {
  try {
    await connectDB();
    const { id } = await req.json();
    const event = await Event.findByIdAndDelete(id);
    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }
    _cache = null;
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 });
  }
}
