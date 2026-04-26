// GET/PUT/DELETE /api/admin/users — user management (admin only)
import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import User from '@/models/User'

export async function GET(req: NextRequest) {
  try {
    await connectDB()
    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status') // e.g. ?status=pending
    const role = searchParams.get('role')     // e.g. ?role=pandit
    const filter: Record<string, any> = {}
    if (status) filter.status = status
    if (role) filter.role = role
    const users = await User.find(filter, { password: 0 }).sort({ createdAt: -1 }).lean()
    return NextResponse.json(users)
  } catch (error) {
    console.error('Admin users error:', error)
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectDB()
    const body = await req.json()
    const { id, role, status, adminNote, templeId } = body

    if (!id) return NextResponse.json({ error: 'User ID required' }, { status: 400 })

    const allowedRoles = ['guest', 'user', 'temple', 'pandit', 'admin']
    const allowedStatuses = ['pending', 'approved', 'rejected']

    const update: Record<string, any> = {}
    if (role && allowedRoles.includes(role)) update.role = role
    if (status && allowedStatuses.includes(status)) {
      update.status = status
      if (status === 'approved') update.approvedAt = new Date()
    }
    if (adminNote !== undefined) update.adminNote = adminNote
    if (templeId !== undefined) update.templeId = templeId || null

    if (Object.keys(update).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 })
    }

    const user = await User.findByIdAndUpdate(id, update, { new: true }).select('-password')
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
