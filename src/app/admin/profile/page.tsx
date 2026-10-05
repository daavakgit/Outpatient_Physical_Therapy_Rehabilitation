'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { TopNavbar } from '@/components/TopNavbar';
import { MobileNavbar } from '@/components/MobileNavbar';
import {
  User,
  Mail,
  Phone,
  ShieldCheck,
  Key,
  CheckCircle2,
  Bell,
  Lock,
  Building,
  Save,
} from 'lucide-react';

export default function AdminProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [name, setName] = useState('Clinical Admin System');
  const [email, setEmail] = useState('admin@rehab.com');
  const [phone, setPhone] = useState('+1 (555) 019-2831');
  const [toastMessage, setToastMessage] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => (res.ok && res.headers.get('content-type')?.includes('application/json') ? res.json() : null))
      .then((data) => {
        if (data?.user) {
          setUser(data.user);
          setName(data.user.name || 'Clinical Admin System');
          setEmail(data.user.email || 'admin@rehab.com');
        }
      })
      .catch(() => {});
  }, []);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setToastMessage('Admin profile information updated successfully.');
  };

  const handleChangePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword) return;
    setToastMessage('Admin account password updated successfully.');
    setIsChangingPassword(false);
    setOldPassword('');
    setNewPassword('');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex text-slate-800">
      <Sidebar
        role="ADMIN"
        userName={user?.name || name || 'Clinical Admin System'}
        userEmail={user?.email || email || 'admin@rehab.com'}
      />

      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-8">
        <TopNavbar
          user={user || { name: name || 'Clinical Admin System', role: 'ADMIN' }}
          title="Administrator Profile"
          subtitle="Account Settings & Security Credentials"
        />

        <main className="max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
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

          {/* PROFILE CARD */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="bg-gradient-to-r from-purple-900 to-slate-900 h-32 p-6 flex items-end">
              <span className="px-3 py-1 bg-white/20 text-white rounded-full text-[11px] font-bold uppercase tracking-wider backdrop-blur-md">
                System Administrator
              </span>
            </div>

            <div className="p-6 sm:p-8 space-y-6 relative -mt-12">
              <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-2xl bg-purple-700 text-white font-black text-2xl flex items-center justify-center shadow-lg border-4 border-white">
                    AD
                  </div>
                  <div>
                    <h1 className="text-xl font-black text-slate-900">{name}</h1>
                    <p className="text-xs text-slate-500 font-medium">{email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-xs font-extrabold">
                    ROLE: ADMIN
                  </span>
                  <span className="px-3 py-1 rounded-full bg-teal-50 text-teal-700 border border-teal-200 text-xs font-extrabold">
                    STATUS: ACTIVE
                  </span>
                </div>
              </div>

              {/* FORM */}
              <form onSubmit={handleSaveProfile} className="space-y-4 text-xs pt-4 border-t border-slate-100">
                <h3 className="font-bold text-slate-900 text-sm">Personal & Administrative Details</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full p-3 rounded-xl border border-slate-200 font-medium outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full p-3 rounded-xl border border-slate-200 font-medium outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full p-3 rounded-xl border border-slate-200 font-medium outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">System Organization</label>
                    <input
                      type="text"
                      readOnly
                      value="Outpatient Physical Therapy Rehabilitation System"
                      className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 font-bold text-slate-700 outline-none cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold transition-all shadow-md"
                  >
                    <Save className="w-4 h-4" /> Save Profile Details
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* SECURITY & PASSWORD SECTION */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Lock className="w-4 h-4 text-purple-600" /> Admin Security Credentials
                </h3>
                <p className="text-xs text-slate-500">Manage system authentication password and security keys.</p>
              </div>

              <button
                onClick={() => setIsChangingPassword(!isChangingPassword)}
                className="px-4 py-2 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 text-xs font-bold transition-all border border-purple-200"
              >
                {isChangingPassword ? 'Cancel' : 'Change Password'}
              </button>
            </div>

            {isChangingPassword && (
              <form onSubmit={handleChangePasswordSubmit} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Current Password</label>
                  <input
                    type="password"
                    required
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-medium outline-none bg-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">New Administrator Password</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-medium outline-none bg-white"
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white font-bold rounded-xl shadow-sm"
                  >
                    Update Password
                  </button>
                </div>
              </form>
            )}
          </div>
        </main>
      </div>

      <MobileNavbar role="ADMIN" />
    </div>
  );
}
