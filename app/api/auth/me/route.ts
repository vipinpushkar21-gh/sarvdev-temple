// GET /api/auth/me — return current user from signed cookie + DB
import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, AUTH_COOKIE_NAME } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import User from '@/models/User'

export async function GET(req: NextRequest) {
  const token = req.cookies.get(AUTH_COOKIE_NAME)?.value
  if (!token) return NextResponse.json({ user: null }, { status: 401 })

  const payload = verifyToken(token)
  if (!payload) return NextResponse.json({ user: null }, { status: 401 })

  try {
    await connectDB()
    const user = await User.findById(payload.id).select('-password').lean()
    if (!user) return NextResponse.json({ user: null }, { status: 401 })
    return NextResponse.json({ user })
  } catch {
    // Fallback to token payload if DB fails
    return NextResponse.json({
      user: { id: payload.id, name: payload.name, email: payload.email, role: payload.role },
    })
  }
}
