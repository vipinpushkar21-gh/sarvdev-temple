import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Temple from '@/models/Temple'
import Devotional from '@/models/Devotional'
import Blog from '@/models/Blog'
import Visitor from '@/models/Visitor'
import { verifyToken, AUTH_COOKIE_NAME } from '@/lib/auth'

function isAdmin(req: NextRequest): boolean {
  const token = req.cookies.get(AUTH_COOKIE_NAME)?.value
  if (!token) return false
  const payload = verifyToken(token)
  return payload?.role === 'admin'
}

/**
 * GET /api/admin/growth-analytics
 *
 * Enterprise-grade growth dashboard:
 *  - Content volume over time (monthly)
 *  - Crawl coverage (% of pages in sitemap with descriptions, images, slugs)
 *  - Geographic coverage (states covered, cities covered, districts estimated)
 *  - Authority depth (categories, pilgrimage clusters, deity hubs)
 *  - Content velocity (new content per month)
 */
export async function GET(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await connectDB()

    const [temples, devotionals, blogs, visitors] = await Promise.all([
      Temple.find({}, 'title status city state deity categories image description createdAt').lean() as Promise<any[]>,
      Devotional.find({}, 'title status createdAt').lean() as Promise<any[]>,
      Blog.find({}, 'title image excerpt slug createdAt').lean() as Promise<any[]>,
      Visitor.find({}, 'createdAt page').lean() as Promise<any[]>,
    ])

    const approved = temples.filter(t => t.status === 'approved')

    // Content volume
    const contentVolume = {
      totalTemples: approved.length,
      totalDevotionals: devotionals.length,
      totalBlogs: blogs.length,
      totalContent: approved.length + devotionals.length + blogs.length,
      pendingTemples: temples.filter(t => t.status === 'pending').length,
    }

    // Geographic coverage
    const states = new Set(approved.map(t => t.state).filter(Boolean))
    const cities = new Set(approved.map(t => t.city).filter(Boolean))
    const geoCoverage = {
      statesCovered: states.size,
      citiesCovered: cities.size,
      topStates: Object.entries(
        approved.reduce((acc: Record<string, number>, t) => {
          if (t.state) acc[t.state] = (acc[t.state] || 0) + 1
          return acc
        }, {})
      ).sort((a, b) => b[1] - a[1]).slice(0, 15).map(([state, count]) => ({ state, count })),
    }

    // Crawl coverage quality
    const crawlCoverage = {
      templesWithImage: Math.round((approved.filter(t => t.image).length / Math.max(approved.length, 1)) * 100),
      templesWithDescription: Math.round((approved.filter(t => t.description && t.description.length > 30).length / Math.max(approved.length, 1)) * 100),
      templesWithDeity: Math.round((approved.filter(t => t.deity).length / Math.max(approved.length, 1)) * 100),
      templesWithLocation: Math.round((approved.filter(t => t.city && t.state).length / Math.max(approved.length, 1)) * 100),
      blogsWithImage: Math.round((blogs.filter(b => b.image).length / Math.max(blogs.length, 1)) * 100),
      blogsWithExcerpt: Math.round((blogs.filter(b => b.excerpt && b.excerpt.length > 20).length / Math.max(blogs.length, 1)) * 100),
    }

    // Authority depth
    const deities = new Set(approved.map(t => t.deity).filter(Boolean))
    const categories = new Set(approved.flatMap(t => t.categories || []))
    const authorityDepth = {
      deityHubs: deities.size,
      stateHubs: states.size,
      cityHubs: cities.size,
      sacredCategories: categories.size,
      pilgrimageClusters: 10, // static from S8
      storyCollections: 10,   // static from S6
    }

    // Content velocity (last 6 months)
    const now = new Date()
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, 1)
    const velocity: { month: string; temples: number; blogs: number; devotionals: number }[] = []
    for (let i = 5; i >= 0; i--) {
      const start = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59)
      const label = start.toLocaleDateString('en-IN', { month: 'short', year: '2-digit' })
      velocity.push({
        month: label,
        temples: approved.filter(t => { const d = new Date(t.createdAt); return d >= start && d <= end }).length,
        blogs: blogs.filter(b => { const d = new Date(b.createdAt); return d >= start && d <= end }).length,
        devotionals: devotionals.filter(d => { const dt = new Date(d.createdAt); return dt >= start && dt <= end }).length,
      })
    }

    // Visitor trends (last 30 days)
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    const recentVisitors = visitors.filter(v => new Date(v.createdAt) >= thirtyDaysAgo)

    return NextResponse.json({
      contentVolume,
      geoCoverage,
      crawlCoverage,
      authorityDepth,
      velocity,
      visitorTrend: {
        last30Days: recentVisitors.length,
        topPages: Object.entries(
          recentVisitors.reduce((acc: Record<string, number>, v) => {
            const p = v.page || '/'
            acc[p] = (acc[p] || 0) + 1
            return acc
          }, {})
        ).sort((a, b) => b[1] - a[1]).slice(0, 20).map(([page, count]) => ({ page, count })),
      },
    })
  } catch (error) {
    console.error('Growth analytics error:', error)
    return NextResponse.json({ error: 'Analytics failed' }, { status: 500 })
  }
}
