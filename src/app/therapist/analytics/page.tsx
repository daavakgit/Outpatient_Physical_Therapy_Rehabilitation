'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { TopNavbar } from '@/components/TopNavbar';
import { MobileNavbar } from '@/components/MobileNavbar';
import {
  BarChart3,
  TrendingUp,
  Activity,
  HeartPulse,
  Award,
  Calendar,
  Filter,
  Users,
  CheckCircle2,
  FileText,
  Sliders,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Legend,
  AreaChart,
  Area,
} from 'recharts';

export default function TherapistProgressAnalyticsPage() {
  const [selectedPatient, setSelectedPatient] = useState('ALL');
  const [selectedRange, setSelectedRange] = useState('30D');

  const adherenceData = [
    { week: 'Wk 1', adherence: 78, pain: 6.8, sessions: 12 },
    { week: 'Wk 2', adherence: 82, pain: 5.5, sessions: 15 },
    { week: 'Wk 3', adherence: 85, pain: 4.2, sessions: 18 },
    { week: 'Wk 4', adherence: 90, pain: 3.4, sessions: 20 },
    { week: 'Wk 5', adherence: 94, pain: 2.5, sessions: 22 },
    { week: 'Wk 6', adherence: 92, pain: 2.1, sessions: 24 },
  ];

  const phaseBreakdown = [
    { phase: 'Phase 1: Pain Control', patients: 3, avgAdherence: 82 },
    { phase: 'Phase 2: Mobility', patients: 5, avgAdherence: 90 },
    { phase: 'Phase 3: Hypertrophy', patients: 4, avgAdherence: 88 },
    { phase: 'Phase 4: Return to Sport', patients: 2, avgAdherence: 96 },
  ];

  const patientTableData = [
    { name: 'Alex Morgan', mrn: 'MRN-84920', adherence: 92, pain: 2.8, sessions: 24, phase: 'Phase 2: Mobility', progress: 68 },
    { name: 'Marcus Vance', mrn: 'MRN-91204', adherence: 64, pain: 6.2, sessions: 12, phase: 'Phase 1: Pain Control', progress: 42 },
    { name: 'Elena Rostova', mrn: 'MRN-73412', adherence: 88, pain: 3.1, sessions: 32, phase: 'Phase 3: Hypertrophy', progress: 88 },
    { name: 'David Sterling', mrn: 'MRN-60911', adherence: 95, pain: 1.5, sessions: 18, phase: 'Phase 2: Mobility', progress: 74 },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex text-slate-800">
      <Sidebar role="THERAPIST" />

      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-8">
        <TopNavbar title="Progress Analytics" subtitle="Population Health & Clinical Outcome Intelligence" />

        <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          {/* HEADER & FILTER CONTROLS */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Clinical Outcome Analytics</h1>
              <p className="text-xs text-slate-500">Track patient adherence trajectories, VAS pain reduction curves, and phase completions.</p>
            </div>

            <div className="flex items-center gap-3">
              <select
                value={selectedRange}
                onChange={(e) => setSelectedRange(e.target.value)}
                className="p-2 rounded-xl border border-slate-200 bg-white text-xs font-bold shadow-xs outline-none"
              >
                <option value="7D">Last 7 Days</option>
                <option value="30D">Last 30 Days</option>
                <option value="90D">Last 90 Days</option>
              </select>

              <select
                value={selectedPatient}
                onChange={(e) => setSelectedPatient(e.target.value)}
                className="p-2 rounded-xl border border-slate-200 bg-white text-xs font-bold shadow-xs outline-none"
              >
                <option value="ALL">All Roster Patients</option>
                <option value="Alex Morgan">Alex Morgan</option>
                <option value="Marcus Vance">Marcus Vance</option>
                <option value="Elena Rostova">Elena Rostova</option>
                <option value="David Sterling">David Sterling</option>
              </select>
            </div>
          </div>

          {/* KPI STAT CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Average Adherence</span>
                <span className="text-2xl font-black text-teal-600 mt-0.5 block">89.7%</span>
                <span className="text-[11px] text-teal-700 font-medium">+4.2% vs previous month</span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                <Activity className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Completed Sessions</span>
                <span className="text-2xl font-black text-slate-900 mt-0.5 block">128</span>
                <span className="text-[11px] text-slate-500 font-medium">Recorded logs</span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Avg Pain (VAS)</span>
                <span className="text-2xl font-black text-blue-600 mt-0.5 block">3.1 / 10</span>
                <span className="text-[11px] text-teal-700 font-medium">-2.4 reduction overall</span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <HeartPulse className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Milestones Cleared</span>
                <span className="text-2xl font-black text-purple-600 mt-0.5 block">18</span>
                <span className="text-[11px] text-purple-700 font-medium">Phase transitions</span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* CHARTS GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart 1: Adherence & Pain Trajectory */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-bold text-slate-900 text-base">Roster Adherence vs Pain VAS Curve</h2>
                  <p className="text-xs text-slate-500">6-week population correlation</p>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200 text-xs font-bold">
                  Inverse Correlation
                </span>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={adherenceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#64748b' }} />
                    <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                    <Tooltip />
                    <Area type="monotone" dataKey="adherence" name="Adherence %" stroke="#0d9488" fill="#ccfbf1" strokeWidth={3} />
                    <Line type="monotone" dataKey="pain" name="Pain VAS" stroke="#ef4444" strokeWidth={3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Phase Distribution & Completion */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-bold text-slate-900 text-base">Rehabilitation Phase Adherence Distribution</h2>
                  <p className="text-xs text-slate-500">Average compliance across active recovery phases</p>
                </div>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={phaseBreakdown} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="phase" tick={{ fontSize: 10, fill: '#64748b' }} />
                    <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                    <Tooltip />
                    <Bar dataKey="avgAdherence" name="Avg Adherence %" fill="#0f766e" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* PATIENT PROGRESS TABLE */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="font-bold text-slate-900 text-base">Patient Outcome & Progress Directory</h2>
                <p className="text-xs text-slate-500">Comparative performance log across roster patients</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold text-[11px] uppercase tracking-wider">
                  <tr>
                    <th className="p-4">Patient</th>
                    <th className="p-4">Current Phase</th>
                    <th className="p-4">Adherence</th>
                    <th className="p-4">Pain (VAS)</th>
                    <th className="p-4">Sessions</th>
                    <th className="p-4">Overall Progress</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {patientTableData.map((p, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="p-4">
                        <span className="font-bold text-slate-900 block">{p.name}</span>
                        <span className="text-[11px] text-slate-400 font-mono">{p.mrn}</span>
                      </td>

                      <td className="p-4 font-bold text-teal-700">{p.phase}</td>

                      <td className="p-4">
                        <div className="w-28 space-y-1">
                          <span className="font-bold text-slate-800">{p.adherence}%</span>
                          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-teal-600 h-full rounded-full" style={{ width: `${p.adherence}%` }} />
                          </div>
                        </div>
                      </td>

                      <td className="p-4 font-bold text-blue-600">{p.pain} / 10</td>

                      <td className="p-4 text-slate-600">{p.sessions} Completed</td>

                      <td className="p-4">
                        <span className="font-bold text-purple-600">{p.progress}%</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      <MobileNavbar role="THERAPIST" />
    </div>
  );
}
