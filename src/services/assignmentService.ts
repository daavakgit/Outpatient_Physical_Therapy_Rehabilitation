import { connectToDatabase } from '@/lib/db';
import { ExerciseAssignment } from '@/models/ExerciseAssignment';
import { readStore, writeStore } from '@/lib/persistentStore';
import { getExercises } from '@/services/exerciseService';

export async function createExerciseAssignment(data: {
  exerciseId: string;
  patientId: string;
  therapistId?: string;
  rehabilitationPlanId?: string;
  phaseId?: string;
  phaseName?: string;
  sets: number;
  repetitions: number;
  frequencyDaysPerWeek: number;
  holdDurationSeconds?: number;
  restDurationSeconds?: number;
  startDate?: string;
  endDate?: string;
  therapistNotes?: string;
}) {
  const { isFallback } = await connectToDatabase();

  // Try fetching complete exercise object
  const allExercises = await getExercises();
  const matchedExercise = allExercises.find(
    (e: any) => String(e._id || e.id) === String(data.exerciseId)
  );

  const exerciseObj = matchedExercise || {
    _id: data.exerciseId,
    name: 'Therapeutic Exercise',
    category: 'Strength',
    difficulty: 'Beginner',
    targetArea: 'Target Muscle Group',
    description: 'Patient-specific therapeutic protocol.',
    instructions: ['Perform exercise as prescribed by physical therapist.'],
    imageUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=600&q=80',
  };

  const newAssignment = {
    _id: `assign_${Date.now()}`,
    id: `assign_${Date.now()}`,
    exerciseId: exerciseObj,
    patientId: data.patientId,
    therapistId: data.therapistId || 'tp_1',
    rehabilitationPlanId: data.rehabilitationPlanId,
    phaseId: data.phaseId,
    phaseName: data.phaseName || 'Phase 2: Mobility & Strength',
    sets: Number(data.sets) || 3,
    repetitions: Number(data.repetitions) || 10,
    frequencyDaysPerWeek: Number(data.frequencyDaysPerWeek) || 5,
    holdDurationSeconds: Number(data.holdDurationSeconds) || 3,
    restDurationSeconds: Number(data.restDurationSeconds) || 30,
    startDate: data.startDate || new Date().toISOString().split('T')[0],
    endDate: data.endDate,
    therapistNotes: data.therapistNotes || '',
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
  };

  const store = readStore();
  store.assignments.unshift(newAssignment);
  writeStore(store);

  if (!isFallback) {
    try {
      const validMongoExerciseId = String(data.exerciseId).length === 24 ? data.exerciseId : undefined;

      const assignmentDoc = await ExerciseAssignment.create({
        exerciseId: validMongoExerciseId,
        patientId: data.patientId,
        therapistId: data.therapistId,
        rehabilitationPlanId: data.rehabilitationPlanId,
        phaseId: data.phaseId,
        phaseName: data.phaseName || 'Phase 2: Mobility & Strength',
        sets: Number(data.sets) || 3,
        repetitions: Number(data.repetitions) || 10,
        frequencyDaysPerWeek: Number(data.frequencyDaysPerWeek) || 5,
        holdDurationSeconds: Number(data.holdDurationSeconds) || 3,
        restDurationSeconds: Number(data.restDurationSeconds) || 30,
        startDate: data.startDate ? new Date(data.startDate) : new Date(),
        endDate: data.endDate ? new Date(data.endDate) : undefined,
        therapistNotes: data.therapistNotes || '',
        status: 'ACTIVE',
      });

      const populated = await ExerciseAssignment.findById(assignmentDoc._id)
        .populate('exerciseId')
        .populate('patientId')
        .populate('therapistId');

      if (populated) return JSON.parse(JSON.stringify(populated));
    } catch (e) {
      console.error('Error creating assignment in Mongo:', e);
    }
  }

  return newAssignment;
}

export async function getAssignmentsByPatient(patientId?: string) {
  const { isFallback } = await connectToDatabase();
  const store = readStore();

  let mongoAssignments: any[] = [];
  if (!isFallback) {
    try {
      const query: any = { status: { $ne: 'CANCELLED' } };
      if (patientId) {
        query.$or = [
          { patientId },
          { 'patientId._id': patientId },
        ];
      }

      const assignments = await ExerciseAssignment.find(query)
        .populate('exerciseId')
        .populate('patientId')
        .sort({ createdAt: -1 });

      if (assignments && assignments.length > 0) {
        mongoAssignments = JSON.parse(JSON.stringify(assignments));
      }
    } catch (e) {
      console.error('Error fetching assignments from Mongo:', e);
    }
  }

  const fileAssignments = store.assignments.filter((a) => {
    if (!patientId) return true;
    const aPatId = typeof a.patientId === 'object' ? (a.patientId._id || a.patientId.id) : a.patientId;
    return String(aPatId) === String(patientId);
  });

  const merged = [...fileAssignments];
  for (const mA of mongoAssignments) {
    const mAId = String(mA._id || mA.id);
    if (!merged.some((fA) => String(fA._id || fA.id) === mAId)) {
      merged.push(mA);
    }
  }

  return merged;
}

export async function getAssignmentById(assignmentId: string) {
  const { isFallback } = await connectToDatabase();
  const store = readStore();
  const item = store.assignments.find((a) => (a._id || a.id) === assignmentId);

  if (!isFallback) {
    try {
      const assignment = await ExerciseAssignment.findById(assignmentId)
        .populate('exerciseId')
        .populate('patientId')
        .populate('therapistId');

      if (assignment) return JSON.parse(JSON.stringify(assignment));
    } catch (e) {
      console.error('Error fetching assignment by ID from Mongo:', e);
    }
  }

  return item || store.assignments[0] || null;
}

export async function updateAssignmentStatus(assignmentId: string, status: string) {
  const { isFallback } = await connectToDatabase();

  const store = readStore();
  const item = store.assignments.find((a) => (a._id || a.id) === assignmentId);
  if (item) {
    item.status = status;
    writeStore(store);
  }

  if (!isFallback) {
    try {
      const updated = await ExerciseAssignment.findByIdAndUpdate(
        assignmentId,
        { $set: { status } },
        { new: true }
      );
      if (updated) return JSON.parse(JSON.stringify(updated));
    } catch (e) {
      console.error('Error updating assignment status in Mongo:', e);
    }
  }

  return item;
}
