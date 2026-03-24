import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Temple from '@/models/Temple';
import Event from '@/models/Event';
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

// GET all temples
export async function GET() {
  try {
    if (_cache && Date.now() - _cache.ts < CACHE_TTL) {
      return NextResponse.json(_cache.data);
    }
    await connectDB();
    const temples = await Temple.find({}, { __v: 0 }).sort({ createdAt: -1 }).lean();
    _cache = { data: temples, ts: Date.now() };
    return NextResponse.json(temples);
  } catch (error) {
    console.error('Temple API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch temples' }, { status: 500 });
  }
}

// POST create new temple
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const data = await req.json();
    // Allow public submissions (status defaults to 'pending')
    if (data.status === 'approved' && !isAdmin(req)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const temple = await Temple.create(data);
    _cache = null;
    
    // Auto-create events for each festival
    if (data.festivals && Array.isArray(data.festivals) && data.festivals.length > 0) {
      const eventPromises = data.festivals
        .filter((f: { name: string }) => f.name?.trim())
        .map((festival: { name: string; description: string }) =>
          Event.create({
            title: `${festival.name} — ${temple.title}`,
            description: festival.description || '',
            temple: temple.title,
            location: temple.city ? `${temple.city}, ${temple.state || ''}`.trim().replace(/,\s*$/, '') : (temple.location || ''),
            status: data.status === 'approved' ? 'approved' : 'pending',
          })
        );
      await Promise.allSettled(eventPromises);
    }
    
    return NextResponse.json(temple, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create temple' }, { status: 500 });
  }
}

// PUT update temple (admin only)
export async function PUT(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    await connectDB();
    const { id, ...update } = await req.json();
    const temple = await Temple.findByIdAndUpdate(id, update, { new: true });
    if (!temple) {
      return NextResponse.json({ error: 'Temple not found' }, { status: 404 });
    }
    _cache = null; // Clear cache to force refresh
    return NextResponse.json(temple);
  } catch (error) {
    console.error('Update temple error:', error);
    return NextResponse.json({ error: 'Failed to update temple' }, { status: 500 });
  }
}

// DELETE temple (admin only)
export async function DELETE(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    await connectDB();
    const { id } = await req.json();
    const temple = await Temple.findByIdAndDelete(id);
    if (!temple) {
      return NextResponse.json({ error: 'Temple not found' }, { status: 404 });
    }
    _cache = null;
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete temple' }, { status: 500 });
  }
}
