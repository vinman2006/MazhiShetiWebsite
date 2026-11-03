import React from "react";

export interface BadgeProps {
  children: React.ReactNode;
  variant?: "success" | "warning" | "danger" | "info" | "neutral" | "lime";
  size?: "sm" | "md";
  dot?: boolean;
  className?: string;
}

export function Badge({
  children,
  variant = "neutral",
  size = "md",
  dot = false,
  className = "",
}: BadgeProps) {
  const variantStyles = {
    success: "bg-emerald-50 text-emerald-800 border-emerald-200",
    warning: "bg-amber-50 text-amber-800 border-amber-200",
    danger: "bg-rose-50 text-rose-800 border-rose-200",
    info: "bg-sky-50 text-sky-800 border-sky-200",
    neutral: "bg-slate-100 text-slate-700 border-slate-200",
    lime: "bg-[#f4fde6] text-brand-dark border-lime-300",
  };

  const dotColors = {
    success: "bg-emerald-500",
    warning: "bg-amber-500",
    danger: "bg-rose-500",
    info: "bg-sky-500",
    neutral: "bg-slate-500",
    lime: "bg-brand-lime",
  };

  const sizeStyles = {
    sm: "text-[10px] px-2 py-0.5 gap-1",
    md: "text-xs px-2.5 py-1 gap-1.5",
  };

  return (
    <span
      className={`inline-flex items-center font-bold border rounded-full uppercase tracking-wider select-none ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]} animate-pulse`} />}
      <span>{children}</span>
    </span>
  );
}

export function StatusIndicator({
  status,
  label,
  className = "",
}: {
  status: "online" | "offline" | "syncing" | "warning";
  label?: string;
  className?: string;
}) {
  const statusConfig = {
    online: { color: "bg-emerald-500", text: "Online & Active" },
    offline: { color: "bg-slate-400", text: "Offline" },
    syncing: { color: "bg-brand-lime", text: "Syncing Telemetry" },
    warning: { color: "bg-amber-500", text: "Requires Attention" },
  };

  const config = statusConfig[status];

  return (
    <div className={`inline-flex items-center gap-2 text-xs font-semibold text-slate-600 ${className}`}>
      <span className="relative flex h-2 w-2">
        <span
          className={`animate-ping absolute inline-flex h-full w-full rounded-full ${config.color} opacity-75`}
        />
        <span className={`relative inline-flex rounded-full h-2 w-2 ${config.color}`} />
      </span>
      {label ? <span>{label}</span> : <span>{config.text}</span>}
    </div>
  );
}
