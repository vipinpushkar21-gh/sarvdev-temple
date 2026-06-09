/**
 * GET /api/admin/data-quality
 *
 * Temple data quality dashboard API. Admin-only.
 *
 * Query params:
 *   tab=overview (default) — distribution + issue counts
 *   tab=seo&page=N         — temples with SEO issues
 *   tab=location&page=N    — temples with location issues
 *   tab=images&page=N      — temples with image issues
 *   tab=queue&page=N       — fix queue (worst-scored temples)
 */

import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Temple from '@/models/Temple'
import { verifyToken, AUTH_COOKIE_NAME } from '@/lib/auth'

const PAGE_SIZE = 25

function isAdmin(req: NextRequest): boolean {
  const token = req.cookies.get(AUTH_COOKIE_NAME)?.value
  if (!token) return false
  return verifyToken(token)?.role === 'admin'
}

// ── MongoDB score expression (mirrors lib/temple-quality.ts criteria) ─────────
// Returns a MongoDB aggregation $sum expression that evaluates to 0–100.

function scoreExpr(): Record<string, any> {
  const strLen = (f: string) => ({ $strLenBytes: { $ifNull: [`$${f}`, ''] } })
  const hasS   = (f: string)           => ({ $gt:  [strLen(f), 0] })
  const hasMin = (f: string, n: number) => ({ $gte: [strLen(f), n] })
  const hasN   = (f: string)           => ({ $ne:  [{ $ifNull: [`$${f}`, 0] }, 0] })
  const pts    = (cond: any, p: number) => ({ $cond: [cond, p, 0] })

  return {
    $sum: [
      pts({ $or:  [hasS('imageCard'), hasS('image')] }, 8),
      pts({ $or:  [hasS('imageHero'), hasS('heroImage')] }, 7),
      pts({ $and: [hasN('latitude'),  hasN('longitude')] }, 12),
      pts(hasS('city'),  5),
      pts(hasS('state'), 5),
      pts(hasMin('description',   50), 10),
      pts(hasMin('descriptionHi', 30),  5),
      pts(hasS('deity'), 5),
      pts({ $gt: [{ $size: { $ifNull: ['$sacredCategorySlugs', []] } }, 0] }, 10),
      pts(hasS('metaTitle'),       5),
      pts(hasS('metaDescription'), 5),
      pts(hasS('ogImage'),         5),
      pts(hasS('shortDescription'), 5),
      pts({ $or:  [hasS('phone'), hasS('email'), hasS('website')] }, 5),
      pts(hasS('timings'), 3),
    ],
  }
}

const BASE_MATCH = { status: { $ne: 'rejected' } }

export async function GET(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await connectDB()

    const url  = new URL(req.url)
    const tab  = url.searchParams.get('tab') || 'overview'
    const page = Math.max(1, parseInt(url.searchParams.get('page') || '1', 10))
    const skip = (page - 1) * PAGE_SIZE

    // ── Overview ──────────────────────────────────────────────────────────────
    if (tab === 'overview') {
      const [dist, issues, totalAll] = await Promise.all([
        // Quality distribution
        Temple.aggregate([
          { $match: BASE_MATCH },
          { $addFields: { _qs: scoreExpr() } },
          { $group: {
            _id:       null,
            total:     { $sum: 1 },
            excellent: { $sum: { $cond: [{ $gte: ['$_qs', 90] }, 1, 0] } },
            good:      { $sum: { $cond: [{ $and: [{ $gte: ['$_qs', 70] }, { $lt: ['$_qs', 90] }] }, 1, 0] } },
            needsWork: { $sum: { $cond: [{ $and: [{ $gte: ['$_qs', 50] }, { $lt: ['$_qs', 70] }] }, 1, 0] } },
            poor:      { $sum: { $cond: [{ $lt: ['$_qs', 50] }, 1, 0] } },
            avgScore:  { $avg: '$_qs' },
          }},
        ]),

        // Per-criterion issue counts
        Temple.aggregate([
          { $match: BASE_MATCH },
          { $group: {
            _id: null,
            missingCardImage:  { $sum: { $cond: [{ $and: [{ $in: ['$imageCard', [null, '']] }, { $in: ['$image', [null, '']] }] }, 1, 0] } },
            missingHeroImage:  { $sum: { $cond: [{ $and: [{ $in: ['$imageHero', [null, '']] }, { $in: ['$heroImage', [null, '']] }] }, 1, 0] } },
            missingCoords:     { $sum: { $cond: [{ $or: [{ $in: ['$latitude', [null, 0]] }, { $in: ['$longitude', [null, 0]] }] }, 1, 0] } },
            missingCity:       { $sum: { $cond: [{ $in: ['$city',     [null, '']] }, 1, 0] } },
            missingState:      { $sum: { $cond: [{ $in: ['$state',    [null, '']] }, 1, 0] } },
            shortDescription:  { $sum: { $cond: [{ $lt: [{ $strLenBytes: { $ifNull: ['$description', ''] } }, 50] }, 1, 0] } },
            missingDescHi:     { $sum: { $cond: [{ $lt: [{ $strLenBytes: { $ifNull: ['$descriptionHi', ''] } }, 30] }, 1, 0] } },
            missingDeity:      { $sum: { $cond: [{ $in: ['$deity',    [null, '']] }, 1, 0] } },
            missingCategory:   { $sum: { $cond: [{ $lt: [{ $size: { $ifNull: ['$sacredCategorySlugs', []] } }, 1] }, 1, 0] } },
            missingMetaTitle:  { $sum: { $cond: [{ $in: ['$metaTitle',       [null, '']] }, 1, 0] } },
            missingMetaDesc:   { $sum: { $cond: [{ $in: ['$metaDescription', [null, '']] }, 1, 0] } },
            missingOgImage:    { $sum: { $cond: [{ $in: ['$ogImage',         [null, '']] }, 1, 0] } },
            missingShortDesc:  { $sum: { $cond: [{ $in: ['$shortDescription',[null, '']] }, 1, 0] } },
            noContact:         { $sum: { $cond: [{ $and: [{ $in: ['$phone', [null, '']] }, { $in: ['$email', [null, '']] }, { $in: ['$website', [null, '']] }] }, 1, 0] } },
            missingTimings:    { $sum: { $cond: [{ $in: ['$timings',   [null, '']] }, 1, 0] } },
          }},
        ]),

        Temple.countDocuments(BASE_MATCH),
      ])

      return NextResponse.json({
        tab:        'overview',
        totalAll,
        distribution: dist[0] ?? { total: 0, excellent: 0, good: 0, needsWork: 0, poor: 0, avgScore: 0 },
        issueCounts:  issues[0] ?? {},
      }, { headers: { 'Cache-Control': 'no-store' } })
    }

    // ── SEO tab ───────────────────────────────────────────────────────────────
    if (tab === 'seo') {
      const filter = {
        ...BASE_MATCH,
        $or: [
          { metaTitle:       { $in: [null, ''] } },
          { metaDescription: { $in: [null, ''] } },
          { ogImage:         { $in: [null, ''] } },
          { canonicalUrl:    { $in: [null, ''] } },
        ],
      }
      const [temples, total] = await Promise.all([
        Temple.find(filter, {
          title: 1, slug: 1, city: 1, state: 1,
          metaTitle: 1, metaDescription: 1, ogImage: 1, canonicalUrl: 1,
        }).sort({ createdAt: -1 }).skip(skip).limit(PAGE_SIZE).lean(),
        Temple.countDocuments(filter),
      ])

      return NextResponse.json({
        tab: 'seo', temples,
        total, page, pages: Math.ceil(total / PAGE_SIZE),
      }, { headers: { 'Cache-Control': 'no-store' } })
    }

    // ── Location tab ──────────────────────────────────────────────────────────
    if (tab === 'location') {
      const filter = {
        ...BASE_MATCH,
        $or: [
          { latitude:  { $in: [null, 0] } },
          { longitude: { $in: [null, 0] } },
          { city:      { $in: [null, ''] } },
          { state:     { $in: [null, ''] } },
        ],
      }
      const [temples, total] = await Promise.all([
        Temple.find(filter, {
          title: 1, slug: 1, city: 1, state: 1, country: 1,
          latitude: 1, longitude: 1, streetAddress: 1,
        }).sort({ createdAt: -1 }).skip(skip).limit(PAGE_SIZE).lean(),
        Temple.countDocuments(filter),
      ])

      return NextResponse.json({
        tab: 'location', temples,
        total, page, pages: Math.ceil(total / PAGE_SIZE),
      }, { headers: { 'Cache-Control': 'no-store' } })
    }

    // ── Images tab ────────────────────────────────────────────────────────────
    if (tab === 'images') {
      const filter = {
        ...BASE_MATCH,
        $or: [
          { imageCard:  { $in: [null, ''] }, image:     { $in: [null, ''] } },
          { imageHero:  { $in: [null, ''] }, heroImage: { $in: [null, ''] } },
        ],
      }
      const [temples, total] = await Promise.all([
        Temple.find(filter, {
          title: 1, slug: 1, city: 1, state: 1,
          image: 1, imageCard: 1, imageHero: 1, heroImage: 1,
        }).sort({ createdAt: -1 }).skip(skip).limit(PAGE_SIZE).lean(),
        Temple.countDocuments(filter),
      ])

      // Flag non-cloudinary images separately
      const nonCloudinary = await Temple.countDocuments({
        ...BASE_MATCH,
        $or: [
          { imageCard: { $exists: true, $ne: '', $not: /cloudinary\.com/ } },
          { image:     { $exists: true, $ne: '', $not: /cloudinary\.com/ } },
          { imageHero: { $exists: true, $ne: '', $not: /cloudinary\.com/ } },
        ],
      })

      return NextResponse.json({
        tab: 'images', temples, nonCloudinaryCount: nonCloudinary,
        total, page, pages: Math.ceil(total / PAGE_SIZE),
      }, { headers: { 'Cache-Control': 'no-store' } })
    }

    // ── Fix queue tab ─────────────────────────────────────────────────────────
    if (tab === 'queue') {
      const [queueItems, total] = await Promise.all([
        Temple.aggregate([
          { $match: BASE_MATCH },
          { $addFields: { _qs: scoreExpr() } },
          { $match: { _qs: { $lt: 70 } } },
          { $sort: { _qs: 1 } },
          { $skip: skip },
          { $limit: PAGE_SIZE },
          { $project: {
            title: 1, slug: 1, city: 1, state: 1, status: 1, _qs: 1,
            imageCard: 1, image: 1, imageHero: 1, heroImage: 1,
            latitude: 1, longitude: 1,
            description: 1, deity: 1, sacredCategorySlugs: 1,
            metaTitle: 1, metaDescription: 1, ogImage: 1,
            shortDescription: 1, phone: 1, email: 1, website: 1, timings: 1,
          }},
        ]),
        Temple.aggregate([
          { $match: BASE_MATCH },
          { $addFields: { _qs: scoreExpr() } },
          { $match: { _qs: { $lt: 70 } } },
          { $count: 'n' },
        ]),
      ])

      return NextResponse.json({
        tab: 'queue', temples: queueItems,
        total: (total[0] as any)?.n ?? 0,
        page,
        pages: Math.ceil(((total[0] as any)?.n ?? 0) / PAGE_SIZE),
      }, { headers: { 'Cache-Control': 'no-store' } })
    }

    return NextResponse.json({ error: 'Unknown tab' }, { status: 400 })
  } catch (err: any) {
    console.error('[data-quality]', err?.message)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
