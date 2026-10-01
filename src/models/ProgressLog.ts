import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProgressLog extends Document {
  patientId: mongoose.Types.ObjectId;
  date: Date;
  painLevel: number; // 0 to 10 scale
  rangeOfMotionDegrees?: number;
  exercisesCompletedCount: number;
  dailyCompletionPercentage: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProgressLogSchema = new Schema<IProgressLog>(
  {
    patientId: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
    date: { type: Date, default: Date.now },
    painLevel: { type: Number, min: 0, max: 10, default: 2 },
    rangeOfMotionDegrees: { type: Number },
    exercisesCompletedCount: { type: Number, default: 0 },
    dailyCompletionPercentage: { type: Number, default: 0 },
    notes: { type: String },
  },
  { timestamps: true }
);

export const ProgressLog: Model<IProgressLog> =
  mongoose.models.ProgressLog || mongoose.model<IProgressLog>('ProgressLog', ProgressLogSchema);
