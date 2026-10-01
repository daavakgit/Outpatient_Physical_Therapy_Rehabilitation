import { connectToDatabase } from '@/lib/db';
import { ExerciseSession } from '@/models/ExerciseSession';
import { Exercise } from '@/models/Exercise';
import { ProgressLog } from '@/models/ProgressLog';
import { Notification } from '@/models/Notification';
import { Patient } from '@/models/Patient';
import { User } from '@/models/User';
import { initialMockExercises } from '@/lib/mockData';

const mockSessions: any[] = [];

export async function startExerciseSession(patientId: string, exerciseId: string) {
  const { isFallback } = await connectToDatabase();

  if (isFallback) {
    const ex = initialMockExercises.find((e) => e._id === exerciseId) || initialMockExercises[0];
    const session = {
      _id: `ses_${Date.now()}`,
      patientId,
      exerciseId: ex._id,
      exerciseName: ex.name,
      startTime: new Date().toISOString(),
      targetSets: ex.recommendedSets,
      completedSets: 0,
      targetRepetitions: ex.recommendedSets * ex.recommendedReps,
      completedRepetitions: 0,
      pauseDuration: 0,
      duration: 0,
      status: 'STARTED',
    };
    mockSessions.push(session);
    return session;
  }

  try {
    const exercise = await Exercise.findById(exerciseId);
    const exName = exercise ? exercise.name : 'Quad Sets with Towel Roll';
    const recSets = exercise ? exercise.recommendedSets : 3;
    const recReps = exercise ? exercise.recommendedReps : 10;

    const now = new Date();
    const session = await ExerciseSession.create({
      patientId,
      exerciseId,
      exerciseName: exName,
      startTime: now,
      targetSets: recSets,
      completedSets: 0,
      targetRepetitions: recSets * recReps,
      completedRepetitions: 0,
      pauseDuration: 0,
      duration: 0,
      status: 'STARTED',
    });

    return JSON.parse(JSON.stringify(session));
  } catch (e) {
    const session = {
      _id: `ses_${Date.now()}`,
      patientId,
      exerciseId,
      exerciseName: 'Quad Sets with Towel Roll',
      startTime: new Date().toISOString(),
      targetSets: 3,
      completedSets: 0,
      targetRepetitions: 30,
      completedRepetitions: 0,
      pauseDuration: 0,
      duration: 0,
      status: 'STARTED',
    };
    mockSessions.push(session);
    return session;
  }
}

export async function pauseExerciseSession(sessionId: string, currentCompletedSets: number, currentCompletedReps: number) {
  const { isFallback } = await connectToDatabase();

  if (isFallback) {
    const session = mockSessions.find((s) => s._id === sessionId);
    if (session) {
      session.status = 'PAUSED';
      session.completedSets = currentCompletedSets;
      session.completedRepetitions = currentCompletedReps;
    }
    return session || { _id: sessionId, status: 'PAUSED' };
  }

  try {
    const session = await ExerciseSession.findById(sessionId);
    if (session) {
      session.status = 'PAUSED';
      session.completedSets = currentCompletedSets;
      session.completedRepetitions = currentCompletedReps;
      await session.save();
      return JSON.parse(JSON.stringify(session));
    }
  } catch (e) {
    console.error(e);
  }
  return { _id: sessionId, status: 'PAUSED' };
}

export async function resumeExerciseSession(sessionId: string, additionalPauseSeconds: number = 0) {
  const { isFallback } = await connectToDatabase();

  if (isFallback) {
    const session = mockSessions.find((s) => s._id === sessionId);
    if (session) {
      session.status = 'STARTED';
      session.pauseDuration = (session.pauseDuration || 0) + additionalPauseSeconds;
    }
    return session || { _id: sessionId, status: 'STARTED' };
  }

  try {
    const session = await ExerciseSession.findById(sessionId);
    if (session) {
      session.status = 'STARTED';
      session.pauseDuration += additionalPauseSeconds;
      await session.save();
      return JSON.parse(JSON.stringify(session));
    }
  } catch (e) {
    console.error(e);
  }
  return { _id: sessionId, status: 'STARTED' };
}

export async function endExerciseSession(
  sessionId: string,
  completedSets: number,
  completedRepetitions: number,
  notes?: string
) {
  const { isFallback } = await connectToDatabase();

  if (isFallback) {
    const session = mockSessions.find((s) => s._id === sessionId) || {
      _id: sessionId,
      startTime: new Date(Date.now() - 300000).toISOString(),
      exerciseName: 'Quad Sets with Towel Roll',
      targetSets: 3,
      pauseDuration: 0,
    };
    const now = new Date();
    session.endTime = now.toISOString();
    const totalElapsedSeconds = Math.max(0, Math.floor((now.getTime() - new Date(session.startTime).getTime()) / 1000));
    session.duration = Math.max(0, totalElapsedSeconds - (session.pauseDuration || 0));
    session.completedSets = completedSets;
    session.completedRepetitions = completedRepetitions;
    session.notes = notes;
    session.status = completedSets >= (session.targetSets || 3) ? 'COMPLETED' : 'PARTIALLY_COMPLETED';
    return session;
  }

  try {
    const session = await ExerciseSession.findById(sessionId);
    if (!session) throw new Error('Session not found.');

    const now = new Date();
    session.endTime = now;

    const totalElapsedSeconds = Math.max(0, Math.floor((now.getTime() - new Date(session.startTime).getTime()) / 1000));
    const netDuration = Math.max(0, totalElapsedSeconds - (session.pauseDuration || 0));

    session.duration = netDuration;
    session.completedSets = completedSets;
    session.completedRepetitions = completedRepetitions;
    session.notes = notes;
    session.status = completedSets >= session.targetSets ? 'COMPLETED' : 'PARTIALLY_COMPLETED';

    await session.save();
    return JSON.parse(JSON.stringify(session));
  } catch (e) {
    return {
      _id: sessionId,
      status: 'COMPLETED',
      completedSets,
      completedRepetitions,
      notes,
    };
  }
}
