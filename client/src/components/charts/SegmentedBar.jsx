import React from 'react';
import { SERIES_COLORS } from './BarChart';

/**
 * 100%-stacked single-row bar for part-to-whole breakdowns.
 * data: [{ label, value }]
 */
export default function SegmentedBar({ data, title }) {
  if (!data || data.length === 0) {
    return <div className="text-xs text-slate-400 py-6 text-center">No data to display yet.</div>;
  }

  const total = data.reduce((sum, d) => sum + d.value, 0) || 1;

  return (
    <div className="w-full">
      {title && <h4 className="text-xs font-bold text-slate-700 mb-3">{title}</h4>}
      <div className="flex w-full h-5 rounded-full overflow-hidden gap-0.5">
        {data.map((d, i) => (
          <div
            key={d.label}
            style={{ width: `${(d.value / total) * 100}%`, backgroundColor: SERIES_COLORS[i % SERIES_COLORS.length] }}
            title={`${d.label}: ${d.value}`}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3">
        {data.map((d, i) => (
          <div key={d.label} className="flex items-center gap-1.5 text-[11px] text-slate-600">
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: SERIES_COLORS[i % SERIES_COLORS.length] }} />
            <span className="font-semibold">{d.label}</span>
            <span className="text-slate-400">({d.value})</span>
          </div>
        ))}
      </div>
    </div>
  );
}
