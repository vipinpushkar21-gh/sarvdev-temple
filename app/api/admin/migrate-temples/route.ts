import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { AUTH_COOKIE_NAME, verifyToken } from '@/lib/auth'
import { runTempleIntegrity } from '@/lib/temple-integrity'

function isAdmin(req: NextRequest) {
  const token = req.cookies.get(AUTH_COOKIE_NAME)?.value
  if (!token) return false
  const payload = verifyToken(token)
  return payload?.role === 'admin'
}

export async function GET(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { searchParams } = new URL(req.url)
    const batchSize = Number(searchParams.get('batchSize') || 500)
    await connectDB()
    const report = await runTempleIntegrity({ apply: false, batchSize })
    return NextResponse.json(report, { headers: { 'Cache-Control': 'no-store' } })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Temple migration dry run failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await req.json().catch(() => ({}))
    const batchSize = Number(body?.batchSize || 500)
    await connectDB()
    const report = await runTempleIntegrity({ apply: true, batchSize })
    return NextResponse.json(report, { headers: { 'Cache-Control': 'no-store' } })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Temple migration failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
