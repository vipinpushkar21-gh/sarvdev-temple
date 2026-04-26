// POST /api/auth/register — create account (user/temple/pandit/admin-invite)
import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import User from '@/models/User'
import { hashPassword, createToken, AUTH_COOKIE_NAME, AUTH_COOKIE_OPTIONS } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      name, email, password,
      role = 'user',
      phone, city, state,
      // temple fields
      templeName, templeId, designation,
      // pandit fields
      specialization, experience, languages, services,
      bio,
    } = body

    if (!name?.trim() || !email?.trim() || !password) {
      return NextResponse.json({ error: 'Name, email and password are required' }, { status: 400 })
    }
    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 })
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    const allowedRoles = ['user', 'temple', 'pandit']
    if (!allowedRoles.includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
    }

    await connectDB()

    const existing = await User.findOne({ email: email.trim().toLowerCase() })
    if (existing) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 })
    }

    const hashed = await hashPassword(password)

    // temple and pandit need admin approval; regular user is auto-approved
    const needsApproval = role === 'temple' || role === 'pandit'

    const userData: Record<string, any> = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: hashed,
      role,
      status: needsApproval ? 'pending' : 'approved',
      phone: phone?.trim(),
      city: city?.trim(),
      state: state?.trim(),
      bio: bio?.trim(),
    }

    if (role === 'temple') {
      userData.templeName = templeName?.trim()
      userData.templeId = templeId || null
      userData.designation = designation?.trim()
    }

    if (role === 'pandit') {
      userData.specialization = Array.isArray(specialization) ? specialization : []
      userData.experience = experience ? Number(experience) : undefined
      userData.languages = Array.isArray(languages) ? languages : []
      userData.services = Array.isArray(services) ? services : []
    }

    const user = await User.create(userData)

    // If pending approval, don't set cookie — just return success message
    if (needsApproval) {
      return NextResponse.json({
        success: true,
        pending: true,
        message: role === 'temple'
          ? 'Your temple manager account has been submitted. Admin will review and approve within 24 hours.'
          : 'Your pandit account has been submitted. Admin will review and approve within 24 hours.',
      })
    }

    const token = createToken(user)
    const res = NextResponse.json({
      success: true,
      pending: false,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, status: user.status },
    })
    res.headers.set('Set-Cookie', `${AUTH_COOKIE_NAME}=${token}; ${AUTH_COOKIE_OPTIONS}`)
    return res
  } catch (err: any) {
    console.error('Register error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
