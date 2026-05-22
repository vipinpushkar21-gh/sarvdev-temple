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

type RouteContext = { params: Promise<{ id: string }> }

export async function GET(req: NextRequest, context: RouteContext) {
  const admin = getAdmin(req)
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { id } = await context.params
    await connectDB()
    const icon = await SpiritualIcon.findById(id, { __v: 0 }).lean()
    if (!icon) return NextResponse.json({ error: 'Spiritual icon not found' }, { status: 404 })
    return NextResponse.json(normalizeSpiritualIcon(icon))
  } catch {
    return NextResponse.json({ error: 'Failed to fetch spiritual icon' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, context: RouteContext) {
  const admin = getAdmin(req)
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { id } = await context.params
    await connectDB()
    const current = await SpiritualIcon.findById(id).lean()
    if (!current) return NextResponse.json({ error: 'Spiritual icon not found' }, { status: 404 })

    const body = await req.json()
    const data = normalizeSpiritualIcon({ ...current, ...body })
    if (!data.name) return NextResponse.json({ error: 'Name is required' }, { status: 400 })

    const duplicate = await SpiritualIcon.findOne({ _id: { $ne: id }, $or: [{ slug: data.slug }, { name: data.name }] }).lean()
    if (duplicate) return NextResponse.json({ error: 'Another spiritual icon with this slug or name already exists' }, { status: 409 })

    const icon = await SpiritualIcon.findByIdAndUpdate(id, data, { new: true })
    const action = Boolean((current as any).featured) !== Boolean(data.featured)
      ? data.featured ? 'feature-spiritual-icon' : 'unfeature-spiritual-icon'
      : Boolean((current as any).verified) !== Boolean(data.verified)
        ? data.verified ? 'verify-spiritual-icon' : 'unverify-spiritual-icon'
        : 'update-spiritual-icon'
    await logAction(action, icon, admin, { categorySlug: data.categorySlug, status: data.status })
    return NextResponse.json(normalizeSpiritualIcon(icon?.toObject() || data))
  } catch {
    return NextResponse.json({ error: 'Failed to update spiritual icon' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, context: RouteContext) {
  const admin = getAdmin(req)
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { id } = await context.params
    await connectDB()
    const icon = await SpiritualIcon.findByIdAndUpdate(id, { status: 'inactive' }, { new: true })
    if (!icon) return NextResponse.json({ error: 'Spiritual icon not found' }, { status: 404 })
    await logAction('delete-spiritual-icon', icon, admin, { softDelete: true, status: 'inactive' })
    return NextResponse.json({ success: true, item: normalizeSpiritualIcon(icon.toObject()) })
  } catch {
    return NextResponse.json({ error: 'Failed to disable spiritual icon' }, { status: 500 })
  }
}
