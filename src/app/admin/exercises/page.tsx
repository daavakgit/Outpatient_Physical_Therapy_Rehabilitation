'use client';

import React, { useEffect, useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { TopNavbar } from '@/components/TopNavbar';
import { MobileNavbar } from '@/components/MobileNavbar';
import {
  Dumbbell,
  Search,
  Filter,
  Plus,
  CheckCircle2,
  Eye,
  X,
  Sliders,
  ShieldCheck,
  Activity,
  Layers,
} from 'lucide-react';

export default function AdminGlobalExercisesPage() {
  const [exercises, setExercises] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [difficultyFilter, setDifficultyFilter] = useState('ALL');
  const [toastMessage, setToastMessage] = useState('');
  const [selectedExerciseModal, setSelectedExerciseModal] = useState<any | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Add Exercise Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState<'Mobility' | 'Strength' | 'Flexibility' | 'Balance' | 'Recovery' | 'Functional Training'>('Strength');
  const [difficulty, setDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner');
  const [targetArea, setTargetArea] = useState('Quadriceps & Knee Joint');
  const [recommendedSets, setRecommendedSets] = useState(3);
  const [recommendedReps, setRecommendedReps] = useState(10);
  const [restDurationSeconds, setRestDurationSeconds] = useState(45);
  const [instructionsText, setInstructionsText] = useState('');
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
          setExercises(
            d.exercises.map((e: any) => ({
              ...e,
              status: e.status || 'ACTIVE',
            }))
          );
        } else {
          setExercises([
            {
              _id: 'ex_01',
              name: 'Quad Sets with Towel Roll',
              category: 'Strength',
              difficulty: 'Beginner',
              targetArea: 'Quadriceps & Knee Joint',
              recommendedSets: 3,
              recommendedReps: 10,
              restDurationSeconds: 45,
              instructions: [
                'Sit on a flat mat with leg fully extended.',
                'Place a small rolled towel under the left knee.',
                'Tighten quadriceps to press the knee down into towel.',
                'Hold contraction for 5 seconds and relax.',
              ],
              safetyNotes: 'Do not hyperextend joint past zero degrees.',
              status: 'ACTIVE',
            },
            {
              _id: 'ex_02',
              name: 'Seated Heel Slides',
              category: 'Mobility',
              difficulty: 'Beginner',
              targetArea: 'Knee Flexion ROM',
              recommendedSets: 3,
              recommendedReps: 12,
              restDurationSeconds: 45,
              instructions: [
                'Sit on a smooth surface with feet flat.',
                'Slowly slide left heel backwards toward buttocks.',
                'Hold gentle stretch at end-range for 3 seconds.',
                'Slide heel back to starting position.',
              ],
              safetyNotes: 'Stop if pain exceeds 4/10 scale.',
              status: 'ACTIVE',
            },
            {
              _id: 'ex_03',
              name: 'Straight Leg Raises (SLR)',
              category: 'Strength',
              difficulty: 'Intermediate',
              targetArea: 'Hip Flexors & Quads',
              recommendedSets: 3,
              recommendedReps: 10,
              restDurationSeconds: 60,
              instructions: [
                'Lie flat on back with right knee bent and foot flat.',
                'Tighten left quadriceps to lock knee straight.',
                'Lift left leg 12 inches off floor smoothly.',
                'Lower slowly under control.',
              ],
              safetyNotes: 'Ensure lower back stays flat against mat.',
              status: 'ACTIVE',
            },
            {
              _id: 'ex_04',
              name: 'Standing Terminal Knee Extension (TKE)',
              category: 'Strength',
              difficulty: 'Intermediate',
              targetArea: 'Vastus Medialis (VMO)',
              recommendedSets: 3,
              recommendedReps: 15,
              restDurationSeconds: 45,
              instructions: [
                'Attach resistance band behind left knee anchored to pole.',
                'Stand with slight bend in knee.',
                'Straighten knee against resistance until fully locked.',
                'Hold 2 seconds and return.',
              ],
              safetyNotes: 'Maintain upright trunk posture throughout.',
              status: 'ACTIVE',
            },
            {
              _id: 'ex_05',
              name: 'Single Leg Balance on Foam',
              category: 'Balance',
              difficulty: 'Intermediate',
              targetArea: 'Proprioception & Ankle',
              recommendedSets: 3,
              recommendedReps: 30,
              restDurationSeconds: 45,
              instructions: [
                'Stand on left leg on a soft foam balance pad.',
                'Maintain upright spine and eyes fixed on a wall target.',
                'Hold balance for 30 seconds per set.',
              ],
              safetyNotes: 'Keep hand near wall for safety if needed.',
              status: 'ACTIVE',
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

  const handleToggleStatus = (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    setExercises((prev) =>
      prev.map((e) => (e._id === id ? { ...e, status: nextStatus } : e))
    );
    setToastMessage(`Exercise status updated to ${nextStatus}.`);
  };

  const handleAddExerciseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newEx = {
      _id: `ex_${Date.now()}`,
      name,
      category,
      difficulty,
      targetArea,
      recommendedSets,
      recommendedReps,
      restDurationSeconds,
      instructions: instructionsText ? instructionsText.split('\n').filter((i) => i.trim().length > 0) : ['Execute according to clinical guidelines.'],
      safetyNotes: safetyNotes || 'Monitor patient comfort VAS throughout.',
      status: 'ACTIVE',
    };

    setExercises([newEx, ...exercises]);
    setToastMessage(`Global exercise "${name}" added successfully.`);
    setIsAddModalOpen(false);
    setName('');
    setInstructionsText('');
    setSafetyNotes('');
  };

  const filteredExercises = exercises.filter((ex) => {
    const matchesSearch = ex.name.toLowerCase().includes(search.toLowerCase()) || ex.targetArea.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'ALL' || ex.category === categoryFilter;
    const matchesDifficulty = difficultyFilter === 'ALL' || ex.difficulty === difficultyFilter;
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const totalExercises = exercises.length;
  const mobilityCount = exercises.filter((e) => e.category === 'Mobility').length;
  const strengthCount = exercises.filter((e) => e.category === 'Strength').length;

  return (
    <div className="min-h-screen bg-slate-50 flex text-slate-800">
      <Sidebar role="ADMIN" />

      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-8">
        <TopNavbar title="Global Exercise Library" subtitle="Curated Physical Therapy Asset Catalog" />

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
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Global Exercise Library</h1>
              <p className="text-xs text-slate-500">Manage master exercise protocols, kinematic parameters, and clinical safety guidelines across the platform.</p>
            </div>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Create Global Exercise</span>
            </button>
          </div>

          {/* KPI SUMMARY CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Master Global Library</span>
                <span className="text-2xl font-black text-slate-900 mt-0.5 block">{totalExercises}</span>
                <span className="text-[11px] text-slate-500 font-medium">Curated protocols</span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Dumbbell className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Strength Protocols</span>
                <span className="text-2xl font-black text-teal-600 mt-0.5 block">{strengthCount}</span>
                <span className="text-[11px] text-teal-700 font-medium">Hypertrophy & TKE</span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                <Activity className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Mobility & ROM Protocols</span>
                <span className="text-2xl font-black text-blue-600 mt-0.5 block">{mobilityCount}</span>
                <span className="text-[11px] text-blue-700 font-medium">Early phase recovery</span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Layers className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* SEARCH & FILTERS BAR */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search exercise name or target area..."
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div className="flex items-center gap-3 overflow-x-auto w-full sm:w-auto">
              <div className="flex items-center gap-1">
                <span className="text-xs font-bold text-slate-500">Category:</span>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="p-2 rounded-xl border border-slate-200 text-xs font-bold bg-white outline-none"
                >
                  <option value="ALL">All Categories</option>
                  <option value="Mobility">Mobility</option>
                  <option value="Strength">Strength</option>
                  <option value="Flexibility">Flexibility</option>
                  <option value="Balance">Balance</option>
                  <option value="Recovery">Recovery</option>
                  <option value="Functional Training">Functional Training</option>
                </select>
              </div>

              <div className="flex items-center gap-1">
                <span className="text-xs font-bold text-slate-500">Difficulty:</span>
                <select
                  value={difficultyFilter}
                  onChange={(e) => setDifficultyFilter(e.target.value)}
                  className="p-2 rounded-xl border border-slate-200 text-xs font-bold bg-white outline-none"
                >
                  <option value="ALL">All Difficulties</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
            </div>
          </div>

          {/* EXERCISES GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExercises.map((ex) => (
              <div key={ex._id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-teal-50 text-teal-700 border border-teal-200">
                      {ex.category}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      ex.difficulty === 'Beginner'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : ex.difficulty === 'Intermediate'
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : 'bg-purple-50 text-purple-700 border-purple-200'
                    }`}>
                      {ex.difficulty}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-base">{ex.name}</h3>
                  <p className="text-xs text-slate-500">Target Area: <strong>{ex.targetArea}</strong></p>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-700">
                    <span>{ex.recommendedSets} Sets × {ex.recommendedReps} Reps</span>
                    <span className="text-slate-400">• {ex.restDurationSeconds}s Rest</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <button
                    onClick={() => setSelectedExerciseModal(ex)}
                    className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-bold inline-flex items-center gap-1.5 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" /> Details
                  </button>

                  <button
                    onClick={() => handleToggleStatus(ex._id, ex.status)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      ex.status === 'ACTIVE'
                        ? 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
                        : 'bg-teal-50 text-teal-700 hover:bg-teal-100 border border-teal-200'
                    }`}
                  >
                    {ex.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      <MobileNavbar role="ADMIN" />

      {/* EXERCISE DETAIL MODAL */}
      {selectedExerciseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                  Global Exercise Specification
                </span>
                <h2 className="text-2xl font-black text-slate-900 mt-1">{selectedExerciseModal.name}</h2>
                <p className="text-xs text-slate-500 font-medium">Target: {selectedExerciseModal.targetArea}</p>
              </div>
              <button onClick={() => setSelectedExerciseModal(null)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 text-[10px] font-bold uppercase block">Category</span>
                  <span className="font-bold text-teal-700 mt-0.5 block">{selectedExerciseModal.category}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 text-[10px] font-bold uppercase block">Difficulty</span>
                  <span className="font-bold text-blue-700 mt-0.5 block">{selectedExerciseModal.difficulty}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 text-[10px] font-bold uppercase block">Prescription</span>
                  <span className="font-bold text-slate-900 mt-0.5 block">{selectedExerciseModal.recommendedSets}×{selectedExerciseModal.recommendedReps}</span>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-slate-800">Execution Instructions:</h4>
                <ul className="list-disc pl-5 space-y-1 text-slate-600 font-medium">
                  {Array.isArray(selectedExerciseModal.instructions)
                    ? selectedExerciseModal.instructions.map((ins: string, idx: number) => <li key={idx}>{ins}</li>)
                    : <li>{selectedExerciseModal.instructions}</li>}
                </ul>
              </div>

              {selectedExerciseModal.safetyNotes && (
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 space-y-1">
                  <span className="font-bold text-amber-800 block">Safety Precautions:</span>
                  <p className="text-amber-900 font-medium">{selectedExerciseModal.safetyNotes}</p>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedExerciseModal(null)}
                className="px-5 py-2.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800"
              >
                Close Specification
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD EXERCISE MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">Create Global Exercise Protocol</h2>
                <p className="text-xs text-slate-500">Define master exercise parameters for care plans</p>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddExerciseSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Exercise Title</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Closed Chain Bodyweight Squats"
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-medium outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e: any) => setCategory(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-bold outline-none"
                  >
                    <option value="Mobility">Mobility</option>
                    <option value="Strength">Strength</option>
                    <option value="Flexibility">Flexibility</option>
                    <option value="Balance">Balance</option>
                    <option value="Recovery">Recovery</option>
                    <option value="Functional Training">Functional Training</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Difficulty Level</label>
                  <select
                    value={difficulty}
                    onChange={(e: any) => setDifficulty(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-bold outline-none"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Target Anatomical Area</label>
                <input
                  type="text"
                  required
                  value={targetArea}
                  onChange={(e) => setTargetArea(e.target.value)}
                  placeholder="e.g. Quadriceps & Gluteal Muscle Complex"
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-medium outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Recommended Sets</label>
                  <input
                    type="number"
                    value={recommendedSets}
                    onChange={(e) => setRecommendedSets(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-medium outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Target Reps</label>
                  <input
                    type="number"
                    value={recommendedReps}
                    onChange={(e) => setRecommendedReps(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-medium outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Rest Duration (sec)</label>
                  <input
                    type="number"
                    value={restDurationSeconds}
                    onChange={(e) => setRestDurationSeconds(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-medium outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Step-by-Step Instructions (One per line)</label>
                <textarea
                  value={instructionsText}
                  onChange={(e) => setInstructionsText(e.target.value)}
                  placeholder="1. Stand with feet shoulder-width apart.&#10;2. Lower hips smoothly to 90 degrees."
                  className="w-full p-3 rounded-xl border border-slate-200 font-medium outline-none h-20"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Clinical Safety Precautions</label>
                <textarea
                  value={safetyNotes}
                  onChange={(e) => setSafetyNotes(e.target.value)}
                  placeholder="Contraindications or form precautions..."
                  className="w-full p-3 rounded-xl border border-slate-200 font-medium outline-none h-16"
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
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all shadow-md"
                >
                  Save Global Exercise
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
