import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Temple from '@/models/Temple';
import Event from '@/models/Event';
import { verifyToken, AUTH_COOKIE_NAME } from '@/lib/auth';
import { getTemplesForSacredCategory, isShaktiPeethCategory } from '@/data/shakti-peethas';
import { getCategoryBySlug } from '@/lib/sacred-categories';
import { validateImportCategories } from '@/lib/sacred-category-registry';
import { normalizeTempleText, normalizeTempleWrite, slugifyTemple } from '@/lib/temple-normalization';
import { buildCursorFilter, paginateCursor, parseCursorLimit, TEMPLE_CARD_PROJ } from '@/lib/cursor-pagination';
import { applyRateLimit } from '@/lib/rate-limit';

function isAdmin(req: NextRequest): boolean {
  const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;
  if (!token) return false;
  const payload = verifyToken(token);
  return payload?.role === 'admin';
}

const SUPPORTED_TEMPLE_FIELDS = [
  // Core
  'title','slug','titleNormalized','titleHi','subtitle','subtitleHi','alternateNames','tags','templeTagline','templeTaglineHi',
  'shortDescription','shortDescriptionHi','description','descriptionHi',
  // Media
  'primaryImage','image','imageCard','imageHero','imageGallery','heroImage','images','galleryImages','festivalGallery','architectureGallery',
  'deityGallery','videos','droneShots','ambienceAudio',
  // Location
  'streetAddress','location','locationHi','mapsLink','googleMapUrl','googleMapsUrl','latitude','longitude',
  'city','cityNormalized','cityHi','district','state','stateNormalized','stateHi','country','pincode','pincodeHi',
  // Deity & Spiritual
  'deity','deityHi','deitySlug','mainDeity','secondaryDeities','deityForms','sampradaya','sect','spiritualTradition',
  'sacredImportance','sacredImportanceHi','religiousImportance','religiousImportanceHi','mythology','mythologyHi',
  'templeLegend','templeLegendHi','sacredMystery','sacredMysteryHi',
  // History & Architecture
  'history','historyHi','architecture','architectureHi','architectureStyle','architectureHighlights','templeArea',
  'gopuramCount','mandapamDetails','builtBy','dynasty','renovations',
  // Classification
  'establishedYear','establishedYearHi','templeType','templeTypes',
  'speciality','specialityHi','categories','sacredCategories','sacredCategorySlugs',
  // Pilgrimage
  'pilgrimageType','pilgrimageCircuit','nearbySacredPlaces','nearbyTemples','bestSeason','bestTimeToVisit','bestTimeToVisitHi','crowdLevel',
  'averageVisitDuration','dressCode','photographyAllowed','prasadamInfo','specialRituals','templeRules',
  // Timings
  'timings','timingSlots',
  // Travel
  'nearestAirport','nearestRailwayStation','nearestBusStand','parkingAvailable',
  'wheelchairAccess','accommodationInfo','localTransport',
  // Festivals
  'festivals','festivalsHi',
  // Contact
  'contact','phone','email','website','facebook','instagram',
  // SEO
  'metaTitle','metaDescription','metaKeywords','keywords','faqs','sourceUrls','ogImage','canonicalUrl',
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

function cleanStringList(value: unknown): string[] | undefined {
  if (Array.isArray(value)) return cleanStringArray(value) || [];
  if (typeof value !== 'string') return undefined;
  return value
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function cleanFaqs(value: unknown) {
  if (Array.isArray(value)) {
    return value
      .map((faq) => ({
        question: typeof faq?.question === 'string' ? faq.question.trim() : '',
        answer: typeof faq?.answer === 'string' ? faq.answer.trim() : '',
      }))
      .filter((faq) => faq.question || faq.answer);
  }

  if (typeof value !== 'string') return undefined;
  return value
    .split(/\r?\n|;/)
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => {
      const [question, ...answerParts] = item.split('|');
      return {
        question: (question || '').trim(),
        answer: answerParts.join('|').trim(),
      };
    })
    .filter((faq) => faq.question || faq.answer);
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

  if (hasOwn(data, 'primaryImage') && !hasOwn(data, 'image')) {
    data.image = data.primaryImage;
  } else if (hasOwn(data, 'image') && !hasOwn(data, 'primaryImage')) {
    data.primaryImage = data.image;
  }

  if (hasOwn(data, 'googleMapUrl') && !hasOwn(data, 'googleMapsUrl')) {
    data.googleMapsUrl = data.googleMapUrl;
  } else if (hasOwn(data, 'googleMapsUrl') && !hasOwn(data, 'googleMapUrl')) {
    data.googleMapUrl = data.googleMapsUrl;
  }
  if (hasOwn(data, 'mapsLink') && !hasOwn(data, 'googleMapsUrl')) {
    data.googleMapsUrl = data.mapsLink;
  } else if (hasOwn(data, 'googleMapsUrl') && !hasOwn(data, 'mapsLink')) {
    data.mapsLink = data.googleMapsUrl;
  }
  if (hasOwn(data, 'googleMapsUrl') && !hasOwn(data, 'googleMapUrl')) {
    data.googleMapUrl = data.googleMapsUrl;
  }
  if (hasOwn(data, 'googleMapUrl') && !hasOwn(data, 'mapsLink')) {
    data.mapsLink = data.googleMapUrl;
  }
  if (hasOwn(data, 'streetAddress') && !hasOwn(data, 'location')) {
    data.location = data.streetAddress;
  } else if (hasOwn(data, 'location') && !hasOwn(data, 'streetAddress')) {
    data.streetAddress = data.location;
  }

  for (const field of ['tags', 'keywords', 'sourceUrls', 'nearbyTemples', 'nearbySacredPlaces', 'secondaryDeities', 'deityForms', 'galleryImages', 'imageGallery', 'images'] as const) {
    const list = cleanStringList(data[field]);
    if (list) data[field] = list;
  }
  if (Array.isArray(data.galleryImages) && !hasOwn(data, 'images')) data.images = data.galleryImages;
  if (Array.isArray(data.galleryImages) && !hasOwn(data, 'imageGallery')) data.imageGallery = data.galleryImages;
  if (Array.isArray(data.imageGallery) && !hasOwn(data, 'galleryImages')) data.galleryImages = data.imageGallery;
  if (Array.isArray(data.images) && !hasOwn(data, 'galleryImages')) data.galleryImages = data.images;

  for (const field of ['latitude', 'longitude'] as const) {
    if (typeof data[field] === 'string' && data[field].trim()) {
      const parsed = Number(data[field]);
      if (Number.isFinite(parsed)) data[field] = parsed;
    }
  }
  if (Array.isArray(data.nearbyTemples) && !hasOwn(data, 'nearbySacredPlaces')) {
    data.nearbySacredPlaces = data.nearbyTemples;
  } else if (Array.isArray(data.nearbySacredPlaces) && !hasOwn(data, 'nearbyTemples')) {
    data.nearbyTemples = data.nearbySacredPlaces;
  }

  if (hasOwn(data, 'keywords') && !hasOwn(data, 'metaKeywords')) {
    data.metaKeywords = Array.isArray(data.keywords) ? data.keywords.join(', ') : data.keywords;
  } else if (hasOwn(data, 'metaKeywords') && !hasOwn(data, 'keywords')) {
    data.keywords = cleanStringList(data.metaKeywords) || [];
  }

  if (hasOwn(data, 'religiousImportance') && !hasOwn(data, 'sacredImportance')) {
    data.sacredImportance = data.religiousImportance;
  } else if (hasOwn(data, 'sacredImportance') && !hasOwn(data, 'religiousImportance')) {
    data.religiousImportance = data.sacredImportance;
  }
  if (hasOwn(data, 'religiousImportanceHi') && !hasOwn(data, 'sacredImportanceHi')) {
    data.sacredImportanceHi = data.religiousImportanceHi;
  } else if (hasOwn(data, 'sacredImportanceHi') && !hasOwn(data, 'religiousImportanceHi')) {
    data.religiousImportanceHi = data.sacredImportanceHi;
  }

  if (hasOwn(data, 'architecture') && !hasOwn(data, 'architectureHighlights')) {
    data.architectureHighlights = data.architecture;
  } else if (hasOwn(data, 'architectureHighlights') && !hasOwn(data, 'architecture')) {
    data.architecture = data.architectureHighlights;
  }

  if (hasOwn(data, 'bestTimeToVisit') && !hasOwn(data, 'bestSeason')) {
    data.bestSeason = data.bestTimeToVisit;
  } else if (hasOwn(data, 'bestSeason') && !hasOwn(data, 'bestTimeToVisit')) {
    data.bestTimeToVisit = data.bestSeason;
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
  const faqs = cleanFaqs(data.faqs);
  if (faqs) data.faqs = faqs;

  return data;
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function safeRegex(value: string) {
  return new RegExp(escapeRegex(value.trim()), 'i');
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

function slugifyCategory(value: string) {
  return slugifyTemple(value);
}

function getCategoryQueryValues(category: string) {
  const trimmed = category.trim();
  const slug = slugifyCategory(trimmed);
  const canonical = getCategoryBySlug(slug);
  return Array.from(new Set([trimmed, slug, canonical?.name, canonical?.slug].filter(Boolean) as string[]));
}

function addAnd(filter: Record<string, any>, condition: Record<string, any>) {
  if (!filter.$and) filter.$and = [];
  filter.$and.push(condition);
}

function buildTempleFilter(searchParams: URLSearchParams, adminMode: boolean, skipCategory = false) {
  const filter: Record<string, any> = {};

  if (!adminMode) addAnd(filter, publicTempleFilter());

  const status = searchParams.get('status')?.trim();
  if (adminMode && status) filter.status = status;

  const search = (searchParams.get('search') || searchParams.get('q') || '').trim();
  if (search) {
    const normalizedSearch = normalizeTempleText(search);
    const searchRegex = safeRegex(search);
    const normalizedRegex = safeRegex(normalizedSearch || search);
    addAnd(filter, {
      $or: [
        { title: searchRegex },
        { titleHi: searchRegex },
        { city: searchRegex },
        { district: searchRegex },
        { state: searchRegex },
        { deity: searchRegex },
        { speciality: searchRegex },
        { titleNormalized: normalizedRegex },
        { cityNormalized: normalizedRegex },
        { stateNormalized: normalizedRegex },
        { deitySlug: slugifyTemple(search) },
        { sacredCategorySlugs: slugifyTemple(search) },
      ],
    });
  }

  const state = searchParams.get('state')?.trim();
  if (state) {
    addAnd(filter, {
      $or: [
        { stateNormalized: normalizeTempleText(state) },
        { state: safeRegex(state) },
      ],
    });
  }

  const city = searchParams.get('city')?.trim();
  if (city) {
    addAnd(filter, {
      $or: [
        { cityNormalized: normalizeTempleText(city) },
        { city: safeRegex(city) },
      ],
    });
  }

  const deity = (searchParams.get('deity') || '').trim();
  const deitySlug = (searchParams.get('deitySlug') || '').trim();
  if (deity || deitySlug) {
    const deityValue = deity || deitySlug;
    addAnd(filter, {
      $or: [
        { deitySlug: slugifyTemple(deityValue) },
        { deity: safeRegex(deityValue) },
      ],
    });
  }

  const templeType = (searchParams.get('type') || searchParams.get('templeType') || '').trim();
  if (templeType) {
    addAnd(filter, {
      $or: [
        { templeType: safeRegex(templeType) },
        { templeTypes: { $in: [templeType] } },
      ],
    });
  }

  if (!skipCategory) {
    const category = (
      searchParams.get('category') ||
      searchParams.get('sacredCategory') ||
      searchParams.get('sacredCategorySlug') ||
      ''
    ).trim();

    if (category) {
      const categoryValues = getCategoryQueryValues(category);
      const categorySlugs = Array.from(new Set(categoryValues.map(slugifyCategory).filter(Boolean)));
      addAnd(filter, {
        $or: [
          { sacredCategorySlugs: { $in: categorySlugs } },
          { categories: { $in: categoryValues } },
          { sacredCategories: { $in: categoryValues } },
        ],
      });
    }
  }

  return filter;
}

function getTempleSort(sort: string | null): Record<string, 1 | -1> {
  if (sort === 'title') return { titleNormalized: 1, title: 1 };
  if (sort === '-title') return { titleNormalized: -1, title: -1 };
  if (sort === 'status') return { status: 1, createdAt: -1 };
  if (sort === '-status') return { status: -1, createdAt: -1 };
  if (sort === 'oldest') return { createdAt: 1, _id: 1 };
  if (sort === 'state') return { stateNormalized: 1, cityNormalized: 1, titleNormalized: 1 };
  return { createdAt: -1, _id: -1 };
}

function parsePagination(searchParams: URLSearchParams) {
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '24', 10) || 24));
  return { page, limit, skip: (page - 1) * limit };
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const wantsAdminScope =
      searchParams.get('admin') === '1' ||
      searchParams.get('scope') === 'admin' ||
      searchParams.get('fresh') === '1';
    const adminMode = wantsAdminScope && isAdmin(req);

    // Rate limit public requests (admin bypasses)
    if (!adminMode) {
      const limited = applyRateLimit(req, 'temples')
      if (limited) return limited
    }
    const category = (
      searchParams.get('category') ||
      searchParams.get('sacredCategory') ||
      searchParams.get('sacredCategorySlug') ||
      ''
    ).trim();
    const useCanonicalShaktiPeethFilter = isShaktiPeethCategory(category);
    const { page, limit, skip } = parsePagination(searchParams);
    const sort = getTempleSort(searchParams.get('sort'));

    await connectDB();

    const fieldsCard = !adminMode && searchParams.get('fields') === 'card'
    const listProj = fieldsCard ? TEMPLE_CARD_PROJ : { __v: 0 }

    const filter = buildTempleFilter(searchParams, adminMode, useCanonicalShaktiPeethFilter);

    // ── Cursor-based pagination (scale mode) ──
    // Activated when ?cursor= is present in URL. Backward-compatible — offset callers unchanged.
    if (searchParams.has('cursor') && !useCanonicalShaktiPeethFilter) {
      const cursorToken = searchParams.get('cursor') || undefined
      const cursorLimit = parseCursorLimit(searchParams.get('limit'), 24)
      const cursorFilter = buildCursorFilter(cursorToken, filter)
      const docs = await Temple.find(cursorFilter, TEMPLE_CARD_PROJ)
        .sort({ createdAt: -1, _id: -1 })
        .limit(cursorLimit + 1)
        .lean()
      const result = paginateCursor(docs as any[], cursorLimit)
      const res = NextResponse.json(result)
      res.headers.set('Cache-Control', adminMode ? 'no-store, max-age=0' : 'public, s-maxage=300, stale-while-revalidate=600')
      return res
    }

    if (useCanonicalShaktiPeethFilter) {
      const categoryValues = getCategoryQueryValues(category);
      const categorySlugs = Array.from(new Set(categoryValues.map(slugifyCategory).filter(Boolean)));
      addAnd(filter, {
        $or: [
          { canonicalShaktiPeeth: true },
          { sacredCategorySlugs: { $in: categorySlugs } },
          { categories: { $in: categoryValues } },
          { sacredCategories: { $in: categoryValues } },
        ],
      });

      const candidates = await Temple.find(filter, listProj)
        .sort(sort)
        .limit(250)
        .lean();
      const shaktiItems = getTemplesForSacredCategory(candidates, category);
      const data = shaktiItems.slice(skip, skip + limit);
      const total = shaktiItems.length;
      const res = NextResponse.json({
        data,
        items: data,
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasMore: skip + data.length < total,
      });
      res.headers.set('Cache-Control', adminMode ? 'no-store, max-age=0' : 'public, s-maxage=300, stale-while-revalidate=600');
      return res;
    }

    const [data, total] = await Promise.all([
      Temple.find(filter, listProj)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Temple.countDocuments(filter),
    ]);

    const res = NextResponse.json({
      data,
      items: data,
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
      hasMore: skip + data.length < total,
    });
    res.headers.set('Cache-Control', adminMode ? 'no-store, max-age=0' : 'public, s-maxage=300, stale-while-revalidate=600');
    return res;
  } catch (error) {
    console.error('Temple API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch temples' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const rawData = await req.json();
    const data = normalizeTempleWrite(normalizeTemplePayload(pickSupportedTempleFields(rawData)));

    // Public listing submissions remain allowed, but publishing is admin-only.
    if (data.status === 'approved' && !isAdmin(req)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Validate categories — warn only, never fail import
    const rawCategoryValues = [
      ...(Array.isArray(rawData.sacredCategories) ? rawData.sacredCategories : []),
      ...(Array.isArray(rawData.categories) ? rawData.categories : []),
    ]
    const { unknown: unknownCategories } = rawCategoryValues.length
      ? validateImportCategories(rawCategoryValues)
      : { unknown: [] }

    const temple = await Temple.create(data);

    if (data.festivals && Array.isArray(data.festivals) && data.festivals.length > 0) {
      const eventPromises = data.festivals
        .filter((f: { name: string }) => f.name?.trim())
        .map((festival: { name: string; description: string }) =>
          Event.create({
            title: `${festival.name} - ${temple.title}`,
            description: festival.description || '',
            temple: temple.title,
            location: temple.city ? `${temple.city}, ${temple.state || ''}`.trim().replace(/,\s*$/, '') : (temple.location || ''),
            status: data.status === 'approved' ? 'approved' : 'pending',
          })
        );
      await Promise.allSettled(eventPromises);
    }

    return NextResponse.json({
      ...temple.toObject(),
      ...(unknownCategories.length > 0 ? { warnings: { unknownCategories } } : {}),
    }, { status: 201 });
  } catch (error) {
    console.error('Create temple error:', error);
    return NextResponse.json({ error: 'Failed to create temple' }, { status: 500 });
  }
}

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

    const existing = await Temple.findById(id).lean();
    if (!existing) {
      return NextResponse.json({ error: 'Temple not found' }, { status: 404 });
    }

    const update = normalizeTempleWrite(
      normalizeTemplePayload(pickSupportedTempleFields(rawUpdate)),
      existing as Record<string, any>
    );
    const temple = await Temple.findByIdAndUpdate(id, { $set: update }, { new: true });
    return NextResponse.json(temple);
  } catch (error) {
    console.error('Update temple error:', error);
    return NextResponse.json({ error: 'Failed to update temple' }, { status: 500 });
  }
}

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
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete temple' }, { status: 500 });
  }
}
