// API Route for Visitor tracking
import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Visitor from '@/models/Visitor'
import crypto from 'crypto'
import { checkRateLimit, getClientIp } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request)
    const { ok } = checkRateLimit(`visitor:${ip}`, 30, 60_000)
    if (!ok) return NextResponse.json({ success: true }, { status: 200 })

    const body = await request.json()

    // Anonymize IP: one-way hash so we can count unique visitors without storing raw IPs
    const anonIp = crypto.createHash('sha256').update(ip + 'sarvdev-visitor-salt').digest('hex').slice(0, 16)

    await connectDB()
    await Visitor.create({
      ip: anonIp,
      userAgent: (body.userAgent || '').slice(0, 256),
      page: (body.page || '/').slice(0, 512),
      timestamp: new Date(),
    })
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