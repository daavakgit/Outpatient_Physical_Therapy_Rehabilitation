'use client';

import React, { useEffect, useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { TopNavbar } from '@/components/TopNavbar';
import { MobileNavbar } from '@/components/MobileNavbar';
import { MilestoneTimeline } from '@/components/MilestoneTimeline';
import { Award, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function PatientMilestonesPage() {
  const [milestones, setMilestones] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/milestones')
      .then((res) => res.json())
      .then((d) => {
        if (d.milestones) setMilestones(d.milestones);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-glacier-bg flex">
      <Sidebar role="PATIENT" />

      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-8">
        <TopNavbar title="Recovery Milestones" subtitle="5 Step Physical Therapy Pathway" />

        <main className="max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          <div className="glacier-card p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg">Rehabilitation Milestone Journey</h3>
                <p className="text-xs text-slate-500">Milestone goals verified by your physical therapist</p>
              </div>
            </div>

            <MilestoneTimeline milestones={milestones} />
          </div>
        </main>
      </div>

      <MobileNavbar role="PATIENT" />
    </div>
  );
}
