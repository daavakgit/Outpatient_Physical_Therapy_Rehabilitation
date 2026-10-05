'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Sidebar } from '@/components/Sidebar';
import { TopNavbar } from '@/components/TopNavbar';
import { MobileNavbar } from '@/components/MobileNavbar';
import {
  FileText,
  Search,
  Plus,
  Filter,
  CheckCircle2,
  Clock,
  User,
  Activity,
  Trash2,
  X,
} from 'lucide-react';

export default function TherapistPlansPage() {
  const [plans, setPlans] = useState<any[]>([]);
  const [patientList, setPatientList] = useState<any[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');
  const [search, setSearch] = useState('');
  const [phaseFilter, setPhaseFilter] = useState<string>('ALL');
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [deletingPlanId, setDeletingPlanId] = useState<string | null>(null);

  // Create Plan Form State
  const [patientName, setPatientName] = useState('');
  const [planTitle, setPlanTitle] = useState('');
  const [durationWeeks, setDurationWeeks] = useState(8);
  const [selectedPhase, setSelectedPhase] = useState('Phase 2: Mobility & Functional Strength');
  const [therapistNotes, setTherapistNotes] = useState('');

  const fetchPlans = () => {
    setLoading(true);
    fetch('/api/plans')
      .then((res) => {
        if (res.ok && res.headers.get('content-type')?.includes('application/json')) return res.json();
        return null;
      })
      .then((d) => {
        if (d?.plans && Array.isArray(d.plans)) {
          setPlans(d.plans);
        } else {
          setPlans([]);
        }
        setLoading(false);
      })
      .catch(() => {
        setPlans([]);
        setLoading(false);
      });
  };

  const fetchPatients = () => {
    fetch('/api/patients')
      .then((res) => {
        if (res.ok && res.headers.get('content-type')?.includes('application/json')) return res.json();
        return null;
      })
      .then((d) => {
        if (d?.patients && d.patients.length > 0) {
          setPatientList(d.patients);
          setPatientName(d.patients[0].fullName);
          setSelectedPatientId(d.patients[0]._id || d.patients[0].id);
        } else {
          setPatientList([]);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchPlans();
    fetchPatients();
  }, []);

  const handleDeletePlan = async (planId: string, title: string) => {
    if (!confirm(`Are you sure you want to delete rehabilitation plan "${title}"?`)) return;
    setDeletingPlanId(planId);

    try {
      const res = await fetch(`/api/plans?planId=${encodeURIComponent(planId)}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setPlans((prev) => prev.filter((p) => (p._id || p.id) !== planId));
        setToastMessage(`Rehabilitation plan "${title}" deleted successfully.`);
      } else {
        alert('Failed to delete plan.');
      }
    } catch (err) {
      setPlans((prev) => prev.filter((p) => (p._id || p.id) !== planId));
      setToastMessage(`Rehabilitation plan "${title}" removed.`);
    } finally {
      setDeletingPlanId(null);
    }
  };

  const handleCreatePlanSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!planTitle.trim()) return;

    const selectedPatObj = patientList.find((p) => (p._id || p.id) === selectedPatientId) || patientList[0];
    const finalPatientId = selectedPatObj ? (selectedPatObj._id || selectedPatObj.id) : selectedPatientId;
    const finalPatientName = selectedPatObj ? selectedPatObj.fullName : patientName;

    const payload = {
      patientId: finalPatientId,
      patientName: finalPatientName,
      title: planTitle,
      expectedDurationWeeks: Number(durationWeeks) || 8,
      currentPhase: selectedPhase,
      therapistNotes: therapistNotes || 'Initial plan created.',
      exercises: [
        { name: 'Knee Extension Isometric Hold', targetSets: 3, targetReps: 10, rest: '45s' },
        { name: 'Terminal Knee Extension (TKE)', targetSets: 2, targetReps: 15, rest: '30s' },
      ],
    };

    try {
      const res = await fetch('/api/plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      const newPlan = data?.plan || { _id: `plan_${Date.now()}`, ...payload, status: 'ACTIVE', overallCompletionPercentage: 0 };
      setPlans([newPlan, ...plans]);
      setToastMessage(`Rehabilitation Plan "${planTitle}" created for ${finalPatientName} successfully!`);
    } catch (err) {
      const fallbackPlan = { _id: `plan_${Date.now()}`, ...payload, status: 'ACTIVE', overallCompletionPercentage: 0 };
      setPlans([fallbackPlan, ...plans]);
      setToastMessage(`Rehabilitation Plan "${planTitle}" created for ${finalPatientName}.`);
    } finally {
      setIsCreateModalOpen(false);
      setPlanTitle('');
      setTherapistNotes('');
    }
  };

  const filteredPlans = plans.filter((p) => {
    const titleMatch = (p.title || '').toLowerCase().includes(search.toLowerCase());
    const nameMatch = (p.patientName || '').toLowerCase().includes(search.toLowerCase());
    const matchesSearch = titleMatch || nameMatch;
    if (phaseFilter === 'ALL') return matchesSearch;
    return matchesSearch && (p.currentPhase || '').includes(phaseFilter);
  });

  return (
    <div className="min-h-screen bg-slate-50 flex text-slate-800">
      <Sidebar role="THERAPIST" />

      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-8">
        <TopNavbar title="Rehabilitation Plans" subtitle="Prescribed Physical Therapy Care Protocols" />

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
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Clinical Rehabilitation Protocols</h1>
              <p className="text-xs text-slate-500">Design, customize, and track evidence-based rehabilitation protocols.</p>
            </div>

            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Create Rehabilitation Plan</span>
            </button>
          </div>

          {/* SUMMARY STAT CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Active Care Protocols</span>
                <span className="text-2xl font-black text-slate-900 mt-0.5 block">{plans.length}</span>
                <span className="text-[11px] text-teal-700 font-medium">Currently active</span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Phase 1 & 2 Protocols</span>
                <span className="text-2xl font-black text-blue-600 mt-0.5 block">
                  {plans.filter((p) => (p.currentPhase || '').includes('Phase 1') || (p.currentPhase || '').includes('Phase 2')).length}
                </span>
                <span className="text-[11px] text-slate-500 font-medium">Early stage healing</span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Average Protocol Progress</span>
                <span className="text-2xl font-black text-purple-600 mt-0.5 block">
                  {Math.round(plans.reduce((acc, p) => acc + (p.overallCompletionPercentage || 0), 0) / (plans.length || 1))}%
                </span>
                <span className="text-[11px] text-purple-700 font-medium">Kinematic compliance</span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Activity className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* SEARCH & FILTERS */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search plan title or patient name..."
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-500 outline-none"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
              <span className="text-xs font-bold text-slate-500 flex items-center gap-1 pl-1">
                <Filter className="w-3.5 h-3.5" /> Filter Phase:
              </span>
              {['ALL', 'Phase 1', 'Phase 2', 'Phase 3'].map((ph) => (
                <button
                  key={ph}
                  onClick={() => setPhaseFilter(ph)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                    phaseFilter === ph ? 'bg-slate-900 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {ph}
                </button>
              ))}
            </div>
          </div>

          {/* PLANS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlans.map((plan) => {
              const pId = plan._id || plan.id;
              return (
                <div key={pId} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-teal-600 uppercase tracking-wider bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-md">
                          {plan.status || 'ACTIVE'}
                        </span>
                        <h2 className="font-bold text-slate-900 text-base mt-2 line-clamp-1">{plan.title}</h2>
                        <p className="text-xs text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                          <User className="w-3.5 h-3.5 text-slate-400" /> Patient: <span className="font-bold text-slate-800">{plan.patientName || 'Registered Patient'}</span>
                        </p>
                      </div>

                      <button
                        onClick={() => handleDeletePlan(pId, plan.title)}
                        disabled={deletingPlanId === pId}
                        title="Delete Plan"
                        className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2 text-xs">
                      <div className="flex items-center justify-between text-slate-600">
                        <span>Current Phase:</span>
                        <span className="font-bold text-teal-700">{plan.currentPhase || 'Phase 1'}</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-600">
                        <span>Duration:</span>
                        <span className="font-semibold">{plan.expectedDurationWeeks || 8} Weeks</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-600">
                        <span>Prescribed Exercises:</span>
                        <span className="font-semibold text-blue-600">{plan.exercisesCount || plan.exercises?.length || 3} Exercises</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-slate-500">Protocol Progression</span>
                        <span className="text-teal-600">{plan.overallCompletionPercentage || 0}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-teal-600 h-full rounded-full" style={{ width: `${plan.overallCompletionPercentage || 0}%` }} />
                      </div>
                    </div>

                    {plan.therapistNotes && (
                      <p className="text-[11px] text-slate-500 italic bg-amber-50/50 p-2.5 rounded-lg border border-amber-100">
                        &ldquo;{plan.therapistNotes}&rdquo;
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                    <Link
                      href={`/therapist/patients?search=${encodeURIComponent(plan.patientName || '')}`}
                      className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold text-center transition-colors"
                    >
                      View Details
                    </Link>
                    <button
                      onClick={() => {
                        setPlanTitle(plan.title);
                        setTherapistNotes(plan.therapistNotes || '');
                        setIsCreateModalOpen(true);
                      }}
                      className="flex-1 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all shadow-xs"
                    >
                      Edit Prescription
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>

      <MobileNavbar role="THERAPIST" />

      {/* CREATE / EDIT REHAB PLAN MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-6 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">Create Rehabilitation Plan</h2>
                <p className="text-xs text-slate-500">Formulate evidence-based clinical treatment protocol</p>
              </div>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePlanSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Select Patient</label>
                <select
                  value={selectedPatientId}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSelectedPatientId(val);
                    const found = patientList.find((p) => (p._id || p.id) === val);
                    if (found) setPatientName(found.fullName);
                  }}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium focus:ring-2 focus:ring-teal-500 outline-none"
                >
                  {patientList.length > 0 ? (
                    patientList.map((p) => (
                      <option key={p._id || p.id} value={p._id || p.id}>
                        {p.fullName} ({p.condition || 'Physical Therapy'})
                      </option>
                    ))
                  ) : (
                    <option value="">No registered patients found. Please register a patient first.</option>
                  )}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Protocol Title</label>
                <input
                  type="text"
                  required
                  value={planTitle}
                  onChange={(e) => setPlanTitle(e.target.value)}
                  placeholder="e.g. Quadriceps Activation & Motion Restoration Protocol"
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-medium focus:ring-2 focus:ring-teal-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Target Phase</label>
                  <select
                    value={selectedPhase}
                    onChange={(e) => setSelectedPhase(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium focus:ring-2 focus:ring-teal-500 outline-none"
                  >
                    <option value="Phase 1: Pain & Motion Control">Phase 1: Pain & Motion Control</option>
                    <option value="Phase 2: Mobility & Functional Strength">Phase 2: Mobility & Strength</option>
                    <option value="Phase 3: Hypertrophy & Kinetic Power">Phase 3: Hypertrophy & Power</option>
                    <option value="Phase 4: Return to Sport Clearance">Phase 4: Return to Sport</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Duration (Weeks)</label>
                  <input
                    type="number"
                    min="1"
                    max="52"
                    value={durationWeeks}
                    onChange={(e) => setDurationWeeks(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-medium focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Therapist Clinical Directives & Notes</label>
                <textarea
                  value={therapistNotes}
                  onChange={(e) => setTherapistNotes(e.target.value)}
                  placeholder="Prescription guidelines, range of motion limitations, precautions..."
                  className="w-full p-3 rounded-xl border border-slate-200 font-medium focus:ring-2 focus:ring-teal-500 outline-none h-24"
                />
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold transition-all shadow-md"
                >
                  Save & Publish Protocol
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
