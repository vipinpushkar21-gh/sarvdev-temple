import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Darshan from '@/models/Darshan';

// GET all darshan
export async function GET() {
  try {
    await connectDB();
    const darshan = await Darshan.find().sort({ createdAt: -1 });
    return NextResponse.json(darshan);
  } catch (error) {
    console.error('Darshan API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch darshan' }, { status: 500 });
  }
}

// POST create new darshan
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const data = await req.json();
    const darshan = await Darshan.create(data);
    return NextResponse.json(darshan, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create darshan' }, { status: 500 });
  }
}

// PUT update darshan
export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const { id, ...update } = await req.json();
    const darshan = await Darshan.findByIdAndUpdate(id, update, { new: true });
    if (!darshan) {
      return NextResponse.json({ error: 'Darshan not found' }, { status: 404 });
    }
    return NextResponse.json(darshan);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update darshan' }, { status: 500 });
  }
}

// DELETE darshan
export async function DELETE(req: NextRequest) {
  try {
    await connectDB();
    const { id } = await req.json();
    const darshan = await Darshan.findByIdAndDelete(id);
    if (!darshan) {
      return NextResponse.json({ error: 'Darshan not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete darshan' }, { status: 500 });
  }
}
