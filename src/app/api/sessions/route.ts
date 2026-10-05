import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import {
  startExerciseSession,
  pauseExerciseSession,
  resumeExerciseSession,
  endExerciseSession,
} from '@/services/sessionService';
import { ExerciseSession } from '@/models/ExerciseSession';
import { connectToDatabase } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const userSession = await getSession();
    if (!userSession) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const patientId = searchParams.get('patientId') || userSession.patientId;

    if (!patientId) {
      return NextResponse.json({ error: 'Patient ID missing' }, { status: 400 });
    }

    await connectToDatabase();
    const sessions = await ExerciseSession.find({ patientId }).sort({ createdAt: -1 });

    return NextResponse.json({ sessions });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const userSession = await getSession();
    if (!userSession) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const {
      action,
      exerciseId,
      exerciseAssignmentId,
      targetSets,
      targetReps,
      sessionId,
      completedSets,
      completedRepetitions,
      notes,
      painLevel,
      difficulty,
      additionalPauseSeconds,
    } = body;

    if (action === 'START') {
      const patientId = userSession.patientId || body.patientId;
      if (!patientId) return NextResponse.json({ error: 'Patient profile not found' }, { status: 400 });
      const sessionDoc = await startExerciseSession(
        patientId,
        exerciseId,
        exerciseAssignmentId,
        targetSets,
        targetReps
      );
      return NextResponse.json({ success: true, session: sessionDoc });
    }

    if (action === 'PAUSE') {
      const sessionDoc = await pauseExerciseSession(sessionId, completedSets || 0, completedRepetitions || 0);
      return NextResponse.json({ success: true, session: sessionDoc });
    }

    if (action === 'RESUME') {
      const sessionDoc = await resumeExerciseSession(sessionId, additionalPauseSeconds || 0);
      return NextResponse.json({ success: true, session: sessionDoc });
    }

    if (action === 'END') {
      const sessionDoc = await endExerciseSession(
        sessionId,
        completedSets || 0,
        completedRepetitions || 0,
        notes,
        painLevel,
        difficulty
      );
      return NextResponse.json({ success: true, session: sessionDoc });
    }

    return NextResponse.json({ error: 'Invalid session action' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
