'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { TopNavbar } from '@/components/TopNavbar';
import { MobileNavbar } from '@/components/MobileNavbar';
import {
  Bell,
  CheckCircle2,
  ShieldCheck,
  UserPlus,
  HeartPulse,
  Dumbbell,
  AlertTriangle,
  Clock,
  Filter,
  Check,
} from 'lucide-react';

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState([
    {
      id: 'n1',
      title: 'Security Audit & Compliance Check',
      message: 'Monthly system-wide security audit completed. All RBAC rules and database connections verified operational.',
      time: '10 minutes ago',
      category: 'SYSTEM',
      read: false,
      priority: 'HIGH',
      icon: ShieldCheck,
      color: 'text-purple-600 bg-purple-50',
    },
    {
      id: 'n2',
      title: 'New Patient Enrolled: Jordan Taylor',
      message: 'Patient record created under Dr. Sarah Jenkins for Post-Op Achilles Tendon Repair.',
      time: '1 hour ago',
      category: 'CLINICAL',
      read: false,
      priority: 'NORMAL',
      icon: HeartPulse,
      color: 'text-teal-600 bg-teal-50',
    },
    {
      id: 'n3',
      title: 'Therapist Onboarding: Dr. Amanda Ross, DPT',
      message: 'New licensed physical therapist added to Neurological Rehabilitation department.',
      time: '3 hours ago',
      category: 'USERS',
      read: true,
      priority: 'NORMAL',
      icon: UserPlus,
      color: 'text-blue-600 bg-blue-50',
    },
    {
      id: 'n4',
      title: 'Global Exercise Added: Closed Chain Squats',
      message: 'New master exercise protocol added to global catalog with default 3 sets x 10 reps.',
      time: 'Yesterday at 4:30 PM',
      category: 'CLINICAL',
      read: true,
      priority: 'NORMAL',
      icon: Dumbbell,
      color: 'text-emerald-600 bg-emerald-50',
    },
    {
      id: 'n5',
      title: 'Platform Session Volume Milestone',
      message: 'Total recorded outpatient exercise sessions crossed 150 completed sessions.',
      time: '2 days ago',
      category: 'SYSTEM',
      read: true,
      priority: 'NORMAL',
      icon: Bell,
      color: 'text-amber-600 bg-amber-50',
    },
  ]);

  const [activeTab, setActiveTab] = useState('ALL');

  const handleMarkAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const handleToggleRead = (id: string) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: !n.read } : n)));
  };

  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === 'UNREAD') return !n.read;
    if (activeTab !== 'ALL') return n.category === activeTab;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-slate-50 flex text-slate-800">
      <Sidebar role="ADMIN" />

      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-8">
        <TopNavbar title="System Alerts & Notifications" subtitle="Admin System Feed" />

        <main className="max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          {/* PAGE HEADER */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">System Alerts</h1>
                {unreadCount > 0 && (
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-600 text-white font-extrabold text-xs">
                    {unreadCount} New
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">Security audits, user registrations, patient enrollments, and system logs.</p>
            </div>

            <button
              onClick={handleMarkAllRead}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-all shadow-xs"
            >
              <Check className="w-4 h-4 text-purple-600" />
              <span>Mark All as Read</span>
            </button>
          </div>

          {/* FILTER PILLS */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {['ALL', 'UNREAD', 'SYSTEM', 'USERS', 'CLINICAL'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === tab
                    ? 'bg-purple-700 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* NOTIFICATION FEED LIST */}
          <div className="space-y-3">
            {filteredNotifications.length === 0 ? (
              <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3">
                <Bell className="w-10 h-10 text-slate-300 mx-auto" />
                <h3 className="font-bold text-slate-700 text-sm">No notifications found</h3>
                <p className="text-xs text-slate-400">You are all caught up with system alerts.</p>
              </div>
            ) : (
              filteredNotifications.map((item) => {
                const IconComponent = item.icon;
                return (
                  <div
                    key={item.id}
                    className={`bg-white p-4 sm:p-5 rounded-2xl border transition-all flex items-start gap-4 shadow-xs ${
                      !item.read ? 'border-purple-200 bg-purple-50/20' : 'border-slate-200'
                    }`}
                  >
                    <div className={`p-3 rounded-xl ${item.color} flex items-center justify-center shrink-0`}>
                      <IconComponent className="w-5 h-5" />
                    </div>

                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                          {item.title}
                          {!item.read && <span className="w-2 h-2 rounded-full bg-purple-600 inline-block" />}
                        </h3>
                        <span className="text-[11px] text-slate-400 font-medium">{item.time}</span>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed font-medium">{item.message}</p>

                      <div className="pt-2 flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-bold uppercase">
                          {item.category}
                        </span>
                        <button
                          onClick={() => handleToggleRead(item.id)}
                          className="text-[11px] font-bold text-purple-600 hover:text-purple-800"
                        >
                          {item.read ? 'Mark as Unread' : 'Mark as Read'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </main>
      </div>

      <MobileNavbar role="ADMIN" />
    </div>
  );
}
