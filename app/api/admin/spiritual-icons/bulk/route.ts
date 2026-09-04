import { NextRequest, NextResponse } from 'next/server'
import { isValidObjectId } from 'mongoose'
import { AUTH_COOKIE_NAME, verifyToken } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import ActivityLog from '@/models/ActivityLog'
import SpiritualIcon from '@/models/SpiritualIcon'

const MAX_BULK_IDS = 1_000
const bulkActions = ['approve', 'draft', 'disable', 'delete'] as const
type BulkAction = (typeof bulkActions)[number]

function getAdmin(req: NextRequest) {
  const token = req.cookies.get(AUTH_COOKIE_NAME)?.value
  const payload = token ? verifyToken(token) : null
  return payload?.role === 'admin' ? payload : null
}

function parseIds(value: unknown): string[] | null {
  if (!Array.isArray(value)) return null
  const ids = Array.from(new Set(value.filter((item): item is string => typeof item === 'string').map((id) => id.trim()).filter(Boolean)))
  if (!ids.length || ids.length > MAX_BULK_IDS || ids.some((id) => !isValidObjectId(id))) return null
  return ids
}

export async function POST(req: NextRequest) {
  const admin = getAdmin(req)
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json().catch(() => null)
  const action = body?.action as BulkAction | undefined
  const ids = parseIds(body?.ids)
  if (!action || !bulkActions.includes(action) || !ids) {
    return NextResponse.json({ error: 'Provide a valid bulk action and up to 1,000 selected record IDs.' }, { status: 400 })
  }

  try {
    await connectDB()
    const filter = { _id: { $in: ids } }
    const affected = action === 'delete'
      ? (await SpiritualIcon.deleteMany(filter)).deletedCount
      : (await SpiritualIcon.updateMany(filter, { $set: { status: action === 'approve' ? 'active' : action === 'draft' ? 'draft' : 'inactive', updatedAt: new Date() } })).modifiedCount
    await ActivityLog.create({
      action: `bulk-${action}-spiritual-icons`,
      entity: 'spiritual-icon',
      entityId: ids.join(','),
      entityTitle: `${affected} selected spiritual icons`,
      adminId: admin.id,
      adminName: admin.name,
      details: JSON.stringify({ action, requested: ids.length, affected }),
    })

    return NextResponse.json({ success: true, action, affected })
  } catch {
    return NextResponse.json({ error: 'Bulk action failed.' }, { status: 500 })
  }
}
