"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, Home, Search, X } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-500">
      <Link href="/" className="hover:text-brand-primary transition-colors flex items-center">
        <Home className="w-3.5 h-3.5" />
      </Link>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={index}>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            {isLast || !item.href ? (
              <span className="font-bold text-slate-800">{item.label}</span>
            ) : (
              <Link href={item.href} className="hover:text-brand-primary transition-colors">
                {item.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}

export function SearchBar({
  value,
  onChange,
  placeholder = "Search...",
  className = "",
}: {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <div className={`relative flex items-center ${className}`}>
      <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full text-xs font-medium text-slate-900 bg-white border border-slate-300 rounded-xl pl-10 pr-9 py-2.5 outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-light transition-all"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-3 text-slate-400 hover:text-slate-600 p-0.5 rounded-full"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}

export function FilterBar<T extends string>({
  options,
  active,
  onChange,
  className = "",
}: {
  options: Array<{ id: T; label: string; count?: number }>;
  active: T;
  onChange: (id: T) => void;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-1.5 overflow-x-auto pb-1 ${className}`}>
      {options.map((opt) => {
        const isSelected = opt.id === active;
        return (
          <button
            key={opt.id}
            onClick={() => onChange(opt.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              isSelected
                ? "bg-brand-primary text-white shadow-sm"
                : "bg-white text-slate-600 hover:bg-slate-100 hover:text-brand-text border border-slate-200"
            }`}
          >
            <span>{opt.label}</span>
            {opt.count !== undefined && (
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isSelected ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                }`}
              >
                {opt.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
