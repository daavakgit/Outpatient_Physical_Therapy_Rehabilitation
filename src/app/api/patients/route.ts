import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getAllPatients, createPatientData } from '@/services/patientService';

export async function GET(req: Request) {
  try {
    const session = await getSession();
    if (!session || (session.role !== 'THERAPIST' && session.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || undefined;

    const patients = await getAllPatients(search);
    return NextResponse.json({ patients });
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

    const body = await req.json();
    if (!body.fullName || !body.condition) {
      return NextResponse.json({ error: 'Patient full name and clinical condition are required.' }, { status: 400 });
    }

    const newPatient = await createPatientData(body);
    return NextResponse.json({ success: true, patient: newPatient }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

