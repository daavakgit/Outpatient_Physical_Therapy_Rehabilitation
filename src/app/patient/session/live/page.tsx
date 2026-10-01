'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { SessionTimer } from '@/components/SessionTimer';
import { HeartPulse, ArrowLeft, ShieldAlert } from 'lucide-react';

export const dynamic = 'force-dynamic';

function LiveSessionContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const exerciseId = searchParams.get('exerciseId') || '67f1a8c9e4b0123456789012';

  const [exercise, setExercise] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch(`/api/exercises/${exerciseId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.exercise) {
          setExercise(data.exercise);
        } else {
          // Default fallback exercise if not found
          setExercise({
            _id: exerciseId,
            name: 'Quad Sets with Towel Roll',
            targetSets: 3,
            targetReps: 10,
            restDurationSeconds: 45,
            instructions: [
              'Sit upright on a flat mat with your left leg extended straight.',
              'Place a small rolled towel beneath your knee joint.',
              'Tighten the thigh muscle to press the knee into the towel.',
              'Hold contraction for 5 seconds, then relax slowly.',
            ],
          });
        }
        setLoading(false);
      })
      .catch(() => {
        setExercise({
          _id: exerciseId,
          name: 'Quad Sets with Towel Roll',
          targetSets: 3,
          targetReps: 10,
          restDurationSeconds: 45,
          instructions: [
            'Sit upright on a flat mat with your left leg extended straight.',
            'Place a small rolled towel beneath your knee joint.',
            'Tighten the thigh muscle to press the knee into the towel.',
            'Hold contraction for 5 seconds, then relax slowly.',
          ],
        });
        setLoading(false);
      });
  }, [exerciseId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-6">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-full border-4 border-teal-400 border-t-transparent animate-spin mx-auto" />
          <p className="text-xs font-semibold">Initializing Distraction-Free Session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-4 sm:p-6 md:p-8">
      {/* Top Header */}
      <header className="max-w-4xl w-full mx-auto flex items-center justify-between py-2 border-b border-slate-800 pb-4">
        <button
          onClick={() => router.push('/patient/dashboard')}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white text-xs font-semibold transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit Session</span>
        </button>

        <div className="flex items-center gap-2 text-brand-400 font-bold text-sm">
          <HeartPulse className="w-5 h-5 text-teal-400" />
          <span>RehabPulse Live Session</span>
        </div>
      </header>

      {/* Main Live Timer Box */}
      <main className="max-w-4xl w-full mx-auto my-auto py-8">
        <div className="text-center mb-6">
          <span className="text-xs font-bold text-teal-400 uppercase tracking-widest bg-teal-950/80 border border-teal-800/80 px-3 py-1 rounded-full">
            Guided Clinical Exercise
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">{exercise.name}</h1>
          <p className="text-xs text-slate-400 mt-1">
            Target: <strong>{exercise.targetSets || 3} sets</strong> of <strong>{exercise.targetReps || 10} repetitions</strong>
          </p>
        </div>

        <SessionTimer
          exercise={{
            _id: exercise._id,
            name: exercise.name,
            targetSets: exercise.recommendedSets || exercise.targetSets || 3,
            targetReps: exercise.recommendedReps || exercise.targetReps || 10,
            restDurationSeconds: exercise.restDurationSeconds || 45,
            instructions: exercise.instructions,
          }}
        />
      </main>

      {/* Safety Notice Footer */}
      <footer className="max-w-4xl w-full mx-auto text-center pt-4 border-t border-slate-900">
        <div className="inline-flex items-center gap-2 text-[11px] text-slate-500 bg-slate-900/60 px-4 py-1.5 rounded-full border border-slate-800">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
          <span>If you experience sudden severe joint pain or dizziness, stop immediately and contact your physical therapist.</span>
        </div>
      </footer>
    </div>
  );
}

export default function LiveSessionPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-6">
          <div className="w-12 h-12 rounded-full border-4 border-teal-400 border-t-transparent animate-spin" />
        </div>
      }
    >
      <LiveSessionContent />
    </Suspense>
  );
}
