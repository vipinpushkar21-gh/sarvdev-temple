// GET/PUT/DELETE /api/admin/users — user management (admin only)
import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import User from '@/models/User'

export async function GET() {
  try {
    await connectDB()
    const users = await User.find({}, { password: 0 }).sort({ createdAt: -1 }).lean()
    return NextResponse.json(users)
  } catch (error) {
    console.error('Admin users error:', error)
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectDB()
    const { id, role } = await req.json()
    if (!id || !role || !['guest', 'admin'].includes(role)) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 })
    }
    const user = await User.findByIdAndUpdate(id, { role }, { new: true }).select('-password')
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })
    return NextResponse.json(user)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectDB()
    const { id } = await req.json()
    const user = await User.findByIdAndDelete(id)
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 })
  }
}
