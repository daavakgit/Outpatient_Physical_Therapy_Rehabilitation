import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import {
  createExerciseAssignment,
  getAssignmentsByPatient,
} from '@/services/assignmentService';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();

    const { searchParams } = new URL(req.url);
    let patientId = searchParams.get('patientId');

    if (session?.role === 'PATIENT') {
      patientId = session.patientId || patientId || 'pat_1';
    }

    const assignments = await getAssignmentsByPatient(patientId || undefined);
    return NextResponse.json({ assignments });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (session && session.role === 'PATIENT') {
      return NextResponse.json({ error: 'Unauthorized for patient role' }, { status: 403 });
    }

    const body = await req.json();
    const {
      exerciseId,
      patientId,
      rehabilitationPlanId,
      phaseId,
      phaseName,
      sets,
      repetitions,
      frequencyDaysPerWeek,
      holdDurationSeconds,
      restDurationSeconds,
      startDate,
      endDate,
      therapistNotes,
    } = body;

    if (!exerciseId || !patientId) {
      return NextResponse.json(
        { error: 'exerciseId and patientId are required fields' },
        { status: 400 }
      );
    }

    const assignment = await createExerciseAssignment({
      exerciseId,
      patientId,
      therapistId: session?.therapistId || session?.id || 'tp_1',
      rehabilitationPlanId,
      phaseId,
      phaseName,
      sets: Number(sets) || 3,
      repetitions: Number(repetitions) || 10,
      frequencyDaysPerWeek: Number(frequencyDaysPerWeek) || 5,
      holdDurationSeconds: Number(holdDurationSeconds) || 3,
      restDurationSeconds: Number(restDurationSeconds) || 30,
      startDate,
      endDate,
      therapistNotes,
    });

    return NextResponse.json({ success: true, assignment }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
