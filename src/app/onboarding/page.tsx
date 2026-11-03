"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppState } from "@/lib/store";

export default function OnboardingRouterPage() {
  const router = useRouter();
  const { activeRole, onboarding } = useAppState();

  useEffect(() => {
    if (activeRole === "farmer") {
      router.replace("/onboarding/farmer");
    } else {
      router.replace(`/dashboard/${activeRole}`);
    }
  }, [activeRole, router]);

  return (
    <div className="min-h-screen bg-brand-cream flex items-center justify-center p-4">
      <div className="text-center space-y-3">
        <div className="w-10 h-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs font-bold text-slate-700">Redirecting to role-based onboarding...</p>
      </div>
    </div>
  );
}
