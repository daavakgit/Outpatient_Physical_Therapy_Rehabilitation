'use client';

import React from 'react';
import Link from 'next/link';
import { User, Activity, Calendar, ChevronRight, CheckCircle2, Clock } from 'lucide-react';

interface PatientItem {
  _id: string;
  fullName: string;
  condition: string;
  status: string;
  startDate: string;
  recoveryGoals?: string[];
}

interface PatientTableProps {
  patients: PatientItem[];
}

export const PatientTable: React.FC<PatientTableProps> = ({ patients }) => {
  return (
    <div className="glacier-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-600">
          <thead className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase tracking-wider font-bold text-slate-500">
            <tr>
              <th className="px-6 py-3">Patient Name</th>
              <th className="px-6 py-3">Clinical Condition</th>
              <th className="px-6 py-3">Start Date</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {patients.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-slate-400">
                  No patient records found.
                </td>
              </tr>
            ) : (
              patients.map((p) => (
                <tr key={p._id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4 font-semibold text-slate-900 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 font-bold flex items-center justify-center">
                      {p.fullName[0]}
                    </div>
                    <div>
                      <span>{p.fullName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-700">{p.condition}</td>
                  <td className="px-6 py-4 text-slate-500">
                    {new Date(p.startDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        p.status === 'ACTIVE'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/therapist/patients/${p._id}`}
                      className="inline-flex items-center gap-1 text-brand-600 font-semibold hover:text-brand-700"
                    >
                      <span>View Plan</span>
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
