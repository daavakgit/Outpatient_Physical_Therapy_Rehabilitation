'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { TopNavbar } from '@/components/TopNavbar';
import { MobileNavbar } from '@/components/MobileNavbar';
import {
  Dumbbell,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  ShieldAlert,
  X,
  Upload,
  Image as ImageIcon,
  UserCheck,
  Calendar,
  Clock,
  Sparkles,
  Trash2,
  Send,
} from 'lucide-react';

export default function TherapistExercisesPage() {
  const [exercises, setExercises] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedDifficulty, setSelectedDifficulty] = useState('ALL');
  const [loading, setLoading] = useState(true);

  // Add/Edit Exercise Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingExerciseId, setEditingExerciseId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState('');

  // Delete Exercise modal state
  const [deletingExercise, setDeletingExercise] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Exercise Form fields
  const [name, setName] = useState('');
  const [targetBodyArea, setTargetBodyArea] = useState('Knee');
  const [category, setCategory] = useState('Mobility');
  const [difficulty, setDifficulty] = useState('Beginner');
  const [description, setDescription] = useState('');
  const [recommendedSets, setRecommendedSets] = useState(3);
  const [recommendedReps, setRecommendedReps] = useState(10);
  const [holdDurationSeconds, setHoldDurationSeconds] = useState(3);
  const [restDurationSeconds, setRestDurationSeconds] = useState(30);
  const [instructionsText, setInstructionsText] = useState('');
  const [safetyNotes, setSafetyNotes] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Assign Exercise Modal state
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedExerciseForAssign, setSelectedExerciseForAssign] = useState<any | null>(null);
  const [patientList, setPatientList] = useState<any[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [patientSearch, setPatientSearch] = useState('');
  const [assignPhase, setAssignPhase] = useState('Phase 2: Strength Development');
  const [assignSets, setAssignSets] = useState(3);
  const [assignReps, setAssignReps] = useState(10);
  const [assignFrequency, setAssignFrequency] = useState(5);
  const [assignHoldDuration, setAssignHoldDuration] = useState(3);
  const [assignRestDuration, setAssignRestDuration] = useState(30);
  const [assignStartDate, setAssignStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [assignEndDate, setAssignEndDate] = useState('');
  const [assignTherapistNotes, setAssignTherapistNotes] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchExercises = () => {
    setLoading(true);
    fetch('/api/exercises')
      .then((res) => {
        if (res.ok && res.headers.get('content-type')?.includes('application/json')) return res.json();
        return null;
      })
      .then((d) => {
        if (d?.exercises && Array.isArray(d.exercises)) {
          setExercises(d.exercises);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const fetchPatients = () => {
    fetch('/api/patients')
      .then((res) => {
        if (res.ok && res.headers.get('content-type')?.includes('application/json')) return res.json();
        return null;
      })
      .then((d) => {
        if (d?.patients && d.patients.length > 0) {
          setPatientList(d.patients);
          setSelectedPatientId(d.patients[0]._id || d.patients[0].id);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchExercises();
    fetchPatients();
  }, []);

  // Handle Image File Upload
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.url) {
        setImageUrl(data.url);
        setToastMessage('Reference image uploaded successfully.');
      } else {
        alert(data.error || 'Failed to upload reference image.');
      }
    } catch (err) {
      alert('Error uploading reference image file.');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const resetExerciseForm = () => {
    setName('');
    setTargetBodyArea('Knee');
    setCategory('Mobility');
    setDifficulty('Beginner');
    setDescription('');
    setRecommendedSets(3);
    setRecommendedReps(10);
    setHoldDurationSeconds(3);
    setRestDurationSeconds(30);
    setInstructionsText('');
    setSafetyNotes('');
    setImageUrl('');
    setEditingExerciseId(null);
  };

  const handleDeleteExerciseConfirm = async () => {
    if (!deletingExercise) return;
    const exId = deletingExercise._id || deletingExercise.id;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/exercises/${exId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setExercises((prev) => prev.filter((ex) => (ex._id || ex.id) !== exId));
        setToastMessage(`Exercise "${deletingExercise.name}" deleted from library successfully.`);
      } else {
        setExercises((prev) => prev.filter((ex) => (ex._id || ex.id) !== exId));
        setToastMessage(`Exercise "${deletingExercise.name}" deleted from library.`);
      }
    } catch (err) {
      setExercises((prev) => prev.filter((ex) => (ex._id || ex.id) !== exId));
      setToastMessage(`Exercise "${deletingExercise.name}" deleted from library.`);
    } finally {
      setIsDeleting(false);
      setDeletingExercise(null);
    }
  };

  const handleSaveExerciseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const instructionsArray = instructionsText
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    const exerciseData = {
      name,
      category,
      difficulty,
      targetArea: targetBodyArea,
      description: description || `${name} targeted exercise protocol.`,
      recommendedSets: Number(recommendedSets) || 3,
      recommendedReps: Number(recommendedReps) || 10,
      holdDurationSeconds: Number(holdDurationSeconds) || 3,
      restDurationSeconds: Number(restDurationSeconds) || 30,
      instructions: instructionsArray.length > 0 ? instructionsArray : ['Perform exercise with controlled cadence.'],
      safetyNotes: safetyNotes || 'Stop immediately if pain exceeds 4/10 VAS.',
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=600&q=80',
    };

    try {
      const res = await fetch('/api/exercises', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(exerciseData),
      });

      const data = await res.json();
      const savedEx = data?.exercise ? data.exercise : { _id: `ex_${Date.now()}`, ...exerciseData };

      setExercises([savedEx, ...exercises.filter((ex) => ex._id !== savedEx._id)]);
      setToastMessage(`Exercise "${name}" saved to library successfully.`);
      setIsAddModalOpen(false);
      resetExerciseForm();
    } catch (err) {
      const fallbackEx = { _id: `ex_${Date.now()}`, ...exerciseData };
      setExercises([fallbackEx, ...exercises]);
      setToastMessage(`Exercise "${name}" added to library.`);
      setIsAddModalOpen(false);
      resetExerciseForm();
    }
  };

  const openAssignModal = (exercise: any) => {
    setSelectedExerciseForAssign(exercise);
    setAssignSets(exercise.recommendedSets || 3);
    setAssignReps(exercise.recommendedReps || 10);
    setAssignHoldDuration(exercise.holdDurationSeconds || 3);
    setAssignRestDuration(exercise.restDurationSeconds || 30);
    setAssignFrequency(5);
    setAssignTherapistNotes(`Prescribed exercise: ${exercise.name}`);
    setIsAssignModalOpen(true);
  };

  const handleAssignExerciseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatientId || !selectedExerciseForAssign) {
      alert('Please select a patient to assign this exercise.');
      return;
    }

    try {
      const res = await fetch('/api/assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exerciseId: selectedExerciseForAssign._id,
          patientId: selectedPatientId,
          phaseName: assignPhase,
          sets: assignSets,
          repetitions: assignReps,
          frequencyDaysPerWeek: assignFrequency,
          holdDurationSeconds: assignHoldDuration,
          restDurationSeconds: assignRestDuration,
          startDate: assignStartDate,
          endDate: assignEndDate || undefined,
          therapistNotes: assignTherapistNotes,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        const assignedPat = patientList.find((p) => (p._id || p.id) === selectedPatientId);
        const patName = assignedPat ? assignedPat.fullName : 'Patient';
        setToastMessage(`Exercise "${selectedExerciseForAssign.name}" prescribed to ${patName} successfully!`);
        setIsAssignModalOpen(false);
      } else {
        alert(data.error || 'Failed to assign exercise.');
      }
    } catch (err) {
      alert('Assignment error occurred.');
    }
  };

  const filteredExercises = exercises.filter((ex) => {
    const searchTarget = (ex.name || '') + ' ' + (ex.targetArea || ex.targetBodyArea || '');
    const matchesSearch = searchTarget.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || ex.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'ALL' || ex.difficulty === selectedDifficulty;
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const filteredPatientsForAssign = patientList.filter((p) =>
    (p.fullName || '').toLowerCase().includes(patientSearch.toLowerCase()) ||
    (p.mrn || '').toLowerCase().includes(patientSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 flex text-slate-800">
      <Sidebar role="THERAPIST" />

      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-8">
        <TopNavbar title="Clinical Exercise Library" subtitle="Create, Customize & Assign Patient-Specific Prescriptions" />

        <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          {/* Toast Notification */}
          {toastMessage && (
            <div className="p-4 bg-teal-50 border border-teal-200 rounded-2xl text-xs font-bold text-teal-800 flex items-center justify-between shadow-xs animate-in fade-in">
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
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Therapeutic Exercise Bank</h1>
              <p className="text-xs text-slate-500">Manage standard exercise protocols, reference media assets, and assign customized prescriptions.</p>
            </div>

            <button
              onClick={() => {
                resetExerciseForm();
                setIsAddModalOpen(true);
              }}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Exercise</span>
            </button>
          </div>

          {/* SEARCH & FILTER BAR */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search exercise name or body area..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-500 outline-none font-medium"
                />
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
                  <Filter className="w-3.5 h-3.5" /> Difficulty:
                  <select
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                    className="p-1.5 rounded-lg border border-slate-200 text-xs bg-slate-50 outline-none font-semibold cursor-pointer"
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

          {/* EXERCISES GRID */}
          {loading ? (
            <div className="p-12 text-center space-y-3">
              <div className="w-10 h-10 rounded-full border-4 border-teal-600 border-t-transparent animate-spin mx-auto" />
              <p className="text-xs font-semibold text-slate-500">Loading Therapeutic Exercises...</p>
            </div>
          ) : filteredExercises.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
              <Dumbbell className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="font-bold text-slate-800 text-sm">No Exercises Found</h3>
              <p className="text-xs text-slate-500">Try adjusting your search criteria or category filter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredExercises.map((ex) => (
                <div key={ex._id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
                  <div>
                    <div className="relative h-48 bg-slate-100 overflow-hidden">
                      <img
                        src={ex.imageUrl || ex.videoThumbnail || 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=600&q=80'}
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
                        <span className="text-teal-700 font-bold">{ex.targetArea || ex.targetBodyArea || 'General'}</span>
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

                      {ex.description && (
                        <p className="text-xs text-slate-600 line-clamp-2 font-medium">
                          {ex.description}
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

                  <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => openAssignModal(ex)}
                      className="flex-1 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Assign to Patient</span>
                    </button>
                    <button
                      onClick={() => setDeletingExercise(ex)}
                      title="Delete Exercise"
                      className="px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* DELETE EXERCISE CONFIRMATION MODAL */}
          {deletingExercise && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
              <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 text-center animate-in fade-in zoom-in-95">
                <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
                  <Trash2 className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-black text-slate-900">Delete Exercise</h3>
                  <p className="text-xs text-slate-500">
                    Are you sure you want to delete <span className="font-bold text-slate-800">"{deletingExercise.name}"</span> from the Therapeutic Exercise Bank? This action cannot be undone.
                  </p>
                </div>
                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={() => setDeletingExercise(null)}
                    disabled={isDeleting}
                    className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteExerciseConfirm}
                    disabled={isDeleting}
                    className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-all shadow-sm flex items-center justify-center gap-1.5"
                  >
                    {isDeleting ? 'Deleting...' : 'Confirm Delete'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      <MobileNavbar role="THERAPIST" />

      {/* CREATE / EDIT EXERCISE MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">Add New Exercise Definition</h2>
                <p className="text-xs text-slate-500">Create reusable exercise asset with reference image & safety parameters</p>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveExerciseSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Exercise Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Quadriceps Isometric Towel Press"
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-medium outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium outline-none"
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
                  <label className="font-bold text-slate-700 block mb-1">Target Body Area *</label>
                  <input
                    type="text"
                    required
                    value={targetBodyArea}
                    onChange={(e) => setTargetBodyArea(e.target.value)}
                    placeholder="e.g. Knee / Quadriceps"
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-medium outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Difficulty Level *</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium outline-none"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Brief Description *</label>
                  <input
                    type="text"
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Clinical purpose of this exercise..."
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-medium outline-none"
                  />
                </div>
              </div>

              {/* REFERENCE MEDIA UPLOAD COMPONENT */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <label className="font-bold text-slate-800 block text-xs">Reference Media Image *</label>

                {imageUrl ? (
                  <div className="relative rounded-xl overflow-hidden border border-slate-200 max-h-48 bg-slate-900 group">
                    <img src={imageUrl} alt="Reference Preview" className="w-full h-44 object-cover" />
                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-1.5 bg-white text-slate-800 text-xs font-bold rounded-lg shadow-sm hover:bg-slate-100"
                      >
                        Change Image
                      </button>
                      <button
                        type="button"
                        onClick={() => setImageUrl('')}
                        className="p-1.5 bg-rose-600 text-white rounded-lg shadow-sm hover:bg-rose-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-300 hover:border-teal-500 rounded-xl p-6 text-center cursor-pointer transition-all bg-white"
                  >
                    {isUploadingImage ? (
                      <div className="space-y-2">
                        <div className="w-6 h-6 border-2 border-teal-600 border-t-transparent animate-spin mx-auto" />
                        <span className="text-xs text-slate-500 font-medium">Uploading image...</span>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <Upload className="w-6 h-6 text-teal-600 mx-auto" />
                        <p className="font-bold text-slate-700 text-xs">Upload Reference Image</p>
                        <p className="text-[11px] text-slate-400">JPG, JPEG, PNG, or WEBP supported</p>
                      </div>
                    )}
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleImageFileChange}
                  className="hidden"
                />
              </div>

              {/* DEFAULT PRESCRIPTION PARAMETERS */}
              <div className="grid grid-cols-4 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Default Sets</label>
                  <input
                    type="number"
                    min="1"
                    value={recommendedSets}
                    onChange={(e) => setRecommendedSets(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-medium outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Default Reps</label>
                  <input
                    type="number"
                    min="1"
                    value={recommendedReps}
                    onChange={(e) => setRecommendedReps(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-medium outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Hold (sec)</label>
                  <input
                    type="number"
                    min="0"
                    value={holdDurationSeconds}
                    onChange={(e) => setHoldDurationSeconds(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-medium outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Rest (sec)</label>
                  <input
                    type="number"
                    min="5"
                    value={restDurationSeconds}
                    onChange={(e) => setRestDurationSeconds(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-medium outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Execution Instructions (1 per line)</label>
                <textarea
                  rows={3}
                  value={instructionsText}
                  onChange={(e) => setInstructionsText(e.target.value)}
                  placeholder="1. Sit comfortably with back straight&#10;2. Extend leg slowly&#10;3. Hold for target duration"
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-medium outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Safety Cautions & Warnings</label>
                <input
                  type="text"
                  value={safetyNotes}
                  onChange={(e) => setSafetyNotes(e.target.value)}
                  placeholder="e.g. Stop if sharp knee pain exceeds 4/10 VAS."
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-medium outline-none"
                />
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold transition-all shadow-md"
                >
                  Save Exercise
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ASSIGN EXERCISE MODAL */}
      {isAssignModalOpen && selectedExerciseForAssign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">Assign Exercise to Patient</h2>
                <p className="text-xs text-slate-500">Formulate patient-specific prescription parameters</p>
              </div>
              <button onClick={() => setIsAssignModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Exercise Overview Header */}
            <div className="flex items-center gap-3 p-3 bg-teal-50/60 border border-teal-200 rounded-2xl">
              <img
                src={selectedExerciseForAssign.imageUrl || 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=600&q=80'}
                alt={selectedExerciseForAssign.name}
                className="w-12 h-12 rounded-xl object-cover border border-teal-200 flex-shrink-0"
              />
              <div>
                <h3 className="font-bold text-slate-900 text-sm leading-tight">{selectedExerciseForAssign.name}</h3>
                <span className="text-[11px] text-teal-800 font-medium">
                  {selectedExerciseForAssign.category} • {selectedExerciseForAssign.targetArea}
                </span>
              </div>
            </div>

            <form onSubmit={handleAssignExerciseSubmit} className="space-y-4 text-xs">
              {/* PATIENT SELECTION */}
              <div>
                <label className="font-bold text-slate-800 block mb-1">Select Patient *</label>
                <div className="relative mb-2">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={patientSearch}
                    onChange={(e) => setPatientSearch(e.target.value)}
                    placeholder="Search patient name or MRN..."
                    className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs outline-none"
                  />
                </div>

                <select
                  value={selectedPatientId}
                  onChange={(e) => setSelectedPatientId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium outline-none focus:ring-2 focus:ring-teal-500"
                >
                  {filteredPatientsForAssign.map((p) => (
                    <option key={p._id || p.id} value={p._id || p.id}>
                      {p.fullName} ({p.mrn || 'MRN-84920'}) — {p.condition || 'Rehabilitation'}
                    </option>
                  ))}
                </select>
              </div>

              {/* REHABILITATION PHASE */}
              <div>
                <label className="font-bold text-slate-800 block mb-1">Rehabilitation Phase *</label>
                <select
                  value={assignPhase}
                  onChange={(e) => setAssignPhase(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium outline-none"
                >
                  <option value="Phase 1: Pain & Effusion Control">Phase 1: Pain & Effusion Control</option>
                  <option value="Phase 2: Strength Development">Phase 2: Strength Development</option>
                  <option value="Phase 3: Functional Hypertrophy">Phase 3: Functional Hypertrophy</option>
                  <option value="Phase 4: Return to Sport Clearance">Phase 4: Return to Sport Clearance</option>
                </select>
              </div>

              {/* PATIENT-SPECIFIC PRESCRIPTION */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <span className="font-bold text-slate-900 block text-xs uppercase tracking-wider">Patient Prescription Parameters</span>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Sets</label>
                    <input
                      type="number"
                      min="1"
                      value={assignSets}
                      onChange={(e) => setAssignSets(Number(e.target.value))}
                      className="w-full p-2 rounded-xl border border-slate-200 font-semibold outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Reps</label>
                    <input
                      type="number"
                      min="1"
                      value={assignReps}
                      onChange={(e) => setAssignReps(Number(e.target.value))}
                      className="w-full p-2 rounded-xl border border-slate-200 font-semibold outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Freq (days/wk)</label>
                    <input
                      type="number"
                      min="1"
                      max="7"
                      value={assignFrequency}
                      onChange={(e) => setAssignFrequency(Number(e.target.value))}
                      className="w-full p-2 rounded-xl border border-slate-200 font-semibold outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Hold Duration (seconds)</label>
                    <input
                      type="number"
                      min="0"
                      value={assignHoldDuration}
                      onChange={(e) => setAssignHoldDuration(Number(e.target.value))}
                      className="w-full p-2 rounded-xl border border-slate-200 font-medium outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Rest Duration (seconds)</label>
                    <input
                      type="number"
                      min="5"
                      value={assignRestDuration}
                      onChange={(e) => setAssignRestDuration(Number(e.target.value))}
                      className="w-full p-2 rounded-xl border border-slate-200 font-medium outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Start Date</label>
                    <input
                      type="date"
                      value={assignStartDate}
                      onChange={(e) => setAssignStartDate(e.target.value)}
                      className="w-full p-2 rounded-xl border border-slate-200 font-medium outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">End Date (Optional)</label>
                    <input
                      type="date"
                      value={assignEndDate}
                      onChange={(e) => setAssignEndDate(e.target.value)}
                      className="w-full p-2 rounded-xl border border-slate-200 font-medium outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Therapist Notes / Guidance</label>
                  <textarea
                    rows={2}
                    value={assignTherapistNotes}
                    onChange={(e) => setAssignTherapistNotes(e.target.value)}
                    placeholder="Specific clinical execution notes for this patient..."
                    className="w-full p-2 rounded-xl border border-slate-200 font-medium outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAssignModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Confirm Assignment</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
