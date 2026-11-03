"use client";

import React, { useState, useRef, useEffect } from "react";
import { Bell, CheckCircle2, AlertTriangle, Info, X } from "lucide-react";

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: "info" | "warning" | "success";
  read: boolean;
}

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: "notif_1",
      title: "Soil Moisture Normalizing",
      message: "Wardha Plot A moisture holds steady at 48.4%. Deep root irrigation not required today.",
      time: "10 mins ago",
      type: "success",
      read: false,
    },
    {
      id: "notif_2",
      title: "Foliar Spray Advisory",
      message: "Dr. Anjali Deshmukh issued a recommended dosage for Cotton BG-II boll growth.",
      time: "1 hour ago",
      type: "info",
      read: false,
    },
    {
      id: "notif_3",
      title: "Mandi Benchmark Updated",
      message: "Lasalgaon onion yard rate increased to ₹28/kg (+₹2.50).",
      time: "3 hours ago",
      type: "warning",
      read: true,
    },
  ]);

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

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
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
          <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-brand-primary text-white text-[10px] font-black flex items-center justify-center border-2 border-white">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white shadow-xl border border-slate-200 p-2 z-50 animate-slideDown">
          <div className="px-3 py-2 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-brand-text">Notifications</h4>
              <p className="text-[11px] text-slate-500">Live farm alerts and ecosystem updates</p>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-[11px] font-bold text-brand-primary hover:underline"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 py-1">
            {notifications.map((item) => (
              <div
                key={item.id}
                className={`p-3 rounded-xl transition-colors flex items-start gap-3 ${
                  item.read ? "bg-white hover:bg-slate-50" : "bg-emerald-50/50 hover:bg-emerald-50"
                }`}
              >
                <div className="mt-0.5">
                  {item.type === "success" && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                  {item.type === "warning" && <AlertTriangle className="w-4 h-4 text-amber-600" />}
                  {item.type === "info" && <Info className="w-4 h-4 text-sky-600" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-slate-900 truncate">{item.title}</p>
                    <span className="text-[10px] text-slate-400">{item.time}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">{item.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
