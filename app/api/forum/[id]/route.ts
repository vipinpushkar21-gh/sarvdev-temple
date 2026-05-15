import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import ForumPost from '@/models/ForumPost'

type RouteContext = { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, ctx: RouteContext) {
  try {
    const { id } = await ctx.params
    await connectDB()
    const post = await ForumPost.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true, fields: { __v: 0 } }
    ).lean()
    if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    return NextResponse.json(post)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 })
  }
}

export async function POST(req: NextRequest, ctx: RouteContext) {
  try {
    const { id } = await ctx.params
    await connectDB()
    const { content, authorName } = await req.json()
    if (!content?.trim()) return NextResponse.json({ error: 'Content required' }, { status: 400 })

    const post = await ForumPost.findByIdAndUpdate(
      id,
      {
        $push: {
          replies: {
            content: content.trim(),
            authorName: authorName?.trim() || 'Anonymous',
            createdAt: new Date(),
          },
        },
      },
      { new: true, fields: { __v: 0 } }
    ).lean()

    if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    return NextResponse.json(post)
  } catch {
    return NextResponse.json({ error: 'Failed to add reply' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, ctx: RouteContext) {
  try {
    const { id } = await ctx.params
    await connectDB()
    const body = await req.json()

    if (body.action === 'like') {
      const post = await ForumPost.findByIdAndUpdate(
        id,
        { $inc: { likes: 1 } },
        { new: true, fields: { likes: 1 } }
      ).lean()
      if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 })
      return NextResponse.json(post)
    }

    if (body.action === 'admin') {
      const { isPinned, isApproved } = body
      const post = await ForumPost.findByIdAndUpdate(
        id,
        { $set: { isPinned, isApproved } },
        { new: true }
      ).lean()
      if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 })
      return NextResponse.json(post)
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
  } catch {
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, ctx: RouteContext) {
  try {
    const { id } = await ctx.params
    await connectDB()
    const post = await ForumPost.findByIdAndDelete(id)
    if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 })
  }
}
