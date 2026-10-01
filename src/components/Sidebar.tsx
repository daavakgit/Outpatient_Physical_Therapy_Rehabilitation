'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Activity,
  HeartPulse,
  Calendar,
  Clock,
  Award,
  Bell,
  User,
  LogOut,
  Users,
  FileText,
  Dumbbell,
  ShieldCheck,
  BarChart3,
  Sparkles,
} from 'lucide-react';

interface SidebarProps {
  role: 'PATIENT' | 'THERAPIST' | 'ADMIN';
  userName?: string;
  userEmail?: string;
  avatarUrl?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ role, userName, userEmail, avatarUrl }) => {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  };

  const patientLinks = [
    { name: 'Dashboard', href: '/patient/dashboard', icon: Activity },
    { name: 'My Rehab Plan', href: '/patient/plan', icon: HeartPulse },
    { name: 'Exercise Library', href: '/patient/exercises', icon: Dumbbell },
    { name: 'Session History', href: '/patient/sessions', icon: Clock },
    { name: 'Progress Analytics', href: '/patient/progress', icon: BarChart3 },
    { name: 'Milestones', href: '/patient/milestones', icon: Award },
    { name: 'Appointments', href: '/patient/appointments', icon: Calendar },
    { name: 'Notifications', href: '/patient/notifications', icon: Bell },
    { name: 'Profile', href: '/patient/profile', icon: User },
  ];

  const therapistLinks = [
    { name: 'Dashboard', href: '/therapist/dashboard', icon: Activity },
    { name: 'Patient Roster', href: '/therapist/patients', icon: Users },
    { name: 'Rehab Plans', href: '/therapist/plans', icon: FileText },
    { name: 'Exercise Management', href: '/therapist/exercises', icon: Dumbbell },
    { name: 'Live Session Monitor', href: '/therapist/live-monitor', icon: Clock },
    { name: 'Progress Analytics', href: '/therapist/analytics', icon: BarChart3 },
    { name: 'Milestone Manager', href: '/therapist/milestones', icon: Award },
    { name: 'Appointments', href: '/therapist/appointments', icon: Calendar },
    { name: 'Notifications', href: '/therapist/notifications', icon: Bell },
    { name: 'Profile', href: '/therapist/profile', icon: User },
  ];

  const adminLinks = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: Activity },
    { name: 'User Directory', href: '/admin/users', icon: Users },
    { name: 'Patient Directory', href: '/admin/patients', icon: HeartPulse },
    { name: 'Therapist Directory', href: '/admin/therapists', icon: ShieldCheck },
    { name: 'Global Exercises', href: '/admin/exercises', icon: Dumbbell },
    { name: 'System Info', href: '/admin/system', icon: Sparkles },
    { name: 'Notifications', href: '/admin/notifications', icon: Bell },
    { name: 'Profile', href: '/admin/profile', icon: User },
  ];

  const links = role === 'PATIENT' ? patientLinks : role === 'THERAPIST' ? therapistLinks : adminLinks;

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-glacier-border h-screen sticky top-0 z-30 shadow-sm">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-100 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-500 flex items-center justify-center text-white shadow-md">
          <HeartPulse className="w-6 h-6" />
        </div>
        <div>
          <h1 className="font-bold text-brand-800 text-base leading-tight">RehabPulse</h1>
          <span className="text-[11px] text-teal-600 font-semibold uppercase tracking-wider">
            {role} Portal
          </span>
        </div>
      </div>



      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {links.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-brand-50 text-brand-600 border border-brand-100 shadow-sm font-semibold'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-brand-800'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-brand-600' : 'text-slate-400'}`} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Footer Profile */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full bg-brand-100 border border-brand-200 flex items-center justify-center font-bold text-brand-600 text-sm overflow-hidden">
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatarUrl} alt={userName} className="w-full h-full object-cover" />
            ) : (
              (userName || 'User')[0]
            )}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-semibold text-slate-800 truncate">{userName || 'Alex Morgan'}</p>
            <p className="text-xs text-slate-500 truncate">{userEmail || 'alex@rehab.com'}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-red-600 hover:bg-red-50 hover:border-red-200 text-xs font-semibold transition-all shadow-sm"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
