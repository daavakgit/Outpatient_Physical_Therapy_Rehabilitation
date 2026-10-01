'use client';

import React, { useEffect, useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { TopNavbar } from '@/components/TopNavbar';
import { MobileNavbar } from '@/components/MobileNavbar';
import { AppointmentCard } from '@/components/AppointmentCard';
import { Calendar, Plus } from 'lucide-react';

export default function PatientAppointmentsPage() {
  const [appointments, setAppointments] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/appointments')
      .then((res) => res.json())
      .then((d) => {
        if (d.appointments) setAppointments(d.appointments);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-glacier-bg flex">
      <Sidebar role="PATIENT" />

      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-8">
        <TopNavbar title="Appointments & Reviews" subtitle="Clinical Consultation Schedule" />

        <main className="max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-lg">Scheduled Consultations</h3>
            <button className="px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm">
              <Plus className="w-4 h-4" />
              <span>Request Review</span>
            </button>
          </div>

          <div className="space-y-4">
            {appointments.length === 0 ? (
              <div className="glacier-card p-8 text-center text-xs text-slate-400">
                No appointments currently scheduled.
              </div>
            ) : (
              appointments.map((apt) => <AppointmentCard key={apt._id} appointment={apt} />)
            )}
          </div>
        </main>
      </div>

      <MobileNavbar role="PATIENT" />
    </div>
  );
}
