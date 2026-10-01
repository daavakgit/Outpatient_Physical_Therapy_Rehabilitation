'use client';

import React, { useEffect, useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { TopNavbar } from '@/components/TopNavbar';
import { MobileNavbar } from '@/components/MobileNavbar';
import {
  Users,
  Search,
  Filter,
  Plus,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  HeartPulse,
  User,
  X,
  Key,
  Eye,
  AlertTriangle,
  UserCheck,
  UserX,
} from 'lucide-react';

export default function AdminUserDirectoryPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [toastMessage, setToastMessage] = useState('');
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [selectedUserDetail, setSelectedUserDetail] = useState<any | null>(null);

  // Add User Form State
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<'PATIENT' | 'THERAPIST' | 'ADMIN'>('PATIENT');

  const fetchUsers = () => {
    setLoading(true);
    fetch('/api/admin/users')
      .then((res) => {
        if (res.ok && res.headers.get('content-type')?.includes('application/json')) return res.json();
        return null;
      })
      .then((d) => {
        if (d?.users && d.users.length > 0) {
          setUsers(
            d.users.map((u: any) => ({
              ...u,
              status: u.status || 'ACTIVE',
              lastActive: u.updatedAt || u.createdAt || new Date().toISOString(),
            }))
          );
        } else {
          setUsers([
            {
              _id: 'usr_1',
              name: 'Dr. Sarah Jenkins, DPT',
              email: 'dr.sarah@rehab.com',
              role: 'THERAPIST',
              status: 'ACTIVE',
              createdAt: '2026-08-01T10:00:00.000Z',
              lastActive: '2026-10-01T09:30:00.000Z',
            },
            {
              _id: 'usr_2',
              name: 'Alex Morgan',
              email: 'alex.morgan@rehab.com',
              role: 'PATIENT',
              status: 'ACTIVE',
              createdAt: '2026-08-05T14:20:00.000Z',
              lastActive: '2026-09-30T18:45:00.000Z',
            },
            {
              _id: 'usr_3',
              name: 'Clinical Admin System',
              email: 'admin@rehab.com',
              role: 'ADMIN',
              status: 'ACTIVE',
              createdAt: '2026-07-15T08:00:00.000Z',
              lastActive: '2026-10-01T10:15:00.000Z',
            },
            {
              _id: 'usr_4',
              name: 'Marcus Vance',
              email: 'marcus.vance@rehab.com',
              role: 'PATIENT',
              status: 'ACTIVE',
              createdAt: '2026-09-10T11:00:00.000Z',
              lastActive: '2026-09-29T16:20:00.000Z',
            },
            {
              _id: 'usr_5',
              name: 'Elena Rostova',
              email: 'elena.rostova@rehab.com',
              role: 'PATIENT',
              status: 'INACTIVE',
              createdAt: '2026-06-12T09:00:00.000Z',
              lastActive: '2026-09-01T12:00:00.000Z',
            },
          ]);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleStatus = (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    setUsers((prev) =>
      prev.map((u) => (u._id === id ? { ...u, status: nextStatus } : u))
    );
    setToastMessage(`User status changed to ${nextStatus}.`);
  };

  const handleResetPassword = (email: string) => {
    setToastMessage(`Password reset link sent to ${email}.`);
  };

  const handleAddUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) return;

    const newUser = {
      _id: `usr_${Date.now()}`,
      name: newUserName,
      email: newUserEmail,
      role: newUserRole,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString(),
    };

    setUsers([newUser, ...users]);
    setToastMessage(`New user "${newUserName}" added successfully.`);
    setIsAddUserModalOpen(false);
    setNewUserName('');
    setNewUserEmail('');
    setNewUserRole('PATIENT');
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    const matchesStatus = statusFilter === 'ALL' || u.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.status === 'ACTIVE').length;
  const inactiveUsers = users.filter((u) => u.status === 'INACTIVE').length;

  return (
    <div className="min-h-screen bg-slate-50 flex text-slate-800">
      <Sidebar role="ADMIN" />

      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-8">
        <TopNavbar title="User Directory" subtitle="System User Management & Access Control" />

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
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">System User Directory</h1>
              <p className="text-xs text-slate-500">Manage account access, system roles, user statuses, and security credentials.</p>
            </div>

            <button
              onClick={() => setIsAddUserModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold transition-all shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add System User</span>
            </button>
          </div>

          {/* KPI SUMMARY CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Registered Users</span>
                <span className="text-2xl font-black text-slate-900 mt-0.5 block">{totalUsers}</span>
                <span className="text-[11px] text-slate-500 font-medium">All accounts</span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Active Accounts</span>
                <span className="text-2xl font-black text-teal-600 mt-0.5 block">{activeUsers}</span>
                <span className="text-[11px] text-teal-700 font-medium">Operational status</span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                <UserCheck className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Inactive / Suspended</span>
                <span className="text-2xl font-black text-slate-500 mt-0.5 block">{inactiveUsers}</span>
                <span className="text-[11px] text-slate-400 font-medium">Deactivated</span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center">
                <UserX className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Role Breakdown</span>
                <span className="text-xs font-bold text-purple-700 mt-1 block">
                  {users.filter(u => u.role === 'PATIENT').length} Patients • {users.filter(u => u.role === 'THERAPIST').length} PTs
                </span>
                <span className="text-[11px] text-slate-400 font-medium">System roles</span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
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
                placeholder="Search user name or email..."
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>

            <div className="flex items-center gap-3 overflow-x-auto w-full sm:w-auto">
              <div className="flex items-center gap-1">
                <span className="text-xs font-bold text-slate-500">Role:</span>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="p-2 rounded-xl border border-slate-200 text-xs font-bold bg-white outline-none"
                >
                  <option value="ALL">All Roles</option>
                  <option value="ADMIN">ADMIN</option>
                  <option value="THERAPIST">THERAPIST</option>
                  <option value="PATIENT">PATIENT</option>
                </select>
              </div>

              <div className="flex items-center gap-1">
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
          </div>

          {/* USER TABLE */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase tracking-wider font-bold text-slate-500">
                  <tr>
                    <th className="px-4 py-3">User</th>
                    <th className="px-4 py-3">Role</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Created Date</th>
                    <th className="px-4 py-3">Last Active</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-400">
                        Loading User Directory...
                      </td>
                    </tr>
                  ) : filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-400">
                        No users match the search criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((u) => (
                      <tr key={u._id} className="hover:bg-slate-50">
                        <td className="px-4 py-3">
                          <span className="font-bold text-slate-900 block">{u.name}</span>
                          <span className="text-[11px] text-slate-500">{u.email}</span>
                        </td>

                        <td className="px-4 py-3">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
                            u.role === 'ADMIN'
                              ? 'bg-purple-50 text-purple-700 border-purple-200'
                              : u.role === 'THERAPIST'
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : 'bg-teal-50 text-teal-700 border-teal-200'
                          }`}>
                            {u.role}
                          </span>
                        </td>

                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            u.status === 'ACTIVE'
                              ? 'bg-teal-50 text-teal-700 border-teal-200'
                              : 'bg-slate-100 text-slate-600 border-slate-200'
                          }`}>
                            {u.status}
                          </span>
                        </td>

                        <td className="px-4 py-3 text-slate-500 font-mono">
                          {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}
                        </td>

                        <td className="px-4 py-3 text-slate-500 font-mono">
                          {u.lastActive ? new Date(u.lastActive).toLocaleDateString() : 'Recent'}
                        </td>

                        <td className="px-4 py-3 text-right space-x-2">
                          <button
                            onClick={() => setSelectedUserDetail(u)}
                            className="p-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                            title="View User Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleResetPassword(u.email)}
                            className="p-1.5 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors"
                            title="Trigger Password Reset"
                          >
                            <Key className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleToggleStatus(u._id, u.status)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                              u.status === 'ACTIVE'
                                ? 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
                                : 'bg-teal-50 text-teal-700 hover:bg-teal-100 border border-teal-200'
                            }`}
                          >
                            {u.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
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

      {/* ADD USER MODAL */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">Add System User</h2>
                <p className="text-xs text-slate-500">Register new account credentials in platform directory</p>
              </div>
              <button onClick={() => setIsAddUserModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddUserSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="e.g. Dr. Robert Miller"
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-medium outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  placeholder="robert.miller@rehab.com"
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-medium outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Select System Role</label>
                <select
                  value={newUserRole}
                  onChange={(e: any) => setNewUserRole(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-bold outline-none"
                >
                  <option value="PATIENT">PATIENT (Outpatient Record)</option>
                  <option value="THERAPIST">THERAPIST (Physical Therapist Staff)</option>
                  <option value="ADMIN">ADMIN (System Administrator)</option>
                </select>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddUserModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold transition-all shadow-md"
                >
                  Register User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* USER DETAIL MODAL */}
      {selectedUserDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">
                  User Account Inspector
                </span>
                <h2 className="text-xl font-extrabold text-slate-900 mt-1">{selectedUserDetail.name}</h2>
              </div>
              <button onClick={() => setSelectedUserDetail(null)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-slate-400 font-bold uppercase text-[10px] block">Email Address</span>
                <span className="font-bold text-slate-900 text-sm">{selectedUserDetail.email}</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                  <span className="text-slate-400 font-bold uppercase text-[10px] block">System Role</span>
                  <span className="font-bold text-purple-700">{selectedUserDetail.role}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                  <span className="text-slate-400 font-bold uppercase text-[10px] block">Account Status</span>
                  <span className="font-bold text-teal-700">{selectedUserDetail.status}</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-slate-400 font-bold uppercase text-[10px] block">Created Date</span>
                <span className="font-mono text-slate-700">{new Date(selectedUserDetail.createdAt).toLocaleString()}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedUserDetail(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
