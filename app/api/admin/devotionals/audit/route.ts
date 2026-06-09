// GET /api/admin/devotionals/audit
// Read-only integrity report — does NOT modify any data.
import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Devotional from '@/models/Devotional'
import Deity from '@/models/Deity'
import { AUTH_COOKIE_NAME, verifyToken } from '@/lib/auth'
import { DEVOTIONAL_CATEGORIES, LEGACY_CATEGORY_VALUES } from '@/lib/devotional-categories'

function isAdmin(req: NextRequest): boolean {
  const token = req.cookies.get(AUTH_COOKIE_NAME)?.value
  if (!token) return false
  return verifyToken(token)?.role === 'admin'
}

const SAMPLE = 5

// Helper: build a "missing field" filter
const missing = (field: string) => ({
  $or: [{ [field]: { $exists: false } }, { [field]: null }, { [field]: '' }],
})

// Helper: build a "missing both fields" filter
const missingBoth = (f1: string, f2: string) => ({
  $and: [missing(f1), missing(f2)],
})

export async function GET(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    await connectDB()

    const VALID_NAMES = new Set(DEVOTIONAL_CATEGORIES.map((c) => c.id))

    const [
      total,
      missingSlugCount,
      missingCategorySlugCount,
      missingDeitySlugCount,
      missingTitleHiCount,
      missingLanguageCount,
      missingContentCount,
      missingAudioCount,
      duplicateSlugs,
      duplicateTitles,
      missingSlugSample,
      missingCategorySlugSample,
      missingDeitySlugSample,
      missingTitleHiSample,
      missingLanguageSample,
      missingContentSample,
      missingAudioSample,
      allDistinctCategories,
      dbDeities,
    ] = await Promise.all([
      Devotional.countDocuments(),
      Devotional.countDocuments(missing('slug')),
      Devotional.countDocuments(missing('categorySlug')),
      Devotional.countDocuments(missing('deitySlug')),
      Devotional.countDocuments(missing('titleHi')),
      Devotional.countDocuments(missing('language')),
      Devotional.countDocuments(missingBoth('lyrics', 'content')),
      Devotional.countDocuments(missingBoth('audio', 'audioUrl')),
      // Duplicate slugs (among records that have a slug)
      Devotional.aggregate([
        { $match: { slug: { $exists: true, $nin: [null, ''] } } },
        { $group: { _id: '$slug', count: { $sum: 1 }, ids: { $push: { $toString: '$_id' } } } },
        { $match: { count: { $gt: 1 } } },
        { $limit: SAMPLE },
      ]),
      // Duplicate titles (case-insensitive)
      Devotional.aggregate([
        { $group: { _id: { $toLower: '$title' }, count: { $sum: 1 }, sample: { $first: '$title' } } },
        { $match: { count: { $gt: 1 } } },
        { $sort: { count: -1 } },
        { $limit: SAMPLE },
      ]),
      Devotional.find(missing('slug'), 'title slug').limit(SAMPLE).lean(),
      Devotional.find(missing('categorySlug'), 'title category categorySlug').limit(SAMPLE).lean(),
      Devotional.find(missing('deitySlug'), 'title deity deitySlug').limit(SAMPLE).lean(),
      Devotional.find(missing('titleHi'), 'title titleHi').limit(SAMPLE).lean(),
      Devotional.find(missing('language'), 'title language').limit(SAMPLE).lean(),
      Devotional.find(missingBoth('lyrics', 'content'), 'title').limit(SAMPLE).lean(),
      Devotional.find(missingBoth('audio', 'audioUrl'), 'title audio audioUrl').limit(SAMPLE).lean(),
      Devotional.distinct('category'),
      Deity.find({ status: 'approved' }, 'slug name').lean(),
    ])

    // Invalid categories (not in canonical list and not a legacy value)
    const invalidCategoryValues = (allDistinctCategories as string[]).filter(
      (c) => c && !VALID_NAMES.has(c) && !LEGACY_CATEGORY_VALUES.has(c)
    )
    const [invalidCategoryCount, invalidCategorySample] = await Promise.all([
      invalidCategoryValues.length > 0
        ? Devotional.countDocuments({ category: { $in: invalidCategoryValues } })
        : Promise.resolve(0),
      invalidCategoryValues.length > 0
        ? Devotional.find({ category: { $in: invalidCategoryValues } }, 'title category').limit(SAMPLE).lean()
        : Promise.resolve([]),
    ])

    // Unmatched deitySlug (slug is set but doesn't match any approved DB deity)
    const dbDeitySlugSet = new Set((dbDeities as any[]).map((d) => d.slug))
    const allWithDeitySlug = await Devotional.find(
      { deitySlug: { $exists: true, $nin: [null, ''] } },
      'title deitySlug'
    ).lean()
    const unmatchedDeitySlugSample = (allWithDeitySlug as any[])
      .filter((d) => !dbDeitySlugSet.has(d.deitySlug))
      .slice(0, SAMPLE)

    return NextResponse.json({
      total,
      generatedAt: new Date().toISOString(),
      audit: {
        missingSlug:        { count: missingSlugCount,        sample: missingSlugSample },
        duplicateSlugs:     { count: duplicateSlugs.length,   sample: duplicateSlugs },
        missingTitleHi:     { count: missingTitleHiCount,     sample: missingTitleHiSample },
        missingCategory:    { count: 0,                       note: 'category has a default of Other' },
        invalidCategory:    { count: invalidCategoryCount,    invalidValues: invalidCategoryValues.slice(0, 10), sample: invalidCategorySample },
        missingCategorySlug:{ count: missingCategorySlugCount,sample: missingCategorySlugSample },
        missingDeity:       { count: 0,                       note: 'deity is optional — not all devotionals are deity-specific' },
        missingDeitySlug:   { count: missingDeitySlugCount,   sample: missingDeitySlugSample },
        unmatchedDeitySlug: { count: unmatchedDeitySlugSample.length, sample: unmatchedDeitySlugSample },
        duplicateTitles:    { count: duplicateTitles.length,  sample: duplicateTitles },
        missingLanguage:    { count: missingLanguageCount,    sample: missingLanguageSample },
        missingContent:     { count: missingContentCount,     sample: missingContentSample },
        missingAudio:       { count: missingAudioCount,       sample: missingAudioSample },
      },
      summary: {
        dbDeityCount: (dbDeities as any[]).length,
        categoryValues: allDistinctCategories,
      },
    })
  } catch (error) {
    console.error('Devotional audit error:', error)
    return NextResponse.json({ error: 'Audit failed' }, { status: 500 })
  }
}
