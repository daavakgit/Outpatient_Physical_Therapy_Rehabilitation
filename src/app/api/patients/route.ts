import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getAllPatients, createPatientData, updatePatientData, deletePatientData } from '@/services/patientService';

export async function GET(req: Request) {
  try {
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
    if (session && session.role === 'PATIENT') {
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

export async function PUT(req: Request) {
  try {
    const session = await getSession();
    if (session && session.role === 'PATIENT') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await req.json();
    const { id, ...updateData } = body;
    if (!id) {
      return NextResponse.json({ error: 'Patient ID is required for editing.' }, { status: 400 });
    }

    const updatedPatient = await updatePatientData(id, updateData);
    return NextResponse.json({ success: true, patient: updatedPatient });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getSession();
    if (session && session.role === 'PATIENT') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Patient ID is required for deletion.' }, { status: 400 });
    }

    await deletePatientData(id);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
