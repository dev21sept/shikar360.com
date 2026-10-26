import React, { useState } from 'react';

// Validated default categorical palette (dataviz skill reference palette)
const SERIES_COLORS = ['#2a78d6', '#eb6834', '#1baf7a', '#eda100', '#e87ba4', '#008300', '#6250d6', '#e34948'];

/**
 * Minimal, accessible SVG bar chart.
 * data: [{ label, value }]
 */
export default function BarChart({ data, height = 220, color, title, valueFormatter = (v) => v }) {
  const [hoverIdx, setHoverIdx] = useState(null);

  if (!data || data.length === 0) {
    return <div className="text-xs text-slate-400 py-10 text-center">No data to display yet.</div>;
  }

  const maxValue = Math.max(...data.map((d) => d.value), 1);
  const barColor = color || SERIES_COLORS[0];
  const chartHeight = height;
  const labelHeight = 28;
  const plotHeight = chartHeight - labelHeight;
  const gridLines = 4;

  return (
    <div className="w-full">
      {title && <h4 className="text-xs font-bold text-slate-700 mb-3">{title}</h4>}
      <div className="relative" style={{ height: chartHeight }}>
        {/* Gridlines */}
        <div className="absolute inset-0" style={{ bottom: labelHeight }}>
          {Array.from({ length: gridLines + 1 }).map((_, i) => (
            <div
              key={i}
              className="absolute left-0 right-0 border-t border-slate-100"
              style={{ top: `${(i / gridLines) * 100}%` }}
            />
          ))}
        </div>

        {/* Bars */}
        <div className="absolute inset-0 flex items-end justify-around gap-2 px-1" style={{ bottom: labelHeight, height: plotHeight }}>
          {data.map((d, i) => {
            const barHeightPct = (d.value / maxValue) * 100;
            return (
              <div
                key={d.label}
                className="relative flex-1 h-full flex items-end justify-center"
                onMouseEnter={() => setHoverIdx(i)}
                onMouseLeave={() => setHoverIdx(null)}
              >
                {hoverIdx === i && (
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded-lg bg-slate-900 text-white text-[10px] font-bold whitespace-nowrap z-10 shadow-lg">
                    {valueFormatter(d.value)}
                  </div>
                )}
                <div
                  className="w-full max-w-10 rounded-t-[4px] transition-all duration-200"
                  style={{
                    height: `${Math.max(barHeightPct, d.value > 0 ? 2 : 0)}%`,
                    backgroundColor: barColor,
                    opacity: hoverIdx === null || hoverIdx === i ? 1 : 0.55
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* X-axis labels */}
        <div className="absolute left-0 right-0 bottom-0 flex justify-around gap-2 px-1" style={{ height: labelHeight }}>
          {data.map((d) => (
            <div key={d.label} className="flex-1 text-center text-[10px] font-semibold text-slate-500 truncate pt-1.5">
              {d.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export { SERIES_COLORS };
