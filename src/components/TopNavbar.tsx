'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Bell, HeartPulse, Play, User as UserIcon, CheckCircle2, AlertCircle, Menu, X } from 'lucide-react';

interface TopNavbarProps {
  user?: {
    name: string;
    role: string;
    email?: string;
  };
  title?: string;
  subtitle?: string;
  onMobileMenuToggle?: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  user: initialUser,
  title = 'Rehabilitation Portal',
  subtitle = 'Clinical Milestone & Recovery Dashboard',
  onMobileMenuToggle,
}) => {
  const [user, setUser] = useState<any>(initialUser || null);
  const [unreadCount, setUnreadCount] = useState<number>(2);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);

  useEffect(() => {
    if (initialUser) {
      setUser(initialUser);
    } else {
      fetch('/api/auth/me')
        .then((res) => {
          if (res.ok && res.headers.get('content-type')?.includes('application/json')) return res.json();
          return null;
        })
        .then((data) => {
          if (data?.user) {
            setUser(data.user);
          }
        })
        .catch(() => {});
    }
  }, [initialUser]);

  useEffect(() => {
    fetch('/api/notifications')
      .then((res) => res.json())
      .then((data) => {
        if (data?.notifications) {
          setNotifications(data.notifications);
          setUnreadCount(data.unreadCount || 0);
        }
      })
      .catch(() => {});
  }, []);

  const markAllRead = async () => {
    await fetch('/api/notifications', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ markAll: true }),
    });
    setUnreadCount(0);
    setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
  };

  const displayName = user?.name || user?.fullName || 'Authenticated User';
  const displayRole = user?.role || 'PATIENT';

  return (
    <header className="bg-white border-b border-glacier-border sticky top-0 z-20 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left Title & Mobile Toggle */}
        <div className="flex items-center gap-3">
          {onMobileMenuToggle && (
            <button
              onClick={onMobileMenuToggle}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
              aria-label="Toggle menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}
          <div>
            <h1 className="text-lg font-bold text-slate-900 leading-tight">{title}</h1>
            <p className="text-xs text-slate-500 hidden sm:block">{subtitle}</p>
          </div>
        </div>

        {/* Right Actions & Profile */}
        <div className="flex items-center gap-3">
          {/* Quick Start Action if Patient */}
          {displayRole === 'PATIENT' && (
            <Link
              href="/patient/session/live?exerciseId=67f1a8c9e4b0123456789012"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#006398] hover:bg-[#00476e] text-white text-xs font-bold transition-all shadow-xs"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Start Daily Session</span>
            </Link>
          )}

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 hover:text-brand-600 hover:bg-brand-50 transition-all relative"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white" />
              )}
            </button>

            {/* Notification Panel */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-brand-600" />
                    <span className="font-bold text-sm text-slate-800">Notifications</span>
                    {unreadCount > 0 && (
                      <span className="text-[11px] font-semibold bg-brand-100 text-brand-700 px-2 py-0.5 rounded-full">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllRead}
                      className="text-xs text-brand-600 hover:text-brand-700 font-medium"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {notifications.length === 0 ? (
                    <p className="text-xs text-slate-400 py-4 text-center">No notifications at this time.</p>
                  ) : (
                    notifications.map((n, idx) => (
                      <div
                        key={n._id || idx}
                        className={`p-3 rounded-xl border text-xs transition-all ${
                          n.isRead ? 'bg-slate-50 border-slate-100 text-slate-600' : 'bg-brand-50/50 border-brand-100 text-slate-900 font-medium'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-semibold text-slate-800">{n.title}</p>
                          <span className="text-[10px] text-slate-400 whitespace-nowrap">Just now</span>
                        </div>
                        <p className="text-slate-600 mt-1 text-[11px] leading-relaxed">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Role Badge */}
          <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
            <div className="w-8 h-8 rounded-full bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-600 font-bold text-xs">
              {displayName ? displayName[0].toUpperCase() : <UserIcon className="w-4 h-4" />}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-semibold text-slate-800 leading-none">{displayName}</p>
              <span className="text-[10px] font-medium text-teal-600 uppercase tracking-wider">
                {displayRole}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
