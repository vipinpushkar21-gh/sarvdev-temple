import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Deity from '@/models/Deity';
import { verifyToken, AUTH_COOKIE_NAME } from '@/lib/auth';
import { resolveCategoryForDeity } from '@/lib/deity-categories';

// ── 60-second in-memory cache — deities list is read-heavy, rarely changes ──
let _deityCache: { data: any[]; ts: number } | null = null
const DEITY_CACHE_TTL = 60_000

const VALID_STATUSES = new Set(['pending', 'approved', 'rejected']);
const STRING_FIELDS = [
  'name',
  'nameHi',
  'description',
  'descriptionHi',
  'mantra',
  'metaTitle',
  'metaDescription',
  'metaKeywords',
] as const;
const ARRAY_FIELDS = ['attributes', 'images'] as const;
const MEDIA_FIELDS = ['image', 'imageCard', 'imageHero', 'ogImage'] as const;

function getAdmin(req: NextRequest) {
  const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;
  if (!token) return null;
  const payload = verifyToken(token);
  return payload?.role === 'admin' ? payload : null;
}

function normalizeStatus(status: unknown) {
  return typeof status === 'string' && VALID_STATUSES.has(status) ? status : undefined;
}

function isNonEmptyString(value: unknown) {
  return typeof value === 'string' && value.trim().length > 0;
}

function isMongoObjectId(value: unknown) {
  return typeof value === 'string' && /^[a-f0-9]{24}$/i.test(value);
}

function uniqueValues(values: unknown[]) {
  return Array.from(new Set(values.map((value) => String(value || '').trim()).filter(Boolean)));
}

function getExistingCategoryValues(deity: any) {
  return uniqueValues([
    ...(Array.isArray(deity?.categories) ? deity.categories : []),
    ...(Array.isArray(deity?.categoryIds) ? deity.categoryIds : []),
    deity?.category,
    deity?.categoryId,
  ]);
}

function normalizeNewCategories(values: unknown[]) {
  return uniqueValues(values)
    .map((category) => resolveCategoryForDeity(category, null))
    .filter(Boolean) as string[];
}

function normalizeUpdateCategories(values: unknown[], existingDeity: any) {
  const existingValues = new Set(getExistingCategoryValues(existingDeity));
  const output: string[] = [];
  const invalid: string[] = [];

  for (const raw of uniqueValues(values)) {
    const canonical = resolveCategoryForDeity(raw, null);
    if (canonical) {
      output.push(canonical);
    } else if (existingValues.has(raw)) {
      // Preserve current legacy values instead of erasing them during edit.
      output.push(raw);
    } else {
      invalid.push(raw);
    }
  }

  return {
    categories: Array.from(new Set(output)),
    invalid,
  };
}

// GET all deities.
export async function GET() {
  try {
    if (_deityCache && Date.now() - _deityCache.ts < DEITY_CACHE_TTL) {
      return NextResponse.json(_deityCache.data, {
        headers: { 'X-Cache': 'HIT', 'Cache-Control': 'public, max-age=60, stale-while-revalidate=30' },
      });
    }
    await connectDB();
    const deities = await Deity.find({}, { __v: 0 }).sort({ order: 1, createdAt: -1 }).lean();
    _deityCache = { data: deities as any[], ts: Date.now() };
    return NextResponse.json(deities, {
      headers: { 'X-Cache': 'MISS', 'Cache-Control': 'public, max-age=60, stale-while-revalidate=30' },
    });
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
    const admin = getAdmin(req);

    // Allow public submissions, but only admins can directly approve.
    if (data.status === 'approved' && !admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Handle multiple categories (new format)
    if (Array.isArray(data.categories) && data.categories.length > 0) {
      const validatedCategories = normalizeNewCategories(data.categories);

      if (validatedCategories.length === 0) {
        return NextResponse.json({ error: 'Invalid categories. Please choose valid deity categories.' }, { status: 400 });
      }

      data.categories = validatedCategories;
      data.categoryIds = validatedCategories;
      // For backward compatibility, set the first category as the primary category
      data.category = validatedCategories[0];
      data.categoryId = validatedCategories[0];
    } else {
      // Legacy single category support
      const canonicalCategory = resolveCategoryForDeity(data.category, data.categoryId);
      if (!canonicalCategory) {
        return NextResponse.json({ error: 'Invalid category. Please choose a canonical deity category.' }, { status: 400 });
      }
      data.category = canonicalCategory;
      data.categoryId = canonicalCategory;
      data.categories = [canonicalCategory];
      data.categoryIds = [canonicalCategory];
    }

    delete data.categorySlug;
    delete data.categoryName;

    const status = normalizeStatus(data.status);
    if (status) {
      data.status = status;
    } else {
      delete data.status;
    }

    if (admin) {
      data.source = 'manual';
      data.isCustomized = true;
      data.customizedAt = new Date();
    } else {
      data.source = 'public-submission';
      data.isCustomized = false;
    }
    data.updatedAt = new Date();

    const deity = await Deity.create(data);
    _deityCache = null;
    return NextResponse.json(deity, { status: 201 });
  } catch (error) {
    console.error('Create deity error:', error);
    return NextResponse.json({ error: 'Failed to create deity' }, { status: 500 });
  }
}

// PUT update deity (admin only)
export async function PUT(req: NextRequest) {
  const admin = getAdmin(req);
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectDB();
    const { id, allowSlugChange, ...update } = await req.json();
    if (!id) {
      return NextResponse.json({ error: 'Missing deity id' }, { status: 400 });
    }
    if (!isMongoObjectId(id)) {
      return NextResponse.json({ error: 'Invalid deity id. Admin edits must use Mongo _id.' }, { status: 400 });
    }

    const existingDeity = await Deity.findById(id);
    if (!existingDeity) {
      return NextResponse.json({ error: 'Deity not found' }, { status: 404 });
    }

    if (!isNonEmptyString(update.name) || !isNonEmptyString(update.nameHi)) {
      return NextResponse.json({ error: 'Name and Hindi name are required' }, { status: 400 });
    }

    const safeUpdate: Record<string, unknown> = {};

    // Handle multiple categories (new format)
    if (Array.isArray(update.categories) && update.categories.length > 0) {
      const normalized = normalizeUpdateCategories(update.categories, existingDeity);
      const validatedCategories = normalized.categories;

      if (validatedCategories.length === 0) {
        return NextResponse.json({ error: 'Invalid categories. Please choose valid deity categories.' }, { status: 400 });
      }
      if (normalized.invalid.length > 0) {
        return NextResponse.json({
          error: 'Invalid categories. Please choose valid deity categories.',
          details: `Unknown category: ${normalized.invalid.join(', ')}`,
        }, { status: 400 });
      }

      safeUpdate.categories = validatedCategories;
      safeUpdate.categoryIds = validatedCategories;
      // For backward compatibility, set the first category as the primary category
      safeUpdate.category = validatedCategories[0];
      safeUpdate.categoryId = validatedCategories[0];
    } else if (isNonEmptyString(update.category)) {
      // Legacy single category support
      const canonicalCategory = resolveCategoryForDeity(update.category, null);
      const existingValues = new Set(getExistingCategoryValues(existingDeity));
      const legacyCategory = String(update.category).trim();
      const categoryToSave = canonicalCategory || (existingValues.has(legacyCategory) ? legacyCategory : null);
      if (!categoryToSave) {
        return NextResponse.json({ error: 'Invalid category. Please choose a canonical deity category.' }, { status: 400 });
      }
      safeUpdate.category = categoryToSave;
      safeUpdate.categoryId = categoryToSave;
      safeUpdate.categories = [categoryToSave];
      safeUpdate.categoryIds = [categoryToSave];
    } else {
      // Keep existing categories if not provided
      const canonicalExisting = resolveCategoryForDeity(existingDeity.category, existingDeity.categoryId);
      const existingCategories = canonicalExisting
        ? [canonicalExisting]
        : getExistingCategoryValues(existingDeity);
      safeUpdate.categories = existingCategories;
      safeUpdate.categoryIds = existingCategories;
      safeUpdate.category = existingCategories[0] || existingDeity.category;
      safeUpdate.categoryId = existingCategories[0] || existingDeity.categoryId;
    }

    for (const field of STRING_FIELDS) {
      if (isNonEmptyString(update[field])) {
        safeUpdate[field] = String(update[field]).trim();
      }
    }

    for (const field of ARRAY_FIELDS) {
      if (Array.isArray(update[field]) && update[field].length > 0) {
        safeUpdate[field] = update[field].map((item: unknown) => String(item || '').trim()).filter(Boolean);
      }
    }

    for (const field of MEDIA_FIELDS) {
      if (isNonEmptyString(update[field])) {
        safeUpdate[field] = String(update[field]).trim();
      }
    }

    const status = normalizeStatus(update.status);
    if (status) {
      safeUpdate.status = status;
    }

    // Slugs are permanent identity keys unless a future explicit slug editor opts in.
    if (allowSlugChange === true && isNonEmptyString(update.slug) && update.slug !== existingDeity.slug) {
      const existingSlug = await Deity.findOne({ slug: update.slug, _id: { $ne: id } }).lean();
      if (existingSlug) {
        return NextResponse.json({ error: 'Slug already exists. Existing slug was preserved.' }, { status: 409 });
      }
      safeUpdate.slug = String(update.slug).trim();
      safeUpdate.slugAliases = Array.from(new Set([...(existingDeity.slugAliases || []), existingDeity.slug].filter(Boolean)));
    }

    if (!existingDeity.staticSlug && isNonEmptyString(update.staticSlug)) {
      safeUpdate.staticSlug = String(update.staticSlug).trim();
    }

    safeUpdate.source = 'manual';
    safeUpdate.isCustomized = true;
    safeUpdate.customizedAt = new Date();
    safeUpdate.updatedBy = admin.id;
    safeUpdate.updatedAt = new Date();

    const deity = await Deity.findByIdAndUpdate(id, { $set: safeUpdate }, { new: true, runValidators: true });
    if (!deity) {
      return NextResponse.json({ error: 'Deity not found' }, { status: 404 });
    }
    _deityCache = null;
    return NextResponse.json(deity);
  } catch (error: any) {
    console.error('Update deity error:', error);
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: 'Failed to update deity', details: msg }, { status: 500 });
  }
}

// DELETE deity (admin only)
export async function DELETE(req: NextRequest) {
  const admin = getAdmin(req);
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectDB();
    const { id } = await req.json();
    const deity = await Deity.findByIdAndDelete(id);
    if (!deity) {
      return NextResponse.json({ error: 'Deity not found' }, { status: 404 });
    }
    _deityCache = null;
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete deity' }, { status: 500 });
  }
}
