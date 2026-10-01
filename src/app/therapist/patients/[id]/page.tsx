'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/Sidebar';
import { TopNavbar } from '@/components/TopNavbar';
import { MobileNavbar } from '@/components/MobileNavbar';
import {
  Activity,
  HeartPulse,
  Award,
  Calendar,
  Clock,
  Play,
  TrendingUp,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  Search,
  Bell,
  User,
  Check,
  Hourglass,
  Stethoscope,
  Dumbbell,
  FileText,
  MessageSquare,
  ArrowLeft,
  AlertTriangle,
  Plus,
  Edit,
  Sliders,
  Phone,
  Mail,
  ShieldAlert,
  BarChart3,
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, AreaChart, Area } from 'recharts';

export default function TherapistPatientProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const patientId = resolvedParams.id;
  const router = useRouter();

  const [patientData, setPatientData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'medical' | 'plan' | 'sessions' | 'milestones' | 'notes'>('overview');
  const [newNote, setNewNote] = useState('');
  const [notesList, setNotesList] = useState([
    { id: 1, author: 'Dr. Sarah Jenkins, PT', date: '2026-09-28', text: 'Patient reported mild lateral tightness during TKE. Reduced resistance band tension by 10%.' },
    { id: 2, author: 'Dr. Sarah Jenkins, PT', date: '2026-09-20', text: 'Achieved 110 degrees flexion without extension lag. Quadriceps activation symmetrical at 85% LSI.' }
  ]);

  useEffect(() => {
    fetch('/api/patients/dashboard')
      .then((res) => {
        if (res.ok && res.headers.get('content-type')?.includes('application/json')) return res.json();
        return null;
      })
      .then((d) => {
        if (d) {
          setPatientData(d);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [patientId]);

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    setNotesList([
      { id: Date.now(), author: 'Dr. Sarah Jenkins, PT', date: new Date().toISOString().split('T')[0], text: newNote },
      ...notesList
    ]);
    setNewNote('');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-full border-4 border-teal-600 border-t-transparent animate-spin mx-auto" />
          <p className="text-xs font-semibold text-slate-600">Loading Patient Clinical Record...</p>
        </div>
      </div>
    );
  }

  const patient = patientData?.patient || {
    _id: patientId,
    fullName: 'Alex Morgan',
    mrn: 'MRN-84920',
    age: 32,
    gender: 'Female',
    condition: 'Post-Op ACL Reconstruction (Hamstring Autograft)',
    phase: 'Phase 2: Mobility & Functional Strength',
    adherence: 92,
    status: 'ON TRACK',
    email: 'alex.morgan@rehabtrack.com',
    phone: '+1 (555) 234-5678',
    startDate: '2026-08-15',
    primaryTherapist: 'Dr. Sarah Jenkins, PT',
    targetROM: '0° Extension / 125° Flexion',
  };

  const plan = patientData?.plan || {
    title: 'ACL Reconstruction Kinetic Rehabilitation Protocol',
    expectedDurationWeeks: 12,
    overallCompletionPercentage: 68,
    therapistNotes: 'Quadriceps activation is progressing smoothly. Patient is adhering strictly to isometric home routine.',
    exercises: [
      { name: 'Knee Extension Isometric Hold', targetSets: 3, targetReps: 10, rest: '45s', rom: '0° to 90°' },
      { name: 'Prone Hamstring Curl', targetSets: 3, targetReps: 12, rest: '60s', rom: 'Up to 80°' },
      { name: 'Terminal Knee Extension (TKE)', targetSets: 2, targetReps: 15, rest: '30s', rom: '3s Isometric Hold' },
      { name: 'Straight Leg Raise (SLR)', targetSets: 3, targetReps: 10, rest: '45s', rom: 'Full extension' }
    ]
  };

  const painData = [
    { day: 'Wk 1', pain: 7.5, flex: 60 },
    { day: 'Wk 2', pain: 6.0, flex: 75 },
    { day: 'Wk 3', pain: 4.8, flex: 90 },
    { day: 'Wk 4', pain: 3.5, flex: 105 },
    { day: 'Wk 5', pain: 2.8, flex: 115 },
    { day: 'Wk 6', pain: 2.0, flex: 122 },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex text-slate-800">
      <Sidebar role="THERAPIST" />

      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-8">
        <TopNavbar title={`Patient Profile: ${patient.fullName}`} subtitle={`Medical Record No: ${patient.mrn}`} />

        <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          {/* Back link */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push('/therapist/patients')}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-all shadow-xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Patient Roster</span>
            </button>

            <div className="flex items-center gap-2">
              <Link
                href={`/therapist/live-monitor?patientId=${patient._id}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all shadow-sm"
              >
                <Play className="w-4 h-4" />
                <span>Start Live Monitoring</span>
              </Link>
              <Link
                href="/therapist/plans"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-sm"
              >
                <Edit className="w-4 h-4" />
                <span>Modify Rehab Plan</span>
              </Link>
            </div>
          </div>

          {/* Clinical Patient Header Card */}
          <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm relative overflow-hidden">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className="w-20 h-20 rounded-2xl bg-teal-100 text-teal-800 font-black text-2xl flex items-center justify-center border-2 border-teal-200 flex-shrink-0 shadow-xs">
                  {patient.fullName.split(' ').map((n: string) => n[0]).join('')}
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-2xl font-black text-slate-900">{patient.fullName}</h1>
                    <span className="px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200 text-xs font-bold">
                      {patient.status}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold">
                      {patient.mrn}
                    </span>
                  </div>

                  <p className="text-xs font-medium text-slate-600">
                    {patient.age} yrs • {patient.gender} • <span className="font-semibold text-teal-800">{patient.condition}</span>
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                    <span className="flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      {patient.email}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      {patient.phone}
                    </span>
                    <span className="flex items-center gap-1 text-slate-700 font-medium">
                      <Stethoscope className="w-3.5 h-3.5 text-teal-600" />
                      Lead PT: {patient.primaryTherapist}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Metrics */}
              <div className="grid grid-cols-3 gap-3 w-full md:w-auto bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="text-center px-3">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Adherence</span>
                  <span className="text-xl font-extrabold text-teal-600">{patient.adherence}%</span>
                </div>
                <div className="text-center px-3 border-x border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Pain VAS</span>
                  <span className="text-xl font-extrabold text-blue-600">2.8/10</span>
                </div>
                <div className="text-center px-3">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Plan Progress</span>
                  <span className="text-xl font-extrabold text-purple-600">{plan.overallCompletionPercentage}%</span>
                </div>
              </div>
            </div>
          </section>

          {/* Navigation Tabs */}
          <div className="flex overflow-x-auto border-b border-slate-200 bg-white px-4 rounded-xl border">
            {[
              { id: 'overview', label: 'Clinical Overview', icon: Activity },
              { id: 'medical', label: 'Medical & ROM', icon: ShieldCheck },
              { id: 'plan', label: 'Rehab Plan', icon: FileText },
              { id: 'sessions', label: 'Session History', icon: Clock },
              { id: 'milestones', label: 'Milestones', icon: Award },
              { id: 'notes', label: 'Therapist Notes', icon: MessageSquare },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 py-3 px-4 border-b-2 text-xs font-bold whitespace-nowrap transition-all ${
                    activeTab === tab.id
                      ? 'border-teal-600 text-teal-600 bg-teal-50/40'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left 7 cols: Charts & Current Protocol */}
              <div className="lg:col-span-7 space-y-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="font-bold text-slate-900 text-base">Pain Score (VAS) & Knee Flexion ROM</h2>
                      <p className="text-xs text-slate-500">Weekly clinical trajectory over 6 post-op weeks</p>
                    </div>
                    <span className="px-2.5 py-1 bg-teal-50 text-teal-700 text-xs font-bold rounded-lg border border-teal-200">
                      ROM: {patient.targetROM}
                    </span>
                  </div>

                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={painData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748b' }} />
                        <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                        <Tooltip />
                        <Line type="monotone" dataKey="pain" name="Pain VAS Score (0-10)" stroke="#ef4444" strokeWidth={3} dot={{ r: 4 }} />
                        <Line type="monotone" dataKey="flex" name="Flexion Degrees (°)" stroke="#0d9488" strokeWidth={3} dot={{ r: 4 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="font-bold text-slate-900 text-base">Active Prescribed Routine</h2>
                    <span className="text-xs font-bold text-teal-600">{plan.exercises.length} Exercises</span>
                  </div>

                  <div className="space-y-3">
                    {plan.exercises.map((ex: any, idx: number) => (
                      <div key={idx} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-xs">
                            0{idx + 1}
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-900 text-xs">{ex.name}</h3>
                            <p className="text-[11px] text-slate-500">ROM: {ex.rom}</p>
                          </div>
                        </div>
                        <div className="text-right text-xs">
                          <span className="font-bold text-slate-800">{ex.targetSets} Sets × {ex.targetReps} Reps</span>
                          <span className="block text-[10px] text-slate-400">Rest: {ex.rest}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right 5 cols: Timeline & Notes summary */}
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                  <h2 className="font-bold text-slate-900 text-base">Clinical Status & Care Directives</h2>

                  <div className="p-4 bg-teal-50 border border-teal-200 rounded-xl space-y-2">
                    <div className="flex items-center gap-2 text-teal-800 text-xs font-bold">
                      <Stethoscope className="w-4 h-4" />
                      <span>Current Phase Directive</span>
                    </div>
                    <p className="text-xs text-teal-900 leading-relaxed italic">
                      &ldquo;{plan.therapistNotes}&rdquo;
                    </p>
                  </div>

                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between text-xs py-2 border-b border-slate-100">
                      <span className="text-slate-500">Protocol Initiated</span>
                      <span className="font-semibold text-slate-800">{patient.startDate}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs py-2 border-b border-slate-100">
                      <span className="text-slate-500">Current Phase</span>
                      <span className="font-semibold text-teal-700">{patient.phase}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs py-2 border-b border-slate-100">
                      <span className="text-slate-500">Limb Symmetry Index (LSI)</span>
                      <span className="font-semibold text-slate-800">85% Quadriceps</span>
                    </div>
                    <div className="flex items-center justify-between text-xs py-2">
                      <span className="text-slate-500">Next Scheduled Evaluation</span>
                      <span className="font-semibold text-blue-700">Oct 05, 2026</span>
                    </div>
                  </div>
                </div>

                {/* Quick Add Note Card */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                  <h2 className="font-bold text-slate-900 text-sm">Quick Add Clinical Observation</h2>
                  <form onSubmit={handleAddNote} className="space-y-3">
                    <textarea
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      placeholder="Type clinical observations or session notes..."
                      className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-500 outline-none h-24"
                    />
                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all shadow-xs"
                    >
                      Save Observation Note
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MEDICAL INFORMATION */}
          {activeTab === 'medical' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
              <h2 className="font-bold text-slate-900 text-lg border-b pb-3">Medical Profile & Range of Motion Diagnostics</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-bold text-slate-800 text-sm text-teal-700">Diagnosis & Surgical History</h3>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                    <p><strong>Primary Condition:</strong> {patient.condition}</p>
                    <p><strong>Surgical Procedure:</strong> Left Knee Arthroscopic ACL Reconstruction with Hamstring Autograft</p>
                    <p><strong>Surgery Date:</strong> August 10, 2026</p>
                    <p><strong>Complications:</strong> None reported post-op</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-bold text-slate-800 text-sm text-amber-700">Precautions & Contraindications</h3>
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-2 text-xs text-amber-900">
                    <p>⚠️ <strong>No Open Kinetic Chain Leg Extension:</strong> Avoid loaded resistance past 45° flexion until Week 8.</p>
                    <p>⚠️ <strong>No Pivoting or Cutting:</strong> Zero lateral pivoting maneuvers without brace support.</p>
                    <p>⚠️ <strong>Cryotherapy Protocol:</strong> 20 min ice application after high-intensity extension sets.</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <h3 className="font-bold text-slate-800 text-sm mb-3">Diagnostic Range of Motion Metrics</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center">
                    <span className="text-slate-400 font-bold block uppercase text-[10px]">Extension Passive</span>
                    <span className="text-xl font-extrabold text-slate-900 mt-1">0° (Full Extension)</span>
                    <span className="text-teal-600 font-semibold text-[11px] block mt-1">✓ Benchmark Achieved</span>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center">
                    <span className="text-slate-400 font-bold block uppercase text-[10px]">Flexion Active</span>
                    <span className="text-xl font-extrabold text-teal-600 mt-1">122°</span>
                    <span className="text-slate-500 font-semibold text-[11px] block mt-1">Target: 130°</span>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center">
                    <span className="text-slate-400 font-bold block uppercase text-[10px]">Quad Deficit</span>
                    <span className="text-xl font-extrabold text-blue-600 mt-1">15%</span>
                    <span className="text-teal-600 font-semibold text-[11px] block mt-1">Target: &lt; 10%</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: REHAB PLAN */}
          {activeTab === 'plan' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <h2 className="font-bold text-slate-900 text-lg">{plan.title}</h2>
                  <p className="text-xs text-slate-500">Prescribed by {patient.primaryTherapist} • Duration: {plan.expectedDurationWeeks} Weeks</p>
                </div>
                <Link
                  href="/therapist/plans"
                  className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all shadow-xs"
                >
                  Edit Protocol & Prescription
                </Link>
              </div>

              <div className="space-y-4">
                <h3 className="font-bold text-slate-800 text-sm">Assigned Exercises & Parameters</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold text-[11px] uppercase">
                      <tr>
                        <th className="p-3">Exercise Name</th>
                        <th className="p-3">Prescription</th>
                        <th className="p-3">Rest</th>
                        <th className="p-3">Target ROM</th>
                        <th className="p-3">Frequency</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {plan.exercises.map((ex: any, idx: number) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="p-3 font-bold text-slate-900">{ex.name}</td>
                          <td className="p-3 text-slate-700">{ex.targetSets} sets × {ex.targetReps} reps</td>
                          <td className="p-3 text-slate-600">{ex.rest}</td>
                          <td className="p-3 text-teal-700 font-semibold">{ex.rom}</td>
                          <td className="p-3 text-slate-600">Daily (5x/week)</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SESSION HISTORY */}
          {activeTab === 'sessions' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h2 className="font-bold text-slate-900 text-lg border-b pb-3">Patient Live Session Audit Trail</h2>

              <div className="space-y-3">
                {[
                  { date: '2026-09-30', time: '08:15 AM', duration: '14 min', status: 'COMPLETED', pain: '2.5 / 10', reps: '30/30 Reps' },
                  { date: '2026-09-29', time: '09:00 AM', duration: '12 min', status: 'COMPLETED', pain: '3.0 / 10', reps: '30/30 Reps' },
                  { date: '2026-09-28', time: '08:30 AM', duration: '15 min', status: 'COMPLETED', pain: '2.8 / 10', reps: '30/30 Reps' },
                  { date: '2026-09-26', time: '04:15 PM', duration: '10 min', status: 'PARTIALLY_COMPLETED', pain: '4.5 / 10', reps: '20/30 Reps' },
                ].map((sess, idx) => (
                  <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{sess.date} ({sess.time})</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          sess.status === 'COMPLETED' ? 'bg-teal-50 text-teal-700 border border-teal-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {sess.status}
                        </span>
                      </div>
                      <p className="text-slate-500">Duration: {sess.duration} • Prescribed Reps Completed: {sess.reps}</p>
                    </div>

                    <div className="flex items-center gap-4 text-right">
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block uppercase">Pain VAS</span>
                        <span className="font-bold text-red-600">{sess.pain}</span>
                      </div>
                      <Link
                        href="/therapist/live-monitor"
                        className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 font-bold hover:bg-slate-100"
                      >
                        Inspect Log
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: MILESTONES */}
          {activeTab === 'milestones' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
              <h2 className="font-bold text-slate-900 text-lg border-b pb-3">Clinical Milestone Trajectory</h2>

              <div className="space-y-4">
                {[
                  { title: 'Phase 1: Initial Assessment & Swelling Control', status: 'COMPLETED', date: 'Aug 25, 2026' },
                  { title: 'Phase 2: Pain Reduction & Baseline ROM (0°-110°)', status: 'COMPLETED', date: 'Sep 15, 2026' },
                  { title: 'Phase 3: Quadriceps Hypertrophy & Kinetic Strength', status: 'IN_PROGRESS', date: 'Target: Oct 15, 2026' },
                  { title: 'Phase 4: Agility, Proprioception & Light Jogging', status: 'NOT_STARTED', date: 'Target: Nov 15, 2026' },
                  { title: 'Phase 5: Return to Sport Clearance Test', status: 'NOT_STARTED', date: 'Target: Dec 15, 2026' },
                ].map((ms, idx) => (
                  <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                        ms.status === 'COMPLETED' ? 'bg-teal-600' : ms.status === 'IN_PROGRESS' ? 'bg-blue-600' : 'bg-slate-300'
                      }`}>
                        {ms.status === 'COMPLETED' ? <Check className="w-4 h-4" /> : idx + 1}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900">{ms.title}</h3>
                        <p className="text-slate-500 text-[11px]">{ms.date}</p>
                      </div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      ms.status === 'COMPLETED' ? 'bg-teal-50 text-teal-700 border border-teal-200' : ms.status === 'IN_PROGRESS' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {ms.status.replace('_', ' ')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: THERAPIST NOTES */}
          {activeTab === 'notes' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
              <h2 className="font-bold text-slate-900 text-lg border-b pb-3">Clinical Progress Notes Log</h2>

              <form onSubmit={handleAddNote} className="space-y-3">
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Record formal clinician observation or treatment plan modification..."
                  className="w-full p-4 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-500 outline-none h-28"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all shadow-xs"
                >
                  Post Clinical Note
                </button>
              </form>

              <div className="space-y-4 pt-4 border-t border-slate-100">
                {notesList.map((note) => (
                  <div key={note.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between font-bold text-slate-800">
                      <span>{note.author}</span>
                      <span className="text-slate-400 font-normal text-[11px]">{note.date}</span>
                    </div>
                    <p className="text-slate-700 leading-relaxed">{note.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      <MobileNavbar role="THERAPIST" />
    </div>
  );
}
