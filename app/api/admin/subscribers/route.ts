import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Subscriber from '@/models/Subscriber'
import { verifyToken, AUTH_COOKIE_NAME } from '@/lib/auth'

function isAdmin(req: NextRequest): boolean {
  const token = req.cookies.get(AUTH_COOKIE_NAME)?.value
  if (!token) return false
  const payload = verifyToken(token)
  return payload?.role === 'admin'
}

/**
 * GET /api/admin/subscribers — List all subscribers with stats
 */
export async function GET(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await connectDB()

    const [subscribers, totalActive, totalUnsubscribed, recentWeek] = await Promise.all([
      Subscriber.find().sort({ subscribedAt: -1 }).limit(200).lean(),
      Subscriber.countDocuments({ status: 'active' }),
      Subscriber.countDocuments({ status: 'unsubscribed' }),
      Subscriber.countDocuments({
        status: 'active',
        subscribedAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      }),
    ])

    return NextResponse.json({
      subscribers,
      stats: { totalActive, totalUnsubscribed, recentWeek },
    })
  } catch (error) {
    console.error('Subscribers API error:', error)
    return NextResponse.json({ error: 'Failed to fetch subscribers' }, { status: 500 })
  }
}
