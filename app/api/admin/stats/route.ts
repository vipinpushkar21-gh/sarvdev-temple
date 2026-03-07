// GET /api/admin/stats — aggregated counts from all collections
import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Temple from '@/models/Temple'
import Devotional from '@/models/Devotional'
import Blog from '@/models/Blog'
import Event from '@/models/Event'
import User from '@/models/User'
import Visitor from '@/models/Visitor'

export async function GET() {
  try {
    await connectDB()

    const now = new Date()
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const weekAgo = new Date(todayStart.getTime() - 7 * 86400000)
    const monthAgo = new Date(todayStart.getTime() - 30 * 86400000)

    const [
      totalTemples,
      approvedTemples,
      pendingTemples,
      totalDevotionals,
      totalBlogs,
      totalEvents,
      totalUsers,
      totalVisitors,
      todayVisitors,
      weekVisitors,
      monthVisitors,
      categoryCounts,
      recentTemples,
      recentDevotionals,
      recentBlogs,
      recentEvents,
      dailyVisitors,
    ] = await Promise.all([
      Temple.countDocuments(),
      Temple.countDocuments({ status: 'approved' }),
      Temple.countDocuments({ status: 'pending' }),
      Devotional.countDocuments(),
      Blog.countDocuments(),
      Event.countDocuments(),
      User.countDocuments(),
      Visitor.countDocuments(),
      Visitor.countDocuments({ timestamp: { $gte: todayStart } }),
      Visitor.countDocuments({ timestamp: { $gte: weekAgo } }),
      Visitor.countDocuments({ timestamp: { $gte: monthAgo } }),
      Devotional.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      Temple.find({}).sort({ createdAt: -1 }).limit(5).select('title status createdAt').lean(),
      Devotional.find({}).sort({ createdAt: -1 }).limit(5).select('title category createdAt').lean(),
      Blog.find({}).sort({ createdAt: -1 }).limit(5).select('title status createdAt').lean(),
      Event.find({}).sort({ createdAt: -1 }).limit(5).select('title date status createdAt').lean(),
      // Daily visitors for last 7 days
      Visitor.aggregate([
        { $match: { timestamp: { $gte: weekAgo } } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
    ])

    return NextResponse.json({
      counts: {
        temples: totalTemples,
        approvedTemples,
        pendingTemples,
        devotionals: totalDevotionals,
        blogs: totalBlogs,
        events: totalEvents,
        users: totalUsers,
        visitors: totalVisitors,
        todayVisitors,
        weekVisitors,
        monthVisitors,
      },
      categoryCounts,
      recent: {
        temples: recentTemples,
        devotionals: recentDevotionals,
        blogs: recentBlogs,
        events: recentEvents,
      },
      dailyVisitors,
    })
  } catch (error) {
    console.error('Admin stats error:', error)
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}
