"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAppState } from "@/lib/store";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Button } from "@/components/ui/Button";
import { StatCard, Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  BarChart3,
  TrendingUp,
  Receipt,
  Sprout,
  Droplets,
  Trees,
  PlusCircle,
  Calendar,
  Layers,
  FlaskConical,
  Activity,
  ArrowRight,
  Filter,
  DollarSign,
  Truck,
  Wrench,
  Users,
  Bug,
  CheckCircle2,
  AlertTriangle,
  Trash2,
  Sparkles,
  LayoutDashboard,
  Cpu,
  Leaf,
  Bell,
  CheckSquare,
  Landmark,
} from "lucide-react";

export default function FarmAnalyticsPage() {
  const { data, addFarmExpense, deleteFarmExpense } = useAppState();

  const [activeTab, setActiveTab] = useState<"overview" | "expenses" | "harvest" | "soil_irrigation">("overview");
  const [showExpenseModal, setShowExpenseModal] = useState<boolean>(false);

  // Filter state for expenses
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedCrop, setSelectedCrop] = useState<string>("all");

  // Form state for adding an expense
  const [expCrop, setExpCrop] = useState<string>("Cotton (कापूस)");
  const [expCategory, setExpCategory] = useState<any>("seeds");
  const [expAmount, setExpAmount] = useState<string>("");
  const [expQuantity, setExpQuantity] = useState<string>("");
  const [expUnit, setExpUnit] = useState<string>("packets");
  const [expVendor, setExpVendor] = useState<string>("");
  const [expPaymentMode, setExpPaymentMode] = useState<any>("upi");
  const [expDate, setExpDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [expNotes, setExpNotes] = useState<string>("");

  const farmer = data.users.find((u) => u.role === "farmer") || data.users[0];
  const farms = data.farms || [];
  const fields = data.fields || [];
  const expenses = data.farmExpenses || [];
  const harvests = data.harvestRecords || [];
  const categories = data.expenseCategories || [];
  const totalAcres = farms.reduce((sum, f) => sum + Number(f.totalAcres), 0);

  // Aggregated calculations
  const totalExpensesAmount = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
  const avgCostPerAcre = totalAcres > 0 ? Math.round(totalExpensesAmount / totalAcres) : 0;
  const totalHarvestGrossRevenue = harvests.reduce((sum, h) => sum + h.yieldKg * h.marketPricePerKg, 0);

  // Crop-wise Area Distribution
  const cropAreaMap: Record<string, number> = {};
  fields.forEach((f) => {
    const crop = f.currentCrop || "Unassigned";
    cropAreaMap[crop] = (cropAreaMap[crop] || 0) + Number(f.areaAcres);
  });

  const cropAreaList = Object.entries(cropAreaMap).map(([crop, acres]) => ({
    crop,
    acres,
    percentage: totalAcres > 0 ? Math.round((acres / totalAcres) * 100) : 0,
  }));

  // Category-wise Expense Breakdown
  const categoryExpenseMap: Record<string, number> = {};
  expenses.forEach((e) => {
    categoryExpenseMap[e.categoryCode] = (categoryExpenseMap[e.categoryCode] || 0) + Number(e.amount);
  });

  const categoryBreakdownList = categories.map((cat) => {
    const amount = categoryExpenseMap[cat.code] || 0;
    return {
      ...cat,
      amount,
      percentage: totalExpensesAmount > 0 ? Math.round((amount / totalExpensesAmount) * 100) : 0,
    };
  });

  // Filtered expenses
  const filteredExpenses = expenses.filter((e) => {
    if (selectedCategory !== "all" && e.categoryCode !== selectedCategory) return false;
    if (selectedCrop !== "all" && !e.cropName.toLowerCase().includes(selectedCrop.toLowerCase())) return false;
    return true;
  });

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expAmount || Number(expAmount) <= 0) return;

    addFarmExpense({
      farmerId: farmer.id,
      farmId: farms[0]?.id || "farm_01",
      fieldId: fields[0]?.id || "field_01",
      cropName: expCrop,
      categoryCode: expCategory,
      expenseDate: expDate,
      amount: Number(expAmount),
      quantity: expQuantity ? Number(expQuantity) : undefined,
      unit: expUnit,
      vendorName: expVendor,
      paymentMode: expPaymentMode,
      notes: expNotes,
    });

    setShowExpenseModal(false);
    setExpAmount("");
    setExpQuantity("");
    setExpVendor("");
    setExpNotes("");
  };

  const getCategoryIcon = (code: string) => {
    switch (code) {
      case "seeds":
        return <Sprout className="w-4 h-4 text-emerald-600" />;
      case "fertilizers":
        return <FlaskConical className="w-4 h-4 text-brand-primary" />;
      case "labour":
        return <Users className="w-4 h-4 text-amber-600" />;
      case "equipment_rental":
        return <Wrench className="w-4 h-4 text-indigo-600" />;
      case "irrigation":
        return <Droplets className="w-4 h-4 text-sky-600" />;
      case "transportation":
        return <Truck className="w-4 h-4 text-orange-600" />;
      case "pest_control":
        return <Bug className="w-4 h-4 text-rose-600" />;
      default:
        return <Receipt className="w-4 h-4 text-slate-500" />;
    }
  };

  const navItems = [
    { label: "Dashboard Overview", href: "/dashboard/farmer", icon: LayoutDashboard },
    { label: "Farm Analytics & Expenses", href: "/dashboard/farmer/analytics", icon: BarChart3, badge: "Active" },
    { label: "Task Calendar", href: "/dashboard/farmer/tasks", icon: CheckSquare, badge: "Phase 10" },
    { label: "Notifications & Alerts", href: "/notifications", icon: Bell },
    { label: "My Farm & Fields", href: "/dashboard/farmer/my-farm", icon: Trees },
    { label: "Soil Health & Lab", href: "/dashboard/farmer/soil-health", icon: FlaskConical },
    { label: "Smart Devices & Valves", href: "/dashboard/farmer/devices", icon: Cpu },
    { label: "Sustainable & Organic", href: "/dashboard/farmer/organic", icon: Leaf },
    { label: "AI शेती सल्लागार (Crop Clinic)", href: "/advisory", icon: Sparkles },
    { label: "Agri-Credit & PMFBY", href: "/finance", icon: Landmark },
  ];

  return (
    <DashboardShell
      navItems={navItems}
      roleTitle="Farm Performance Analytics"
      roleSubtitle={`${farmer.fullName} • ${totalAcres} Acres Recorded`}
      roleIcon={BarChart3}
    >
      <div className="space-y-8">
        {/* Banner */}
        <div className="bg-gradient-to-r from-brand-dark via-emerald-950 to-brand-primary rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-lime/20 text-brand-lime text-xs font-bold">
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Verified Historical Farming Records • Kharif 2026</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                Farm Analytics & Cost Intelligence
              </h1>
              <p className="text-xs text-stone-200 max-w-2xl leading-relaxed">
                Comprehensive audits of crop distribution, farming expenses by category, harvest monetization, inputs ledger, and multi-year soil health trajectory.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="accent"
                size="md"
                onClick={() => setShowExpenseModal(true)}
                leftIcon={<PlusCircle className="w-4 h-4" />}
              >
                Record Farm Expense
              </Button>
            </div>
          </div>
        </div>

        {/* 4 Core Financial & Land Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            label="Total Land Holdings"
            value={totalAcres}
            unit="Acres"
            change={`${fields.length} Registered Fields`}
            trend="neutral"
            icon={<Trees className="w-5 h-5 text-emerald-800" />}
            iconBg="bg-emerald-100"
          />
          <StatCard
            label="Recorded Season Expenses"
            value={`₹${totalExpensesAmount.toLocaleString("en-IN")}`}
            change={`${expenses.length} Itemized Entries`}
            trend="neutral"
            icon={<Receipt className="w-5 h-5 text-rose-800" />}
            iconBg="bg-rose-100"
          />
          <StatCard
            label="Average Cost Per Acre"
            value={`₹${avgCostPerAcre.toLocaleString("en-IN")}`}
            unit="/ Acre"
            change="Across all 3 plots"
            trend="up"
            icon={<TrendingUp className="w-5 h-5 text-amber-800" />}
            iconBg="bg-amber-100"
          />
          <StatCard
            label="Harvest Realization Value"
            value={`₹${totalHarvestGrossRevenue.toLocaleString("en-IN")}`}
            change="Mandi Escrow + APMC"
            trend="up"
            icon={<DollarSign className="w-5 h-5 text-sky-800" />}
            iconBg="bg-sky-100"
          />
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 border-b border-slate-200 pb-3 overflow-x-auto">
          {[
            { id: "overview", label: "Analytics Overview & Land Distribution" },
            { id: "expenses", label: `Farming Expenses Ledger (${expenses.length})` },
            { id: "harvest", label: `Harvest History & Yield (${harvests.length})` },
            { id: "soil_irrigation", label: "Inputs, Irrigation & Soil Health Trends" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-brand-primary text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-200/60"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ================= TAB 1: OVERVIEW & CROP DISTRIBUTION ================= */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Crop-wise Area Distribution Card */}
              <div className="lg:col-span-6 bg-white rounded-3xl p-6 shadow-card border border-slate-200 space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="text-base font-extrabold text-brand-text">
                      Crop-Wise Acreage Distribution
                    </h3>
                    <p className="text-xs text-slate-500">Actual cultivated acreage across {farms[0]?.name || "Farm"}</p>
                  </div>
                  <Badge variant="lime" size="sm">
                    {totalAcres} Acres Total
                  </Badge>
                </div>

                <div className="space-y-4">
                  {cropAreaList.map((item, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-slate-800">{item.crop}</span>
                        <span className="text-slate-500 font-mono">
                          {item.acres} Acres ({item.percentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            idx === 0
                              ? "bg-emerald-600"
                              : idx === 1
                              ? "bg-amber-500"
                              : "bg-purple-600"
                          }`}
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-600 leading-relaxed">
                  💡 <strong>Intercropping Ratio</strong>: Cotton is inter-spaced with pigeonpea borders (tur) for integrated pest deterrence, preserving 4.5 acres for certified soybean seed multiplication.
                </div>
              </div>

              {/* Expense Category Breakdown Preview */}
              <div className="lg:col-span-6 bg-white rounded-3xl p-6 shadow-card border border-slate-200 space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="text-base font-extrabold text-brand-text">
                      Expenditure by Category
                    </h3>
                    <p className="text-xs text-slate-500">Total recorded season spend: ₹{totalExpensesAmount.toLocaleString("en-IN")}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setActiveTab("expenses")}
                    className="text-xs"
                  >
                    View Ledger
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {categoryBreakdownList.slice(0, 6).map((cat) => (
                    <div key={cat.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-500 uppercase">{cat.name}</span>
                        {getCategoryIcon(cat.code)}
                      </div>
                      <div className="text-base font-black text-slate-900 font-mono">
                        ₹{cat.amount.toLocaleString("en-IN")}
                      </div>
                      <div className="text-[10px] text-slate-400 font-medium">
                        {cat.percentage}% of farm budget
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Field-wise Crop Distribution Table */}
            <div className="bg-white rounded-3xl p-6 shadow-card border border-slate-200 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Layers className="w-5 h-5 text-brand-primary" />
                  <h3 className="text-base font-extrabold text-brand-text">
                    Field-Wise Crop Distribution & Soil Properties
                  </h3>
                </div>
                <Link href="/dashboard/farmer/my-farm" className="text-xs font-bold text-brand-primary hover:underline">
                  Manage Fields
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase font-black tracking-wider text-[10px]">
                    <tr>
                      <th className="py-3 px-4 rounded-l-xl">Field Name</th>
                      <th className="py-3 px-4">Cultivated Crop</th>
                      <th className="py-3 px-4">Area (Acres)</th>
                      <th className="py-3 px-4">Soil Classification</th>
                      <th className="py-3 px-4">Irrigation Infrastructure</th>
                      <th className="py-3 px-4 rounded-r-xl">Organic Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {fields.map((fld) => (
                      <tr key={fld.id} className="hover:bg-slate-50 transition">
                        <td className="py-3.5 px-4 font-bold text-slate-900">
                          {fld.name}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                            {fld.currentCrop || "Fallow"}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold">
                          {fld.areaAcres} Acres
                        </td>
                        <td className="py-3.5 px-4 text-slate-600">
                          {fld.soilType || "Deep Black Clay (Regur)"}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="flex items-center gap-1.5">
                            <Droplets className="w-3.5 h-3.5 text-sky-500" />
                            {fld.irrigationMethod || "Inline Drip System"}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <Badge variant="lime" size="sm">
                            NPOP C1 Certified
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: EXPENSES LEDGER ================= */}
        {activeTab === "expenses" && (
          <div className="space-y-6">
            {/* Filter controls */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-slate-400" />
                  <span className="text-xs font-bold text-slate-700">Filter by:</span>
                </div>

                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                >
                  <option value="all">All Categories</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.code}>
                      {c.name}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedCrop}
                  onChange={(e) => setSelectedCrop(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                >
                  <option value="all">All Crops</option>
                  <option value="cotton">Cotton (कापूस)</option>
                  <option value="soybean">Soybean (सोयाबीन)</option>
                  <option value="turmeric">Turmeric (हळद)</option>
                </select>
              </div>

              <div className="text-xs font-bold text-slate-600">
                Showing <strong className="text-slate-900 font-mono">{filteredExpenses.length}</strong> expenses • Total:{" "}
                <strong className="text-brand-primary font-mono font-black">
                  ₹{filteredExpenses.reduce((s, e) => s + Number(e.amount), 0).toLocaleString("en-IN")}
                </strong>
              </div>
            </div>

            {/* Expenses Table */}
            <div className="bg-white rounded-3xl p-6 shadow-card border border-slate-200 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-extrabold text-brand-text">
                    Audited Farm Expenditure Log
                  </h3>
                  <p className="text-xs text-slate-500">Record all seed, fertilizer, machinery, labour, and irrigation costs</p>
                </div>

                <Button
                  size="sm"
                  variant="accent"
                  onClick={() => setShowExpenseModal(true)}
                  leftIcon={<PlusCircle className="w-4 h-4" />}
                >
                  New Expense
                </Button>
              </div>

              {filteredExpenses.length === 0 ? (
                <EmptyState
                  title="No farm expenses match criteria"
                  description="Record your seed purchases, tractor plowing, and labour charges to track cost of cultivation per acre."
                  actionLabel="Add Expense"
                  onAction={() => setShowExpenseModal(true)}
                />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 uppercase font-black tracking-wider text-[10px]">
                      <tr>
                        <th className="py-3 px-4 rounded-l-xl">Date</th>
                        <th className="py-3 px-4">Crop</th>
                        <th className="py-3 px-4">Category</th>
                        <th className="py-3 px-4">Quantity / Unit</th>
                        <th className="py-3 px-4">Vendor / Remarks</th>
                        <th className="py-3 px-4">Mode</th>
                        <th className="py-3 px-4">Amount</th>
                        <th className="py-3 px-4 rounded-r-xl text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                      {filteredExpenses.map((exp) => (
                        <tr key={exp.id} className="hover:bg-slate-50 transition">
                          <td className="py-3.5 px-4 font-mono font-bold text-slate-500 whitespace-nowrap">
                            {exp.expenseDate}
                          </td>
                          <td className="py-3.5 px-4 font-bold text-slate-900">
                            {exp.cropName}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 text-[11px] font-bold">
                              {getCategoryIcon(exp.categoryCode)}
                              <span className="capitalize">{exp.categoryCode.replace("_", " ")}</span>
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-mono text-slate-600">
                            {exp.quantity ? `${exp.quantity} ${exp.unit || ""}` : "—"}
                          </td>
                          <td className="py-3.5 px-4 max-w-xs">
                            <p className="font-bold text-slate-800 truncate">{exp.vendorName || "Direct"}</p>
                            <p className="text-[11px] text-slate-500 truncate">{exp.notes || ""}</p>
                          </td>
                          <td className="py-3.5 px-4">
                            <Badge variant="neutral" size="sm">
                              {exp.paymentMode.toUpperCase()}
                            </Badge>
                          </td>
                          <td className="py-3.5 px-4 font-mono font-black text-slate-900 text-sm whitespace-nowrap">
                            ₹{Number(exp.amount).toLocaleString("en-IN")}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => deleteFarmExpense(exp.id)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                              title="Delete expense entry"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= TAB 3: HARVEST HISTORY ================= */}
        {activeTab === "harvest" && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-slate-200 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-black text-brand-text">Harvest Yield History & Realized Revenue</h3>
                <p className="text-xs text-slate-500">
                  Recorded production volumes, APMC / Escrow benchmark rates, and quality grades.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="success" size="md">
                  Total Revenue: ₹{totalHarvestGrossRevenue.toLocaleString("en-IN")}
                </Badge>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase font-black tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4 rounded-l-xl">Crop & Variety</th>
                    <th className="py-3 px-4">Harvest Date</th>
                    <th className="py-3 px-4">Total Weight</th>
                    <th className="py-3 px-4">Quintals</th>
                    <th className="py-3 px-4">Quality Grade</th>
                    <th className="py-3 px-4">Rate / Quintal</th>
                    <th className="py-3 px-4 rounded-r-xl">Gross Realization</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {harvests.map((h) => {
                    const quintals = h.yieldKg / 100;
                    const gross = h.yieldKg * h.marketPricePerKg;

                    return (
                      <tr key={h.id} className="hover:bg-slate-50 transition">
                        <td className="py-3.5 px-4 font-bold text-slate-900">
                          {h.cropName}
                          <span className="block text-[11px] text-slate-400 font-normal">{h.notes}</span>
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-500">
                          {h.harvestDate}
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                          {h.yieldKg.toLocaleString()} kg
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-emerald-700">
                          {quintals.toFixed(1)} Qtl
                        </td>
                        <td className="py-3.5 px-4">
                          <Badge variant="lime" size="sm">
                            {h.grade}
                          </Badge>
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                          ₹{(h.marketPricePerKg * 100).toLocaleString()}
                        </td>
                        <td className="py-3.5 px-4 font-mono font-black text-slate-900 text-sm">
                          ₹{gross.toLocaleString("en-IN")}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= TAB 4: INPUTS, IRRIGATION & SOIL TRENDS ================= */}
        {activeTab === "soil_irrigation" && (
          <div className="space-y-8">
            {/* Multi-Year Soil Health Trajectory */}
            <div className="bg-white rounded-3xl p-6 shadow-card border border-slate-200 space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <FlaskConical className="w-5 h-5 text-brand-primary" />
                  <div>
                    <h3 className="text-base font-extrabold text-brand-text">
                      Multi-Year Soil Organic Carbon & Fertility Trends
                    </h3>
                    <p className="text-xs text-slate-500">Audited testing from PDKV Akola Soil Testing Laboratory</p>
                  </div>
                </div>
                <Badge variant="lime" size="sm">
                  Soil Health Index: 88/100
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-emerald-900">
                    <span>Organic Carbon (OC)</span>
                    <span className="font-mono text-emerald-700">+30.7% Improvement</span>
                  </div>
                  <div className="text-2xl font-black text-emerald-950 font-mono">0.68%</div>
                  <p className="text-[11px] text-emerald-800 leading-relaxed">
                    Increased from 0.52% (2024) to 0.68% (2026) through continuous cow-based Jeevamrutha and legume residue mulching.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-sky-50/60 border border-sky-200 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-sky-900">
                    <span>Available Nitrogen (N)</span>
                    <span className="font-mono text-sky-700">142 kg/ha</span>
                  </div>
                  <div className="text-2xl font-black text-sky-950 font-mono">142 kg/ha</div>
                  <p className="text-[11px] text-sky-800 leading-relaxed">
                    Currently in medium range for black soil. Foliar Potash and bio-nitrogen fixation (Rhizobium) applied for rabi chickpea.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-amber-900">
                    <span>Soil pH Level</span>
                    <span className="font-mono text-amber-700">7.4 pH</span>
                  </div>
                  <div className="text-2xl font-black text-amber-950 font-mono">7.4 (Neutral)</div>
                  <p className="text-[11px] text-amber-800 leading-relaxed">
                    Optimal neutral pH for nutrient bioavailability. Zero salt accumulation detected in deep root zones.
                  </p>
                </div>
              </div>
            </div>

            {/* Irrigation Delivery Ledger */}
            <div className="bg-white rounded-3xl p-6 shadow-card border border-slate-200 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Droplets className="w-5 h-5 text-sky-600" />
                  <h3 className="text-base font-extrabold text-brand-text">
                    Audited Irrigation Water Delivery History
                  </h3>
                </div>
                <Link href="/dashboard/farmer/devices" className="text-xs font-bold text-brand-primary hover:underline">
                  Smart Controllers
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Total Delivery Events</span>
                  <div className="text-xl font-black text-slate-900 font-mono mt-1">
                    {(data.irrigationEvents || []).length} Hydration Runs
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">Automated solenoid valve triggers</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Delivered Water Volume</span>
                  <div className="text-xl font-black text-slate-900 font-mono mt-1">
                    {(data.irrigationEvents || []).reduce((s, e) => s + Number(e.waterVolumeLiters), 0).toLocaleString()} Liters
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">Solar Tube Well & Farm Pond</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Water Efficiency Index</span>
                  <div className="text-xl font-black text-emerald-700 font-mono mt-1">
                    94.2% Efficiency
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">Closed inline drip emitters</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Record Farm Expense */}
        <Modal
          isOpen={showExpenseModal}
          onClose={() => setShowExpenseModal(false)}
          title="Record Agricultural Expense"
          description="Log costs for seeds, fertilizers, labour, equipment rental, or irrigation."
        >
          <form onSubmit={handleAddExpense} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Cultivated Crop *
                </label>
                <select
                  value={expCrop}
                  onChange={(e) => setExpCrop(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold"
                >
                  <option value="Cotton (कापूस)">Cotton (कापूस)</option>
                  <option value="Soybean (सोयाबीन)">Soybean (सोयाबीन)</option>
                  <option value="Turmeric (हळद)">Turmeric (हळद)</option>
                  <option value="Gram / Harbhara (हरभरा)">Gram / Harbhara (हरभरा)</option>
                  <option value="General Farm">General Farm Overhead</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Expense Category *
                </label>
                <select
                  value={expCategory}
                  onChange={(e) => setExpCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.code}>
                      {cat.name} ({cat.nameMarathi})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Total Amount (₹) *"
                type="number"
                placeholder="e.g. 4200"
                value={expAmount}
                onChange={(e) => setExpAmount(e.target.value)}
                required
              />

              <Input
                label="Date Incurred *"
                type="date"
                value={expDate}
                onChange={(e) => setExpDate(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="Quantity"
                type="number"
                placeholder="e.g. 12"
                value={expQuantity}
                onChange={(e) => setExpQuantity(e.target.value)}
              />

              <Input
                label="Unit"
                placeholder="days / bags / trips"
                value={expUnit}
                onChange={(e) => setExpUnit(e.target.value)}
              />

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Payment Mode
                </label>
                <select
                  value={expPaymentMode}
                  onChange={(e) => setExpPaymentMode(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold"
                >
                  <option value="upi">UPI / PhonePe / GPay</option>
                  <option value="cash">Cash (रोख)</option>
                  <option value="bank_transfer">Bank Transfer / NEFT</option>
                  <option value="kcc_loan">Kisan Credit Card (KCC)</option>
                </select>
              </div>
            </div>

            <Input
              label="Vendor / Worker / Supplier Name"
              placeholder="e.g. Mahalaxmi Krishi Seva Kendra or Labour Toli"
              value={expVendor}
              onChange={(e) => setExpVendor(e.target.value)}
            />

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Receipt Notes & Description
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Weeding Plot A black clay soil with 12 labourers."
                value={expNotes}
                onChange={(e) => setExpNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-primary"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowExpenseModal(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Save Expense Record
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </DashboardShell>
  );
}

