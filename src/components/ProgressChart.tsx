'use client';

import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

interface ProgressChartProps {
  data: Array<{
    date?: string;
    day?: string;
    painLevel: number;
    rangeOfMotionDegrees?: number;
    dailyCompletionPercentage: number;
  }>;
}

export const ProgressChart: React.FC<ProgressChartProps> = ({ data }) => {
  const chartData = data.map((item, idx) => ({
    name: item.day || `Day ${idx + 1}`,
    'Pain Score (0-10)': item.painLevel,
    'ROM (Degrees)': item.rangeOfMotionDegrees || 90 + idx * 4,
    'Adherence (%)': item.dailyCompletionPercentage,
  }));

  return (
    <div className="w-full space-y-6">
      {/* Chart 1: Range of Motion & Adherence */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
          Range of Motion (ROM) & Daily Exercise Adherence
        </h4>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="romGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#006a63" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#006a63" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="adherenceGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#094285" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#094285" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
                  fontSize: '12px',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Area
                type="monotone"
                dataKey="ROM (Degrees)"
                stroke="#006a63"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#romGrad)"
              />
              <Area
                type="monotone"
                dataKey="Adherence (%)"
                stroke="#094285"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#adherenceGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2: Pain Level Trend */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
          Reported Pain Scale (0 = Pain Free, 10 = Severe)
        </h4>
        <div className="h-44 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} />
              <YAxis domain={[0, 10]} tick={{ fontSize: 11, fill: '#64748b' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="Pain Score (0-10)" fill="#f59e0b" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
