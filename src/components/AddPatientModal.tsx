'use client';

import React, { useState } from 'react';
import { X, UserPlus, HeartPulse, ShieldCheck, AlertCircle, CheckCircle2, Mail, Copy, Check, Lock } from 'lucide-react';

interface AddPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPatientAdded: (newPatient: any) => void;
}

export const AddPatientModal: React.FC<AddPatientModalProps> = ({ isOpen, onClose, onPatientAdded }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState('32');
  const [gender, setGender] = useState('Female');
  const [condition, setCondition] = useState('ACL Reconstruction (Left)');
  const [phase, setPhase] = useState('Phase III: Proprioception & Loading');
  const [recoveryGoal, setRecoveryGoal] = useState('75');
  const [adherence, setAdherence] = useState('90');
  const [status, setStatus] = useState('ON TRACK');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [registeredSuccess, setRegisteredSuccess] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleClose = () => {
    setRegisteredSuccess(null);
    setFullName('');
    setEmail('');
    setPhone('');
    setNotes('');
    setError('');
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setError('Patient Full Name is required.');
      return;
    }
    if (!condition.trim()) {
      setError('Clinical condition / diagnosis is required.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          email,
          phone,
          age,
          gender,
          condition,
          phase,
          recoveryGoal,
          adherence,
          status,
          notes,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create patient record.');
      }

      onPatientAdded(data.patient);
      
      const targetEmail = email.trim() || `${fullName.toLowerCase().replace(/\s+/g, '.')}@rehabtrack.com`;

      setRegisteredSuccess({
        patient: data.patient,
        email: data.patient.credentials?.email || targetEmail,
        password: data.patient.credentials?.password || 'Password123!',
      });
    } catch (err: any) {
      setError(err.message || 'An error occurred while adding the patient.');
    } finally {
      setLoading(false);
    }
  };

  const copyCredentials = () => {
    if (!registeredSuccess) return;
    const text = `Login Email: ${registeredSuccess.email}\nPassword: ${registeredSuccess.password}\nPortal Link: ${window.location.origin}/login`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl max-w-xl w-full p-6 sm:p-8 space-y-6 my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* SUCCESS CONFIRMATION VIEW WITH EMAIL NOTIFICATION DETAILS */}
        {registeredSuccess ? (
          <div className="space-y-6 py-2">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-xs border border-emerald-100">
              <Mail className="w-7 h-7" />
            </div>

            <div className="text-center space-y-2">
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold uppercase tracking-wide inline-flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Account Created & Email Sent
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                Patient Credentials Dispatched
              </h2>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
                Login credentials have been generated and dispatched to <strong className="text-slate-900">{registeredSuccess.email}</strong>.
              </p>
            </div>

            {/* Credential Card */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-blue-600" /> Patient Portal Account Details
                </span>
                <button
                  type="button"
                  onClick={copyCredentials}
                  className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-[11px] font-bold text-slate-700 hover:bg-slate-100 transition-all flex items-center gap-1"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-500" /> Copy Credentials
                    </>
                  )}
                </button>
              </div>

              <div className="space-y-2 pt-1 text-xs">
                <div className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-slate-200">
                  <span className="text-slate-500 font-medium">Login Email ID:</span>
                  <span className="font-mono font-bold text-slate-900">{registeredSuccess.email}</span>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-slate-200">
                  <span className="text-slate-500 font-medium">Default Password:</span>
                  <span className="font-mono font-bold text-blue-700">{registeredSuccess.password}</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 italic text-center pt-1">
                The patient can now log in at <span className="font-semibold text-slate-600">/login</span> using these credentials.
              </p>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={handleClose}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#006398] hover:bg-[#00476e] text-white text-xs font-bold transition-all shadow-md"
              >
                Done / Back to Patients Roster
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#006398] flex items-center justify-center font-bold">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900">Collect Patient Clinical Details</h2>
                  <p className="text-xs text-slate-500">Register a new patient into your outpatient care roster.</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-600" />
                <span>{error}</span>
              </div>
            )}

            {/* Form Body */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Sophia Vance"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#006398] focus:bg-white transition-all"
                  />
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. sophia.vance@example.com"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#006398] focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Phone Number */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 019-2834"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#006398] focus:bg-white transition-all"
                  />
                </div>

                {/* Age */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Age</label>
                  <input
                    type="number"
                    min="1"
                    max="120"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#006398] focus:bg-white transition-all"
                  />
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#006398] focus:bg-white transition-all"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Non-binary / Other">Non-binary / Other</option>
                  </select>
                </div>
              </div>

              {/* Condition / Diagnosis */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Primary Diagnosis / Clinical Condition <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  placeholder="e.g. Post-Op Rotator Cuff Repair (Supraspinatus)"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#006398] focus:bg-white transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Protocol Phase */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Rehab Protocol Phase</label>
                  <select
                    value={phase}
                    onChange={(e) => setPhase(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#006398] focus:bg-white transition-all"
                  >
                    <option value="Phase I: Initial Assessment & Swelling Control">Phase I: Initial Assessment & Swelling Control</option>
                    <option value="Phase II: Pain Reduction & Baseline ROM">Phase II: Pain Reduction & Baseline ROM</option>
                    <option value="Phase III: Proprioception & Loading">Phase III: Proprioception & Loading</option>
                    <option value="Phase IV: Strength & Gait Symmetry">Phase IV: Strength & Gait Symmetry</option>
                    <option value="Phase V: Discharge & Return-to-Sport">Phase V: Discharge & Return-to-Sport</option>
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Initial Clinical Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#006398] focus:bg-white transition-all"
                  >
                    <option value="ON TRACK">ON TRACK</option>
                    <option value="NEEDS ATTENTION">NEEDS ATTENTION</option>
                    <option value="DELAYED">DELAYED</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Recovery Goal % */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Initial Recovery Goal Progress (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={recoveryGoal}
                    onChange={(e) => setRecoveryGoal(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#006398] focus:bg-white transition-all"
                  />
                </div>

                {/* Adherence % */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Expected Adherence Target (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={adherence}
                    onChange={(e) => setAdherence(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#006398] focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Clinical Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Clinical Notes &amp; Rehabilitation Guidelines</label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Record ROM targets, weight-bearing precautions, or specialized exercise instructions..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#006398] focus:bg-white transition-all resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#006398] hover:bg-[#00476e] text-white text-xs font-bold transition-all shadow-md disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Registering Patient...</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      <span>Register Patient</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
