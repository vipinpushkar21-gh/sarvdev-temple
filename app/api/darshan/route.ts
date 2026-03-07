import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Darshan from '@/models/Darshan';

// ─── In-memory cache (60s TTL) ───
let _cache: { data: any[]; ts: number } | null = null;
const CACHE_TTL = 60_000;

// GET all darshan
export async function GET() {
  try {
    if (_cache && Date.now() - _cache.ts < CACHE_TTL) {
      return NextResponse.json(_cache.data);
    }
    await connectDB();
    const darshan = await Darshan.find({}, { __v: 0 }).sort({ createdAt: -1 }).lean();
    _cache = { data: darshan, ts: Date.now() };
    return NextResponse.json(darshan);
  } catch (error) {
    console.error('Darshan API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch darshan' }, { status: 500 });
  }
}

// POST create new darshan
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const data = await req.json();
    const darshan = await Darshan.create(data);
    _cache = null;
    return NextResponse.json(darshan, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create darshan' }, { status: 500 });
  }
}

// PUT update darshan
export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const { id, ...update } = await req.json();
    const darshan = await Darshan.findByIdAndUpdate(id, update, { new: true });
    if (!darshan) {
      return NextResponse.json({ error: 'Darshan not found' }, { status: 404 });
    }
    _cache = null;
    return NextResponse.json(darshan);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update darshan' }, { status: 500 });
  }
}

// DELETE darshan
export async function DELETE(req: NextRequest) {
  try {
    await connectDB();
    const { id } = await req.json();
    const darshan = await Darshan.findByIdAndDelete(id);
    if (!darshan) {
      return NextResponse.json({ error: 'Darshan not found' }, { status: 404 });
    }
    _cache = null;
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete darshan' }, { status: 500 });
  }
}
