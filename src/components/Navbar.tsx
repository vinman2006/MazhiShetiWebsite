"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppState } from "@/lib/store";
import { useFirebaseAuth } from "@/lib/firebase-auth-context";
import RoleSwitcher from "./RoleSwitcher";
import {
  Menu,
  X,
  ArrowRight,
  Sprout,
  Activity,
  ShoppingBag,
  Wrench,
  Stethoscope,
  Landmark,
  LayoutDashboard,
  LogIn,
  LogOut,
  User,
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const { activeRole } = useAppState();
  const { user, logout } = useFirebaseAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/services", label: "Services" },
    { href: "/marketplace", label: "Marketplace" },
    { href: "/sensors", label: "Soil Telemetry" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <span className="w-9 h-9 rounded-xl bg-brand-primary flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <Sprout className="w-5 h-5 text-brand-lime" />
            </span>
            <div className="flex flex-col">
              <span className="font-extrabold text-base text-brand-text tracking-tight leading-none">
                Mazhi Sheti
              </span>
              <span className="text-[10px] font-bold text-brand-primary tracking-wider uppercase mt-0.5">
                माझी शेती • Agri Ecosystem
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                    isActive
                      ? "bg-brand-primary text-white shadow-sm"
                      : "text-slate-600 hover:text-brand-text hover:bg-slate-100"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Section: Role Switcher & Action */}
          <div className="hidden sm:flex items-center gap-3">
            <RoleSwitcher />
            {user ? (
              <div className="flex items-center gap-2">
                <span
                  className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1.5 rounded-xl truncate max-w-[140px]"
                  title={user.email || user.displayName || ""}
                >
                  {user.displayName || user.email?.split("@")[0] || "User"}
                </span>
                <button
                  onClick={() => logout()}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="text-xs font-bold text-slate-700 hover:text-brand-primary px-3 py-1.5 rounded-xl hover:bg-slate-100 transition-colors"
              >
                Sign In
              </Link>
            )}
            <Link
              href={`/dashboard/${activeRole}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-brand-primary text-white shadow-sm hover:bg-brand-dark transition-all active:scale-95"
            >
              <span>{activeRole.toUpperCase()} Portal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <RoleSwitcher />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 hover:bg-slate-100"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 text-brand-dark" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-1 shadow-lg animate-slideDown">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-brand-cream hover:text-brand-primary"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-slate-100 mt-2 space-y-2">
            {user ? (
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs font-bold text-slate-700 truncate max-w-[180px]">
                  {user.displayName || user.email}
                </span>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 py-2 text-center text-xs font-bold text-slate-700 bg-slate-100 rounded-xl"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 py-2 text-center text-xs font-bold text-brand-dark bg-brand-light rounded-xl"
                >
                  Register
                </Link>
              </div>
            )}
            <Link
              href={`/dashboard/${activeRole}`}
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-brand-primary text-white rounded-xl text-xs font-bold shadow-sm"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Launch {activeRole.toUpperCase()} Dashboard</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
