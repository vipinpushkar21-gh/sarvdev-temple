import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import PushSubscription from '@/models/PushSubscription'
import { verifyToken } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('auth_token')?.value
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const user = verifyToken(token)
    if (!user || user.role !== 'admin') return NextResponse.json({ error: 'Admin only' }, { status: 403 })

    const { title, body, url = '/' } = await req.json()
    if (!title || !body) return NextResponse.json({ error: 'Title and body required' }, { status: 400 })

    const vapidPublicKey = process.env.VAPID_PUBLIC_KEY
    const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY
    const vapidEmail = process.env.VAPID_EMAIL || 'mailto:admin@sarvdev.com'

    if (!vapidPublicKey || !vapidPrivateKey) {
      return NextResponse.json({ error: 'VAPID keys not configured. Run: npx web-push generate-vapid-keys' }, { status: 500 })
    }

    await connectDB()
    const subscriptions = await PushSubscription.find({}).lean()

    if (subscriptions.length === 0) {
      return NextResponse.json({ sent: 0, message: 'No subscribers yet' })
    }

    const webpush = (await import('web-push')).default
    webpush.setVapidDetails(vapidEmail, vapidPublicKey, vapidPrivateKey)

    const payload = JSON.stringify({ title, body, url, icon: '/icon.svg' })
    let sent = 0
    let failed = 0

    await Promise.allSettled(
      subscriptions.map(async (sub) => {
        try {
          await webpush.sendNotification(
            { endpoint: sub.endpoint, keys: { p256dh: sub.keys.p256dh, auth: sub.keys.auth } },
            payload
          )
          sent++
        } catch (err: unknown) {
          failed++
          if ((err as { statusCode?: number }).statusCode === 410) {
            await PushSubscription.deleteOne({ endpoint: sub.endpoint })
          }
        }
      })
    )

    return NextResponse.json({ sent, failed, total: subscriptions.length })
  } catch (error) {
    console.error('Push send error:', error)
    return NextResponse.json({ error: 'Failed to send notifications' }, { status: 500 })
  }
}
