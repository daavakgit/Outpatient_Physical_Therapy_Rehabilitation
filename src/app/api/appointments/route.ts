import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { Appointment } from '@/models/Appointment';
import { connectToDatabase } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectToDatabase();
    let query: any = {};
    if (session.role === 'PATIENT') {
      query.patientId = session.patientId;
    } else if (session.role === 'THERAPIST') {
      query.therapistId = session.therapistId;
    }

    const appointments = await Appointment.find(query).sort({ appointmentDate: 1 });
    return NextResponse.json({ appointments });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectToDatabase();
    const body = await req.json();
    const appointment = await Appointment.create(body);
    return NextResponse.json({ success: true, appointment });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
