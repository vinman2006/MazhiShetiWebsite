"use client";

import React from "react";

interface SensorGaugeProps {
  label: string;
  value: number;
  unit: string;
  min: number;
  max: number;
  optimalMin: number;
  optimalMax: number;
  icon: React.ReactNode;
  colorClass: string;
  barColor: string;
  statusText?: string;
}

export default function SensorGauge({
  label,
  value,
  unit,
  min,
  max,
  optimalMin,
  optimalMax,
  icon,
  colorClass,
  barColor,
  statusText,
}: SensorGaugeProps) {
  const percentage = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
  const isOptimal = value >= optimalMin && value <= optimalMax;

  return (
    <div className="bg-white rounded-2xl p-4 shadow-card border border-stone-100 hover:shadow-card-hover transition-all relative overflow-hidden group">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl ${colorClass}`}>
            {icon}
          </div>
          <div>
            <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">{label}</p>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl font-black text-stone-900 tracking-tight">{value}</span>
              <span className="text-xs font-bold text-stone-500">{unit}</span>
            </div>
          </div>
        </div>

        <span
          className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
            isOptimal
              ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
              : "bg-amber-100 text-amber-800 border border-amber-200"
          }`}
        >
          {statusText || (isOptimal ? "Optimal" : "Attention")}
        </span>
      </div>

      {/* Progress Bar with range indicator */}
      <div className="mt-4">
        <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden relative">
          <div
            className={`h-full rounded-full transition-all duration-700 ${barColor}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className="flex justify-between items-center text-[10px] text-stone-400 mt-1.5 font-medium">
          <span>Min {min}{unit}</span>
          <span className="text-stone-500 font-semibold">Target {optimalMin}-{optimalMax}{unit}</span>
          <span>Max {max}{unit}</span>
        </div>
      </div>
    </div>
  );
}
