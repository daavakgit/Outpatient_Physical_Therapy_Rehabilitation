'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Play, Pause, CheckCircle2, Dumbbell, ShieldAlert, Award, Sparkles, Activity } from 'lucide-react';

interface SessionTimerProps {
  exercise: {
    _id: string;
    name: string;
    targetSets: number;
    targetReps: number;
    restDurationSeconds: number;
    instructions?: string[];
  };
  exerciseAssignmentId?: string;
  sessionId?: string;
}

export const SessionTimer: React.FC<SessionTimerProps> = ({
  exercise,
  exerciseAssignmentId,
  sessionId: initialSessionId,
}) => {
  const router = useRouter();
  const [sessionId, setSessionId] = useState<string | null>(initialSessionId || null);
  const [status, setStatus] = useState<'IDLE' | 'RUNNING' | 'PAUSED' | 'RESTING' | 'SUMMARY'>('IDLE');
  const [seconds, setSeconds] = useState<number>(0);
  const [pauseSeconds, setPauseSeconds] = useState<number>(0);

  const [currentSet, setCurrentSet] = useState<number>(1);
  const [completedSets, setCompletedSets] = useState<number>(0);
  const [completedReps, setCompletedReps] = useState<number>(0);

  const [restCountdown, setRestCountdown] = useState<number>(exercise.restDurationSeconds || 30);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Summary Feedback State
  const [painLevel, setPainLevel] = useState<number>(2);
  const [difficultyRating, setDifficultyRating] = useState<'Easy' | 'Moderate' | 'Hard'>('Moderate');
  const [notes, setNotes] = useState<string>('');
  const [isSaved, setIsSaved] = useState<boolean>(false);

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
            return exercise.restDurationSeconds || 30;
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
          exerciseAssignmentId,
          targetSets: exercise.targetSets,
          targetReps: exercise.targetReps,
        }),
      });
      const data = await res.json();
      if (data.session) {
        setSessionId(data.session._id);
        setStatus('RUNNING');
      }
    } catch (e) {
      console.error(e);
      setStatus('RUNNING');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Pause Session API Call
  const handlePause = async () => {
    if (!sessionId) {
      setStatus('PAUSED');
      return;
    }
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
    }).catch(() => {});
  };

  // Resume Session API Call
  const handleResume = async () => {
    if (!sessionId) {
      setStatus('RUNNING');
      return;
    }
    setStatus('RUNNING');
    await fetch('/api/sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'RESUME',
        sessionId,
        additionalPauseSeconds: pauseSeconds,
      }),
    }).catch(() => {});
  };

  // Complete a Set
  const handleCompleteSet = () => {
    const nextCompletedSets = completedSets + 1;
    const nextCompletedReps = completedReps + exercise.targetReps;
    setCompletedSets(nextCompletedSets);
    setCompletedReps(nextCompletedReps);

    if (nextCompletedSets >= exercise.targetSets) {
      setStatus('SUMMARY');
    } else {
      setCurrentSet(nextCompletedSets + 1);
      setRestCountdown(exercise.restDurationSeconds || 30);
      setStatus('RESTING');
    }
  };

  // End Session Early or Prompt Summary
  const triggerSummary = () => {
    setStatus('SUMMARY');
  };

  // Finish/End Session API Call with Feedback
  const handleFinalSaveSession = async () => {
    setIsSubmitting(true);
    try {
      if (sessionId) {
        await fetch('/api/sessions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'END',
            sessionId,
            completedSets,
            completedRepetitions: completedReps,
            notes,
            painLevel,
            difficulty: difficultyRating,
          }),
        });
      }
      setIsSaved(true);
      setTimeout(() => {
        router.push('/patient/dashboard');
      }, 1500);
    } catch (e) {
      console.error(e);
      router.push('/patient/dashboard');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const totalTargetReps = exercise.targetSets * exercise.targetReps;
  const completionPercentage = Math.round((completedSets / exercise.targetSets) * 100);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Session Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 text-center relative overflow-hidden shadow-2xl">
        {/* Status Indicator Bar */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-6 bg-slate-800 text-teal-400 border border-slate-700">
          <span
            className={`w-2 h-2 rounded-full ${
              status === 'RUNNING'
                ? 'bg-teal-400 animate-ping'
                : status === 'PAUSED'
                ? 'bg-amber-400'
                : status === 'RESTING'
                ? 'bg-purple-400 animate-bounce'
                : status === 'SUMMARY'
                ? 'bg-teal-400'
                : 'bg-slate-500'
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
              : 'Session Completion Feedback'}
          </span>
        </div>

        {/* Large Timer Display */}
        {status !== 'SUMMARY' && (
          <>
            <div className="my-4">
              <div className="text-6xl md:text-7xl font-black text-white tracking-tight font-mono">
                {formatTime(seconds)}
              </div>
              <p className="text-xs text-slate-400 mt-2 font-medium">Active Session Duration</p>
            </div>

            {/* Set & Rep Progress Badges */}
            <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto my-6 p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
              <div>
                <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">Set Progress</span>
                <div className="text-2xl font-extrabold text-teal-400 mt-0.5">
                  {completedSets} <span className="text-sm font-normal text-slate-500">/ {exercise.targetSets}</span>
                </div>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">Completed Reps</span>
                <div className="text-2xl font-extrabold text-[#0c9488] mt-0.5">
                  {completedReps} <span className="text-sm font-normal text-slate-500">/ {totalTargetReps}</span>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
          {status === 'IDLE' && (
            <button
              onClick={handleStart}
              disabled={isSubmitting}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-base shadow-lg transition-all flex items-center justify-center gap-3"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>Begin Guided Session</span>
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
                className="px-5 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-amber-400 font-semibold text-sm transition-all flex items-center justify-center gap-2 border border-slate-700"
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
                className="px-8 py-3.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>Resume Session</span>
              </button>

              <button
                onClick={triggerSummary}
                className="px-6 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm transition-all border border-slate-700"
              >
                End & Save Session
              </button>
            </>
          )}

          {status === 'RESTING' && (
            <div className="w-full p-4 bg-teal-950/80 border border-teal-800 rounded-2xl text-teal-200 font-semibold text-sm space-y-2">
              <p>Rest timer active: <strong className="text-xl text-teal-400">{restCountdown}s</strong></p>
              <button
                onClick={() => setStatus('RUNNING')}
                className="text-xs font-bold text-teal-400 underline hover:text-teal-300"
              >
                Skip Rest & Start Next Set
              </button>
            </div>
          )}

          {/* SUMMARY MODAL / SCREEN */}
          {status === 'SUMMARY' && (
            <div className="w-full space-y-6 text-left animate-in fade-in">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center mx-auto border border-teal-500/40">
                  <Award className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-extrabold text-white">Session Completed Summary</h3>
                <p className="text-xs text-slate-400">Review metrics and provide post-exercise clinical feedback</p>
              </div>

              {/* STATS METRICS GRID */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Duration</span>
                  <span className="font-extrabold text-white text-base block mt-0.5">{formatTime(seconds)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Sets Done</span>
                  <span className="font-extrabold text-teal-400 text-base block mt-0.5">{completedSets} / {exercise.targetSets}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Reps Done</span>
                  <span className="font-extrabold text-teal-400 text-base block mt-0.5">{completedReps} / {totalTargetReps}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Completion</span>
                  <span className="font-extrabold text-purple-400 text-base block mt-0.5">{completionPercentage}%</span>
                </div>
              </div>

              {/* PAIN SCORE RATING (VAS 0 - 10) */}
              <div className="space-y-2 p-4 bg-slate-950 rounded-2xl border border-slate-800">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-bold text-white flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-red-400" />
                    <span>Post-Exercise Pain Rating (VAS Scale 0–10)</span>
                  </label>
                  <span className="font-black text-sm text-red-400">{painLevel} / 10</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="0.5"
                  value={painLevel}
                  onChange={(e) => setPainLevel(Number(e.target.value))}
                  className="w-full accent-red-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-semibold">
                  <span>0 - No Pain</span>
                  <span>5 - Moderate</span>
                  <span>10 - Severe Pain</span>
                </div>
              </div>

              {/* PERCEIVED DIFFICULTY RATING */}
              <div className="space-y-2 p-4 bg-slate-950 rounded-2xl border border-slate-800">
                <label className="font-bold text-white text-xs block">Perceived Exercise Difficulty</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Easy', 'Moderate', 'Hard'] as const).map((diff) => (
                    <button
                      key={diff}
                      type="button"
                      onClick={() => setDifficultyRating(diff)}
                      className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                        difficultyRating === diff
                          ? 'bg-teal-600 text-white border-teal-500 shadow-md'
                          : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>

              {/* PATIENT NOTES */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Session Observations / Therapist Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Record any joint tightness, fatigue, or sensations during exercise..."
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:ring-2 focus:ring-teal-500 outline-none"
                  rows={2}
                />
              </div>

              {isSaved ? (
                <div className="p-4 bg-teal-500/20 border border-teal-500/40 rounded-2xl text-center text-teal-300 font-bold text-xs flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-400" />
                  <span>Session Audit Saved Successfully! Redirecting to Dashboard...</span>
                </div>
              ) : (
                <button
                  onClick={handleFinalSaveSession}
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-lg transition-all"
                >
                  {isSubmitting ? 'Saving Session Record...' : 'Confirm & Save Session Record'}
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Step-by-Step Instructions */}
      {exercise.instructions && exercise.instructions.length > 0 && status !== 'SUMMARY' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-left space-y-3">
          <h4 className="font-bold text-white text-sm flex items-center gap-2">
            <Dumbbell className="w-4 h-4 text-teal-400" />
            <span>Clinical Execution Instructions</span>
          </h4>
          <ol className="space-y-2 list-decimal list-inside text-xs text-slate-300 leading-relaxed">
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
