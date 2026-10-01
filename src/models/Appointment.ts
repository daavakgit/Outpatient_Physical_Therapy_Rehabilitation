import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAppointment extends Document {
  patientId: mongoose.Types.ObjectId;
  therapistId: mongoose.Types.ObjectId;
  patientName: string;
  therapistName: string;
  appointmentDate: Date;
  timeSlot: string; // e.g. "10:00 AM - 10:45 AM"
  type: 'In-Clinic Assessment' | 'Progress Review' | 'Milestone Check' | 'Virtual Consultation';
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AppointmentSchema = new Schema<IAppointment>(
  {
    patientId: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
    therapistId: { type: Schema.Types.ObjectId, ref: 'Therapist', required: true },
    patientName: { type: String, required: true },
    therapistName: { type: String, required: true },
    appointmentDate: { type: Date, required: true },
    timeSlot: { type: String, required: true },
    type: {
      type: String,
      enum: ['In-Clinic Assessment', 'Progress Review', 'Milestone Check', 'Virtual Consultation'],
      default: 'Progress Review',
    },
    status: { type: String, enum: ['SCHEDULED', 'COMPLETED', 'CANCELLED'], default: 'SCHEDULED' },
    notes: { type: String },
  },
  { timestamps: true }
);

export const Appointment: Model<IAppointment> =
  mongoose.models.Appointment || mongoose.model<IAppointment>('Appointment', AppointmentSchema);
