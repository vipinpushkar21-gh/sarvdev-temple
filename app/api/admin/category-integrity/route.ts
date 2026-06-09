import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Temple from '@/models/Temple'
import { verifyToken, AUTH_COOKIE_NAME } from '@/lib/auth'
import { ALL_REGISTRY_SLUGS } from '@/lib/sacred-category-registry'
import { getCategoryBySlug } from '@/lib/sacred-categories'

function isAdmin(req: NextRequest): boolean {
  const token = req.cookies.get(AUTH_COOKIE_NAME)?.value
  if (!token) return false
  return verifyToken(token)?.role === 'admin'
}

const UNCLASSIFIED_FILTER = {
  status: 'approved',
  $or: [
    { sacredCategorySlugs: { $exists: false } },
    { sacredCategorySlugs: { $size: 0 } },
  ],
}

export async function GET(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await connectDB()
    const url = new URL(req.url)
    const tabMode = url.searchParams.get('tab') || 'stats'

    // ── Unclassified temples (paginated) ─────────────────────────────────────
    if (tabMode === 'unclassified') {
      const page  = Math.max(1, parseInt(url.searchParams.get('page') || '1', 10) || 1)
      const limit = 25
      const skip  = (page - 1) * limit

      const [temples, total] = await Promise.all([
        Temple.find(UNCLASSIFIED_FILTER, '_id title slug city state status createdAt')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        Temple.countDocuments(UNCLASSIFIED_FILTER),
      ])

      return NextResponse.json({
        temples: temples.map((t: any) => ({
          id:    String(t._id),
          title: t.title,
          slug:  t.slug ?? '',
          city:  t.city  ?? '',
          state: t.state ?? '',
          status: t.status,
        })),
        total,
        page,
        pages: Math.ceil(total / limit),
      }, { headers: { 'Cache-Control': 'no-store' } })
    }

    // ── Full stats (default) ─────────────────────────────────────────────────

    // 1. Per-slug temple counts
    const slugCounts: { _id: string; count: number }[] = await Temple.aggregate([
      { $match: { status: 'approved' } },
      { $unwind: { path: '$sacredCategorySlugs', preserveNullAndEmptyArrays: false } },
      { $group: { _id: '$sacredCategorySlugs', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ])

    // 2. Unclassified count
    const unclassifiedCount = await Temple.countDocuments(UNCLASSIFIED_FILTER)

    // 3. Classify slugs — tag orphans as alias or true-orphan
    const allRegistrySlugs = Array.from(ALL_REGISTRY_SLUGS)
    const countMap: Record<string, number> = {}
    const orphanSlugs: { slug: string; count: number; canonicalSlug?: string }[] = []

    for (const { _id: slug, count } of slugCounts) {
      countMap[slug] = count
      if (!ALL_REGISTRY_SLUGS.has(slug)) {
        // Check if the slug resolves to a canonical via the alias map
        const canonical = getCategoryBySlug(slug)
        orphanSlugs.push({
          slug,
          count,
          ...(canonical && canonical.slug !== slug
            ? { canonicalSlug: canonical.slug }
            : {}),
        })
      }
    }

    // 4. Registry categories sorted by count
    const registryStats = allRegistrySlugs.map(slug => ({
      slug,
      count: countMap[slug] ?? 0,
    })).sort((a, b) => b.count - a.count)

    const unusedCategories = registryStats.filter(s => s.count === 0)

    // 5. Total approved temples
    const totalApproved = await Temple.countDocuments({ status: 'approved' })

    return NextResponse.json({
      totalApproved,
      unclassifiedCount,
      totalRegistryCategories: allRegistrySlugs.length,
      usedRegistryCategories: allRegistrySlugs.filter(s => (countMap[s] ?? 0) > 0).length,
      unusedCategories,
      orphanSlugs,
      registryStats,
    }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (err: any) {
    console.error('Category integrity error:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
