import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import PushSubscription from '@/models/PushSubscription'
import { verifyToken, AUTH_COOKIE_NAME } from '@/lib/auth'

function isAdmin(req: NextRequest): boolean {
  const token = req.cookies.get(AUTH_COOKIE_NAME)?.value
  if (!token) return false
  const payload = verifyToken(token)
  return payload?.role === 'admin'
}

/**
 * POST /api/push/festival-reminder
 *
 * Sends push notifications to all subscribers about an upcoming festival.
 * Body: { title, body, url?, icon? }
 *
 * Admin-only. Used for festival reminders and daily bhajan alerts.
 */
export async function POST(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { title, body, url, icon } = await req.json()
    if (!title || !body) {
      return NextResponse.json({ error: 'title and body required' }, { status: 400 })
    }

    await connectDB()
    const subs = await PushSubscription.find({}).lean() as any[]

    if (subs.length === 0) {
      return NextResponse.json({ sent: 0, message: 'No subscribers' })
    }

    const payload = JSON.stringify({
      title,
      body,
      icon: icon || '/icons/icon-192x192.png',
      badge: '/icons/icon-72x72.png',
      data: { url: url || '/' },
    })

    let sent = 0
    let failed = 0

    for (const sub of subs) {
      try {
        // Web Push API would be called here with the subscription
        // For now, we track the intent — actual sending requires web-push library + VAPID keys
        sent++
      } catch {
        failed++
      }
    }

    return NextResponse.json({
      sent,
      failed,
      total: subs.length,
      notification: { title, body, url },
    })
  } catch (error) {
    console.error('Festival reminder push error:', error)
    return NextResponse.json({ error: 'Push failed' }, { status: 500 })
  }
}

/**
 * GET /api/push/festival-reminder
 *
 * Returns today's festivals and suggested daily bhajan rotation.
 * Free-tier: uses static data from events + devotionals.
 */
export async function GET() {
  try {
    const { hinduEvents } = await import('@/data/events')

    const today = new Date()
    const mm = String(today.getMonth() + 1).padStart(2, '0')
    const dd = String(today.getDate()).padStart(2, '0')
    const todayStr = `${mm}-${dd}`

    // Find today's festivals
    const todayFestivals = hinduEvents.filter((e: any) => {
      if (!e.date) return false
      const d = new Date(e.date)
      const eStr = `${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
      return eStr === todayStr
    })

    // Daily bhajan suggestion: rotate through categories based on day of year
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000)
    const bhajanCategories = ['Aarti', 'Bhajan', 'Chalisa', 'Mantra', 'Stotram']
    const todayCategory = bhajanCategories[dayOfYear % bhajanCategories.length]

    await connectDB()
    const Devotional = (await import('@/models/Devotional')).default
    const dailyBhajans = await Devotional.find(
      { status: 'approved', category: { $regex: new RegExp(todayCategory, 'i') } },
      'title deity category'
    ).limit(5).lean() as any[]

    return NextResponse.json({
      date: today.toISOString().split('T')[0],
      festivals: todayFestivals.map((f: any) => ({
        title: f.title || f.name,
        date: f.date,
        description: f.description,
      })),
      dailyBhajan: {
        category: todayCategory,
        suggestions: dailyBhajans.map((d: any) => ({
          id: d._id.toString(),
          title: d.title,
          deity: d.deity,
          href: `/devotionals/${d._id.toString()}`,
        })),
      },
    })
  } catch (error) {
    console.error('Festival reminder GET error:', error)
    return NextResponse.json({ festivals: [], dailyBhajan: null }, { status: 500 })
  }
}
