'use client';

import React, { useEffect, useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { TopNavbar } from '@/components/TopNavbar';
import { MobileNavbar } from '@/components/MobileNavbar';
import { User, Mail, Phone, HeartPulse, ShieldCheck } from 'lucide-react';

export default function PatientProfilePage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((d) => {
        if (d.user) setUser(d.user);
      });
  }, []);

  return (
    <div className="min-h-screen bg-glacier-bg flex">
      <Sidebar role="PATIENT" userName={user?.name} />

      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-8">
        <TopNavbar title="My Profile" subtitle="Account Settings & Clinical Info" />

        <main className="max-w-3xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          <div className="glacier-card p-6 md:p-8 space-y-6">
            <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
              <div className="w-16 h-16 rounded-full bg-brand-100 text-brand-700 text-2xl font-bold flex items-center justify-center border-2 border-brand-200">
                {user?.name ? user.name[0] : 'A'}
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">{user?.name || 'Alex Morgan'}</h2>
                <span className="text-xs text-teal-600 font-semibold uppercase tracking-wider">
                  Patient Account
                </span>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 font-bold uppercase block text-[10px] mb-1">Email Address</span>
                  <span className="font-semibold text-slate-800">{user?.email || 'alex.morgan@rehab.com'}</span>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 font-bold uppercase block text-[10px] mb-1">Role</span>
                  <span className="font-semibold text-brand-700">PATIENT</span>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 font-bold uppercase block text-[10px] mb-1">Clinical Diagnosis</span>
                <span className="font-semibold text-slate-800">Post-Op Left Knee ACL Reconstruction</span>
              </div>
            </div>
          </div>
        </main>
      </div>

      <MobileNavbar role="PATIENT" />
    </div>
  );
}
