'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Sidebar } from '@/components/Sidebar';
import { MobileNavbar } from '@/components/MobileNavbar';
import {
  Users,
  HeartPulse,
  Calendar,
  Clock,
  Plus,
  BarChart3,
  Dumbbell,
  CheckCircle2,
  ChevronRight,
  FileText,
  AlertTriangle,
  Activity,
  Phone,
  MessageSquare,
  Search,
  Filter,
  Download,
  FolderOpen,
  Edit,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  Check,
  ArrowUpRight,
  UserPlus,
  Bell,
  CheckCircle,
  X,
} from 'lucide-react';

import { AddPatientModal } from '@/components/AddPatientModal';

export default function TherapistDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<any>(null);
  const [rosterTab, setRosterTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [customPatients, setCustomPatients] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => {
        if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
          return res.json();
        }
        return null;
      })
      .then((meData) => {
        if (meData?.user) setUser(meData.user);
      })
      .catch(() => {});

    fetch('/api/therapist/dashboard')
      .then((res) => {
        if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
          return res.json();
        }
        return null;
      })
      .then((dashData) => {
        if (dashData) setData(dashData);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f9ff] flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <div className="w-14 h-14 rounded-full border-4 border-[#006398] border-t-transparent animate-spin mx-auto" />
          <p className="text-sm font-semibold text-slate-700">Loading Clinician Portal & Telemetry Feed...</p>
        </div>
      </div>
    );
  }

  const therapist = data?.therapist;
  const dbPatients = data?.patients || [];

  const defaultRoster: any[] = dbPatients.map((p: any) => ({
    id: p._id || p.id,
    name: p.fullName,
    mrn: p.mrn || `MRN-${p._id ? p._id.toString().slice(-5).toUpperCase() : '84920'}`,
    age: p.age || 30,
    condition: p.condition || 'Post-Op Rehabilitation',
    phase: p.phase || 'Phase I: Initial Assessment',
    adherence: p.adherence || 90,
    lastSession: p.lastSession || 'Today, 8:15 AM',
    lastSessionNotes: p.lastSessionNotes || 'Evaluation completed',
    recoveryGoal: p.recoveryGoal || 75,
    status: p.status || 'ON TRACK',
    statusType: p.status === 'NEEDS ATTENTION' ? 'error' : 'success',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  }));

  const allRosterPatients = [
    ...customPatients.map((p) => ({
      id: p._id || `p-${Math.random()}`,
      name: p.fullName,
      mrn: p.mrn || 'MRN-NEW',
      age: p.age || 30,
      condition: p.condition || 'Post-Op Rehabilitation',
      phase: p.phase || 'Phase I: Initial Assessment',
      adherence: p.adherence || 90,
      lastSession: p.lastSession || 'Just registered',
      lastSessionNotes: p.lastSessionNotes || 'Initial evaluation',
      recoveryGoal: p.recoveryGoal || 75,
      status: p.status || 'ON TRACK',
      statusType: p.statusType || 'success',
      avatar: p.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    })),
    ...defaultRoster,
  ];

  const filteredRoster = allRosterPatients.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.condition.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.mrn.toLowerCase().includes(searchQuery.toLowerCase());
    if (rosterTab === 'needs_review') return matchesSearch && (p.status === 'NEEDS ATTENTION' || p.status === 'DELAYED');
    if (rosterTab === 'post_op') return matchesSearch && (p.condition.includes('Post-Op') || p.condition.includes('Reconstruction') || p.condition.includes('Repair') || p.condition.includes('Arthroplasty'));
    if (rosterTab === 'spine') return matchesSearch && (p.condition.includes('Cervical') || p.condition.includes('Disc') || p.condition.includes('Spine'));
    if (rosterTab === 'sports') return matchesSearch && (p.condition.includes('ACL') || p.condition.includes('Ankle') || p.age < 30);
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#f8f9ff] flex text-[#0b1c30]">
      {/* Sidebar Navigation */}
      <Sidebar
        role="THERAPIST"
        userName={user?.name || therapist?.fullName || 'Dr. Sarah Wilson'}
        userEmail={user?.email || 'dr.sarah@rehabtrack.com'}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-8">
        {/* Custom High-Contrast Top Header */}
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 sm:px-8 h-16 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-500 hidden sm:inline-block">Rehabilitation</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 hidden sm:inline-block" />
            <span className="text-sm font-bold text-[#006398]">Outpatient Clinician Command Portal</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Actions */}
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#006398] hover:bg-[#00476e] text-white text-xs font-bold transition-all shadow-sm"
            >
              <UserPlus className="w-4 h-4" />
              <span className="hidden sm:inline">+ Add New Patient</span>
              <span className="sm:hidden">+ Patient</span>
            </button>

            {/* Notifications */}
            <button className="relative p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors" aria-label="Notifications">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white" />
            </button>

            {/* Clinician Profile */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-[#006398]/10 text-[#006398] font-bold text-xs flex items-center justify-center border border-[#006398]/20">
                {(user?.name || therapist?.fullName || 'Sarah')[0]}
              </div>
              <div className="hidden md:flex flex-col text-left">
                <span className="text-xs font-bold text-slate-900 leading-tight">
                  {user?.name || therapist?.fullName || 'Dr. Sarah Wilson'}
                </span>
                <span className="text-[10px] font-semibold text-[#0c9488]">Physical Therapist</span>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Main Container */}
        <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          {/* Toast Notification Banner */}
          {toastMessage && (
            <div className="p-4 bg-teal-50 border border-teal-200 rounded-2xl text-xs font-bold text-teal-800 flex items-center justify-between shadow-xs animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#0c9488]" />
                <span>{toastMessage}</span>
              </div>
              <button onClick={() => setToastMessage('')} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* TOP CLINICIAN GREETING & WORKSPACE UTILITY BAR */}
          <section className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-100 font-bold text-xs text-[#006398] uppercase tracking-wider">
                  Clinician Command Center
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#0c9488] animate-pulse" />
                  Telemetry Live Feed
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Good Morning, {user?.name || therapist?.fullName || 'Dr. Sarah'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                Outpatient Physical Therapy Clinic • Orthopedic &amp; Sports Medicine Wing
              </p>
            </div>

            {/* Quick Actions & Date Controls */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200/80 shadow-xs text-xs text-slate-700 font-semibold">
                <Calendar className="w-4 h-4 text-[#006398]" />
                <span>Today, Oct 14, 2026</span>
              </div>

              <button
                type="button"
                onClick={() => setIsAddModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#006398] hover:bg-[#00476e] text-white text-xs font-bold transition-all shadow-xs"
              >
                <UserPlus className="w-4 h-4" />
                <span>+ Add Patient</span>
              </button>

              <Link
                href="/therapist/appointments"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-200/80 text-xs font-bold transition-all shadow-xs"
              >
                <Calendar className="w-4 h-4 text-[#006398]" />
                <span>Schedule Appt</span>
              </Link>

              <Link
                href="/therapist/exercises"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-200/80 text-xs font-bold transition-all shadow-xs"
              >
                <Plus className="w-4 h-4 text-[#006398]" />
                <span>Assign Exercise</span>
              </Link>
            </div>
          </section>

          {/* SIX CLINICAL SUMMARY KPI CARDS */}
          {(() => {
            const kpis = data?.kpis || {
              totalPatients: dbPatients.length || 0,
              activePatients: dbPatients.filter((p: any) => p.status === 'ACTIVE').length || 0,
              maintPatients: dbPatients.filter((p: any) => p.status !== 'ACTIVE').length || 0,
              activePlansCount: data?.activePlansCount || 0,
              complianceRate: 0,
              todaySched: data?.todayAppointments?.length || 0,
              todayCompleted: data?.todayAppointments?.filter((a: any) => a.status === 'COMPLETED').length || 0,
              todayRemaining: data?.todayAppointments?.filter((a: any) => a.status === 'SCHEDULED').length || 0,
              workoutsDone: data?.totalSessionsCompleted || 0,
              remoteWorkouts: 0,
              inClinicWorkouts: 0,
              clinicAdherence: 0,
              triageCasesCount: data?.triagePatients?.length || 0,
            };

            const triageList = data?.triagePatients || [];

            return (
              <>
                <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                  {/* KPI 1 */}
                  <div className="p-4 bg-white border border-slate-200/80 rounded-2xl shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Total Patients</span>
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#006398] flex items-center justify-center">
                        <Users className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="text-3xl font-extrabold text-slate-900">{kpis.totalPatients}</div>
                      <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-500">
                        <span className="font-bold text-slate-900">{kpis.activePatients}</span> Active
                        <span className="w-1 h-1 rounded-full bg-slate-300" />
                        <span className="font-bold text-slate-900">{kpis.maintPatients}</span> Maint.
                      </div>
                    </div>
                  </div>

                  {/* KPI 2 */}
                  <div className="p-4 bg-white border border-slate-200/80 rounded-2xl shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Active Rehab Plans</span>
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#006398] flex items-center justify-center">
                        <FileText className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="text-3xl font-extrabold text-slate-900">
                        {kpis.activePlansCount} <span className="text-sm font-bold text-slate-400">Plans</span>
                      </div>
                      <div className="flex items-center gap-1 mt-1 text-xs text-[#0c9488] font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" /> {kpis.complianceRate}% Compliance
                      </div>
                    </div>
                  </div>

                  {/* KPI 3 */}
                  <div className="p-4 bg-white border border-slate-200/80 rounded-2xl shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Today&apos;s In-Clinic</span>
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#006398] flex items-center justify-center">
                        <Calendar className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="text-3xl font-extrabold text-slate-900">
                        {kpis.todaySched} <span className="text-sm font-bold text-slate-400">Sched</span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-500">
                        <span className="text-[#0c9488] font-bold">{kpis.todayCompleted} Completed</span>
                        <span className="w-1 h-1 rounded-full bg-slate-300" />
                        <span>{kpis.todayRemaining} Remaining</span>
                      </div>
                    </div>
                  </div>

                  {/* KPI 4 */}
                  <div className="p-4 bg-white border border-slate-200/80 rounded-2xl shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Recorded Workouts</span>
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#006398] flex items-center justify-center">
                        <Dumbbell className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="text-3xl font-extrabold text-slate-900">
                        {kpis.workoutsDone} <span className="text-sm font-bold text-slate-400">Done</span>
                      </div>
                      <div className="flex items-center gap-1 mt-1 text-xs text-slate-500 truncate">
                        <span className="font-bold text-[#006398]">{kpis.remoteWorkouts} remote</span> / {kpis.inClinicWorkouts} in-clinic
                      </div>
                    </div>
                  </div>

                  {/* KPI 5 */}
                  <div className="p-4 bg-white border border-slate-200/80 rounded-2xl shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Clinic Adherence</span>
                      <div className="w-8 h-8 rounded-lg bg-teal-50 text-[#0c9488] flex items-center justify-center">
                        <TrendingUp className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="text-3xl font-extrabold text-slate-900">{kpis.clinicAdherence}%</div>
                      <div className="flex items-center gap-1 mt-1 text-xs text-[#0c9488] font-bold">
                        <TrendingUp className="w-3.5 h-3.5" /> Real-time usage metric
                      </div>
                    </div>
                  </div>

                  {/* KPI 6: URGENT RED TRIAGE ALERT */}
                  <div className="p-4 bg-red-50 border border-red-200 rounded-2xl shadow-xs flex flex-col justify-between text-red-950">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-red-700">Triage Required</span>
                      <div className="w-8 h-8 rounded-lg bg-white/80 text-red-600 flex items-center justify-center shadow-xs">
                        <AlertTriangle className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="text-3xl font-extrabold text-red-600">
                        {kpis.triageCasesCount} <span className="text-sm font-bold text-red-700">Cases</span>
                      </div>
                      <p className="text-xs text-red-800 font-semibold mt-1">High pain spike &amp; missed reps</p>
                    </div>
                  </div>
                </section>

                {/* URGENT TRIAGE ALERT BANNER & CLINICAL ACTION CARDS */}
                <section className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                      <h2 className="text-lg sm:text-xl font-bold text-slate-900">Patients Requiring Clinical Attention</h2>
                      <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-red-800 text-xs font-bold">
                        {triageList.length} Action Required
                      </span>
                    </div>
                    <button type="button" className="text-[#006398] hover:underline text-xs font-bold flex items-center gap-1">
                      <span>Clinical Triage Guidelines</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {triageList.length === 0 ? (
                      <div className="p-8 text-center bg-white rounded-2xl border border-slate-200/80 text-slate-500 text-xs font-medium col-span-full space-y-2">
                        <ShieldCheck className="w-8 h-8 text-teal-600 mx-auto" />
                        <p className="font-bold text-slate-800 text-sm">No Urgent Clinical Triage Flags</p>
                        <p className="text-slate-400">All registered outpatient care plans are performing within expected parameters.</p>
                      </div>
                    ) : (
                      triageList.map((item: any) => (
                        <div key={item.id} className="p-5 bg-white border border-red-200 rounded-2xl shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
                          <div className="space-y-3">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <h3 className="font-bold text-slate-900 text-sm">{item.name}</h3>
                                <p className="text-xs text-slate-500">{item.condition}</p>
                              </div>
                              <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-extrabold uppercase">
                                {item.alertType || 'Care Alert'}
                              </span>
                            </div>

                            <div className="p-3 rounded-xl bg-red-50/60 border border-red-100 space-y-1.5">
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-slate-600 font-medium">Recorded Adherence:</span>
                                <span className="font-extrabold text-red-600">{item.adherence}%</span>
                              </div>
                              <p className="text-xs text-slate-800 font-medium leading-snug">{item.notes}</p>
                              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                                <span>{item.lastSession}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 mt-4 pt-2">
                            <Link
                              href="/therapist/plans"
                              className="flex-1 py-2 px-3 rounded-xl bg-[#006398] hover:bg-[#00476e] text-white text-xs font-bold text-center shadow-xs transition-colors"
                            >
                              Review &amp; Adjust Plan
                            </Link>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </section>
              </>
            );
          })()}

          {/* MAIN PATIENT ROSTER & ACTIVE MONITORING TABLE */}
          <section className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-xs space-y-6">
            {/* Table Controls & Sub-Navigation Filters */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl overflow-x-auto max-w-full">
                <button
                  onClick={() => setRosterTab('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                    rosterTab === 'all' ? 'bg-white text-[#006398] shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  All Patients (48)
                </button>
                <button
                  onClick={() => setRosterTab('post_op')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                    rosterTab === 'post_op' ? 'bg-white text-[#006398] shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Post-Operative (18)
                </button>
                <button
                  onClick={() => setRosterTab('spine')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                    rosterTab === 'spine' ? 'bg-white text-[#006398] shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Spine &amp; Core (12)
                </button>
                <button
                  onClick={() => setRosterTab('sports')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                    rosterTab === 'sports' ? 'bg-white text-[#006398] shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Sports Rehab (18)
                </button>
                <button
                  onClick={() => setRosterTab('needs_review')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    rosterTab === 'needs_review' ? 'bg-red-50 text-red-600 border border-red-200 shadow-xs' : 'text-red-600 hover:bg-red-50'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  Needs Review (4)
                </button>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative flex items-center">
                  <Search className="w-4 h-4 absolute left-3 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Filter patient or diagnosis..."
                    className="pl-9 pr-3 py-1.5 bg-slate-100 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#006398] w-48 sm:w-60 transition-all"
                  />
                </div>
                <button type="button" className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors" title="Filter columns">
                  <Filter className="w-4 h-4" />
                </button>
                <button type="button" className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors" title="Export clinical roster">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Data Table Container */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[11px] uppercase tracking-wider font-bold">
                    <th className="py-3 px-4 rounded-l-xl">Patient Name &amp; ID</th>
                    <th className="py-3 px-4">Condition &amp; Protocol</th>
                    <th className="py-3 px-4">Adherence (30d)</th>
                    <th className="py-3 px-4">Last Recorded Session</th>
                    <th className="py-3 px-4">Recovery Goal</th>
                    <th className="py-3 px-4">Clinical Status</th>
                    <th className="py-3 px-4 rounded-r-xl text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredRoster.map((patient) => (
                    <tr key={patient.id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={patient.avatar} alt={patient.name} className="w-9 h-9 rounded-full object-cover border border-slate-200" />
                          <div>
                            <span className="font-bold text-slate-900 group-hover:text-[#006398] transition-colors block">
                              {patient.name}
                            </span>
                            <span className="text-[11px] text-slate-500">{patient.mrn} • Age {patient.age}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div>
                          <span className="font-bold text-slate-800 block">{patient.condition}</span>
                          <span className="text-[11px] text-slate-500">{patient.phase}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 w-8">{patient.adherence}%</span>
                          <div className="w-20 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-[#006398] rounded-full" style={{ width: `${patient.adherence}%` }} />
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div>
                          <span className={`font-bold block ${patient.statusType === 'error' ? 'text-red-600' : 'text-slate-800'}`}>
                            {patient.lastSession}
                          </span>
                          <span className="text-[11px] text-slate-500">{patient.lastSessionNotes}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#006398] w-8">{patient.recoveryGoal}%</span>
                          <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-[#0c9488] rounded-full" style={{ width: `${patient.recoveryGoal}%` }} />
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                            patient.statusType === 'error'
                              ? 'bg-red-100 text-red-700'
                              : patient.statusType === 'warning'
                              ? 'bg-amber-100 text-amber-800'
                              : patient.statusType === 'neutral'
                              ? 'bg-slate-100 text-slate-700'
                              : 'bg-blue-50 text-[#006398]'
                          }`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full fill-current" />
                          {patient.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            href={`/therapist/patients/${patient.id}`}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-[#006398] hover:bg-slate-100 transition-colors"
                            title="View Patient Profile"
                          >
                            <FolderOpen className="w-4 h-4" />
                          </Link>
                          <Link
                            href="/therapist/plans"
                            className="p-1.5 rounded-lg text-slate-500 hover:text-[#006398] hover:bg-slate-100 transition-colors"
                            title="Edit Rehab Plan"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button
                            type="button"
                            className="p-1.5 rounded-lg text-slate-500 hover:text-[#006398] hover:bg-slate-100 transition-colors"
                            title="Direct Message"
                          >
                            <MessageSquare className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Table Footer Pagination */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 text-slate-500 text-xs font-semibold">
              <div>
                Showing <span className="font-bold text-slate-900">{filteredRoster.length}</span> of{' '}
                <span className="font-bold text-slate-900">48</span> active rehabilitation profiles
              </div>
              <div className="flex items-center gap-1.5">
                <button disabled type="button" className="px-3 py-1 rounded-lg bg-slate-100 text-slate-400 disabled:opacity-50">
                  Previous
                </button>
                <button type="button" className="px-3 py-1 rounded-lg bg-[#006398] text-white font-bold">
                  1
                </button>
                <button type="button" className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800">
                  2
                </button>
                <button type="button" className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800">
                  3
                </button>
                <span className="px-1 text-slate-300">...</span>
                <button type="button" className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800">
                  10
                </button>
                <button type="button" className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800">
                  Next
                </button>
              </div>
            </div>
          </section>

          {/* CLINICAL ANALYTICS & ADHERENCE OVERVIEW (2 CHARTS) */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* CHART 1: PAIN SCORE VS RECOVERY CURVE */}
            <div className="lg:col-span-7 bg-white border border-slate-200/80 p-6 rounded-2xl shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Pain Score vs. Kinematic Recovery Curve</h3>
                    <p className="text-xs text-slate-500">Clinic-wide 10-week longitudinal telemetry comparison</p>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-semibold">
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-1 rounded bg-[#006398]" />
                      <span className="text-slate-800">Avg ROM %</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-1 rounded bg-red-500" />
                      <span className="text-slate-800">VAS Pain (1-10)</span>
                    </div>
                  </div>
                </div>

                {/* Inline SVG Dual Telemetry Chart */}
                <div className="relative w-full h-52 bg-slate-50 rounded-xl p-3 flex flex-col justify-between border border-slate-200/60">
                  <svg className="w-full h-full overflow-visible" fill="none" viewBox="0 0 600 160">
                    <line className="text-slate-200" stroke="currentColor" strokeDasharray="4 4" x1="0" x2="600" y1="0" y2="0" />
                    <line className="text-slate-200" stroke="currentColor" strokeDasharray="4 4" x1="0" x2="600" y1="40" y2="40" />
                    <line className="text-slate-200" stroke="currentColor" strokeDasharray="4 4" x1="0" x2="600" y1="80" y2="80" />
                    <line className="text-slate-200" stroke="currentColor" strokeDasharray="4 4" x1="0" x2="600" y1="120" y2="120" />

                    <defs>
                      <linearGradient id="recGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#006398" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="#006398" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    <path d="M 0 145 C 70 140, 120 125, 180 95 C 240 70, 310 50, 380 35 C 450 25, 520 15, 600 10 L 600 160 L 0 160 Z" fill="url(#recGrad)" />
                    <path d="M 0 145 C 70 140, 120 125, 180 95 C 240 70, 310 50, 380 35 C 450 25, 520 15, 600 10" stroke="#006398" strokeWidth="3" strokeLinecap="round" />
                    <path d="M 0 25 C 70 30, 130 50, 190 75 C 250 95, 320 115, 390 130 C 460 142, 530 148, 600 150" stroke="#ef4444" strokeWidth="2.5" strokeDasharray="4 4" strokeLinecap="round" />

                    <circle cx="180" cy="95" r="4" fill="white" stroke="#006398" strokeWidth="2.5" />
                    <circle cx="380" cy="35" r="4" fill="white" stroke="#006398" strokeWidth="2.5" />
                    <circle cx="190" cy="75" r="4" fill="white" stroke="#ef4444" strokeWidth="2.5" />
                  </svg>

                  <div className="flex justify-between text-slate-500 text-[10px] font-semibold pt-1">
                    <span>Wk 1</span>
                    <span>Wk 2</span>
                    <span>Wk 4</span>
                    <span>Wk 6</span>
                    <span>Wk 8</span>
                    <span className="text-[#006398] font-bold">Wk 10 (Current)</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-3 bg-slate-50 rounded-xl flex items-center justify-between text-xs font-semibold">
                <span className="flex items-center gap-1.5 text-[#0c9488]">
                  <CheckCircle className="w-4 h-4" />
                  Clinic milestone efficacy exceeds regional average by +8.4%
                </span>
                <button type="button" className="text-[#006398] hover:underline font-bold">
                  Download Biomechanics PDF
                </button>
              </div>
            </div>

            {/* CHART 2: WEEKLY SESSION VOLUMES */}
            <div className="lg:col-span-5 bg-white border border-slate-200/80 p-6 rounded-2xl shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Weekly Session Volumes</h3>
                    <p className="text-xs text-slate-500">Daily remote exercises &amp; in-clinic workouts</p>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#006398] text-xs font-bold border border-blue-100">
                    168 Total / Wk
                  </span>
                </div>

                {/* Weekly Bar Graphic */}
                <div className="mt-2 flex items-end justify-between gap-3 h-40 pt-4 bg-slate-50 rounded-xl p-4 border border-slate-200/60">
                  <div className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                    <span className="text-[10px] font-semibold text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">26</span>
                    <div className="w-full max-w-[28px] bg-blue-200 group-hover:bg-[#006398] rounded-t-md transition-all" style={{ height: '75%' }} />
                    <span className="text-[11px] font-bold text-slate-500">M</span>
                  </div>
                  <div className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                    <span className="text-[10px] font-semibold text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">31</span>
                    <div className="w-full max-w-[28px] bg-blue-200 group-hover:bg-[#006398] rounded-t-md transition-all" style={{ height: '90%' }} />
                    <span className="text-[11px] font-bold text-slate-500">T</span>
                  </div>
                  <div className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                    <span className="text-[10px] font-semibold text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">28</span>
                    <div className="w-full max-w-[28px] bg-blue-200 group-hover:bg-[#006398] rounded-t-md transition-all" style={{ height: '80%' }} />
                    <span className="text-[11px] font-bold text-slate-500">W</span>
                  </div>
                  <div className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                    <span className="text-[10px] font-semibold text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">34</span>
                    <div className="w-full max-w-[28px] bg-blue-200 group-hover:bg-[#006398] rounded-t-md transition-all" style={{ height: '95%' }} />
                    <span className="text-[11px] font-bold text-slate-500">T</span>
                  </div>
                  <div className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                    <span className="text-[10px] font-bold text-[#006398]">24</span>
                    <div className="w-full max-w-[28px] bg-[#006398] rounded-t-md transition-all shadow-sm" style={{ height: '68%' }} />
                    <span className="text-[11px] font-bold text-[#006398]">F</span>
                  </div>
                  <div className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                    <span className="text-[10px] font-semibold text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">14</span>
                    <div className="w-full max-w-[28px] bg-slate-200 group-hover:bg-blue-300 rounded-t-md transition-all" style={{ height: '40%' }} />
                    <span className="text-[11px] font-bold text-slate-500">S</span>
                  </div>
                  <div className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                    <span className="text-[10px] font-semibold text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">11</span>
                    <div className="w-full max-w-[28px] bg-slate-200 group-hover:bg-blue-300 rounded-t-md transition-all" style={{ height: '30%' }} />
                    <span className="text-[11px] font-bold text-slate-500">S</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-3 bg-slate-50 rounded-xl flex items-center justify-between border border-slate-200/60">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-teal-50 text-[#0c9488] flex items-center justify-center font-bold">
                    <Check className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs">94.2% Attendance Rate</h4>
                    <span className="text-[11px] text-slate-500">Only 2 appointments rescheduled this month</span>
                  </div>
                </div>
                <Link
                  href="/therapist/sessions"
                  className="px-3 py-1.5 rounded-lg bg-white text-[#006398] border border-slate-200 hover:bg-slate-100 text-xs font-bold transition-colors shadow-xs"
                >
                  View Logs
                </Link>
              </div>
            </div>
          </section>
        </main>
      </div>

      {/* Add Patient Modal */}
      <AddPatientModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onPatientAdded={(newPatient) => {
          setCustomPatients((prev) => [newPatient, ...prev]);
          setToastMessage(`Patient ${newPatient.fullName} successfully registered into your roster!`);
          setTimeout(() => setToastMessage(''), 6000);
        }}
      />

      {/* Mobile Navbar */}
      <MobileNavbar role="THERAPIST" />
    </div>
  );
}
