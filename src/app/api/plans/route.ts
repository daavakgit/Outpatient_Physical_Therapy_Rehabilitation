import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getPlanByPatientId, getAllPlans, createOrUpdatePlan, deletePlan } from '@/services/planService';

export async function GET(req: Request) {
  try {
    const session = await getSession();
    const { searchParams } = new URL(req.url);
    const patientId = searchParams.get('patientId') || (session?.role === 'PATIENT' ? session.patientId : undefined);

    const allPlans = await getAllPlans();

    if (patientId) {
      const plan = await getPlanByPatientId(patientId);
      return NextResponse.json({ plan, plans: allPlans });
    }

    return NextResponse.json({ plans: allPlans });
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
    const plan = await createOrUpdatePlan(body);
    return NextResponse.json({ success: true, plan });
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
    const planId = searchParams.get('planId') || searchParams.get('id');

    if (!planId) {
      return NextResponse.json({ error: 'Plan ID required' }, { status: 400 });
    }

    await deletePlan(planId);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
