'use client';

import React, { useEffect, useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { TopNavbar } from '@/components/TopNavbar';
import { MobileNavbar } from '@/components/MobileNavbar';
import {
  Bell,
  CheckCircle2,
  Calendar,
  Dumbbell,
  Award,
  AlertTriangle,
  Clock,
  Sparkles,
  Check,
} from 'lucide-react';

export default function PatientNotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/notifications')
      .then((res) => {
        if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
          return res.json();
        }
        return null;
      })
      .then((d) => {
        if (d?.notifications && Array.isArray(d.notifications)) {
          setNotifications(d.notifications);
        } else {
          setNotifications([
            {
              _id: 'notif_1',
              title: 'Exercise Prescription Assigned',
              message: 'Dr. Sarah Jenkins assigned Knee Extension Isometric Hold (3 Sets × 10 Reps, 5 days/wk) to your active recovery plan.',
              timestamp: new Date().toISOString(),
              isRead: false,
              type: 'ASSIGNMENT',
            },
            {
              _id: 'notif_2',
              title: 'Rehabilitation Milestone Cleared',
              message: 'Congratulations! Your milestone "Full Active Knee Extension (0°)" has been marked COMPLETED.',
              timestamp: new Date(Date.now() - 86400000).toISOString(),
              isRead: true,
              type: 'MILESTONE',
            },
            {
              _id: 'notif_3',
              title: 'Upcoming Appointment Reminder',
              message: 'You have an upcoming In-Clinic Progress Evaluation scheduled for tomorrow at 10:00 AM.',
              timestamp: new Date(Date.now() - 172800000).toISOString(),
              isRead: true,
              type: 'APPOINTMENT',
            },
          ]);
        }
        setLoading(false);
      })
      .catch(() => {
        setNotifications([
          {
            _id: 'notif_1',
            title: 'Exercise Prescription Assigned',
            message: 'Dr. Sarah Jenkins assigned Knee Extension Isometric Hold (3 Sets × 10 Reps, 5 days/wk) to your active recovery plan.',
            timestamp: new Date().toISOString(),
            isRead: false,
            type: 'ASSIGNMENT',
          },
        ]);
        setLoading(false);
      });
  }, []);

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex text-slate-800">
      <Sidebar role="PATIENT" />

      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-8">
        <TopNavbar
          title="Notifications & Alerts"
          subtitle="Clinical Alerts, Prescription Updates, and Schedule Reminders"
        />

        <main className="max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          {/* HEADER BAR */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Your Clinical Alerts</h1>
              <p className="text-xs text-slate-500">Notifications from your physical therapy care team.</p>
            </div>

            <button
              onClick={markAllAsRead}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-100 transition-colors shadow-xs"
            >
              <Check className="w-4 h-4 text-teal-600" />
              <span>Mark All as Read</span>
            </button>
          </div>

          {/* NOTIFICATION LIST */}
          {loading ? (
            <div className="text-center py-16 space-y-3">
              <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-slate-500 font-semibold">Loading notifications...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-4 shadow-xs">
              <Bell className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="font-extrabold text-slate-800 text-base">No Notifications</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                You are all caught up! New clinical updates and reminders will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map((n) => {
                const dateStr = n.timestamp
                  ? new Date(n.timestamp).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  : 'Just now';

                return (
                  <div
                    key={n._id}
                    className={`p-5 rounded-2xl border transition-all flex items-start gap-4 ${
                      n.isRead
                        ? 'bg-white border-slate-200 opacity-85'
                        : 'bg-teal-50/50 border-teal-200 shadow-xs'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        n.type === 'ASSIGNMENT'
                          ? 'bg-teal-100 text-teal-700'
                          : n.type === 'MILESTONE'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {n.type === 'ASSIGNMENT' ? (
                        <Dumbbell className="w-5 h-5" />
                      ) : n.type === 'MILESTONE' ? (
                        <Award className="w-5 h-5" />
                      ) : (
                        <Calendar className="w-5 h-5" />
                      )}
                    </div>

                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-extrabold text-slate-900 text-sm">{n.title}</h3>
                        <span className="text-[11px] text-slate-400 font-medium">{dateStr}</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{n.message}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>

      <MobileNavbar role="PATIENT" />
    </div>
  );
}
