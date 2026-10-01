import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { Milestone } from '@/models/Milestone';
import { connectToDatabase } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const patientId = searchParams.get('patientId') || session.patientId;

    if (!patientId) {
      return NextResponse.json({ error: 'Patient ID missing' }, { status: 400 });
    }

    await connectToDatabase();
    const milestones = await Milestone.find({ patientId }).sort({ order: 1 });
    return NextResponse.json({ milestones });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || (session.role !== 'THERAPIST' && session.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await connectToDatabase();
    const body = await req.json();
    let milestone;
    if (body._id) {
      milestone = await Milestone.findByIdAndUpdate(body._id, body, { new: true });
    } else {
      milestone = await Milestone.create(body);
    }
    return NextResponse.json({ success: true, milestone });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
