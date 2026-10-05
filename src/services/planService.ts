import { connectToDatabase } from '@/lib/db';
import { RehabilitationPlan, IRehabilitationPlan } from '@/models/RehabilitationPlan';
import { readStore, writeStore } from '@/lib/persistentStore';

export async function getAllPlans() {
  const store = readStore();
  let dbPlans: any[] = [];
  try {
    const { isFallback } = await connectToDatabase();
    if (!isFallback) {
      const plans = await RehabilitationPlan.find().sort({ updatedAt: -1 });
      dbPlans = JSON.parse(JSON.stringify(plans));
    }
  } catch (err) {
    console.error('MongoDB getAllPlans error:', err);
  }

  const merged = [...store.plans];
  for (const dbP of dbPlans) {
    if (!merged.some((m) => (m._id || m.id) === (dbP._id || dbP.id))) {
      merged.push(dbP);
    }
  }
  return merged;
}

export async function getPlanByPatientId(patientId?: string) {
  const store = readStore();
  if (patientId) {
    try {
      const { isFallback } = await connectToDatabase();
      if (!isFallback) {
        const plan = await RehabilitationPlan.findOne({
          $or: [{ patientId }, { _id: patientId }],
        }).populate('patientId therapistId');
        if (plan) return JSON.parse(JSON.stringify(plan));
      }
    } catch (err) {
      console.error('MongoDB getPlanByPatientId error:', err);
    }

    const matchedStorePlan = store.plans.find(
      (p) =>
        p.patientId === patientId ||
        p._id === patientId ||
        (p.patientId && p.patientId._id === patientId)
    );
    if (matchedStorePlan) return matchedStorePlan;
  }

  return store.plans[0] || null;
}

export async function createOrUpdatePlan(data: Partial<IRehabilitationPlan> & Record<string, any>) {
  const store = readStore();
  const planId = data._id || data.id || `plan_${Date.now()}`;
  const planObj = {
    _id: planId,
    id: planId,
    patientId: data.patientId || 'pat_1',
    patientName: data.patientName || 'Alex Morgan',
    title: data.title || 'Rehabilitation Plan',
    startDate: data.startDate || new Date().toISOString().split('T')[0],
    expectedDurationWeeks: data.expectedDurationWeeks || 8,
    currentPhase: data.currentPhase || 'Phase 1: Pain Control',
    overallCompletionPercentage: data.overallCompletionPercentage || 0,
    status: data.status || 'ACTIVE',
    exercisesCount: data.exercisesCount || (data.exercises ? data.exercises.length : 3),
    therapistNotes: data.therapistNotes || '',
    exercises: data.exercises || [],
    createdAt: data.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const existingIdx = store.plans.findIndex((p) => (p._id || p.id) === planId);
  if (existingIdx >= 0) {
    store.plans[existingIdx] = { ...store.plans[existingIdx], ...planObj };
  } else {
    store.plans.unshift(planObj);
  }
  writeStore(store);

  try {
    const { isFallback } = await connectToDatabase();
    if (!isFallback) {
      if (data._id && String(data._id).length === 24) {
        await RehabilitationPlan.findByIdAndUpdate(data._id, data, { new: true });
      } else {
        await RehabilitationPlan.create(data);
      }
    }
  } catch (err) {
    console.error('MongoDB createOrUpdatePlan error:', err);
  }

  return planObj;
}

export async function deletePlan(id: string) {
  const store = readStore();
  const idx = store.plans.findIndex((p) => (p._id || p.id) === id);
  if (idx !== -1) {
    store.plans.splice(idx, 1);
    writeStore(store);
  }

  try {
    const { isFallback } = await connectToDatabase();
    if (!isFallback) {
      await RehabilitationPlan.findByIdAndDelete(id);
    }
  } catch (err) {
    console.error('MongoDB deletePlan error:', err);
  }

  return true;
}
