'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Sidebar } from '@/components/Sidebar';
import { TopNavbar } from '@/components/TopNavbar';
import { MobileNavbar } from '@/components/MobileNavbar';
import { AddPatientModal } from '@/components/AddPatientModal';
import {
  Users,
  Search,
  Plus,
  Filter,
  Activity,
  HeartPulse,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ChevronRight,
  Eye,
  FileText,
  Play,
  BarChart3,
  Stethoscope,
} from 'lucide-react';

export default function TherapistPatientsPage() {
  const [patients, setPatients] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ON TRACK' | 'NEEDS ATTENTION' | 'IMPROVING' | 'INACTIVE'>('ALL');
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const fetchPatients = () => {
    setLoading(true);
    fetch(`/api/patients?search=${encodeURIComponent(search)}`)
      .then((res) => {
        if (res.ok && res.headers.get('content-type')?.includes('application/json')) return res.json();
        return null;
      })
      .then((d) => {
        if (d?.patients) {
          setPatients(d.patients);
        } else {
          setPatients([]);
        }
        setLoading(false);
      })
      .catch(() => {
        setPatients([]);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPatients();
  }, [search]);

  const filteredPatients = patients.filter((p) => {
    if (statusFilter === 'ALL') return true;
    return p.status === statusFilter;
  });

  const totalCount = patients.length;
  const onTrackCount = patients.filter((p) => p.status === 'ON TRACK' || p.status === 'IMPROVING').length;
  const needsAttentionCount = patients.filter((p) => p.status === 'NEEDS ATTENTION').length;

  return (
    <div className="min-h-screen bg-slate-50 flex text-slate-800">
      <Sidebar role="THERAPIST" />

      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-8">
        <TopNavbar title="Patient Roster" subtitle="Clinical Outpatient Directory & Case Management" />

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

          {/* PAGE HEADER & ACTION BAR */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Clinical Patient Roster</h1>
              <p className="text-xs text-slate-500">Monitor active patient protocols, adherence compliance, and clinical status.</p>
            </div>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Patient</span>
            </button>
          </div>

          {/* SUMMARY KPI CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Patients</span>
                <span className="text-2xl font-black text-slate-900 mt-0.5 block">{totalCount}</span>
                <span className="text-[11px] text-slate-500 font-medium">Assigned to clinic</span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">On Track & Improving</span>
                <span className="text-2xl font-black text-teal-600 mt-0.5 block">{onTrackCount}</span>
                <span className="text-[11px] text-teal-700 font-medium">High adherence rate</span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Needs Attention</span>
                <span className="text-2xl font-black text-amber-600 mt-0.5 block">{needsAttentionCount}</span>
                <span className="text-[11px] text-amber-700 font-medium">Low adherence / High VAS</span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Avg. Roster Adherence</span>
                <span className="text-2xl font-black text-purple-600 mt-0.5 block">84.8%</span>
                <span className="text-[11px] text-purple-700 font-medium">Tier 1 Target</span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Activity className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* SEARCH & FILTER CONTROLS */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by patient name, MRN, or condition..."
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-500 outline-none"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
              <span className="text-xs font-bold text-slate-500 flex items-center gap-1 pl-1">
                <Filter className="w-3.5 h-3.5" /> Filter:
              </span>
              {(['ALL', 'ON TRACK', 'NEEDS ATTENTION', 'IMPROVING'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                    statusFilter === st
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* PATIENT ROSTER TABLE */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            {loading ? (
              <div className="p-12 text-center text-slate-500 space-y-3">
                <div className="w-10 h-10 rounded-full border-4 border-teal-600 border-t-transparent animate-spin mx-auto" />
                <p className="text-xs font-semibold">Loading Roster Directory...</p>
              </div>
            ) : filteredPatients.length === 0 ? (
              <div className="p-12 text-center space-y-3">
                <Users className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="font-bold text-slate-800 text-sm">No Patients Found</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">No patients matched your search or status filter.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold text-[11px] uppercase tracking-wider">
                    <tr>
                      <th className="p-4">Patient & MRN</th>
                      <th className="p-4">Condition & Phase</th>
                      <th className="p-4">Adherence</th>
                      <th className="p-4">Pain (VAS)</th>
                      <th className="p-4">Last Session</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {filteredPatients.map((p) => {
                      const id = p._id || p.id || 'pat_1';
                      return (
                        <tr key={id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-800 font-black text-xs flex items-center justify-center border border-teal-200">
                                {p.fullName.split(' ').map((n: string) => n[0]).join('')}
                              </div>
                              <div>
                                <Link href={`/therapist/patients/${id}`} className="font-bold text-slate-900 hover:text-teal-600 text-sm block">
                                  {p.fullName}
                                </Link>
                                <span className="text-[11px] text-slate-400 font-mono">{p.mrn || 'MRN-84920'} • {p.age || 30} yrs ({p.gender || 'F'})</span>
                              </div>
                            </div>
                          </td>

                          <td className="p-4">
                            <span className="font-bold text-slate-800 block text-xs">{p.condition}</span>
                            <span className="text-[11px] text-teal-700 font-medium">{p.phase || 'Phase 1: Mobility'}</span>
                          </td>

                          <td className="p-4">
                            <div className="w-32 space-y-1">
                              <div className="flex items-center justify-between text-[11px] font-bold">
                                <span className="text-slate-700">{p.adherence || 90}%</span>
                              </div>
                              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${
                                    (p.adherence || 90) >= 80 ? 'bg-teal-600' : (p.adherence || 90) >= 60 ? 'bg-amber-500' : 'bg-red-500'
                                  }`}
                                  style={{ width: `${p.adherence || 90}%` }}
                                />
                              </div>
                            </div>
                          </td>

                          <td className="p-4">
                            <span className={`font-bold ${
                              (p.painScale || 3) > 5 ? 'text-red-600 font-black' : (p.painScale || 3) > 3 ? 'text-amber-600' : 'text-teal-600'
                            }`}>
                              {p.painScale || '2.8'} / 10
                            </span>
                          </td>

                          <td className="p-4 text-slate-600 text-[11px]">
                            {p.lastSession || 'Today, 8:15 AM'}
                          </td>

                          <td className="p-4">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border ${
                              p.status === 'ON TRACK'
                                ? 'bg-teal-50 text-teal-700 border-teal-200'
                                : p.status === 'IMPROVING'
                                ? 'bg-blue-50 text-blue-700 border-blue-200'
                                : 'bg-amber-50 text-amber-700 border-amber-200'
                            }`}>
                              {p.status}
                            </span>
                          </td>

                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <Link
                                href={`/therapist/patients/${id}`}
                                className="p-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                                title="View Patient Profile"
                              >
                                <Eye className="w-4 h-4" />
                              </Link>
                              <Link
                                href="/therapist/plans"
                                className="p-2 rounded-lg bg-slate-100 text-teal-700 hover:bg-teal-50 transition-colors"
                                title="Rehab Plan"
                              >
                                <FileText className="w-4 h-4" />
                              </Link>
                              <Link
                                href={`/therapist/live-monitor?patientId=${id}`}
                                className="p-2 rounded-lg bg-teal-600 text-white hover:bg-teal-700 transition-colors"
                                title="Start Live Monitor"
                              >
                                <Play className="w-4 h-4" />
                              </Link>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>

      <MobileNavbar role="THERAPIST" />

      {/* Add Patient Modal */}
      <AddPatientModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onPatientAdded={(newPat) => {
          setToastMessage(`Patient ${newPat.fullName} added successfully to roster.`);
          fetchPatients();
        }}
      />
    </div>
  );
}
