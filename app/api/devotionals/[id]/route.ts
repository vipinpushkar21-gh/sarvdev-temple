import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Devotional from '@/models/Devotional'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await connectDB()
    const devotional = await Devotional.findById(id)
    
    if (!devotional) {
      return NextResponse.json({ error: 'Devotional not found' }, { status: 404 })
    }
    
    return NextResponse.json(devotional)
  } catch (error) {
    console.error('Error fetching devotional:', error)
    return NextResponse.json({ error: 'Failed to fetch devotional' }, { status: 500 })
  }
}
