import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Review from '@/models/Review'

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get('slug')
  if (!slug) return NextResponse.json({ error: 'slug required' }, { status: 400 })
  await connectDB()
  const reviews = await Review.find({ templeSlug: slug }).sort({ createdAt: -1 }).limit(50).lean()
  return NextResponse.json(reviews)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { templeSlug, name, rating, comment } = body

    if (!templeSlug || !name?.trim() || !comment?.trim()) {
      return NextResponse.json({ error: 'templeSlug, name and comment required' }, { status: 400 })
    }
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'rating must be 1-5' }, { status: 400 })
    }

    await connectDB()
    const review = await Review.create({
      templeSlug,
      name: name.trim().slice(0, 80),
      rating,
      comment: comment.trim().slice(0, 1000),
    })
    return NextResponse.json(review, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 })
  }
}
