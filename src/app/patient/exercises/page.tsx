'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Sidebar } from '@/components/Sidebar';
import { TopNavbar } from '@/components/TopNavbar';
import { MobileNavbar } from '@/components/MobileNavbar';
import { Dumbbell, Search, Play, Clock, X, FileText, CheckCircle, Info } from 'lucide-react';

export default function PatientAssignedExercisesPage() {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [search, setSearch] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);

  useEffect(() => {
    fetch('/api/assignments')
      .then((res) => {
        if (res.ok && res.headers.get('content-type')?.includes('application/json')) return res.json();
        return null;
      })
      .then((data) => {
        if (data?.assignments) {
          setAssignments(data.assignments);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredAssignments = assignments.filter((ass: any) => {
    const ex = typeof ass.exerciseId === 'object' ? ass.exerciseId : {};
    const exName = ex.name || '';
    return exName.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-glacier-bg flex">
      <Sidebar role="PATIENT" />

      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-8">
        <TopNavbar
          title="My Prescribed Rehabilitation Routine"
          subtitle="Patient-Specific Clinical Exercises Assigned by Your Physical Therapist"
        />

        <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          {/* Header Banner */}
          <div className="glacier-card p-6 bg-gradient-to-r from-teal-900 to-slate-900 text-white flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="px-2.5 py-0.5 rounded-md bg-teal-500/20 text-teal-300 font-bold text-[11px] uppercase tracking-wider border border-teal-500/30">
                Personalized Plan
              </span>
              <h1 className="text-xl font-extrabold text-white">Active Clinical Assignments</h1>
              <p className="text-xs text-slate-300">
                These exercises have been explicitly prescribed for your active recovery phase. Perform them according to your therapist&apos;s dosage guidelines.
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-72 flex-shrink-0">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search assigned exercises..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs placeholder-slate-400 focus:ring-2 focus:ring-teal-400 outline-none"
              />
            </div>
          </div>

          {/* Exercise Grid */}
          {loading ? (
            <div className="text-center py-16 space-y-3">
              <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-slate-500 font-semibold">Loading your clinical assignments...</p>
            </div>
          ) : filteredAssignments.length === 0 ? (
            <div className="glacier-card p-12 text-center space-y-4">
              <Dumbbell className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="font-extrabold text-slate-800 text-base">No Prescribed Exercises Found</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Your physical therapist has not assigned any custom exercises to your plan yet, or your search query yielded no results.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAssignments.map((ass: any) => {
                const ex = typeof ass.exerciseId === 'object' ? ass.exerciseId : {};
                return (
                  <div
                    key={ass._id}
                    className="glacier-card p-5 flex flex-col justify-between hover:shadow-lg transition-all group border-slate-200/80"
                  >
                    <div className="space-y-4">
                      {/* Image Preview */}
                      <div className="relative w-full h-44 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={ex.imageUrl || 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=600&q=80'}
                          alt={ex.name || 'Exercise'}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
                        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-teal-600 text-white text-[10px] font-extrabold uppercase shadow-sm">
                          {ass.phaseName || 'Phase 2'}
                        </span>
                        <span className="absolute bottom-3 right-3 px-2.5 py-1 rounded-md bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-bold flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {ass.frequencyDaysPerWeek || 5} Days / Wk
                        </span>
                      </div>

                      {/* Header & Target Area */}
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                          {ex.category || 'Mobility Protocol'} • {ex.targetArea || 'Joint'}
                        </span>
                        <h3 className="font-extrabold text-slate-900 text-base leading-tight mt-0.5 group-hover:text-teal-700 transition-colors">
                          {ex.name || 'Prescribed Exercise'}
                        </h3>
                      </div>

                      {/* Prescription Box */}
                      <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200/70 text-center text-xs">
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold block uppercase">Sets × Reps</span>
                          <span className="font-extrabold text-slate-900">{ass.sets} × {ass.repetitions}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold block uppercase">Hold Time</span>
                          <span className="font-extrabold text-teal-700">{ass.holdDurationSeconds || 0}s</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold block uppercase">Rest Time</span>
                          <span className="font-extrabold text-slate-900">{ass.restDurationSeconds || 30}s</span>
                        </div>
                      </div>

                      {/* Therapist Notes */}
                      {ass.therapistNotes && (
                        <div className="p-3 bg-amber-50/60 border border-amber-200/60 rounded-xl text-xs text-amber-900 italic">
                          &ldquo;{ass.therapistNotes}&rdquo;
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 mt-5 pt-3 border-t border-slate-100">
                      <button
                        onClick={() => setSelectedAssignment(ass)}
                        className="flex-1 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5"
                      >
                        <Info className="w-3.5 h-3.5 text-teal-700" />
                        <span>Details</span>
                      </button>

                      <Link
                        href={`/patient/session/live?exerciseId=${ex._id || 'ex'}&assignmentId=${ass._id}`}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all shadow-sm"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Start Session</span>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>

      {/* EXERCISE DETAIL MODAL */}
      {selectedAssignment && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="relative h-48 bg-slate-900">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={
                  (typeof selectedAssignment.exerciseId === 'object' ? selectedAssignment.exerciseId.imageUrl : '') ||
                  'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=600&q=80'
                }
                alt="Exercise detail"
                className="w-full h-full object-cover opacity-80"
              />
              <button
                onClick={() => setSelectedAssignment(null)}
                className="absolute top-3 right-3 p-2 rounded-full bg-slate-900/70 text-white hover:bg-slate-900 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-4 left-4 right-4">
                <span className="px-2.5 py-0.5 rounded bg-teal-500 text-white text-[10px] font-bold uppercase">
                  {selectedAssignment.phaseName || 'Phase 2'}
                </span>
                <h2 className="text-xl font-extrabold text-white mt-1">
                  {typeof selectedAssignment.exerciseId === 'object' ? selectedAssignment.exerciseId.name : 'Prescribed Exercise'}
                </h2>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Prescription parameters */}
              <div className="grid grid-cols-3 gap-3 p-4 bg-teal-50 rounded-2xl border border-teal-100 text-center text-xs">
                <div>
                  <span className="text-[10px] text-teal-700 font-bold uppercase block">Target Sets</span>
                  <span className="font-extrabold text-teal-900 text-base">{selectedAssignment.sets} Sets</span>
                </div>
                <div>
                  <span className="text-[10px] text-teal-700 font-bold uppercase block">Repetitions</span>
                  <span className="font-extrabold text-teal-900 text-base">{selectedAssignment.repetitions} Reps</span>
                </div>
                <div>
                  <span className="text-[10px] text-teal-700 font-bold uppercase block">Weekly Schedule</span>
                  <span className="font-extrabold text-teal-900 text-base">{selectedAssignment.frequencyDaysPerWeek} Days/Wk</span>
                </div>
              </div>

              {/* Instructions */}
              {typeof selectedAssignment.exerciseId === 'object' && selectedAssignment.exerciseId.instructions && (
                <div className="space-y-3">
                  <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <FileText className="w-4 h-4 text-teal-600" />
                    <span>Clinical Execution Instructions</span>
                  </h4>
                  <ol className="space-y-2 list-decimal list-inside text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    {selectedAssignment.exerciseId.instructions.map((step: string, idx: number) => (
                      <li key={idx} className="pl-1">
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Clinical Notes */}
              {selectedAssignment.therapistNotes && (
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-900 text-sm">Therapist Clinical Notes</h4>
                  <p className="text-xs text-slate-600 bg-amber-50 p-3.5 rounded-2xl border border-amber-200 italic">
                    &ldquo;{selectedAssignment.therapistNotes}&rdquo;
                  </p>
                </div>
              )}

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => setSelectedAssignment(null)}
                  className="flex-1 py-3 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200"
                >
                  Close
                </button>
                <Link
                  href={`/patient/session/live?exerciseId=${typeof selectedAssignment.exerciseId === 'object' ? selectedAssignment.exerciseId._id : 'ex'}&assignmentId=${selectedAssignment._id}`}
                  className="flex-1 py-3 rounded-xl bg-teal-600 text-white font-bold text-xs hover:bg-teal-700 text-center shadow-md flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Start Live Session</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      <MobileNavbar role="PATIENT" />
    </div>
  );
}
