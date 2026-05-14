import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Deity from '@/models/Deity';
import { verifyToken, AUTH_COOKIE_NAME } from '@/lib/auth';

function isAdmin(req: NextRequest): boolean {
  const token = req.cookies.get(AUTH_COOKIE_NAME)?.value
  if (!token) return false
  const payload = verifyToken(token)
  return payload?.role === 'admin'
}

// ─── In-memory cache (60s TTL) ───
let _cache: { data: any[]; ts: number } | null = null;
const CACHE_TTL = 60_000;

// GET all deities
export async function GET() {
  try {
    if (_cache && Date.now() - _cache.ts < CACHE_TTL) {
      return NextResponse.json(_cache.data);
    }
    await connectDB();
    const deities = await Deity.find({}, { __v: 0 }).sort({ createdAt: -1 }).lean();
    _cache = { data: deities, ts: Date.now() };
    return NextResponse.json(deities);
  } catch (error) {
    console.error('Deity API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch deities' }, { status: 500 });
  }
}

// POST create new deity
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const data = await req.json();
    // Allow public submissions (status defaults to 'pending')
    if (data.status === 'approved' && !isAdmin(req)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const deity = await Deity.create(data);
    _cache = null;
    return NextResponse.json(deity, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create deity' }, { status: 500 });
  }
}

// PUT update deity (admin only)
export async function PUT(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    await connectDB();
    const { id, ...update } = await req.json();
    const deity = await Deity.findByIdAndUpdate(id, { $set: update }, { new: true, strict: false });
    if (!deity) {
      return NextResponse.json({ error: 'Deity not found' }, { status: 404 });
    }
    _cache = null; // Clear cache to force refresh
    return NextResponse.json(deity);
  } catch (error) {
    console.error('Update deity error:', error);
    return NextResponse.json({ error: 'Failed to update deity', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}

// DELETE deity (admin only)
export async function DELETE(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    await connectDB();
    const { id } = await req.json();
    const deity = await Deity.findByIdAndDelete(id);
    if (!deity) {
      return NextResponse.json({ error: 'Deity not found' }, { status: 404 });
    }
    _cache = null;
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete deity' }, { status: 500 });
  }
}
