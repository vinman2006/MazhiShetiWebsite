"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

export interface DropdownItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string;
  danger?: boolean;
  onClick: () => void;
}

export interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  align?: "left" | "right";
  className?: string;
}

export function Dropdown({ trigger, items, align = "right", className = "" }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className={`relative inline-block text-left ${className}`}>
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>

      {isOpen && (
        <div
          className={`absolute ${
            align === "right" ? "right-0" : "left-0"
          } mt-2 w-56 rounded-2xl bg-white shadow-xl border border-slate-200 p-1.5 z-50 animate-slideDown`}
        >
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                item.onClick();
                setIsOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-xl transition-colors ${
                item.danger
                  ? "text-rose-600 hover:bg-rose-50"
                  : "text-slate-700 hover:bg-slate-100 hover:text-brand-primary"
              }`}
            >
              <div className="flex items-center gap-2.5">
                {item.icon && <span className="text-slate-400">{item.icon}</span>}
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
