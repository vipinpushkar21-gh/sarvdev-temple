import { NextRequest, NextResponse } from 'next/server'
import { AUTH_COOKIE_NAME, verifyToken } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import TempleImportSession from '@/models/TempleImportSession'

function getAdmin(req: NextRequest) {
  const token = req.cookies.get(AUTH_COOKIE_NAME)?.value
  if (!token) return null
  const payload = verifyToken(token)
  return payload?.role === 'admin' ? payload : null
}

function toPositiveInt(value: string | null, fallback: number, max: number) {
  const parsed = Number(value || '')
  if (!Number.isFinite(parsed) || parsed < 1) return fallback
  return Math.min(Math.floor(parsed), max)
}

export async function GET(req: NextRequest) {
  const admin = getAdmin(req)
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const page = toPositiveInt(searchParams.get('page'), 1, 100000)
  const limit = toPositiveInt(searchParams.get('limit'), 20, 100)
  const skip = (page - 1) * limit

  await connectDB()
  const [sessions, total] = await Promise.all([
    TempleImportSession.find({}, {
      dryRunReport: 0,
      errorRows: { $slice: 10 },
      warningRows: { $slice: 10 },
      __v: 0,
    }).sort({ startedAt: -1 }).skip(skip).limit(limit).lean(),
    TempleImportSession.countDocuments({}),
  ])

  return NextResponse.json({
    data: sessions,
    page,
    limit,
    total,
    hasMore: page * limit < total,
  }, { headers: { 'Cache-Control': 'no-store' } })
}
