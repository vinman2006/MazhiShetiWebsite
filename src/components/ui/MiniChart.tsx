import React from "react";

export interface DataPoint {
  label: string;
  value: number;
}

export interface MiniChartProps {
  data: DataPoint[];
  color?: string;
  height?: number;
  showLabels?: boolean;
  valueSuffix?: string;
}

export function MiniBarChart({
  data,
  color = "bg-brand-primary",
  height = 90,
  showLabels = true,
  valueSuffix = "",
}: MiniChartProps) {
  const maxValue = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="w-full">
      <div className="flex items-end justify-between gap-2" style={{ height: `${height}px` }}>
        {data.map((point, index) => {
          const heightPercent = Math.max(8, (point.value / maxValue) * 100);
          return (
            <div key={index} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
              <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-mono font-bold text-slate-700 bg-white border border-slate-200 px-1 rounded shadow-sm">
                {point.value}
                {valueSuffix}
              </span>
              <div className="w-full bg-slate-100 rounded-t-lg overflow-hidden h-full flex items-end">
                <div
                  className={`w-full rounded-t-lg transition-all duration-500 ${color}`}
                  style={{ height: `${heightPercent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
      {showLabels && (
        <div className="flex justify-between items-center text-[10px] font-medium text-slate-400 mt-2 px-1">
          {data.map((point, index) => (
            <span key={index} className="truncate max-w-[40px] text-center">
              {point.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export function Sparkline({
  points,
  strokeColor = "#166534",
  fillColor = "rgba(22, 101, 52, 0.1)",
  height = 40,
  width = 120,
}: {
  points: number[];
  strokeColor?: string;
  fillColor?: string;
  height?: number;
  width?: number;
}) {
  if (points.length < 2) return null;

  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;

  const coords = points.map((p, i) => {
    const x = (i / (points.length - 1)) * width;
    const y = height - ((p - min) / range) * (height - 6) - 3;
    return `${x},${y}`;
  });

  const linePath = `M ${coords.join(" L ")}`;
  const areaPath = `${linePath} L ${width},${height} L 0,${height} Z`;

  return (
    <svg width={width} height={height} className="overflow-visible">
      <path d={areaPath} fill={fillColor} />
      <path d={linePath} fill="none" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
