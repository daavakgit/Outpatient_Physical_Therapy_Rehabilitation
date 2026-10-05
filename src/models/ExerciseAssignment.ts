import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IExerciseAssignment extends Document {
  exerciseId: mongoose.Types.ObjectId;
  patientId: mongoose.Types.ObjectId;
  therapistId?: mongoose.Types.ObjectId;
  rehabilitationPlanId?: mongoose.Types.ObjectId;
  phaseId?: string;
  phaseName?: string;
  sets: number;
  repetitions: number;
  frequencyDaysPerWeek: number;
  holdDurationSeconds: number;
  restDurationSeconds: number;
  startDate?: Date;
  endDate?: Date;
  therapistNotes?: string;
  status: 'NOT_STARTED' | 'ACTIVE' | 'IN_PROGRESS' | 'COMPLETED' | 'PAUSED' | 'ON_HOLD' | 'CANCELLED';
  createdAt: Date;
  updatedAt: Date;
}

const ExerciseAssignmentSchema = new Schema<IExerciseAssignment>(
  {
    exerciseId: { type: Schema.Types.ObjectId, ref: 'Exercise', required: true },
    patientId: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
    therapistId: { type: Schema.Types.ObjectId, ref: 'Therapist' },
    rehabilitationPlanId: { type: Schema.Types.ObjectId, ref: 'RehabilitationPlan' },
    phaseId: { type: String },
    phaseName: { type: String, default: 'Strength Development' },
    sets: { type: Number, required: true, default: 3 },
    repetitions: { type: Number, required: true, default: 10 },
    frequencyDaysPerWeek: { type: Number, required: true, default: 5 },
    holdDurationSeconds: { type: Number, default: 3 },
    restDurationSeconds: { type: Number, default: 30 },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date },
    therapistNotes: { type: String },
    status: {
      type: String,
      enum: ['NOT_STARTED', 'ACTIVE', 'IN_PROGRESS', 'COMPLETED', 'PAUSED', 'ON_HOLD', 'CANCELLED'],
      default: 'ACTIVE',
    },
  },
  { timestamps: true }
);

export const ExerciseAssignment: Model<IExerciseAssignment> =
  mongoose.models.ExerciseAssignment ||
  mongoose.model<IExerciseAssignment>('ExerciseAssignment', ExerciseAssignmentSchema);
