'use client';

import React, { useEffect, useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { TopNavbar } from '@/components/TopNavbar';
import { MobileNavbar } from '@/components/MobileNavbar';
import { ExerciseCard } from '@/components/ExerciseCard';
import { Dumbbell, Search, Filter } from 'lucide-react';

export default function ExerciseLibraryPage() {
  const [exercises, setExercises] = useState<any[]>([]);
  const [category, setCategory] = useState<string>('All');
  const [search, setSearch] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch(`/api/exercises?category=${category}&search=${search}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.exercises) setExercises(data.exercises);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [category, search]);

  const categories = ['All', 'Mobility', 'Strength', 'Flexibility', 'Balance', 'Recovery'];

  return (
    <div className="min-h-screen bg-glacier-bg flex">
      <Sidebar role="PATIENT" />

      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-8">
        <TopNavbar title="Physical Therapy Exercise Library" subtitle="Curated Rehabilitation Exercises" />

        <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          {/* Filter Bar */}
          <div className="glacier-card p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search exercises by name..."
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-500 outline-none"
              />
            </div>

            {/* Category Buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    category === cat
                      ? 'bg-brand-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Exercise Grid */}
          {loading ? (
            <div className="text-center py-12 text-xs text-slate-400">Loading exercise database...</div>
          ) : exercises.length === 0 ? (
            <div className="glacier-card p-12 text-center text-xs text-slate-400">
              No exercises match your search or filter criteria.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {exercises.map((ex) => (
                <ExerciseCard key={ex._id} exercise={ex} />
              ))}
            </div>
          )}
        </main>
      </div>

      <MobileNavbar role="PATIENT" />
    </div>
  );
}
