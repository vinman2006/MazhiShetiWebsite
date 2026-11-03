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
  Sprout,
  ShieldCheck,
  Award,
  Layers,
  BookOpen,
  Calendar,
  Clock,
  PlusCircle,
  CheckCircle2,
  AlertCircle,
  FileText,
  Download,
  Sparkles,
  TrendingUp,
  Wheat,
  RotateCcw,
  Info,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

const TRANSITION_STAGES = [
  { id: "initial_assessment", label: "1. Farm Assessment", desc: "Baseline boundary & chemical audit" },
  { id: "soil_assessment", label: "2. Soil Assessment", desc: "Heavy metals & pesticide residue test" },
  { id: "transition_planning", label: "3. Transition Plan", desc: "Multi-year buffer & crop rotation plan" },
  { id: "input_adoption", label: "4. Input Adoption", desc: "100% bio-inputs & botanical concoctions" },
  { id: "soil_improvement", label: "5. Soil Biome Boost", desc: "Green manuring & organic carbon > 0.75%" },
  { id: "crop_monitoring", label: "6. Crop Monitoring", desc: "Natural predator balance & IPM logs" },
  { id: "documentation", label: "7. Audit Recordbook", desc: "NPOP/PGS input logbook & receipts" },
  { id: "certification_prep", label: "8. Certification Prep", desc: "Third-party audit & lab residue clearance" },
];

export default function OrganicAndSustainableAgriPage() {
  const {
    data,
    registerOrganicTransition,
    updateTransitionStage,
    logFarmingPractice,
    addOrganicInput,
    recordInputApplication,
    recordNoTillActivity,
  } = useAppState();

  const farmer = data.users.find((u) => u.role === "farmer") || data.users[0];
  const fields = data.fields || [];
  const programs = data.organicPrograms || [];
  const transitions = data.organicTransitions || [];
  const practices = data.farmingPractices || [];
  const organicInputs = data.organicInputs || [];
  const applications = data.inputApplications || [];
  const noTillRecords = data.noTillRecords || [];
  const resources = data.agriculturalResources || [];

  const [activeTab, setActiveTab] = useState<"transition" | "inputs" | "notill" | "knowledge">("transition");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Modals
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [showApplyInputModal, setShowApplyInputModal] = useState(false);
  const [showNoTillModal, setShowNoTillModal] = useState(false);
  const [showRecipeModal, setShowRecipeModal] = useState<any>(null);

  // Enroll Form State
  const [enrFieldId, setEnrFieldId] = useState(fields[0]?.id || "field_01");
  const [enrProgId, setEnrProgId] = useState(programs[0]?.id || "org_prog_01");
  const [enrBaselineNpk, setEnrBaselineNpk] = useState(160);
  const [enrBaselinePest, setEnrBaselinePest] = useState(3.0);
  const [enrGoals, setEnrGoals] = useState("100% synthetic elimination and NPOP export compliance");
  const [enrAgency, setEnrAgency] = useState("Aditi Organic Certifications Pvt. Ltd.");

  // Input Application Form State
  const [appFieldId, setAppFieldId] = useState(fields[0]?.id || "field_01");
  const [appInputId, setAppInputId] = useState(organicInputs[0]?.id || "inp_jeev_01");
  const [appQty, setAppQty] = useState(200);
  const [appUnit, setAppUnit] = useState<"kg" | "liters" | "tonnes" | "bags">("liters");
  const [appMethod, setAppMethod] = useState<
    "broadcasting" | "drip_fertigation" | "foliar_spray" | "soil_drenching" | "seed_treatment"
  >("drip_fertigation");
  const [appCost, setAppCost] = useState(180);
  const [appBatch, setAppBatch] = useState("JA-2026-NOV-B1");
  const [appNotes, setAppNotes] = useState("Venturi drip injection during morning cycle");

  // No-Till Form State
  const [ntFieldId, setNtFieldId] = useState(fields[0]?.id || "field_01");
  const [ntResidue, setNtResidue] = useState("cotton_stalk_mulch");
  const [ntCoverage, setNtCoverage] = useState(85);
  const [ntCoverCrop, setNtCoverCrop] = useState("Sunn hemp (ताग)");
  const [ntDepth, setNtDepth] = useState(0); // 0 cm = Zero Till
  const [ntMethod, setNtMethod] = useState("dense_mulch_roller");
  const [ntNotes, setNtNotes] = useState("Chevron roller-crimper crimped Sunn hemp mulch flat; Happy Seeder planted directly.");

  const handleEnrollSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetField = fields.find((f) => f.id === enrFieldId);
    const targetProg = programs.find((p) => p.id === enrProgId);

    const now = new Date();
    const regDate = now.toISOString().split("T")[0];
    const targetDate = new Date(now.setMonth(now.getMonth() + 36))
      .toISOString()
      .split("T")[0];

    registerOrganicTransition({
      farmerId: "usr_farmer_01",
      farmId: targetField?.farmId || "farm_01",
      fieldId: enrFieldId,
      fieldName: targetField?.name || "Target Parcel",
      programId: enrProgId,
      programName: targetProg?.name || "NPOP National Organic Program",
      registrationDate: regDate,
      targetCertificationDate: targetDate,
      currentStage: "initial_assessment",
      conversionStatus: "in_conversion_c1",
      progressPct: 15,
      inspectorAgency: enrAgency,
      auditNotes: "Initial farm baseline assessment registered. Commenced conversion Year 1.",
      baselineChemicalNpkKg: enrBaselineNpk,
      currentChemicalNpkKg: 0,
      isCertified: false, // Strict: requires 36 months audit
      nextAuditDate: "2027-02-15",
    });

    setShowEnrollModal(false);
  };

  const handleApplyInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetField = fields.find((f) => f.id === appFieldId);
    const targetInput = organicInputs.find((i) => i.id === appInputId);

    recordInputApplication({
      fieldId: appFieldId,
      fieldName: targetField?.name || "Target Parcel",
      organicInputId: appInputId,
      inputName: targetInput?.name || "Organic Formulation",
      category: targetInput?.category || "biofertilizer",
      quantity: appQty,
      unit: appUnit,
      applicationMethod: appMethod,
      appliedDate: new Date().toISOString().split("T")[0],
      costIncurred: appCost,
      batchLotNumber: appBatch,
      notes: appNotes,
    });

    setShowApplyInputModal(false);
  };

  const handleNoTillSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetField = fields.find((f) => f.id === ntFieldId);

    recordNoTillActivity({
      fieldId: ntFieldId,
      fieldName: targetField?.name || "Target Parcel",
      seasonYear: "Kharif 2026",
      suitabilityScore: 92,
      residueType: ntResidue,
      residueCoveragePct: ntCoverage,
      coverCropPlanted: ntCoverCrop,
      soilDisturbanceDepthCm: ntDepth,
      moistureRetentionScore: 94,
      weedSuppressionMethod: ntMethod,
      notes: ntNotes,
      recordedDate: new Date().toISOString().split("T")[0],
    });

    setShowNoTillModal(false);
  };

  const filteredResources = resources.filter((res) => {
    if (selectedCategory === "all") return true;
    return res.category === selectedCategory;
  });

  const navItems: NavItem[] = [
    { label: "Dashboard Overview", href: "/dashboard/farmer", icon: LayoutDashboard },
    { label: "My Farm & Fields", href: "/dashboard/farmer/my-farm", icon: Trees, badge: `${data.farms.length}` },
    { label: "Soil Health & Lab", href: "/dashboard/farmer/soil-health", icon: FlaskConical },
    { label: "Smart Devices & Valves", href: "/dashboard/farmer/devices", icon: Cpu },
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
      roleIcon={Leaf}
    >
      <div className="space-y-8">
        {/* ===================== BANNER & ACTION HEADER ===================== */}
        <div className="bg-gradient-to-r from-emerald-950 via-brand-dark to-teal-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-brand-lime/15 blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-brand-lime text-xs font-bold">
                <Leaf className="w-3.5 h-3.5" />
                <span>NPOP & PGS-India Sustainable Agriculture Architecture</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                Sustainable Agriculture & Organic Transition
              </h1>
              <p className="text-xs text-stone-300 max-w-2xl leading-relaxed">
                Step-by-step conversion roadmap from synthetic agrochemicals to certified organic and conservation no-till farming.
                Maintain auditable field input ledgers and biological formulations.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="outline"
                size="md"
                onClick={() => setShowApplyInputModal(true)}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                leftIcon={<Sprout className="w-4 h-4 text-brand-lime" />}
              >
                Log Organic Input
              </Button>
              <Button
                variant="accent"
                size="md"
                onClick={() => setShowEnrollModal(true)}
                leftIcon={<PlusCircle className="w-4 h-4" />}
              >
                Register Transition Plan
              </Button>
            </div>
          </div>
        </div>

        {/* ===================== METRICS STRIP ===================== */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="In-Conversion Land"
            value="8.5"
            unit="Acres"
            change="2 Parcels Enrolled"
            trend="up"
            icon={<Leaf className="w-5 h-5 text-emerald-700" />}
            iconBg="bg-emerald-100"
          />
          <StatCard
            label="Chemical Reduction"
            value="100%"
            unit="Zero Synthetic"
            change="Zero chemical spray in 24 mo"
            trend="up"
            icon={<ShieldCheck className="w-5 h-5 text-sky-700" />}
            iconBg="bg-sky-100"
          />
          <StatCard
            label="No-Till Soil Mulch"
            value="85%"
            unit="Coverage"
            change="0 cm mechanical disturbance"
            trend="up"
            icon={<Wheat className="w-5 h-5 text-amber-700" />}
            iconBg="bg-amber-100"
          />
          <StatCard
            label="Bio-Input Applications"
            value={`${applications.length}`}
            unit="Logged"
            change="Traceable input audit trail"
            trend="neutral"
            icon={<CheckCircle2 className="w-5 h-5 text-blue-700" />}
            iconBg="bg-blue-100"
          />
        </div>

        {/* ===================== TAB NAVIGATION ===================== */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto">
          {[
            { id: "transition", label: `Organic Transition Roadmap (${transitions.length} Parcels)` },
            { id: "inputs", label: `Biological Inputs & Concoctions (${organicInputs.length} Formulations)` },
            { id: "notill", label: `No-Till & Conservation Agriculture (${noTillRecords.length} Fields)` },
            { id: "knowledge", label: `Agricultural Knowledge Center (${resources.length} Guides)` },
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

        {/* ===================== TAB 1: ORGANIC TRANSITION ROADMAP ===================== */}
        {activeTab === "transition" && (
          <div className="space-y-8">
            {/* Regulatory Notice Banner */}
            <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 flex items-start gap-3 text-xs text-amber-950">
              <AlertCircle className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold">Standard Certification Disclaimer (NPOP / APEDA Rule)</strong>
                <span>
                  Mazhi Sheti adheres to statutory standards: land in conversion is designated as{" "}
                  <strong>In-Conversion (C1, C2, or C3)</strong>. Certified Organic status is never automatically claimed and
                  requires official accreditation audits and laboratory residue clearance after the mandatory 36-month transition period.
                </span>
              </div>
            </div>

            {/* Transition Parcels */}
            <div className="space-y-6">
              {transitions.map((tr) => (
                <div
                  key={tr.id}
                  className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-6"
                >
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-lg font-extrabold text-brand-text">{tr.fieldName}</h2>
                        <Badge
                          variant={
                            tr.conversionStatus === "certified_verified"
                              ? "success"
                              : tr.conversionStatus === "under_audit"
                              ? "info"
                              : "warning"
                          }
                          size="sm"
                        >
                          {tr.conversionStatus === "in_conversion_c2"
                            ? "In-Conversion Year 2 (C2)"
                            : tr.conversionStatus === "under_audit"
                            ? "Under Final Audit"
                            : "In-Conversion Year 1 (C1)"}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Program: <strong className="text-brand-dark">{tr.programName}</strong> • Inspector:{" "}
                        <strong className="text-slate-700">{tr.inspectorAgency}</strong>
                      </p>
                    </div>

                    <div className="flex items-center gap-4 text-xs">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Enrolled</span>
                        <strong className="text-slate-700">{tr.registrationDate}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Target Full Certification</span>
                        <strong className="text-brand-primary">{tr.targetCertificationDate}</strong>
                      </div>
                    </div>
                  </div>

                  {/* 8-Stage Visual Timeline Progression */}
                  <div>
                    <div className="flex items-center justify-between mb-3 text-xs">
                      <span className="font-extrabold text-slate-700 uppercase tracking-wider text-[11px]">
                        8-Stage Statutory Transition Progress
                      </span>
                      <span className="font-black text-brand-primary font-mono">{tr.progressPct}% Completed</span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden mb-6">
                      <div
                        className="h-full bg-gradient-to-r from-brand-primary to-brand-lime transition-all duration-500"
                        style={{ width: `${tr.progressPct}%` }}
                      />
                    </div>

                    {/* Stage Steps Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
                      {TRANSITION_STAGES.map((stg, idx) => {
                        const currentStageIdx = TRANSITION_STAGES.findIndex((s) => s.id === tr.currentStage);
                        const isDone = idx <= currentStageIdx;
                        const isCurrent = idx === currentStageIdx;

                        return (
                          <div
                            key={stg.id}
                            className={`p-2.5 rounded-xl border text-center transition ${
                              isCurrent
                                ? "bg-brand-light/70 border-brand-primary shadow-xs"
                                : isDone
                                ? "bg-emerald-50/50 border-emerald-200 text-emerald-900"
                                : "bg-stone-50 border-stone-200/60 opacity-60"
                            }`}
                          >
                            <span
                              className={`w-5 h-5 mx-auto rounded-full flex items-center justify-center text-[10px] font-bold mb-1.5 ${
                                isDone ? "bg-brand-primary text-white" : "bg-slate-200 text-slate-600"
                              }`}
                            >
                              {idx + 1}
                            </span>
                            <p className="text-[10px] font-bold text-slate-800 line-clamp-1">{stg.label}</p>
                            <p className="text-[9px] text-slate-400 line-clamp-2 mt-0.5">{stg.desc}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Chemical Step-Down Comparison & Audit Log */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/70 space-y-2 text-xs">
                      <span className="font-bold text-slate-700 block">Chemical Agrochemical Phased Elimination</span>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Baseline Conventional NPK:</span>
                        <strong className="text-rose-700 line-through font-mono">
                          {tr.baselineChemicalNpkKg} kg/acre
                        </strong>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Current Chemical Application:</span>
                        <strong className="text-emerald-700 font-bold font-mono">
                          0 kg (100% Phased Out)
                        </strong>
                      </div>
                      <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 text-[11px] text-slate-500">
                        <span>Pesticide Residue Free:</span>
                        <span className="text-emerald-700 font-bold">100% Organophosphate Free</span>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/70 space-y-2 text-xs">
                      <span className="font-bold text-slate-700 block">Latest Accredited Audit Report</span>
                      <p className="text-slate-600 leading-relaxed line-clamp-2">{tr.auditNotes}</p>
                      <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 text-[11px] text-slate-400">
                        <span>Last Audit: {tr.lastAuditDate}</span>
                        <span>Next Surveillance: {tr.nextAuditDate}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================== TAB 2: ORGANIC INPUTS & RECIPES ===================== */}
        {activeTab === "inputs" && (
          <div className="space-y-8">
            {/* Input Action Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
              <div>
                <h2 className="text-base font-extrabold text-brand-text">
                  Biological & On-Farm Formulations Catalog ({organicInputs.length})
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Scientifically validated preparation protocols for micro-organism inoculants, botanical repellents, and composts.
                </p>
              </div>

              <Button
                variant="accent"
                size="sm"
                onClick={() => setShowApplyInputModal(true)}
                leftIcon={<PlusCircle className="w-4 h-4" />}
              >
                Log Input Application
              </Button>
            </div>

            {/* Inputs Catalog Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {organicInputs.map((inp) => (
                <div
                  key={inp.id}
                  className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-4 hover:border-brand-primary/50 transition"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-sm font-extrabold text-brand-text">{inp.name}</h3>
                        <span className="text-xs text-brand-primary font-bold">{inp.marathiName}</span>
                      </div>
                      <Badge variant="lime" size="sm">
                        {inp.category.replace(/_/g, " ")}
                      </Badge>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{inp.composition}</p>

                    <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/60 text-xs space-y-1.5">
                      <div className="flex items-center justify-between text-slate-600">
                        <span className="text-slate-400 text-[11px]">Recommended Dose:</span>
                        <strong className="text-brand-dark text-xs">{inp.standardDosagePerAcre}</strong>
                      </div>
                      <div className="flex items-center justify-between text-slate-600">
                        <span className="text-slate-400 text-[11px]">Target Objective:</span>
                        <span className="text-slate-700 text-xs truncate max-w-[150px]">
                          {inp.primaryNutrientsOrTarget}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-3 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setShowRecipeModal(inp)}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                      Preparation Recipe
                    </button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => {
                        setAppInputId(inp.id);
                        setShowApplyInputModal(true);
                      }}
                      className="text-xs"
                    >
                      Apply to Field
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Field Application Log Ledger */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
              <h2 className="text-base font-extrabold text-brand-text">Field Application Ledger (NPOP Traceability)</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-400 font-extrabold uppercase tracking-wider text-[10px] border-b border-slate-100">
                    <tr>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Field / Parcel</th>
                      <th className="py-3 px-4">Formulation Name</th>
                      <th className="py-3 px-4">Quantity Applied</th>
                      <th className="py-3 px-4">Application Method</th>
                      <th className="py-3 px-4">Batch / Lot</th>
                      <th className="py-3 px-4">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {applications.map((app) => (
                      <tr key={app.id} className="hover:bg-slate-50/70 transition">
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-700">{app.appliedDate}</td>
                        <td className="py-3.5 px-4 font-bold text-brand-dark">{app.fieldName}</td>
                        <td className="py-3.5 px-4 font-bold text-brand-text">{app.inputName}</td>
                        <td className="py-3.5 px-4 font-black font-mono text-emerald-800">
                          {app.quantity} {app.unit}
                        </td>
                        <td className="py-3.5 px-4 capitalize text-slate-600">
                          {app.applicationMethod.replace(/_/g, " ")}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                          {app.batchLotNumber || "—"}
                        </td>
                        <td className="py-3.5 px-4 text-slate-500 max-w-xs truncate" title={app.notes}>
                          {app.notes || "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ===================== TAB 3: NO-TILL FARMING ===================== */}
        {activeTab === "notill" && (
          <div className="space-y-8">
            {/* No-Till Intro Banner */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-lg font-extrabold text-brand-text">
                    Conservation No-Till Agriculture • शून्य मशागत शेती
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Minimal mechanical disturbance preserves fungal hyphae networks, earthworm burrows, and vertical pore structures.
                  </p>
                </div>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setShowNoTillModal(true)}
                  leftIcon={<PlusCircle className="w-4 h-4" />}
                >
                  Log Residue / No-Till Run
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/70 space-y-1.5 text-xs">
                  <span className="font-bold text-brand-dark block text-sm">1. Zero Mechanical Tillage</span>
                  <p className="text-slate-600 leading-relaxed">
                    Soil disturbance depth kept strictly at <strong>0 cm</strong>. Seeds planted directly through mulch using Happy Seeders.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/70 space-y-1.5 text-xs">
                  <span className="font-bold text-brand-dark block text-sm">2. 70%+ Stubble Retention</span>
                  <p className="text-slate-600 leading-relaxed">
                    Soybean stubble and cotton stalks rolled flat into a dense organic blanket preventing solar baking and moisture loss.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/70 space-y-1.5 text-xs">
                  <span className="font-bold text-brand-dark block text-sm">3. Biological Allelopathy</span>
                  <p className="text-slate-600 leading-relaxed">
                    Cover crops (Sunn hemp & Cowpea) suppress 85% of weed germination naturally without chemical herbicides like Glyphosate.
                  </p>
                </div>
              </div>
            </div>

            {/* Field Suitability & Records */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {noTillRecords.map((ntr) => (
                <div
                  key={ntr.id}
                  className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4 hover:border-brand-primary/50 transition"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-base font-extrabold text-brand-text">{ntr.fieldName}</h3>
                      <p className="text-xs text-slate-500">
                        Season: <strong className="text-slate-800">{ntr.seasonYear}</strong>
                      </p>
                    </div>
                    <Badge variant="lime" size="sm">
                      Suitability {ntr.suitabilityScore}/100
                    </Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-3 p-3.5 rounded-2xl bg-stone-50 border border-stone-200/70 text-xs text-center">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold">Residue Coverage</span>
                      <strong className="text-emerald-700 text-sm font-black">{ntr.residueCoveragePct}%</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold">Tillage Depth</span>
                      <strong className="text-brand-dark text-sm font-black">{ntr.soilDisturbanceDepthCm} cm</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold">Moisture Retention</span>
                      <strong className="text-sky-700 text-sm font-black">{ntr.moistureRetentionScore}/100</strong>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-600">
                    <div>
                      <span className="text-slate-400">Mulch Stubble: </span>
                      <strong className="text-slate-800 capitalize">{ntr.residueType.replace(/_/g, " ")}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400">Cover Crop Species: </span>
                      <strong className="text-brand-dark">{ntr.coverCropPlanted}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400">Weed Control: </span>
                      <strong className="text-slate-800 capitalize">{ntr.weedSuppressionMethod.replace(/_/g, " ")}</strong>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 pt-2 border-t border-slate-100">{ntr.notes}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================== TAB 4: KNOWLEDGE CENTER ===================== */}
        {activeTab === "knowledge" && (
          <div className="space-y-6">
            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {[
                { id: "all", label: "All Categories" },
                { id: "organic_farming", label: "Organic Farming" },
                { id: "soil_management", label: "Soil Health" },
                { id: "no_till_farming", label: "No-Till" },
                { id: "pest_management", label: "Pest Management" },
                { id: "water_conservation", label: "Water Conservation" },
                { id: "sustainable_agriculture", label: "Natural Farming" },
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategory(c.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap ${
                    selectedCategory === c.id
                      ? "bg-brand-primary text-white shadow-xs"
                      : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            {/* Knowledge Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredResources.map((res) => (
                <div
                  key={res.id}
                  className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-4 hover:border-brand-primary/50 transition"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-[10px] font-extrabold uppercase tracking-wider border border-emerald-200/60">
                        {res.category.replace(/_/g, " ")}
                      </span>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {res.readTimeMinutes} min
                      </span>
                    </div>

                    <h3 className="text-base font-extrabold text-brand-text leading-snug">{res.title}</h3>
                    <p className="text-xs text-brand-primary font-bold">{res.marathiTitle}</p>
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">{res.summary}</p>
                  </div>

                  <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400 truncate max-w-[150px]">By {res.author}</span>
                    <button
                      onClick={() => alert(`Opening complete guide: ${res.title}`)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
                    >
                      <FileText className="w-3.5 h-3.5 text-slate-500" />
                      Read Guide
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================== ENROLL TRANSITION MODAL ===================== */}
        <Modal
          isOpen={showEnrollModal}
          onClose={() => setShowEnrollModal(false)}
          title="Enroll Field Parcel in Organic Transition Program"
          maxWidth="md"
        >
          <form onSubmit={handleEnrollSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Select Field Parcel *</label>
              <select
                value={enrFieldId}
                onChange={(e) => setEnrFieldId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white font-medium focus:ring-2 focus:ring-brand-primary"
                required
              >
                {fields.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name} ({f.areaAcres} Acres - {f.soilType})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Certification Standard *</label>
              <select
                value={enrProgId}
                onChange={(e) => setEnrProgId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white font-medium focus:ring-2 focus:ring-brand-primary"
                required
              >
                {programs.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.conversionPeriodMonths} Mo. Transition)
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Baseline Chemical NPK (kg/acre) *</label>
                <input
                  type="number"
                  value={enrBaselineNpk}
                  onChange={(e) => setEnrBaselineNpk(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white font-medium focus:ring-2 focus:ring-brand-primary"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Baseline Pesticides (Liters/acre)</label>
                <input
                  type="number"
                  step="0.5"
                  value={enrBaselinePest}
                  onChange={(e) => setEnrBaselinePest(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white font-medium focus:ring-2 focus:ring-brand-primary"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Inspection & Certification Agency</label>
              <input
                type="text"
                value={enrAgency}
                onChange={(e) => setEnrAgency(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white font-medium focus:ring-2 focus:ring-brand-primary"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Transition Goals</label>
              <textarea
                rows={2}
                value={enrGoals}
                onChange={(e) => setEnrGoals(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white font-medium focus:ring-2 focus:ring-brand-primary"
              />
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-amber-950 text-xs">
              <span className="font-bold block mb-1">Compliance Rule</span>
              <span>
                Field will enter <strong>In-Conversion Year 1 (C1)</strong> status. Full certification is awarded only after 36 months of documented compliance and accredited audits.
              </span>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <Button type="button" variant="outline" size="md" onClick={() => setShowEnrollModal(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="md">
                Enroll Field in Conversion
              </Button>
            </div>
          </form>
        </Modal>

        {/* ===================== LOG INPUT APPLICATION MODAL ===================== */}
        <Modal
          isOpen={showApplyInputModal}
          onClose={() => setShowApplyInputModal(false)}
          title="Log Biological / Organic Input Application"
          maxWidth="md"
        >
          <form onSubmit={handleApplyInputSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Target Field / Parcel *</label>
              <select
                value={appFieldId}
                onChange={(e) => setAppFieldId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white font-medium focus:ring-2 focus:ring-brand-primary"
                required
              >
                {fields.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Select Formulation *</label>
              <select
                value={appInputId}
                onChange={(e) => setAppInputId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white font-medium focus:ring-2 focus:ring-brand-primary"
                required
              >
                {organicInputs.map((i) => (
                  <option key={i.id} value={i.id}>
                    {i.name} ({i.standardDosagePerAcre})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Quantity Applied *</label>
                <input
                  type="number"
                  value={appQty}
                  onChange={(e) => setAppQty(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white font-medium focus:ring-2 focus:ring-brand-primary"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Unit of Measure *</label>
                <select
                  value={appUnit}
                  onChange={(e) => setAppUnit(e.target.value as any)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white font-medium focus:ring-2 focus:ring-brand-primary"
                  required
                >
                  <option value="liters">Liters</option>
                  <option value="kg">Kilograms (kg)</option>
                  <option value="tonnes">Tonnes</option>
                  <option value="bags">Bags</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Application Method *</label>
                <select
                  value={appMethod}
                  onChange={(e) => setAppMethod(e.target.value as any)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white font-medium focus:ring-2 focus:ring-brand-primary"
                  required
                >
                  <option value="drip_fertigation">Venturi Drip Fertigation</option>
                  <option value="foliar_spray">Foliar Mist Spray</option>
                  <option value="broadcasting">Soil Broadcasting</option>
                  <option value="soil_drenching">Root Drenching</option>
                  <option value="seed_treatment">Seed Coating (Beejamrit)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Batch / Lot Number</label>
                <input
                  type="text"
                  value={appBatch}
                  onChange={(e) => setAppBatch(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white font-mono font-medium focus:ring-2 focus:ring-brand-primary"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Operational Observations</label>
              <textarea
                rows={2}
                value={appNotes}
                onChange={(e) => setAppNotes(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white font-medium focus:ring-2 focus:ring-brand-primary"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <Button type="button" variant="outline" size="md" onClick={() => setShowApplyInputModal(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="md">
                Log Application
              </Button>
            </div>
          </form>
        </Modal>

        {/* ===================== LOG NO-TILL MODAL ===================== */}
        <Modal
          isOpen={showNoTillModal}
          onClose={() => setShowNoTillModal(false)}
          title="Log No-Till Seeding & Residue Management"
          maxWidth="md"
        >
          <form onSubmit={handleNoTillSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Select Field Parcel *</label>
              <select
                value={ntFieldId}
                onChange={(e) => setNtFieldId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white font-medium focus:ring-2 focus:ring-brand-primary"
                required
              >
                {fields.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Residue Stubble Type *</label>
                <select
                  value={ntResidue}
                  onChange={(e) => setNtResidue(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white font-medium focus:ring-2 focus:ring-brand-primary"
                  required
                >
                  <option value="cotton_stalk_mulch">Cotton Stalk Residue</option>
                  <option value="soybean_stubble">Soybean Stubble Mat</option>
                  <option value="paddy_straw">Paddy Straw Mulch</option>
                  <option value="dhaincha_cover">Green Dhaincha Biomass</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Soil Coverage Percentage (%) *</label>
                <input
                  type="number"
                  value={ntCoverage}
                  onChange={(e) => setNtCoverage(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white font-medium focus:ring-2 focus:ring-brand-primary"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Cover Crop Interplanted</label>
                <input
                  type="text"
                  value={ntCoverCrop}
                  onChange={(e) => setNtCoverCrop(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white font-medium focus:ring-2 focus:ring-brand-primary"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Tillage Disturbance Depth (cm)</label>
                <input
                  type="number"
                  value={ntDepth}
                  onChange={(e) => setNtDepth(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white font-medium focus:ring-2 focus:ring-brand-primary"
                />
                <span className="text-[10px] text-slate-400">0 cm = Strict Zero Tillage</span>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Field Activity Notes</label>
              <textarea
                rows={2}
                value={ntNotes}
                onChange={(e) => setNtNotes(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white font-medium focus:ring-2 focus:ring-brand-primary"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <Button type="button" variant="outline" size="md" onClick={() => setShowNoTillModal(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="md">
                Log Conservation Record
              </Button>
            </div>
          </form>
        </Modal>

        {/* ===================== RECIPE DRAWER MODAL ===================== */}
        {showRecipeModal && (
          <Modal
            isOpen={!!showRecipeModal}
            onClose={() => setShowRecipeModal(null)}
            title={`${showRecipeModal.name} • Preparation Recipe`}
            maxWidth="md"
          >
            <div className="space-y-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-brand-light/60 border border-brand-light">
                <span className="font-extrabold text-brand-dark block text-xs mb-1">Composition:</span>
                <p className="text-slate-700 leading-relaxed">{showRecipeModal.composition}</p>
              </div>

              <div>
                <span className="font-extrabold text-slate-800 block text-xs mb-1">Preparation Protocol:</span>
                <p className="text-slate-600 leading-relaxed bg-stone-50 p-3.5 rounded-2xl border border-stone-200/70">
                  {showRecipeModal.preparationMethod}
                </p>
              </div>

              <div>
                <span className="font-extrabold text-slate-800 block text-xs mb-1">Field Application Guidelines:</span>
                <p className="text-slate-600 leading-relaxed bg-stone-50 p-3.5 rounded-2xl border border-stone-200/70">
                  {showRecipeModal.applicationGuidelines}
                </p>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs">
                <span>Standard Dose: <strong>{showRecipeModal.standardDosagePerAcre}</strong></span>
                <Badge variant="lime" size="sm">
                  {showRecipeModal.certificationComplianceStatus}
                </Badge>
              </div>

              <div className="flex justify-end pt-2 border-t border-slate-100">
                <Button variant="outline" size="md" onClick={() => setShowRecipeModal(null)}>
                  Close
                </Button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </DashboardShell>
  );
}

