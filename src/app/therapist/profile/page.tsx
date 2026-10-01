'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { TopNavbar } from '@/components/TopNavbar';
import { MobileNavbar } from '@/components/MobileNavbar';
import {
  User,
  ShieldCheck,
  Stethoscope,
  Mail,
  Phone,
  Building,
  Award,
  BookOpen,
  Lock,
  Bell,
  CheckCircle2,
  Save,
  Key,
} from 'lucide-react';

export default function TherapistProfilePage() {
  const [profile, setProfile] = useState({
    fullName: 'Dr. Sarah Jenkins, DPT',
    employeeId: 'PT-9042',
    position: 'Lead Physical Therapist & Clinical Supervisor',
    department: 'Outpatient Orthopedic Rehabilitation',
    specialization: 'Sports Medicine, Post-Op ACL Reconstruction & Joint Arthroplasty',
    experience: '8+ Years Clinical Practice',
    email: 'sarah.jenkins@rehabtrack.com',
    phone: '+1 (555) 902-3847',
    officeLocation: 'Outpatient Clinic Building B, Suite 204',
    qualifications: 'Doctor of Physical Therapy (DPT) - Johns Hopkins University',
    certifications: 'Board Certified Orthopedic Clinical Specialist (OCS), CSCS',
    bio: 'Specializing in evidence-based outpatient physical therapy, post-operative kinetic chain restoration, and real-time telehealth movement analysis.',
  });

  const [notificationPrefs, setNotificationPrefs] = useState({
    highPainAlerts: true,
    sessionCompletionDigests: true,
    appointmentReminders: true,
    emailNotifications: false,
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [toastMessage, setToastMessage] = useState('');

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    setToastMessage('Therapist professional profile updated successfully.');
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('New passwords do not match.');
      return;
    }
    setToastMessage('Account security credentials updated successfully.');
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex text-slate-800">
      <Sidebar role="THERAPIST" />

      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-8">
        <TopNavbar title="Therapist Staff Profile" subtitle="Clinical Credentials & Security Settings" />

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

          {/* PROFILE HERO HEADER */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-3xl bg-teal-600 text-white font-black text-3xl flex items-center justify-center border-4 border-teal-100 shadow-md">
                  SJ
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900">{profile.fullName}</h1>
                    <span className="px-3 py-1 rounded-full bg-teal-50 text-teal-700 border border-teal-200 text-xs font-bold">
                      Licensed PT
                    </span>
                    <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 text-xs font-mono font-semibold">
                      ID: {profile.employeeId}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm font-semibold text-teal-700">{profile.position}</p>
                  <p className="text-xs text-slate-500 font-medium">{profile.department} • {profile.experience}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs font-medium text-slate-700 w-full md:w-auto">
                <Building className="w-4 h-4 text-teal-600 flex-shrink-0" />
                <span>{profile.officeLocation}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 7 Cols: Professional Details Form */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
                <div className="flex items-center justify-between border-b pb-3">
                  <h2 className="font-bold text-slate-900 text-base flex items-center gap-2">
                    <Stethoscope className="w-5 h-5 text-teal-600" /> Professional & Clinical Information
                  </h2>
                </div>

                <form onSubmit={handleProfileSave} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Full Name & Credentials</label>
                      <input
                        type="text"
                        value={profile.fullName}
                        onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-slate-200 font-medium focus:ring-2 focus:ring-teal-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Employee Staff ID</label>
                      <input
                        type="text"
                        disabled
                        value={profile.employeeId}
                        className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-mono font-bold text-slate-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Email Address</label>
                      <input
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-slate-200 font-medium focus:ring-2 focus:ring-teal-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Contact Phone</label>
                      <input
                        type="text"
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-slate-200 font-medium focus:ring-2 focus:ring-teal-500 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Clinical Specialization</label>
                    <input
                      type="text"
                      value={profile.specialization}
                      onChange={(e) => setProfile({ ...profile, specialization: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 font-medium focus:ring-2 focus:ring-teal-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Board Certifications & Degrees</label>
                    <input
                      type="text"
                      value={profile.certifications}
                      onChange={(e) => setProfile({ ...profile, certifications: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 font-medium focus:ring-2 focus:ring-teal-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Clinical Biography & Philosophy</label>
                    <textarea
                      value={profile.bio}
                      onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                      className="w-full p-3 rounded-xl border border-slate-200 font-medium focus:ring-2 focus:ring-teal-500 outline-none h-24"
                    />
                  </div>

                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition-all shadow-xs"
                  >
                    <Save className="w-4 h-4" /> Save Profile Modifications
                  </button>
                </form>
              </div>
            </div>

            {/* Right 5 Cols: Security & Preferences */}
            <div className="lg:col-span-5 space-y-6">
              {/* Account Security Card */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <h2 className="font-bold text-slate-900 text-base flex items-center gap-2 border-b pb-3">
                  <Key className="w-5 h-5 text-purple-600" /> Account Security & Password
                </h2>

                <form onSubmit={handlePasswordSubmit} className="space-y-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Current Password</label>
                    <input
                      type="password"
                      required
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                      placeholder="••••••••"
                      className="w-full p-2.5 rounded-xl border border-slate-200 font-medium focus:ring-2 focus:ring-teal-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">New Password</label>
                    <input
                      type="password"
                      required
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                      placeholder="••••••••"
                      className="w-full p-2.5 rounded-xl border border-slate-200 font-medium focus:ring-2 focus:ring-teal-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Confirm New Password</label>
                    <input
                      type="password"
                      required
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                      placeholder="••••••••"
                      className="w-full p-2.5 rounded-xl border border-slate-200 font-medium focus:ring-2 focus:ring-teal-500 outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all shadow-xs"
                  >
                    Update Password
                  </button>
                </form>
              </div>

              {/* Notification Preferences */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <h2 className="font-bold text-slate-900 text-base flex items-center gap-2 border-b pb-3">
                  <Bell className="w-5 h-5 text-amber-600" /> Clinical Notification Settings
                </h2>

                <div className="space-y-3 text-xs">
                  <label className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 cursor-pointer">
                    <span className="font-bold text-slate-800">High Pain VAS Alerts (&gt; 5/10)</span>
                    <input
                      type="checkbox"
                      checked={notificationPrefs.highPainAlerts}
                      onChange={(e) => setNotificationPrefs({ ...notificationPrefs, highPainAlerts: e.target.checked })}
                      className="w-4 h-4 accent-teal-600 rounded"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 cursor-pointer">
                    <span className="font-bold text-slate-800">Session Completion Digests</span>
                    <input
                      type="checkbox"
                      checked={notificationPrefs.sessionCompletionDigests}
                      onChange={(e) => setNotificationPrefs({ ...notificationPrefs, sessionCompletionDigests: e.target.checked })}
                      className="w-4 h-4 accent-teal-600 rounded"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 cursor-pointer">
                    <span className="font-bold text-slate-800">Schedule Appointment Reminders</span>
                    <input
                      type="checkbox"
                      checked={notificationPrefs.appointmentReminders}
                      onChange={(e) => setNotificationPrefs({ ...notificationPrefs, appointmentReminders: e.target.checked })}
                      className="w-4 h-4 accent-teal-600 rounded"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <MobileNavbar role="THERAPIST" />
    </div>
  );
}
