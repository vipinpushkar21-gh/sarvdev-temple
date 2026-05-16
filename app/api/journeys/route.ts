import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Journey from '@/models/Journey'
import { verifyToken, AUTH_COOKIE_NAME } from '@/lib/auth'

function getUserId(req: NextRequest): string | null {
  const token = req.cookies.get(AUTH_COOKIE_NAME)?.value
  if (!token) return null
  const payload = verifyToken(token)
  return payload?.id || null
}

/**
 * GET /api/journeys — List user's journeys
 * POST /api/journeys — Create a new journey
 * PUT /api/journeys — Update journey (add temple, mark visited, edit)
 * DELETE /api/journeys — Delete a journey
 */
export async function GET(req: NextRequest) {
  const userId = getUserId(req)
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    await connectDB()
    const journeys = await Journey.find({ userId }).sort({ updatedAt: -1 }).lean()
    return NextResponse.json(journeys)
  } catch (error) {
    console.error('Journey list error:', error)
    return NextResponse.json([], { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const userId = getUserId(req)
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    await connectDB()
    const { title, description, type, temples } = await req.json()

    if (!title?.trim()) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    const journey = await Journey.create({
      userId,
      title: title.trim(),
      description: description?.trim() || '',
      type: type || 'custom',
      temples: (temples || []).map((t: any, i: number) => ({
        templeId: t.templeId,
        title: t.title,
        visited: false,
        order: i,
      })),
    })

    return NextResponse.json(journey, { status: 201 })
  } catch (error) {
    console.error('Journey create error:', error)
    return NextResponse.json({ error: 'Failed to create journey' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  const userId = getUserId(req)
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    await connectDB()
    const { id, action, ...data } = await req.json()

    if (!id) return NextResponse.json({ error: 'Journey ID required' }, { status: 400 })

    const journey = await Journey.findOne({ _id: id, userId })
    if (!journey) return NextResponse.json({ error: 'Journey not found' }, { status: 404 })

    if (action === 'add-temple' && data.temple) {
      journey.temples.push({
        templeId: data.temple.templeId,
        title: data.temple.title,
        visited: false,
        order: journey.temples.length,
      })
    } else if (action === 'mark-visited' && data.templeId) {
      const t = journey.temples.find((t: any) => t.templeId?.toString() === data.templeId)
      if (t) { t.visited = true; t.visitedAt = new Date(); if (data.notes) t.notes = data.notes }
    } else if (action === 'update-info') {
      if (data.title) journey.title = data.title
      if (data.description !== undefined) journey.description = data.description
      if (data.status) journey.status = data.status
      if (data.isPublic !== undefined) journey.isPublic = data.isPublic
    }

    journey.updatedAt = new Date()
    await journey.save()
    return NextResponse.json(journey)
  } catch (error) {
    console.error('Journey update error:', error)
    return NextResponse.json({ error: 'Failed to update journey' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  const userId = getUserId(req)
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    await connectDB()
    const { id } = await req.json()
    if (!id) return NextResponse.json({ error: 'Journey ID required' }, { status: 400 })

    await Journey.deleteOne({ _id: id, userId })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Journey delete error:', error)
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
  }
}
