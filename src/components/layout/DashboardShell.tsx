"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppState, RoleType } from "@/lib/store";
import { NotificationCenter } from "@/components/ui/NotificationCenter";
import RoleSwitcher from "@/components/RoleSwitcher";
import {
  Menu,
  X,
  Sprout,
  Stethoscope,
  Wrench,
  ShoppingBag,
  Landmark,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  LogOut,
  LayoutDashboard,
  Activity,
  User,
  Settings,
  HelpCircle,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
}

export interface DashboardShellProps {
  children: React.ReactNode;
  navItems: NavItem[];
  roleTitle: string;
  roleSubtitle: string;
  roleIcon: React.ElementType;
}

export function DashboardShell({
  children,
  navItems,
  roleTitle,
  roleSubtitle,
  roleIcon: RoleIcon,
}: DashboardShellProps) {
  const pathname = usePathname();
  const { data, activeRole } = useAppState();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const currentUser = data.users.find((u) => u.role === activeRole) || data.users[0];

  return (
    <div className="min-h-screen bg-brand-cream flex">
      {/* ================= DESKTOP SIDEBAR ================= */}
      <aside
        className={`hidden md:flex flex-col bg-white border-r border-slate-200/80 transition-all duration-300 z-30 sticky top-0 h-screen ${
          sidebarCollapsed ? "w-20" : "w-64"
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 border-b border-slate-100 flex items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2.5 overflow-hidden">
            <span className="w-9 h-9 rounded-xl bg-brand-primary flex-shrink-0 flex items-center justify-center text-white shadow-sm">
              <Sprout className="w-5 h-5 text-brand-lime" />
            </span>
            {!sidebarCollapsed && (
              <div className="flex flex-col min-w-0">
                <span className="font-extrabold text-sm text-brand-text truncate">Mazhi Sheti</span>
                <span className="text-[10px] font-bold text-brand-primary tracking-wider uppercase truncate">
                  माझी शेती Hub
                </span>
              </div>
            )}
          </Link>

          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Current Role Context Card */}
        <div className="p-3 border-b border-slate-100">
          <div
            className={`p-2.5 rounded-2xl bg-brand-light/60 border border-brand-light flex items-center ${
              sidebarCollapsed ? "justify-center" : "gap-3"
            }`}
          >
            <div className="w-8 h-8 rounded-xl bg-brand-primary text-white flex items-center justify-center flex-shrink-0">
              <RoleIcon className="w-4 h-4 text-brand-lime" />
            </div>
            {!sidebarCollapsed && (
              <div className="min-w-0 flex-1">
                <p className="text-xs font-black text-brand-dark truncate">{roleTitle}</p>
                <p className="text-[10px] text-slate-500 truncate">{roleSubtitle}</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? "bg-brand-primary text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 hover:text-brand-text"
                } ${sidebarCollapsed ? "justify-center px-0" : ""}`}
                title={sidebarCollapsed ? item.label : undefined}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {!sidebarCollapsed && <span className="flex-1 truncate">{item.label}</span>}
                {!sidebarCollapsed && item.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                      isActive ? "bg-white/20 text-white" : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom User Profile */}
        <div className="p-3 border-t border-slate-100">
          <div
            className={`flex items-center ${
              sidebarCollapsed ? "justify-center" : "gap-3"
            } p-2 rounded-2xl hover:bg-slate-50 transition-colors`}
          >
            <div className="w-8 h-8 rounded-xl bg-slate-200 flex items-center justify-center text-slate-700 font-bold text-xs flex-shrink-0">
              {currentUser.fullName.charAt(0)}
            </div>
            {!sidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-900 truncate">{currentUser.fullName}</p>
                <p className="text-[10px] text-slate-400 truncate">{currentUser.village || "Maharashtra"}</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* ================= MAIN CONTENT WRAPPER ================= */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-20 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Mobile Drawer Trigger */}
            <button
              onClick={() => setMobileDrawerOpen(true)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 md:hidden"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5 text-brand-dark" />
            </button>

            <div className="hidden sm:flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-slate-700">IoT Soil Sentinel Connected</span>
            </div>
          </div>

          {/* Top Actions: Role Switcher & Notifications */}
          <div className="flex items-center gap-3">
            <RoleSwitcher />
            <NotificationCenter />
            <Link
              href="/"
              className="hidden sm:inline-flex text-xs font-bold text-slate-600 hover:text-brand-primary px-3 py-1.5 rounded-xl hover:bg-slate-100 transition-colors"
            >
              Exit to Website
            </Link>
          </div>
        </header>

        {/* Page Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-fadeIn">
          {children}
        </main>
      </div>

      {/* ================= MOBILE NAVIGATION DRAWER ================= */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setMobileDrawerOpen(false)}
          />

          {/* Drawer content */}
          <div className="relative w-72 bg-white h-full shadow-2xl flex flex-col z-10 animate-slideDown">
            <div className="h-16 border-b border-slate-100 flex items-center justify-between px-4">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-brand-primary text-white flex items-center justify-center font-bold">
                  MS
                </span>
                <span className="font-extrabold text-sm text-brand-text">{roleTitle}</span>
              </div>
              <button
                onClick={() => setMobileDrawerOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto p-4 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileDrawerOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold ${
                      isActive
                        ? "bg-brand-primary text-white"
                        : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t border-slate-100">
              <Link
                href="/"
                onClick={() => setMobileDrawerOpen(false)}
                className="block text-center w-full py-2.5 text-xs font-bold text-slate-600 bg-slate-100 rounded-xl"
              >
                Return to Public Website
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
