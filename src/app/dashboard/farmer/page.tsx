"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAppState } from "@/lib/store";
import { DashboardShell } from "@/components/layout/DashboardShell";
import SensorGauge from "@/components/SensorGauge";
import { Button } from "@/components/ui/Button";
import { StatCard, Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { EmptyState } from "@/components/ui/EmptyState";
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
  CheckCircle2,
  ShoppingBag,
  Wrench,
  Stethoscope,
  Landmark,
  MapPin,
  TrendingUp,
  Cpu,
  FlaskConical,
  Leaf,
  LayoutDashboard,
  Activity,
  Trees,
  Clock,
  Bug,
  PackageCheck,
} from "lucide-react";

export default function FarmerDashboard() {
  const {
    data,
    triggerSensorSync,
    addFarmActivity,
    addCropObservation,
    addHarvestRecord,
    updateCropStage,
    updateOrderStatus,
  } = useAppState();

  const [syncing, setSyncing] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "overview" | "timeline" | "crops" | "observations" | "harvest" | "orders"
  >("overview");

  // Farm activity modal
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [actType, setActType] = useState<
    "sowing" | "irrigation" | "fertilizer" | "soil_testing" | "pest_treatment" | "harvesting"
  >("fertilizer");
  const [actTitle, setActTitle] = useState("");
  const [actFieldId, setActFieldId] = useState("");
  const [actDesc, setActDesc] = useState("");
  const [actQty, setActQty] = useState(15);
  const [actUnit, setActUnit] = useState("kg");
  const [actCost, setActCost] = useState(1200);

  // Observation modal
  const [showObsModal, setShowObsModal] = useState(false);
  const [obsType, setObsType] = useState<
    "pest_infestation" | "disease_symptom" | "nutrient_deficiency" | "weather_damage"
  >("pest_infestation");
  const [obsPestName, setObsPestName] = useState("");
  const [obsSeverity, setObsSeverity] = useState<"low" | "medium" | "high" | "critical">("medium");
  const [obsTreatment, setObsTreatment] = useState("");

  const farmer = data.users.find((u) => u.role === "farmer") || data.users[0];
  const farms = data.farms || [];
  const fields = data.fields || [];
  const farm = farms[0];
  const tele = data.currentTelemetry;
  const activities = data.farmActivities || [];
  const cropCycles = data.cropCycles || [];
  const observations = data.cropObservations || [];
  const harvestRecords = data.harvestRecords || [];

  const handleSync = () => {
    setSyncing(true);
    triggerSensorSync();
    setTimeout(() => setSyncing(false), 500);
  };

  const handleLogActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!actTitle) return;
    const targetField = fields.find((f) => f.id === actFieldId) || fields[0];
    addFarmActivity({
      farmId: farm?.id || "farm_01",
      fieldId: targetField?.id || "field_01",
      fieldName: targetField?.name || "Field A",
      activityType: actType,
      title: actTitle,
      description: actDesc,
      quantity: actQty,
      unit: actUnit,
      costIncurred: actCost,
      performedDate: new Date().toISOString().split("T")[0],
    });
    setShowActivityModal(false);
    setActTitle("");
    setActDesc("");
  };

  const handleLogObservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!obsPestName) return;
    const targetField = fields[0];
    addCropObservation({
      fieldId: targetField?.id || "field_01",
      cropName: targetField?.currentCrop || "Cotton",
      observationType: obsType,
      pestOrDiseaseName: obsPestName,
      severity: obsSeverity,
      affectedAreaPct: 10,
      observedDate: new Date().toISOString().split("T")[0],
      treatmentTaken: obsTreatment,
    });
    setShowObsModal(false);
    setObsPestName("");
    setObsTreatment("");
  };

  const totalAcres = farms.reduce((acc, f) => acc + Number(f.totalAcres), 0);
  const activeCropsCount = new Set(fields.map((f) => f.currentCrop)).size;

  const navItems = [
    { label: "Dashboard Overview", href: "/dashboard/farmer", icon: LayoutDashboard },
    { label: "My Farm & Fields", href: "/dashboard/farmer/my-farm", icon: Trees, badge: `${farms.length}` },
    { label: "Soil Health & Lab", href: "/dashboard/farmer/soil-health", icon: FlaskConical },
    { label: "Smart Devices & Valves", href: "/dashboard/farmer/devices", icon: Cpu, badge: `${data.devices?.length || 5}` },
    { label: "Sustainable & Organic", href: "/dashboard/farmer/organic", icon: Leaf, badge: "Phase 5" },
    { label: "Deep Root Telemetry", href: "/sensors", icon: Activity, badge: "Live" },
    { label: "Produce Mandi", href: "/marketplace", icon: ShoppingBag },
    { label: "Machinery Fleet", href: "/rentals", icon: Wrench },
    { label: "AI शेती सल्लागार (Crop Clinic)", href: "/advisory", icon: Sparkles, badge: "AI" },
    { label: "Agri-Credit & PMFBY", href: "/finance", icon: Landmark },
  ];

  return (
    <DashboardShell
      navItems={navItems}
      roleTitle="Farmer Command Center"
      roleSubtitle={`${farmer.fullName} • Wardha`}
      roleIcon={Sprout}
    >
      <div className="space-y-8">
        {/* ===================== WELCOME & PROFILE BANNER ===================== */}
        <div className="bg-gradient-to-r from-brand-dark via-brand-primary to-emerald-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-brand-lime/10 blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-brand-lime text-xs font-bold">
                <Sprout className="w-3.5 h-3.5" />
                <span>राम राम, {farmer.fullName} • Welcome Back</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                {farm ? farm.name : "My Agricultural Hub"}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-xs text-stone-200">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-brand-lime" />
                  {farmer.village}, {farmer.taluka}, {farmer.district}
                </span>
                <span>•</span>
                <span>Kisan ID: <strong className="text-white font-mono">{farmer.id}</strong></span>
                <span>•</span>
                <span>Soil Sentinels: <strong className="text-white font-mono">{data.sensors.length} Active</strong></span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link href="/advisory">
                <Button
                  variant="outline"
                  size="md"
                  className="bg-brand-lime text-brand-dark hover:bg-lime-400 font-bold border-none"
                  leftIcon={<Sparkles className="w-4 h-4 text-brand-dark" />}
                >
                  AI सल्लागार (Ask AI)
                </Button>
              </Link>

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

              <Button
                variant="accent"
                size="md"
                onClick={() => setShowActivityModal(true)}
                leftIcon={<PlusCircle className="w-4 h-4" />}
              >
                Log Activity
              </Button>
            </div>
          </div>
        </div>

        {/* ===================== 4 CORE DATA METRICS (ACTUAL DB RECORDS) ===================== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            label="Total Land Holdings"
            value={totalAcres > 0 ? totalAcres : 0}
            unit="Acres"
            change={farms.length > 0 ? `${farms.length} Farm Properties` : "No farms"}
            trend="neutral"
            icon={<Trees className="w-5 h-5 text-brand-dark" />}
            iconBg="bg-brand-light"
          />
          <StatCard
            label="Registered Fields"
            value={fields.length}
            unit="Fields"
            change={fields.length > 0 ? "All zones active" : "0 zones"}
            trend={fields.length > 0 ? "up" : "neutral"}
            icon={<LayersIcon className="w-5 h-5 text-emerald-700" />}
            iconBg="bg-emerald-100"
          />
          <StatCard
            label="Cultivated Crops"
            value={activeCropsCount}
            unit="Crops"
            change="Cotton, Soybean, Turmeric"
            trend="up"
            icon={<Sprout className="w-5 h-5 text-purple-700" />}
            iconBg="bg-purple-100"
          />
          <StatCard
            label="Farm Health Index"
            value="92"
            unit="/ 100"
            change="Tier-1 Optimal Soil"
            trend="up"
            icon={<Activity className="w-5 h-5 text-sky-700" />}
            iconBg="bg-sky-100"
          />
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1.5 border-b border-slate-200 pb-3 overflow-x-auto">
          {[
            { id: "overview", label: "Farm Overview & Soil Telemetry" },
            { id: "timeline", label: `Activity Timeline (${activities.length})` },
            { id: "crops", label: `Crops & Cycles (${cropCycles.length})` },
            { id: "observations", label: `Pest Observations (${observations.length})` },
            { id: "harvest", label: `Harvest Records (${harvestRecords.length})` },
            { id: "orders", label: `Mandi Orders & Sell Offers (${(data.purchaseOrders || []).filter(o => o.farmerId === farmer.id).length})` },
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
            {/* Live Root-Zone Soil Telemetry */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <h3 className="text-sm font-extrabold text-brand-text uppercase tracking-wider">
                    Live Root-Zone Telemetry (Plot A - Cotton BG-II)
                  </h3>
                </div>
                <Badge variant="lime" dot size="sm">
                  Sensor: MS-PRO-8841-WRD
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

            {/* Upcoming Farming Activities & Notifications */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left: Upcoming Operations */}
              <div className="lg:col-span-7 bg-white rounded-3xl p-6 shadow-card border border-slate-200 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-brand-primary" />
                    <h3 className="text-base font-extrabold text-brand-text">
                      Upcoming Farming Activities
                    </h3>
                  </div>
                  <Link href="/dashboard/farmer/my-farm" className="text-xs font-bold text-brand-primary hover:underline">
                    Manage Farm
                  </Link>
                </div>

                <div className="space-y-3">
                  <div className="p-3.5 rounded-2xl bg-brand-light/40 border border-brand-light flex items-start gap-3">
                    <Clock className="w-4 h-4 text-brand-dark flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline">
                        <h4 className="text-xs font-bold text-brand-dark">Foliar Spray 13:00:45</h4>
                        <span className="text-[10px] font-bold text-slate-500">Tomorrow, 07:00 AM</span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-0.5">
                        Field A (Cotton BG-II) • Apply 1% Potassium Nitrate solution for boll expansion.
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-100 flex items-start gap-3">
                    <Droplets className="w-4 h-4 text-sky-700 flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline">
                        <h4 className="text-xs font-bold text-sky-900">Automated Drip Cycle</h4>
                        <span className="text-[10px] font-bold text-slate-500">In 2 Days</span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-0.5">
                        Field B (Soybean) & Field C (Turmeric) • 45-minute scheduled root hydration.
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-100 flex items-start gap-3">
                    <Wrench className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline">
                        <h4 className="text-xs font-bold text-amber-900">Drone Spraying Arrival</h4>
                        <span className="text-[10px] font-bold text-slate-500">06 Nov 2026</span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-0.5">
                        Mahalaxmi Custom Hiring DJI T40 spray drone booked for 8 acres.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Important Alerts */}
              <div className="lg:col-span-5 bg-white rounded-3xl p-6 shadow-card border border-slate-200 space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <h3 className="text-base font-extrabold text-brand-text">Important Alerts</h3>
                </div>

                <div className="space-y-3">
                  <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs space-y-1">
                    <Badge variant="warning" size="sm">Weather Advisory</Badge>
                    <p className="font-bold text-amber-950 mt-1">Light precipitation expected in 3 days</p>
                    <p className="text-slate-600 text-[11px]">
                      Complete nitrogen foliar spraying before Friday afternoon to prevent rain wash-off.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs space-y-1">
                    <Badge variant="success" size="sm">Mandi Price Surge</Badge>
                    <p className="font-bold text-emerald-950 mt-1">Cotton prices at ₹78.50/kg</p>
                    <p className="text-slate-600 text-[11px]">
                      Current Wardha & APMC Vashi benchmark +6% higher than MSP.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Agronomist Precision Recommendations Banner */}
            <div className="bg-gradient-to-r from-emerald-950 via-brand-dark to-brand-primary rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-lime/20 text-brand-lime text-xs font-bold">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>AI शेती सल्लागार • Live Diagnostics</span>
                  </div>
                  <h3 className="text-xl font-black">AI Agronomist Precision Recommendations</h3>
                  <p className="text-xs text-stone-300">
                    Grounded in your root-zone telemetry ({tele.nitrogenPpm} ppm N, {tele.moisturePct}% Moisture) and PDKV Vidarbha crop standards.
                  </p>
                </div>
                <Link href="/advisory">
                  <Button
                    size="sm"
                    className="bg-brand-lime text-brand-dark hover:bg-lime-400 font-bold border-none"
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    Open Crop Clinic
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                {(data.aiRecommendations || []).slice(0, 3).map((rec) => (
                  <div key={rec.id} className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-brand-lime bg-black/20 px-2 py-0.5 rounded-full">
                        {rec.recommendationType.replace(/_/g, " ")} • {rec.urgency}
                      </span>
                      <span className="text-[10px] text-stone-300 font-mono">
                        Active
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-white line-clamp-1">{rec.title}</h4>
                    <p className="text-[11px] text-stone-200 line-clamp-2 leading-relaxed">
                      {rec.description}
                    </p>
                    <div className="pt-2">
                      <Link href={rec.actionRoute || "/advisory"} className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-lime hover:underline">
                        <span>Review Action</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ===================== TIMELINE TAB ===================== */}
        {activeTab === "timeline" && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-slate-200 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-black text-brand-text">Farm Operations Timeline</h3>
                <p className="text-xs text-slate-500">
                  Audited history of sowing, irrigation, fertilizer runs, pest treatment, and soil testing.
                </p>
              </div>

              <Button
                size="sm"
                variant="accent"
                onClick={() => setShowActivityModal(true)}
                leftIcon={<PlusCircle className="w-4 h-4" />}
              >
                Record New Activity
              </Button>
            </div>

            {activities.length === 0 ? (
              <EmptyState
                title="No activities recorded yet"
                description="Keep a complete log of fertigation, sowing, and spraying events for yield tracking."
                actionLabel="Log First Activity"
                onAction={() => setShowActivityModal(true)}
              />
            ) : (
              <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
                {activities.map((act) => (
                  <div key={act.id} className="relative flex items-start gap-4">
                    <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-brand-primary text-white flex items-center justify-center text-[10px] font-bold shadow-sm">
                      ✓
                    </div>
                    <div className="flex-1 bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1.5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="lime" size="sm">
                            {act.activityType.toUpperCase()}
                          </Badge>
                          <h4 className="text-xs font-bold text-slate-900">{act.title}</h4>
                        </div>
                        <span className="text-[11px] font-mono text-slate-400 font-bold">{act.performedDate}</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{act.description}</p>
                      <div className="flex items-center gap-4 text-[11px] text-slate-500 pt-1 border-t border-slate-200/60">
                        <span>Zone: <strong className="text-slate-800">{act.fieldName}</strong></span>
                        {act.quantity && (
                          <span>
                            Quantity: <strong className="text-slate-800">{act.quantity} {act.unit}</strong>
                          </span>
                        )}
                        <span>Cost: <strong className="text-emerald-700 font-mono">₹{act.costIncurred}</strong></span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ===================== CROPS & CYCLES TAB ===================== */}
        {activeTab === "crops" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-brand-text">Active Crop Cycles</h3>
                <p className="text-xs text-slate-500">
                  Track seed variety, sowing date, growth stages, and estimated yields per field.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {cropCycles.map((cycle) => (
                <div
                  key={cycle.id}
                  className="bg-white rounded-3xl p-6 shadow-card border border-slate-200 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant="neutral">{cycle.status.toUpperCase()}</Badge>
                      <Badge variant="lime">Stage: {cycle.growthStage}</Badge>
                    </div>

                    <h4 className="text-base font-extrabold text-brand-text">{cycle.cropName}</h4>
                    <p className="text-xs font-bold text-brand-primary mt-1">{cycle.variety}</p>
                    <p className="text-xs text-slate-500 mt-0.5">Seed Source: {cycle.seedBrandOrSource}</p>

                    <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                      <div className="flex justify-between">
                        <span>Sown Date:</span>
                        <strong className="text-slate-900 font-mono">{cycle.sowingDate}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Expected Harvest:</span>
                        <strong className="text-slate-900 font-mono">{cycle.expectedHarvestDate}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Estimated Yield:</span>
                        <strong className="text-emerald-700 font-mono">{cycle.estimatedYieldKg} kg</strong>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-3 border-t border-slate-100">
                    <Select
                      label="Update Growth Stage"
                      value={cycle.growthStage}
                      onChange={(e) => updateCropStage(cycle.id, e.target.value)}
                      options={[
                        { value: "Sowing", label: "Sowing / Germination" },
                        { value: "Vegetative", label: "Vegetative Growth" },
                        { value: "Flowering", label: "Flowering" },
                        { value: "Boll/Pod Formation", label: "Boll / Pod Formation" },
                        { value: "Maturity", label: "Maturity Stage" },
                        { value: "Harvested", label: "Harvested" },
                      ]}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================== OBSERVATIONS TAB ===================== */}
        {activeTab === "observations" && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-slate-200 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-black text-brand-text">Pest & Crop Health Observations</h3>
                <p className="text-xs text-slate-500">
                  Early detection logs for leaf curl, sucking pests, and nutrient deficiencies.
                </p>
              </div>

              <Button
                size="sm"
                variant="accent"
                onClick={() => setShowObsModal(true)}
                leftIcon={<Bug className="w-4 h-4" />}
              >
                Record Observation
              </Button>
            </div>

            {observations.length === 0 ? (
              <EmptyState
                title="No pest observations recorded"
                description="Log any abnormal symptoms or insect sightings to receive university agronomist guidance."
                actionLabel="Log Observation"
                onAction={() => setShowObsModal(true)}
              />
            ) : (
              <div className="space-y-4">
                {observations.map((obs) => (
                  <div key={obs.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="warning">{obs.observationType.replace("_", " ").toUpperCase()}</Badge>
                        <h4 className="text-xs font-bold text-slate-900">{obs.pestOrDiseaseName}</h4>
                      </div>
                      <span className="text-[11px] font-mono text-slate-400 font-bold">{obs.observedDate}</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-slate-600">
                      <span>Affected Crop: <strong>{obs.cropName}</strong></span>
                      <span>Estimated Area: <strong>{obs.affectedAreaPct}%</strong></span>
                      <span>
                        Severity: <strong className="text-rose-700 uppercase">{obs.severity}</strong>
                      </span>
                    </div>
                    {obs.treatmentTaken && (
                      <p className="text-xs text-slate-700 pt-1 border-t border-slate-200">
                        <span className="font-bold text-emerald-800">Treatment Taken:</span> {obs.treatmentTaken}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ===================== HARVEST TAB ===================== */}
        {activeTab === "harvest" && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-slate-200 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-black text-brand-text">Harvest Yield Records</h3>
                <p className="text-xs text-slate-500">
                  Historical yields, quality certifications, and market realization rates.
                </p>
              </div>
            </div>

            {harvestRecords.length === 0 ? (
              <EmptyState
                title="No harvest records available"
                description="Recorded harvests will appear here along with grade benchmarks and selling history."
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {harvestRecords.map((hr) => (
                  <div key={hr.id} className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge variant="lime">{hr.cropName}</Badge>
                      <Badge variant="success">{hr.grade}</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-xs text-slate-700 pt-2">
                      <div>
                        <span className="text-slate-500">Total Yield:</span>
                        <p className="text-lg font-black text-brand-text font-mono">{hr.yieldKg} kg</p>
                      </div>
                      <div>
                        <span className="text-slate-500">Market Rate:</span>
                        <p className="text-lg font-black text-emerald-800 font-mono">₹{hr.marketPricePerKg}/kg</p>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 pt-2 border-t border-slate-200">{hr.notes}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ===================== MANDI ORDERS & SELL OFFERS TAB ===================== */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-slate-200 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-black text-brand-text">Incoming Buyer Purchase Orders</h3>
                  <p className="text-xs text-slate-500">
                    Review wholesale procurement offers, accept contracts, coordinate transport and verify escrow disbursement.
                  </p>
                </div>
                <Link href="/marketplace">
                  <Button variant="accent" size="sm" leftIcon={<ShoppingBag className="w-4 h-4" />}>
                    Publish New Harvest Lot
                  </Button>
                </Link>
              </div>

              {((data.purchaseOrders || []).filter((o) => o.farmerId === farmer.id).length === 0) ? (
                <EmptyState
                  title="No purchase orders for your farm yet"
                  description="When wholesale buyers or millers place orders for your produce, they will appear here for your approval."
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {(data.purchaseOrders || [])
                    .filter((o) => o.farmerId === farmer.id)
                    .map((po) => (
                      <div
                        key={po.id}
                        className="bg-slate-50 rounded-3xl p-6 border border-slate-200 space-y-4 flex flex-col justify-between"
                      >
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-[10px] font-mono font-bold bg-white text-slate-600 px-2 py-0.5 rounded border border-slate-200">
                                  {po.id}
                                </span>
                                <Badge variant="neutral">{po.variety}</Badge>
                              </div>
                              <h4 className="text-base font-extrabold text-brand-text">{po.cropName}</h4>
                            </div>

                            <Badge
                              variant={
                                po.orderStatus === "completed"
                                  ? "success"
                                  : po.orderStatus === "in_transit"
                                  ? "lime"
                                  : po.orderStatus === "confirmed"
                                  ? "info"
                                  : "warning"
                              }
                            >
                              {po.orderStatus.toUpperCase()}
                            </Badge>
                          </div>

                          <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 space-y-2 text-xs">
                            <div className="flex justify-between">
                              <span className="text-slate-500">Procuring Buyer:</span>
                              <strong className="text-slate-800">{po.buyerName}</strong>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500">Buyer Contact:</span>
                              <span className="font-mono text-emerald-700 font-semibold">{po.buyerPhone}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500">Order Quantity:</span>
                              <span className="font-bold text-slate-800">
                                {po.orderQuantity} {po.unit} @ ₹{po.unitPrice}/{po.unit}
                              </span>
                            </div>
                            <div className="flex justify-between pt-1 border-t border-slate-100">
                              <span className="font-bold text-slate-700">Contract Total:</span>
                              <strong className="text-base font-black text-brand-dark font-mono">
                                ₹{po.totalAmount.toLocaleString("en-IN")}
                              </strong>
                            </div>
                          </div>

                          <div className="text-xs text-slate-600 space-y-1">
                            <div className="flex justify-between">
                              <span className="text-slate-500">Delivery Destination:</span>
                              <span className="truncate max-w-[200px] text-slate-700">{po.deliveryAddress}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500">Scheduled Date:</span>
                              <span className="font-medium text-slate-800">{po.scheduledDeliveryDate}</span>
                            </div>
                            <div className="flex justify-between items-center pt-1">
                              <span className="text-slate-500">Payment Status:</span>
                              <span className="font-bold text-emerald-800">
                                {po.paymentStatus === "escrow_locked"
                                  ? "✓ Funds Locked in Escrow"
                                  : po.paymentStatus === "released_to_farmer"
                                  ? "✓ Disbursed to Bank Account"
                                  : "Pending Buyer Escrow"}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Order Action Buttons */}
                        <div className="pt-3 border-t border-slate-200/80 flex items-center gap-2">
                          {po.orderStatus === "requested" && (
                            <>
                              <Button
                                variant="primary"
                                size="sm"
                                className="flex-1"
                                onClick={() => updateOrderStatus(po.id, "confirmed")}
                              >
                                Accept Order
                              </Button>
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() => updateOrderStatus(po.id, "rejected")}
                              >
                                Decline
                              </Button>
                            </>
                          )}

                          {po.orderStatus === "confirmed" && (
                            <Button
                              variant="accent"
                              size="sm"
                              className="w-full"
                              onClick={() => updateOrderStatus(po.id, "in_transit")}
                            >
                              Dispatch Consignment (Start Transit)
                            </Button>
                          )}

                          {po.orderStatus === "in_transit" && (
                            <div className="w-full text-center py-2 text-xs font-bold text-blue-700 bg-blue-50 rounded-xl">
                              🚚 In Transit to Buyer Warehouse
                            </div>
                          )}

                          {po.orderStatus === "completed" && (
                            <div className="w-full text-center py-2 text-xs font-bold text-emerald-700 bg-emerald-50 rounded-xl">
                              ✓ Consignment Delivered & Payment Received
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Farmer's Active Sell Lots */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-slate-200 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h4 className="text-base font-bold text-brand-text">Your Active Produce Listings on Wholesale Mandi</h4>
                <Link href="/marketplace" className="text-xs font-bold text-emerald-700 hover:underline">
                  View Public Mandi →
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(data.produceListings || [])
                  .filter((l) => l.sellerId === farmer.id)
                  .map((lot) => (
                    <div key={lot.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                      <div className="flex justify-between items-center">
                        <Badge variant="lime">{lot.qualityGrade}</Badge>
                        <span className="font-mono text-slate-500 font-bold">{lot.quantity} {lot.unit}</span>
                      </div>
                      <h5 className="font-extrabold text-brand-text text-sm">{lot.cropName}</h5>
                      <p className="text-slate-500">Asking Price: <strong className="text-emerald-800 font-mono font-black">₹{lot.pricePerUnit}/{lot.unit}</strong></p>
                      <p className="text-slate-400 text-[11px]">Harvested: {lot.harvestDate}</p>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* Modal: Log Farm Activity */}
        <Modal
          isOpen={showActivityModal}
          onClose={() => setShowActivityModal(false)}
          title="Log Farm Operation"
          description="Record fertigation, spraying, or field maintenance."
        >
          <form onSubmit={handleLogActivity} className="space-y-4">
            <Select
              label="Activity Type"
              value={actType}
              onChange={(e) => setActType(e.target.value as any)}
              options={[
                { value: "fertilizer", label: "Fertilizer / Nutrient Application" },
                { value: "irrigation", label: "Irrigation Run" },
                { value: "pest_treatment", label: "Pest / Disease Treatment" },
                { value: "soil_testing", label: "Soil Testing / Sensor Check" },
                { value: "sowing", label: "Sowing / Planting" },
                { value: "harvesting", label: "Harvesting" },
              ]}
            />

            <Select
              label="Select Field"
              value={actFieldId || (fields[0]?.id ?? "")}
              onChange={(e) => setActFieldId(e.target.value)}
              options={fields.map((fld) => ({ value: fld.id, label: `${fld.name} (${fld.areaAcres} Ac)` }))}
            />

            <Input
              label="Activity Title"
              placeholder="e.g. Foliar 13:00:45 Spraying"
              value={actTitle}
              onChange={(e) => setActTitle(e.target.value)}
              required
            />

            <Input
              label="Notes & Brand Details"
              placeholder="e.g. 1% solution applied using drone sprayer"
              value={actDesc}
              onChange={(e) => setActDesc(e.target.value)}
            />

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Quantity & Unit"
                placeholder="15 kg / 45 mins"
                value={`${actQty} ${actUnit}`}
                onChange={(e) => setActQty(Number(e.target.value.split(" ")[0]) || 0)}
              />
              <Input
                label="Cost Incurred (₹)"
                type="number"
                value={actCost}
                onChange={(e) => setActCost(Number(e.target.value))}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
              <Button variant="ghost" size="sm" type="button" onClick={() => setShowActivityModal(false)}>
                Cancel
              </Button>
              <Button variant="accent" size="sm" type="submit">
                Record Activity
              </Button>
            </div>
          </form>
        </Modal>

        {/* Modal: Log Observation */}
        <Modal
          isOpen={showObsModal}
          onClose={() => setShowObsModal(false)}
          title="Record Crop Observation"
          description="Log early pest sightings, yellowing, or leaf curl."
        >
          <form onSubmit={handleLogObservation} className="space-y-4">
            <Select
              label="Observation Type"
              value={obsType}
              onChange={(e) => setObsType(e.target.value as any)}
              options={[
                { value: "pest_infestation", label: "Sucking Pest / Insect Sighting" },
                { value: "disease_symptom", label: "Fungal / Leaf Spot / Rust" },
                { value: "nutrient_deficiency", label: "Nutrient Chlorosis (Yellowing)" },
                { value: "weather_damage", label: "Hail / Water-logging Damage" },
              ]}
            />

            <Input
              label="Pest / Symptom Name"
              placeholder="e.g. Jassids & Thrips Sighting"
              value={obsPestName}
              onChange={(e) => setObsPestName(e.target.value)}
              required
            />

            <Input
              label="Action / Treatment Taken"
              placeholder="e.g. Sprayed Neem oil 10,000 ppm"
              value={obsTreatment}
              onChange={(e) => setObsTreatment(e.target.value)}
            />

            <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
              <Button variant="ghost" size="sm" type="button" onClick={() => setShowObsModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" type="submit">
                Save Observation
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </DashboardShell>
  );
}

function LayersIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  );
}
