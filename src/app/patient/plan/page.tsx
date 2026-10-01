'use client';

import React, { useEffect, useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { TopNavbar } from '@/components/TopNavbar';
import { MobileNavbar } from '@/components/MobileNavbar';
import { ExerciseCard } from '@/components/ExerciseCard';
import { HeartPulse, Calendar, Clock, Dumbbell, Award, FileText } from 'lucide-react';

export default function PatientPlanPage() {
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

  const plan = data?.plan;
  const patient = data?.patient;

  return (
    <div className="min-h-screen bg-glacier-bg flex">
      <Sidebar role="PATIENT" userName={patient?.fullName} />

      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-8">
        <TopNavbar title="My Rehabilitation Plan" subtitle="Prescribed Physical Therapy Protocol" />

        <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
          {/* Plan Overview Card */}
          <div className="glacier-card p-6 md:p-8 bg-gradient-to-r from-white to-brand-50/30">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6 mb-6">
              <div>
                <span className="px-3 py-1 rounded-full bg-teal-50 text-teal-700 border border-teal-200 text-xs font-bold uppercase tracking-wider">
                  {plan?.currentPhase || 'Phase 2: Mobility Improvement'}
                </span>
                <h2 className="text-2xl font-bold text-slate-900 mt-2">
                  {plan?.title || 'ACL Reconstruction Rehabilitation Protocol'}
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Assigned by {patient?.primaryTherapistId?.fullName || 'Dr. Sarah Jenkins, DPT'}
                </p>
              </div>

              <div className="flex items-center gap-4 text-xs font-medium text-slate-600 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Duration</span>
                  <span className="font-extrabold text-slate-900 text-base">{plan?.expectedDurationWeeks || 8} Weeks</span>
                </div>
                <div className="w-px h-8 bg-slate-200" />
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Completion</span>
                  <span className="font-extrabold text-brand-600 text-base">{plan?.overallCompletionPercentage || 62}%</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Dumbbell className="w-5 h-5 text-brand-600" />
                <span>Prescribed Exercises</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {plan?.exercises?.map((ex: any, idx: number) => (
                  <ExerciseCard
                    key={ex.exerciseId || idx}
                    exercise={{
                      _id: ex.exerciseId,
                      name: ex.exerciseName,
                      category: idx % 2 === 0 ? 'Mobility' : 'Strength',
                      difficulty: 'Beginner',
                      targetArea: 'Knee Joint',
                      recommendedSets: ex.targetSets,
                      recommendedReps: ex.targetReps,
                      restDurationSeconds: 45,
                      description: ex.notes || 'Targeted functional movement for knee stability.',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>

      <MobileNavbar role="PATIENT" />
    </div>
  );
}
