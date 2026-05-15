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
 * POST /api/admin/seo-autofill
 *
 * Auto-generates missing SEO fields using template logic:
 *  - Temple: description, speciality
 *  - Blog: excerpt
 *  - Devotional: description
 *
 * Body: { type: 'temple' | 'devotional' | 'blog', dryRun?: boolean }
 * dryRun=true returns preview without saving.
 */
export async function POST(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { type, dryRun = false } = await req.json()
    await connectDB()

    const results: { id: string; title: string; field: string; generated: string }[] = []

    if (type === 'temple' || type === 'all') {
      const temples = await Temple.find({}, 'title description deity city state templeType speciality categories').lean() as any[]
      for (const t of temples) {
        // Auto-generate description if missing or too short
        if (!t.description || t.description.replace(/<[^>]+>/g, '').length < 30) {
          const parts = [t.title]
          if (t.deity) parts.push(`dedicated to ${t.deity}`)
          if (t.city && t.state) parts.push(`located in ${t.city}, ${t.state}`)
          else if (t.state) parts.push(`located in ${t.state}`)
          if (t.templeType) parts.push(`is a ${t.templeType} temple`)
          if (t.speciality) parts.push(`known for ${t.speciality}`)
          const desc = `${parts.join(', ')}. Visit this sacred shrine to experience its spiritual heritage and divine atmosphere. Explore timings, history, and how to reach on Sarvdev.`

          results.push({ id: t._id.toString(), title: t.title, field: 'description', generated: desc })
          if (!dryRun) {
            await Temple.updateOne({ _id: t._id }, { $set: { description: desc } })
          }
        }
      }
    }

    if (type === 'devotional' || type === 'all') {
      const devotionals = await Devotional.find({}, 'title description deity category').lean() as any[]
      for (const d of devotionals) {
        if (!d.description || d.description.length < 20) {
          const parts = [`Listen to ${d.title}`]
          if (d.deity) parts.push(`a devotional offering to ${d.deity}`)
          if (d.category) parts.push(`in the ${d.category} tradition`)
          const desc = `${parts.join(', ')}. Stream or download this sacred chant on Sarvdev for your daily spiritual practice.`

          results.push({ id: d._id.toString(), title: d.title, field: 'description', generated: desc })
          if (!dryRun) {
            await Devotional.updateOne({ _id: d._id }, { $set: { description: desc } })
          }
        }
      }
    }

    if (type === 'blog' || type === 'all') {
      const blogs = await Blog.find({}, 'title excerpt body').lean() as any[]
      for (const b of blogs) {
        if (!b.excerpt || b.excerpt.length < 20) {
          let excerpt = ''
          if (b.body && b.body.length > 30) {
            excerpt = b.body.replace(/<[^>]+>/g, '').slice(0, 155).trim() + '...'
          } else {
            excerpt = `Read "${b.title}" — spiritual insights, temple stories, and cultural wisdom on Sarvdev.`
          }

          results.push({ id: b._id.toString(), title: b.title, field: 'excerpt', generated: excerpt })
          if (!dryRun) {
            await Blog.updateOne({ _id: b._id }, { $set: { excerpt } })
          }
        }
      }
    }

    return NextResponse.json({
      dryRun,
      updated: results.length,
      results,
    })
  } catch (error) {
    console.error('SEO auto-fill error:', error)
    return NextResponse.json({ error: 'Auto-fill failed' }, { status: 500 })
  }
}
