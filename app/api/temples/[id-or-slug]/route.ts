import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Temple from '@/models/Temple';
import { AUTH_COOKIE_NAME, verifyToken } from '@/lib/auth';
import { normalizeTempleText, slugifyTemple } from '@/lib/temple-normalization';

type RouteContext = {
  params: Promise<{ 'id-or-slug': string }>;
};

function isAdmin(req: NextRequest): boolean {
  const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;
  if (!token) return false;
  const payload = verifyToken(token);
  return payload?.role === 'admin';
}

function publicTempleFilter() {
  return {
    $or: [
      { status: 'approved' },
      { status: { $exists: false } },
      { status: '' },
      { status: null },
    ],
  };
}

function titleRegexFromSlug(slug: string) {
  const words = slug.split('-').map((word) => word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).filter(Boolean);
  if (words.length === 0) return null;
  return new RegExp(`^${words.join('[\\s\\W]+')}$`, 'i');
}

export async function GET(req: NextRequest, context: RouteContext) {
  try {
    const params = await context.params;
    const key = decodeURIComponent(params['id-or-slug'] || '').trim();
    if (!key) {
      return NextResponse.json({ error: 'Missing temple id or slug' }, { status: 400 });
    }

    const { searchParams } = new URL(req.url);
    const wantsAdminScope =
      searchParams.get('admin') === '1' ||
      searchParams.get('scope') === 'admin' ||
      searchParams.get('fresh') === '1';
    const adminMode = wantsAdminScope && isAdmin(req);
    const slug = slugifyTemple(key);
    const titleFromSlug = normalizeTempleText(key.replace(/-/g, ' '));
    const titleRegex = titleRegexFromSlug(slug);

    const lookup: Record<string, any>[] = [
      { slug: key },
      { slug },
      { titleNormalized: normalizeTempleText(key) },
      { titleNormalized: titleFromSlug },
    ];
    if (titleRegex) lookup.push({ title: titleRegex });

    if (mongoose.Types.ObjectId.isValid(key)) {
      lookup.unshift({ _id: key });
    }

    const query = adminMode
      ? { $or: lookup }
      : { $and: [publicTempleFilter(), { $or: lookup }] };

    await connectDB();
    const temple = await Temple.findOne(query, { __v: 0 }).lean();
    if (!temple) {
      return NextResponse.json({ error: 'Temple not found' }, { status: 404 });
    }

    const res = NextResponse.json(temple);
    res.headers.set('Cache-Control', adminMode ? 'no-store, max-age=0' : 'public, s-maxage=120, stale-while-revalidate=300');
    return res;
  } catch (error) {
    console.error('Temple detail API error:', error);
    return NextResponse.json({ error: 'Failed to fetch temple' }, { status: 500 });
  }
}
