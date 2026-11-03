import React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
}

export function Card({ children, hoverEffect = false, className = "", ...props }: CardProps) {
  return (
    <div
      className={`bg-white rounded-3xl p-6 shadow-card border border-slate-200/80 transition-all duration-200 ${
        hoverEffect ? "hover:shadow-card-hover hover:border-slate-300" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
  change?: string;
  trend?: "up" | "down" | "neutral";
  icon?: React.ReactNode;
  iconBg?: string;
  subtext?: string;
}

export function StatCard({
  label,
  value,
  unit,
  change,
  trend = "neutral",
  icon,
  iconBg = "bg-brand-light text-brand-dark",
  subtext,
}: StatCardProps) {
  return (
    <Card hoverEffect className="flex flex-col justify-between">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-label-sm">{label}</p>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl sm:text-3xl font-black text-brand-text font-mono">{value}</span>
            {unit && <span className="text-xs font-bold text-slate-500">{unit}</span>}
          </div>
        </div>
        {icon && <div className={`p-3 rounded-2xl ${iconBg}`}>{icon}</div>}
      </div>

      {(change || subtext) && (
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          {change && (
            <div
              className={`flex items-center gap-1 font-bold ${
                trend === "up"
                  ? "text-emerald-700"
                  : trend === "down"
                  ? "text-rose-700"
                  : "text-slate-500"
              }`}
            >
              {trend === "up" && <TrendingUp className="w-3.5 h-3.5" />}
              {trend === "down" && <TrendingDown className="w-3.5 h-3.5" />}
              {trend === "neutral" && <Minus className="w-3.5 h-3.5" />}
              <span>{change}</span>
            </div>
          )}
          {subtext && <span className="text-[11px] text-slate-500">{subtext}</span>}
        </div>
      )}
    </Card>
  );
}
