'use client';

import React, { useEffect, useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { TopNavbar } from '@/components/TopNavbar';
import { MobileNavbar } from '@/components/MobileNavbar';
import {
  Award,
  Plus,
  CheckCircle2,
  Clock,
  Check,
  Edit,
  Filter,
  Search,
  User,
  Activity,
  AlertTriangle,
  X,
  Stethoscope,
} from 'lucide-react';

export default function TherapistMilestonesPage() {
  const [milestones, setMilestones] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [patientFilter, setPatientFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Add Milestone Form state
  const [patientName, setPatientName] = useState('Alex Morgan');
  const [milestoneName, setMilestoneName] = useState('');
  const [phaseName, setPhaseName] = useState('Phase 2: Mobility & Strength');
  const [targetDate, setTargetDate] = useState('2026-10-15');
  const [criteria, setCriteria] = useState('');
  const [therapistNotes, setTherapistNotes] = useState('');

  const fetchMilestones = () => {
    setLoading(true);
    fetch('/api/milestones')
      .then((res) => {
        if (res.ok && res.headers.get('content-type')?.includes('application/json')) return res.json();
        return null;
      })
      .then((d) => {
        if (d?.milestones && d.milestones.length > 0) {
          setMilestones(d.milestones);
        } else {
          setMilestones([
            {
              _id: 'ms_1',
              patientName: 'Alex Morgan',
              mrn: 'MRN-84920',
              title: 'Initial Assessment & Swelling Control',
              phase: 'Phase 1: Early Post-Op',
              criteria: 'Knee effusion reduced to trace levels. Passive flexion > 90 degrees.',
              status: 'COMPLETED',
              targetDate: '2026-08-25',
              completedDate: '2026-08-24',
              therapistNotes: 'Achieved full extension passively with minimal discomfort.',
            },
            {
              _id: 'ms_2',
              patientName: 'Alex Morgan',
              mrn: 'MRN-84920',
              title: 'Baseline Flexion ROM (120°) & Normal Gait Pattern',
              phase: 'Phase 2: Mobility & Strength',
              criteria: 'Flexion > 120° without compensatory hip hitching during ambulation.',
              status: 'IN_PROGRESS',
              targetDate: '2026-10-10',
              completedDate: null,
              therapistNotes: 'Flexion currently measured at 115°. Progressing well.',
            },
            {
              _id: 'ms_3',
              patientName: 'Marcus Vance',
              mrn: 'MRN-91204',
              title: 'Subacromial Pain Management & Scapular Setting',
              phase: 'Phase 1: Pain Control',
              criteria: 'VAS pain < 3/10 during active assisted shoulder abduction.',
              status: 'IN_PROGRESS',
              targetDate: '2026-10-05',
              completedDate: null,
              therapistNotes: 'Tension band exercise introduced.',
            },
            {
              _id: 'ms_4',
              patientName: 'Elena Rostova',
              mrn: 'MRN-73412',
              title: 'Closed Chain Bodyweight Squat Independence',
              phase: 'Phase 3: Hypertrophy',
              criteria: 'Perform 3 sets of 15 bodyweight squats with symmetrical 50/50 weight distribution.',
              status: 'COMPLETED',
              targetDate: '2026-09-20',
              completedDate: '2026-09-18',
              therapistNotes: 'Force plate confirmed symmetrical loading.',
            },
          ]);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchMilestones();
  }, []);

  const handleStatusChange = (id: string, newStatus: string) => {
    setMilestones((prev) =>
      prev.map((m) =>
        m._id === id
          ? {
              ...m,
              status: newStatus,
              completedDate: newStatus === 'COMPLETED' ? new Date().toISOString().split('T')[0] : null,
            }
          : m
      )
    );
    setToastMessage(`Milestone status updated to ${newStatus.replace('_', ' ')}.`);
  };

  const handleAddMilestoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!milestoneName.trim()) return;

    const newMs = {
      _id: `ms_${Date.now()}`,
      patientName,
      mrn: 'MRN-84920',
      title: milestoneName,
      phase: phaseName,
      criteria: criteria || 'Achieve target functional criteria.',
      status: 'NOT_STARTED',
      targetDate,
      completedDate: null,
      therapistNotes: therapistNotes || 'Clinical milestone established.',
    };

    setMilestones([newMs, ...milestones]);
    setToastMessage(`Milestone "${milestoneName}" created successfully.`);
    setIsAddModalOpen(false);
    setMilestoneName('');
    setCriteria('');
    setTherapistNotes('');
  };

  const filteredMilestones = milestones.filter((m) => {
    const matchesSearch = m.title.toLowerCase().includes(search.toLowerCase()) || m.patientName.toLowerCase().includes(search.toLowerCase());
    if (patientFilter === 'ALL') return matchesSearch;
    return matchesSearch && m.patientName === patientFilter;
  });

  const totalCount = milestones.length;
  const completedCount = milestones.filter((m) => m.status === 'COMPLETED').length;
  const inProgressCount = milestones.filter((m) => m.status === 'IN_PROGRESS').length;

  return (
    <div className="min-h-screen bg-slate-50 flex text-slate-800">
      <Sidebar role="THERAPIST" />

      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-8">
        <TopNavbar title="Milestone Manager" subtitle="Clinical Progression & Phase Transition Criteria" />

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
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Rehabilitation Milestone Stepper</h1>
              <p className="text-xs text-slate-500">Define phase transition benchmarks, criteria verification, and patient achievements.</p>
            </div>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Create Clinical Milestone</span>
            </button>
          </div>

          {/* KPI STAT CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Milestones</span>
                <span className="text-2xl font-black text-slate-900 mt-0.5 block">{totalCount}</span>
                <span className="text-[11px] text-slate-500 font-medium">Tracked benchmarks</span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Achieved & Cleared</span>
                <span className="text-2xl font-black text-teal-600 mt-0.5 block">{completedCount}</span>
                <span className="text-[11px] text-teal-700 font-medium">Criteria verified</span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">In Progress Benchmarks</span>
                <span className="text-2xl font-black text-blue-600 mt-0.5 block">{inProgressCount}</span>
                <span className="text-[11px] text-blue-700 font-medium">Active evaluation</span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* VISUAL REHABILITATION MILESTONE STEPPER */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h2 className="font-bold text-slate-900 text-sm">Standard Kinetic Recovery Stepper Roadmap</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2">
              {[
                { step: '01', title: 'Initial Assessment', desc: 'Edema & Pain Control', status: 'COMPLETED' },
                { step: '02', title: 'ROM Baseline', desc: 'Full Extension / 120° Flex', status: 'COMPLETED' },
                { step: '03', title: 'Hypertrophy', desc: 'Quad Activation & Balance', status: 'IN_PROGRESS' },
                { step: '04', title: 'Agility & Proprioception', desc: 'Perturbation & Jogging', status: 'NOT_STARTED' },
                { step: '05', title: 'Return to Sport', desc: 'Clearance Test > 90% LSI', status: 'NOT_STARTED' },
              ].map((st, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border space-y-2 text-xs relative ${
                    st.status === 'COMPLETED'
                      ? 'bg-teal-50/50 border-teal-200'
                      : st.status === 'IN_PROGRESS'
                      ? 'bg-blue-50/50 border-blue-300 ring-2 ring-blue-500/20'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-black text-slate-400 text-[11px]">PHASE {st.step}</span>
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] text-white ${
                      st.status === 'COMPLETED' ? 'bg-teal-600' : st.status === 'IN_PROGRESS' ? 'bg-blue-600' : 'bg-slate-300'
                    }`}>
                      {st.status === 'COMPLETED' ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 leading-tight">{st.title}</h3>
                  <p className="text-[11px] text-slate-500 line-clamp-1">{st.desc}</p>
                </div>
              ))}
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
                placeholder="Search milestone title or patient..."
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-500 outline-none"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
              <span className="text-xs font-bold text-slate-500 pl-1">Filter Patient:</span>
              {['ALL', 'Alex Morgan', 'Marcus Vance', 'Elena Rostova'].map((pat) => (
                <button
                  key={pat}
                  onClick={() => setPatientFilter(pat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                    patientFilter === pat ? 'bg-slate-900 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {pat}
                </button>
              ))}
            </div>
          </div>

          {/* MILESTONES LIST */}
          <div className="space-y-4">
            {filteredMilestones.map((m) => (
              <div key={m._id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm text-white ${
                      m.status === 'COMPLETED' ? 'bg-teal-600' : m.status === 'IN_PROGRESS' ? 'bg-blue-600' : 'bg-slate-400'
                    }`}>
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-teal-600 uppercase tracking-wider">{m.phase}</span>
                      <h2 className="font-bold text-slate-900 text-base">{m.title}</h2>
                      <span className="text-xs text-slate-500 font-medium">Patient: <strong>{m.patientName}</strong> ({m.mrn || 'MRN-84920'})</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={m.status}
                      onChange={(e) => handleStatusChange(m._id, e.target.value)}
                      className={`p-2 rounded-xl border text-xs font-bold outline-none cursor-pointer ${
                        m.status === 'COMPLETED'
                          ? 'bg-teal-50 border-teal-200 text-teal-800'
                          : m.status === 'IN_PROGRESS'
                          ? 'bg-blue-50 border-blue-200 text-blue-800'
                          : 'bg-slate-100 border-slate-200 text-slate-700'
                      }`}
                    >
                      <option value="NOT_STARTED">NOT STARTED</option>
                      <option value="IN_PROGRESS">IN PROGRESS</option>
                      <option value="COMPLETED">COMPLETED ✓</option>
                      <option value="ON_HOLD">ON HOLD</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                    <span className="text-slate-400 font-bold uppercase text-[10px]">Clinical Criteria</span>
                    <p className="text-slate-800 font-medium">{m.criteria}</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                    <span className="text-slate-400 font-bold uppercase text-[10px]">Target Date vs Completion</span>
                    <p className="text-slate-800 font-medium">
                      Target: {m.targetDate} {m.completedDate ? `• Cleared: ${m.completedDate}` : ''}
                    </p>
                  </div>
                </div>

                {m.therapistNotes && (
                  <p className="text-xs text-slate-500 italic bg-amber-50/40 p-2.5 rounded-lg border border-amber-100">
                    &ldquo;{m.therapistNotes}&rdquo;
                  </p>
                )}
              </div>
            ))}
          </div>
        </main>
      </div>

      <MobileNavbar role="THERAPIST" />

      {/* CREATE MILESTONE MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">Establish Clinical Milestone</h2>
                <p className="text-xs text-slate-500">Define milestone criteria and target phase deadline</p>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddMilestoneSubmit} className="space-y-4 text-xs">
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
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Milestone Title</label>
                <input
                  type="text"
                  required
                  value={milestoneName}
                  onChange={(e) => setMilestoneName(e.target.value)}
                  placeholder="e.g. Quadriceps Hypertrophy & Limb Symmetry Index > 85%"
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-medium outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Phase</label>
                  <input
                    type="text"
                    value={phaseName}
                    onChange={(e) => setPhaseName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-medium outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Target Completion Date</label>
                  <input
                    type="date"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-medium outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Clinical Verification Criteria</label>
                <textarea
                  value={criteria}
                  onChange={(e) => setCriteria(e.target.value)}
                  placeholder="Specify objective clinical test thresholds (e.g. ROM degrees, LSI percentage)..."
                  className="w-full p-3 rounded-xl border border-slate-200 font-medium outline-none h-20"
                />
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold transition-all shadow-md"
                >
                  Save Milestone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
