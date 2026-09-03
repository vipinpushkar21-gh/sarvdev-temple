import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { AUTH_COOKIE_NAME, verifyToken } from '@/lib/auth'
import { sanitizeImageUrl } from '@/lib/imageGuard'
import ActivityLog from '@/models/ActivityLog'
import Darshan from '@/models/Darshan'
import { buildCursorFilter, paginateCursor, parseCursorLimit, DARSHAN_CARD_PROJ } from '@/lib/cursor-pagination'
import { normalizeMediaAsset } from '@/lib/media-asset'
import { extractYoutubeId, getCanonicalProvider, normalizeDarshanRelationSlug, normalizeDarshanSlug } from '@/lib/darshan-stream'

type AdminPayload = NonNullable<ReturnType<typeof verifyToken>>

const PUBLIC_ACTIVE_STATUSES = ['active', 'approved']
const ALL_STATUSES = new Set(['active', 'inactive', 'draft', 'approved', 'pending', 'rejected'])
const ALL_DARSHAN_TYPES = new Set(['live', 'recorded', 'upcoming'])

let publicCache: { data: any[]; ts: number } | null = null
const CACHE_TTL = 60_000

function getAdmin(req: NextRequest): AdminPayload | null {
  const token = req.cookies.get(AUTH_COOKIE_NAME)?.value
  if (!token) return null
  const payload = verifyToken(token)
  return payload?.role === 'admin' ? payload : null
}

function cleanString(value: unknown, max = 2000) {
  return typeof value === 'string' ? value.trim().slice(0, max) : ''
}

function cleanNumber(value: unknown, fallback = 999) {
  const n = Number(value)
  return Number.isFinite(n) ? n : fallback
}

function cleanBool(value: unknown) {
  return value === true || value === 'true'
}

function cleanStringArray(value: unknown) {
  if (Array.isArray(value)) return value.map((item) => cleanString(item, 40)).filter(Boolean)
  if (typeof value === 'string') {
    return value.split(',').map((item) => cleanString(item, 40)).filter(Boolean)
  }
  return []
}

function normalizeDarshanInput(input: Record<string, unknown>) {
  const darshanType = cleanString(input.darshanType || input.type, 20)
  const status = cleanString(input.status, 20)
  const title = cleanString(input.title, 180)
  const templeName = cleanString(input.templeName || input.temple, 180)
  const youtubeUrl = cleanString(input.youtubeUrl, 500)
  const videoUrl = cleanString(input.videoUrl || input.video || input.media, 500)
  const externalUrl = cleanString(input.externalUrl, 500)
  const thumbnail = sanitizeImageUrl(cleanString(input.thumbnail, 500))
  const imageCard = sanitizeImageUrl(cleanString(input.imageCard || input.image || thumbnail, 500))
  const imageHero = sanitizeImageUrl(cleanString(input.imageHero, 500))
  const ogImage = sanitizeImageUrl(cleanString(input.ogImage || imageHero || imageCard || thumbnail, 500))
  const isLive = cleanBool(input.isLive)
  const isFeatured = cleanBool(input.isFeatured ?? input.featured)

  return {
    title,
    slug: normalizeDarshanSlug(input.slug || title),
    titleHi: cleanString(input.titleHi, 180),
    temple: templeName,
    templeName,
    templeNameHi: cleanString(input.templeNameHi, 180),
    deity: cleanString(input.deity, 120),
    deityHi: cleanString(input.deityHi, 120),
    location: cleanString(input.location, 180),
    city: cleanString(input.city, 100),
    state: cleanString(input.state, 100),
    description: cleanString(input.description, 5000),
    descriptionHi: cleanString(input.descriptionHi, 5000),
    videoUrl,
    video: videoUrl,
    youtubeUrl,
    youtubeId: extractYoutubeId(input.youtubeId) || extractYoutubeId(youtubeUrl) || extractYoutubeId(videoUrl) || extractYoutubeId(externalUrl),
    provider: getCanonicalProvider({ ...input, youtubeUrl, videoUrl }),
    media: videoUrl,
    thumbnail,
    primaryMedia: normalizeMediaAsset(input.primaryMedia, 'darshan') ?? null,
    image: imageCard || thumbnail,
    imageCard,
    cardMedia: normalizeMediaAsset(input.cardMedia, 'darshan') ?? null,
    imageHero,
    heroMedia: normalizeMediaAsset(input.heroMedia, 'darshan') ?? null,
    darshanType: ALL_DARSHAN_TYPES.has(darshanType) ? darshanType : isLive ? 'live' : 'recorded',
    type: ALL_DARSHAN_TYPES.has(darshanType) ? darshanType : isLive ? 'live' : 'recorded',
    isLive,
    isFeatured,
    featured: isFeatured,
    priority: cleanNumber(input.priority, 999),
    status: ALL_STATUSES.has(status) ? status : 'draft',
    darshanDate: cleanString(input.darshanDate || input.date, 40),
    date: cleanString(input.darshanDate || input.date, 40),
    startTime: cleanString(input.startTime || input.time, 40),
    time: cleanString(input.startTime || input.time, 80),
    endTime: cleanString(input.endTime, 40),
    repeatDays: cleanStringArray(input.repeatDays),
    scheduleRule: cleanString(input.scheduleRule, 20) === 'recurring' ? 'recurring' : 'one-time',
    timezone: cleanString(input.timezone, 80) || 'Asia/Kolkata',
    schedule: cleanString(input.schedule, 180),
    festivalTag: cleanString(input.festivalTag, 120),
    templeSlug: normalizeDarshanRelationSlug(input.templeSlug),
    deitySlug: normalizeDarshanRelationSlug(input.deitySlug),
    relatedDevotionalSlug: cleanString(input.relatedDevotionalSlug, 160),
    externalUrl,
    metaTitle: cleanString(input.metaTitle, 80),
    metaDescription: cleanString(input.metaDescription, 180),
    ogImage,
    ogMedia: normalizeMediaAsset(input.ogMedia, 'darshan') ?? null,
  }
}

function getPublicFilter() {
  return {
    $or: [
      { status: { $in: PUBLIC_ACTIVE_STATUSES } },
      { status: { $exists: false } },
      { status: '' },
    ],
  }
}

function buildAdminFilter(searchParams: URLSearchParams) {
  const filter: Record<string, any> = {}
  const status = searchParams.get('status')
  const darshanType = searchParams.get('darshanType') || searchParams.get('type')
  const deity = searchParams.get('deity')
  const templeSlug = searchParams.get('templeSlug')
  const deitySlug = searchParams.get('deitySlug')
  const state = searchParams.get('state')
  const featured = searchParams.get('featured')
  const q = searchParams.get('q')?.trim()

  if (status) filter.status = status
  if (darshanType) filter.darshanType = darshanType
  if (deity) filter.deity = new RegExp(deity, 'i')
  if (templeSlug) filter.templeSlug = normalizeDarshanRelationSlug(templeSlug)
  if (deitySlug) filter.deitySlug = normalizeDarshanRelationSlug(deitySlug)
  if (state) filter.state = new RegExp(state, 'i')
  if (featured === 'true') filter.isFeatured = true
  if (q) {
    const regex = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')
    filter.$or = [
      { title: regex },
      { titleHi: regex },
      { templeName: regex },
      { temple: regex },
      { deity: regex },
      { city: regex },
      { state: regex },
      { location: regex },
    ]
  }

  return filter
}

function buildPublicFilter(searchParams: URLSearchParams) {
  const filter: Record<string, any> = getPublicFilter()
  const status = searchParams.get('status')
  const darshanType = searchParams.get('darshanType')
  const templeSlug = searchParams.get('templeSlug')
  const deitySlug = searchParams.get('deitySlug')
  const state = searchParams.get('state')
  if (status && PUBLIC_ACTIVE_STATUSES.includes(status)) filter.status = status
  if (darshanType && ALL_DARSHAN_TYPES.has(darshanType)) filter.darshanType = darshanType
  if (templeSlug) filter.templeSlug = normalizeDarshanRelationSlug(templeSlug)
  if (deitySlug) filter.deitySlug = normalizeDarshanRelationSlug(deitySlug)
  if (state) filter.state = new RegExp(state.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')
  if (searchParams.get('featured') === 'true') filter.isFeatured = true
  return filter
}

async function logDarshanAction(action: string, darshan: any, admin: AdminPayload, details?: Record<string, unknown>) {
  try {
    await ActivityLog.create({
      action,
      entity: 'darshan',
      entityId: String(darshan?._id || ''),
      entityTitle: darshan?.title || '',
      adminId: admin.id,
      adminName: admin.name,
      details: JSON.stringify(details || {}),
    })
  } catch {
    // Logging should never block admin content management.
  }
}

async function makeUniqueSlug(base: string, exceptId?: string) {
  const root = normalizeDarshanSlug(base) || `darshan-${Date.now()}`
  let slug = root
  let suffix = 2
  while (await Darshan.exists({ slug, ...(exceptId ? { _id: { $ne: exceptId } } : {}) })) slug = `${root}-${suffix++}`
  return slug
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const adminMode = searchParams.get('admin') === '1' || searchParams.get('scope') === 'admin'
    const admin = adminMode ? getAdmin(req) : null

    if (adminMode && !admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const pageParam = searchParams.get('page')
    const limitParam = searchParams.get('limit')
    const idParam = searchParams.get('id')
    const filter = adminMode ? buildAdminFilter(searchParams) : buildPublicFilter(searchParams)
    const sort = { isLive: -1, isFeatured: -1, featured: -1, priority: 1, createdAt: -1 } as const

    await connectDB()

    if (idParam) {
      const item = await Darshan.findOne({ ...filter, _id: idParam }, { __v: 0 }).lean()
      return NextResponse.json(item || null)
    }

    // ── Cursor-based pagination (scale mode) ──
    if (searchParams.has('cursor')) {
      const cursorToken = searchParams.get('cursor') || undefined
      const cursorLimit = parseCursorLimit(limitParam, 20)
      const cursorFilter = buildCursorFilter(cursorToken, filter)
      const docs = await Darshan.find(cursorFilter, adminMode ? { __v: 0 } : DARSHAN_CARD_PROJ)
        .sort({ createdAt: -1, _id: -1 })
        .limit(cursorLimit + 1)
        .lean()
      const result = paginateCursor(docs as any[], cursorLimit)
      return NextResponse.json(result, { headers: { 'Cache-Control': adminMode ? 'no-store' : 'public, s-maxage=60, stale-while-revalidate=120' } })
    }

    if (pageParam) {
      const page = Math.max(1, parseInt(pageParam, 10) || 1)
      const limit = Math.min(100, Math.max(1, parseInt(limitParam || '20', 10)))
      const skip = (page - 1) * limit
      const [items, total] = await Promise.all([
        Darshan.find(filter, adminMode ? { __v: 0 } : DARSHAN_CARD_PROJ).sort(sort).skip(skip).limit(limit).lean(),
        Darshan.countDocuments(filter),
      ])

      return NextResponse.json({ items, data: items, total, page, pages: Math.ceil(total / limit), limit, hasMore: page * limit < total }, { headers: { 'Cache-Control': adminMode ? 'no-store' : 'public, s-maxage=60, stale-while-revalidate=120' } })
    }

    if (!adminMode && publicCache && Date.now() - publicCache.ts < CACHE_TTL) {
      return NextResponse.json(publicCache.data)
    }

    const legacyLimit = Math.min(100, Math.max(1, parseInt(limitParam || (adminMode ? '50' : '30'), 10) || 30))
    const darshan = await Darshan.find(filter, adminMode ? { __v: 0 } : DARSHAN_CARD_PROJ).sort(sort).limit(legacyLimit).lean()
    if (!adminMode) publicCache = { data: darshan, ts: Date.now() }
    return NextResponse.json(darshan, { headers: { 'Cache-Control': adminMode ? 'no-store' : 'public, s-maxage=60, stale-while-revalidate=120' } })
  } catch (error) {
    console.error('Darshan API Error:', error)
    return NextResponse.json({ error: 'Failed to fetch darshan' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const admin = getAdmin(req)
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    await connectDB()
    const body = await req.json()
    const data = normalizeDarshanInput(body || {})
    if (!data.title) return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    data.slug = await makeUniqueSlug(data.slug || data.title)

    const darshan = await Darshan.create(data)
    publicCache = null
    await logDarshanAction('create-darshan', darshan, admin, { status: data.status, darshanType: data.darshanType })
    return NextResponse.json(darshan, { status: 201 })
  } catch (error) {
    console.error('Create darshan error:', error)
    return NextResponse.json({ error: 'Failed to create darshan' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  const admin = getAdmin(req)
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    await connectDB()
    const { id, ...body } = await req.json()
    if (!id) return NextResponse.json({ error: 'Darshan id is required' }, { status: 400 })

    const current = await Darshan.findById(id).lean()
    if (!current) return NextResponse.json({ error: 'Darshan not found' }, { status: 404 })

    const update = normalizeDarshanInput({ ...current, ...body })
    update.slug = await makeUniqueSlug(update.slug || update.title, id)
    const darshan = await Darshan.findByIdAndUpdate(id, update, { new: true })
    publicCache = null

    const wasFeatured = Boolean((current as any).isFeatured ?? (current as any).featured)
    const isFeatured = Boolean((darshan as any).isFeatured ?? (darshan as any).featured)
    const action = wasFeatured !== isFeatured
      ? isFeatured ? 'feature-darshan' : 'unfeature-darshan'
      : 'update-darshan'
    await logDarshanAction(action, darshan, admin, { status: update.status, darshanType: update.darshanType })

    return NextResponse.json(darshan)
  } catch (error) {
    console.error('Update darshan error:', error)
    return NextResponse.json({ error: 'Failed to update darshan' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  const admin = getAdmin(req)
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    await connectDB()
    const { id } = await req.json()
    if (!id) return NextResponse.json({ error: 'Darshan id is required' }, { status: 400 })

    const darshan = await Darshan.findByIdAndDelete(id)
    if (!darshan) return NextResponse.json({ error: 'Darshan not found' }, { status: 404 })

    publicCache = null
    await logDarshanAction('delete-darshan', darshan, admin, {})
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete darshan error:', error)
    return NextResponse.json({ error: 'Failed to delete darshan' }, { status: 500 })
  }
}
