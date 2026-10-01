import { connectToDatabase } from '@/lib/db';
import { Exercise } from '@/models/Exercise';
import { initialMockExercises } from '@/lib/mockData';

export async function getExercises(filter?: { category?: string; search?: string }) {
  const { isFallback } = await connectToDatabase();

  if (isFallback) {
    let result = [...initialMockExercises];
    if (filter?.category && filter.category !== 'All') {
      result = result.filter((ex) => ex.category === filter.category);
    }
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      result = result.filter((ex) => ex.name.toLowerCase().includes(q) || ex.targetArea.toLowerCase().includes(q));
    }
    return result;
  }

  try {
    const query: any = {};
    if (filter?.category && filter.category !== 'All') {
      query.category = filter.category;
    }
    if (filter?.search) {
      query.name = { $regex: filter.search, $options: 'i' };
    }
    const exercises = await Exercise.find(query).sort({ createdAt: -1 });
    return JSON.parse(JSON.stringify(exercises));
  } catch (e) {
    return initialMockExercises;
  }
}

export async function getExerciseById(id: string) {
  const { isFallback } = await connectToDatabase();

  if (isFallback) {
    const ex = initialMockExercises.find((e) => e._id === id);
    return ex || initialMockExercises[0];
  }

  try {
    const exercise = await Exercise.findById(id);
    if (!exercise) {
      return initialMockExercises[0];
    }
    return JSON.parse(JSON.stringify(exercise));
  } catch (e) {
    return initialMockExercises[0];
  }
}

export async function createExercise(data: any) {
  const { isFallback } = await connectToDatabase();
  if (isFallback) {
    const newEx = { _id: `ex_${Date.now()}`, ...data };
    initialMockExercises.unshift(newEx);
    return newEx;
  }

  const exercise = new Exercise(data);
  await exercise.save();
  return JSON.parse(JSON.stringify(exercise));
}
