'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Sidebar } from '@/components/Sidebar';
import { TopNavbar } from '@/components/TopNavbar';
import { MobileNavbar } from '@/components/MobileNavbar';
import {
  Clock,
  CheckCircle2,
  Calendar,
  Activity,
  Dumbbell,
  Play,
  Filter,
  Search,
  ChevronRight,
  Sparkles,
  AlertCircle,
} from 'lucide-react';

export default function PatientSessionsPage() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    fetch('/api/sessions')
      .then((res) => {
        if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
          return res.json();
        }
        return null;
      })
      .then((d) => {
        if (d?.sessions && Array.isArray(d.sessions)) {
          setSessions(d.sessions);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredSessions = sessions.filter((s) => {
    const name = s.exerciseName || s.exerciseId?.name || 'Rehabilitation Exercise';
    const matchesSearch = name.toLowerCase().includes(search.toLowerCase());
    if (statusFilter === 'ALL') return matchesSearch;
    return matchesSearch && s.status === statusFilter;
  });

  return (
    <div className="min-h-screen bg-slate-50 flex text-slate-800">
      <Sidebar role="PATIENT" />

      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-8">
        <TopNavbar
          title="Session History"
          subtitle="Complete Log of Performed Physical Therapy Sessions"
        />

        <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          {/* HEADER BANNER */}
          <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <span className="px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 font-bold text-xs uppercase tracking-wider border border-teal-500/30">
                Exercise Telemetry
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-white">Your Recovery Session Logs</h1>
              <p className="text-xs text-slate-300 max-w-xl">
                Review your completed repetitions, exercise durations, pain feedback ratings, and clinical notes recorded during live sessions.
              </p>
            </div>

            <Link
              href="/patient/exercises"
              className="px-5 py-3 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-extrabold transition-all shadow-lg hover:shadow-teal-500/25 flex items-center gap-2 flex-shrink-0"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Start New Exercise Session</span>
            </Link>
          </div>

          {/* SEARCH & FILTERS */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search session by exercise name..."
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-500 outline-none"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
              <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" /> Filter Status:
              </span>
              {['ALL', 'COMPLETED', 'STARTED', 'PAUSED', 'PARTIALLY_COMPLETED'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                    statusFilter === st
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {st.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* SESSIONS CONTENT */}
          {loading ? (
            <div className="text-center py-16 space-y-3">
              <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-slate-500 font-semibold">Loading your session history...</p>
            </div>
          ) : filteredSessions.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-4 shadow-xs">
              <Clock className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="font-extrabold text-slate-800 text-base">No Completed Sessions Recorded</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                You haven&apos;t completed any live exercise sessions yet or no sessions match your search filter.
              </p>
              <Link
                href="/patient/exercises"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition-all shadow-xs"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Go to Prescribed Exercises</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredSessions.map((s) => {
                const exName = s.exerciseName || s.exerciseId?.name || 'Rehabilitation Exercise';
                const dateStr = s.startTime ? new Date(s.startTime).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                }) : 'Recently Recorded';

                const durationMinutes = s.duration ? Math.ceil(s.duration / 60) : 5;

                return (
                  <div
                    key={s._id}
                    className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-100 text-teal-600 flex items-center justify-center flex-shrink-0">
                        <Dumbbell className="w-6 h-6" />
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold text-slate-900 text-base">{exName}</h3>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                              s.status === 'COMPLETED'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                : s.status === 'PAUSED'
                                ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                : 'bg-blue-100 text-blue-800 border border-blue-200'
                            }`}
                          >
                            {s.status || 'COMPLETED'}
                          </span>
                        </div>

                        <div className="flex items-center gap-4 text-xs text-slate-500 font-medium">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            {dateStr}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            {durationMinutes} min duration
                          </span>
                        </div>

                        {s.notes && (
                          <p className="text-xs text-slate-600 italic bg-slate-50 p-2 rounded-lg border border-slate-100 mt-2">
                            &ldquo;{s.notes}&rdquo;
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100 justify-between sm:justify-end">
                      <div className="text-right text-xs">
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Dosage Achieved</span>
                        <span className="font-extrabold text-slate-800">
                          {s.completedSets || s.targetSets || 3} Sets / {s.completedRepetitions || s.targetRepetitions || 30} Reps
                        </span>
                      </div>

                      <div className="text-right text-xs">
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Pain Level</span>
                        <span className="font-extrabold text-rose-600">
                          {s.painLevel !== undefined ? `${s.painLevel} / 10` : '2 / 10'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>

      <MobileNavbar role="PATIENT" />
    </div>
  );
}
