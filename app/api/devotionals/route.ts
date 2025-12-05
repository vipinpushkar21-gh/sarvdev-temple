// API Route for Devotionals CRUD operations
import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Devotional from '@/models/Devotional'

export async function GET() {
  try {
    await connectDB()
    const devotionals = await Devotional.find({}).sort({ createdAt: -1 })
    return NextResponse.json(devotionals)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch devotionals' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    const body = await request.json()
    const devotional = await Devotional.create(body)
    return NextResponse.json(devotional, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create devotional' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB()
    const body = await request.json()
    const { id, ...updateData } = body
    
    const devotional = await Devotional.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    )
    
    if (!devotional) {
      return NextResponse.json({ error: 'Devotional not found' }, { status: 404 })
    }
    
    return NextResponse.json(devotional)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update devotional' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connectDB()
    const body = await request.json()
    const { id } = body
    
    const devotional = await Devotional.findByIdAndDelete(id)
    
    if (!devotional) {
      return NextResponse.json({ error: 'Devotional not found' }, { status: 404 })
    }
    
    return NextResponse.json({ message: 'Devotional deleted successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete devotional' }, { status: 500 })
  }
}
