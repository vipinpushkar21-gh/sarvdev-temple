import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Temple from '@/models/Temple'
import Devotional from '@/models/Devotional'
import Blog from '@/models/Blog'
import { verifyToken, AUTH_COOKIE_NAME } from '@/lib/auth'

// ── 5-minute cache — full table scan should not run on every dashboard visit ──
let _healthCache: { data: any; ts: number } | null = null
const HEALTH_CACHE_TTL = 5 * 60_000

function isAdmin(req: NextRequest): boolean {
  const token = req.cookies.get(AUTH_COOKIE_NAME)?.value
  if (!token) return false
  const payload = verifyToken(token)
  return payload?.role === 'admin'
}

type Issue = { id: string; title: string; type: string; issues: string[]; seoScore: number }

/**
 * GET /api/admin/content-health
 *
 * Audits all content for SEO & quality issues:
 *  - Missing images
 *  - Missing/short descriptions
 *  - Missing location (temples)
 *  - Missing audio (devotionals)
 *  - Duplicate titles
 *  - Missing slugs
 */
export async function GET(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const fresh = new URL(req.url).searchParams.get('fresh') === '1'
  if (!fresh && _healthCache && Date.now() - _healthCache.ts < HEALTH_CACHE_TTL) {
    return NextResponse.json(_healthCache.data, {
      headers: { 'X-Cache': 'HIT', 'Cache-Control': 'no-store' },
    })
  }

  try {
    await connectDB()

    const [temples, devotionals, blogs] = await Promise.all([
      Temple.find({}, 'title description image location city state slug categories deity').lean() as Promise<any[]>,
      Devotional.find({}, 'title description audio category deity status').lean() as Promise<any[]>,
      Blog.find({}, 'title excerpt image slug body status').lean() as Promise<any[]>,
    ])

    const templeIssues: Issue[] = []
    const devotionalIssues: Issue[] = []
    const blogIssues: Issue[] = []

    // ── Temple Audit ──
    const templeTitles = new Map<string, string[]>()
    for (const t of temples) {
      const issues: string[] = []
      let score = 100
      if (!t.image) { issues.push('Missing image'); score -= 20 }
      if (!t.description || t.description.length < 30) { issues.push('Missing or short description'); score -= 15 }
      if (!t.location && !t.city && !t.state) { issues.push('Missing location'); score -= 15 }
      if (!t.deity) { issues.push('Missing deity'); score -= 10 }
      if (!t.slug) { issues.push('Missing slug'); score -= 10 }
      if (!t.categories || t.categories.length === 0) { issues.push('No sacred categories'); score -= 10 }
      if (t.title && t.title.length < 10) { issues.push('Weak title (too short)'); score -= 10 }
      if (t.description && t.description.replace(/<[^>]+>/g, '').length < 100) { issues.push('Low description word count'); score -= 5 }

      const normTitle = t.title?.toLowerCase().trim()
      if (normTitle) {
        if (!templeTitles.has(normTitle)) templeTitles.set(normTitle, [])
        templeTitles.get(normTitle)!.push(t._id.toString())
      }

      templeIssues.push({ id: t._id.toString(), title: t.title, type: 'temple', issues, seoScore: Math.max(0, score) })
    }

    // Flag duplicates
    for (const [title, ids] of templeTitles) {
      if (ids.length > 1) {
        for (const id of ids) {
          const existing = templeIssues.find(i => i.id === id)
          if (existing) { existing.issues.push(`Duplicate title (${ids.length} copies)`); existing.seoScore = Math.max(0, existing.seoScore - 15) }
          else templeIssues.push({ id, title, type: 'temple', issues: [`Duplicate title (${ids.length} copies)`], seoScore: 85 })
        }
      }
    }

    // ── Devotional Audit ──
    const devTitles = new Map<string, string[]>()
    for (const d of devotionals) {
      const issues: string[] = []
      let score = 100
      if (!d.audio) { issues.push('Missing audio file'); score -= 25 }
      if (!d.description || d.description.length < 20) { issues.push('Missing or short description'); score -= 20 }
      if (!d.deity) { issues.push('Missing deity'); score -= 15 }
      if (!d.category) { issues.push('Missing category'); score -= 15 }
      if (d.title && d.title.length < 5) { issues.push('Weak title'); score -= 10 }

      const normTitle = d.title?.toLowerCase().trim()
      if (normTitle) {
        if (!devTitles.has(normTitle)) devTitles.set(normTitle, [])
        devTitles.get(normTitle)!.push(d._id.toString())
      }

      devotionalIssues.push({ id: d._id.toString(), title: d.title, type: 'devotional', issues, seoScore: Math.max(0, score) })
    }

    for (const [title, ids] of devTitles) {
      if (ids.length > 1) {
        for (const id of ids) {
          const existing = devotionalIssues.find(i => i.id === id)
          if (existing) { existing.issues.push(`Duplicate title (${ids.length} copies)`); existing.seoScore = Math.max(0, existing.seoScore - 15) }
          else devotionalIssues.push({ id, title, type: 'devotional', issues: [`Duplicate title (${ids.length} copies)`], seoScore: 85 })
        }
      }
    }

    // ── Blog Audit ──
    for (const b of blogs) {
      const issues: string[] = []
      let score = 100
      if (!b.image) { issues.push('Missing cover image'); score -= 20 }
      if (!b.excerpt || b.excerpt.length < 20) { issues.push('Missing or short excerpt'); score -= 15 }
      if (!b.slug) { issues.push('Missing slug'); score -= 10 }
      if (!b.body || b.body.length < 100) { issues.push('Very short or empty body'); score -= 25 }
      if (b.body && b.body.length >= 100 && b.body.length < 300) { issues.push('Low word count (under 300 chars)'); score -= 10 }
      if (b.title && b.title.length < 10) { issues.push('Weak title (too short)'); score -= 10 }

      blogIssues.push({ id: b._id.toString(), title: b.title, type: 'blog', issues, seoScore: Math.max(0, score) })
    }

    const allIssues = [...templeIssues, ...devotionalIssues, ...blogIssues]
    const withProblems = allIssues.filter(i => i.issues.length > 0)
    const avgSeo = allIssues.length > 0 ? Math.round(allIssues.reduce((s, i) => s + i.seoScore, 0) / allIssues.length) : 100

    const summary = {
      temples: { total: temples.length, withIssues: templeIssues.filter(i => i.issues.length > 0).length, missingImages: temples.filter(t => !t.image).length, avgSeoScore: templeIssues.length ? Math.round(templeIssues.reduce((s, i) => s + i.seoScore, 0) / templeIssues.length) : 100 },
      devotionals: { total: devotionals.length, withIssues: devotionalIssues.filter(i => i.issues.length > 0).length, missingAudio: devotionals.filter(d => !d.audio).length, avgSeoScore: devotionalIssues.length ? Math.round(devotionalIssues.reduce((s, i) => s + i.seoScore, 0) / devotionalIssues.length) : 100 },
      blogs: { total: blogs.length, withIssues: blogIssues.filter(i => i.issues.length > 0).length, missingImages: blogs.filter(b => !b.image).length, avgSeoScore: blogIssues.length ? Math.round(blogIssues.reduce((s, i) => s + i.seoScore, 0) / blogIssues.length) : 100 },
      overallSeoScore: avgSeo,
    }

    const result = { summary, issues: withProblems }
    _healthCache = { data: result, ts: Date.now() }
    return NextResponse.json(result, { headers: { 'X-Cache': 'MISS', 'Cache-Control': 'no-store' } })
  } catch (error) {
    console.error('Content health audit error:', error)
    return NextResponse.json({ error: 'Audit failed' }, { status: 500 })
  }
}
