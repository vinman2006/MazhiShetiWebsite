"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppState, RoleType } from "@/lib/store";
import { Sprout, Lock, ArrowRight, ShieldCheck, UserCheck } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function LoginPage() {
  const router = useRouter();
  const { activeRole, setActiveRole } = useAppState();
  const [phoneOrEmail, setPhoneOrEmail] = useState("+91 98223 41092");
  const [password, setPassword] = useState("••••••••");
  const [selectedRole, setSelectedRole] = useState<RoleType>(activeRole);
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setActiveRole(selectedRole);
    setTimeout(() => {
      setLoading(false);
      router.push(`/dashboard/${selectedRole}`);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-brand-cream flex items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 border border-slate-200/80 shadow-card space-y-6">
        {/* Brand header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-brand-primary text-white shadow-md mx-auto">
            <Sprout className="w-6 h-6 text-brand-lime" />
          </Link>
          <h2 className="text-2xl font-black text-brand-text">Welcome to Mazhi Sheti</h2>
          <p className="text-xs text-slate-500">Sign in to access your agricultural dashboard</p>
        </div>

        {/* Stakeholder Role Selector */}
        <div className="space-y-1.5">
          <label className="text-form-label">Select Your Ecosystem Role:</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: "farmer", label: "Farmer", mr: "शेतकरी" },
              { id: "expert", label: "Agronomist", mr: "तज्ज्ञ" },
              { id: "provider", label: "Fleet Provider", mr: "अवजारे" },
              { id: "buyer", label: "Mandi Buyer", mr: "खरेदीदार" },
              { id: "banker", label: "Banker", mr: "बँक" },
              { id: "admin", label: "Admin", mr: "प्रशासक" },
            ].map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setSelectedRole(r.id as RoleType)}
                className={`p-2 rounded-xl text-center border transition-all ${
                  selectedRole === r.id
                    ? "bg-brand-primary text-white border-brand-primary shadow-sm"
                    : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                }`}
              >
                <span className="block text-[11px] font-bold leading-tight">{r.label}</span>
                <span className={`block text-[9px] ${selectedRole === r.id ? "text-brand-lime" : "text-slate-400"}`}>
                  {r.mr}
                </span>
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 pt-2">
          <Input
            label="Phone Number or Email"
            value={phoneOrEmail}
            onChange={(e) => setPhoneOrEmail(e.target.value)}
            placeholder="+91 98223 XXXXX"
            required
          />
          <Input
            label="Password or OTP"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            required
          />

          <div className="flex items-center justify-between text-[11px]">
            <label className="flex items-center gap-1.5 text-slate-600 font-medium">
              <input type="checkbox" defaultChecked className="rounded text-brand-primary" />
              <span>Remember this device</span>
            </label>
            <a href="#forgot" className="font-bold text-brand-primary hover:underline">
              Forgot password?
            </a>
          </div>

          <Button type="submit" size="lg" isLoading={loading} className="w-full">
            <span>Sign In to {selectedRole.toUpperCase()} Portal</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </form>

        <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
          <span>Don&apos;t have an account? </span>
          <Link href="/register" className="font-bold text-brand-primary hover:underline">
            Register your farm / business
          </Link>
        </div>
      </div>
    </div>
  );
}
