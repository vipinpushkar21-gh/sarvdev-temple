// POST /api/auth/logout — clear auth cookie
import { NextResponse } from 'next/server'
import { AUTH_COOKIE_NAME } from '@/lib/auth'

export async function POST() {
  const res = NextResponse.json({ success: true })
  res.headers.set('Set-Cookie', `${AUTH_COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`)
  return res
}
