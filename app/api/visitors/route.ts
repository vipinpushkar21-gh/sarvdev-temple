// API Route for Visitor tracking
import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Visitor from '@/models/Visitor'

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    const body = await request.json()
    const visitor = await Visitor.create(body)
    return NextResponse.json({ success: true }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to track visitor' }, { status: 500 })
  }
}

export async function GET() {
  try {
    await connectDB()
    const totalVisitors = await Visitor.countDocuments()
    const todayVisitors = await Visitor.countDocuments({
      timestamp: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
    })
    return NextResponse.json({ total: totalVisitors, today: todayVisitors })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to get visitor count' }, { status: 500 })
  }
}