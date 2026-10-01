'use client';

import React from 'react';
import { Calendar, Clock, User, Video, MapPin, CheckCircle2 } from 'lucide-react';

interface AppointmentCardProps {
  appointment: {
    _id: string;
    patientName: string;
    therapistName: string;
    appointmentDate: string;
    timeSlot: string;
    type: string;
    status: string;
    notes?: string;
  };
}

export const AppointmentCard: React.FC<AppointmentCardProps> = ({ appointment }) => {
  return (
    <div className="glacier-card p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-brand-50 border border-brand-100 text-brand-600 flex flex-col items-center justify-center font-bold">
          <Calendar className="w-5 h-5" />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 text-sm">{appointment.type}</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              {appointment.status}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 mt-1">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-brand-500" />
              {new Date(appointment.appointmentDate).toLocaleDateString()} at {appointment.timeSlot}
            </span>
            <span className="flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-teal-500" />
              {appointment.therapistName || appointment.patientName}
            </span>
          </div>

          {appointment.notes && <p className="text-xs text-slate-600 mt-2 bg-slate-50 p-2 rounded-lg">{appointment.notes}</p>}
        </div>
      </div>

      <div className="w-full sm:w-auto flex items-center justify-end gap-2">
        <button className="px-4 py-2 rounded-xl bg-brand-600 text-white font-semibold text-xs shadow-sm hover:bg-brand-700 transition-all">
          Join Consultation
        </button>
      </div>
    </div>
  );
};
