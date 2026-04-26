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
    const weekAgo    = new Date(todayStart.getTime() - 7  * 86400000)
    const twoWeekAgo = new Date(todayStart.getTime() - 14 * 86400000)
    const monthAgo   = new Date(todayStart.getTime() - 30 * 86400000)
    const twoMonthAgo = new Date(todayStart.getTime() - 60 * 86400000)

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
      prevWeekVisitors,
      monthVisitors,
      prevMonthVisitors,
      newUsersThisWeek,
      newUsersPrevWeek,
      categoryCounts,
      recentTemples,
      recentDevotionals,
      recentBlogs,
      recentEvents,
      pendingList,
      dailyVisitors,
      monthlyVisitors,
      topPages,
      pendingUsers,
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
      Visitor.countDocuments({ timestamp: { $gte: twoWeekAgo, $lt: weekAgo } }),
      Visitor.countDocuments({ timestamp: { $gte: monthAgo } }),
      Visitor.countDocuments({ timestamp: { $gte: twoMonthAgo, $lt: monthAgo } }),
      User.countDocuments({ createdAt: { $gte: weekAgo } }),
      User.countDocuments({ createdAt: { $gte: twoWeekAgo, $lt: weekAgo } }),
      Devotional.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      Temple.find({}).sort({ createdAt: -1 }).limit(5).select('title status createdAt').lean(),
      Devotional.find({}).sort({ createdAt: -1 }).limit(5).select('title category createdAt').lean(),
      Blog.find({}).sort({ createdAt: -1 }).limit(5).select('title status createdAt').lean(),
      Event.find({}).sort({ createdAt: -1 }).limit(5).select('title date status createdAt').lean(),
      // Pending temples with details for approval queue
      Temple.find({ status: 'pending' })
        .sort({ createdAt: -1 })
        .limit(8)
        .select('_id title city state deity createdAt')
        .lean(),
      // Daily visitors for last 7 days
      Visitor.aggregate([
        { $match: { timestamp: { $gte: weekAgo } } },
        { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } }, count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),
      // Daily visitors for last 30 days (for range picker)
      Visitor.aggregate([
        { $match: { timestamp: { $gte: monthAgo } } },
        { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } }, count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),
      // Top visited pages (last 30 days)
      Visitor.aggregate([
        { $match: { timestamp: { $gte: monthAgo }, page: { $regex: '^/' } } },
        { $group: { _id: '$page', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 8 },
      ]),
      // Pending user approvals (temple + pandit)
      User.countDocuments({ status: 'pending', role: { $in: ['temple', 'pandit'] } }),
    ])

    // Growth percentages
    const pct = (curr: number, prev: number) =>
      prev === 0 ? (curr > 0 ? 100 : 0) : Math.round(((curr - prev) / prev) * 100)

    return NextResponse.json({
      counts: {
        temples: totalTemples,
        approvedTemples,
        pendingTemples,
        devotionals: totalDevotionals,
        blogs: totalBlogs,
        events: totalEvents,
        users: totalUsers,
        pendingUsers,
        visitors: totalVisitors,
        todayVisitors,
        weekVisitors,
        monthVisitors,
      },
      growth: {
        visitors: pct(weekVisitors, prevWeekVisitors),
        visitorsMonth: pct(monthVisitors, prevMonthVisitors),
        users: pct(newUsersThisWeek, newUsersPrevWeek),
      },
      categoryCounts,
      pendingList,
      recent: {
        temples: recentTemples,
        devotionals: recentDevotionals,
        blogs: recentBlogs,
        events: recentEvents,
      },
      dailyVisitors,
      monthlyVisitors,
      topPages,
      health: {
        mongodb: 'connected',
        cloudinary: !!(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY),
        tts: !!(process.env.AZURE_TTS_KEY),
        ga: !!(process.env.NEXT_PUBLIC_GA_ID && process.env.NEXT_PUBLIC_GA_ID !== 'G-XXXXXXXXXX'),
      },
    })
  } catch (error) {
    console.error('Admin stats error:', error)
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}
