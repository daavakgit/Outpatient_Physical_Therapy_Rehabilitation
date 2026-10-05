import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPatient extends Document {
  userId: mongoose.Types.ObjectId;
  fullName: string;
  email?: string;
  phone?: string;
  mrn?: string;
  age?: number;
  dateOfBirth?: string;
  gender?: string;
  primaryTherapistId?: mongoose.Types.ObjectId;
  condition: string; // e.g. Post-ACL Reconstruction, Rotator Cuff Repair
  phase?: string;
  adherence?: number;
  medicalHistory?: string;
  recoveryGoals?: string[];
  startDate: Date;
  status: 'ACTIVE' | 'COMPLETED' | 'ON_HOLD';
  createdAt: Date;
  updatedAt: Date;
}

const PatientSchema = new Schema<IPatient>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    fullName: { type: String, required: true },
    email: { type: String },
    phone: { type: String },
    mrn: { type: String },
    age: { type: Number },
    dateOfBirth: { type: String },
    gender: { type: String },
    primaryTherapistId: { type: Schema.Types.ObjectId, ref: 'Therapist' },
    condition: { type: String, default: 'General Rehabilitation' },
    phase: { type: String, default: 'Phase 1: Mobility' },
    adherence: { type: Number, default: 90 },
    medicalHistory: { type: String },
    recoveryGoals: [{ type: String }],
    startDate: { type: Date, default: Date.now },
    status: { type: String, enum: ['ACTIVE', 'COMPLETED', 'ON_HOLD'], default: 'ACTIVE' },
  },
  { timestamps: true }
);

export const Patient: Model<IPatient> = mongoose.models.Patient || mongoose.model<IPatient>('Patient', PatientSchema);
