import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITherapist extends Document {
  userId: mongoose.Types.ObjectId;
  fullName: string;
  specialization: string; // e.g. Orthopedic PT, Neurological Rehab, Sports Therapy
  licenseNumber: string;
  bio?: string;
  assignedPatientCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const TherapistSchema = new Schema<ITherapist>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    fullName: { type: String, required: true },
    specialization: { type: String, default: 'Orthopedic Rehabilitation' },
    licenseNumber: { type: String, default: 'PT-2026-9041' },
    bio: { type: String },
    assignedPatientCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Therapist: Model<ITherapist> = mongoose.models.Therapist || mongoose.model<ITherapist>('Therapist', TherapistSchema);
