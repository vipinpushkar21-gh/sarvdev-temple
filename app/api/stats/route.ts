import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Temple from '@/models/Temple';
import Devotional from '@/models/Devotional';

// ─── In-memory cache (5 min TTL for stats) ───
let _cache: { data: any; ts: number } | null = null;
const CACHE_TTL = 300_000;

export async function GET() {
  try {
    if (_cache && Date.now() - _cache.ts < CACHE_TTL) {
      const res = NextResponse.json(_cache.data);
      res.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
      return res;
    }

    await connectDB();

    const [templeCount, devotionalCount, categoryResult] = await Promise.all([
      Temple.countDocuments({ status: 'approved' }),
      Devotional.countDocuments(),
      Temple.distinct('categories', { status: 'approved' }),
    ]);

    const stats = {
      temples: templeCount,
      devotionals: devotionalCount,
      categories: categoryResult.length,
    };

    _cache = { data: stats, ts: Date.now() };
    const res = NextResponse.json(stats);
    res.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
    return res;
  } catch (error) {
    console.error('Stats API Error:', error);
    return NextResponse.json({ temples: 0, devotionals: 0, categories: 0 }, { status: 500 });
  }
}
