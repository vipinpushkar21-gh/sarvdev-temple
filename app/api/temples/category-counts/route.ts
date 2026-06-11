import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Temple from '@/models/Temple'
import { SACRED_CATEGORIES } from '@/lib/sacred-categories'
import { SHAKTI_PEETH_CATEGORY } from '@/data/shakti-peethas'
import { applyRateLimit } from '@/lib/rate-limit'

const APPROVED_FILTER = {
  $or: [
    { status: 'approved' },
    { status: { $exists: false } },
    { status: '' },
    { status: null },
  ],
}

export async function GET(req: NextRequest) {
  const _t0 = performance.now();
  const limited = applyRateLimit(req, 'temples')
  if (limited) return limited

  try {
    await connectDB()

    const aggResult: { _id: string; count: number }[] = await Temple.aggregate([
      { $match: APPROVED_FILTER },
      {
        $project: {
          allCats: {
            $setUnion: [
              { $ifNull: ['$categories', []] },
              { $ifNull: ['$sacredCategories', []] },
            ],
          },
        },
      },
      { $unwind: '$allCats' },
      { $group: { _id: '$allCats', count: { $sum: 1 } } },
    ])

    const byName: Record<string, number> = {}
    for (const r of aggResult) {
      if (r._id) byName[r._id] = r.count
    }

    const shaktiCount = await Temple.countDocuments({
      $and: [
        APPROVED_FILTER,
        {
          $or: [
            { canonicalShaktiPeeth: true },
            { categories: SHAKTI_PEETH_CATEGORY },
            { sacredCategories: SHAKTI_PEETH_CATEGORY },
          ],
        },
      ],
    })

    const counts: Record<string, number> = {}
    for (const cat of SACRED_CATEGORIES) {
      if (cat.name === SHAKTI_PEETH_CATEGORY) {
        counts[cat.slug] = shaktiCount
      } else {
        counts[cat.slug] = byName[cat.name] || 0
      }
    }

    const res = NextResponse.json(counts)
    res.headers.set('Cache-Control', 'public, s-maxage=120, stale-while-revalidate=300')
    console.log("[api/category-counts] " + (performance.now() - _t0).toFixed(0) + "ms");
    return res
  } catch (error) {
    console.error('Category counts error:', error)
    return NextResponse.json({}, { status: 500 })
  }
}
