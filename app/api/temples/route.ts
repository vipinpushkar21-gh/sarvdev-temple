import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Temple from '@/models/Temple';
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
    const temples = await Temple.find({}, { descriptionHi: 0, __v: 0 }).sort({ createdAt: -1 }).lean();
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
    console.log('API PUT Request - ID:', id);
    console.log('API PUT Request - Update Data:', JSON.stringify(update, null, 2));
    console.log('API PUT Request - DescriptionHi in update:', update.descriptionHi || 'MISSING');
    console.log('API PUT Request - Update Data Keys:', Object.keys(update));
    
    const temple = await Temple.findByIdAndUpdate(id, update, { new: true });
    if (!temple) {
      return NextResponse.json({ error: 'Temple not found' }, { status: 404 });
    }
    
    console.log('API PUT Response - Updated Temple:', JSON.stringify(temple, null, 2));
    console.log('API PUT Response - DescriptionHi in result:', temple.descriptionHi || 'MISSING');
    console.log('API PUT Response - Temple Keys:', Object.keys(temple.toObject()));
    
    // Verify database save
    const verifyTemple = await Temple.findById(id);
    console.log('Database Verification - DescriptionHi:', verifyTemple?.descriptionHi || 'MISSING');
    
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
