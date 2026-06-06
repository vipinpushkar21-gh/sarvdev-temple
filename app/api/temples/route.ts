import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Temple from '@/models/Temple';
import Event from '@/models/Event';
import { verifyToken, AUTH_COOKIE_NAME } from '@/lib/auth';
import { getTemplesForSacredCategory, isShaktiPeethCategory } from '@/data/shakti-peethas';
import { getCategoryBySlug } from '@/lib/sacred-categories';

function isAdmin(req: NextRequest): boolean {
  const token = req.cookies.get(AUTH_COOKIE_NAME)?.value
  if (!token) return false
  const payload = verifyToken(token)
  return payload?.role === 'admin'
}

const SUPPORTED_TEMPLE_FIELDS = [
  // Core
  'title','slug','titleHi','subtitle','subtitleHi','alternateNames','templeTagline','templeTaglineHi',
  'shortDescription','shortDescriptionHi','description','descriptionHi',
  // Media
  'image','imageCard','imageHero','imageGallery','heroImage','images','galleryImages','festivalGallery','architectureGallery',
  'deityGallery','videos','droneShots','ambienceAudio',
  // Location
  'location','locationHi','mapsLink','googleMapsUrl','latitude','longitude',
  'city','cityHi','district','state','stateHi','country','pincode','pincodeHi',
  // Deity & Spiritual
  'deity','mainDeity','secondaryDeities','deityForms','sampradaya','sect','spiritualTradition',
  'sacredImportance','sacredImportanceHi','mythology','mythologyHi',
  'templeLegend','templeLegendHi','sacredMystery','sacredMysteryHi',
  // History & Architecture
  'history','historyHi','architectureStyle','architectureHighlights','templeArea',
  'gopuramCount','mandapamDetails','builtBy','dynasty','renovations',
  // Classification
  'establishedYear','establishedYearHi','templeType','templeTypes',
  'speciality','specialityHi','categories','sacredCategories',
  // Pilgrimage
  'pilgrimageType','pilgrimageCircuit','nearbySacredPlaces','bestSeason','crowdLevel',
  'averageVisitDuration','dressCode','photographyAllowed','prasadamInfo','specialRituals','templeRules',
  // Timings
  'timings','timingSlots',
  // Travel
  'nearestAirport','nearestRailwayStation','nearestBusStand','parkingAvailable',
  'wheelchairAccess','accommodationInfo','localTransport',
  // Festivals
  'festivals',
  // Contact
  'contact','phone','email','website','facebook','instagram',
  // SEO
  'metaTitle','metaDescription','metaKeywords','ogImage','canonicalUrl',
  // Admin/Moderation
  'status','verified','submittedBy','submitterEmail','moderationNotes','reviewedAt',
  'canonicalShaktiPeeth','canonicalShaktiPeethKey','canonicalShaktiPeethName','shaktiPeethMeta'
] as const;

const hasOwn = (value: Record<string, any>, key: string) =>
  Object.prototype.hasOwnProperty.call(value, key);

function pickSupportedTempleFields(data: Record<string, any>) {
  return Object.fromEntries(
    Object.entries(data).filter(([key]) => (SUPPORTED_TEMPLE_FIELDS as readonly string[]).includes(key))
  );
}

function cleanStringArray(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) return undefined;
  return value
    .filter((item): item is string => typeof item === 'string')
    .map((item) => item.trim())
    .filter(Boolean);
}

function timingSlotsFromTimings(value: unknown): string[] | undefined {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  if (!trimmed) return [];
  return trimmed
    .split(/\r?\n|,/)
    .map((slot) => slot.trim())
    .filter(Boolean);
}

function cleanFestivals(value: unknown) {
  if (!Array.isArray(value)) return undefined;
  return value
    .map((festival) => ({
      name: typeof festival?.name === 'string' ? festival.name.trim() : '',
      nameHi: typeof festival?.nameHi === 'string' ? festival.nameHi.trim() : '',
      description: typeof festival?.description === 'string' ? festival.description.trim() : '',
      descriptionHi: typeof festival?.descriptionHi === 'string' ? festival.descriptionHi.trim() : '',
      month: typeof festival?.month === 'string' ? festival.month.trim() : '',
      crowdScale: typeof festival?.crowdScale === 'string' ? festival.crowdScale.trim() : '',
      images: Array.isArray(festival?.images) ? festival.images.filter((i: unknown) => typeof i === 'string') : [],
    }))
    .filter((festival) => festival.name || festival.description);
}

function normalizeTemplePayload(payload: Record<string, any>) {
  const data = { ...payload };

  if (hasOwn(data, 'mapsLink') && !hasOwn(data, 'googleMapsUrl')) {
    data.googleMapsUrl = data.mapsLink;
  } else if (hasOwn(data, 'googleMapsUrl') && !hasOwn(data, 'mapsLink')) {
    data.mapsLink = data.googleMapsUrl;
  }

  const categories = cleanStringArray(data.categories);
  const sacredCategories = cleanStringArray(data.sacredCategories);
  if (categories) data.categories = categories;
  if (sacredCategories) data.sacredCategories = sacredCategories;
  if (hasOwn(data, 'categories') && !hasOwn(data, 'sacredCategories')) {
    data.sacredCategories = data.categories;
  } else if (hasOwn(data, 'sacredCategories') && !hasOwn(data, 'categories')) {
    data.categories = data.sacredCategories;
  } else if (Array.isArray(data.categories) && Array.isArray(data.sacredCategories)) {
    if (data.categories.length === 0 && data.sacredCategories.length > 0) data.categories = data.sacredCategories;
    if (data.sacredCategories.length === 0 && data.categories.length > 0) data.sacredCategories = data.categories;
  }

  const timingSlots = cleanStringArray(data.timingSlots);
  if (timingSlots) data.timingSlots = timingSlots;
  if (hasOwn(data, 'timingSlots') && !hasOwn(data, 'timings')) {
    data.timings = Array.isArray(data.timingSlots) ? data.timingSlots.join(', ') : data.timings;
  } else if (hasOwn(data, 'timings') && !hasOwn(data, 'timingSlots')) {
    data.timingSlots = timingSlotsFromTimings(data.timings);
  } else if (Array.isArray(data.timingSlots) && typeof data.timings === 'string') {
    if (data.timingSlots.length === 0 && data.timings.trim()) data.timingSlots = timingSlotsFromTimings(data.timings);
    if (!data.timings.trim() && data.timingSlots.length > 0) data.timings = data.timingSlots.join(', ');
  }

  const templeTypes = cleanStringArray(data.templeTypes);
  if (templeTypes) data.templeTypes = templeTypes;
  if (hasOwn(data, 'templeTypes') && !hasOwn(data, 'templeType')) {
    data.templeType = Array.isArray(data.templeTypes) ? data.templeTypes[0] || '' : data.templeType;
  } else if (hasOwn(data, 'templeType') && !hasOwn(data, 'templeTypes')) {
    data.templeTypes = typeof data.templeType === 'string' && data.templeType.trim() ? [data.templeType.trim()] : [];
  } else if (Array.isArray(data.templeTypes) && typeof data.templeType === 'string' && !data.templeType.trim() && data.templeTypes.length > 0) {
    data.templeType = data.templeTypes[0];
  }

  const festivals = cleanFestivals(data.festivals);
  if (festivals) data.festivals = festivals;

  return data;
}

// ─── In-memory cache (60s TTL) ───
let _cache: { data: any[]; ts: number } | null = null;
const CACHE_TTL = 60_000;

function slugifyCategory(value: string) {
  return (value || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function getCategoryQueryValues(category: string) {
  const trimmed = category.trim()
  const slug = slugifyCategory(trimmed)
  const canonical = getCategoryBySlug(slug)
  return Array.from(new Set([trimmed, slug, canonical?.name, canonical?.slug].filter(Boolean) as string[]))
}

// GET temples — supports optional pagination via ?page=&limit=&search=
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const pageParam = searchParams.get('page')
    const limitParam = searchParams.get('limit')
    const search = searchParams.get('search') || searchParams.get('q') || ''
    const category = searchParams.get('category') || ''
    const fresh = searchParams.get('fresh') === '1' || isAdmin(req)
    const useCanonicalShaktiPeethFilter = isShaktiPeethCategory(category)

    await connectDB()

    // Build filter
    const filter: Record<string, any> = {}
    if (category && !useCanonicalShaktiPeethFilter) {
      const categoryValues = getCategoryQueryValues(category)
      filter.$or = [
        { categories: { $in: categoryValues } },
        { sacredCategories: { $in: categoryValues } },
      ]
    }
    if (search) filter.$text = { $search: search }

    // ─── Paginated mode (when page param is present) ───
    if (pageParam) {
      const page = Math.max(1, parseInt(pageParam, 10) || 1)
      const limit = Math.min(100, Math.max(1, parseInt(limitParam || '20', 10)))
      const skip = (page - 1) * limit

      if (useCanonicalShaktiPeethFilter) {
        const allItems = await Temple.find(filter, { __v: 0 })
          .sort(search ? { score: { $meta: 'textScore' }, createdAt: -1 } : { createdAt: -1 })
          .lean()
        const shaktiItems = getTemplesForSacredCategory(allItems, category)
        const items = shaktiItems.slice(skip, skip + limit)
        const total = shaktiItems.length

        const res = NextResponse.json({ items, total, page, pages: Math.ceil(total / limit), limit })
        res.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=120')
        return res
      }

      const [items, total] = await Promise.all([
        Temple.find(filter, { __v: 0 })
          .sort(search ? { score: { $meta: 'textScore' }, createdAt: -1 } : { createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        Temple.countDocuments(filter),
      ])

      const res = NextResponse.json({ items, total, page, pages: Math.ceil(total / limit), limit })
      res.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=120')
      return res
    }

    // ─── Legacy mode (no pagination — returns all, used by TempleDataProvider) ───
    if (!fresh && _cache && !search && !category && Date.now() - _cache.ts < CACHE_TTL) {
      const res = NextResponse.json(_cache.data)
      res.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300')
      return res
    }

    const temples = await Temple.find(filter, { __v: 0 }).sort({ createdAt: -1 }).lean()
    const result = useCanonicalShaktiPeethFilter ? getTemplesForSacredCategory(temples, category) : temples
    if (!fresh && !search && !category) {
      _cache = { data: temples, ts: Date.now() }
    }
    const res = NextResponse.json(result)
    res.headers.set('Cache-Control', fresh ? 'no-store, max-age=0' : 'public, s-maxage=60, stale-while-revalidate=300')
    return res
  } catch (error) {
    console.error('Temple API Error:', error)
    return NextResponse.json({ error: 'Failed to fetch temples' }, { status: 500 })
  }
}

// POST create new temple
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const rawData = await req.json();
    const data = normalizeTemplePayload(pickSupportedTempleFields(rawData));
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
    const { id, ...rawUpdate } = await req.json();
    if (!id) {
      return NextResponse.json({ error: 'Missing temple id' }, { status: 400 });
    }
    const update = normalizeTemplePayload(pickSupportedTempleFields(rawUpdate));
    const temple = await Temple.findByIdAndUpdate(id, { $set: update }, { new: true });
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
