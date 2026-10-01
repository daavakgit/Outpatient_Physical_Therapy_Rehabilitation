'use client';

import React from 'react';
import { CheckCircle2, Clock, Circle, Award } from 'lucide-react';

export interface MilestoneItem {
  _id?: string;
  title: string;
  description: string;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'PENDING';
  progress: number;
  order: number;
  completionDate?: string;
}

interface MilestoneTimelineProps {
  milestones: MilestoneItem[];
}

export const MilestoneTimeline: React.FC<MilestoneTimelineProps> = ({ milestones }) => {
  const sorted = [...milestones].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-6 relative before:absolute before:inset-0 before:left-5 before:w-0.5 before:bg-slate-200 before:z-0">
      {sorted.map((m, idx) => {
        const isCompleted = m.status === 'COMPLETED';
        const isInProgress = m.status === 'IN_PROGRESS';

        return (
          <div key={m._id || idx} className="relative flex items-start gap-4 z-10 group">
            {/* Step Icon Node */}
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shadow-md transition-transform group-hover:scale-105 ${
                isCompleted
                  ? 'bg-teal-600 text-white ring-4 ring-teal-50'
                  : isInProgress
                  ? 'bg-brand-600 text-white ring-4 ring-brand-100 animate-pulse'
                  : 'bg-slate-100 text-slate-400 border border-slate-300'
              }`}
            >
              {isCompleted ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : isInProgress ? (
                <Clock className="w-5 h-5 animate-spin-slow" />
              ) : (
                <span>{m.order}</span>
              )}
            </div>

            {/* Content Card */}
            <div
              className={`flex-1 p-4 rounded-2xl border transition-all ${
                isCompleted
                  ? 'bg-teal-50/40 border-teal-200 text-slate-800'
                  : isInProgress
                  ? 'bg-white border-brand-300 shadow-md text-slate-900 ring-1 ring-brand-200'
                  : 'bg-slate-50/60 border-slate-200 text-slate-500 opacity-75'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <span>
                    Step {m.order}: {m.title}
                  </span>
                </h4>
                <span
                  className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                    isCompleted
                      ? 'bg-teal-100 text-teal-800 border-teal-300'
                      : isInProgress
                      ? 'bg-brand-100 text-brand-800 border-brand-300'
                      : 'bg-slate-200 text-slate-600 border-slate-300'
                  }`}
                >
                  {isCompleted ? 'Completed' : isInProgress ? 'In Progress' : 'Pending'}
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed mt-1">{m.description}</p>

              {/* Progress Bar for In-Progress */}
              {isInProgress && (
                <div className="mt-3">
                  <div className="flex justify-between items-center text-[11px] font-semibold text-brand-700 mb-1">
                    <span>Milestone Goal Progress</span>
                    <span>{m.progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-brand-600 rounded-full transition-all duration-500"
                      style={{ width: `${m.progress}%` }}
                    />
                  </div>
                </div>
              )}

              {isCompleted && m.completionDate && (
                <div className="mt-2 text-[10px] font-medium text-teal-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Completed on {new Date(m.completionDate).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
