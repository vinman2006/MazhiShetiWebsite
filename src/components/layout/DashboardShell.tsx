"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppState, RoleType } from "@/lib/store";
import { useFirebaseAuth } from "@/lib/firebase-auth-context";
import { canAccessPortal } from "@/lib/permissions";
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
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  LogOut,
  LayoutDashboard,
  Activity,
  User,
  Settings,
  HelpCircle,
  ArrowRight,
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
  const { user, logout } = useFirebaseAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const currentUser = data.users.find((u) => u.role === activeRole) || data.users[0];
  const access = canAccessPortal(activeRole, pathname);

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
              sidebarCollapsed ? "justify-center" : "gap-2.5"
            } p-2 rounded-2xl hover:bg-slate-50 transition-colors`}
          >
            <div className="w-8 h-8 rounded-xl bg-brand-light text-brand-dark flex items-center justify-center font-bold text-xs flex-shrink-0">
              {user?.displayName?.charAt(0) || user?.email?.charAt(0) || currentUser.fullName.charAt(0)}
            </div>
            {!sidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-900 truncate">
                  {user?.displayName || user?.email?.split("@")[0] || currentUser.fullName}
                </p>
                <p className="text-[10px] text-slate-400 truncate">
                  {user?.email || currentUser.village || "Maharashtra"}
                </p>
              </div>
            )}
            {!sidebarCollapsed && user && (
              <button
                onClick={() => logout()}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                title="Sign out of Firebase"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
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
            {user && (
              <button
                onClick={() => logout()}
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-rose-600 px-2.5 py-1.5 rounded-xl hover:bg-rose-50 transition-colors"
                title="Sign out of Firebase"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            )}
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
          {!access.allowed ? (
            <div className="bg-white rounded-3xl p-8 sm:p-12 text-center max-w-2xl mx-auto shadow-xl border border-rose-200 space-y-6 my-12 animate-slideDown">
              <div className="w-16 h-16 rounded-3xl bg-rose-100 text-rose-700 flex items-center justify-center mx-auto shadow-inner">
                <ShieldAlert className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <span className="px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-800 text-xs font-black uppercase tracking-wider">
                  Access Restricted • 403 Forbidden
                </span>
                <h2 className="text-2xl font-black text-slate-900">
                  Role Authorization Required
                </h2>
                <p className="text-xs text-slate-600 leading-relaxed max-w-md mx-auto">
                  {access.reason || "You do not have administrative or role-specific privileges to view this portal."}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
                <p>Currently signed in as: <strong className="font-bold text-slate-900">{currentUser.fullName}</strong></p>
                <p>Active Role: <strong className="font-mono font-bold uppercase text-brand-primary">{activeRole}</strong></p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <Link
                  href={access.redirectUrl || `/dashboard/${activeRole === "equipment_provider" ? "provider" : activeRole}`}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-brand-primary text-white text-xs font-bold shadow-md hover:bg-emerald-800 transition w-full sm:w-auto"
                >
                  <span>Go to My Authorized Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/"
                  className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-bold transition w-full sm:w-auto"
                >
                  Return to Home
                </Link>
              </div>
            </div>
          ) : (
            children
          )}
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
