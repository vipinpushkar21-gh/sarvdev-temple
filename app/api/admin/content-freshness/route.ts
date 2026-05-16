import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Temple from '@/models/Temple'
import Blog from '@/models/Blog'
import Devotional from '@/models/Devotional'
import { verifyToken, AUTH_COOKIE_NAME } from '@/lib/auth'

function isAdmin(req: NextRequest): boolean {
  const token = req.cookies.get(AUTH_COOKIE_NAME)?.value
  if (!token) return false
  const payload = verifyToken(token)
  return payload?.role === 'admin'
}

/**
 * GET /api/admin/content-freshness
 *
 * Content freshness dashboard:
 *  - Stale content (not updated in 90+ days)
 *  - Missing descriptions / thin content
 *  - Content age distribution
 *  - Auto-repair suggestions
 */
export async function GET(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await connectDB()

    const now = Date.now()
    const STALE_DAYS = 90
    const staleThreshold = new Date(now - STALE_DAYS * 86400000)

    const [temples, blogs, devotionals] = await Promise.all([
      Temple.find({ status: 'approved' }, 'title description descriptionHi image city state deity createdAt reviewedAt').lean() as Promise<any[]>,
      Blog.find({}, 'title excerpt body image slug createdAt updatedAt').lean() as Promise<any[]>,
      Devotional.find({}, 'title description audio deity category createdAt').lean() as Promise<any[]>,
    ])

    // Stale temples (created/reviewed > 90 days ago, missing key fields)
    const staleTemples = temples
      .filter(t => {
        const lastTouched = t.reviewedAt || t.createdAt
        return lastTouched && new Date(lastTouched) < staleThreshold
      })
      .map(t => ({
        id: t._id.toString(),
        title: t.title,
        lastTouched: (t.reviewedAt || t.createdAt)?.toISOString?.() || null,
        daysSinceUpdate: Math.floor((now - new Date(t.reviewedAt || t.createdAt).getTime()) / 86400000),
        issues: [
          !t.description && 'no description',
          !t.descriptionHi && 'no Hindi description',
          !t.image && 'no image',
          t.description && t.description.replace(/<[^>]+>/g, '').length < 50 && 'thin description',
        ].filter(Boolean),
      }))
      .sort((a, b) => b.daysSinceUpdate - a.daysSinceUpdate)
      .slice(0, 25)

    // Stale blogs
    const staleBlogs = blogs
      .filter(b => {
        const lastTouched = b.updatedAt || b.createdAt
        return lastTouched && new Date(lastTouched) < staleThreshold
      })
      .map(b => ({
        id: b._id.toString(),
        title: b.title,
        daysSinceUpdate: Math.floor((now - new Date(b.updatedAt || b.createdAt).getTime()) / 86400000),
        issues: [
          !b.image && 'no image',
          !b.excerpt && 'no excerpt',
          b.body && b.body.length < 200 && 'thin content',
        ].filter(Boolean),
      }))
      .sort((a, b) => b.daysSinceUpdate - a.daysSinceUpdate)
      .slice(0, 15)

    // Thin content: temples with very short/no descriptions
    const thinContent = temples
      .filter(t => !t.description || t.description.replace(/<[^>]+>/g, '').length < 30)
      .map(t => ({ id: t._id.toString(), title: t.title, issue: !t.description ? 'no description' : 'thin description' }))
      .slice(0, 20)

    // Age distribution
    const ageDistribution = { under30d: 0, d30to90: 0, d90to180: 0, over180d: 0 }
    for (const t of temples) {
      const age = Math.floor((now - new Date(t.createdAt).getTime()) / 86400000)
      if (age < 30) ageDistribution.under30d++
      else if (age < 90) ageDistribution.d30to90++
      else if (age < 180) ageDistribution.d90to180++
      else ageDistribution.over180d++
    }

    // Auto-repair suggestions
    const repairSuggestions = [
      ...temples.filter(t => !t.descriptionHi && t.description).slice(0, 10).map(t => ({
        id: t._id.toString(), title: t.title, type: 'temple', action: 'Generate Hindi description from English',
      })),
      ...temples.filter(t => !t.image).slice(0, 5).map(t => ({
        id: t._id.toString(), title: t.title, type: 'temple', action: 'Add temple image',
      })),
      ...blogs.filter(b => !b.image).slice(0, 5).map(b => ({
        id: b._id.toString(), title: b.title, type: 'blog', action: 'Add blog cover image',
      })),
    ]

    return NextResponse.json({
      summary: {
        totalTemples: temples.length,
        totalBlogs: blogs.length,
        totalDevotionals: devotionals.length,
        staleTempleCount: staleTemples.length,
        staleBlogCount: staleBlogs.length,
        thinContentCount: thinContent.length,
      },
      staleTemples,
      staleBlogs,
      thinContent,
      ageDistribution,
      repairSuggestions,
    })
  } catch (error) {
    console.error('Content freshness error:', error)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
