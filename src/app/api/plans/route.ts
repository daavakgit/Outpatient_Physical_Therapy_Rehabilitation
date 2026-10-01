import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getPlanByPatientId, createOrUpdatePlan } from '@/services/planService';

export async function GET(req: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const patientId = searchParams.get('patientId') || session.patientId;

    if (!patientId) {
      return NextResponse.json({ error: 'Patient ID missing' }, { status: 400 });
    }

    const plan = await getPlanByPatientId(patientId);
    return NextResponse.json({ plan });
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
    const plan = await createOrUpdatePlan(body);
    return NextResponse.json({ success: true, plan });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
