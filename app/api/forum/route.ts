import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import ForumPost from '@/models/ForumPost'

export async function GET(req: NextRequest) {
  try {
    await connectDB()
    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category') || ''
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '20', 10)
    const skip = (page - 1) * limit

    const filter: Record<string, unknown> = { isApproved: true }
    if (category) filter.category = category

    const [posts, total] = await Promise.all([
      ForumPost.find(filter, { content: 0, __v: 0 })
        .sort({ isPinned: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      ForumPost.countDocuments(filter),
    ])

    return NextResponse.json({ posts, total, page, pages: Math.ceil(total / limit) })
  } catch (error) {
    console.error('Forum GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const body = await req.json()
    const { title, content, category, authorName, authorEmail, tags } = body

    if (!title?.trim() || !content?.trim()) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 })
    }

    const post = await ForumPost.create({
      title: title.trim().slice(0, 200),
      content: content.trim(),
      category: category || 'general',
      authorName: authorName?.trim() || 'Anonymous',
      authorEmail: authorEmail?.trim() || '',
      tags: Array.isArray(tags) ? tags.slice(0, 5) : [],
    })

    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    console.error('Forum POST error:', error)
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 })
  }
}
