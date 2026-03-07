// GET/POST /api/admin/activity — activity log
import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import ActivityLog from '@/models/ActivityLog'

export async function GET(req: NextRequest) {
  try {
    await connectDB()
    const { searchParams } = new URL(req.url)
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 200)
    const entity = searchParams.get('entity') || ''

    const filter: any = {}
    if (entity) filter.entity = entity

    const logs = await ActivityLog.find(filter).sort({ timestamp: -1 }).limit(limit).lean()
    return NextResponse.json(logs)
  } catch (error) {
    console.error('Activity log error:', error)
    return NextResponse.json({ error: 'Failed to fetch logs' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const body = await req.json()
    const log = await ActivityLog.create(body)
    return NextResponse.json(log, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create log' }, { status: 500 })
  }
}
