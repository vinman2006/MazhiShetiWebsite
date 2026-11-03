"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppState, RoleType } from "@/lib/store";
import { useFirebaseAuth } from "@/lib/firebase-auth-context";
import { Sprout, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";

export default function RegisterPage() {
  const router = useRouter();
  const { setActiveRole } = useAppState();
  const {
    user,
    signUpWithEmail,
    signInWithGoogle,
    loading: authLoading,
    error: authError,
    setError: setAuthError,
  } = useFirebaseAuth();

  const [role, setRole] = useState<RoleType>("farmer");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [village, setVillage] = useState("");
  const [district, setDistrict] = useState("Wardha");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAuthError(null);

    try {
      if (email && password) {
        // Create user in Firebase Authentication
        await signUpWithEmail(email, password, fullName);
      }
      setActiveRole(role);
      setTimeout(() => {
        setLoading(false);
        router.push(role === "farmer" ? "/onboarding/farmer" : `/dashboard/${role}`);
      }, 500);
    } catch (err: any) {
      console.warn("Firebase registration failed:", err);
      // If error occurred, let the user decide whether to bypass with demo mode
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setLoading(true);
    setAuthError(null);
    try {
      await signInWithGoogle();
      setActiveRole(role);
      router.push(role === "farmer" ? "/onboarding/farmer" : `/dashboard/${role}`);
    } catch (err: any) {
      console.warn("Google registration failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-cream flex items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-lg bg-white rounded-3xl p-8 border border-slate-200/80 shadow-card space-y-6">
        {/* Brand header */}
        <div className="text-center space-y-2">
          <Link
            href="/"
            className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-brand-primary text-white shadow-md mx-auto"
          >
            <Sprout className="w-6 h-6 text-brand-lime" />
          </Link>
          <h2 className="text-2xl font-black text-brand-text">Join Mazhi Sheti</h2>
          <p className="text-xs text-slate-500">
            Create your account via Firebase Auth to access smart agriculture tools
          </p>
        </div>

        {/* Auth Error Banner */}
        {authError && (
          <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-bold">Registration Notice</p>
              <p className="text-[11px] text-rose-700">{authError}</p>
            </div>
          </div>
        )}

        {/* Google Quick Sign-Up */}
        <div>
          <button
            type="button"
            onClick={handleGoogleSignUp}
            disabled={loading || authLoading}
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
            <span>Sign Up with Google</span>
          </button>
        </div>

        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-slate-200"></div>
          <span className="flex-shrink mx-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            or register with email
          </span>
          <div className="flex-grow border-t border-slate-200"></div>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <Select
            label="I am joining as a:"
            value={role}
            onChange={(e) => setRole(e.target.value as RoleType)}
            options={[
              { value: "farmer", label: "Farmer (शेतकरी) — Plot management & Soil telemetry" },
              { value: "expert", label: "Agronomist / Expert (कृषी तज्ज्ञ) — Consultations" },
              { value: "provider", label: "Equipment & Drone Provider (अवजारे सेवा) — Fleet hiring" },
              { value: "buyer", label: "Produce Buyer / Trader (खरेदीदार) — Mandi lots" },
              { value: "banker", label: "Bank / Insurance Representative (बँक प्रतिनिधी)" },
            ]}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Legal Name"
              placeholder="e.g. Rameshwar Sadashiv Shinde"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
            <Input
              label="Mobile Number (WhatsApp)"
              placeholder="+91 98223 XXXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="farmer@mazhisheti.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Create Password"
              type="password"
              placeholder="Min 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Village / Town"
              placeholder="e.g. Ashti"
              value={village}
              onChange={(e) => setVillage(e.target.value)}
              required
            />
            <Select
              label="District (Maharashtra)"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              options={[
                { value: "Wardha", label: "Wardha (वर्धा)" },
                { value: "Nagpur", label: "Nagpur (नागपूर)" },
                { value: "Amravati", label: "Amravati (अमरावती)" },
                { value: "Akola", label: "Akola (अकोला)" },
                { value: "Jalgaon", label: "Jalgaon (जळगाव)" },
                { value: "Nashik", label: "Nashik (नाशिक)" },
                { value: "Yavatmal", label: "Yavatmal (यवतमाळ)" },
              ]}
            />
          </div>

          <div className="p-3 bg-brand-light/50 rounded-2xl border border-brand-light text-xs text-brand-dark space-y-1">
            <p className="font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-brand-primary" />
              <span>Firebase Identity & Encryption</span>
            </p>
            <p className="text-[11px] text-slate-600">
              Your credentials and session are protected with Firebase Auth SSL encryption and token refresh.
            </p>
          </div>

          <Button type="submit" size="lg" isLoading={loading || authLoading} className="w-full">
            <span>Register Account in Firebase</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </form>

        <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
          <span>Already registered? </span>
          <Link href="/login" className="font-bold text-brand-primary hover:underline">
            Sign in here
          </Link>
        </div>
      </div>
    </div>
  );
}
