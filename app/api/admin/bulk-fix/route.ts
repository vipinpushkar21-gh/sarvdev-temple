import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Temple from '@/models/Temple'
import Blog from '@/models/Blog'
import { verifyToken, AUTH_COOKIE_NAME } from '@/lib/auth'

function isAdmin(req: NextRequest): boolean {
  const token = req.cookies.get(AUTH_COOKIE_NAME)?.value
  if (!token) return false
  const payload = verifyToken(token)
  return payload?.role === 'admin'
}

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

/**
 * POST /api/admin/bulk-fix
 *
 * Fixes common metadata issues in batch:
 *  - Missing slugs on temples
 *  - Missing slugs on blogs
 *  - Normalize empty strings to undefined
 *  - Set default country to 'India' if missing
 *
 * Body: { dryRun?: boolean }
 */
export async function POST(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { dryRun = false } = await req.json()
    await connectDB()

    const fixes: { id: string; title: string; type: string; fixes: string[] }[] = []

    // Fix missing temple slugs
    const temples = await Temple.find({}, 'title slug country').lean() as any[]
    for (const t of temples) {
      const itemFixes: string[] = []
      const updates: Record<string, any> = {}

      if (!t.slug && t.title) {
        updates.slug = slugify(t.title)
        itemFixes.push(`Added slug: ${updates.slug}`)
      }

      if (!t.country) {
        updates.country = 'India'
        itemFixes.push('Set default country: India')
      }

      if (itemFixes.length > 0) {
        fixes.push({ id: t._id.toString(), title: t.title, type: 'temple', fixes: itemFixes })
        if (!dryRun) {
          await Temple.updateOne({ _id: t._id }, { $set: updates })
        }
      }
    }

    // Fix missing blog slugs
    const blogs = await Blog.find({}, 'title slug').lean() as any[]
    for (const b of blogs) {
      if (!b.slug && b.title) {
        const slug = slugify(b.title)
        fixes.push({ id: b._id.toString(), title: b.title, type: 'blog', fixes: [`Added slug: ${slug}`] })
        if (!dryRun) {
          await Blog.updateOne({ _id: b._id }, { $set: { slug } })
        }
      }
    }

    return NextResponse.json({
      dryRun,
      fixed: fixes.length,
      fixes,
    })
  } catch (error) {
    console.error('Bulk fix error:', error)
    return NextResponse.json({ error: 'Bulk fix failed' }, { status: 500 })
  }
}
