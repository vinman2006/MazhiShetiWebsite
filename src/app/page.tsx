"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAppState } from "@/lib/store";
import SensorGauge from "@/components/SensorGauge";
import {
  Sprout,
  Droplets,
  Cpu,
  CloudSun,
  ShieldCheck,
  TrendingUp,
  ArrowRight,
  Activity,
  CheckCircle2,
  RefreshCw,
  PhoneCall,
  Sparkles,
  ShoppingBag,
  Wrench,
  Stethoscope,
  Landmark,
  Layers,
  ChevronRight,
} from "lucide-react";

export default function HomePage() {
  const { data, activeRole, setActiveRole, triggerSensorSync } = useAppState();
  const [syncing, setSyncing] = useState(false);

  const handleSync = () => {
    setSyncing(true);
    triggerSensorSync();
    setTimeout(() => setSyncing(false), 600);
  };

  const tele = data.currentTelemetry;

  const stakeholders = [
    {
      role: "farmer" as const,
      title: "Farmer Command Center",
      marathi: "शेतकरी पोर्टल",
      icon: Sprout,
      color: "bg-emerald-700",
      accent: "text-emerald-700",
      description: "Manage farm plots, live root-zone telemetry, AI crop advisories, and direct mandi selling.",
      href: "/dashboard/farmer",
      features: ["Real-time NPK & Moisture", "Fertigation & Irrigation planner", "Direct produce listing"],
    },
    {
      role: "expert" as const,
      title: "Agronomist Clinic",
      marathi: "कृषी तज्ज्ञ सल्ला केंद्र",
      icon: Stethoscope,
      color: "bg-blue-700",
      accent: "text-blue-700",
      description: "Review field diagnostic inquiries, analyze telemetry logs, and dispatch digital prescriptions.",
      href: "/dashboard/expert",
      features: ["Sucking pest / rust diagnostics", "Soil health verification", "Prescription dispatch"],
    },
    {
      role: "provider" as const,
      title: "Machinery & Drone Fleet",
      marathi: "कृषी अवजारे व ड्रोन सेवा",
      icon: Wrench,
      color: "bg-amber-600",
      accent: "text-amber-600",
      description: "List tractors, laser levelers, and RTK spray drones. Manage bookings across villages.",
      href: "/dashboard/provider",
      features: ["Custom Hiring Center (CHC)", "Operator dispatch scheduling", "Earnings analytics"],
    },
    {
      role: "buyer" as const,
      title: "Wholesale Mandi Exchange",
      marathi: "खरेदीदार व व्यापारी बाजार",
      icon: ShoppingBag,
      color: "bg-purple-700",
      accent: "text-purple-700",
      description: "Procure directly from verified farm gates with certified quality grades and transparent pricing.",
      href: "/dashboard/buyer",
      features: ["Direct farm-to-table lots", "Benchmark Mandi comparisons", "Escrow protected orders"],
    },
    {
      role: "banker" as const,
      title: "Agri-Credit & PMFBY Desk",
      marathi: "बँक कर्ज व पीक विमा",
      icon: Landmark,
      color: "bg-teal-700",
      accent: "text-teal-700",
      description: "Underwrite Kisan Credit Cards, verify land area records, and process PM-KUSUM solar subsidies.",
      href: "/dashboard/banker",
      features: ["4% Subvention KCC approvals", "PM-KUSUM 90% solar subsidy", "PMFBY claim verification"],
    },
    {
      role: "admin" as const,
      title: "Governance & Audit Hub",
      marathi: "प्रशासक व प्रणाली सुरक्षा",
      icon: ShieldCheck,
      color: "bg-stone-800",
      accent: "text-stone-800",
      description: "Monitor ecosystem health, KYC credentials, dispute resolutions, and system audit logs.",
      href: "/dashboard/admin",
      features: ["Real-time platform metrics", "Audit logs & compliance", "Stakeholder verification"],
    },
  ];

  return (
    <div className="flex flex-col">
      {/* ===================== HERO SECTION ===================== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#fbf5e5] via-[#fdfbf7] to-white pt-10 pb-20 border-b border-agri-green-900/10">
        {/* Subtle decorative circles */}
        <div className="absolute top-0 right-10 w-96 h-96 bg-agri-lime/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-agri-green-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Heading and Value Proposition */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-agri-green-900/10 border border-agri-green-900/20 text-agri-green-900 text-xs font-bold">
                <Sprout className="w-4 h-4 text-agri-lime" />
                <span>Smart Soil • Higher Yields • Connected Agri Ecosystem</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-agri-green-950 tracking-tight leading-[1.1]">
                Understand Your Soil. <br />
                <span className="text-agri-green-700 underline decoration-agri-lime decoration-wavy decoration-2">
                  Grow Smarter.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-stone-700 leading-relaxed max-w-xl">
                Mazhi Sheti is India&apos;s complete agricultural operating system. Real-time root-zone soil telemetry, precision AI agronomist advisories, direct mandi marketplace selling, machinery hiring, and instant Kisan credit — united in one connected ecosystem.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href={`/dashboard/${activeRole}`}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-agri-green-900 text-white font-bold text-sm shadow-lg hover:bg-agri-green-800 transition-all hover:shadow-xl active:scale-95"
                >
                  <span>Launch {activeRole.toUpperCase()} Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/sensors"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white border border-stone-300 text-stone-800 font-bold text-sm shadow-sm hover:bg-stone-50 transition-all active:scale-95"
                >
                  <Activity className="w-4 h-4 text-agri-green-800" />
                  <span>Inspect Live Sensor Telemetry</span>
                </Link>
              </div>

              {/* Key Highlights Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-stone-200/60">
                <div className="flex items-center gap-2.5">
                  <Droplets className="w-5 h-5 text-sky-600 flex-shrink-0" />
                  <span className="text-xs font-bold text-stone-800">Real-time Soil Data</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Cpu className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <span className="text-xs font-bold text-stone-800">AI Recommendations</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CloudSun className="w-5 h-5 text-amber-500 flex-shrink-0" />
                  <span className="text-xs font-bold text-stone-800">Weather Forecasts</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-5 h-5 text-agri-green-800 flex-shrink-0" />
                  <span className="text-xs font-bold text-stone-800">Verified Marketplace</span>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Live Root-Zone Telemetry Simulator */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-3xl p-6 shadow-2xl border border-stone-200/80 relative">
                {/* Header of the simulated sensor box */}
                <div className="flex items-center justify-between pb-4 border-b border-stone-100">
                  <div className="flex items-center gap-2.5">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                    </span>
                    <div>
                      <h3 className="text-sm font-extrabold text-stone-900">
                        Soil Sentinel #MS-PRO-8841
                      </h3>
                      <p className="text-[11px] text-stone-500">Wardha Plot A • Desi Cotton BG-II</p>
                    </div>
                  </div>

                  <button
                    onClick={handleSync}
                    disabled={syncing}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold transition"
                    title="Simulate immediate live reading"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${syncing ? "animate-spin text-agri-green-800" : ""}`} />
                    <span>Sync</span>
                  </button>
                </div>

                {/* 6 Key Telemetry Indicators */}
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div className="bg-sky-50/60 p-3.5 rounded-2xl border border-sky-100">
                    <p className="text-[11px] font-bold text-sky-800 uppercase">Soil Moisture</p>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-2xl font-black text-sky-950">{tele.moisturePct}</span>
                      <span className="text-xs font-bold text-sky-700">%</span>
                    </div>
                    <div className="w-full bg-sky-200/60 h-1.5 rounded-full mt-2">
                      <div className="bg-sky-500 h-1.5 rounded-full" style={{ width: `${tele.moisturePct}%` }} />
                    </div>
                  </div>

                  <div className="bg-emerald-50/60 p-3.5 rounded-2xl border border-emerald-100">
                    <p className="text-[11px] font-bold text-emerald-800 uppercase">Nitrogen (N)</p>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-2xl font-black text-emerald-950">{tele.nitrogenPpm}</span>
                      <span className="text-xs font-bold text-emerald-700">ppm</span>
                    </div>
                    <div className="w-full bg-emerald-200/60 h-1.5 rounded-full mt-2">
                      <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${Math.min(100, tele.nitrogenPpm)}%` }} />
                    </div>
                  </div>

                  <div className="bg-amber-50/60 p-3.5 rounded-2xl border border-amber-100">
                    <p className="text-[11px] font-bold text-amber-800 uppercase">Phosphorus (P)</p>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-2xl font-black text-amber-950">{tele.phosphorusPpm}</span>
                      <span className="text-xs font-bold text-amber-700">ppm</span>
                    </div>
                    <div className="w-full bg-amber-200/60 h-1.5 rounded-full mt-2">
                      <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: `${(tele.phosphorusPpm / 35) * 100}%` }} />
                    </div>
                  </div>

                  <div className="bg-purple-50/60 p-3.5 rounded-2xl border border-purple-100">
                    <p className="text-[11px] font-bold text-purple-800 uppercase">Potassium (K)</p>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-2xl font-black text-purple-950">{tele.potassiumPpm}</span>
                      <span className="text-xs font-bold text-purple-700">ppm</span>
                    </div>
                    <div className="w-full bg-purple-200/60 h-1.5 rounded-full mt-2">
                      <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: `${(tele.potassiumPpm / 300) * 100}%` }} />
                    </div>
                  </div>

                  <div className="bg-teal-50/60 p-3.5 rounded-2xl border border-teal-100">
                    <p className="text-[11px] font-bold text-teal-800 uppercase">Soil pH Level</p>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-2xl font-black text-teal-950">{tele.phLevel}</span>
                      <span className="text-xs font-bold text-teal-700">pH</span>
                    </div>
                    <p className="text-[10px] text-teal-700 mt-1 font-semibold">Near Neutral (Optimal)</p>
                  </div>

                  <div className="bg-orange-50/60 p-3.5 rounded-2xl border border-orange-100">
                    <p className="text-[11px] font-bold text-orange-800 uppercase">Soil Temperature</p>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-2xl font-black text-orange-950">{tele.temperatureC}</span>
                      <span className="text-xs font-bold text-orange-700">°C</span>
                    </div>
                    <p className="text-[10px] text-orange-700 mt-1 font-semibold">Active Root Growth</p>
                  </div>
                </div>

                {/* Live AI Advisory Pill */}
                <div className="mt-4 p-3.5 rounded-2xl bg-stone-50 border border-stone-200 flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-agri-lime flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-stone-900">AI Agronomist Recommendation</p>
                    <p className="text-xs text-stone-600 mt-0.5">
                      Moisture is balanced ({tele.moisturePct}%). Hold irrigation until tomorrow sunrise. Foliar spray of 1% 13:00:45 advised for boll weight.
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                  <span className="text-stone-500 font-medium">Battery: 94% • 4G Cellular</span>
                  <Link href="/sensors" className="font-bold text-agri-green-800 hover:underline flex items-center gap-1">
                    <span>Full Diagnostic View</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* 4 Core Quantitative Proof Metrics */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 bg-white/80 backdrop-blur-sm p-6 rounded-3xl border border-agri-green-900/10 shadow-sm">
            <div className="border-r border-stone-200/80 last:border-0 pr-4">
              <span className="text-3xl sm:text-4xl font-black text-agri-green-900">10K+</span>
              <p className="text-xs font-bold text-stone-800 mt-1">Farmers Empowered</p>
              <p className="text-[11px] text-stone-500">Across Vidarbha & Marathwada</p>
            </div>
            <div className="border-r border-stone-200/80 last:border-0 pr-4">
              <span className="text-3xl sm:text-4xl font-black text-agri-green-900">25%</span>
              <p className="text-xs font-bold text-stone-800 mt-1">Higher Crop Yield</p>
              <p className="text-[11px] text-stone-500">Targeted root zone nutrition</p>
            </div>
            <div className="border-r border-stone-200/80 last:border-0 pr-4">
              <span className="text-3xl sm:text-4xl font-black text-agri-green-900">40%</span>
              <p className="text-xs font-bold text-stone-800 mt-1">Water Savings</p>
              <p className="text-[11px] text-stone-500">Precision irrigation cycles</p>
            </div>
            <div>
              <span className="text-3xl sm:text-4xl font-black text-agri-green-900">100%</span>
              <p className="text-xs font-bold text-stone-800 mt-1">Connected Ecosystem</p>
              <p className="text-[11px] text-stone-500">Farmers, experts, traders & banks</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== CONNECTED STAKEHOLDER PORTALS ===================== */}
      <section className="py-20 bg-[#fdfbf7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold tracking-wider uppercase text-agri-green-800 bg-agri-green-100/70 px-3 py-1 rounded-full">
              Connected Architecture
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight mt-3">
              One Unified Ecosystem. Dedicated Role Portals.
            </h2>
            <p className="text-stone-600 text-sm sm:text-base mt-3 leading-relaxed">
              Every participant in the agricultural lifecycle receives a tailored, distraction-free interface while sharing live farm data and transactions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stakeholders.map((s) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.role}
                  className="bg-white rounded-3xl p-6 shadow-card hover:shadow-card-hover border border-stone-200/70 transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-2xl ${s.color} text-white flex items-center justify-center shadow-md`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-bold text-stone-500 bg-stone-100 px-2.5 py-1 rounded-full">
                        {s.marathi}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-stone-900 group-hover:text-agri-green-900 transition-colors">
                      {s.title}
                    </h3>
                    <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                      {s.description}
                    </p>

                    <div className="mt-4 pt-4 border-t border-stone-100 space-y-2">
                      {s.features.map((feat, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-stone-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between">
                    <button
                      onClick={() => setActiveRole(s.role)}
                      className={`text-xs font-bold ${activeRole === s.role ? "text-agri-green-800" : "text-stone-500 hover:text-stone-900"}`}
                    >
                      {activeRole === s.role ? "✓ Active Perspective" : "Set as Perspective"}
                    </button>
                    <Link
                      href={s.href}
                      className="inline-flex items-center gap-1 text-xs font-extrabold text-agri-green-900 hover:text-agri-green-700 transition"
                    >
                      <span>Open Portal</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===================== HOW IT WORKS ===================== */}
      <section className="py-20 bg-white border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold tracking-wider uppercase text-agri-green-800">
              Operational Workflow
            </span>
            <h2 className="text-3xl font-black text-stone-900 tracking-tight mt-2">
              From Soil to Decision in Three Simple Steps
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#fbf5e5]/50 p-6 rounded-3xl border border-stone-200/60 relative">
              <span className="text-4xl font-black text-agri-green-900/20 absolute top-4 right-6">01</span>
              <div className="w-10 h-10 rounded-xl bg-agri-green-900 text-white flex items-center justify-center font-bold mb-4">
                1
              </div>
              <h3 className="text-base font-bold text-stone-900">Plant the Smart Sensor</h3>
              <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                Insert Mazhi Sheti probe into the root zone in under two minutes. It immediately begins sampling soil moisture, NPK, temperature, and electrical conductivity every 15 minutes.
              </p>
            </div>

            <div className="bg-[#fbf5e5]/50 p-6 rounded-3xl border border-stone-200/60 relative">
              <span className="text-4xl font-black text-agri-green-900/20 absolute top-4 right-6">02</span>
              <div className="w-10 h-10 rounded-xl bg-agri-green-900 text-white flex items-center justify-center font-bold mb-4">
                2
              </div>
              <h3 className="text-base font-bold text-stone-900">Watch the Soil Speak</h3>
              <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                Telemetry streams securely to Neon PostgreSQL cloud. Trendlines and nutrient curves become visible on your mobile or desktop in Marathi, Hindi, or English.
              </p>
            </div>

            <div className="bg-[#fbf5e5]/50 p-6 rounded-3xl border border-stone-200/60 relative">
              <span className="text-4xl font-black text-agri-green-900/20 absolute top-4 right-6">03</span>
              <div className="w-10 h-10 rounded-xl bg-agri-green-900 text-white flex items-center justify-center font-bold mb-4">
                3
              </div>
              <h3 className="text-base font-bold text-stone-900">Act with Complete Confidence</h3>
              <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                Receive precise fertigation advisories, consult with verified university agronomists, order drone spraying, or list ready produce on the wholesale mandi exchange.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== PRICING & HARDWARE PACKAGES ===================== */}
      <section className="py-20 bg-[#fdfbf7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold tracking-wider uppercase text-agri-green-800">
              Transparent Pricing
            </span>
            <h2 className="text-3xl font-black text-stone-900 tracking-tight mt-2">
              Start Small. Scale as Your Farm Grows.
            </h2>
            <p className="text-stone-600 text-xs sm:text-sm mt-2">
              One sensor covers roughly an acre of field crops. Eligible for State Government Smart Agriculture subsidies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Starter */}
            <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-stone-900">Starter Pack</h3>
                <p className="text-xs text-stone-500 mt-1">For smallholders & single plots</p>
                <div className="my-6">
                  <span className="text-3xl font-black text-stone-900">₹4,999</span>
                  <span className="text-xs text-stone-500 ml-1">/ one sensor unit</span>
                </div>
                <ul className="space-y-3 text-xs text-stone-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>1 Mazhi Sheti Root-Zone Sensor</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Live Soil Telemetry Dashboard</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>30-day historical data logs</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Basic pest & irrigation alerts</span>
                  </li>
                </ul>
              </div>
              <Link
                href="/dashboard/farmer"
                className="mt-8 w-full py-2.5 rounded-xl border border-agri-green-900 text-agri-green-900 text-center font-bold text-xs hover:bg-agri-green-50 transition"
              >
                Choose Starter
              </Link>
            </div>

            {/* Grower (Featured) */}
            <div className="bg-agri-green-900 text-white rounded-3xl p-8 shadow-xl border-2 border-agri-lime relative flex flex-col justify-between">
              <span className="absolute -top-3 right-6 bg-agri-lime text-agri-green-950 text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-sm">
                Most Popular
              </span>
              <div>
                <h3 className="text-lg font-bold text-white">Grower Trio</h3>
                <p className="text-xs text-stone-300 mt-1">For multi-crop working farms</p>
                <div className="my-6">
                  <span className="text-3xl font-black text-white">₹12,999</span>
                  <span className="text-xs text-stone-300 ml-1">/ 3 sensor units</span>
                </div>
                <ul className="space-y-3 text-xs text-stone-200">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-agri-lime" />
                    <span>3 Mazhi Sheti Multi-Zone Sensors</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-agri-lime" />
                    <span>AI Crop Doctor & Fertigation Guide</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-agri-lime" />
                    <span>Micro-climate weather integration</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-agri-lime" />
                    <span>2-season telemetry archives</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-agri-lime" />
                    <span>Direct Mandi Produce Listing Access</span>
                  </li>
                </ul>
              </div>
              <Link
                href="/dashboard/farmer"
                className="mt-8 w-full py-2.5 rounded-xl bg-agri-lime text-agri-green-950 text-center font-black text-xs hover:bg-agri-lime-hover shadow-md transition"
              >
                Choose Grower Trio
              </Link>
            </div>

            {/* Estate */}
            <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-stone-900">Estate & FPO</h3>
                <p className="text-xs text-stone-500 mt-1">For large estates, orchards & FPOs</p>
                <div className="my-6">
                  <span className="text-3xl font-black text-stone-900">Custom</span>
                  <span className="text-xs text-stone-500 ml-1">/ fleet deployment</span>
                </div>
                <ul className="space-y-3 text-xs text-stone-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>5+ sensor grid with mesh relay</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Dedicated University Agronomist review</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Drone spraying booking priority</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>API access & Custom ERP export</span>
                  </li>
                </ul>
              </div>
              <Link
                href="/advisory"
                className="mt-8 w-full py-2.5 rounded-xl border border-agri-green-900 text-agri-green-900 text-center font-bold text-xs hover:bg-agri-green-50 transition"
              >
                Contact Agronomy Team
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
