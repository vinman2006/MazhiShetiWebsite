"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppState, RoleType } from "@/lib/store";
import { useFirebaseAuth } from "@/lib/firebase-auth-context";
import {
  Sprout,
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  KeyRound,
  LogOut,
} from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function LoginPage() {
  const router = useRouter();
  const { activeRole, setActiveRole } = useAppState();
  const {
    user,
    loading: authLoading,
    error: authError,
    setError: setAuthError,
    signInWithEmail,
    signInWithGoogle,
    logout,
    sendPasswordReset,
  } = useFirebaseAuth();

  const [email, setEmail] = useState("farmer@mazhisheti.in");
  const [password, setPassword] = useState("Password@123");
  const [selectedRole, setSelectedRole] = useState<RoleType>(activeRole);
  const [submitting, setSubmitting] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [resetMode, setResetMode] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setAuthError(null);
    try {
      await signInWithEmail(email, password);
      setActiveRole(selectedRole);
      router.push(`/dashboard/${selectedRole}`);
    } catch (err: any) {
      // If user doesn't exist yet in Firebase Auth during initial test, offer instant demo fallback
      console.warn("Firebase sign-in error:", err.code, err.message);
      // If user desires simulation demo login or credentials need setup
      if (err.code === "auth/invalid-credential" || err.code === "auth/user-not-found" || err.code === "auth/wrong-password") {
        setAuthError("Invalid credentials. If this is your first time, register an account or use Demo Direct Access below.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setSubmitting(true);
    setAuthError(null);
    try {
      await signInWithGoogle();
      setActiveRole(selectedRole);
      router.push(`/dashboard/${selectedRole}`);
    } catch (err: any) {
      console.warn("Google sign-in error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDirectDemoAccess = () => {
    setActiveRole(selectedRole);
    router.push(`/dashboard/${selectedRole}`);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setAuthError("Please enter your registered email address first.");
      return;
    }
    setSubmitting(true);
    try {
      await sendPasswordReset(email);
      setResetSent(true);
      setAuthError(null);
    } catch (err: any) {
      setAuthError(err.message || "Failed to send password reset email.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-cream flex items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 border border-slate-200/80 shadow-card space-y-6">
        {/* Brand header */}
        <div className="text-center space-y-2">
          <Link
            href="/"
            className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-brand-primary text-white shadow-md mx-auto"
          >
            <Sprout className="w-6 h-6 text-brand-lime" />
          </Link>
          <h2 className="text-2xl font-black text-brand-text">Welcome to Mazhi Sheti</h2>
          <p className="text-xs text-slate-500">
            Sign in with Firebase Authentication to access your ecosystem portal
          </p>
        </div>

        {/* Active Firebase User Banner if already signed in */}
        {user && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Currently Signed In</span>
              </span>
              <button
                onClick={() => logout()}
                className="text-[11px] text-rose-600 hover:text-rose-800 font-bold flex items-center gap-1"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
            <p className="text-slate-600 truncate font-mono text-[11px]">
              {user.email || user.displayName || user.uid}
            </p>
            <Button
              type="button"
              size="sm"
              onClick={handleDirectDemoAccess}
              className="w-full mt-1"
            >
              <span>Continue to {selectedRole.toUpperCase()} Portal</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </div>
        )}

        {/* Error notification banner */}
        {authError && (
          <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2 animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-bold">Authentication Notice</p>
              <p className="text-[11px] text-rose-700">{authError}</p>
            </div>
          </div>
        )}

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
                <span
                  className={`block text-[9px] ${
                    selectedRole === r.id ? "text-brand-lime" : "text-slate-400"
                  }`}
                >
                  {r.mr}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Google One-Click Login Button */}
        <div>
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={submitting || authLoading}
            className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition shadow-sm active:scale-98 disabled:opacity-50"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>
        </div>

        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-slate-200"></div>
          <span className="flex-shrink mx-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            or email sign in
          </span>
          <div className="flex-grow border-t border-slate-200"></div>
        </div>

        {/* Reset Password Form */}
        {resetMode ? (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-800">Reset Password</p>
              <p className="text-[11px] text-slate-500">
                Enter your email address to receive a secure Firebase password reset link.
              </p>
            </div>

            {resetSent && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Password reset link sent! Check your inbox.</span>
              </div>
            )}

            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="farmer@mazhisheti.in"
              required
            />

            <div className="flex gap-2">
              <Button type="submit" size="sm" isLoading={submitting} className="flex-1">
                <span>Send Reset Link</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setResetMode(false)}
              >
                <span>Back to Login</span>
              </Button>
            </div>
          </form>
        ) : (
          /* Firebase Email & Password Form */
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="farmer@mazhisheti.in"
              required
            />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />

            <div className="flex items-center justify-between text-[11px]">
              <label className="flex items-center gap-1.5 text-slate-600 font-medium cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded text-brand-primary cursor-pointer"
                />
                <span>Remember this session</span>
              </label>
              <button
                type="button"
                onClick={() => setResetMode(true)}
                className="font-bold text-brand-primary hover:underline"
              >
                Forgot password?
              </button>
            </div>

            <Button
              type="submit"
              size="lg"
              isLoading={submitting || authLoading}
              className="w-full"
            >
              <span>Sign In with Firebase Auth</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>

            {/* Direct Guest / Quick Access bypass */}
            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={handleDirectDemoAccess}
                className="text-[11px] font-bold text-slate-500 hover:text-brand-primary transition underline"
              >
                Direct Access (Guest Simulator Mode) →
              </button>
            </div>
          </form>
        )}

        <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
          <span>Don&apos;t have an account? </span>
          <Link href="/register" className="font-bold text-brand-primary hover:underline">
            Register your farm / business with Firebase
          </Link>
        </div>
      </div>
    </div>
  );
}
