import React from "react";
import { FolderOpen, AlertCircle } from "lucide-react";
import { Button } from "./Button";

export function EmptyState({
  title = "No data available",
  description = "There are no items recorded in this section yet.",
  icon = <FolderOpen className="w-10 h-10 text-slate-400" />,
  actionLabel,
  onAction,
}: {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="w-full py-12 px-4 rounded-3xl border border-dashed border-slate-300 bg-white/60 flex flex-col items-center justify-center text-center">
      <div className="p-3 bg-slate-100 rounded-2xl mb-3">{icon}</div>
      <h3 className="text-sm font-bold text-slate-800">{title}</h3>
      <p className="text-xs text-slate-500 mt-1 max-w-sm leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <Button size="sm" variant="outline" className="mt-4" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-slate-200/80 rounded-xl ${className}`} />;
}

export function ErrorMessage({
  title = "An error occurred",
  message,
  onRetry,
}: {
  title?: string;
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-3">
      <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <h4 className="text-xs font-bold text-rose-900">{title}</h4>
        <p className="text-xs text-rose-700 mt-0.5 leading-relaxed">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-xs font-bold text-rose-800 underline hover:text-rose-900 flex-shrink-0"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
