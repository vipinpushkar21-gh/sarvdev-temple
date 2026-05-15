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

type BrokenLink = {
  source: string
  sourceTitle: string
  type: 'temple' | 'devotional' | 'blog'
  field: string
  url: string
  reason: string
}

/**
 * GET /api/admin/broken-links
 *
 * Scans all content for broken image URLs and external links:
 *  - Empty or malformed image URLs
 *  - Image URLs returning non-2xx (checked with HEAD request, limited batch)
 *  - Missing website/social URLs format
 */
export async function GET(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await connectDB()

    const [temples, devotionals, blogs] = await Promise.all([
      Temple.find({}, 'title image images website facebook instagram').lean() as Promise<any[]>,
      Devotional.find({}, 'title audio').lean() as Promise<any[]>,
      Blog.find({}, 'title image').lean() as Promise<any[]>,
    ])

    const broken: BrokenLink[] = []

    // Temple image/link audits
    for (const t of temples) {
      if (t.image && !isValidUrl(t.image)) {
        broken.push({ source: t._id.toString(), sourceTitle: t.title, type: 'temple', field: 'image', url: t.image, reason: 'Malformed URL' })
      }
      if (t.images) {
        for (const img of t.images) {
          if (img && !isValidUrl(img)) {
            broken.push({ source: t._id.toString(), sourceTitle: t.title, type: 'temple', field: 'images', url: img, reason: 'Malformed URL' })
          }
        }
      }
      if (t.website && !isValidUrl(t.website)) {
        broken.push({ source: t._id.toString(), sourceTitle: t.title, type: 'temple', field: 'website', url: t.website, reason: 'Malformed URL' })
      }
      if (t.facebook && !isValidUrl(t.facebook)) {
        broken.push({ source: t._id.toString(), sourceTitle: t.title, type: 'temple', field: 'facebook', url: t.facebook, reason: 'Malformed URL' })
      }
      if (t.instagram && !isValidUrl(t.instagram)) {
        broken.push({ source: t._id.toString(), sourceTitle: t.title, type: 'temple', field: 'instagram', url: t.instagram, reason: 'Malformed URL' })
      }
    }

    // Devotional audio audit
    for (const d of devotionals) {
      if (d.audio && !isValidUrl(d.audio)) {
        broken.push({ source: d._id.toString(), sourceTitle: d.title, type: 'devotional', field: 'audio', url: d.audio, reason: 'Malformed URL' })
      }
    }

    // Blog image audit
    for (const b of blogs) {
      if (b.image && !isValidUrl(b.image)) {
        broken.push({ source: b._id.toString(), sourceTitle: b.title, type: 'blog', field: 'image', url: b.image, reason: 'Malformed URL' })
      }
    }

    // HEAD check a sample of image URLs (max 30 to avoid timeout)
    const imageUrls = [
      ...temples.filter(t => t.image && isValidUrl(t.image)).slice(0, 10).map(t => ({ id: t._id.toString(), title: t.title, type: 'temple' as const, field: 'image', url: t.image })),
      ...devotionals.filter(d => d.audio && isValidUrl(d.audio)).slice(0, 10).map(d => ({ id: d._id.toString(), title: d.title, type: 'devotional' as const, field: 'audio', url: d.audio })),
      ...blogs.filter(b => b.image && isValidUrl(b.image)).slice(0, 10).map(b => ({ id: b._id.toString(), title: b.title, type: 'blog' as const, field: 'image', url: b.image })),
    ]

    const headResults = await Promise.allSettled(
      imageUrls.map(async (item) => {
        try {
          const res = await fetch(item.url, { method: 'HEAD', signal: AbortSignal.timeout(5000) })
          if (!res.ok) {
            return { ...item, reason: `HTTP ${res.status}` }
          }
          return null
        } catch {
          return { ...item, reason: 'Unreachable' }
        }
      })
    )

    for (const result of headResults) {
      if (result.status === 'fulfilled' && result.value) {
        const r = result.value
        broken.push({ source: r.id, sourceTitle: r.title, type: r.type, field: r.field, url: r.url, reason: r.reason })
      }
    }

    return NextResponse.json({
      total: broken.length,
      broken,
      scanned: {
        temples: temples.length,
        devotionals: devotionals.length,
        blogs: blogs.length,
        headChecked: imageUrls.length,
      },
    })
  } catch (error) {
    console.error('Broken link scan error:', error)
    return NextResponse.json({ error: 'Scan failed' }, { status: 500 })
  }
}

function isValidUrl(str: string): boolean {
  try {
    new URL(str)
    return true
  } catch {
    return false
  }
}
