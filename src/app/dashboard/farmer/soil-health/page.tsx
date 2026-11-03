"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAppState } from "@/lib/store";
import { DashboardShell, NavItem } from "@/components/layout/DashboardShell";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, StatCard } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import {
  LayoutDashboard,
  Trees,
  Activity,
  ShoppingBag,
  Wrench,
  Stethoscope,
  Landmark,
  FlaskConical,
  Cpu,
  Leaf,
  FileText,
  PlusCircle,
  Download,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Sparkles,
  Info,
  Calendar,
  Layers,
  Search,
  ExternalLink,
} from "lucide-react";

export default function SoilHealthPage() {
  const { data, addSoilTest } = useAppState();

  const farmer = data.users.find((u) => u.role === "farmer") || data.users[0];
  const soilTests = data.soilTests || [];
  const soilMeasurements = data.soilMeasurements || [];
  const fields = data.fields || [];

  const [selectedFieldId, setSelectedFieldId] = useState<string>("all");
  const [methodFilter, setMethodFilter] = useState<"all" | "laboratory" | "sensor" | "estimated">("all");
  const [showAddReportModal, setShowAddReportModal] = useState(false);

  // Form state for adding soil test report
  const [repFieldId, setRepFieldId] = useState(fields[0]?.id || "field_01");
  const [repLabName, setRepLabName] = useState("Dr. PDKV Regional Soil Testing Lab, Akola");
  const [repSampleCode, setRepSampleCode] = useState(`STL-2026-WRD-${Math.floor(100 + Math.random() * 900)}`);
  const [repDate, setRepDate] = useState(new Date().toISOString().split("T")[0]);
  const [repTexture, setRepTexture] = useState("Deep Black Clay Loam (Vertisol)");
  const [repPh, setRepPh] = useState(7.6);
  const [repEc, setRepEc] = useState(0.40);
  const [repOc, setRepOc] = useState(0.70);
  const [repN, setRepN] = useState(305);
  const [repP, setRepP] = useState(21.0);
  const [repK, setRepK] = useState(275);
  const [repZn, setRepZn] = useState(1.2);
  const [repFe, setRepFe] = useState(4.6);
  const [repS, setRepS] = useState(17.5);
  const [repDocName, setRepDocName] = useState("Soil_Report_PDKV_Certified.pdf");
  const [repNotes, setRepNotes] = useState("Balanced fertility profile. Recommended incorporation of 2 tonnes/acre vermicompost.");

  const handleSaveReport = (e: React.FormEvent) => {
    e.preventDefault();
    const targetField = fields.find((f) => f.id === repFieldId);

    // Calculate score
    let score = 75;
    if (repPh >= 6.5 && repPh <= 7.8) score += 10;
    if (repOc >= 0.75) score += 10;
    if (repN >= 280) score += 5;

    addSoilTest({
      farmerId: "usr_farmer_01",
      farmId: targetField?.farmId || "farm_01",
      fieldId: repFieldId,
      fieldName: targetField?.name || "North Acre Parcel",
      testDate: repDate,
      laboratoryName: repLabName,
      sampleCode: repSampleCode,
      documentName: repDocName,
      reportDocumentUrl: `/docs/${repDocName}`,
      soilTexture: repTexture,
      overallHealthScore: Math.min(100, score),
      phLevel: repPh,
      electricalConductivity: repEc,
      organicCarbonPct: repOc,
      nitrogenKgHa: repN,
      phosphorusKgHa: repP,
      potassiumKgHa: repK,
      sulfurPpm: repS,
      zincPpm: repZn,
      ironPpm: repFe,
      recommendations: repNotes,
      status: "verified",
      testedByTechnician: "Soil Testing Technician",
    });

    setShowAddReportModal(false);
  };

  // Filter measurements
  const filteredMeasurements = soilMeasurements.filter((m) => {
    const matchesField = selectedFieldId === "all" || m.fieldId === selectedFieldId;
    const matchesMethod = methodFilter === "all" || m.measurementMethod === methodFilter;
    return matchesField && matchesMethod;
  });

  const latestTest = soilTests[0];

  const navItems: NavItem[] = [
    { label: "Dashboard Overview", href: "/dashboard/farmer", icon: LayoutDashboard },
    { label: "My Farm & Fields", href: "/dashboard/farmer/my-farm", icon: Trees, badge: `${data.farms.length}` },
    { label: "Soil Health & Lab", href: "/dashboard/farmer/soil-health", icon: FlaskConical },
    { label: "Smart Devices & Valves", href: "/dashboard/farmer/devices", icon: Cpu, badge: `${data.devices?.length || 5}` },
    { label: "Sustainable & Organic", href: "/dashboard/farmer/organic", icon: Leaf, badge: "Phase 5" },
    { label: "Deep Root Telemetry", href: "/sensors", icon: Activity, badge: "Live" },
    { label: "Produce Mandi", href: "/marketplace", icon: ShoppingBag },
    { label: "Machinery Fleet", href: "/rentals", icon: Wrench },
    { label: "Agronomist Clinic", href: "/advisory", icon: Stethoscope },
    { label: "Agri-Credit & PMFBY", href: "/finance", icon: Landmark },
  ];

  return (
    <DashboardShell
      navItems={navItems}
      roleTitle="Farmer Command Center"
      roleSubtitle={`${farmer.fullName} • Wardha`}
      roleIcon={FlaskConical}
    >
      <div className="space-y-8">
        {/* ===================== BANNER & ACTION HEADER ===================== */}
        <div className="bg-gradient-to-r from-emerald-950 via-brand-dark to-brand-primary rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-brand-lime/10 blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-brand-lime text-xs font-bold">
                <FlaskConical className="w-3.5 h-3.5" />
                <span>Agricultural Soil Intelligence & Lab Benchmarks</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                Soil Health Center • मृदा आरोग्य केंद्र
              </h1>
              <p className="text-xs text-stone-300 max-w-2xl leading-relaxed">
                Directly connects certified agricultural laboratory analyses with in-situ capacitive sensor probes.
                Track soil macro & micro-nutrients, electrical conductivity, and organic carbon with verified ranges.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/dashboard/farmer/devices">
                <Button
                  variant="outline"
                  size="md"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  leftIcon={<Cpu className="w-4 h-4 text-brand-lime" />}
                >
                  Manage IoT Devices
                </Button>
              </Link>
              <Button
                variant="accent"
                size="md"
                onClick={() => setShowAddReportModal(true)}
                leftIcon={<PlusCircle className="w-4 h-4" />}
              >
                Log Soil Test Report
              </Button>
            </div>
          </div>
        </div>

        {/* ===================== SOIL METRICS TELEMETRY ===================== */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Overall Soil Health Score"
            value={latestTest ? `${latestTest.overallHealthScore}` : "88"}
            unit="/ 100"
            change="PDKV Certified Optimal"
            trend="up"
            icon={<FlaskConical className="w-5 h-5 text-emerald-700" />}
            iconBg="bg-emerald-100"
          />
          <StatCard
            label="Soil Reaction (pH)"
            value={latestTest ? `${latestTest.phLevel}` : "7.7"}
            unit="pH"
            change="Ideal (6.5 - 7.8 range)"
            trend="up"
            icon={<Activity className="w-5 h-5 text-blue-700" />}
            iconBg="bg-blue-100"
          />
          <StatCard
            label="Organic Carbon (OC)"
            value={latestTest ? `${latestTest.organicCarbonPct}` : "0.68"}
            unit="%"
            change="Target > 0.75% (Conditioning)"
            trend="neutral"
            icon={<Sparkles className="w-5 h-5 text-amber-700" />}
            iconBg="bg-amber-100"
          />
          <StatCard
            label="Root Moisture Probe"
            value="38.4"
            unit="%"
            change="Live IoT Sensor at 25cm"
            trend="up"
            icon={<TrendingUp className="w-5 h-5 text-sky-700" />}
            iconBg="bg-sky-100"
          />
        </div>

        {/* ===================== CERTIFICATION & LAB TEST CARDS ===================== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Lab Health Certificate Card */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-extrabold text-brand-text">
                    Active Soil Health Card • मृदा आरोग्य पत्रिका
                  </h2>
                  <Badge variant="lime" dot size="sm">
                    Verified
                  </Badge>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {latestTest?.laboratoryName || "Regional Soil Testing Laboratory"} • Code:{" "}
                  <strong className="font-mono text-slate-800">{latestTest?.sampleCode || "STL-2026-WRD-092"}</strong>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-400">Tested on {latestTest?.testDate}</span>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    alert(`Downloading certified PDF: ${latestTest?.documentName || "Soil_Health_Card.pdf"}`);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition"
                >
                  <Download className="w-3.5 h-3.5 text-slate-500" />
                  PDF Report
                </a>
              </div>
            </div>

            {/* Nutrients Breakdown Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/60">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Available Nitrogen (N)
                </span>
                <p className="text-xl font-black text-brand-dark">
                  {latestTest?.nitrogenKgHa || 312}{" "}
                  <span className="text-xs font-medium text-slate-500">kg/ha</span>
                </p>
                <div className="mt-2 flex items-center justify-between text-[11px]">
                  <span className="text-emerald-700 font-bold">Optimal</span>
                  <span className="text-slate-400 text-[10px]">280 - 560 range</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/60">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Phosphorus (P₂O₅)
                </span>
                <p className="text-xl font-black text-brand-dark">
                  {latestTest?.phosphorusKgHa || 22.4}{" "}
                  <span className="text-xs font-medium text-slate-500">kg/ha</span>
                </p>
                <div className="mt-2 flex items-center justify-between text-[11px]">
                  <span className="text-emerald-700 font-bold">Optimal</span>
                  <span className="text-slate-400 text-[10px]">15 - 25 range</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/60">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Potassium (K₂O)
                </span>
                <p className="text-xl font-black text-brand-dark">
                  {latestTest?.potassiumKgHa || 285}{" "}
                  <span className="text-xs font-medium text-slate-500">kg/ha</span>
                </p>
                <div className="mt-2 flex items-center justify-between text-[11px]">
                  <span className="text-emerald-700 font-bold">Optimal</span>
                  <span className="text-slate-400 text-[10px]">150 - 300 range</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/60">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Electrical Cond. (EC)
                </span>
                <p className="text-xl font-black text-brand-dark">
                  {latestTest?.electricalConductivity || 0.42}{" "}
                  <span className="text-xs font-medium text-slate-500">dS/m</span>
                </p>
                <div className="mt-2 flex items-center justify-between text-[11px]">
                  <span className="text-emerald-700 font-bold">Safe (&lt;1.0)</span>
                  <span className="text-slate-400 text-[10px]">Non-saline</span>
                </div>
              </div>
            </div>

            {/* Micro-Nutrient Status */}
            <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/70">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-amber-700" />
                <h4 className="text-xs font-bold text-amber-950 uppercase tracking-wider">
                  Micro-Nutrient Scan (DTPA Extractable)
                </h4>
              </div>
              <div className="grid grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-slate-500">Zinc (Zn): </span>
                  <strong className="text-brand-dark font-mono">{latestTest?.zincPpm || 1.15} ppm</strong>
                  <span className="text-[10px] text-amber-700 ml-1 font-semibold">(Marginal)</span>
                </div>
                <div>
                  <span className="text-slate-500">Iron (Fe): </span>
                  <strong className="text-brand-dark font-mono">{latestTest?.ironPpm || 4.8} ppm</strong>
                  <span className="text-[10px] text-emerald-700 ml-1 font-semibold">(Sufficient)</span>
                </div>
                <div>
                  <span className="text-slate-500">Sulfur (S): </span>
                  <strong className="text-brand-dark font-mono">{latestTest?.sulfurPpm || 18.5} ppm</strong>
                  <span className="text-[10px] text-emerald-700 ml-1 font-semibold">(Adequate)</span>
                </div>
              </div>
            </div>

            {/* Official Lab Recommendation */}
            <div className="p-4 rounded-2xl bg-brand-light/40 border border-brand-light">
              <p className="text-xs font-extrabold text-brand-dark mb-1 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-brand-primary" />
                Prescribed Agronomic Action Plan
              </p>
              <p className="text-xs text-slate-700 leading-relaxed">
                {latestTest?.recommendations ||
                  "Soil structure and nutrient buffering are healthy. Apply 2 tonnes well-decomposed Farmyard Manure (FYM) or Vermicompost before next irrigation to boost organic carbon beyond 0.75%. Top-dress with 25 kg Zinc Sulfate per acre to correct marginal zinc deficiency."}
              </p>
            </div>
          </div>

          {/* Historical Trends & Comparison */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-6">
            <div>
              <h2 className="text-base font-extrabold text-brand-text">
                Historical Progression
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Comparing Kharif 2026 vs Pre-Monsoon 2025 Baseline
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/70 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700">Soil Reaction (pH)</span>
                  <Badge variant="lime" size="sm">Improved -0.5</Badge>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>May 2025: <strong className="text-slate-700">8.2</strong> (Alkaline)</span>
                  <span>→</span>
                  <span>Now: <strong className="text-emerald-700 font-bold">7.7</strong> (Ideal)</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/70 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700">Organic Carbon (OC)</span>
                  <Badge variant="lime" size="sm">+0.16% Increase</Badge>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>May 2025: <strong className="text-slate-700">0.52%</strong> (Low)</span>
                  <span>→</span>
                  <span>Now: <strong className="text-emerald-700 font-bold">0.68%</strong> (Medium)</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/70 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700">Available Nitrogen</span>
                  <Badge variant="lime" size="sm">+70 kg/ha</Badge>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>May 2025: <strong className="text-slate-700">242 kg/ha</strong></span>
                  <span>→</span>
                  <span>Now: <strong className="text-emerald-700 font-bold">312 kg/ha</strong></span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/70 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700">Electrical Conductivity</span>
                  <Badge variant="neutral" size="sm">Stable</Badge>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>May 2025: <strong className="text-slate-700">0.52 dS/m</strong></span>
                  <span>→</span>
                  <span>Now: <strong className="text-emerald-700 font-bold">0.42 dS/m</strong></span>
                </div>
              </div>
            </div>

            <div className="text-[11px] text-slate-400 text-center">
              Verified by District Agriculture Soil Testing Wing
            </div>
          </div>
        </div>

        {/* ===================== GRANULAR SOIL MEASUREMENTS TABLE ===================== */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-extrabold text-brand-text">
                Granular Soil Parameter Ledger
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Clearly distinguishes between Certified Lab Reports, Real IoT Probes, and Bio-Agronomic Estimates.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Field Filter */}
              <select
                value={selectedFieldId}
                onChange={(e) => setSelectedFieldId(e.target.value)}
                className="text-xs font-bold px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-primary"
              >
                <option value="all">All Fields</option>
                {fields.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>

              {/* Methodology Filter */}
              <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold">
                {(["all", "laboratory", "sensor", "estimated"] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setMethodFilter(m)}
                    className={`px-3 py-1.5 rounded-lg capitalize transition ${
                      methodFilter === m
                        ? "bg-white text-brand-dark shadow-sm"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    {m === "all" ? "All Methods" : m}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-400 font-extrabold uppercase tracking-wider text-[10px] border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4">Parameter Name</th>
                  <th className="py-3 px-4">Field / Parcel</th>
                  <th className="py-3 px-4">Methodology</th>
                  <th className="py-3 px-4">Value</th>
                  <th className="py-3 px-4">Optimal Range</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Actionable Recommendation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredMeasurements.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3.5 px-4 font-bold text-brand-text">
                      {m.parameterName}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {m.fieldName}
                    </td>
                    <td className="py-3.5 px-4">
                      {m.measurementMethod === "laboratory" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 text-[10px] font-extrabold border border-purple-200/60">
                          <FlaskConical className="w-3 h-3" />
                          Lab Certified
                        </span>
                      )}
                      {m.measurementMethod === "sensor" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sky-50 text-sky-700 text-[10px] font-extrabold border border-sky-200/60">
                          <Cpu className="w-3 h-3" />
                          Live IoT Sensor
                        </span>
                      )}
                      {m.measurementMethod === "estimated" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 text-[10px] font-extrabold border border-amber-200/60">
                          <Sparkles className="w-3 h-3" />
                          Model Estimate
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-black font-mono text-brand-dark">
                      {m.measuredValue} {m.unit}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                      {m.optimalMin} - {m.optimalMax} {m.unit}
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge
                        variant={
                          m.rating === "optimal"
                            ? "lime"
                            : m.rating === "deficient"
                            ? "warning"
                            : "danger"
                        }
                        size="sm"
                      >
                        {m.rating}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 max-w-xs truncate" title={m.correctiveAction}>
                      {m.correctiveAction}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ===================== HISTORICAL LAB TEST REPORTS REPOSITORY ===================== */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-extrabold text-brand-text">
                Historical Soil Test Documents Archive ({soilTests.length})
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Official documents, accredited lab test reports, and seasonal baseline records.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAddReportModal(true)}
              leftIcon={<PlusCircle className="w-4 h-4" />}
            >
              Add New Report
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {soilTests.map((test) => (
              <div
                key={test.id}
                className="p-5 rounded-2xl bg-stone-50 border border-stone-200/80 flex flex-col justify-between space-y-4 hover:border-brand-primary/40 transition"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
                      <FileText className="w-5 h-5" />
                    </span>
                    <Badge variant="lime" size="sm">
                      {test.status}
                    </Badge>
                  </div>
                  <h3 className="text-sm font-bold text-brand-dark line-clamp-1">
                    {test.fieldName}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {test.laboratoryName}
                  </p>
                  <p className="text-[10px] text-slate-400 font-mono">
                    Sample Code: {test.sampleCode} • {test.testDate}
                  </p>
                </div>

                <div className="border-t border-stone-200/60 pt-3 flex items-center justify-between">
                  <div className="text-xs">
                    <span className="text-slate-400 text-[10px] block">Health Score</span>
                    <strong className="text-brand-primary font-black text-sm">
                      {test.overallHealthScore}/100
                    </strong>
                  </div>
                  <button
                    onClick={() => alert(`Downloading lab report: ${test.documentName || "Soil_Report.pdf"}`)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold transition shadow-2xs"
                  >
                    <Download className="w-3.5 h-3.5 text-slate-500" />
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ===================== LOG SOIL TEST REPORT MODAL ===================== */}
        <Modal
          isOpen={showAddReportModal}
          onClose={() => setShowAddReportModal(false)}
          title="Log Certified Soil Testing Report"
          maxWidth="lg"
        >
          <form onSubmit={handleSaveReport} className="space-y-5 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Target Field / Parcel *
                </label>
                <select
                  value={repFieldId}
                  onChange={(e) => setRepFieldId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white font-medium focus:ring-2 focus:ring-brand-primary"
                  required
                >
                  {fields.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name} ({f.areaAcres} Acres)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Testing Date *
                </label>
                <input
                  type="date"
                  value={repDate}
                  onChange={(e) => setRepDate(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white font-medium focus:ring-2 focus:ring-brand-primary"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Soil Testing Laboratory Name *
                </label>
                <input
                  type="text"
                  value={repLabName}
                  onChange={(e) => setRepLabName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white font-medium focus:ring-2 focus:ring-brand-primary"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Sample Code / Certificate ID *
                </label>
                <input
                  type="text"
                  value={repSampleCode}
                  onChange={(e) => setRepSampleCode(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white font-mono font-medium focus:ring-2 focus:ring-brand-primary"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Soil Texture Classification
                </label>
                <input
                  type="text"
                  value={repTexture}
                  onChange={(e) => setRepTexture(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white font-medium focus:ring-2 focus:ring-brand-primary"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Soil Testing PDF Document Name
                </label>
                <input
                  type="text"
                  value={repDocName}
                  onChange={(e) => setRepDocName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white font-medium focus:ring-2 focus:ring-brand-primary"
                />
              </div>
            </div>

            {/* Parameter Numerical Inputs */}
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-3">
              <h4 className="text-xs font-bold text-brand-dark uppercase tracking-wider">
                Laboratory Measured Values
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">pH Level</label>
                  <input
                    type="number"
                    step="0.1"
                    value={repPh}
                    onChange={(e) => setRepPh(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">EC (dS/m)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={repEc}
                    onChange={(e) => setRepEc(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Organic Carbon (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={repOc}
                    onChange={(e) => setRepOc(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Nitrogen (kg/ha)</label>
                  <input
                    type="number"
                    value={repN}
                    onChange={(e) => setRepN(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Phosphorus (kg/ha)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={repP}
                    onChange={(e) => setRepP(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Potassium (kg/ha)</label>
                  <input
                    type="number"
                    value={repK}
                    onChange={(e) => setRepK(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Zinc (ppm)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={repZn}
                    onChange={(e) => setRepZn(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Iron (ppm)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={repFe}
                    onChange={(e) => setRepFe(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white font-bold"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Agronomic Recommendations & Corrective Actions
              </label>
              <textarea
                rows={3}
                value={repNotes}
                onChange={(e) => setRepNotes(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white font-medium focus:ring-2 focus:ring-brand-primary"
                placeholder="e.g. Apply 2 tonnes vermicompost, foliar spray of zinc sulfate..."
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={() => setShowAddReportModal(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="md">
                Save Soil Test Report
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </DashboardShell>
  );
}
