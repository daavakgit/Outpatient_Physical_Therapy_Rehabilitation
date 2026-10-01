'use client';

import React from 'react';
import Link from 'next/link';
import { Dumbbell, Clock, Play, AlertTriangle, CheckCircle2, ChevronRight } from 'lucide-react';

export interface ExerciseCardProps {
  exercise: {
    _id: string;
    name: string;
    category: string;
    difficulty: string;
    targetArea: string;
    recommendedSets: number;
    recommendedReps: number;
    restDurationSeconds: number;
    description: string;
    safetyNotes?: string;
  };
  onSelect?: () => void;
  showStartButton?: boolean;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exercise,
  onSelect,
  showStartButton = true,
}) => {
  const categoryColors: Record<string, string> = {
    Mobility: 'bg-blue-50 text-blue-700 border-blue-200',
    Strength: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Flexibility: 'bg-purple-50 text-purple-700 border-purple-200',
    Balance: 'bg-amber-50 text-amber-700 border-amber-200',
    Recovery: 'bg-teal-50 text-teal-700 border-teal-200',
  };

  return (
    <div className="glacier-card p-5 flex flex-col justify-between hover:border-brand-300 transition-all group">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span
            className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
              categoryColors[exercise.category] || 'bg-slate-100 text-slate-700 border-slate-200'
            }`}
          >
            {exercise.category}
          </span>
          <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
            {exercise.difficulty}
          </span>
        </div>

        <h3 className="font-bold text-slate-900 text-base group-hover:text-brand-600 transition-colors">
          {exercise.name}
        </h3>
        <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">{exercise.description}</p>

        <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-slate-600">
            <Dumbbell className="w-3.5 h-3.5 text-brand-500" />
            <span>
              <strong>{exercise.recommendedSets}</strong> sets × <strong>{exercise.recommendedReps}</strong> reps
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-600">
            <Clock className="w-3.5 h-3.5 text-teal-500" />
            <span>
              Rest: <strong>{exercise.restDurationSeconds}s</strong>
            </span>
          </div>
        </div>
      </div>

      <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <span className="text-[11px] text-slate-500 font-medium truncate">Target: {exercise.targetArea}</span>
        {showStartButton ? (
          <Link
            href={`/patient/session/live?exerciseId=${exercise._id}`}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#006398] hover:bg-[#00476e] text-white text-xs font-bold shadow-xs transition-all"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Start</span>
          </Link>
        ) : (
          <button
            onClick={onSelect}
            className="flex items-center gap-1 text-xs font-bold text-[#006398] hover:text-[#00476e]"
          >
            <span>View Details</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
