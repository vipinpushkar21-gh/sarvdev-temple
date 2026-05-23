import { NextRequest, NextResponse } from 'next/server'
import type { SortOrder } from 'mongoose'
import { connectDB } from '@/lib/db'
import Blog from '@/models/Blog'
import { verifyToken, AUTH_COOKIE_NAME } from '@/lib/auth'
import { prepareBlogPayload, PUBLIC_BLOG_STATUSES, normalizeStatus } from '@/lib/blog-utils'

function isAdmin(req: NextRequest): boolean {
  const token = req.cookies.get(AUTH_COOKIE_NAME)?.value
  if (!token) return false
  const payload = verifyToken(token)
  return payload?.role === 'admin'
}

let publicCache: { data: any[]; ts: number } | null = null
const CACHE_TTL = 60_000

function regex(value: string) {
  return new RegExp(value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')
}

function buildFilter(searchParams: URLSearchParams, adminMode: boolean) {
  const filter: Record<string, any> = adminMode ? {} : { status: { $in: Array.from(PUBLIC_BLOG_STATUSES) } }
  const search = searchParams.get('search')?.trim()
  const category = searchParams.get('category')?.trim()
  const status = searchParams.get('status')?.trim()
  const featured = searchParams.get('featured')?.trim()
  const author = searchParams.get('author')?.trim()

  if (search) {
    const q = regex(search)
    filter.$or = [
      { title: q },
      { titleHi: q },
      { excerpt: q },
      { excerptHi: q },
      { category: q },
      { tags: q },
      { author: q },
    ]
  }
  if (category) filter.category = category
  if (featured === '1' || featured === 'true') filter.featured = true
  if (author) filter.author = author
  if (adminMode && status) filter.status = normalizeStatus(status)

  return filter
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const adminMode = searchParams.get('admin') === '1' || searchParams.get('scope') === 'admin'
    if (adminMode && !isAdmin(req)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const pageParam = searchParams.get('page')
    const limitParam = searchParams.get('limit')
    const hasFilters = ['search', 'category', 'status', 'featured', 'author'].some((key) => searchParams.has(key))

    await connectDB()
    const filter = buildFilter(searchParams, adminMode)
    const sort: Record<string, SortOrder> = adminMode
      ? { createdAt: -1 as const }
      : { featured: -1 as const, publishedAt: -1 as const, createdAt: -1 as const }
    const projection = adminMode ? { __v: 0 } : { content: 0, contentHi: 0, body: 0, __v: 0 }

    if (pageParam) {
      const page = Math.max(1, parseInt(pageParam, 10) || 1)
      const limit = Math.min(100, Math.max(1, parseInt(limitParam || '20', 10)))
      const skip = (page - 1) * limit
      const [items, total] = await Promise.all([
        Blog.find(filter, projection).sort(sort).skip(skip).limit(limit).lean(),
        Blog.countDocuments(filter),
      ])
      return NextResponse.json({ items, total, page, pages: Math.ceil(total / limit), limit })
    }

    if (!adminMode && !hasFilters && publicCache && Date.now() - publicCache.ts < CACHE_TTL) {
      return NextResponse.json(publicCache.data)
    }

    const blogs = await Blog.find(filter, projection).sort(sort).lean()
    if (!adminMode && !hasFilters) publicCache = { data: blogs, ts: Date.now() }
    return NextResponse.json(blogs)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch blogs' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    await connectDB()
    const payload = prepareBlogPayload(await req.json())
    if (!payload.title) return NextResponse.json({ error: 'Title is required' }, { status: 400 })

    const exists = await Blog.exists({ slug: payload.slug })
    if (exists) return NextResponse.json({ error: 'A blog with this slug already exists' }, { status: 409 })

    const blog = await Blog.create(payload)
    publicCache = null
    return NextResponse.json(blog, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to create blog' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    await connectDB()
    const { id, ...rawUpdate } = await req.json()
    if (!id) return NextResponse.json({ error: 'Blog id is required' }, { status: 400 })

    const existing = await Blog.findById(id).lean()
    if (!existing) return NextResponse.json({ error: 'Blog not found' }, { status: 404 })

    const update = prepareBlogPayload({ ...existing, ...rawUpdate })
    if (update.slug) {
      const duplicate = await Blog.exists({ slug: update.slug, _id: { $ne: id } })
      if (duplicate) return NextResponse.json({ error: 'A blog with this slug already exists' }, { status: 409 })
    }

    const blog = await Blog.findByIdAndUpdate(id, update, { new: true })

    publicCache = null
    return NextResponse.json(blog)
  } catch {
    return NextResponse.json({ error: 'Failed to update blog' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    await connectDB()
    const { id } = await req.json()
    const blog = await Blog.findByIdAndUpdate(id, { status: 'archived' }, { new: true })
    if (!blog) return NextResponse.json({ error: 'Blog not found' }, { status: 404 })

    publicCache = null
    return NextResponse.json({ success: true, archived: true })
  } catch {
    return NextResponse.json({ error: 'Failed to archive blog' }, { status: 500 })
  }
}
