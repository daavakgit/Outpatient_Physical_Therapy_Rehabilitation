'use client';

import React, { useEffect, useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { TopNavbar } from '@/components/TopNavbar';
import { MobileNavbar } from '@/components/MobileNavbar';
import { ExerciseCard } from '@/components/ExerciseCard';
import {
  Dumbbell,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Sliders,
  ShieldAlert,
  Activity,
  X,
} from 'lucide-react';

export default function TherapistExercisesPage() {
  const [exercises, setExercises] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedDifficulty, setSelectedDifficulty] = useState('ALL');
  const [loading, setLoading] = useState(true);

  // Add Exercise Form state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [name, setName] = useState('');
  const [targetBodyArea, setTargetBodyArea] = useState('Knee');
  const [category, setCategory] = useState('Mobility');
  const [difficulty, setDifficulty] = useState('Beginner');
  const [recommendedSets, setRecommendedSets] = useState(3);
  const [recommendedReps, setRecommendedReps] = useState(10);
  const [instructions, setInstructions] = useState('');
  const [safetyNotes, setSafetyNotes] = useState('');

  const fetchExercises = () => {
    setLoading(true);
    fetch('/api/exercises')
      .then((res) => {
        if (res.ok && res.headers.get('content-type')?.includes('application/json')) return res.json();
        return null;
      })
      .then((d) => {
        if (d?.exercises && d.exercises.length > 0) {
          setExercises(d.exercises);
        } else {
          setExercises([
            {
              _id: 'ex_1',
              name: 'Knee Extension Isometric Hold',
              targetBodyArea: 'Knee Quadriceps',
              category: 'Mobility',
              difficulty: 'Beginner',
              recommendedSets: 3,
              recommendedReps: 10,
              holdDurationSeconds: 10,
              restBetweenSetsSeconds: 45,
              instructions: 'Sit upright with a towel roll under the knee. Contract quadriceps tightly, locking knee straight.',
              safetyNotes: 'Maintain smooth breathing throughout isometric hold.',
              videoThumbnail: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=600&q=80',
            },
            {
              _id: 'ex_2',
              name: 'Prone Hamstring Curl',
              targetBodyArea: 'Hamstrings',
              category: 'Strength',
              difficulty: 'Intermediate',
              recommendedSets: 3,
              recommendedReps: 12,
              holdDurationSeconds: 2,
              restBetweenSetsSeconds: 60,
              instructions: 'Lie flat on abdomen. Flex knee slowly bringing heel towards gluteal muscle.',
              safetyNotes: 'Avoid hyper-extending lumbar spine.',
              videoThumbnail: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80',
            },
            {
              _id: 'ex_3',
              name: 'Terminal Knee Extension (TKE)',
              targetBodyArea: 'Knee VMO',
              category: 'Strength',
              difficulty: 'Beginner',
              recommendedSets: 2,
              recommendedReps: 15,
              holdDurationSeconds: 3,
              restBetweenSetsSeconds: 30,
              instructions: 'Attach resistance band around popliteal fossa. Step backward, then extend knee into resistance.',
              safetyNotes: 'Control eccentrically when returning to starting flexion.',
              videoThumbnail: 'https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?auto=format&fit=crop&w=600&q=80',
            },
            {
              _id: 'ex_4',
              name: 'Single Leg Stance Balance',
              targetBodyArea: 'Ankle & Proprioception',
              category: 'Balance',
              difficulty: 'Beginner',
              recommendedSets: 3,
              recommendedReps: 1,
              holdDurationSeconds: 30,
              restBetweenSetsSeconds: 30,
              instructions: 'Stand upright near wall or rail. Lift uninjured leg slightly off ground and hold balance.',
              safetyNotes: 'Keep fingertips near support rail for safety.',
              videoThumbnail: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=600&q=80',
            },
          ]);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchExercises();
  }, []);

  const handleAddExerciseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newEx = {
      _id: `ex_${Date.now()}`,
      name,
      targetBodyArea,
      category,
      difficulty,
      recommendedSets: Number(recommendedSets) || 3,
      recommendedReps: Number(recommendedReps) || 10,
      instructions: instructions || 'Perform exercise with controlled technique.',
      safetyNotes: safetyNotes || 'Stop immediately if sharp pain occurs.',
      videoThumbnail: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=600&q=80',
    };

    setExercises([newEx, ...exercises]);
    setToastMessage(`Exercise "${name}" added to clinical library successfully.`);
    setIsAddModalOpen(false);
    setName('');
    setInstructions('');
    setSafetyNotes('');
  };

  const filteredExercises = exercises.filter((ex) => {
    const matchesSearch = ex.name.toLowerCase().includes(search.toLowerCase()) || ex.targetBodyArea.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || ex.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'ALL' || ex.difficulty === selectedDifficulty;
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  return (
    <div className="min-h-screen bg-slate-50 flex text-slate-800">
      <Sidebar role="THERAPIST" />

      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-8">
        <TopNavbar title="Exercise Management Library" subtitle="Clinical Prescription Assets & Guidelines" />

        <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          {/* Toast Notification */}
          {toastMessage && (
            <div className="p-4 bg-teal-50 border border-teal-200 rounded-2xl text-xs font-bold text-teal-800 flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600" />
                <span>{toastMessage}</span>
              </div>
              <button onClick={() => setToastMessage('')} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>
          )}

          {/* PAGE HEADER */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Physical Therapy Exercise Library</h1>
              <p className="text-xs text-slate-500">Manage exercise prescriptions, parameters, target muscle groups, and safety notes.</p>
            </div>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Exercise</span>
            </button>
          </div>

          {/* SEARCH & FILTERS BAR */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search exercise name or target body area..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-500 outline-none"
                />
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
                  <Filter className="w-3.5 h-3.5" /> Difficulty:
                  <select
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                    className="p-1.5 rounded-lg border border-slate-200 text-xs bg-slate-50 outline-none font-semibold"
                  >
                    <option value="ALL">All Levels</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-slate-100">
              {['ALL', 'Mobility', 'Strength', 'Flexibility', 'Balance', 'Recovery', 'Functional Training'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    selectedCategory === cat ? 'bg-teal-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* EXERCISE GRID */}
          {loading ? (
            <div className="p-12 text-center space-y-3">
              <div className="w-10 h-10 rounded-full border-4 border-teal-600 border-t-transparent animate-spin mx-auto" />
              <p className="text-xs font-semibold text-slate-500">Loading Clinical Exercises...</p>
            </div>
          ) : filteredExercises.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
              <Dumbbell className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="font-bold text-slate-800 text-sm">No Exercises Found</h3>
              <p className="text-xs text-slate-500">Try adjusting search criteria or category filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredExercises.map((ex) => (
                <div key={ex._id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
                  <div>
                    <div className="relative h-44 bg-slate-100 overflow-hidden">
                      <img
                        src={ex.videoThumbnail || 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=600&q=80'}
                        alt={ex.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 left-3 flex gap-1.5">
                        <span className="px-2.5 py-0.5 rounded-full bg-slate-900/80 text-white text-[10px] font-bold backdrop-blur-xs">
                          {ex.category || 'Mobility'}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-teal-600/90 text-white text-[10px] font-bold backdrop-blur-xs">
                          {ex.difficulty || 'Beginner'}
                        </span>
                      </div>
                    </div>

                    <div className="p-5 space-y-3">
                      <h3 className="font-black text-slate-900 text-base leading-tight">{ex.name}</h3>

                      <div className="flex items-center justify-between text-xs text-slate-600 font-semibold bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <span>Target Area:</span>
                        <span className="text-teal-700 font-bold">{ex.targetBodyArea}</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-center text-xs">
                        <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                          <span className="text-[10px] text-slate-400 font-bold uppercase block">Default Sets</span>
                          <span className="font-bold text-slate-800">{ex.recommendedSets || 3} Sets</span>
                        </div>
                        <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                          <span className="text-[10px] text-slate-400 font-bold uppercase block">Default Reps</span>
                          <span className="font-bold text-slate-800">{ex.recommendedReps || 10} Reps</span>
                        </div>
                      </div>

                      {ex.instructions && (
                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                          {ex.instructions}
                        </p>
                      )}

                      {ex.safetyNotes && (
                        <div className="flex items-start gap-1.5 text-[11px] text-amber-800 bg-amber-50 p-2 rounded-lg border border-amber-200">
                          <ShieldAlert className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{ex.safetyNotes}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">Curated Clinical Asset</span>
                    <button
                      onClick={() => {
                        setName(ex.name);
                        setTargetBodyArea(ex.targetBodyArea);
                        setIsAddModalOpen(true);
                      }}
                      className="text-teal-600 font-bold hover:underline"
                    >
                      Edit Parameters
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      <MobileNavbar role="THERAPIST" />

      {/* ADD EXERCISE MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-6 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">Add Clinical Exercise</h2>
                <p className="text-xs text-slate-500">Define exercise protocol, parameters, instructions, and safety warnings</p>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddExerciseSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Exercise Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Terminal Knee Extension (TKE)"
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-medium focus:ring-2 focus:ring-teal-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Target Body Area</label>
                  <input
                    type="text"
                    required
                    value={targetBodyArea}
                    onChange={(e) => setTargetBodyArea(e.target.value)}
                    placeholder="e.g. Knee VMO / Quadriceps"
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-medium focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium focus:ring-2 focus:ring-teal-500 outline-none"
                  >
                    <option value="Mobility">Mobility</option>
                    <option value="Strength">Strength</option>
                    <option value="Flexibility">Flexibility</option>
                    <option value="Balance">Balance</option>
                    <option value="Recovery">Recovery</option>
                    <option value="Functional Training">Functional Training</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Difficulty</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium focus:ring-2 focus:ring-teal-500 outline-none"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Default Sets</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={recommendedSets}
                    onChange={(e) => setRecommendedSets(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-medium focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Default Reps</label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={recommendedReps}
                    onChange={(e) => setRecommendedReps(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-medium focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Execution Instructions</label>
                <textarea
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="Step-by-step patient execution instructions..."
                  className="w-full p-3 rounded-xl border border-slate-200 font-medium focus:ring-2 focus:ring-teal-500 outline-none h-20"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Safety Cautions & Precautions</label>
                <input
                  type="text"
                  value={safetyNotes}
                  onChange={(e) => setSafetyNotes(e.target.value)}
                  placeholder="e.g. Stop if sharp knee pain exceeds 4/10 VAS."
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-medium focus:ring-2 focus:ring-teal-500 outline-none"
                />
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold transition-all shadow-md"
                >
                  Save Exercise Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
