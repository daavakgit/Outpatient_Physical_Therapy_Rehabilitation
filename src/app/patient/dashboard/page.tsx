'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Sidebar } from '@/components/Sidebar';
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
  Video,
  FileText,
  MessageSquare,
  CalendarPlus,
  Plus,
  History,
  Sparkles,
  TrendingDown,
  Filter,
  ArrowUpRight,
  CheckCircle,
} from 'lucide-react';

export default function PatientDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [notificationsOpen, setNotificationsOpen] = useState<boolean>(false);

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

    fetch('/api/patients/dashboard')
      .then((res) => {
        if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
          return res.json();
        }
        return null;
      })
      .then((dashboardData) => {
        if (dashboardData) setData(dashboardData);
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
          <p className="text-sm font-semibold text-slate-700">Loading Patient Rehabilitation Portal...</p>
        </div>
      </div>
    );
  }

  const patient = data?.patient;
  const plan = data?.plan;
  const milestones = data?.milestones || [];
  const todayProgress = data?.todayProgress || { completedCount: 1, totalCount: 3, completionPercentage: 33 };

  const defaultExercises = [
    {
      id: 'ex-1',
      name: 'Knee Extension',
      category: 'Morning Routine • Done',
      isCompleted: true,
      duration: '10 min',
      difficulty: 'Beginner',
      targetArea: 'Quadriceps Strengthening • Kinetic Chain Alignment',
      prescription: '3 Sets × 10 Reps',
      rom: '0° to 90° Flexion',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'ex-2',
      name: 'Prone Hamstring Curl',
      category: 'Afternoon Ready',
      isCompleted: false,
      duration: '12 min',
      difficulty: 'Progressive',
      targetArea: 'Posterior Chain & Hamstring Dynamic Stability',
      prescription: '3 Sets × 12 Reps',
      rom: 'Up to 80° Flexion',
      image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'ex-3',
      name: 'Terminal Knee Extension (TKE)',
      category: 'Evening Session',
      isCompleted: false,
      duration: '8 min',
      difficulty: 'Elastic Band',
      targetArea: 'Vastus Medialis Oblique (VMO) Activation Focus',
      prescription: '2 Sets × 15 Reps',
      rom: '3s Isometric Hold',
      image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80',
    },
  ];

  const filteredExercises = defaultExercises.filter((ex) => {
    if (activeTab === 'morning') return ex.category.includes('Morning');
    if (activeTab === 'afternoon') return ex.category.includes('Afternoon');
    if (activeTab === 'evening') return ex.category.includes('Evening');
    return true;
  });

  return (
    <div className="min-h-screen bg-[#f8f9ff] flex text-[#0b1c30]">
      {/* Sidebar Navigation */}
      <Sidebar
        role="PATIENT"
        userName={user?.name || patient?.fullName || 'Alex Morgan'}
        userEmail={user?.email || 'alex.morgan@rehab.com'}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-8">
        {/* Custom High-Contrast Top Header */}
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 sm:px-8 h-16 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-500 hidden sm:inline-block">Rehabilitation</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 hidden sm:inline-block" />
            <span className="text-sm font-bold text-[#006398]">Outpatient Rehabilitation Platform</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Action Button */}
            <Link
              href="/patient/session/live"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#006398] hover:bg-[#00476e] text-white text-xs font-bold transition-all shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Log Daily Pain / Progress</span>
              <span className="sm:hidden">Log Progress</span>
            </Link>

            {/* Notifications */}
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white" />
            </button>

            {/* Profile Pill */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-[#006398]/10 text-[#006398] font-bold text-xs flex items-center justify-center border border-[#006398]/20">
                {(user?.name || patient?.fullName || 'Alex')[0]}
              </div>
              <div className="hidden md:flex flex-col text-left">
                <span className="text-xs font-bold text-slate-900 leading-tight">
                  {user?.name || patient?.fullName || 'Alex Morgan'}
                </span>
                <span className="text-[10px] font-semibold text-[#0c9488]">Patient</span>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Main Container */}
        <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          {/* TOP WELCOME BANNER & HERO CARD */}
          <section className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-[#006398]/10 blur-3xl pointer-events-none" />

            <div className="space-y-3 relative z-10">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-[#006398] font-bold text-xs uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-[#0c9488] animate-pulse" />
                  Post-Op ACL Reconstruction • Week 6
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Good Morning, {user?.name || patient?.fullName || 'Alex'}
              </h1>

              <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
                Here’s your personalized rehabilitation progress for today. Stay consistent with your kinetic routine and monitor quadriceps activation.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 relative z-10 flex-shrink-0">
              <Link
                href="/patient/plan"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-bold transition-all shadow-xs"
              >
                <FileText className="w-4 h-4 text-[#006398]" />
                <span>Protocol Sheet</span>
              </Link>
              <Link
                href="/patient/session/live"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#006398] hover:bg-[#00476e] text-white text-xs sm:text-sm font-bold transition-all shadow-md group"
              >
                <Play className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" />
                <span>Start Exercises Now</span>
              </Link>
            </div>
          </section>

          {/* FOUR PRIMARY CLINICAL METRIC CARDS */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* CARD 1: OVERALL RECOVERY */}
            <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Overall Recovery</span>
                  <div className="text-3xl font-extrabold text-slate-900 mt-1">
                    {plan?.overallCompletionPercentage || 72}%
                  </div>
                </div>
                <div className="relative w-12 h-12 flex items-center justify-center flex-shrink-0">
                  <svg className="w-12 h-12 -rotate-90" viewBox="0 0 48 48">
                    <circle className="text-slate-100 fill-none" cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4.5" />
                    <circle className="text-[#0c9488] fill-none" cx="24" cy="24" r="20" stroke="currentColor" strokeDasharray="125.6" strokeDashoffset="35.17" strokeLinecap="round" strokeWidth="4.5" />
                  </svg>
                  <Activity className="w-5 h-5 text-[#0c9488] absolute" />
                </div>
              </div>
              <div className="flex items-center gap-1.5 pt-4 mt-2 border-t border-slate-100">
                <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-teal-50 text-[#0c9488] text-xs font-bold">
                  <TrendingUp className="w-3.5 h-3.5 mr-0.5" />+4%
                </span>
                <span className="text-xs text-slate-500">vs. previous evaluation</span>
              </div>
            </div>

            {/* CARD 2: TODAY'S SESSIONS */}
            <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Today&apos;s Sessions</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-3xl font-extrabold text-slate-900">{todayProgress.completedCount}</span>
                    <span className="text-lg font-bold text-slate-400">/ {todayProgress.totalCount}</span>
                    <span className="text-xs font-semibold text-slate-500 ml-1">Completed</span>
                  </div>
                </div>
                <div className="w-11 h-11 rounded-xl bg-blue-50 text-[#006398] flex items-center justify-center">
                  <Dumbbell className="w-5 h-5" />
                </div>
              </div>
              <div className="flex items-center justify-between pt-4 mt-2 border-t border-slate-100">
                <span className="text-xs text-slate-500">Next block scheduled:</span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-50 text-[#006398] text-xs font-bold">
                  <Clock className="w-3.5 h-3.5" /> 02:30 PM
                </span>
              </div>
            </div>

            {/* CARD 3: RECORDED ADHERENCE */}
            <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Recorded Adherence</span>
                  <div className="text-3xl font-extrabold text-slate-900 mt-1">82%</div>
                </div>
                <div className="w-11 h-11 rounded-xl bg-teal-50 text-[#0c9488] flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              </div>
              <div className="flex items-center justify-between pt-4 mt-2 border-t border-slate-100">
                <span className="text-xs text-slate-500">18 / 22 Sessions Recorded</span>
                <span className="text-xs font-bold text-[#0c9488]">Tier 1 Target</span>
              </div>
            </div>

            {/* CARD 4: CURRENT MILESTONE */}
            <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Current Milestone</span>
                  <div className="text-lg font-extrabold text-slate-900 mt-1">Strength Stage</div>
                </div>
                <div className="w-11 h-11 rounded-xl bg-blue-50 text-[#006398] flex items-center justify-center">
                  <Award className="w-5 h-5" />
                </div>
              </div>
              <div className="flex items-center justify-between pt-4 mt-2 border-t border-slate-100">
                <span className="text-xs text-slate-500">Kinematic Phase 3 of 5</span>
                <span className="px-2 py-0.5 rounded-full bg-blue-100 text-[#00476e] text-xs font-bold">Active</span>
              </div>
            </div>
          </section>

          {/* TODAY'S PRESCRIBED EXERCISES BOARD */}
          <section className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Today&apos;s Prescribed Exercises</h2>
                <p className="text-xs text-slate-500">Clinical protocol curated by Dr. Sarah Jenkins for optimal kinetic alignment.</p>
              </div>

              {/* Segmented Filter Tabs */}
              <div className="inline-flex p-1 bg-slate-100 rounded-xl self-start sm:self-center">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeTab === 'all' ? 'bg-white text-[#006398] shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  All (3)
                </button>
                <button
                  onClick={() => setActiveTab('morning')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeTab === 'morning' ? 'bg-white text-[#006398] shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Morning (1 Done)
                </button>
                <button
                  onClick={() => setActiveTab('afternoon')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeTab === 'afternoon' ? 'bg-white text-[#006398] shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Afternoon (Ready)
                </button>
                <button
                  onClick={() => setActiveTab('evening')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeTab === 'evening' ? 'bg-white text-[#006398] shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Evening (Pending)
                </button>
              </div>
            </div>

            {/* EXERCISE CARDS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredExercises.map((ex) => (
                <div key={ex.id} className="bg-slate-50 border border-slate-200/70 rounded-xl p-4 flex flex-col justify-between hover:bg-slate-100/60 transition-all group">
                  <div className="space-y-3">
                    <div className="relative w-full h-40 rounded-lg overflow-hidden bg-slate-200">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={ex.image} alt={ex.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
                      <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-md bg-white/90 backdrop-blur-md text-slate-800 text-[11px] font-bold shadow-xs">
                        {ex.category}
                      </span>
                      <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-medium flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {ex.duration}
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-slate-900 text-base group-hover:text-[#006398] transition-colors">{ex.name}</h3>
                        <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-semibold">{ex.difficulty}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">{ex.targetArea}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 py-2 bg-white rounded-lg px-3 border border-slate-200/60 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 font-semibold block uppercase">Prescription</span>
                        <span className="font-bold text-slate-800">{ex.prescription}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-semibold block uppercase">Target ROM</span>
                        <span className="font-bold text-[#0c9488]">{ex.rom}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-4 pt-2 border-t border-slate-200/50">
                    <Link
                      href="/patient/exercises"
                      className="flex-1 py-2 px-3 rounded-lg bg-white hover:bg-slate-200 text-slate-800 text-xs font-semibold text-center transition-colors shadow-xs"
                    >
                      View Details
                    </Link>
                    <Link
                      href="/patient/session/live"
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-[#006398] hover:bg-[#00476e] text-white text-xs font-bold transition-colors shadow-xs"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Start Session</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* SPLIT GRID: CLINICAL MILESTONES & PAIN SCORE TREND */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* LEFT 7 COLS: CLINICAL MILESTONE STEPPER */}
            <div className="lg:col-span-7 bg-white border border-slate-200/80 p-6 rounded-2xl shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-2">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Clinical Road Map</span>
                    <h2 className="text-lg font-bold text-slate-900">Milestone Progression Protocol</h2>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-blue-50 text-[#006398] text-xs font-bold border border-blue-100">
                    Stage 3 of 5 Active
                  </span>
                </div>
                <p className="text-xs text-slate-500 mb-6">Comprehensive post-operative ACL trajectory toward unrestricted athletic clearance.</p>

                {/* Stepper Timeline */}
                <div className="relative flex flex-col gap-6 pl-4">
                  {/* Step 1 */}
                  <div className="flex items-start gap-4 relative">
                    <div className="w-8 h-8 rounded-full bg-[#0c9488] text-white flex items-center justify-center text-xs font-bold flex-shrink-0 z-10 shadow-xs">
                      <Check className="w-4 h-4" />
                    </div>
                    <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-slate-200 -ml-[1px]" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">Phase 1: Initial Assessment & Swelling Control</span>
                        <span className="text-[11px] font-bold text-[#0c9488]">Completed</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">Cryotherapy, passive extension to 0°, edema reduction achieved.</p>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="flex items-start gap-4 relative">
                    <div className="w-8 h-8 rounded-full bg-[#0c9488] text-white flex items-center justify-center text-xs font-bold flex-shrink-0 z-10 shadow-xs">
                      <Check className="w-4 h-4" />
                    </div>
                    <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-slate-200 -ml-[1px]" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">Phase 2: Pain Reduction & Baseline ROM</span>
                        <span className="text-[11px] font-bold text-[#0c9488]">Completed</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">Full weight bearing without antalgic gait, knee flexion reached 110°.</p>
                    </div>
                  </div>

                  {/* Step 3 (Active) */}
                  <div className="flex items-start gap-4 relative">
                    <div className="w-8 h-8 rounded-full bg-[#006398] text-white flex items-center justify-center text-xs font-bold flex-shrink-0 z-10 shadow-md">
                      <Activity className="w-4 h-4" />
                    </div>
                    <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-slate-200 -ml-[1px]" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#006398] text-sm">Phase 3: Hypertrophy & Strength Improvement</span>
                        <span className="px-2 py-0.5 rounded-full bg-[#006398] text-white text-[10px] font-bold">Current Phase</span>
                      </div>
                      <p className="text-xs text-slate-800 font-medium mt-0.5">Targeting 85% quad index symmetry relative to contralateral limb, closed kinetic chain loading.</p>
                    </div>
                  </div>

                  {/* Step 4 */}
                  <div className="flex items-start gap-4 relative opacity-60">
                    <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-xs font-bold flex-shrink-0 z-10">
                      <Hourglass className="w-4 h-4" />
                    </div>
                    <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-slate-200 -ml-[1px]" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900 text-sm">Phase 4: Functional Recovery & Agility</span>
                        <span className="text-[11px] font-semibold text-slate-500">Upcoming (Week 9)</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">Proprioception training, light jogging initiation, lateral shuffles.</p>
                    </div>
                  </div>

                  {/* Step 5 */}
                  <div className="flex items-start gap-4 relative opacity-60">
                    <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-xs font-bold flex-shrink-0 z-10">
                      <Award className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900 text-sm">Phase 5: Discharge & Return-to-Sport Assessment</span>
                        <span className="text-[11px] font-semibold text-slate-500">Target: Week 16</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">Limb Symmetry Index &gt;90%, psychological readiness, hop tests.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Clinician Guidance Card */}
              <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-teal-100 flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-teal-100 text-[#0c9488] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Stethoscope className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-[#0c9488] uppercase tracking-wider block">Clinical Guidance • Dr. Sarah Jenkins</span>
                  <p className="text-xs text-slate-700 mt-1 italic leading-relaxed">
                    &ldquo;{plan?.therapistNotes || 'Quadriceps activation is progressing well. Maintain knee tracking over 2nd toe during extensions. Do not exceed 90° flexion under resistance until next consultation.'}&rdquo;
                  </p>
                </div>
              </div>
            </div>

            {/* RIGHT 5 COLS: PAIN SCORE TREND CHART */}
            <div className="lg:col-span-5 bg-white border border-slate-200/80 p-6 rounded-2xl shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-2">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Symptom Tracking</span>
                    <h2 className="text-lg font-bold text-slate-900">Pain Score Trend (VAS)</h2>
                  </div>
                  <span className="text-xs font-semibold text-slate-500">Past 14 Days</span>
                </div>
                <p className="text-xs text-slate-500 mb-4">Daily self-reported Visual Analog Scale (0: Pain-free, 10: Extreme pain).</p>

                {/* Stat Highlight Strip */}
                <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl mb-4 border border-slate-200/60">
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase block">Current Score</span>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className="text-2xl font-extrabold text-[#0c9488]">2.8</span>
                      <span className="text-xs font-bold text-slate-400">/ 10</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 font-bold uppercase block">Status</span>
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-[#0c9488] mt-0.5">
                      <span className="w-2 h-2 rounded-full bg-[#0c9488]" />
                      Mild / Controlled
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 font-bold uppercase block">Delta (14d)</span>
                    <span className="text-sm font-bold text-[#006398] mt-0.5">-4.7 pts</span>
                  </div>
                </div>

                {/* SVG Trend Chart */}
                <div className="relative w-full h-44 bg-slate-50 rounded-xl p-3 flex flex-col justify-between border border-slate-200/60">
                  <svg className="w-full h-full overflow-visible" fill="none" viewBox="0 0 360 140">
                    <line className="text-slate-200" stroke="currentColor" strokeDasharray="3 3" x1="0" x2="360" y1="20" y2="20" />
                    <line className="text-slate-200" stroke="currentColor" strokeDasharray="3 3" x1="0" x2="360" y1="60" y2="60" />
                    <line className="text-slate-200" stroke="currentColor" strokeDasharray="3 3" x1="0" x2="360" y1="100" y2="100" />

                    <defs>
                      <linearGradient id="painGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#006398" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#006398" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    <path d="M 10,25 C 50,30 90,45 130,55 C 180,68 230,80 280,95 C 310,105 330,108 350,110 L 350,135 L 10,135 Z" fill="url(#painGrad)" />
                    <path d="M 10,25 C 50,30 90,45 130,55 C 180,68 230,80 280,95 C 310,105 330,108 350,110" stroke="#006398" strokeWidth="3" strokeLinecap="round" />

                    <circle cx="10" cy="25" r="4" className="fill-white" stroke="#006398" strokeWidth="2.5" />
                    <circle cx="90" cy="45" r="3.5" className="fill-white" stroke="#006398" strokeWidth="2" />
                    <circle cx="180" cy="68" r="3.5" className="fill-white" stroke="#006398" strokeWidth="2" />
                    <circle cx="280" cy="95" r="3.5" className="fill-white" stroke="#006398" strokeWidth="2" />
                    <circle cx="350" cy="110" r="5" fill="#0c9488" stroke="#ffffff" strokeWidth="2" />
                  </svg>

                  <div className="flex justify-between text-slate-500 text-[10px] font-semibold pt-1">
                    <span>Day 1 (7.5)</span>
                    <span>Day 4 (6.0)</span>
                    <span>Day 7 (4.8)</span>
                    <span>Day 11 (3.4)</span>
                    <span className="text-[#0c9488] font-bold">Today (2.8)</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between text-[#0c9488] text-xs font-semibold">
                <span className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" />
                  Zero nocturnal flare-ups in 96 hrs
                </span>
                <Link href="/patient/progress" className="text-[#006398] hover:underline font-bold">
                  Full Analytics
                </Link>
              </div>
            </div>
          </section>

          {/* CLINICAL APPOINTMENT & AUDIT TIMELINE */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* UPCOMING CLINICAL APPOINTMENT */}
            <div className="lg:col-span-6 bg-white border border-slate-200/80 p-6 rounded-2xl shadow-xs flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Clinical Care Team</span>
                    <h2 className="text-lg font-bold text-slate-900">Upcoming In-Clinic Session</h2>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-blue-50 text-[#006398] text-xs font-bold border border-blue-100">
                    In 3 Days
                  </span>
                </div>

                {/* Clinician Card */}
                <div className="p-4 bg-slate-50 rounded-xl flex items-center gap-4 border border-slate-200/60">
                  <div className="w-14 h-14 rounded-full bg-[#006398]/10 text-[#006398] font-extrabold text-base flex items-center justify-center border border-[#006398]/20 flex-shrink-0">
                    SJ
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-bold text-slate-900 text-base">Dr. Sarah Jenkins, PT, DPT</h3>
                      <ShieldCheck className="w-4 h-4 text-[#006398]" />
                    </div>
                    <p className="text-xs text-slate-500">Lead Orthopedic Physical Therapist • Apex Kinetic Center</p>
                    <span className="text-[11px] font-semibold text-[#006398] block mt-1">
                      Room 3B (Biomechanics Lab)
                    </span>
                  </div>
                </div>

                {/* Appointment Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Date & Time</span>
                    <span className="font-bold text-slate-900 text-xs mt-0.5 block">Sept 30, 2026 • 10:30 AM</span>
                    <span className="text-[11px] text-slate-500">45-minute clinical slot</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Session Purpose</span>
                    <span className="font-bold text-slate-900 text-xs mt-0.5 block">Biomechanical Gait Analysis</span>
                    <span className="text-[11px] text-slate-500">Force plate & ROM check</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-6">
                <Link
                  href="/patient/appointments"
                  className="flex-1 py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold text-center transition-colors"
                >
                  Reschedule
                </Link>
                <button
                  type="button"
                  className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-sm"
                >
                  <CalendarPlus className="w-4 h-4" />
                  <span>Add to Calendar</span>
                </button>
              </div>
            </div>

            {/* RECENT ACTIVITY TIMELINE */}
            <div className="lg:col-span-6 bg-white border border-slate-200/80 p-6 rounded-2xl shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Audit Trail</span>
                    <h2 className="text-lg font-bold text-slate-900">Recent Activity Timeline</h2>
                  </div>
                  <Link href="/patient/sessions" className="text-[#006398] text-xs font-bold hover:underline">
                    View History
                  </Link>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                    <div className="w-9 h-9 rounded-lg bg-teal-50 text-[#0c9488] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Dumbbell className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-slate-900 text-xs truncate">Knee Extension session completed</span>
                        <span className="text-[10px] text-slate-400 flex-shrink-0 font-medium">Today, 8:15 AM</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">Duration: 09:40 min • Completed 30/30 prescribed reps with optimal kinetic form.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                    <div className="w-9 h-9 rounded-lg bg-blue-50 text-[#006398] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-slate-900 text-xs truncate">Daily pain score logged</span>
                        <span className="text-[10px] text-slate-400 flex-shrink-0 font-medium">Yesterday, 9:20 PM</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">VAS rating submitted: 2.8 / 10 • &ldquo;Minor tightness at lateral knee capsule.&rdquo;</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                    <div className="w-9 h-9 rounded-lg bg-teal-50 text-[#0c9488] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Award className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-slate-900 text-xs truncate">Milestone certified by Clinician</span>
                        <span className="text-[10px] text-slate-400 flex-shrink-0 font-medium">Oct 10</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">Dr. Sarah Jenkins signed off on completion of &apos;Pain Reduction &amp; Baseline ROM&apos; stage.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
                  <span className="text-xs text-slate-600">Have questions about your routine?</span>
                  <Link href="/patient/appointments" className="inline-flex items-center gap-1 text-xs font-bold text-[#006398] hover:underline">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Message Care Team</span>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>

      {/* Mobile Navbar */}
      <MobileNavbar role="PATIENT" />
    </div>
  );
}
