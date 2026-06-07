// GET /api/admin/stats — aggregated counts from all collections
import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Temple from '@/models/Temple'
import Devotional from '@/models/Devotional'
import Blog from '@/models/Blog'
import Event from '@/models/Event'
import User from '@/models/User'
import Visitor from '@/models/Visitor'
import Deity from '@/models/Deity'
import Darshan from '@/models/Darshan'
import SpiritualIcon from '@/models/SpiritualIcon'
import Subscriber from '@/models/Subscriber'
import ActivityLog from '@/models/ActivityLog'
import { AUTH_COOKIE_NAME, verifyToken } from '@/lib/auth'
import { NextRequest } from 'next/server'

// ── 30-second in-memory cache — avoids 30 simultaneous DB queries on every refresh ──
let _statsCache: { data: any; ts: number } | null = null
const STATS_CACHE_TTL = 30_000

function isAdmin(req: NextRequest): boolean {
  const token = req.cookies.get(AUTH_COOKIE_NAME)?.value
  if (!token) return false
  const payload = verifyToken(token)
  return payload?.role === 'admin'
}

export async function GET(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Serve from cache if fresh (skip on ?fresh=1)
  const fresh = new URL(req.url).searchParams.get('fresh') === '1'
  if (!fresh && _statsCache && Date.now() - _statsCache.ts < STATS_CACHE_TTL) {
    return NextResponse.json(_statsCache.data, {
      headers: { 'X-Cache': 'HIT', 'Cache-Control': 'no-store' },
    })
  }

  try {
    await connectDB()

    const now = new Date()
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const weekAgo    = new Date(todayStart.getTime() - 7  * 86400000)
    const twoWeekAgo = new Date(todayStart.getTime() - 14 * 86400000)
    const monthAgo   = new Date(todayStart.getTime() - 30 * 86400000)
    const twoMonthAgo = new Date(todayStart.getTime() - 60 * 86400000)

    // Count static deities (hardcoded since DEITY_CATEGORIES is client-side)
    // Total deities from static data across all categories
    const staticDeitiesCount = 100
    
    const [
      totalTemples,
      approvedTemples,
      pendingTemples,
      totalDevotionals,
      totalBlogs,
      totalEvents,
      totalDeities,
      totalDarshan,
      totalSpiritualIcons,
      totalSubscribers,
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
      recentActivity,
    ] = await Promise.all([
      Temple.countDocuments(),
      Temple.countDocuments({ status: 'approved' }),
      Temple.countDocuments({ status: 'pending' }),
      Devotional.countDocuments(),
      Blog.countDocuments(),
      Event.countDocuments(),
      Deity.countDocuments(),
      Darshan.countDocuments(),
      SpiritualIcon.countDocuments(),
      Subscriber.countDocuments(),
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
      ActivityLog.find({}).sort({ timestamp: -1 }).limit(8).lean(),
    ])

    // Growth percentages
    const pct = (curr: number, prev: number) =>
      prev === 0 ? (curr > 0 ? 100 : 0) : Math.round(((curr - prev) / prev) * 100)

    const payload = {
      counts: {
        temples: totalTemples,
        approvedTemples,
        pendingTemples,
        devotionals: totalDevotionals,
        blogs: totalBlogs,
        events: totalEvents,
        deities: totalDeities || staticDeitiesCount,
        darshan: totalDarshan,
        spiritualIcons: totalSpiritualIcons,
        subscribers: totalSubscribers,
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
        activity: recentActivity,
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
    }

    _statsCache = { data: payload, ts: Date.now() }
    return NextResponse.json(payload, { headers: { 'X-Cache': 'MISS', 'Cache-Control': 'no-store' } })
  } catch (error) {
    console.error('Admin stats error:', error)
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}
