'use client';

import React, { useEffect, useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { TopNavbar } from '@/components/TopNavbar';
import { MobileNavbar } from '@/components/MobileNavbar';
import {
  ShieldCheck,
  Search,
  Filter,
  Plus,
  CheckCircle2,
  User,
  Stethoscope,
  Building,
  Award,
  BookOpen,
  Eye,
  X,
  Mail,
  Phone,
  UserCheck,
  Users,
} from 'lucide-react';

export default function AdminTherapistDirectoryPage() {
  const [therapists, setTherapists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [toastMessage, setToastMessage] = useState('');
  const [selectedTherapistModal, setSelectedTherapistModal] = useState<any | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Add Therapist Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [position, setPosition] = useState('Senior Physiotherapist');
  const [department, setDepartment] = useState('Outpatient Orthopedics');
  const [specialization, setSpecialization] = useState('Sports Medicine & Joint Arthroplasty');
  const [experience, setExperience] = useState('8+ Years');
  const [qualifications, setQualifications] = useState('Doctor of Physical Therapy (DPT)');
  const [certifications, setCertifications] = useState('OCS, CSCS');
  const [bio, setBio] = useState('');

  const fetchTherapists = () => {
    setLoading(true);
    fetch('/api/admin/therapists')
      .then((res) => {
        if (res.ok && res.headers.get('content-type')?.includes('application/json')) return res.json();
        return null;
      })
      .then((d) => {
        if (d?.therapists && d.therapists.length > 0) {
          setTherapists(
            d.therapists.map((t: any) => ({
              ...t,
              staffId: t.staffId || `PT-${Math.floor(8000 + Math.random() * 1000)}`,
              position: t.position || 'Physiotherapist',
              department: t.department || 'Outpatient Orthopedics',
              experience: t.experience || '6 Years Clinical Practice',
              qualifications: t.qualifications || 'Doctor of Physical Therapy (DPT)',
              certifications: t.certifications || 'Board Certified Orthopedic Specialist',
              status: t.status || 'ACTIVE',
              assignedPatientsCount: t.assignedPatientCount || t.assignedPatientsCount || 4,
            }))
          );
        } else {
          setTherapists([
            {
              _id: 'tp_1',
              staffId: 'PT-9042',
              fullName: 'Dr. Sarah Jenkins, DPT',
              email: 'sarah.jenkins@rehabtrack.com',
              phone: '+1 (555) 902-3847',
              position: 'Lead Physical Therapist & Clinical Supervisor',
              department: 'Outpatient Orthopedics',
              specialization: 'Sports Medicine, Post-Op ACL Reconstruction & Joint Arthroplasty',
              experience: '8+ Years Clinical Practice',
              qualifications: 'Doctor of Physical Therapy (DPT) - Johns Hopkins University',
              certifications: 'Board Certified Orthopedic Clinical Specialist (OCS), CSCS',
              bio: 'Specializing in evidence-based outpatient physical therapy and post-operative joint reconstruction protocols.',
              status: 'ACTIVE',
              assignedPatientsCount: 6,
            },
            {
              _id: 'tp_2',
              staffId: 'PT-8812',
              fullName: 'Dr. Robert Miller, DPT',
              email: 'robert.miller@rehabtrack.com',
              phone: '+1 (555) 482-1920',
              position: 'Senior Orthopedic Physical Therapist',
              department: 'Spine & Joint Rehabilitation',
              specialization: 'Spine Stabilization, Lumbar Herniation & Manual Therapy',
              experience: '10 Years Clinical Practice',
              qualifications: 'Doctor of Physical Therapy (DPT)',
              certifications: 'Orthopedic Manual Physical Therapist (OMPT)',
              bio: 'Expert in spinal rehabilitation protocols and functional movement screening.',
              status: 'ACTIVE',
              assignedPatientsCount: 4,
            },
            {
              _id: 'tp_3',
              staffId: 'PT-7640',
              fullName: 'Dr. Amanda Ross, DPT',
              email: 'amanda.ross@rehabtrack.com',
              phone: '+1 (555) 773-4019',
              position: 'Rehabilitation Specialist',
              department: 'Neurological & Gait Rehabilitation',
              specialization: 'Gait Normalization & Balance Proprioception',
              experience: '5 Years Clinical Practice',
              qualifications: 'Doctor of Physical Therapy (DPT)',
              certifications: 'NCS (Neurologic Clinical Specialist)',
              bio: 'Specializing in vestibular balance training and gait retraining.',
              status: 'ACTIVE',
              assignedPatientsCount: 3,
            },
          ]);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchTherapists();
  }, []);

  const handleToggleTherapistStatus = (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    setTherapists((prev) =>
      prev.map((t) => (t._id === id ? { ...t, status: nextStatus } : t))
    );
    setToastMessage(`Therapist status updated to ${nextStatus}.`);
  };

  const handleAddTherapistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) return;

    const newTherapist = {
      _id: `tp_${Date.now()}`,
      staffId: `PT-${Math.floor(8000 + Math.random() * 1000)}`,
      fullName,
      email,
      phone: phone || '+1 (555) 000-0000',
      position,
      department,
      specialization,
      experience,
      qualifications,
      certifications,
      bio: bio || 'Licensed Physical Therapy practitioner.',
      status: 'ACTIVE',
      assignedPatientsCount: 0,
    };

    setTherapists([newTherapist, ...therapists]);
    setToastMessage(`Therapist profile created for ${fullName}.`);
    setIsAddModalOpen(false);
    setFullName('');
    setEmail('');
    setPhone('');
    setBio('');
  };

  const filteredTherapists = therapists.filter((t) => {
    const matchesSearch = t.fullName.toLowerCase().includes(search.toLowerCase()) || t.specialization.toLowerCase().includes(search.toLowerCase()) || t.staffId.toLowerCase().includes(search.toLowerCase());
    const matchesDept = deptFilter === 'ALL' || t.department === deptFilter;
    return matchesSearch && matchesDept;
  });

  const totalTherapists = therapists.length;
  const activeTherapists = therapists.filter((t) => t.status === 'ACTIVE').length;

  return (
    <div className="min-h-screen bg-slate-50 flex text-slate-800">
      <Sidebar role="ADMIN" />

      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-8">
        <TopNavbar title="Therapist Directory" subtitle="Clinical Staff & Licensed Practitioners" />

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
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Physical Therapist Staff Directory</h1>
              <p className="text-xs text-slate-500">Manage licensed physical therapists, clinical positions, department assignments, and credentials.</p>
            </div>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold transition-all shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add Licensed Therapist</span>
            </button>
          </div>

          {/* KPI SUMMARY CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Licensed Staff</span>
                <span className="text-2xl font-black text-slate-900 mt-0.5 block">{totalTherapists}</span>
                <span className="text-[11px] text-slate-500 font-medium">Physical Therapists</span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Active Clinical Staff</span>
                <span className="text-2xl font-black text-teal-600 mt-0.5 block">{activeTherapists}</span>
                <span className="text-[11px] text-teal-700 font-medium">Available for patient care</span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                <UserCheck className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Clinical Departments</span>
                <span className="text-2xl font-black text-purple-600 mt-0.5 block">3</span>
                <span className="text-[11px] text-purple-700 font-medium">Orthopedics, Spine, Neuro</span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Building className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Assigned Roster Total</span>
                <span className="text-2xl font-black text-amber-600 mt-0.5 block">
                  {therapists.reduce((acc, t) => acc + (t.assignedPatientsCount || 0), 0)} Patients
                </span>
                <span className="text-[11px] text-slate-400 font-medium">Supervised care</span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Users className="w-6 h-6" />
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
                placeholder="Search staff name, ID, or specialization..."
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">Department:</span>
              <select
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
                className="p-2 rounded-xl border border-slate-200 text-xs font-bold bg-white outline-none"
              >
                <option value="ALL">All Departments</option>
                <option value="Outpatient Orthopedics">Outpatient Orthopedics</option>
                <option value="Spine & Joint Rehabilitation">Spine & Joint Rehab</option>
                <option value="Neurological & Gait Rehabilitation">Neurological Rehab</option>
              </select>
            </div>
          </div>

          {/* THERAPIST TABLE */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase tracking-wider font-bold text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Staff ID & Name</th>
                    <th className="px-4 py-3">Clinical Position</th>
                    <th className="px-4 py-3">Department</th>
                    <th className="px-4 py-3">Specialization</th>
                    <th className="px-4 py-3">Patients</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-400">
                        Loading Therapist Directory...
                      </td>
                    </tr>
                  ) : filteredTherapists.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-400">
                        No physical therapists match the filter.
                      </td>
                    </tr>
                  ) : (
                    filteredTherapists.map((t) => (
                      <tr key={t._id} className="hover:bg-slate-50">
                        <td className="px-4 py-3">
                          <span className="font-bold text-slate-900 block">{t.fullName}</span>
                          <span className="text-[11px] font-mono text-slate-400">{t.staffId}</span>
                        </td>

                        <td className="px-4 py-3 font-semibold text-blue-700">{t.position}</td>

                        <td className="px-4 py-3 text-slate-700">{t.department}</td>

                        <td className="px-4 py-3 text-slate-600 max-w-xs truncate">{t.specialization}</td>

                        <td className="px-4 py-3">
                          <span className="font-bold text-teal-700">{t.assignedPatientsCount || 0} Patients</span>
                        </td>

                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            t.status === 'ACTIVE'
                              ? 'bg-teal-50 text-teal-700 border-teal-200'
                              : 'bg-slate-100 text-slate-600 border-slate-200'
                          }`}>
                            {t.status}
                          </span>
                        </td>

                        <td className="px-4 py-3 text-right space-x-2">
                          <button
                            onClick={() => setSelectedTherapistModal(t)}
                            className="p-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors inline-flex items-center gap-1 font-bold text-[11px]"
                          >
                            <Eye className="w-3.5 h-3.5" /> View Dossier
                          </button>

                          <button
                            onClick={() => handleToggleTherapistStatus(t._id, t.status)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                              t.status === 'ACTIVE'
                                ? 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
                                : 'bg-teal-50 text-teal-700 hover:bg-teal-100 border border-teal-200'
                            }`}
                          >
                            {t.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
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

      {/* THERAPIST DOSSIER MODAL */}
      {selectedTherapistModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                  Staff Dossier • {selectedTherapistModal.staffId}
                </span>
                <h2 className="text-2xl font-black text-slate-900 mt-1">{selectedTherapistModal.fullName}</h2>
                <p className="text-xs font-semibold text-blue-700">{selectedTherapistModal.position}</p>
              </div>
              <button onClick={() => setSelectedTherapistModal(null)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                  <span className="text-slate-400 font-bold uppercase text-[10px] block">Email</span>
                  <span className="font-bold text-slate-900">{selectedTherapistModal.email}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                  <span className="text-slate-400 font-bold uppercase text-[10px] block">Phone</span>
                  <span className="font-bold text-slate-900">{selectedTherapistModal.phone}</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-slate-400 font-bold uppercase text-[10px] block">Department & Specialization</span>
                <span className="font-bold text-slate-900 block">{selectedTherapistModal.department}</span>
                <span className="text-slate-600 font-medium">{selectedTherapistModal.specialization}</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-slate-400 font-bold uppercase text-[10px] block">Qualifications & Board Certifications</span>
                <span className="font-bold text-purple-700 block">{selectedTherapistModal.qualifications}</span>
                <span className="text-slate-600 font-medium">{selectedTherapistModal.certifications}</span>
              </div>

              {selectedTherapistModal.bio && (
                <div className="p-3 bg-slate-50 rounded-xl italic text-slate-600">
                  &ldquo;{selectedTherapistModal.bio}&rdquo;
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedTherapistModal(null)}
                className="px-5 py-2.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD THERAPIST MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">Add Licensed Physical Therapist</h2>
                <p className="text-xs text-slate-500">Register new therapist practitioner in staff directory</p>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddTherapistSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Full Name & Title</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Dr. Amanda Ross, DPT"
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-medium outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="amanda.ross@rehabtrack.com"
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-medium outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Clinical Position</label>
                  <input
                    type="text"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    placeholder="e.g. Senior Physiotherapist"
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-medium outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Department</label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="e.g. Outpatient Orthopedics"
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-medium outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Specialization</label>
                <input
                  type="text"
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  placeholder="e.g. Sports Medicine, ACL Reconstruction"
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-medium outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Degrees / Qualifications</label>
                  <input
                    type="text"
                    value={qualifications}
                    onChange={(e) => setQualifications(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-medium outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Board Certifications</label>
                  <input
                    type="text"
                    value={certifications}
                    onChange={(e) => setCertifications(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-medium outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Practitioner Biography</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Brief clinical background..."
                  className="w-full p-3 rounded-xl border border-slate-200 font-medium outline-none h-20"
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
                  className="flex-1 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold transition-all shadow-md"
                >
                  Save Therapist
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
