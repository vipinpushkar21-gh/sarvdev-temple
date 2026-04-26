import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import ForumPost from '@/models/ForumPost'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()
    const post = await ForumPost.findByIdAndUpdate(
      params.id,
      { $inc: { views: 1 } },
      { new: true, fields: { __v: 0 } }
    ).lean()
    if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    return NextResponse.json(post)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 })
  }
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()
    const { content, authorName } = await req.json()
    if (!content?.trim()) return NextResponse.json({ error: 'Content required' }, { status: 400 })

    const post = await ForumPost.findByIdAndUpdate(
      params.id,
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

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()
    const body = await req.json()

    if (body.action === 'like') {
      const post = await ForumPost.findByIdAndUpdate(
        params.id,
        { $inc: { likes: 1 } },
        { new: true, fields: { likes: 1 } }
      ).lean()
      if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 })
      return NextResponse.json(post)
    }

    if (body.action === 'admin') {
      const { isPinned, isApproved } = body
      const post = await ForumPost.findByIdAndUpdate(
        params.id,
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

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()
    const post = await ForumPost.findByIdAndDelete(params.id)
    if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 })
  }
}
