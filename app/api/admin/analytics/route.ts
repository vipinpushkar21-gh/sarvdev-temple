// GET /api/admin/analytics — detailed visitor analytics
import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Visitor from '@/models/Visitor'

export async function GET() {
  try {
    await connectDB()

    const now = new Date()
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const monthAgo = new Date(todayStart.getTime() - 30 * 86400000)

    const [dailyVisitors, topPages, deviceBreakdown, totalVisitors, todayVisitors] = await Promise.all([
      // Daily visitors for last 30 days
      Visitor.aggregate([
        { $match: { timestamp: { $gte: monthAgo } } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
      // Top pages
      Visitor.aggregate([
        { $match: { timestamp: { $gte: monthAgo } } },
        { $group: { _id: '$page', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 15 },
      ]),
      // Device/browser from userAgent
      Visitor.aggregate([
        { $match: { timestamp: { $gte: monthAgo }, userAgent: { $exists: true, $ne: '' } } },
        {
          $project: {
            device: {
              $cond: [
                { $regexMatch: { input: { $ifNull: ['$userAgent', ''] }, regex: /Mobile|Android|iPhone/i } },
                'Mobile',
                {
                  $cond: [
                    { $regexMatch: { input: { $ifNull: ['$userAgent', ''] }, regex: /Tablet|iPad/i } },
                    'Tablet',
                    'Desktop'
                  ]
                }
              ]
            }
          }
        },
        { $group: { _id: '$device', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      Visitor.countDocuments(),
      Visitor.countDocuments({ timestamp: { $gte: todayStart } }),
    ])

    return NextResponse.json({
      dailyVisitors,
      topPages,
      deviceBreakdown,
      totalVisitors,
      todayVisitors,
    })
  } catch (error) {
    console.error('Analytics error:', error)
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 })
  }
}
