'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface DashboardCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  badge?: string;
  badgeType?: 'success' | 'warning' | 'info' | 'neutral';
  icon: LucideIcon;
  iconBg?: string;
  trend?: string;
  progress?: number;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  subtitle,
  badge,
  badgeType = 'info',
  icon: Icon,
  iconBg = 'bg-brand-50 text-brand-600',
  trend,
  progress,
}) => {
  const badgeStyles = {
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    info: 'bg-brand-50 text-brand-700 border-brand-200',
    neutral: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  return (
    <div className="glacier-card p-5 relative overflow-hidden flex flex-col justify-between">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-semibold ${iconBg}`}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</h3>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-extrabold text-slate-900 tracking-tight">{value}</span>
              {trend && <span className="text-xs font-semibold text-emerald-600">{trend}</span>}
            </div>
          </div>
        </div>
        {badge && (
          <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${badgeStyles[badgeType]}`}>
            {badge}
          </span>
        )}
      </div>

      {subtitle && <p className="text-xs text-slate-500 mb-2">{subtitle}</p>}

      {typeof progress === 'number' && (
        <div className="mt-2">
          <div className="flex justify-between items-center text-xs mb-1 font-medium text-slate-600">
            <span>Goal Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-teal-500 to-brand-600 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
