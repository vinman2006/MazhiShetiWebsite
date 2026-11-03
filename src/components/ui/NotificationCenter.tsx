"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useAppState } from "@/lib/store";
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Info,
  Calendar,
  ShoppingBag,
  Wrench,
  Landmark,
  Sparkles,
  ArrowRight,
  SlidersHorizontal,
} from "lucide-react";

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const { data, markNotificationAsRead, markAllNotificationsAsRead } = useAppState();
  const containerRef = useRef<HTMLDivElement>(null);

  const notifications = data.notifications || [];
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "booking_update":
        return <Wrench className="w-4 h-4 text-emerald-600" />;
      case "marketplace_order":
        return <ShoppingBag className="w-4 h-4 text-indigo-600" />;
      case "loan_update":
        return <Landmark className="w-4 h-4 text-brand-dark" />;
      case "soil_alert":
        return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      case "irrigation_reminder":
        return <Calendar className="w-4 h-4 text-sky-600" />;
      case "ai_recommendation":
        return <Sparkles className="w-4 h-4 text-purple-600" />;
      default:
        return <Info className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl text-slate-600 hover:text-brand-primary hover:bg-slate-100 transition-colors"
        aria-label="View notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-brand-primary text-white text-[10px] font-black flex items-center justify-center border-2 border-white animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white shadow-2xl border border-slate-200 p-2 z-50 animate-slideDown">
          <div className="px-3 py-2 border-b border-slate-100 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-black text-brand-text">Notifications</h4>
                {unreadCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black">
                    {unreadCount} New
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500">Live farm alerts & ecosystem events</p>
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={() => markAllNotificationsAsRead()}
                  className="text-[11px] font-bold text-brand-primary hover:underline"
                >
                  Mark all read
                </button>
              )}
              <Link
                href="/notifications"
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                title="Notification Settings"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 py-1">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500">
                No notifications right now.
              </div>
            ) : (
              notifications.slice(0, 5).map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    if (!item.isRead) markNotificationAsRead(item.id);
                  }}
                  className={`p-3 rounded-xl transition-colors flex items-start gap-3 cursor-pointer ${
                    item.isRead ? "bg-white hover:bg-slate-50 opacity-80" : "bg-emerald-50/50 hover:bg-emerald-50"
                  }`}
                >
                  <div className="mt-0.5 flex-shrink-0">
                    {getCategoryIcon(item.category)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <p className="text-xs font-bold text-slate-900 truncate">{item.title}</p>
                      <span className="text-[10px] text-slate-400 whitespace-nowrap">{item.createdAt.slice(11, 16) || "Today"}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed line-clamp-2">
                      {item.message}
                    </p>
                    {item.actionUrl && (
                      <div className="mt-1.5">
                        <Link
                          href={item.actionUrl}
                          onClick={() => setIsOpen(false)}
                          className="inline-flex items-center gap-1 text-[10px] font-bold text-brand-primary hover:underline"
                        >
                          <span>{item.actionLabel || "View Details"}</span>
                          <ArrowRight className="w-2.5 h-2.5" />
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="pt-2 border-t border-slate-100 text-center">
            <Link
              href="/notifications"
              onClick={() => setIsOpen(false)}
              className="inline-flex items-center justify-center gap-1.5 w-full py-1.5 text-xs font-bold text-brand-primary hover:bg-brand-light/40 rounded-xl transition"
            >
              <span>Open Full Notification Center</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
