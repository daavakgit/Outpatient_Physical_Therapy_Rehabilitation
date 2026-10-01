import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getPatientDashboardData } from '@/services/patientService';

export async function GET(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const requestedPatientId = searchParams.get('patientId');

    let patientId = session.patientId;
    if (session.role === 'THERAPIST' || session.role === 'ADMIN') {
      if (requestedPatientId) patientId = requestedPatientId;
    }

    if (!patientId) {
      return NextResponse.json({ error: 'Patient ID missing or unauthorized' }, { status: 400 });
    }

    const dashboardData = await getPatientDashboardData(patientId);
    return NextResponse.json(dashboardData);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
