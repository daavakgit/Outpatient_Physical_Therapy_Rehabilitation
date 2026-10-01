'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Sidebar } from '@/components/Sidebar';
import { TopNavbar } from '@/components/TopNavbar';
import { MobileNavbar } from '@/components/MobileNavbar';
import {
  Clock,
  Play,
  Pause,
  CheckCircle2,
  AlertTriangle,
  User,
  Activity,
  HeartPulse,
  RefreshCw,
  Sliders,
  ShieldCheck,
  Stethoscope,
  X,
  MessageSquare,
  BarChart3,
  Dumbbell,
} from 'lucide-react';

function LiveMonitorContent() {
  const searchParams = useSearchParams();
  const queryPatientId = searchParams.get('patientId');

  const [activeSessions, setActiveSessions] = useState([
    {
      id: 'sess_1',
      patientId: 'pat_1',
      patientName: 'Alex Morgan',
      mrn: 'MRN-84920',
      exerciseName: 'Knee Extension Isometric Hold',
      currentSet: 2,
      targetSets: 3,
      completedReps: 8,
      targetReps: 10,
      durationSeconds: 340,
      painVAS: 2.5,
      status: 'STARTED', // STARTED | PAUSED | COMPLETED | CANCELLED
      lastFeedback: 'Mild discomfort during final 2 reps, maintaining full extension.',
      avatar: 'AM',
    },
    {
      id: 'sess_2',
      patientId: 'pat_2',
      patientName: 'Marcus Vance',
      mrn: 'MRN-91204',
      exerciseName: 'Pendulum Swings',
      currentSet: 1,
      targetSets: 2,
      completedReps: 15,
      targetReps: 20,
      durationSeconds: 120,
      painVAS: 6.0,
      status: 'PAUSED',
      lastFeedback: 'Paused due to elevated subacromial discomfort.',
      avatar: 'MV',
    },
    {
      id: 'sess_3',
      patientId: 'pat_3',
      patientName: 'Elena Rostova',
      mrn: 'MRN-73412',
      exerciseName: 'Closed Chain Bodyweight Squat',
      currentSet: 3,
      targetSets: 3,
      completedReps: 12,
      targetReps: 12,
      durationSeconds: 510,
      painVAS: 1.8,
      status: 'COMPLETED',
      lastFeedback: 'Completed set with 100% form adherence.',
      avatar: 'ER',
    },
  ]);

  const [selectedSessionId, setSelectedSessionId] = useState<string>('sess_1');
  const [toastMessage, setToastMessage] = useState('');
  const [therapistInputNote, setTherapistInputNote] = useState('');

  // Auto-increment timer for active session
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSessions((prev) =>
        prev.map((s) => {
          if (s.status === 'STARTED') {
            return { ...s, durationSeconds: s.durationSeconds + 1 };
          }
          return s;
        })
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const selectedSession = activeSessions.find((s) => s.id === selectedSessionId) || activeSessions[0];

  const handleStatusChange = (id: string, newStatus: string) => {
    setActiveSessions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s))
    );
    setToastMessage(`Session status updated to ${newStatus}.`);
  };

  const handleAddSetRep = (id: string) => {
    setActiveSessions((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const nextReps = s.completedReps + 1;
          if (nextReps >= s.targetReps && s.currentSet < s.targetSets) {
            return { ...s, currentSet: s.currentSet + 1, completedReps: 0 };
          }
          return { ...s, completedReps: Math.min(s.targetReps, nextReps) };
        }
        return s;
      })
    );
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
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

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Live Session Monitor</h1>
          <p className="text-xs text-slate-500">Real-time telehealth and clinical observation terminal for active patient exercise sessions.</p>
        </div>

        <div className="flex items-center gap-2 bg-teal-50 border border-teal-200 text-teal-800 px-3 py-1.5 rounded-xl text-xs font-bold">
          <span className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-ping" />
          <span>Live Clinical Feed Active</span>
        </div>
      </div>

      {/* MAIN MONITOR GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 5 Cols: Active Patient Session Roster Cards */}
        <div className="lg:col-span-5 space-y-4">
          <h2 className="font-bold text-slate-900 text-sm flex items-center justify-between">
            <span>Concurrent Sessions ({activeSessions.length})</span>
            <span className="text-xs text-slate-500 font-normal">Select patient to control</span>
          </h2>

          <div className="space-y-3">
            {activeSessions.map((sess) => {
              const isSelected = sess.id === selectedSessionId;
              return (
                <div
                  key={sess.id}
                  onClick={() => setSelectedSessionId(sess.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                    isSelected
                      ? 'bg-white border-teal-600 shadow-md ring-2 ring-teal-500/20'
                      : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 font-black text-xs flex items-center justify-center border border-teal-200">
                        {sess.avatar}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm">{sess.patientName}</h3>
                        <span className="text-[11px] text-slate-400 font-mono">{sess.mrn}</span>
                      </div>
                    </div>

                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                      sess.status === 'STARTED'
                        ? 'bg-teal-50 text-teal-700 border border-teal-200'
                        : sess.status === 'PAUSED'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-slate-100 text-slate-700 border border-slate-200'
                    }`}>
                      {sess.status}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2 text-xs">
                    <div className="flex items-center justify-between font-medium">
                      <span className="text-slate-500">Active Exercise:</span>
                      <span className="font-bold text-slate-900">{sess.exerciseName}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600">
                      <span>Set Progression:</span>
                      <span className="font-bold text-teal-700">{sess.currentSet} of {sess.targetSets} Sets ({sess.completedReps}/{sess.targetReps} reps)</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="font-mono font-bold text-slate-700 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {formatTimer(sess.durationSeconds)}
                    </span>
                    <span className={`font-bold ${sess.painVAS > 5 ? 'text-red-600' : 'text-slate-700'}`}>
                      Pain VAS: {sess.painVAS}/10
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 7 Cols: Detailed Session Control Terminal */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-md">
                  Active Clinical Terminal
                </span>
                <h2 className="text-xl font-black text-slate-900 mt-1">{selectedSession.patientName}</h2>
                <p className="text-xs text-slate-500">{selectedSession.exerciseName} • Prescribed Execution</p>
              </div>

              <div className="text-right">
                <span className="text-3xl font-black font-mono text-slate-900 block">
                  {formatTimer(selectedSession.durationSeconds)}
                </span>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Elapsed Session Time</span>
              </div>
            </div>

            {/* Repetition & Set Counter Gauge */}
            <div className="p-6 bg-slate-900 rounded-2xl text-white space-y-4 shadow-inner">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-bold uppercase tracking-wider">Set & Repetition Counter</span>
                <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 font-bold border border-teal-500/30">
                  Target: {selectedSession.targetSets} Sets × {selectedSession.targetReps} Reps
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-center py-2">
                <div className="bg-white/10 p-4 rounded-xl backdrop-blur-xs border border-white/10">
                  <span className="text-3xl font-black text-teal-400">{selectedSession.currentSet}</span>
                  <span className="block text-[11px] text-slate-300 font-bold uppercase mt-1">Current Set</span>
                </div>
                <div className="bg-white/10 p-4 rounded-xl backdrop-blur-xs border border-white/10">
                  <span className="text-3xl font-black text-white">{selectedSession.completedReps}</span>
                  <span className="block text-[11px] text-slate-300 font-bold uppercase mt-1">Completed Reps</span>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => handleAddSetRep(selectedSession.id)}
                  className="flex-1 py-3 bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs rounded-xl transition-all shadow-sm"
                >
                  + Record Completed Repetition
                </button>
              </div>
            </div>

            {/* Pain Scale & Real-time Feedback Indicator */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <span className="text-slate-400 font-bold uppercase text-[10px] block">Patient Reported Pain</span>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black text-slate-900">{selectedSession.painVAS} / 10</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    selectedSession.painVAS > 5 ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-teal-50 text-teal-700 border border-teal-200'
                  }`}>
                    {selectedSession.painVAS > 5 ? 'High Discomfort' : 'Tolerable VAS'}
                  </span>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <span className="text-slate-400 font-bold uppercase text-[10px] block">Kinematic Execution Quality</span>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black text-teal-600">94%</span>
                  <span className="px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200 text-[10px] font-bold">
                    Optimal Form
                  </span>
                </div>
              </div>
            </div>

            {/* Real-time Therapist Control Actions */}
            <div className="space-y-3 pt-2">
              <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Therapist Control Actions</h3>
              <div className="flex flex-wrap items-center gap-3">
                {selectedSession.status !== 'STARTED' ? (
                  <button
                    onClick={() => handleStatusChange(selectedSession.id, 'STARTED')}
                    className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition-all shadow-xs"
                  >
                    <Play className="w-4 h-4" /> Start / Resume Session
                  </button>
                ) : (
                  <button
                    onClick={() => handleStatusChange(selectedSession.id, 'PAUSED')}
                    className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs transition-all shadow-xs"
                  >
                    <Pause className="w-4 h-4" /> Pause Session
                  </button>
                )}

                <button
                  onClick={() => handleStatusChange(selectedSession.id, 'COMPLETED')}
                  className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all shadow-xs"
                >
                  <CheckCircle2 className="w-4 h-4" /> Complete & End Session
                </button>
              </div>
            </div>

            {/* Real-Time Live Note Entry */}
            <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
              <label className="font-bold text-slate-800 block">Record Live Clinical Note</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={therapistInputNote}
                  onChange={(e) => setTherapistInputNote(e.target.value)}
                  placeholder="Type live observation or form correction instruction..."
                  className="flex-1 p-2.5 rounded-xl border border-slate-200 font-medium focus:ring-2 focus:ring-teal-500 outline-none"
                />
                <button
                  onClick={() => {
                    if (!therapistInputNote) return;
                    setToastMessage(`Note logged for ${selectedSession.patientName}: "${therapistInputNote}"`);
                    setTherapistInputNote('');
                  }}
                  className="px-4 py-2.5 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-900"
                >
                  Log Note
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TherapistLiveMonitorPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex text-slate-800">
      <Sidebar role="THERAPIST" />

      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-8">
        <TopNavbar title="Live Session Monitor" subtitle="Real-time Clinical Exercise Tracking" />

        <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Suspense fallback={
            <div className="p-12 text-center text-slate-500 space-y-3">
              <div className="w-10 h-10 rounded-full border-4 border-teal-600 border-t-transparent animate-spin mx-auto" />
              <p className="text-xs font-semibold">Initializing Live Monitor Terminal...</p>
            </div>
          }>
            <LiveMonitorContent />
          </Suspense>
        </main>
      </div>

      <MobileNavbar role="THERAPIST" />
    </div>
  );
}
