"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppState, RoleType } from "@/lib/store";
import { Sprout, ArrowRight, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";

export default function RegisterPage() {
  const router = useRouter();
  const { setActiveRole } = useAppState();
  const [role, setRole] = useState<RoleType>("farmer");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [village, setVillage] = useState("");
  const [district, setDistrict] = useState("Wardha");
  const [loading, setLoading] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setActiveRole(role);
    setTimeout(() => {
      setLoading(false);
      router.push(`/dashboard/${role}`);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-brand-cream flex items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-lg bg-white rounded-3xl p-8 border border-slate-200/80 shadow-card space-y-6">
        {/* Brand header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-brand-primary text-white shadow-md mx-auto">
            <Sprout className="w-6 h-6 text-brand-lime" />
          </Link>
          <h2 className="text-2xl font-black text-brand-text">Join Mazhi Sheti</h2>
          <p className="text-xs text-slate-500">
            Register your farm, agronomy practice, or agricultural business
          </p>
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
              <span>Instant Verification & Access</span>
            </p>
            <p className="text-[11px] text-slate-600">
              Registration provides immediate access to live telemetry simulators and stakeholder networks.
            </p>
          </div>

          <Button type="submit" size="lg" isLoading={loading} className="w-full">
            <span>Complete Registration & Open Portal</span>
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
