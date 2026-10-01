import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IExerciseSession extends Document {
  patientId: mongoose.Types.ObjectId;
  exerciseId: mongoose.Types.ObjectId;
  exerciseName: string;
  startTime: Date;
  endTime?: Date;
  duration: number; // calculated duration in seconds
  targetSets: number;
  completedSets: number;
  targetRepetitions: number;
  completedRepetitions: number;
  pauseDuration: number; // pause time in seconds
  status: 'STARTED' | 'PAUSED' | 'COMPLETED' | 'CANCELLED' | 'PARTIALLY_COMPLETED';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ExerciseSessionSchema = new Schema<IExerciseSession>(
  {
    patientId: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
    exerciseId: { type: Schema.Types.ObjectId, ref: 'Exercise', required: true },
    exerciseName: { type: String, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date },
    duration: { type: Number, default: 0 },
    targetSets: { type: Number, required: true },
    completedSets: { type: Number, default: 0 },
    targetRepetitions: { type: Number, required: true },
    completedRepetitions: { type: Number, default: 0 },
    pauseDuration: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['STARTED', 'PAUSED', 'COMPLETED', 'CANCELLED', 'PARTIALLY_COMPLETED'],
      default: 'STARTED',
    },
    notes: { type: String },
  },
  { timestamps: true }
);

export const ExerciseSession: Model<IExerciseSession> =
  mongoose.models.ExerciseSession ||
  mongoose.model<IExerciseSession>('ExerciseSession', ExerciseSessionSchema);
