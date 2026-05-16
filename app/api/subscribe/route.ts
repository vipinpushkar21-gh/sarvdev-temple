import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Subscriber from '@/models/Subscriber'

/**
 * POST /api/subscribe — Newsletter subscription
 * Body: { email, name?, source? }
 */
export async function POST(req: NextRequest) {
  try {
    const { email, name, source } = await req.json()

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 })
    }

    await connectDB()

    const existing = await Subscriber.findOne({ email: email.toLowerCase().trim() })
    if (existing) {
      if (existing.status === 'unsubscribed') {
        existing.status = 'active'
        existing.subscribedAt = new Date()
        existing.unsubscribedAt = undefined
        await existing.save()
        return NextResponse.json({ message: 'Welcome back! You have been re-subscribed.' })
      }
      return NextResponse.json({ message: 'You are already subscribed!' })
    }

    await Subscriber.create({
      email: email.toLowerCase().trim(),
      name: name?.trim() || undefined,
      source: source || 'footer',
    })

    return NextResponse.json({ message: 'Successfully subscribed! 🙏' })
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json({ message: 'You are already subscribed!' })
    }
    console.error('Subscribe error:', error)
    return NextResponse.json({ error: 'Subscription failed' }, { status: 500 })
  }
}
