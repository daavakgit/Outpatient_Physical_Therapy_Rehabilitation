import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  name: string;
  role: 'PATIENT' | 'THERAPIST' | 'ADMIN';
  phone?: string;
  avatarUrl?: string;
  patientId?: mongoose.Types.ObjectId;
  therapistId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, enum: ['PATIENT', 'THERAPIST', 'ADMIN'], default: 'PATIENT' },
    phone: { type: String },
    avatarUrl: { type: String },
    patientId: { type: Schema.Types.ObjectId, ref: 'Patient' },
    therapistId: { type: Schema.Types.ObjectId, ref: 'Therapist' },
  },
  { timestamps: true }
);

export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
