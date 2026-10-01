'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  HeartPulse,
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  AlertCircle,
  Eye,
  EyeOff,
  Stethoscope,
  User,
  Sparkles,
  CheckCircle2,
  Activity,
  Shield,
  Sun,
  Moon,
  Compass
} from 'lucide-react';

type RoleType = 'PATIENT' | 'THERAPIST' | 'ADMIN';

type ThemeMode = 'emerald' | 'midnight' | 'sapphire';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<RoleType | null>(null);
  const [theme, setTheme] = useState<ThemeMode>('emerald');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned invalid response format. Please try again.');
      }

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Login failed. Please check your credentials.');
      }

      if (data.user.role === 'THERAPIST') {
        router.push('/therapist/dashboard');
      } else if (data.user.role === 'ADMIN') {
        router.push('/admin/dashboard');
      } else {
        router.push('/patient/dashboard');
      }
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (role: RoleType, demoEmail: string) => {
    setSelectedRole(role);
    setEmail(demoEmail);
    setPassword('Password123!');
  };

  // Theme style mapping
  const getThemeStyles = () => {
    switch (theme) {
      case 'midnight':
        return {
          wrapperBg: 'bg-slate-950 text-slate-100',
          ambientOrb1: 'from-teal-500/20 via-cyan-500/10 to-transparent',
          ambientOrb2: 'from-blue-600/20 via-indigo-500/10 to-transparent',
          cardContainer: 'bg-slate-900/80 border-slate-800 text-white shadow-2xl backdrop-blur-xl',
          heroPanelBg: 'bg-gradient-to-br from-slate-900 via-slate-950 to-teal-950/60 border-slate-800',
          inputBg: 'bg-slate-800/70 border-slate-700 text-white placeholder-slate-400 focus:border-cyan-400 focus:ring-cyan-500/30',
          brandHeader: 'text-white',
          subtitle: 'text-slate-400',
          primaryBtn: 'bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-600 hover:from-teal-400 hover:to-blue-500 text-white shadow-lg shadow-teal-500/20',
          roleCardPatient: selectedRole === 'PATIENT'
            ? 'bg-teal-950/70 border-teal-500 text-teal-300 ring-2 ring-teal-500/40 shadow-md shadow-teal-950/50'
            : 'bg-slate-800/60 border-slate-700/80 text-slate-300 hover:border-teal-500/50 hover:bg-slate-800',
          roleCardTherapist: selectedRole === 'THERAPIST'
            ? 'bg-cyan-950/70 border-cyan-500 text-cyan-300 ring-2 ring-cyan-500/40 shadow-md shadow-cyan-950/50'
            : 'bg-slate-800/60 border-slate-700/80 text-slate-300 hover:border-cyan-500/50 hover:bg-slate-800',
          roleCardAdmin: selectedRole === 'ADMIN'
            ? 'bg-indigo-950/70 border-indigo-500 text-indigo-300 ring-2 ring-indigo-500/40 shadow-md shadow-indigo-950/50'
            : 'bg-slate-800/60 border-slate-700/80 text-slate-300 hover:border-indigo-500/50 hover:bg-slate-800',
        };
      case 'sapphire':
        return {
          wrapperBg: 'bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-slate-100',
          ambientOrb1: 'from-blue-500/20 via-sky-500/10 to-transparent',
          ambientOrb2: 'from-indigo-600/20 via-blue-500/10 to-transparent',
          cardContainer: 'bg-slate-900/90 border-blue-900/60 text-white shadow-2xl backdrop-blur-xl',
          heroPanelBg: 'bg-gradient-to-br from-blue-950 via-slate-900 to-blue-900/40 border-blue-900/50',
          inputBg: 'bg-slate-800/80 border-slate-700 text-white placeholder-slate-400 focus:border-blue-400 focus:ring-blue-500/30',
          brandHeader: 'text-white',
          subtitle: 'text-blue-200/70',
          primaryBtn: 'bg-gradient-to-r from-blue-600 via-sky-500 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/25',
          roleCardPatient: selectedRole === 'PATIENT'
            ? 'bg-sky-950/70 border-sky-400 text-sky-300 ring-2 ring-sky-400/40'
            : 'bg-slate-800/70 border-slate-700 text-slate-300 hover:border-sky-400/50',
          roleCardTherapist: selectedRole === 'THERAPIST'
            ? 'bg-blue-950/70 border-blue-400 text-blue-300 ring-2 ring-blue-400/40'
            : 'bg-slate-800/70 border-slate-700 text-slate-300 hover:border-blue-400/50',
          roleCardAdmin: selectedRole === 'ADMIN'
            ? 'bg-indigo-950/70 border-indigo-400 text-indigo-300 ring-2 ring-indigo-400/40'
            : 'bg-slate-800/70 border-slate-700 text-slate-300 hover:border-indigo-400/50',
        };
      case 'emerald':
      default:
        return {
          wrapperBg: 'bg-gradient-to-br from-teal-50/60 via-slate-50 to-cyan-50/80 text-slate-900',
          ambientOrb1: 'from-teal-300/30 via-emerald-200/20 to-transparent',
          ambientOrb2: 'from-cyan-300/30 via-blue-200/20 to-transparent',
          cardContainer: 'bg-white/90 border-slate-200/80 text-slate-900 shadow-2xl shadow-teal-900/5 backdrop-blur-xl',
          heroPanelBg: 'bg-gradient-to-br from-teal-900 via-slate-900 to-cyan-950 text-white border-teal-800/50',
          inputBg: 'bg-slate-50/80 border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-teal-500 focus:ring-teal-500/20',
          brandHeader: 'text-slate-900',
          subtitle: 'text-slate-500',
          primaryBtn: 'bg-gradient-to-r from-teal-600 via-teal-700 to-cyan-700 hover:from-teal-500 hover:to-cyan-600 text-white shadow-lg shadow-teal-600/20',
          roleCardPatient: selectedRole === 'PATIENT'
            ? 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-2 ring-emerald-500/30 shadow-sm'
            : 'bg-slate-50/80 border-slate-200 text-slate-700 hover:border-emerald-400 hover:bg-emerald-50/40',
          roleCardTherapist: selectedRole === 'THERAPIST'
            ? 'bg-teal-50 border-teal-500 text-teal-900 ring-2 ring-teal-500/30 shadow-sm'
            : 'bg-slate-50/80 border-slate-200 text-slate-700 hover:border-teal-400 hover:bg-teal-50/40',
          roleCardAdmin: selectedRole === 'ADMIN'
            ? 'bg-purple-50 border-purple-500 text-purple-900 ring-2 ring-purple-500/30 shadow-sm'
            : 'bg-slate-50/80 border-slate-200 text-slate-700 hover:border-purple-400 hover:bg-purple-50/40',
        };
    }
  };

  const currentTheme = getThemeStyles();

  return (
    <div className={`min-h-screen ${currentTheme.wrapperBg} relative overflow-hidden flex items-center justify-center p-4 sm:p-6 lg:p-8 transition-colors duration-500`}>
      {/* Background Ambient Glowing Orbs */}
      <div className={`absolute top-0 -left-20 w-96 h-96 bg-gradient-to-br ${currentTheme.ambientOrb1} rounded-full blur-3xl pointer-events-none animate-float-slow`} />
      <div className={`absolute bottom-0 -right-20 w-96 h-96 bg-gradient-to-tl ${currentTheme.ambientOrb2} rounded-full blur-3xl pointer-events-none animate-float-slow`} style={{ animationDelay: '-3s' }} />

      {/* Top Header Controls: Theme Switcher & Status */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex items-center gap-2 z-20">
        <div className="flex items-center gap-1 bg-white/70 dark:bg-slate-900/80 backdrop-blur-md p-1 rounded-full border border-slate-200/60 dark:border-slate-800 shadow-sm text-xs">
          <button
            type="button"
            onClick={() => setTheme('emerald')}
            className={`px-2.5 py-1 rounded-full font-medium transition-all flex items-center gap-1.5 ${
              theme === 'emerald'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
            title="Luminous Emerald Medical Theme"
          >
            <Sun className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Emerald</span>
          </button>
          <button
            type="button"
            onClick={() => setTheme('midnight')}
            className={`px-2.5 py-1 rounded-full font-medium transition-all flex items-center gap-1.5 ${
              theme === 'midnight'
                ? 'bg-cyan-500 text-slate-950 shadow-sm font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
            title="Midnight Dark Cyber Theme"
          >
            <Moon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Midnight</span>
          </button>
          <button
            type="button"
            onClick={() => setTheme('sapphire')}
            className={`px-2.5 py-1 rounded-full font-medium transition-all flex items-center gap-1.5 ${
              theme === 'sapphire'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
            title="Sapphire Blue Enterprise Theme"
          >
            <Compass className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sapphire</span>
          </button>
        </div>
      </div>

      {/* Main Container Container Box */}
      <div className={`w-full max-w-5xl rounded-3xl border ${currentTheme.cardContainer} overflow-hidden grid grid-cols-1 lg:grid-cols-12 relative z-10 transition-all duration-300`}>
        
        {/* Left Side: Dynamic Healthcare Visual Hero (Hidden on smaller screens, sleek on desktop) */}
        <div className={`hidden lg:flex lg:col-span-5 ${currentTheme.heroPanelBg} border-r p-8 flex-col justify-between relative overflow-hidden`}>
          {/* Animated Mesh Overlay */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

          {/* Top Brand Tag */}
          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-400 via-cyan-400 to-blue-500 p-0.5 shadow-lg shadow-teal-500/30">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-teal-400">
                  <HeartPulse className="w-6 h-6 animate-pulse" />
                </div>
              </div>
              <div>
                <h1 className="text-xl font-black text-white tracking-tight">RehabPulse</h1>
                <span className="text-[10px] uppercase font-bold tracking-widest text-teal-400">Clinical Portal</span>
              </div>
            </div>

            <div className="pt-4 space-y-2">
              <h2 className="text-2xl font-bold leading-tight text-white">
                Next-Gen Physical Therapy & Rehabilitation Tracking
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                Streamlining outpatient recovery, AI-assisted movement analysis, and seamless therapist-patient collaboration.
              </p>
            </div>
          </div>

          {/* Center Graphic: Waveform / ROM Visual Card */}
          <div className="relative z-10 my-6 p-4 rounded-2xl bg-slate-900/80 border border-slate-700/60 backdrop-blur-md space-y-3">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-teal-300 font-semibold">
                <Activity className="w-4 h-4 text-teal-400" />
                <span>Live Rehabilitation Waveform</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
                98.4% Accuracy
              </span>
            </div>

            {/* Glowing SVG Pulse Wave */}
            <div className="h-16 w-full flex items-center">
              <svg className="w-full h-12 text-teal-400 overflow-visible" viewBox="0 0 300 50" fill="none">
                <path
                  d="M0 25 H60 L70 10 L85 40 L100 5 L115 35 L125 25 H180 L190 15 L205 38 L220 12 L230 25 H300"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="drop-shadow-[0_0_8px_rgba(45,212,191,0.7)]"
                />
                <circle cx="100" cy="5" r="4" fill="#38bdf8" className="animate-ping" />
                <circle cx="100" cy="5" r="3" fill="#38bdf8" />
              </svg>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800 text-[11px] text-slate-300">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                <span>HIPAA Compliant</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                <span>AI ROM Tracking</span>
              </div>
            </div>
          </div>

          {/* Bottom Footer Feature Pills */}
          <div className="relative z-10 space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-200">
              <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-300 flex items-center justify-center shrink-0">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <p className="font-semibold text-white">Enterprise Grade Security</p>
                <p className="text-[10px] text-slate-400">Encrypted clinical records & telemetry</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Interactive Login Form Container */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center space-y-6">
          
          {/* Header */}
          <div className="text-center sm:text-left space-y-2">
            <div className="flex items-center justify-center sm:justify-start gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 via-cyan-500 to-blue-600 text-white flex items-center justify-center shadow-md shadow-teal-500/20 lg:hidden">
                <HeartPulse className="w-5 h-5" />
              </div>
              <div>
                <h2 className={`text-2xl sm:text-3xl font-extrabold ${currentTheme.brandHeader} tracking-tight`}>
                  Welcome Back
                </h2>
              </div>
            </div>
            <p className={`text-xs sm:text-sm ${currentTheme.subtitle}`}>
              Access your Outpatient Rehabilitation & Physical Therapy Portal
            </p>
          </div>

          {/* Quick Demo Credentials One-Click Selector */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-bounce" />
                Quick Demo One-Click Fill
              </span>
              {selectedRole && (
                <span className="text-[11px] font-medium text-teal-600 dark:text-teal-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {selectedRole.charAt(0) + selectedRole.slice(1).toLowerCase()} Selected
                </span>
              )}
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              {/* Patient Role Pill */}
              <button
                type="button"
                onClick={() => handleQuickLogin('PATIENT', 'alex.morgan@rehab.com')}
                className={`p-3 rounded-2xl border text-left transition-all duration-200 relative group flex flex-col justify-between ${currentTheme.roleCardPatient}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <User className="w-4 h-4" />
                  </div>
                  {selectedRole === 'PATIENT' && (
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  )}
                </div>
                <div>
                  <div className="text-xs font-bold">Patient</div>
                  <div className="text-[10px] opacity-75 truncate">Alex Morgan</div>
                </div>
              </button>

              {/* Therapist Role Pill */}
              <button
                type="button"
                onClick={() => handleQuickLogin('THERAPIST', 'dr.sarah@rehab.com')}
                className={`p-3 rounded-2xl border text-left transition-all duration-200 relative group flex flex-col justify-between ${currentTheme.roleCardTherapist}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="w-7 h-7 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                    <Stethoscope className="w-4 h-4" />
                  </div>
                  {selectedRole === 'THERAPIST' && (
                    <span className="w-2 h-2 rounded-full bg-teal-500 animate-ping" />
                  )}
                </div>
                <div>
                  <div className="text-xs font-bold">Therapist</div>
                  <div className="text-[10px] opacity-75 truncate">Dr. Sarah</div>
                </div>
              </button>

              {/* Admin Role Pill */}
              <button
                type="button"
                onClick={() => handleQuickLogin('ADMIN', 'admin@rehab.com')}
                className={`p-3 rounded-2xl border text-left transition-all duration-200 relative group flex flex-col justify-between ${currentTheme.roleCardAdmin}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="w-7 h-7 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  {selectedRole === 'ADMIN' && (
                    <span className="w-2 h-2 rounded-full bg-purple-500 animate-ping" />
                  )}
                </div>
                <div>
                  <div className="text-xs font-bold">Admin</div>
                  <div className="text-[10px] opacity-75 truncate">System Director</div>
                </div>
              </button>
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="p-3.5 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-600 dark:text-red-400 text-xs flex items-start gap-2.5 animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <p className="font-semibold">Authentication Error</p>
                <p className="opacity-90">{error}</p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 transition-colors group-focus-within:text-teal-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (selectedRole) setSelectedRole(null);
                  }}
                  placeholder="name@rehab.com"
                  className={`w-full pl-10 pr-4 py-3 rounded-2xl text-xs ${currentTheme.inputBg} outline-none transition-all duration-200`}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <a href="#forgot" onClick={(e) => { e.preventDefault(); alert("Demo Mode: Click any 'Quick Demo' button above to autofill password."); }} className="text-[11px] font-semibold text-teal-600 dark:text-teal-400 hover:underline">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-11 py-3 rounded-2xl text-xs ${currentTheme.inputBg} outline-none transition-all duration-200`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me Option */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600 dark:text-slate-400 select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500 accent-teal-600"
                />
                <span>Remember me for 30 days</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 rounded-2xl ${currentTheme.primaryBtn} font-bold text-xs transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed`}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Authenticating Account...</span>
                </div>
              ) : (
                <>
                  <span>Sign In to Portal</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="text-center pt-3 border-t border-slate-200/60 dark:border-slate-800">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Don&apos;t have an account yet?{' '}
              <Link
                href="/register"
                className="font-bold text-teal-600 dark:text-teal-400 hover:underline inline-flex items-center gap-1"
              >
                Create Account
                <ArrowRight className="w-3 h-3" />
              </Link>
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}

