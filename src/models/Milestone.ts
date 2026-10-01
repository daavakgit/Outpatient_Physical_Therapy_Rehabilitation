import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMilestone extends Document {
  patientId: mongoose.Types.ObjectId;
  planId?: mongoose.Types.ObjectId;
  title: string;
  description: string;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'PENDING';
  progress: number;
  order: number;
  completionDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const MilestoneSchema = new Schema<IMilestone>(
  {
    patientId: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
    planId: { type: Schema.Types.ObjectId, ref: 'RehabilitationPlan' },
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, enum: ['COMPLETED', 'IN_PROGRESS', 'PENDING'], default: 'PENDING' },
    progress: { type: Number, default: 0 },
    order: { type: Number, default: 1 },
    completionDate: { type: Date },
  },
  { timestamps: true }
);

export const Milestone: Model<IMilestone> =
  mongoose.models.Milestone || mongoose.model<IMilestone>('Milestone', MilestoneSchema);
