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

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = getAdmin(req)
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  await connectDB()
  const session = await TempleImportSession.findOne({ importId: id }, { __v: 0 }).lean()
  if (!session) return NextResponse.json({ error: 'Import session not found' }, { status: 404 })
  return NextResponse.json(session, { headers: { 'Cache-Control': 'no-store' } })
}
