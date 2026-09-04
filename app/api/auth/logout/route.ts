// POST /api/auth/logout — clear auth cookie
import { NextRequest, NextResponse } from 'next/server'
import { AUTH_COOKIE_NAME } from '@/lib/auth'
import { hasTrustedAuthOrigin } from '@/lib/auth-origin'

export async function POST(req: NextRequest) {
  if (!hasTrustedAuthOrigin(req)) return NextResponse.json({ error: 'Invalid request origin' }, { status: 403 })
  const res = NextResponse.json({ success: true })
  res.headers.set('Set-Cookie', `${AUTH_COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`)
  return res
}
