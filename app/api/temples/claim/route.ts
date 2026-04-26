// POST /api/temples/claim — temple role user requests ownership of a listed temple
import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import User from '@/models/User'
import { verifyToken, AUTH_COOKIE_NAME } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get(AUTH_COOKIE_NAME)?.value
    if (!token) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

    const payload = verifyToken(token)
    if (!payload) return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    if (payload.role !== 'temple') return NextResponse.json({ error: 'Only temple managers can claim temples' }, { status: 403 })

    const { templeId, templeName } = await req.json()
    if (!templeId) return NextResponse.json({ error: 'Temple ID required' }, { status: 400 })

    await connectDB()

    // Update user with claimed temple info (admin will verify and confirm)
    const user = await User.findByIdAndUpdate(
      payload.id,
      {
        templeId,
        templeName: templeName || '',
        adminNote: `Claim request for temple: ${templeId} submitted on ${new Date().toLocaleDateString('en-IN')}`,
      },
      { new: true }
    ).select('-password')

    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    return NextResponse.json({ success: true, message: 'Claim request submitted. Admin will verify within 24 hours.' })
  } catch (error) {
    console.error('Temple claim error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
