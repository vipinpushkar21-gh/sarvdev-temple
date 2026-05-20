import { NextRequest, NextResponse } from 'next/server'
import { Types } from 'mongoose'
import { connectDB } from '@/lib/db'
import Temple from '@/models/Temple'
import { verifyToken, AUTH_COOKIE_NAME } from '@/lib/auth'
import { buildTempleSuggestions, TempleSuggestionInput, TempleSuggestions } from '@/lib/temple-suggestions'

const TEMPLE_SELECT = [
  'title',
  'titleHi',
  'deity',
  'templeType',
  'templeTypes',
  'categories',
  'sacredCategories',
  'city',
  'state',
  'image',
  'timings',
  'timingSlots',
  'speciality',
  'metaTitle',
  'metaDescription',
  'metaKeywords',
  'ogImage',
  'createdAt',
].join(' ')

type TempleDocument = TempleSuggestionInput & {
  _id: unknown
  title?: unknown
  titleHi?: unknown
  city?: unknown
  state?: unknown
  image?: unknown
}

type SuggestionPreview = {
  temple: {
    id: string
    title: string
    titleHi?: string
    city?: string
    state?: string
    deity?: string
    image?: string
  }
  suggestions: TempleSuggestions
}

function isAdmin(req: NextRequest): boolean {
  const token = req.cookies.get(AUTH_COOKIE_NAME)?.value
  if (!token) return false
  const payload = verifyToken(token)
  return payload?.role === 'admin'
}

function stringValue(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

function previewForTemple(temple: TempleDocument): SuggestionPreview {
  const id = String(temple._id)

  return {
    temple: {
      id,
      title: stringValue(temple.title) || 'Untitled temple',
      titleHi: stringValue(temple.titleHi) || undefined,
      city: stringValue(temple.city) || undefined,
      state: stringValue(temple.state) || undefined,
      deity: stringValue(temple.deity) || undefined,
      image: stringValue(temple.image) || undefined,
    },
    suggestions: buildTempleSuggestions(temple),
  }
}

function parseLimit(value: string | null): number {
  const parsed = Number(value || 20)
  if (!Number.isFinite(parsed)) return 20
  return Math.min(Math.max(Math.trunc(parsed), 1), 100)
}

/**
 * GET /api/admin/temples/suggestions?id=<templeId>
 * GET /api/admin/temples/suggestions?limit=20
 *
 * Returns deterministic, rule-based temple metadata suggestions only.
 * This endpoint never writes to MongoDB and never calls AI providers.
 */
export async function GET(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await connectDB()

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (id) {
      if (!Types.ObjectId.isValid(id)) {
        return NextResponse.json({ error: 'Invalid temple id' }, { status: 400 })
      }

      const temple = (await Temple.findById(id).select(TEMPLE_SELECT).lean()) as TempleDocument | null
      if (!temple) {
        return NextResponse.json({ error: 'Temple not found' }, { status: 404 })
      }

      return NextResponse.json(previewForTemple(temple))
    }

    const limit = parseLimit(searchParams.get('limit'))
    const temples = (await Temple.find({})
      .select(TEMPLE_SELECT)
      .sort({ createdAt: -1 })
      .lean()) as TempleDocument[]

    const items = temples
      .map(previewForTemple)
      .filter(item => Object.keys(item.suggestions).length > 0)
      .slice(0, limit)

    return NextResponse.json({
      count: items.length,
      limit,
      items,
    })
  } catch (error) {
    console.error('Temple suggestions preview error:', error)
    return NextResponse.json({ error: 'Temple suggestions preview failed' }, { status: 500 })
  }
}
