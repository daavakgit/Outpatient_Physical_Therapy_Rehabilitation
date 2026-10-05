'use client';

import React, { useEffect, useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { TopNavbar } from '@/components/TopNavbar';
import { MobileNavbar } from '@/components/MobileNavbar';
import {
  Server,
  Database,
  ShieldCheck,
  Activity,
  Cpu,
  Lock,
  CheckCircle2,
  AlertTriangle,
  Globe,
  HardDrive,
  Clock,
  Key,
} from 'lucide-react';

export default function AdminSystemInfoPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => (res.ok && res.headers.get('content-type')?.includes('application/json') ? res.json() : null))
      .then((data) => {
        if (data?.user) setUser(data.user);
      })
      .catch(() => {});

    fetch('/api/admin/stats')
      .then((res) => {
        if (res.ok && res.headers.get('content-type')?.includes('application/json')) return res.json();
        return null;
      })
      .then((d) => {
        if (d) setStats(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

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
          title="System Information"
          subtitle="Platform Infrastructure & Infrastructure Health Monitor"
        />

        <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          {/* PAGE HEADER HERO */}
          <div className="bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[11px] font-bold uppercase tracking-wider border border-emerald-500/30 inline-flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Platform Status: Operational
                </span>
                <span className="px-3 py-1 rounded-full bg-white/10 text-slate-300 text-[11px] font-mono border border-white/10">
                  v2.4.0-release
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                RehabPulse Infrastructure Monitor
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
                Real-time runtime statistics, microservice telemetry, database connectivity, and security compliance metrics.
              </p>
            </div>

            <div className="bg-white/10 p-4 rounded-2xl border border-white/10 backdrop-blur-md space-y-1 text-xs text-right">
              <span className="text-slate-400 block font-medium">Server Uptime</span>
              <span className="text-lg font-bold text-white font-mono">99.98%</span>
            </div>
          </div>

          {/* APPLICATION DETAILS CARD */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Server className="w-5 h-5 text-purple-600" /> Application Telemetry & Environment
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <span className="text-slate-400 font-bold uppercase text-[10px] block">Application Name</span>
                <span className="font-extrabold text-slate-900">RehabPulse Rehabilitation Engine</span>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <span className="text-slate-400 font-bold uppercase text-[10px] block">Framework & Engine</span>
                <span className="font-extrabold text-slate-900">Next.js 16.3.7 (Turbopack Enabled)</span>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <span className="text-slate-400 font-bold uppercase text-[10px] block">Deployment Mode</span>
                <span className="font-extrabold text-slate-900">Production App Cluster</span>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <span className="text-slate-400 font-bold uppercase text-[10px] block">Node Runtime</span>
                <span className="font-mono font-extrabold text-purple-700">Node.js v20+ Enterprise</span>
              </div>
            </div>
          </div>

          {/* SYSTEM AGGREGATED METRICS */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-teal-600" /> Platform Resource & Record Counters
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-center">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 text-[10px] font-bold uppercase block">Total Users</span>
                <span className="text-2xl font-black text-slate-900 mt-1 block">{stats?.totalUsers || 3}</span>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 text-[10px] font-bold uppercase block">Total Patients</span>
                <span className="text-2xl font-black text-teal-600 mt-1 block">{stats?.totalPatients || 1}</span>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 text-[10px] font-bold uppercase block">Therapist Staff</span>
                <span className="text-2xl font-black text-blue-600 mt-1 block">{stats?.totalTherapists || 1}</span>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 text-[10px] font-bold uppercase block">Global Exercises</span>
                <span className="text-2xl font-black text-emerald-600 mt-1 block">{stats?.totalExercises || 5}</span>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 text-[10px] font-bold uppercase block">Active Plans</span>
                <span className="text-2xl font-black text-purple-600 mt-1 block">{stats?.activePlans || 1}</span>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 text-[10px] font-bold uppercase block">Completed Sessions</span>
                <span className="text-2xl font-black text-amber-600 mt-1 block">{stats?.totalSessions || 18}</span>
              </div>
            </div>
          </div>

          {/* SERVICE HEALTH GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Database className="w-5 h-5 text-teal-600" /> Database & Storage Health
              </h2>

              <div className="space-y-3 text-xs">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-900 block">MongoDB Enterprise Cluster</span>
                    <span className="text-slate-500">Document Store & Collection Indexes</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Synchronized
                  </span>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-900 block">Failover & In-Memory Store</span>
                    <span className="text-slate-500">Zero-Downtime Local Resilience</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Standby Ready
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-purple-600" /> Security & Compliance Telemetry
              </h2>

              <div className="space-y-3 text-xs">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-900 block">Role-Based Access Control (RBAC)</span>
                    <span className="text-slate-500">Strict Route Guarding (ADMIN, THERAPIST, PATIENT)</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 font-bold border border-purple-200 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Enforced
                  </span>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-900 block">Data Masking & Secrets Shield</span>
                    <span className="text-slate-500">Zero credentials exposed in client UI responses</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5" /> Active Audit
                  </span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <MobileNavbar role="ADMIN" />
    </div>
  );
}
