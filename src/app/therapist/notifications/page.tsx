'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { TopNavbar } from '@/components/TopNavbar';
import { MobileNavbar } from '@/components/MobileNavbar';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  UserPlus,
  Award,
  Calendar,
  MessageSquare,
  Clock,
  Filter,
  Check,
  Trash2,
} from 'lucide-react';

export default function TherapistNotificationsPage() {
  const [notifications, setNotifications] = useState([
    {
      id: 'notif_1',
      category: 'High Pain Feedback',
      title: 'High VAS Pain Reported by Marcus Vance',
      desc: 'Marcus reported VAS 6.2/10 pain during Pendulum Swings session. Consider adjusting tension resistance.',
      time: '15 mins ago',
      read: false,
      icon: AlertTriangle,
      color: 'bg-red-50 text-red-600 border-red-200',
    },
    {
      id: 'notif_2',
      category: 'Milestone Achievement',
      title: 'Alex Morgan Cleared Phase 1 Benchmark',
      desc: 'Flexion achieved 115 degrees with zero extension lag during automated ROM test.',
      time: '1 hour ago',
      read: false,
      icon: Award,
      color: 'bg-teal-50 text-teal-600 border-teal-200',
    },
    {
      id: 'notif_3',
      category: 'Session Completed',
      title: 'Elena Rostova Completed Daily Routine',
      desc: '3 sets of 12 closed chain squats logged with 100% adherence rate.',
      time: '3 hours ago',
      read: true,
      icon: CheckCircle2,
      color: 'bg-blue-50 text-blue-600 border-blue-200',
    },
    {
      id: 'notif_4',
      category: 'New Patient',
      title: 'New Patient Assigned: David Sterling',
      desc: 'David Sterling assigned for Lumbar Disc Herniation (L4-L5) rehabilitation protocol.',
      time: 'Yesterday, 4:00 PM',
      read: true,
      icon: UserPlus,
      color: 'bg-purple-50 text-purple-600 border-purple-200',
    },
    {
      id: 'notif_5',
      category: 'Appointment Reminder',
      title: 'Upcoming Clinical Visit: Alex Morgan',
      desc: '1-on-1 consultation scheduled for tomorrow at 10:30 AM in Clinic Room B.',
      time: '2 days ago',
      read: true,
      icon: Calendar,
      color: 'bg-amber-50 text-amber-600 border-amber-200',
    },
  ]);

  const [categoryFilter, setCategoryFilter] = useState('ALL');

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const filteredNotifications = notifications.filter((n) => {
    if (categoryFilter === 'ALL') return true;
    return n.category === categoryFilter;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-slate-50 flex text-slate-800">
      <Sidebar role="THERAPIST" />

      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-8">
        <TopNavbar title="Clinical Alerts & Notifications" subtitle="Real-time Patient Activity Feed" />

        <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          {/* PAGE HEADER */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">Notifications Terminal</h1>
                {unreadCount > 0 && (
                  <span className="px-2.5 py-0.5 rounded-full bg-teal-600 text-white text-xs font-bold">
                    {unreadCount} Unread
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">Monitor high pain alerts, session logs, milestone achievements, and patient appointments.</p>
            </div>

            <button
              onClick={markAllAsRead}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-sm"
            >
              <Check className="w-4 h-4" />
              <span>Mark All as Read</span>
            </button>
          </div>

          {/* CATEGORY FILTER PILLS */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-2 overflow-x-auto">
            <span className="text-xs font-bold text-slate-500 flex items-center gap-1 pl-1">
              <Filter className="w-3.5 h-3.5" /> Category:
            </span>
            {['ALL', 'High Pain Feedback', 'Session Completed', 'Milestone Achievement', 'New Patient', 'Appointment Reminder'].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  categoryFilter === cat ? 'bg-teal-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* NOTIFICATIONS FEED */}
          <div className="space-y-3">
            {filteredNotifications.map((notif) => {
              const Icon = notif.icon;
              return (
                <div
                  key={notif.id}
                  className={`p-5 rounded-2xl border transition-all flex items-start justify-between gap-4 ${
                    notif.read ? 'bg-white border-slate-200 opacity-80' : 'bg-white border-teal-200 shadow-xs ring-1 ring-teal-500/20'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center border flex-shrink-0 ${notif.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h2 className="font-bold text-slate-900 text-sm">{notif.title}</h2>
                        {!notif.read && (
                          <span className="w-2 h-2 rounded-full bg-teal-600 animate-pulse" />
                        )}
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{notif.desc}</p>
                      <span className="text-[11px] text-slate-400 font-medium block pt-1">{notif.time}</span>
                    </div>
                  </div>

                  {!notif.read && (
                    <button
                      onClick={() => markAsRead(notif.id)}
                      className="text-xs font-bold text-teal-600 hover:text-teal-800 whitespace-nowrap px-3 py-1 bg-teal-50 rounded-lg border border-teal-200"
                    >
                      Mark Read
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </main>
      </div>

      <MobileNavbar role="THERAPIST" />
    </div>
  );
}
