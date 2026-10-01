'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Sidebar } from '@/components/Sidebar';
import { TopNavbar } from '@/components/TopNavbar';
import { MobileNavbar } from '@/components/MobileNavbar';
import { DashboardCard } from '@/components/DashboardCard';
import {
  Users,
  HeartPulse,
  ShieldCheck,
  Dumbbell,
  FileText,
  Activity,
  ChevronRight,
  Database,
  Sparkles,
  Plus,
  TrendingUp,
  UserPlus,
  BarChart3,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from 'recharts';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<any>(null);

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

    fetch('/api/admin/stats')
      .then((res) => {
        if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
          return res.json();
        }
        return null;
      })
      .then((data) => {
        if (data) setStats(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const chartData = [
    { month: 'May', patients: 12, sessions: 45 },
    { month: 'Jun', patients: 18, sessions: 68 },
    { month: 'Jul', patients: 24, sessions: 92 },
    { month: 'Aug', patients: 31, sessions: 124 },
    { month: 'Sep', patients: 42, sessions: 165 },
    { month: 'Oct', patients: 50, sessions: 198 },
  ];

  const roleDistribution = [
    { role: 'PATIENT', count: stats?.totalPatients || 12, fill: '#0d9488' },
    { role: 'THERAPIST', count: stats?.totalTherapists || 4, fill: '#3b82f6' },
    { role: 'ADMIN', count: 2, fill: '#8b5cf6' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-full border-4 border-purple-600 border-t-transparent animate-spin mx-auto" />
          <p className="text-xs font-semibold text-slate-600">Loading Clinical Admin System...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex text-slate-800">
      <Sidebar
        role="ADMIN"
        userName={user?.name || 'Clinical Admin System'}
        userEmail={user?.email || 'admin@rehab.com'}
      />

      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-8">
        <TopNavbar
          user={user || { name: 'Clinical Admin System', role: 'ADMIN' }}
          title="System Administration & Management"
          subtitle="Outpatient Physical Therapy Infrastructure"
        />

        <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          {/* Admin Header Hero */}
          <div className="bg-gradient-to-r from-purple-900 via-slate-900 to-teal-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full bg-white/20 text-white text-[11px] font-bold uppercase tracking-wider backdrop-blur-md inline-block">
                System Administration Terminal
              </span>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                RehabPulse Health Platform
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
                Comprehensive executive overview of platform users, therapists, patient rosters, global exercise protocols, and system health status.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-2xl border border-white/20 text-xs font-semibold backdrop-blur-md">
                <Database className="w-4 h-4 text-teal-400" />
                <span>MongoDB Online</span>
              </div>
            </div>
          </div>

          {/* Quick Action Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">
              Admin Quick Actions:
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href="/admin/users"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 text-xs font-bold transition-all border border-purple-200"
              >
                <UserPlus className="w-3.5 h-3.5" /> + Add User
              </Link>
              <Link
                href="/admin/patients"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-50 text-teal-700 hover:bg-teal-100 text-xs font-bold transition-all border border-teal-200"
              >
                <HeartPulse className="w-3.5 h-3.5" /> + Enroll Patient
              </Link>
              <Link
                href="/admin/therapists"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-bold transition-all border border-blue-200"
              >
                <ShieldCheck className="w-3.5 h-3.5" /> + Add Therapist
              </Link>
              <Link
                href="/admin/exercises"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-bold transition-all border border-emerald-200"
              >
                <Dumbbell className="w-3.5 h-3.5" /> + Add Exercise
              </Link>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <DashboardCard
              title="Total System Users"
              value={stats?.totalUsers || 3}
              subtitle="Registered platform accounts"
              badge="Active"
              badgeType="success"
              icon={Users}
              iconBg="bg-purple-50 text-purple-600"
            />

            <DashboardCard
              title="Total Patients"
              value={stats?.totalPatients || 1}
              subtitle="Active outpatient records"
              badge="Clinical"
              badgeType="info"
              icon={HeartPulse}
              iconBg="bg-teal-50 text-teal-600"
            />

            <DashboardCard
              title="Total Therapists"
              value={stats?.totalTherapists || 1}
              subtitle="Licensed physical therapists"
              badge="Verified"
              badgeType="success"
              icon={ShieldCheck}
              iconBg="bg-blue-50 text-blue-600"
            />

            <DashboardCard
              title="Active Rehab Plans"
              value={stats?.activePlans || 1}
              subtitle="Prescribed care protocols"
              badge="Enrolled"
              badgeType="info"
              icon={FileText}
              iconBg="bg-indigo-50 text-indigo-600"
            />

            <DashboardCard
              title="Global Exercise Library"
              value={stats?.totalExercises || 6}
              subtitle="Curated physical exercises"
              badge="Curated"
              badgeType="success"
              icon={Dumbbell}
              iconBg="bg-emerald-50 text-emerald-600"
            />

            <DashboardCard
              title="Total Exercise Sessions"
              value={stats?.totalSessions || 18}
              subtitle="Patient execution logs"
              badge="Recorded"
              badgeType="info"
              icon={Activity}
              iconBg="bg-amber-50 text-amber-600"
            />
          </div>

          {/* Analytics Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* 7 Cols: Patient Enrollment & Session Volume Trend */}
            <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-bold text-slate-900 text-base">Platform Activity & Session Growth</h2>
                  <p className="text-xs text-slate-500">6-month trend for patient registrations and executed sessions</p>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200 text-xs font-bold">
                  +24.8% Monthly Growth
                </span>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} />
                    <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                    <Tooltip />
                    <Area type="monotone" dataKey="sessions" name="Completed Sessions" stroke="#0d9488" fill="#ccfbf1" strokeWidth={3} />
                    <Area type="monotone" dataKey="patients" name="Enrolled Patients" stroke="#3b82f6" fill="#dbeafe" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* 4 Cols: User Role Breakdown */}
            <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div>
                <h2 className="font-bold text-slate-900 text-base">User Role Distribution</h2>
                <p className="text-xs text-slate-500">Account roles breakdown across platform</p>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={roleDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="role" tick={{ fontSize: 11, fill: '#64748b' }} />
                    <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                    <Tooltip />
                    <Bar dataKey="count" name="User Count" radius={[8, 8, 0, 0]} fill="#8b5cf6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Recent System Users Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="font-bold text-slate-900 text-base">Recent Registered Users</h2>
                <p className="text-xs text-slate-500">Latest account registrations in system database</p>
              </div>
              <Link href="/admin/users" className="text-xs font-bold text-purple-600 hover:text-purple-800 flex items-center gap-1">
                View Full User Directory <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase tracking-wider font-bold text-slate-500">
                  <tr>
                    <th className="px-4 py-3">User Name</th>
                    <th className="px-4 py-3">Email Address</th>
                    <th className="px-4 py-3">System Role</th>
                    <th className="px-4 py-3">Registration Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {stats?.recentUsers?.map((u: any) => (
                    <tr key={u._id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-bold text-slate-900">{u.name}</td>
                      <td className="px-4 py-3 text-slate-600">{u.email}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
                          u.role === 'ADMIN'
                            ? 'bg-purple-50 text-purple-700 border-purple-200'
                            : u.role === 'THERAPIST'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : 'bg-teal-50 text-teal-700 border-teal-200'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-500 font-mono">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'Recent'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      <MobileNavbar role="ADMIN" />
    </div>
  );
}
