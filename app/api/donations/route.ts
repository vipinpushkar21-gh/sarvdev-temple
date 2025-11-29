import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Donation from '@/models/Donation';

// GET all donations
export async function GET() {
  try {
    await connectDB();
    const donations = await Donation.find().sort({ createdAt: -1 });
    return NextResponse.json(donations);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch donations' }, { status: 500 });
  }
}

// POST create new donation
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const data = await req.json();
    const donation = await Donation.create(data);
    return NextResponse.json(donation, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create donation' }, { status: 500 });
  }
}

// DELETE donation
export async function DELETE(req: NextRequest) {
  try {
    await connectDB();
    const { id } = await req.json();
    const donation = await Donation.findByIdAndDelete(id);
    if (!donation) {
      return NextResponse.json({ error: 'Donation not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete donation' }, { status: 500 });
  }
}
