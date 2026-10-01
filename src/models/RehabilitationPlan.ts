import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPlanExercise {
  exerciseId: mongoose.Types.ObjectId;
  exerciseName: string;
  targetSets: number;
  targetReps: number;
  frequencyPerWeek: number;
  notes?: string;
}

export interface IRehabilitationPlan extends Document {
  title: string;
  patientId: mongoose.Types.ObjectId;
  therapistId: mongoose.Types.ObjectId;
  startDate: Date;
  expectedDurationWeeks: number;
  currentPhase: 'Phase 1: Pain Management' | 'Phase 2: Mobility Improvement' | 'Phase 3: Strength Development' | 'Phase 4: Functional Recovery';
  overallCompletionPercentage: number;
  exercises: IPlanExercise[];
  therapistNotes?: string;
  status: 'ACTIVE' | 'COMPLETED' | 'PAUSED';
  createdAt: Date;
  updatedAt: Date;
}

const PlanExerciseSchema = new Schema<IPlanExercise>({
  exerciseId: { type: Schema.Types.ObjectId, ref: 'Exercise', required: true },
  exerciseName: { type: String, required: true },
  targetSets: { type: Number, required: true },
  targetReps: { type: Number, required: true },
  frequencyPerWeek: { type: Number, default: 5 },
  notes: { type: String },
});

const RehabilitationPlanSchema = new Schema<IRehabilitationPlan>(
  {
    title: { type: String, required: true },
    patientId: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
    therapistId: { type: Schema.Types.ObjectId, ref: 'Therapist', required: true },
    startDate: { type: Date, default: Date.now },
    expectedDurationWeeks: { type: Number, default: 8 },
    currentPhase: {
      type: String,
      enum: [
        'Phase 1: Pain Management',
        'Phase 2: Mobility Improvement',
        'Phase 3: Strength Development',
        'Phase 4: Functional Recovery',
      ],
      default: 'Phase 2: Mobility Improvement',
    },
    overallCompletionPercentage: { type: Number, default: 0 },
    exercises: [PlanExerciseSchema],
    therapistNotes: { type: String },
    status: { type: String, enum: ['ACTIVE', 'COMPLETED', 'PAUSED'], default: 'ACTIVE' },
  },
  { timestamps: true }
);

export const RehabilitationPlan: Model<IRehabilitationPlan> =
  mongoose.models.RehabilitationPlan ||
  mongoose.model<IRehabilitationPlan>('RehabilitationPlan', RehabilitationPlanSchema);
