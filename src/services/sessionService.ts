import { connectToDatabase } from '@/lib/db';
import { ExerciseSession } from '@/models/ExerciseSession';
import { Exercise } from '@/models/Exercise';
import { readStore, writeStore } from '@/lib/persistentStore';

export async function startExerciseSession(
  patientId: string,
  exerciseId: string,
  exerciseAssignmentId?: string,
  customSets?: number,
  customReps?: number
) {
  const { isFallback } = await connectToDatabase();

  const store = readStore();
  const ex = store.exercises.find((e) => e._id === exerciseId) || store.exercises[0];

  const session = {
    _id: `ses_${Date.now()}`,
    patientId,
    exerciseId: ex ? ex._id : exerciseId,
    exerciseAssignmentId,
    exerciseName: ex ? ex.name : 'Targeted Exercise',
    startTime: new Date().toISOString(),
    targetSets: customSets || (ex ? ex.recommendedSets : 3),
    completedSets: 0,
    targetRepetitions: (customSets || (ex ? ex.recommendedSets : 3)) * (customReps || (ex ? ex.recommendedReps : 10)),
    completedRepetitions: 0,
    pauseDuration: 0,
    duration: 0,
    status: 'STARTED',
  };

  store.sessions.push(session);
  writeStore(store);

  if (!isFallback) {
    try {
      const exercise = await Exercise.findById(exerciseId);
      const exName = exercise ? exercise.name : 'Targeted Exercise';
      const recSets = customSets || (exercise ? exercise.recommendedSets : 3);
      const recReps = customReps || (exercise ? exercise.recommendedReps : 10);

      const dbSession = await ExerciseSession.create({
        patientId,
        exerciseId,
        exerciseAssignmentId: exerciseAssignmentId || undefined,
        exerciseName: exName,
        startTime: new Date(),
        targetSets: recSets,
        completedSets: 0,
        targetRepetitions: recSets * recReps,
        completedRepetitions: 0,
        pauseDuration: 0,
        duration: 0,
        status: 'STARTED',
      });

      return JSON.parse(JSON.stringify(dbSession));
    } catch (e) {
      console.error('Error starting session in Mongo:', e);
    }
  }

  return session;
}

export async function pauseExerciseSession(sessionId: string, currentCompletedSets: number, currentCompletedReps: number) {
  const { isFallback } = await connectToDatabase();

  const store = readStore();
  const session = store.sessions.find((s) => s._id === sessionId);
  if (session) {
    session.status = 'PAUSED';
    session.completedSets = currentCompletedSets;
    session.completedRepetitions = currentCompletedReps;
    writeStore(store);
  }

  if (!isFallback) {
    try {
      const dbSession = await ExerciseSession.findById(sessionId);
      if (dbSession) {
        dbSession.status = 'PAUSED';
        dbSession.completedSets = currentCompletedSets;
        dbSession.completedRepetitions = currentCompletedReps;
        await dbSession.save();
        return JSON.parse(JSON.stringify(dbSession));
      }
    } catch (e) {
      console.error(e);
    }
  }

  return session || { _id: sessionId, status: 'PAUSED' };
}

export async function resumeExerciseSession(sessionId: string, additionalPauseSeconds: number = 0) {
  const { isFallback } = await connectToDatabase();

  const store = readStore();
  const session = store.sessions.find((s) => s._id === sessionId);
  if (session) {
    session.status = 'STARTED';
    session.pauseDuration = (session.pauseDuration || 0) + additionalPauseSeconds;
    writeStore(store);
  }

  if (!isFallback) {
    try {
      const dbSession = await ExerciseSession.findById(sessionId);
      if (dbSession) {
        dbSession.status = 'STARTED';
        dbSession.pauseDuration += additionalPauseSeconds;
        await dbSession.save();
        return JSON.parse(JSON.stringify(dbSession));
      }
    } catch (e) {
      console.error(e);
    }
  }

  return session || { _id: sessionId, status: 'STARTED' };
}

export async function endExerciseSession(
  sessionId: string,
  completedSets: number,
  completedRepetitions: number,
  notes?: string,
  painLevel?: number,
  difficulty?: 'Easy' | 'Moderate' | 'Hard'
) {
  const { isFallback } = await connectToDatabase();

  const store = readStore();
  let session = store.sessions.find((s) => s._id === sessionId);
  if (!session) {
    session = {
      _id: sessionId,
      startTime: new Date(Date.now() - 300000).toISOString(),
      exerciseName: 'Targeted Exercise',
      targetSets: 3,
      pauseDuration: 0,
    };
    store.sessions.push(session);
  }

  const now = new Date();
  session.endTime = now.toISOString();
  const totalElapsedSeconds = Math.max(0, Math.floor((now.getTime() - new Date(session.startTime).getTime()) / 1000));
  session.duration = Math.max(0, totalElapsedSeconds - (session.pauseDuration || 0));
  session.completedSets = completedSets;
  session.completedRepetitions = completedRepetitions;
  session.notes = notes;
  session.painLevel = painLevel || 0;
  session.difficulty = difficulty || 'Moderate';
  session.status = completedSets >= (session.targetSets || 3) ? 'COMPLETED' : 'PARTIALLY_COMPLETED';
  writeStore(store);

  if (!isFallback) {
    try {
      const dbSession = await ExerciseSession.findById(sessionId);
      if (dbSession) {
        dbSession.endTime = now;
        dbSession.duration = session.duration;
        dbSession.completedSets = completedSets;
        dbSession.completedRepetitions = completedRepetitions;
        dbSession.notes = notes;
        if (painLevel !== undefined) dbSession.painLevel = painLevel;
        if (difficulty) dbSession.difficulty = difficulty;
        dbSession.status = completedSets >= dbSession.targetSets ? 'COMPLETED' : 'PARTIALLY_COMPLETED';
        await dbSession.save();
        return JSON.parse(JSON.stringify(dbSession));
      }
    } catch (e) {
      console.error('Error ending session in Mongo:', e);
    }
  }

  return session;
}
