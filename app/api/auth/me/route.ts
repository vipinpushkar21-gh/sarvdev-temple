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
    const user = await User.findById(payload.id)
      .select('name email role status photo phone city state templeId templeName designation bio specialization experience languages services')
      .lean()
    if (!user) return NextResponse.json({ user: null }, { status: 401 })
    return NextResponse.json({
      user: {
        id: String(user._id),
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        photo: user.photo,
        phone: user.phone,
        city: user.city,
        state: user.state,
        templeId: user.templeId ? String(user.templeId) : undefined,
        templeName: user.templeName,
        designation: user.designation,
        bio: user.bio,
        specialization: user.specialization,
        experience: user.experience,
        languages: user.languages,
        services: user.services,
      },
    })
  } catch {
    return NextResponse.json({ user: null, error: 'Account information is temporarily unavailable' }, { status: 503 })
  }
}
