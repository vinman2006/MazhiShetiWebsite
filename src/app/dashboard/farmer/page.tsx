"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAppState } from "@/lib/store";
import { DashboardShell } from "@/components/layout/DashboardShell";
import SensorGauge from "@/components/SensorGauge";
import { Button } from "@/components/ui/Button";
import { StatCard } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { MiniBarChart } from "@/components/ui/MiniChart";
import {
  Sprout,
  Droplets,
  CloudSun,
  Sparkles,
  ArrowRight,
  RefreshCw,
  PlusCircle,
  FileText,
  Calendar,
  AlertTriangle,
  CheckCircle,
  ShoppingBag,
  Wrench,
  Stethoscope,
  Landmark,
  MapPin,
  TrendingUp,
  Cpu,
  LayoutDashboard,
  Activity,
} from "lucide-react";

export default function FarmerDashboard() {
  const { data, triggerSensorSync } = useAppState();
  const [syncing, setSyncing] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "plots" | "advisory" | "actions">("overview");

  const farmer = data.users.find((u) => u.role === "farmer") || data.users[0];
  const farm = data.farms[0];
  const plots = data.plots;
  const tele = data.currentTelemetry;
  const recommendations = data.recommendations;

  const handleSync = () => {
    setSyncing(true);
    triggerSensorSync();
    setTimeout(() => setSyncing(false), 500);
  };

  const navItems = [
    { label: "Overview & Telemetry", href: "/dashboard/farmer", icon: LayoutDashboard },
    { label: "Deep Root Telemetry", href: "/sensors", icon: Activity, badge: "Live" },
    { label: "Produce Mandi", href: "/marketplace", icon: ShoppingBag },
    { label: "Machinery & Drones", href: "/rentals", icon: Wrench },
    { label: "Agronomist Clinic", href: "/advisory", icon: Stethoscope },
    { label: "Agri-Credit & PMFBY", href: "/finance", icon: Landmark },
  ];

  return (
    <DashboardShell
      navItems={navItems}
      roleTitle="Farmer Command Center"
      roleSubtitle={`${farm.name} • Wardha`}
      roleIcon={Sprout}
    >
      <div className="space-y-8">
        {/* ===================== FARMER HERO BANNER ===================== */}
        <div className="bg-gradient-to-r from-brand-dark via-brand-primary to-emerald-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-brand-lime/10 blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-brand-lime text-xs font-bold">
                <Sprout className="w-3.5 h-3.5" />
                <span>शेतकरी नियंत्रण कक्ष • Precision Operations Hub</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{farm.name}</h1>
              <div className="flex flex-wrap items-center gap-4 text-xs text-stone-200">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-brand-lime" />
                  {farm.village}, {farm.taluka}, {farm.district}
                </span>
                <span>•</span>
                <span>Area: <strong className="text-white">{farm.totalAcres} Acres</strong></span>
                <span>•</span>
                <span>Soil: <strong className="text-white">{farm.soilType}</strong></span>
                <span>•</span>
                <span>Survey No: <strong className="text-white">{farm.surveyNumber}</strong></span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="md"
                onClick={handleSync}
                isLoading={syncing}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                leftIcon={<RefreshCw className="w-4 h-4 text-brand-lime" />}
              >
                Sync Sensors
              </Button>

              <Link href="/advisory">
                <Button variant="accent" size="md" leftIcon={<Stethoscope className="w-4 h-4" />}>
                  Ask Crop Doctor
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1.5 border-b border-slate-200 pb-3 overflow-x-auto">
          {[
            { id: "overview", label: "Telemetry & AI Overview" },
            { id: "plots", label: `Plot Manager (${plots.length})` },
            { id: "advisory", label: "Agronomist Advisories" },
            { id: "actions", label: "Quick Farm Actions" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                activeTab === t.id
                  ? "bg-brand-primary text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-200/60"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ===================== OVERVIEW TAB ===================== */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* 6 Core Root-Zone Sensor Telemetry Gauges */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <h3 className="text-sm font-extrabold text-brand-text uppercase tracking-wider">
                    Live Root-Zone Telemetry (Plot A - Cotton BG-II)
                  </h3>
                </div>
                <Badge variant="lime" dot size="sm">
                  MS-PRO-8841-WRD
                </Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <SensorGauge
                  label="Soil Moisture"
                  value={tele.moisturePct}
                  unit="%"
                  min={10}
                  max={80}
                  optimalMin={40}
                  optimalMax={65}
                  colorClass="bg-sky-100 text-sky-700"
                  barColor="bg-sky-500"
                  icon={<Droplets className="w-5 h-5 text-sky-600" />}
                />
                <SensorGauge
                  label="Nitrogen (N)"
                  value={tele.nitrogenPpm}
                  unit="ppm"
                  min={20}
                  max={120}
                  optimalMin={60}
                  optimalMax={90}
                  colorClass="bg-emerald-100 text-emerald-700"
                  barColor="bg-emerald-500"
                  icon={<Sprout className="w-5 h-5 text-emerald-600" />}
                />
                <SensorGauge
                  label="Phosphorus (P)"
                  value={tele.phosphorusPpm}
                  unit="ppm"
                  min={5}
                  max={40}
                  optimalMin={15}
                  optimalMax={28}
                  colorClass="bg-amber-100 text-amber-700"
                  barColor="bg-amber-500"
                  icon={<TrendingUp className="w-5 h-5 text-amber-600" />}
                />
                <SensorGauge
                  label="Potassium (K)"
                  value={tele.potassiumPpm}
                  unit="ppm"
                  min={80}
                  max={350}
                  optimalMin={180}
                  optimalMax={260}
                  colorClass="bg-purple-100 text-purple-700"
                  barColor="bg-purple-500"
                  icon={<Cpu className="w-5 h-5 text-purple-600" />}
                />
                <SensorGauge
                  label="Soil pH Level"
                  value={tele.phLevel}
                  unit="pH"
                  min={4.5}
                  max={9.0}
                  optimalMin={6.2}
                  optimalMax={7.5}
                  colorClass="bg-teal-100 text-teal-700"
                  barColor="bg-teal-500"
                  icon={<FileText className="w-5 h-5 text-teal-600" />}
                />
                <SensorGauge
                  label="Soil Temperature"
                  value={tele.temperatureC}
                  unit="°C"
                  min={15}
                  max={45}
                  optimalMin={22}
                  optimalMax={30}
                  colorClass="bg-orange-100 text-orange-700"
                  barColor="bg-orange-500"
                  icon={<CloudSun className="w-5 h-5 text-orange-600" />}
                />
              </div>
            </div>

            {/* AI Agronomy Recommendations Card */}
            <div className="bg-white rounded-3xl p-6 shadow-card border border-slate-200/80">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-brand-lime" />
                <h3 className="text-base font-bold text-brand-text">
                  AI Agronomy Recommendations (PDKV Model Tuned)
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {recommendations.map((rec) => (
                  <div
                    key={rec.id}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-brand-primary bg-brand-light px-2 py-0.5 rounded">
                          {rec.category}
                        </span>
                        <Badge
                          variant={
                            rec.severity === "urgent"
                              ? "danger"
                              : rec.severity === "optimal"
                              ? "success"
                              : "warning"
                          }
                          size="sm"
                        >
                          {rec.severity}
                        </Badge>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900">{rec.title}</h4>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {rec.description}
                      </p>
                    </div>

                    <Button variant="outline" size="sm" className="mt-4 w-full">
                      {rec.actionLabel}
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Weather bar */}
            <div className="bg-gradient-to-r from-sky-900 to-sky-800 rounded-3xl p-6 text-white shadow-card flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
                  <CloudSun className="w-10 h-10 text-amber-300" />
                </div>
                <div>
                  <p className="text-xs text-sky-200 font-medium">Local Micro-Climate • Wardha / Karanja</p>
                  <h4 className="text-2xl font-black mt-0.5">31°C • Partly Cloudy</h4>
                  <p className="text-xs text-sky-100 mt-1">
                    Humidity: 62% • Wind: 11 km/h NE • Rain probability: 15% (Fair drying conditions)
                  </p>
                </div>
              </div>
              <div className="bg-white/10 px-4 py-3 rounded-2xl backdrop-blur-sm text-xs space-y-1">
                <p className="font-bold text-amber-300">Weather Alert for Spraying:</p>
                <p className="text-stone-200">Wind velocity optimal for foliar & drone spraying until 11:30 AM.</p>
              </div>
            </div>
          </div>
        )}

        {/* ===================== PLOTS TAB ===================== */}
        {activeTab === "plots" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-brand-text">Active Crop Plots</h3>
                <p className="text-xs text-slate-500">
                  Track variety, growth stages, sowing schedules, and plot health scores.
                </p>
              </div>
              <Button size="sm" leftIcon={<PlusCircle className="w-4 h-4" />}>
                Add New Plot
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plots.map((plot) => (
                <div
                  key={plot.id}
                  className="bg-white rounded-3xl p-6 shadow-card border border-slate-200 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant="lime">{plot.areaAcres} Acres</Badge>
                      <Badge variant="success">Health: {plot.healthScore}%</Badge>
                    </div>

                    <h4 className="text-base font-extrabold text-brand-text">{plot.name}</h4>
                    <p className="text-xs font-bold text-slate-600 mt-1">{plot.currentCrop}</p>
                    <p className="text-xs text-slate-500">Variety: {plot.cropVariety}</p>

                    <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                      <div className="flex justify-between">
                        <span>Growth Stage:</span>
                        <strong className="text-slate-900">{plot.growthStage}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Sown On:</span>
                        <strong className="text-slate-900">{plot.sowingDate}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Expected Harvest:</span>
                        <strong className="text-slate-900">{plot.expectedHarvestDate}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2">
                    <Link href="/sensors" className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        View Sensors
                      </Button>
                    </Link>
                    <Link href="/advisory" className="flex-1">
                      <Button variant="primary" size="sm" className="w-full">
                        Diagnose
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================== ADVISORY TAB ===================== */}
        {activeTab === "advisory" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-brand-text">Agronomist Consultation Tickets</h3>
                <p className="text-xs text-slate-500">
                  Direct communication channel with Dr. Anjali Deshmukh and university soil scientists.
                </p>
              </div>
              <Link href="/advisory">
                <Button size="sm" leftIcon={<PlusCircle className="w-4 h-4" />}>
                  New Consultation
                </Button>
              </Link>
            </div>

            <div className="space-y-4">
              {data.consultations.map((c) => (
                <div
                  key={c.id}
                  className="bg-white rounded-3xl p-6 shadow-card border border-slate-200 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="neutral">{c.cropName}</Badge>
                      <h4 className="text-sm font-bold text-slate-900">{c.title}</h4>
                    </div>
                    <Badge variant={c.status === "diagnosed" ? "success" : "warning"}>
                      {c.status === "diagnosed" ? "Diagnosed by Agronomist" : "Under Review"}
                    </Badge>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">{c.description}</p>

                  {c.diagnosis && (
                    <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/80 space-y-2 mt-3">
                      <p className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                        <Stethoscope className="w-4 h-4 text-blue-700" />
                        <span>Agronomist Diagnosis:</span>
                      </p>
                      <p className="text-xs text-blue-950">{c.diagnosis}</p>
                      <div className="pt-2 border-t border-blue-200/60">
                        <p className="text-xs font-bold text-blue-900">Prescribed Treatment:</p>
                        <p className="text-xs text-blue-900 mt-0.5">{c.prescription}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between items-center text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                    <span>Ticket ID: {c.id}</span>
                    <span>Created: {c.createdAt}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================== QUICK ACTIONS TAB ===================== */}
        {activeTab === "actions" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link
              href="/marketplace"
              className="bg-white p-6 rounded-3xl shadow-card border border-slate-200 hover:border-brand-primary transition group flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-900">Sell Crop on Mandi</h4>
                <p className="text-xs text-slate-500 mt-1">
                  List your harvested Bt-Cotton or Soybean directly to verified APMC buyers.
                </p>
              </div>
              <span className="mt-4 text-xs font-bold text-purple-700 flex items-center gap-1">
                <span>Create Produce Lot</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>

            <Link
              href="/rentals"
              className="bg-white p-6 rounded-3xl shadow-card border border-slate-200 hover:border-brand-primary transition group flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <Wrench className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-900">Book Drone Spraying</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Hire DJI Agras T40 RTK drone sprayer for fast foliar fertilizer & pest protection.
                </p>
              </div>
              <span className="mt-4 text-xs font-bold text-amber-700 flex items-center gap-1">
                <span>View Machinery Fleet</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>

            <Link
              href="/finance"
              className="bg-white p-6 rounded-3xl shadow-card border border-slate-200 hover:border-brand-primary transition group flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <Landmark className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-900">Agri Credit & PMFBY</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Check KCC 4% loan status, PM-KUSUM 90% solar pump subsidy, and crop insurance.
                </p>
              </div>
              <span className="mt-4 text-xs font-bold text-teal-700 flex items-center gap-1">
                <span>Check Eligibility</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>

            <Link
              href="/sensors"
              className="bg-white p-6 rounded-3xl shadow-card border border-slate-200 hover:border-brand-primary transition group flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <Droplets className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-900">Soil Diagnostic Report</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Download certified PDF soil report card with root-zone EC, NPK, and pH analysis.
                </p>
              </div>
              <span className="mt-4 text-xs font-bold text-emerald-700 flex items-center gap-1">
                <span>Generate Report</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
