// POST /api/auth/login — authenticate with email + password
import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import User from '@/models/User'
import { verifyPassword, createToken, AUTH_COOKIE_NAME, AUTH_COOKIE_OPTIONS } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    if (!email?.trim() || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    await connectDB()

    const user = await User.findOne({ email: email.trim().toLowerCase() })
    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    const valid = await verifyPassword(password, user.password)
    if (!valid) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    // Block pending/rejected accounts
    if (user.status === 'pending') {
      return NextResponse.json({
        error: 'Your account is pending admin approval. You will be notified once approved.',
        pending: true,
      }, { status: 403 })
    }
    if (user.status === 'rejected') {
      return NextResponse.json({
        error: 'Your account registration was not approved. Contact support for details.',
        rejected: true,
      }, { status: 403 })
    }

    const token = createToken(user)

    const res = NextResponse.json({
      success: true,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, status: user.status },
    })
    res.headers.set('Set-Cookie', `${AUTH_COOKIE_NAME}=${token}; ${AUTH_COOKIE_OPTIONS}`)
    return res
  } catch (err: any) {
    console.error('Login error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
