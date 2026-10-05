import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IExercise extends Document {
  name: string;
  category: 'Mobility' | 'Strength' | 'Flexibility' | 'Balance' | 'Recovery' | 'Functional Training';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  targetArea: string;
  recommendedSets: number;
  recommendedReps: number;
  holdDurationSeconds?: number;
  restDurationSeconds: number;
  description: string;
  instructions: string[];
  safetyNotes?: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ExerciseSchema = new Schema<IExercise>(
  {
    name: { type: String, required: true },
    category: {
      type: String,
      enum: ['Mobility', 'Strength', 'Flexibility', 'Balance', 'Recovery', 'Functional Training'],
      required: true,
    },
    difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
    targetArea: { type: String, required: true },
    recommendedSets: { type: Number, default: 3 },
    recommendedReps: { type: Number, default: 10 },
    holdDurationSeconds: { type: Number, default: 3 },
    restDurationSeconds: { type: Number, default: 30 },
    description: { type: String, required: true },
    instructions: [{ type: String }],
    safetyNotes: { type: String },
    imageUrl: { type: String },
  },
  { timestamps: true }
);

export const Exercise: Model<IExercise> = mongoose.models.Exercise || mongoose.model<IExercise>('Exercise', ExerciseSchema);
