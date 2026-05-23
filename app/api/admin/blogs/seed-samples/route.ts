import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { AUTH_COOKIE_NAME, verifyToken } from '@/lib/auth'
import Blog from '@/models/Blog'
import ActivityLog from '@/models/ActivityLog'
import { SAMPLE_BLOGS } from '@/data/sample-blogs'
import { prepareBlogPayload, slugifyBlog } from '@/lib/blog-utils'

type SeedError = {
  title?: string
  slug?: string
  reason: string
}

function getAdmin(req: NextRequest) {
  const token = req.cookies.get(AUTH_COOKIE_NAME)?.value
  if (!token) return null
  const payload = verifyToken(token)
  return payload?.role === 'admin' ? payload : null
}

function getErrorReason(error: unknown) {
  if (error instanceof Error) return error.message
  return typeof error === 'string' ? error : 'Unknown error'
}

async function logSeedAction(admin: NonNullable<ReturnType<typeof getAdmin>>, details: Record<string, unknown>) {
  try {
    await ActivityLog.create({
      action: 'seed-sample-blogs',
      entity: 'blog',
      adminId: admin.id,
      adminName: admin.name || admin.email,
      details: JSON.stringify(details),
    })
  } catch {
    // Activity logging should never block safe seed imports.
  }
}

export async function POST(req: NextRequest) {
  const admin = getAdmin(req)
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    await connectDB()
  } catch (error) {
    return NextResponse.json({
      ok: false,
      imported: 0,
      skipped: 0,
      failed: SAMPLE_BLOGS.length,
      errors: [{ reason: `Database connection failed: ${getErrorReason(error)}` }],
    }, { status: 500 })
  }

  let imported = 0
  let skipped = 0
  let failed = 0
  const importedSlugs: string[] = []
  const skippedSlugs: string[] = []
  const errors: SeedError[] = []

  for (const sample of SAMPLE_BLOGS) {
    const title = sample.title?.trim()
    const slug = sample.slug?.trim() || slugifyBlog(title || '')

    try {
      if (!title) throw new Error('Missing required title')
      if (!slug) throw new Error('Missing required slug')

      const exists = await Blog.exists({ slug })
      if (exists) {
        skipped += 1
        skippedSlugs.push(slug)
        continue
      }

      const payload = prepareBlogPayload({
        ...sample,
        slug,
        status: 'draft',
        date: '',
        publishedAt: undefined,
        image: '',
        imageCard: '',
        imageHero: '',
        ogImage: '',
      })

      await Blog.create({
        ...payload,
        status: 'draft',
        publishedAt: undefined,
      })

      imported += 1
      importedSlugs.push(slug)
    } catch (error) {
      failed += 1
      errors.push({ title, slug, reason: getErrorReason(error) })
    }
  }

  await logSeedAction(admin, {
    imported,
    skipped,
    failed,
    importedSlugs,
    skippedSlugs,
    errors,
    source: 'safe-sample-blog-drafts',
  })

  return NextResponse.json({
    ok: true,
    imported,
    skipped,
    failed,
    errors,
    importedSlugs,
    skippedSlugs,
    status: 'draft',
  })
}
