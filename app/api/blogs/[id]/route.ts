import mongoose from 'mongoose'
import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Blog from '@/models/Blog'
import { AUTH_COOKIE_NAME, verifyToken } from '@/lib/auth'
import { PUBLIC_BLOG_STATUSES } from '@/lib/blog-utils'

function isAdmin(request: NextRequest) {
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value
  if (!token) return false
  const payload = verifyToken(token)
  return payload?.role === 'admin'
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await connectDB()

    const lookup: Record<string, any>[] = [{ slug: id }]
    if (mongoose.Types.ObjectId.isValid(id)) lookup.push({ _id: id })

    const filter: Record<string, any> = { $or: lookup }
    if (!isAdmin(request)) filter.status = { $in: Array.from(PUBLIC_BLOG_STATUSES) }

    const blog = await Blog.findOne(filter, { __v: 0 }).lean()
    if (!blog) return NextResponse.json({ error: 'Blog not found' }, { status: 404 })

    return NextResponse.json(blog)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch blog' }, { status: 500 })
  }
}
