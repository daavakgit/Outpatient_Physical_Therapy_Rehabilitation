'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Activity, HeartPulse, Dumbbell, Calendar, Clock, BarChart3, User, Bell } from 'lucide-react';

interface MobileNavbarProps {
  role: 'PATIENT' | 'THERAPIST' | 'ADMIN';
}

export const MobileNavbar: React.FC<MobileNavbarProps> = ({ role }) => {
  const pathname = usePathname();

  const patientNav = [
    { name: 'Dashboard', href: '/patient/dashboard', icon: Activity },
    { name: 'Plan', href: '/patient/plan', icon: HeartPulse },
    { name: 'Exercises', href: '/patient/exercises', icon: Dumbbell },
    { name: 'Progress', href: '/patient/progress', icon: BarChart3 },
    { name: 'Profile', href: '/patient/profile', icon: User },
  ];

  const therapistNav = [
    { name: 'Dashboard', href: '/therapist/dashboard', icon: Activity },
    { name: 'Patients', href: '/therapist/patients', icon: HeartPulse },
    { name: 'Exercises', href: '/therapist/exercises', icon: Dumbbell },
    { name: 'Analytics', href: '/therapist/analytics', icon: BarChart3 },
    { name: 'Profile', href: '/therapist/profile', icon: User },
  ];

  const adminNav = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: Activity },
    { name: 'Users', href: '/admin/users', icon: User },
    { name: 'Patients', href: '/admin/patients', icon: HeartPulse },
    { name: 'Exercises', href: '/admin/exercises', icon: Dumbbell },
    { name: 'Profile', href: '/admin/profile', icon: User },
  ];

  const navItems = role === 'PATIENT' ? patientNav : role === 'THERAPIST' ? therapistNav : adminNav;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-40 px-2 py-1.5 shadow-lg">
      <div className="flex justify-around items-center">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center py-1 px-3 rounded-lg text-xs font-medium transition-all ${
                isActive ? 'text-brand-600 font-bold scale-105' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'text-brand-600' : 'text-slate-400'}`} />
              <span className="text-[10px]">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
