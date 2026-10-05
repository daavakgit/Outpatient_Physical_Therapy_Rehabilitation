'use client';

import React, { useState, useEffect } from 'react';
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
  const [currentUser, setCurrentUser] = useState<{ name?: string; email?: string } | null>(null);

  useEffect(() => {
    if (userName || userEmail) {
      setCurrentUser({ name: userName, email: userEmail });
    } else {
      fetch('/api/auth/me')
        .then((res) => {
          if (res.ok && res.headers.get('content-type')?.includes('application/json')) return res.json();
          return null;
        })
        .then((data) => {
          if (data?.user) {
            setCurrentUser({
              name: data.user.name || data.user.fullName,
              email: data.user.email,
            });
          }
        })
        .catch(() => {});
    }
  }, [userName, userEmail]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  };

  const patientLinks = [
    { name: 'Dashboard', href: '/patient/dashboard', icon: Activity },
    { name: 'My Rehab Plan', href: '/patient/plan', icon: HeartPulse },
    { name: 'My Exercises', href: '/patient/exercises', icon: Dumbbell },
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
    { name: 'System Overview', href: '/admin/dashboard', icon: Activity },
    { name: 'User Management', href: '/admin/users', icon: Users },
    { name: 'Therapist Directory', href: '/admin/therapists', icon: ShieldCheck },
    { name: 'Patient Directory', href: '/admin/patients', icon: Users },
    { name: 'Exercise Bank', href: '/admin/exercises', icon: Dumbbell },
    { name: 'System Logs', href: '/admin/system', icon: BarChart3 },
    { name: 'Notifications', href: '/admin/notifications', icon: Bell },
    { name: 'Profile', href: '/admin/profile', icon: User },
  ];

  const navLinks = role === 'ADMIN' ? adminLinks : role === 'THERAPIST' ? therapistLinks : patientLinks;

  const displayName = userName || currentUser?.name || (role === 'ADMIN' ? 'Clinical Admin' : role === 'THERAPIST' ? 'Dr. Sarah Jenkins' : 'Patient');
  const displayEmail = userEmail || currentUser?.email || (role === 'ADMIN' ? 'admin@rehab.com' : role === 'THERAPIST' ? 'sarah.jenkins@rehabtrack.com' : '');

  return (
    <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex md:flex-col justify-between flex-shrink-0 min-h-screen sticky top-0 h-screen overflow-y-auto">
      {/* Brand Header */}
      <div>
        <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-100">
          <div className="w-8 h-8 rounded-xl bg-[#006398] text-white flex items-center justify-center font-black text-sm shadow-xs">
            <HeartPulse className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-slate-900 text-sm tracking-tight block leading-none">RehabPulse</span>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mt-0.5">
              {role} PORTAL
            </span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4 space-y-1">
          {navLinks.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/patient/dashboard' && item.href !== '/therapist/dashboard' && item.href !== '/admin/dashboard' && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-teal-50 text-teal-800 border border-teal-200 shadow-xs font-bold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-teal-600' : 'text-slate-400'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Footer Profile */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full bg-teal-100 border border-teal-200 flex items-center justify-center font-bold text-teal-800 text-sm overflow-hidden flex-shrink-0">
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
            ) : (
              displayName[0].toUpperCase()
            )}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-bold text-slate-900 truncate">
              {displayName}
            </p>
            {displayEmail && (
              <p className="text-xs text-slate-500 truncate">
                {displayEmail}
              </p>
            )}
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-red-600 hover:bg-red-50 hover:border-red-200 text-xs font-bold transition-all shadow-xs"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
