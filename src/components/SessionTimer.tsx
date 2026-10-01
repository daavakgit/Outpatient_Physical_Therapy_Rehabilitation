'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Play, Pause, Square, CheckCircle2, RotateCcw, Dumbbell, Clock, AlertCircle } from 'lucide-react';

interface SessionTimerProps {
  exercise: {
    _id: string;
    name: string;
    targetSets: number;
    targetReps: number;
    restDurationSeconds: number;
    instructions?: string[];
  };
  sessionId?: string;
}

export const SessionTimer: React.FC<SessionTimerProps> = ({ exercise, sessionId: initialSessionId }) => {
  const router = useRouter();
  const [sessionId, setSessionId] = useState<string | null>(initialSessionId || null);
  const [status, setStatus] = useState<'IDLE' | 'RUNNING' | 'PAUSED' | 'RESTING' | 'COMPLETED'>('IDLE');
  const [seconds, setSeconds] = useState<number>(0);
  const [pauseSeconds, setPauseSeconds] = useState<number>(0);

  const [currentSet, setCurrentSet] = useState<number>(1);
  const [completedSets, setCompletedSets] = useState<number>(0);
  const [completedReps, setCompletedReps] = useState<number>(0);

  const [restCountdown, setRestCountdown] = useState<number>(exercise.restDurationSeconds);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [notes, setNotes] = useState<string>('');

  // Main Timer Interval
  useEffect(() => {
    let interval: any = null;
    if (status === 'RUNNING') {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else if (status === 'PAUSED') {
      interval = setInterval(() => {
        setPauseSeconds((prev) => prev + 1);
      }, 1000);
    } else if (status === 'RESTING') {
      interval = setInterval(() => {
        setRestCountdown((prev) => {
          if (prev <= 1) {
            setStatus('RUNNING');
            return exercise.restDurationSeconds;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [status, exercise.restDurationSeconds]);

  // Start Session API Call
  const handleStart = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'START',
          exerciseId: exercise._id,
        }),
      });
      const data = await res.json();
      if (data.session) {
        setSessionId(data.session._id);
        setStatus('RUNNING');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Pause Session API Call
  const handlePause = async () => {
    if (!sessionId) return;
    setStatus('PAUSED');
    await fetch('/api/sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'PAUSE',
        sessionId,
        completedSets,
        completedRepetitions: completedReps,
      }),
    });
  };

  // Resume Session API Call
  const handleResume = async () => {
    if (!sessionId) return;
    setStatus('RUNNING');
    await fetch('/api/sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'RESUME',
        sessionId,
        additionalPauseSeconds: pauseSeconds,
      }),
    });
  };

  // Complete a Set
  const handleCompleteSet = () => {
    const nextCompletedSets = completedSets + 1;
    const nextCompletedReps = completedReps + exercise.targetReps;
    setCompletedSets(nextCompletedSets);
    setCompletedReps(nextCompletedReps);

    if (nextCompletedSets >= exercise.targetSets) {
      handleFinishSession(nextCompletedSets, nextCompletedReps);
    } else {
      setCurrentSet(nextCompletedSets + 1);
      setRestCountdown(exercise.restDurationSeconds);
      setStatus('RESTING');
    }
  };

  // Finish/End Session API Call
  const handleFinishSession = async (finalSets = completedSets, finalReps = completedReps) => {
    setIsSubmitting(true);
    try {
      if (sessionId) {
        await fetch('/api/sessions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'END',
            sessionId,
            completedSets: finalSets,
            completedRepetitions: finalReps,
            notes,
          }),
        });
      }
      setStatus('COMPLETED');
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Session Container */}
      <div className="glacier-card p-6 md:p-8 text-center relative overflow-hidden border-2 border-brand-100 shadow-xl">
        {/* Status Indicator Bar */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-6 bg-brand-50 text-brand-700 border border-brand-200">
          <span
            className={`w-2 h-2 rounded-full ${
              status === 'RUNNING'
                ? 'bg-emerald-500 animate-ping'
                : status === 'PAUSED'
                ? 'bg-amber-500'
                : status === 'RESTING'
                ? 'bg-purple-500 animate-bounce'
                : status === 'COMPLETED'
                ? 'bg-teal-500'
                : 'bg-slate-400'
            }`}
          />
          <span>
            {status === 'IDLE'
              ? 'Ready to Start'
              : status === 'RUNNING'
              ? 'Session In Progress'
              : status === 'PAUSED'
              ? 'Session Paused'
              : status === 'RESTING'
              ? `Rest Period (${restCountdown}s)`
              : 'Session Completed!'}
          </span>
        </div>

        {/* Large Timer Display */}
        <div className="my-4">
          <div className="text-6xl md:text-7xl font-extrabold text-slate-900 tracking-tight font-mono">
            {formatTime(seconds)}
          </div>
          <p className="text-xs text-slate-500 mt-2 font-medium">Active Session Duration</p>
        </div>

        {/* Set & Rep Progress Badges */}
        <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto my-6 p-4 rounded-2xl bg-slate-50 border border-slate-200">
          <div>
            <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider block">Set Progress</span>
            <div className="text-2xl font-extrabold text-brand-700 mt-0.5">
              {completedSets} <span className="text-sm font-normal text-slate-400">/ {exercise.targetSets}</span>
            </div>
          </div>
          <div>
            <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider block">Completed Reps</span>
            <div className="text-2xl font-extrabold text-teal-700 mt-0.5">
              {completedReps}{' '}
              <span className="text-sm font-normal text-slate-400">/ {exercise.targetSets * exercise.targetReps}</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
          {status === 'IDLE' && (
            <button
              onClick={handleStart}
              disabled={isSubmitting}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-base shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>Begin Session</span>
            </button>
          )}

          {status === 'RUNNING' && (
            <>
              <button
                onClick={handleCompleteSet}
                className="flex-1 max-w-xs px-6 py-3.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>Log Set {currentSet} Completed</span>
              </button>

              <button
                onClick={handlePause}
                className="px-5 py-3.5 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-300 font-semibold text-sm transition-all flex items-center justify-center gap-2"
              >
                <Pause className="w-5 h-5" />
                <span>Pause</span>
              </button>
            </>
          )}

          {status === 'PAUSED' && (
            <>
              <button
                onClick={handleResume}
                className="px-8 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>Resume Session</span>
              </button>

              <button
                onClick={() => handleFinishSession()}
                className="px-6 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition-all"
              >
                End Session Early
              </button>
            </>
          )}

          {status === 'RESTING' && (
            <div className="w-full p-4 bg-purple-50 border border-purple-200 rounded-2xl text-purple-900 font-semibold text-sm">
              Take a breather! Rest timer counting down: <strong className="text-lg">{restCountdown}s</strong>
              <button
                onClick={() => setStatus('RUNNING')}
                className="block mx-auto mt-2 text-xs font-bold text-purple-700 underline"
              >
                Skip Rest & Continue
              </button>
            </div>
          )}

          {status === 'COMPLETED' && (
            <div className="w-full space-y-4 animate-in fade-in">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
                <h3 className="font-bold text-lg">Great Job! Exercise Session Recorded</h3>
                <p className="text-xs text-emerald-700 mt-1">
                  Completed {completedSets} sets ({completedReps} repetitions) in {formatTime(seconds)}.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 text-left mb-1">
                  Therapist Feedback / Self Notes (Optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="How did this set feel? Any tightness or pain?"
                  className="w-full p-3 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-brand-500 outline-none"
                  rows={2}
                />
              </div>

              <button
                onClick={() => router.push('/patient/dashboard')}
                className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md"
              >
                Return to Patient Dashboard
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Exercise Instructions Accordion */}
      {exercise.instructions && exercise.instructions.length > 0 && (
        <div className="glacier-card p-6">
          <h4 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-2">
            <Dumbbell className="w-4 h-4 text-brand-600" />
            <span>Step-by-Step Instructions</span>
          </h4>
          <ol className="space-y-2 list-decimal list-inside text-xs text-slate-600 leading-relaxed">
            {exercise.instructions.map((step, idx) => (
              <li key={idx} className="pl-1">
                {step}
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
};
