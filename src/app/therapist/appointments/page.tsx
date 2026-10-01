'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Sidebar } from '@/components/Sidebar';
import { TopNavbar } from '@/components/TopNavbar';
import { MobileNavbar } from '@/components/MobileNavbar';
import {
  Calendar,
  Clock,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  User,
  Stethoscope,
  ChevronRight,
  X,
  Edit,
  Play,
} from 'lucide-react';

export default function TherapistAppointmentsPage() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'TODAY' | 'UPCOMING' | 'PAST'>('TODAY');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Schedule Appointment form
  const [patientName, setPatientName] = useState('Alex Morgan');
  const [appointmentDate, setAppointmentDate] = useState('2026-10-02');
  const [timeSlot, setTimeSlot] = useState('10:30 AM');
  const [appointmentType, setAppointmentType] = useState('1-on-1 Clinical Review');
  const [notes, setNotes] = useState('');

  const fetchAppointments = () => {
    setLoading(true);
    fetch('/api/appointments')
      .then((res) => {
        if (res.ok && res.headers.get('content-type')?.includes('application/json')) return res.json();
        return null;
      })
      .then((d) => {
        if (d?.appointments && d.appointments.length > 0) {
          setAppointments(d.appointments);
        } else {
          setAppointments([]);
        }
        setLoading(false);
      })
      .catch(() => {
        setAppointments([]);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleStatusChange = (id: string, newStatus: string) => {
    setAppointments((prev) =>
      prev.map((a) => (a._id === id ? { ...a, status: newStatus } : a))
    );
    setToastMessage(`Appointment marked as ${newStatus}.`);
  };

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName) return;

    const newApt = {
      _id: `apt_${Date.now()}`,
      patientName,
      mrn: 'MRN-84920',
      appointmentDate,
      timeSlot,
      type: appointmentType,
      status: 'SCHEDULED',
      notes: notes || 'Clinical consultation scheduled.',
      isToday: appointmentDate === '2026-10-01',
    };

    setAppointments([newApt, ...appointments]);
    setToastMessage(`Appointment scheduled for ${patientName} on ${appointmentDate} at ${timeSlot}.`);
    setIsScheduleModalOpen(false);
    setNotes('');
  };

  const filteredAppointments = appointments.filter((a) => {
    const matchesSearch = a.patientName.toLowerCase().includes(search.toLowerCase()) || a.type.toLowerCase().includes(search.toLowerCase());
    if (activeTab === 'TODAY') return matchesSearch && (a.isToday || a.appointmentDate === '2026-10-01');
    if (activeTab === 'UPCOMING') return matchesSearch && a.status === 'SCHEDULED' && !a.isToday && a.appointmentDate > '2026-10-01';
    return matchesSearch && (a.status === 'COMPLETED' || a.status === 'CANCELLED' || a.appointmentDate < '2026-10-01');
  });

  return (
    <div className="min-h-screen bg-slate-50 flex text-slate-800">
      <Sidebar role="THERAPIST" />

      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-8">
        <TopNavbar title="Appointments & Consultations" subtitle="Clinical Schedule & Outpatient Visits" />

        <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          {/* Toast Notification */}
          {toastMessage && (
            <div className="p-4 bg-teal-50 border border-teal-200 rounded-2xl text-xs font-bold text-teal-800 flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600" />
                <span>{toastMessage}</span>
              </div>
              <button onClick={() => setToastMessage('')} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>
          )}

          {/* PAGE HEADER */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Therapist Clinical Calendar</h1>
              <p className="text-xs text-slate-500">Schedule, update, and manage 1-on-1 consultations and evaluation sessions.</p>
            </div>

            <button
              onClick={() => setIsScheduleModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Schedule Appointment</span>
            </button>
          </div>

          {/* NAVIGATION TABS & SEARCH */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 border-b sm:border-b-0 pb-2 sm:pb-0">
              {(['TODAY', 'UPCOMING', 'PAST'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeTab === tab ? 'bg-teal-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {tab === 'TODAY' ? "Today's Visits" : tab === 'UPCOMING' ? 'Upcoming Schedule' : 'Past Consultations'}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search patient or visit type..."
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-500 outline-none"
              />
            </div>
          </div>

          {/* APPOINTMENTS LIST */}
          <div className="space-y-4">
            {filteredAppointments.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
                <Calendar className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="font-bold text-slate-800 text-sm">No Appointments Found</h3>
                <p className="text-xs text-slate-500">There are no appointments listed for this section.</p>
              </div>
            ) : (
              filteredAppointments.map((apt) => (
                <div key={apt._id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-800 font-black text-xs flex flex-col items-center justify-center border border-teal-200 flex-shrink-0">
                      <Calendar className="w-5 h-5 text-teal-700" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h2 className="font-bold text-slate-900 text-base">{apt.patientName}</h2>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          apt.status === 'COMPLETED'
                            ? 'bg-teal-50 text-teal-700 border-teal-200'
                            : apt.status === 'CANCELLED'
                            ? 'bg-red-50 text-red-700 border-red-200'
                            : 'bg-blue-50 text-blue-700 border-blue-200'
                        }`}>
                          {apt.status}
                        </span>
                      </div>

                      <p className="text-xs font-semibold text-teal-700">{apt.type}</p>
                      <p className="text-xs text-slate-500 flex items-center gap-3">
                        <span className="flex items-center gap-1 font-mono font-bold text-slate-700">
                          <Clock className="w-3.5 h-3.5 text-slate-400" /> {apt.appointmentDate} at {apt.timeSlot}
                        </span>
                        <span>• MRN: {apt.mrn || 'MRN-84920'}</span>
                      </p>

                      {apt.notes && (
                        <p className="text-xs text-slate-500 italic pt-1">&ldquo;{apt.notes}&rdquo;</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    {apt.status === 'SCHEDULED' && (
                      <>
                        <button
                          onClick={() => handleStatusChange(apt._id, 'COMPLETED')}
                          className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all shadow-xs"
                        >
                          Mark Completed
                        </button>
                        <button
                          onClick={() => handleStatusChange(apt._id, 'CANCELLED')}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-700 text-xs font-bold transition-colors"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                    <Link
                      href={`/therapist/live-monitor?patientId=${apt._id}`}
                      className="p-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-colors"
                      title="Launch Session Monitor"
                    >
                      <Play className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </main>
      </div>

      <MobileNavbar role="THERAPIST" />

      {/* SCHEDULE APPOINTMENT MODAL */}
      {isScheduleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">Schedule Clinical Visit</h2>
                <p className="text-xs text-slate-500">Book evaluation or progress consultation session</p>
              </div>
              <button onClick={() => setIsScheduleModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleScheduleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Select Patient</label>
                <select
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium outline-none"
                >
                  <option value="Alex Morgan">Alex Morgan</option>
                  <option value="Marcus Vance">Marcus Vance</option>
                  <option value="Elena Rostova">Elena Rostova</option>
                  <option value="David Sterling">David Sterling</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-medium outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Time Slot</label>
                  <input
                    type="text"
                    required
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    placeholder="e.g. 10:30 AM"
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-medium outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Appointment Type</label>
                <select
                  value={appointmentType}
                  onChange={(e) => setAppointmentType(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium outline-none"
                >
                  <option value="1-on-1 Clinical Review">1-on-1 Clinical Review</option>
                  <option value="Initial Evaluation">Initial Evaluation</option>
                  <option value="Progress Assessment">Progress Assessment</option>
                  <option value="Telehealth Monitor">Telehealth Monitor</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Clinical Notes & Objective</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Notes for consultation..."
                  className="w-full p-3 rounded-xl border border-slate-200 font-medium outline-none h-20"
                />
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsScheduleModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold transition-all shadow-md"
                >
                  Confirm Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
