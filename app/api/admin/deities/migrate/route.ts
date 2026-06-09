import { NextRequest, NextResponse } from 'next/server'
import { AUTH_COOKIE_NAME, verifyToken } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import { getDeityMigrationPatch } from '@/lib/deity-normalization'
import ActivityLog from '@/models/ActivityLog'
import Deity from '@/models/Deity'

function getAdmin(req: NextRequest) {
  const token = req.cookies.get(AUTH_COOKIE_NAME)?.value
  if (!token) return null
  const payload = verifyToken(token)
  return payload?.role === 'admin' ? payload : null
}

async function buildMigrationPlan() {
  const records = await Deity.find({}, { __v: 0 }).lean()
  const updates = records
    .map((record: any) => ({
      id: String(record._id),
      name: record.name,
      slug: record.slug,
      patch: getDeityMigrationPatch(record),
    }))
    .filter((item: { patch: Record<string, unknown> }) => Object.keys(item.patch).length > 0)

  const fieldCounts: Record<string, number> = {}
  for (const item of updates) {
    for (const field of Object.keys(item.patch)) {
      fieldCounts[field] = (fieldCounts[field] || 0) + 1
    }
  }

  return {
    scanned: records.length,
    needingUpdates: updates.length,
    fieldCounts,
    sample: updates.slice(0, 25),
    updates,
  }
}

export async function GET(req: NextRequest) {
  const admin = getAdmin(req)
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await connectDB()
  const plan = await buildMigrationPlan()
  return NextResponse.json({
    ok: true,
    dryRun: true,
    scanned: plan.scanned,
    needingUpdates: plan.needingUpdates,
    fieldCounts: plan.fieldCounts,
    sample: plan.sample,
  })
}

export async function POST(req: NextRequest) {
  const admin = getAdmin(req)
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await connectDB()
  const plan = await buildMigrationPlan()
  const ops = plan.updates.map((item: { id: string; patch: Record<string, unknown> }) => ({
    updateOne: {
      filter: { _id: item.id },
      update: { $set: { ...item.patch, updatedAt: new Date() } },
    },
  }))

  let modified = 0
  if (ops.length > 0) {
    const result = await Deity.bulkWrite(ops, { ordered: false })
    modified = result.modifiedCount || 0
  }

  try {
    await ActivityLog.create({
      action: 'migrate-deity-canonical-fields',
      entity: 'deity',
      adminId: admin.id,
      adminName: admin.name || admin.email,
      details: JSON.stringify({
        scanned: plan.scanned,
        needingUpdates: plan.needingUpdates,
        modified,
        fieldCounts: plan.fieldCounts,
      }),
    })
  } catch {
    // Audit logging should not block safe metadata migration.
  }

  return NextResponse.json({
    ok: true,
    dryRun: false,
    scanned: plan.scanned,
    needingUpdates: plan.needingUpdates,
    modified,
    fieldCounts: plan.fieldCounts,
  })
}
