import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Temple from '@/models/Temple';

// GET all temples
export async function GET() {
  try {
    await connectDB();
    const temples = await Temple.find().sort({ createdAt: -1 });
    return NextResponse.json(temples);
  } catch (error) {
    console.error('Temple API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch temples' }, { status: 500 });
  }
}

// POST create new temple
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const data = await req.json();
    const temple = await Temple.create(data);
    return NextResponse.json(temple, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create temple' }, { status: 500 });
  }
}

// PUT update temple
export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const { id, ...update } = await req.json();
    const temple = await Temple.findByIdAndUpdate(id, update, { new: true });
    if (!temple) {
      return NextResponse.json({ error: 'Temple not found' }, { status: 404 });
    }
    return NextResponse.json(temple);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update temple' }, { status: 500 });
  }
}

// DELETE temple
export async function DELETE(req: NextRequest) {
  try {
    await connectDB();
    const { id } = await req.json();
    const temple = await Temple.findByIdAndDelete(id);
    if (!temple) {
      return NextResponse.json({ error: 'Temple not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete temple' }, { status: 500 });
  }
}
