import React from "react";
import { ChevronDown } from "lucide-react";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  helperText?: string;
  error?: string;
  options: Array<{ value: string; label: string }>;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, helperText, error, options, className = "", id, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full space-y-1">
        {label && (
          <label htmlFor={selectId} className="text-form-label">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          <select
            id={selectId}
            ref={ref}
            className={`w-full text-xs font-medium text-slate-900 bg-white border rounded-xl py-2.5 pl-3.5 pr-10 appearance-none transition-all outline-none focus:ring-2 focus:ring-offset-1 ${
              error
                ? "border-rose-400 focus:border-rose-500 focus:ring-rose-200"
                : "border-slate-300 hover:border-slate-400 focus:border-brand-primary focus:ring-brand-light"
            } disabled:bg-slate-50 disabled:text-slate-400 ${className}`}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <div className="absolute right-3.5 text-slate-400 pointer-events-none flex items-center">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
        {error ? (
          <p className="text-[11px] font-semibold text-rose-600 animate-fadeIn">{error}</p>
        ) : helperText ? (
          <p className="text-[11px] text-slate-500">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Select.displayName = "Select";
