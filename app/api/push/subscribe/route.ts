import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import PushSubscription from '@/models/PushSubscription'

export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const subscription = await req.json()
    const { endpoint, keys } = subscription

    if (!endpoint || !keys?.p256dh || !keys?.auth) {
      return NextResponse.json({ error: 'Invalid subscription' }, { status: 400 })
    }

    await PushSubscription.findOneAndUpdate(
      { endpoint },
      { endpoint, keys },
      { upsert: true, new: true }
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Push subscribe error:', error)
    return NextResponse.json({ error: 'Failed to save subscription' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectDB()
    const { endpoint } = await req.json()
    await PushSubscription.deleteOne({ endpoint })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Push unsubscribe error:', error)
    return NextResponse.json({ error: 'Failed to remove subscription' }, { status: 500 })
  }
}
