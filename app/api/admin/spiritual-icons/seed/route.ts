import { NextRequest, NextResponse } from 'next/server'
import { AUTH_COOKIE_NAME, verifyToken } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import { getStaticSpiritualIconsForSeed } from '@/lib/spiritual-icons'
import ActivityLog from '@/models/ActivityLog'
import SpiritualIcon from '@/models/SpiritualIcon'

function getAdmin(req: NextRequest) {
  const token = req.cookies.get(AUTH_COOKIE_NAME)?.value
  if (!token) return null
  const payload = verifyToken(token)
  return payload?.role === 'admin' ? payload : null
}

export async function POST(req: NextRequest) {
  const admin = getAdmin(req)
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    await connectDB()
    const records = getStaticSpiritualIconsForSeed()
    let imported = 0
    let skipped = 0
    const skippedSlugs: string[] = []

    for (const record of records) {
      const exists = await SpiritualIcon.findOne({ $or: [{ slug: record.slug }, { name: record.name }] }, { _id: 1 }).lean()
      if (exists) {
        skipped += 1
        skippedSlugs.push(record.slug)
        continue
      }
      await SpiritualIcon.create(record)
      imported += 1
    }

    await ActivityLog.create({
      action: 'seed-spiritual-icons',
      entity: 'spiritual-icon',
      adminId: admin.id,
      adminName: admin.name,
      details: JSON.stringify({ imported, skipped, source: 'static-spiritual-icons' }),
    })

    return NextResponse.json({ ok: true, imported, skipped, skippedSlugs })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to seed spiritual icons' }, { status: 500 })
  }
}
