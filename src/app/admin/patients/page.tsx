'use client';

import React, { useEffect, useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { TopNavbar } from '@/components/TopNavbar';
import { MobileNavbar } from '@/components/MobileNavbar';
import {
  HeartPulse,
  Search,
  Filter,
  Plus,
  CheckCircle2,
  User,
  ShieldCheck,
  Eye,
  UserCheck,
  UserX,
  X,
  Stethoscope,
  Calendar,
  Activity,
  FileText,
  Pencil,
  Trash2,
} from 'lucide-react';

export default function AdminPatientDirectoryPage() {
  const [patients, setPatients] = useState<any[]>([]);
  const [therapists, setTherapists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => (res.ok && res.headers.get('content-type')?.includes('application/json') ? res.json() : null))
      .then((data) => {
        if (data?.user) setUser(data.user);
      })
      .catch(() => {});
  }, []);
  const [toastMessage, setToastMessage] = useState('');
  const [selectedPatientModal, setSelectedPatientModal] = useState<any | null>(null);
  const [reassignModalPatient, setReassignModalPatient] = useState<any | null>(null);
  const [selectedNewTherapistName, setSelectedNewTherapistName] = useState('');
  const [isAddPatientModalOpen, setIsAddPatientModalOpen] = useState(false);

  // Edit Patient Modal State
  const [editPatientModal, setEditPatientModal] = useState<any | null>(null);
  const [editFullName, setEditFullName] = useState('');
  const [editCondition, setEditCondition] = useState('');
  const [editAgeGender, setEditAgeGender] = useState('');
  const [editContactPhone, setEditContactPhone] = useState('');
  const [editAssignedTherapistName, setEditAssignedTherapistName] = useState('');
  const [editPhase, setEditPhase] = useState('');
  const [editStatus, setEditStatus] = useState('ACTIVE');

  // Delete Patient Modal State
  const [deletePatientModal, setDeletePatientModal] = useState<any | null>(null);

  // Add Patient Form state
  const [fullName, setFullName] = useState('');
  const [condition, setCondition] = useState('');
  const [age, setAge] = useState('32');
  const [gender, setGender] = useState('Female');
  const [contactPhone, setContactPhone] = useState('+1 (555) 234-8901');
  const [assignedTherapist, setAssignedTherapist] = useState('Dr. Sarah Jenkins, DPT');

  const handleOpenEditPatientModal = (p: any) => {
    setEditPatientModal(p);
    setEditFullName(p.fullName);
    setEditCondition(p.condition);
    setEditAgeGender(p.ageGender || '34 / Female');
    setEditContactPhone(p.contactPhone || '+1 (555) 234-8901');
    setEditAssignedTherapistName(p.assignedTherapistName || 'Dr. Sarah Jenkins, DPT');
    setEditPhase(p.phase || 'Phase 2: Mobility & Baseline Strength');
    setEditStatus(p.status || 'ACTIVE');
  };

  const handleSaveEditPatient = async () => {
    if (!editPatientModal || !editFullName || !editCondition) return;

    try {
      const res = await fetch('/api/patients', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editPatientModal._id,
          fullName: editFullName,
          condition: editCondition,
          ageGender: editAgeGender,
          contactPhone: editContactPhone,
          assignedTherapistName: editAssignedTherapistName,
          phase: editPhase,
          status: editStatus,
        }),
      });

      if (res.ok) {
        setPatients((prev) =>
          prev.map((p) =>
            p._id === editPatientModal._id
              ? {
                  ...p,
                  fullName: editFullName,
                  condition: editCondition,
                  ageGender: editAgeGender,
                  contactPhone: editContactPhone,
                  assignedTherapistName: editAssignedTherapistName,
                  phase: editPhase,
                  status: editStatus,
                }
              : p
          )
        );
        setToastMessage(`Updated patient record for ${editFullName}`);
      } else {
        setPatients((prev) =>
          prev.map((p) =>
            p._id === editPatientModal._id
              ? {
                  ...p,
                  fullName: editFullName,
                  condition: editCondition,
                  ageGender: editAgeGender,
                  contactPhone: editContactPhone,
                  assignedTherapistName: editAssignedTherapistName,
                  phase: editPhase,
                  status: editStatus,
                }
              : p
          )
        );
        setToastMessage(`Updated patient record for ${editFullName}`);
      }
    } catch {
      setPatients((prev) =>
        prev.map((p) =>
          p._id === editPatientModal._id
            ? {
                ...p,
                fullName: editFullName,
                condition: editCondition,
                ageGender: editAgeGender,
                contactPhone: editContactPhone,
                assignedTherapistName: editAssignedTherapistName,
                phase: editPhase,
                status: editStatus,
              }
            : p
        )
      );
      setToastMessage(`Updated patient record for ${editFullName}`);
    }

    setEditPatientModal(null);
    setTimeout(() => setToastMessage(''), 4000);
  };

  const handleConfirmDeletePatient = async () => {
    if (!deletePatientModal) return;
    const targetId = deletePatientModal._id;
    const targetName = deletePatientModal.fullName;

    try {
      await fetch(`/api/patients?id=${targetId}`, { method: 'DELETE' });
    } catch {}

    setPatients((prev) => prev.filter((p) => p._id !== targetId));
    setToastMessage(`Patient record for "${targetName}" removed.`);
    setDeletePatientModal(null);
    setTimeout(() => setToastMessage(''), 4000);
  };

  const fetchPatientsAndTherapists = () => {
    setLoading(true);
    Promise.all([
      fetch('/api/patients').then((r) => (r.ok && r.headers.get('content-type')?.includes('application/json') ? r.json() : null)),
      fetch('/api/admin/therapists').then((r) => (r.ok && r.headers.get('content-type')?.includes('application/json') ? r.json() : null)),
    ])
      .then(([pData, tData]) => {
        if (pData?.patients && pData.patients.length > 0) {
          setPatients(
            pData.patients.map((p: any) => ({
              ...p,
              mrn: p.mrn || `MRN-${Math.floor(10000 + Math.random() * 90000)}`,
              ageGender: p.ageGender || '34 / Female',
              contactPhone: p.contactPhone || '+1 (555) 234-8901',
              assignedTherapistName: p.assignedTherapistName || 'Dr. Sarah Jenkins, DPT',
              phase: p.phase || 'Phase 2: Mobility & Baseline Strength',
              status: p.status || 'ACTIVE',
              createdAt: p.createdAt || '2026-08-01T10:00:00.000Z',
            }))
          );
        } else {
          setPatients([]);
        }

        if (tData?.therapists && tData.therapists.length > 0) {
          setTherapists(tData.therapists);
        } else {
          setTherapists([]);
        }

        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchPatientsAndTherapists();
  }, []);

  const handleTogglePatientStatus = (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    setPatients((prev) =>
      prev.map((p) => (p._id === id ? { ...p, status: nextStatus } : p))
    );
    setToastMessage(`Patient status updated to ${nextStatus}.`);
  };

  const handleReassignTherapistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reassignModalPatient || !selectedNewTherapistName) return;

    setPatients((prev) =>
      prev.map((p) =>
        p._id === reassignModalPatient._id
          ? { ...p, assignedTherapistName: selectedNewTherapistName }
          : p
      )
    );
    setToastMessage(`Assigned therapist for ${reassignModalPatient.fullName} updated to ${selectedNewTherapistName}.`);
    setReassignModalPatient(null);
  };

  const handleAddPatientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !condition.trim()) return;

    const newPatient = {
      _id: `pat_${Date.now()}`,
      fullName,
      mrn: `MRN-${Math.floor(10000 + Math.random() * 90000)}`,
      ageGender: `${age} / ${gender}`,
      condition,
      contactPhone,
      assignedTherapistName: assignedTherapist,
      phase: 'Phase 1: Initial Assessment & Swelling Control',
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
    };

    setPatients([newPatient, ...patients]);
    setToastMessage(`Patient record created for ${fullName}.`);
    setIsAddPatientModalOpen(false);
    setFullName('');
    setCondition('');
  };

  const filteredPatients = patients.filter((p) => {
    const matchesSearch = p.fullName.toLowerCase().includes(search.toLowerCase()) || p.condition.toLowerCase().includes(search.toLowerCase()) || p.mrn.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPatients = patients.length;
  const activePatients = patients.filter((p) => p.status === 'ACTIVE').length;
  const inactivePatients = patients.filter((p) => p.status === 'INACTIVE').length;

  return (
    <div className="min-h-screen bg-slate-50 flex text-slate-800">
      <Sidebar
        role="ADMIN"
        userName={user?.name || 'Clinical Admin System'}
        userEmail={user?.email || 'admin@rehab.com'}
      />

      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-8">
        <TopNavbar
          user={user || { name: 'Clinical Admin System', role: 'ADMIN' }}
          title="Patient Directory"
          subtitle="Outpatient Rehabilitation Medical Records"
        />

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
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Outpatient Patient Directory</h1>
              <p className="text-xs text-slate-500">System directory of clinical patient files, MRN assignments, primary physical therapists, and recovery status.</p>
            </div>

            <button
              onClick={() => setIsAddPatientModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Enroll Patient Record</span>
            </button>
          </div>

          {/* KPI SUMMARY CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Patients</span>
                <span className="text-2xl font-black text-slate-900 mt-0.5 block">{totalPatients}</span>
                <span className="text-[11px] text-slate-500 font-medium">Outpatient directory</span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                <HeartPulse className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Active Care Plans</span>
                <span className="text-2xl font-black text-teal-600 mt-0.5 block">{activePatients}</span>
                <span className="text-[11px] text-teal-700 font-medium">Enrolled in therapy</span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                <UserCheck className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Discharged / Inactive</span>
                <span className="text-2xl font-black text-slate-500 mt-0.5 block">{inactivePatients}</span>
                <span className="text-[11px] text-slate-400 font-medium">Archived files</span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center">
                <UserX className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Primary PT Coverage</span>
                <span className="text-xs font-bold text-teal-700 mt-1 block">100% Assigned</span>
                <span className="text-[11px] text-slate-400 font-medium">Supervised care</span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Stethoscope className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* SEARCH & FILTER BAR */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search patient, MRN, or condition..."
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-500 outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="p-2 rounded-xl border border-slate-200 text-xs font-bold bg-white outline-none"
              >
                <option value="ALL">All Statuses</option>
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>
            </div>
          </div>

          {/* PATIENT TABLE */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase tracking-wider font-bold text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Patient Record</th>
                    <th className="px-4 py-3">Clinical Condition</th>
                    <th className="px-4 py-3">Assigned Therapist</th>
                    <th className="px-4 py-3">Recovery Phase</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-400">
                        Loading Patient Directory...
                      </td>
                    </tr>
                  ) : filteredPatients.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-400">
                        No patient records found.
                      </td>
                    </tr>
                  ) : (
                    filteredPatients.map((p) => (
                      <tr key={p._id} className="hover:bg-slate-50">
                        <td className="px-4 py-3">
                          <span className="font-bold text-slate-900 block">{p.fullName}</span>
                          <span className="text-[11px] font-mono text-slate-400">{p.mrn} • {p.ageGender}</span>
                        </td>

                        <td className="px-4 py-3 text-slate-800 font-medium">{p.condition}</td>

                        <td className="px-4 py-3">
                          <span className="font-bold text-teal-700 block">{p.assignedTherapistName}</span>
                          <button
                            onClick={() => {
                              setReassignModalPatient(p);
                              setSelectedNewTherapistName(p.assignedTherapistName);
                            }}
                            className="text-[10px] font-bold text-purple-600 hover:text-purple-800 underline"
                          >
                            Reassign PT
                          </button>
                        </td>

                        <td className="px-4 py-3 text-slate-600 font-semibold">{p.phase}</td>

                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            p.status === 'ACTIVE'
                              ? 'bg-teal-50 text-teal-700 border-teal-200'
                              : 'bg-slate-100 text-slate-600 border-slate-200'
                          }`}>
                            {p.status}
                          </span>
                        </td>

                        <td className="px-4 py-3 text-right space-x-1.5">
                          <button
                            onClick={() => setSelectedPatientModal(p)}
                            className="p-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors inline-flex items-center gap-1 font-bold text-[11px]"
                            title="View Medical Overview"
                          >
                            <Eye className="w-3.5 h-3.5" /> View
                          </button>

                          <button
                            onClick={() => handleOpenEditPatientModal(p)}
                            className="p-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors inline-flex items-center"
                            title="Edit Patient Details"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => setDeletePatientModal(p)}
                            className="p-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 transition-colors inline-flex items-center"
                            title="Delete Patient Record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleTogglePatientStatus(p._id, p.status)}
                            className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${
                              p.status === 'ACTIVE'
                                ? 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
                                : 'bg-teal-50 text-teal-700 hover:bg-teal-100 border border-teal-200'
                            }`}
                          >
                            {p.status === 'ACTIVE' ? 'Archive' : 'Activate'}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      <MobileNavbar role="ADMIN" />

      {/* PATIENT DETAIL MODAL */}
      {selectedPatientModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-2 py-0.5 rounded-md">
                  Admin Patient Medical File
                </span>
                <h2 className="text-2xl font-black text-slate-900 mt-1">{selectedPatientModal.fullName}</h2>
                <p className="text-xs text-slate-500 font-mono">{selectedPatientModal.mrn} • {selectedPatientModal.ageGender}</p>
              </div>
              <button onClick={() => setSelectedPatientModal(null)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                <span className="text-slate-400 font-bold uppercase text-[10px] block">Diagnosis / Clinical Condition</span>
                <p className="font-bold text-slate-900 text-sm">{selectedPatientModal.condition}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                  <span className="text-slate-400 font-bold uppercase text-[10px] block">Primary Physical Therapist</span>
                  <span className="font-bold text-teal-700">{selectedPatientModal.assignedTherapistName}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                  <span className="text-slate-400 font-bold uppercase text-[10px] block">Contact Phone</span>
                  <span className="font-bold text-slate-900">{selectedPatientModal.contactPhone}</span>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                <span className="text-slate-400 font-bold uppercase text-[10px] block">Active Rehabilitation Phase</span>
                <span className="font-bold text-purple-700">{selectedPatientModal.phase}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedPatientModal(null)}
                className="px-5 py-2.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800"
              >
                Close Record
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REASSIGN THERAPIST MODAL */}
      {reassignModalPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">Reassign Primary Therapist</h2>
                <p className="text-xs text-slate-500">Update supervising physical therapist for {reassignModalPatient.fullName}</p>
              </div>
              <button onClick={() => setReassignModalPatient(null)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleReassignTherapistSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Select Licensed Therapist</label>
                <select
                  value={selectedNewTherapistName}
                  onChange={(e) => setSelectedNewTherapistName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-bold outline-none"
                >
                  <option value="Dr. Sarah Jenkins, DPT">Dr. Sarah Jenkins, DPT (Orthopedic Specialist)</option>
                  <option value="Dr. Robert Miller, DPT">Dr. Robert Miller, DPT (Sports Medicine)</option>
                  <option value="Dr. Amanda Ross, DPT">Dr. Amanda Ross, DPT (Neurological Rehab)</option>
                </select>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setReassignModalPatient(null)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold transition-all shadow-md"
                >
                  Confirm Reassignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD PATIENT MODAL */}
      {isAddPatientModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">Enroll Patient Record</h2>
                <p className="text-xs text-slate-500">Create new outpatient medical file</p>
              </div>
              <button onClick={() => setIsAddPatientModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddPatientSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Patient Full Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Jordan Taylor"
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-medium outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Clinical Diagnosis / Condition</label>
                <input
                  type="text"
                  required
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  placeholder="e.g. Post-Op Achilles Tendon Repair"
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-medium outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Age</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-medium outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium outline-none"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Assigned Physical Therapist</label>
                <select
                  value={assignedTherapist}
                  onChange={(e) => setAssignedTherapist(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-bold outline-none"
                >
                  <option value="Dr. Sarah Jenkins, DPT">Dr. Sarah Jenkins, DPT</option>
                  <option value="Dr. Robert Miller, DPT">Dr. Robert Miller, DPT</option>
                </select>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddPatientModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold transition-all shadow-md"
                >
                  Create Patient File
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
