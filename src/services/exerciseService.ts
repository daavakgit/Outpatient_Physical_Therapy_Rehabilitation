import { connectToDatabase } from '@/lib/db';
import { Exercise } from '@/models/Exercise';
import { readStore, writeStore } from '@/lib/persistentStore';

export async function getExercises(filter?: { category?: string; search?: string }) {
  const store = readStore();
  let dbExercises: any[] = [];

  try {
    const { isFallback } = await connectToDatabase();
    if (!isFallback) {
      const query: any = {};
      if (filter?.category && filter.category !== 'All' && filter.category !== 'ALL') {
        query.category = filter.category;
      }
      if (filter?.search) {
        query.name = { $regex: filter.search, $options: 'i' };
      }
      const exercises = await Exercise.find(query).sort({ createdAt: -1 });
      dbExercises = JSON.parse(JSON.stringify(exercises));
    }
  } catch (e) {
    console.error('getExercises Mongo error:', e);
  }

  // Merge store exercises and DB exercises smoothly
  const merged = [...store.exercises];
  for (const dbE of dbExercises) {
    if (!merged.some((m) => (m._id || m.id) === (dbE._id || dbE.id))) {
      merged.push(dbE);
    }
  }

  let result = merged;
  if (filter?.category && filter.category !== 'All' && filter.category !== 'ALL') {
    result = result.filter((ex) => ex.category === filter.category);
  }
  if (filter?.search) {
    const q = filter.search.toLowerCase();
    result = result.filter(
      (ex) => (ex.name || '').toLowerCase().includes(q) || (ex.targetArea || '').toLowerCase().includes(q)
    );
  }

  return result;
}

export async function getExerciseById(id: string) {
  const store = readStore();
  const foundInStore = store.exercises.find((e) => (e._id || e.id) === id);
  if (foundInStore) return foundInStore;

  try {
    const { isFallback } = await connectToDatabase();
    if (!isFallback) {
      const exercise = await Exercise.findById(id);
      if (exercise) return JSON.parse(JSON.stringify(exercise));
    }
  } catch (e) {
    console.error('getExerciseById error:', e);
  }

  return store.exercises[0] || null;
}

export async function createExercise(data: any) {
  const store = readStore();
  const newExId = data._id || data.id || `ex_${Date.now()}`;
  const newEx = {
    _id: newExId,
    id: newExId,
    name: data.name,
    category: data.category || 'Mobility',
    difficulty: data.difficulty || 'Beginner',
    targetArea: data.targetArea || 'General',
    description: data.description || '',
    recommendedSets: Number(data.recommendedSets) || 3,
    recommendedReps: Number(data.recommendedReps) || 10,
    holdDurationSeconds: Number(data.holdDurationSeconds) || 3,
    restDurationSeconds: Number(data.restDurationSeconds) || 30,
    instructions: Array.isArray(data.instructions) ? data.instructions : [data.instructions || 'Perform exercise carefully.'],
    safetyNotes: data.safetyNotes || '',
    imageUrl: data.imageUrl || 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=600&q=80',
    createdAt: new Date().toISOString(),
  };

  const idx = store.exercises.findIndex((e) => (e._id || e.id) === newExId);
  if (idx >= 0) {
    store.exercises[idx] = newEx;
  } else {
    store.exercises.unshift(newEx);
  }
  writeStore(store);

  try {
    const { isFallback } = await connectToDatabase();
    if (!isFallback) {
      const exercise = new Exercise(data);
      await exercise.save();
      return JSON.parse(JSON.stringify(exercise));
    }
  } catch (e) {
    console.error('Error saving exercise to Mongo:', e);
  }

  return newEx;
}

export async function updateExercise(id: string, data: any) {
  const store = readStore();
  const idx = store.exercises.findIndex((e) => (e._id || e.id) === id);
  if (idx !== -1) {
    store.exercises[idx] = { ...store.exercises[idx], ...data };
    writeStore(store);
  }

  try {
    const { isFallback } = await connectToDatabase();
    if (!isFallback) {
      const updated = await Exercise.findByIdAndUpdate(id, { $set: data }, { new: true });
      if (updated) return JSON.parse(JSON.stringify(updated));
    }
  } catch (e) {
    console.error('Error updating exercise in Mongo:', e);
  }

  return idx !== -1 ? store.exercises[idx] : null;
}

export async function deleteExercise(id: string) {
  const store = readStore();
  const idx = store.exercises.findIndex((e) => (e._id || e.id) === id);
  if (idx !== -1) {
    store.exercises.splice(idx, 1);
    writeStore(store);
  }

  try {
    const { isFallback } = await connectToDatabase();
    if (!isFallback) {
      await Exercise.findByIdAndDelete(id);
    }
  } catch (e) {
    console.error('Error deleting exercise from Mongo:', e);
  }

  return true;
}
