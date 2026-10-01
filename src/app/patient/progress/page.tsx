'use client';

import React, { useEffect, useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { TopNavbar } from '@/components/TopNavbar';
import { MobileNavbar } from '@/components/MobileNavbar';
import { ProgressChart } from '@/components/ProgressChart';
import { BarChart3, TrendingUp, HeartPulse, Activity } from 'lucide-react';

export default function PatientProgressPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/patients/dashboard')
      .then((res) => res.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-glacier-bg flex">
      <Sidebar role="PATIENT" />

      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-8">
        <TopNavbar title="Progress Analytics & Recovery Trends" subtitle="Clinical ROM and Adherence Logging" />

        <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          <div className="glacier-card p-6">
            <h3 className="font-bold text-slate-900 text-lg mb-2 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-brand-600" />
              <span>Weekly Recovery Performance</span>
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Track joint Range of Motion (degrees), daily pain level scale, and exercise plan adherence.
            </p>

            <ProgressChart data={data?.recentLogs || []} />
          </div>
        </main>
      </div>

      <MobileNavbar role="PATIENT" />
    </div>
  );
}
