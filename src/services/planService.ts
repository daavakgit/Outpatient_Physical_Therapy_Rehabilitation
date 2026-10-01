import { connectToDatabase } from '@/lib/db';
import { RehabilitationPlan, IRehabilitationPlan } from '@/models/RehabilitationPlan';

export async function getPlanByPatientId(patientId: string) {
  await connectToDatabase();
  const plan = await RehabilitationPlan.findOne({ patientId, status: 'ACTIVE' }).populate('patientId therapistId');
  if (!plan) return null;
  return JSON.parse(JSON.stringify(plan));
}

export async function createOrUpdatePlan(data: Partial<IRehabilitationPlan>) {
  await connectToDatabase();
  if (data._id) {
    const updated = await RehabilitationPlan.findByIdAndUpdate(data._id, data, { new: true });
    return JSON.parse(JSON.stringify(updated));
  } else {
    const created = await RehabilitationPlan.create(data);
    return JSON.parse(JSON.stringify(created));
  }
}
