import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Temple from '@/models/Temple'
import Devotional from '@/models/Devotional'
import Blog from '@/models/Blog'
import { verifyToken, AUTH_COOKIE_NAME } from '@/lib/auth'

function isAdmin(req: NextRequest): boolean {
  const token = req.cookies.get(AUTH_COOKIE_NAME)?.value
  if (!token) return false
  const payload = verifyToken(token)
  return payload?.role === 'admin'
}

/**
 * GET /api/admin/seo-analytics
 *
 * Returns SEO analytics overview:
 *  - Content counts by type
 *  - SEO score distribution (excellent/good/needs-work/poor)
 *  - Top weak content (lowest SEO scores)
 *  - Coverage stats (% with images, descriptions, slugs)
 *  - State/deity distribution for topical authority
 */
export async function GET(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await connectDB()

    const [temples, devotionals, blogs] = await Promise.all([
      Temple.find({}, 'title image description deity state city slug categories status').lean() as Promise<any[]>,
      Devotional.find({}, 'title description audio deity category status').lean() as Promise<any[]>,
      Blog.find({}, 'title image excerpt body slug').lean() as Promise<any[]>,
    ])

    const approved = temples.filter(t => t.status === 'approved')

    // Score each item
    function scoreTemple(t: any): number {
      let s = 100
      if (!t.image) s -= 20
      if (!t.description || t.description.replace(/<[^>]+>/g, '').length < 30) s -= 15
      if (!t.city && !t.state) s -= 15
      if (!t.deity) s -= 10
      if (!t.slug) s -= 10
      if (!t.categories || t.categories.length === 0) s -= 10
      if (t.title && t.title.length < 10) s -= 10
      return Math.max(0, s)
    }

    function scoreDevotional(d: any): number {
      let s = 100
      if (!d.audio) s -= 25
      if (!d.description || d.description.length < 20) s -= 20
      if (!d.deity) s -= 15
      if (!d.category) s -= 15
      return Math.max(0, s)
    }

    function scoreBlog(b: any): number {
      let s = 100
      if (!b.image) s -= 20
      if (!b.excerpt || b.excerpt.length < 20) s -= 15
      if (!b.slug) s -= 10
      if (!b.body || b.body.length < 100) s -= 25
      if (b.title && b.title.length < 10) s -= 10
      return Math.max(0, s)
    }

    const templeScores = approved.map(t => ({ id: t._id.toString(), title: t.title, score: scoreTemple(t), type: 'temple' }))
    const devotionalScores = devotionals.map(d => ({ id: d._id.toString(), title: d.title, score: scoreDevotional(d), type: 'devotional' }))
    const blogScores = blogs.map(b => ({ id: b._id.toString(), title: b.title, score: scoreBlog(b), type: 'blog' }))
    const allScores = [...templeScores, ...devotionalScores, ...blogScores]

    // Distribution
    const distribution = {
      excellent: allScores.filter(s => s.score >= 90).length,
      good: allScores.filter(s => s.score >= 70 && s.score < 90).length,
      needsWork: allScores.filter(s => s.score >= 50 && s.score < 70).length,
      poor: allScores.filter(s => s.score < 50).length,
    }

    // Top weak content
    const weakest = allScores
      .sort((a, b) => a.score - b.score)
      .slice(0, 15)

    // Coverage
    const coverage = {
      templesWithImage: approved.filter(t => t.image).length,
      templesWithDescription: approved.filter(t => t.description && t.description.length > 30).length,
      templesWithSlug: approved.filter(t => t.slug).length,
      blogsWithImage: blogs.filter(b => b.image).length,
      blogsWithExcerpt: blogs.filter(b => b.excerpt && b.excerpt.length > 20).length,
      devotionalsWithAudio: devotionals.filter(d => d.audio).length,
    }

    // State distribution
    const stateCounts: Record<string, number> = {}
    for (const t of approved) {
      if (t.state) stateCounts[t.state] = (stateCounts[t.state] || 0) + 1
    }
    const topStates = Object.entries(stateCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([state, count]) => ({ state, count }))

    // Deity distribution
    const deityCounts: Record<string, number> = {}
    for (const t of approved) {
      if (t.deity) deityCounts[t.deity] = (deityCounts[t.deity] || 0) + 1
    }
    const topDeities = Object.entries(deityCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([deity, count]) => ({ deity, count }))

    const avgScore = allScores.length > 0 ? Math.round(allScores.reduce((s, i) => s + i.score, 0) / allScores.length) : 100

    // Index coverage estimate — pages that *should* be indexable
    const uniqueStates = new Set(approved.map(t => t.state).filter(Boolean))
    const uniqueCities = new Set(approved.map(t => t.city).filter(Boolean))
    const uniqueDeities = new Set(approved.map(t => t.deity).filter(Boolean))
    const indexCoverage = {
      templePages: approved.length,
      stateHubPages: uniqueStates.size,
      cityHubPages: uniqueCities.size,
      deityHubPages: uniqueDeities.size,
      pilgrimageClusters: 15,
      blogPages: blogs.length,
      staticPages: 18,
      estimatedTotalIndexable: approved.length + uniqueStates.size + uniqueCities.size + uniqueDeities.size + 15 + blogs.length + devotionals.length + 18,
    }

    // CTR opportunity — content with good SEO but missing elements for rich snippets
    const ctrOpportunities = approved
      .filter(t => scoreTemple(t) >= 70 && (!t.image || !t.description || t.description.length < 100))
      .slice(0, 10)
      .map(t => ({
        id: t._id.toString(),
        title: t.title,
        missing: [
          !t.image && 'image',
          (!t.description || t.description.length < 100) && 'rich description',
        ].filter(Boolean),
      }))

    return NextResponse.json({
      counts: {
        temples: approved.length,
        pendingTemples: temples.filter(t => t.status === 'pending').length,
        devotionals: devotionals.length,
        blogs: blogs.length,
        total: allScores.length,
      },
      avgSeoScore: avgScore,
      distribution,
      weakest,
      coverage,
      topStates,
      topDeities,
      indexCoverage,
      ctrOpportunities,
    })
  } catch (error) {
    console.error('SEO analytics error:', error)
    return NextResponse.json({ error: 'Analytics failed' }, { status: 500 })
  }
}
