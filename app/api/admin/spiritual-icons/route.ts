import { NextRequest, NextResponse } from 'next/server'
import { AUTH_COOKIE_NAME, verifyToken } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import { normalizeSpiritualIcon } from '@/lib/spiritual-icons'
import ActivityLog from '@/models/ActivityLog'
import SpiritualIcon from '@/models/SpiritualIcon'

type AdminPayload = NonNullable<ReturnType<typeof verifyToken>>

function getAdmin(req: NextRequest): AdminPayload | null {
  const token = req.cookies.get(AUTH_COOKIE_NAME)?.value
  if (!token) return null
  const payload = verifyToken(token)
  return payload?.role === 'admin' ? payload : null
}

async function logAction(action: string, icon: any, admin: AdminPayload, details?: Record<string, unknown>) {
  try {
    await ActivityLog.create({
      action,
      entity: 'spiritual-icon',
      entityId: String(icon?._id || ''),
      entityTitle: icon?.name || '',
      adminId: admin.id,
      adminName: admin.name,
      details: JSON.stringify(details || {}),
    })
  } catch {}
}

function buildAdminFilter(searchParams: URLSearchParams) {
  const filter: Record<string, any> = {}
  const status = searchParams.get('status')
  const category = searchParams.get('category')
  const state = searchParams.get('state')
  const verified = searchParams.get('verified')
  const featured = searchParams.get('featured')
  const q = searchParams.get('q') || searchParams.get('search')

  if (status) filter.status = status
  if (category) filter.categorySlug = category
  if (state) filter.state = state
  if (verified === 'true') filter.verified = true
  if (verified === 'false') filter.verified = false
  if (featured === 'true') filter.featured = true
  if (featured === 'false') filter.featured = false
  if (q?.trim()) {
    const regex = new RegExp(q.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')
    filter.$or = [
      { name: regex },
      { nameHi: regex },
      { title: regex },
      { category: regex },
      { city: regex },
      { state: regex },
      { location: regex },
      { specializations: regex },
    ]
  }

  return filter
}

export async function GET(req: NextRequest) {
  const admin = getAdmin(req)
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { searchParams } = new URL(req.url)
    const pageParam = searchParams.get('page')
    const limitParam = searchParams.get('limit')
    const filter = buildAdminFilter(searchParams)
    await connectDB()

    if (pageParam) {
      const page = Math.max(1, parseInt(pageParam, 10) || 1)
      const limit = Math.min(100, Math.max(1, parseInt(limitParam || '25', 10)))
      const skip = (page - 1) * limit
      const [items, total] = await Promise.all([
        SpiritualIcon.find(filter, { __v: 0 }).sort({ featured: -1, priority: 1, name: 1 }).skip(skip).limit(limit).lean(),
        SpiritualIcon.countDocuments(filter),
      ])
      return NextResponse.json({ items: items.map(normalizeSpiritualIcon), total, page, pages: Math.ceil(total / limit), limit })
    }

    const items = await SpiritualIcon.find(filter, { __v: 0 }).sort({ featured: -1, priority: 1, name: 1 }).lean()
    return NextResponse.json(items.map(normalizeSpiritualIcon))
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch spiritual icons' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const admin = getAdmin(req)
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    await connectDB()
    const body = await req.json()
    const data = normalizeSpiritualIcon(body || {})
    if (!data.name) return NextResponse.json({ error: 'Name is required' }, { status: 400 })

    const existing = await SpiritualIcon.findOne({ $or: [{ slug: data.slug }, { name: data.name }] }).lean()
    if (existing) return NextResponse.json({ error: 'A spiritual icon with this slug or name already exists' }, { status: 409 })

    const icon = await SpiritualIcon.create(data)
    await logAction('create-spiritual-icon', icon, admin, { categorySlug: data.categorySlug, status: data.status })
    return NextResponse.json(normalizeSpiritualIcon(icon.toObject()), { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create spiritual icon' }, { status: 500 })
  }
}
