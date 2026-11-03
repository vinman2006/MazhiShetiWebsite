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
import { EmptyState } from "@/components/ui/EmptyState";
import {
  ShieldCheck,
  Activity,
  Database,
  Users,
  Server,
  FileCheck2,
  AlertCircle,
  Clock,
  CheckCircle2,
  Cpu,
  RefreshCw,
  LayoutDashboard,
  Sprout,
  ShoppingBag,
  Wrench,
  Landmark,
  Stethoscope,
  Filter,
  Search,
  PlusCircle,
  Megaphone,
  Layers,
  AlertTriangle,
  Lock,
  Unlock,
  Eye,
  Check,
  X,
  Trash2,
  Tag,
  ArrowRight,
} from "lucide-react";

export default function AdminDashboard() {
  const {
    data,
    toggleUserStatus,
    moderateListing,
    createAnnouncement,
    resolveContentReport,
    updatePlatformCategory,
  } = useAppState();

  const [activeTab, setActiveTab] = useState<
    "overview" | "users" | "moderation" | "categories" | "announcements" | "audit_logs"
  >("overview");

  // User tab filter state
  const [userRoleFilter, setUserRoleFilter] = useState<string>("all");
  const [userSearchQuery, setUserSearchQuery] = useState<string>("");

  // Moderation tab state
  const [moderationTab, setModerationTab] = useState<"produce" | "equipment" | "reports">("produce");
  const [resolveReportModal, setResolveReportModal] = useState<any>(null);
  const [resolutionNotes, setResolutionNotes] = useState<string>("");

  // Announcement form modal
  const [showAnnouncementModal, setShowAnnouncementModal] = useState<boolean>(false);
  const [ancTitle, setAncTitle] = useState<string>("");
  const [ancTitleMr, setAncTitleMr] = useState<string>("");
  const [ancMessage, setAncMessage] = useState<string>("");
  const [ancCategory, setAncCategory] = useState<any>("subsidy");
  const [ancPriority, setAncPriority] = useState<any>("normal");
  const [ancTargetRoles, setAncTargetRoles] = useState<any>("all");
  const [ancActiveUntil, setAncActiveUntil] = useState<string>("2026-11-30");

  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setActionSuccessMsg(msg);
    setTimeout(() => setActionSuccessMsg(null), 3500);
  };

  const users = data.users || [];
  const produceListings = data.produceListings || [];
  const equipment = data.equipment || [];
  const loans = data.loanApplications || [];
  const reports = data.contentReports || [];
  const announcements = data.systemAnnouncements || [];
  const categories = data.platformCategories || [];

  // Metrics
  const farmersCount = users.filter((u) => u.role === "farmer").length;
  const providersCount = users.filter((u) => u.role === "provider" || u.role === "equipment_provider").length;
  const buyersCount = users.filter((u) => u.role === "buyer").length;
  const expertsCount = users.filter((u) => u.role === "expert").length;
  const bankersCount = users.filter((u) => u.role === "banker").length;

  const totalSanctionedCredit = loans
    .filter((l) => l.status === "credit_approved" || l.status === "disbursed")
    .reduce((sum, l) => sum + (l.sanctionedAmount || l.requestedAmount || 0), 0);

  const pendingReportsCount = reports.filter((r) => r.status === "pending" || r.status === "investigating").length;

  // Filtered Users
  const filteredUsers = users.filter((u) => {
    if (userRoleFilter !== "all" && u.role !== userRoleFilter) return false;
    if (userSearchQuery) {
      const q = userSearchQuery.toLowerCase();
      const matchName = u.fullName.toLowerCase().includes(q);
      const matchEmail = u.email.toLowerCase().includes(q);
      const matchDistrict = (u.district || "").toLowerCase().includes(q);
      if (!matchName && !matchEmail && !matchDistrict) return false;
    }
    return true;
  });

  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ancTitle || !ancMessage) return;

    createAnnouncement({
      title: ancTitle,
      titleMarathi: ancTitleMr || ancTitle,
      message: ancMessage,
      category: ancCategory,
      priority: ancPriority,
      targetRoles: ancTargetRoles,
      isActive: true,
      activeUntil: ancActiveUntil,
      createdByUserId: "usr_admin_01",
    });

    setShowAnnouncementModal(false);
    setAncTitle("");
    setAncTitleMr("");
    setAncMessage("");
    showToast("System announcement broadcasted to target participants!");
  };

  const handleResolveReport = (resolution: "resolved_flagged" | "dismissed") => {
    if (!resolveReportModal) return;
    resolveContentReport(resolveReportModal.id, resolution, resolutionNotes || "Verified by Administrator.");
    setResolveReportModal(null);
    setResolutionNotes("");
    showToast(`Content moderation ticket #${resolveReportModal.id} ${resolution === "resolved_flagged" ? "resolved with sanction" : "dismissed"}.`);
  };

  const auditEvents = [
    {
      id: "aud_01",
      action: "TELEMETRY_INGESTION_SYNC",
      user: "System Daemon (Sensor #MS-PRO-8841)",
      role: "IoT Gateway",
      entity: "soil_telemetry",
      time: "2 mins ago",
      status: "SUCCESS",
    },
    {
      id: "aud_02",
      action: "PRESCRIPTION_DISPATCH",
      user: "Dr. Anjali Deshmukh",
      role: "expert",
      entity: "consultations #cons_01",
      time: "42 mins ago",
      status: "VERIFIED",
    },
    {
      id: "aud_03",
      action: "PRODUCE_ESCROW_INITIATION",
      user: "Mahavishnu Agro (Rajesh)",
      role: "buyer",
      entity: "marketplace_orders #po_01",
      time: "2 hours ago",
      status: "ESCROW_LOCKED",
    },
    {
      id: "aud_04",
      action: "KCC_CREDIT_UNDERWRITING",
      user: "Bank of Maharashtra (Rajesh D.)",
      role: "banker",
      entity: "loan_applications #app_kcc_01",
      time: "5 hours ago",
      status: "APPROVED",
    },
    {
      id: "aud_05",
      action: "DRONE_FLEET_DISPATCH",
      user: "Mahalaxmi CHC (Vilasrao)",
      role: "provider",
      entity: "equipment_listings #equip_02",
      time: "Yesterday",
      status: "DISPATCHED",
    },
    {
      id: "aud_06",
      action: "SECURITY_AUDIT_VERIFIED",
      user: "Root Security Scanner",
      role: "admin",
      entity: "system_auth_tokens",
      time: "Yesterday",
      status: "VERIFIED",
    },
  ];

  const navItems = [
    { label: "Governance & Metrics", href: "/dashboard/admin", icon: LayoutDashboard },
    { label: "IoT Telemetry Grid", href: "/sensors", icon: Activity },
    { label: "Produce Mandi", href: "/marketplace", icon: ShoppingBag },
    { label: "Machinery Fleet", href: "/rentals", icon: Wrench },
    { label: "Credit Workbench", href: "/finance", icon: Landmark },
    { label: "Agronomist Clinic", href: "/advisory", icon: Stethoscope },
  ];

  return (
    <DashboardShell
      navItems={navItems}
      roleTitle="Platform Administration & Governance"
      roleSubtitle="Superadmin Console • Mazhi Sheti System"
      roleIcon={ShieldCheck}
    >
      <div className="space-y-8">
        {/* Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-brand-dark rounded-3xl p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-lime/20 text-brand-lime text-xs font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Centralized Platform Control & RBAC Governance</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                Administration & Ecosystem Console
              </h1>
              <p className="text-xs text-stone-200 max-w-2xl leading-relaxed">
                Oversee platform participants, enforce listing moderation, dispatch system-wide regulatory announcements, manage taxonomies, and audit state transactions.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="accent"
                size="md"
                onClick={() => setShowAnnouncementModal(true)}
                leftIcon={<Megaphone className="w-4 h-4" />}
              >
                Broadcast Announcement
              </Button>
            </div>
          </div>
        </div>

        {/* Success Toast */}
        {actionSuccessMsg && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2 shadow-sm animate-slideDown">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{actionSuccessMsg}</span>
          </div>
        )}

        {/* 4 Core Administration Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            label="Total Platform Users"
            value={users.length}
            unit="Accounts"
            change={`${farmersCount} Farmers • ${providersCount} Providers`}
            trend="up"
            icon={<Users className="w-5 h-5 text-indigo-700" />}
            iconBg="bg-indigo-100"
          />
          <StatCard
            label="Active Listings"
            value={produceListings.length + equipment.length}
            unit="Lots & Fleet"
            change={`${produceListings.length} Produce • ${equipment.length} Machinery`}
            trend="up"
            icon={<ShoppingBag className="w-5 h-5 text-emerald-700" />}
            iconBg="bg-emerald-100"
          />
          <StatCard
            label="Sanctioned Agri-Credit"
            value={`₹${(totalSanctionedCredit / 100000).toFixed(1)}L`}
            change="Across KCC & PMFBY"
            trend="up"
            icon={<Landmark className="w-5 h-5 text-sky-700" />}
            iconBg="bg-sky-100"
          />
          <StatCard
            label="Open Moderation Reports"
            value={pendingReportsCount}
            unit="Pending"
            change={pendingReportsCount > 0 ? "Action Required" : "Queue Clear"}
            trend={pendingReportsCount > 0 ? "down" : "neutral"}
            icon={<AlertCircle className="w-5 h-5 text-rose-700" />}
            iconBg="bg-rose-100"
          />
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 border-b border-slate-200 pb-3 overflow-x-auto">
          {[
            { id: "overview", label: "Overview & Health" },
            { id: "users", label: `User Directory (${users.length})` },
            { id: "moderation", label: `Moderation & Listings (${reports.length} Reports)` },
            { id: "categories", label: `Platform Taxonomies (${categories.length})` },
            { id: "announcements", label: `Announcements Broadcast (${announcements.length})` },
            { id: "audit_logs", label: `System Audit Logs (${auditEvents.length})` },
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

        {/* ================= TAB 1: OVERVIEW ================= */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* User Roles Breakdown */}
              <div className="lg:col-span-7 bg-white rounded-3xl p-6 shadow-card border border-slate-200 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="text-base font-extrabold text-brand-text">
                    Participant Distribution by Role
                  </h3>
                  <Badge variant="lime" size="sm">
                    All Roles Authorized
                  </Badge>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-100">
                    <span className="text-[10px] font-bold text-emerald-800 uppercase">Farmers</span>
                    <div className="text-xl font-black text-emerald-950 font-mono mt-1">{farmersCount}</div>
                    <p className="text-[10px] text-emerald-700">Vidarbha & Marathwada</p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-indigo-50 border border-indigo-100">
                    <span className="text-[10px] font-bold text-indigo-800 uppercase">CHC Providers</span>
                    <div className="text-xl font-black text-indigo-950 font-mono mt-1">{providersCount}</div>
                    <p className="text-[10px] text-indigo-700">Tractors & Drones</p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-100">
                    <span className="text-[10px] font-bold text-amber-800 uppercase">Produce Buyers</span>
                    <div className="text-xl font-black text-amber-950 font-mono mt-1">{buyersCount}</div>
                    <p className="text-[10px] text-amber-700">APMC & Institutional</p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-100">
                    <span className="text-[10px] font-bold text-blue-800 uppercase">Agri-Experts</span>
                    <div className="text-xl font-black text-blue-950 font-mono mt-1">{expertsCount}</div>
                    <p className="text-[10px] text-blue-700">PDKV & KVK Akola</p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-100">
                    <span className="text-[10px] font-bold text-sky-800 uppercase">Bank Underwriters</span>
                    <div className="text-xl font-black text-sky-950 font-mono mt-1">{bankersCount}</div>
                    <p className="text-[10px] text-sky-700">Bank of Maharashtra</p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-100 border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-800 uppercase">Administrators</span>
                    <div className="text-xl font-black text-slate-950 font-mono mt-1">1</div>
                    <p className="text-[10px] text-slate-600">Superadmin Scope</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-600 leading-relaxed">
                  🛡️ <strong>RBAC Policy Enforcement Active</strong>: Cross-portal access without authenticated role credentials is dynamically blocked with HTTP 403 Forbidden screens.
                </div>
              </div>

              {/* Moderation & Announcements Snapshot */}
              <div className="lg:col-span-5 bg-white rounded-3xl p-6 shadow-card border border-slate-200 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="text-base font-extrabold text-brand-text">
                    Active Announcements
                  </h3>
                  <Link href="#announcements" onClick={() => setActiveTab("announcements")} className="text-xs font-bold text-brand-primary hover:underline">
                    View All
                  </Link>
                </div>

                <div className="space-y-3">
                  {announcements.slice(0, 2).map((anc) => (
                    <div key={anc.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <Badge variant="lime" size="sm">
                          {anc.category.toUpperCase()}
                        </Badge>
                        <span className="text-[10px] text-slate-400 font-mono">{anc.createdAt}</span>
                      </div>
                      <p className="font-bold text-slate-900">{anc.title}</p>
                      <p className="text-slate-600 text-[11px] line-clamp-2">{anc.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: USER DIRECTORY ================= */}
        {activeTab === "users" && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-slate-500">Filter Role:</span>
                {[
                  { id: "all", label: `All (${users.length})` },
                  { id: "farmer", label: `Farmers (${farmersCount})` },
                  { id: "provider", label: `Providers (${providersCount})` },
                  { id: "buyer", label: `Buyers (${buyersCount})` },
                  { id: "expert", label: `Experts (${expertsCount})` },
                  { id: "banker", label: `Bankers (${bankersCount})` },
                ].map((rf) => (
                  <button
                    key={rf.id}
                    onClick={() => setUserRoleFilter(rf.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                      userRoleFilter === rf.id
                        ? "bg-brand-primary text-white shadow-sm"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {rf.label}
                  </button>
                ))}
              </div>

              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search user, village, phone..."
                  value={userSearchQuery}
                  onChange={(e) => setUserSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-1.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-primary w-full md:w-64"
                />
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-card border border-slate-200 space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase font-black tracking-wider text-[10px]">
                    <tr>
                      <th className="py-3 px-4 rounded-l-xl">User Name & ID</th>
                      <th className="py-3 px-4">Role</th>
                      <th className="py-3 px-4">Contact</th>
                      <th className="py-3 px-4">Location / Org</th>
                      <th className="py-3 px-4">Account Status</th>
                      <th className="py-3 px-4 rounded-r-xl text-right">Admin Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {filteredUsers.map((u: any) => {
                      const isSuspended = u.status === "suspended";
                      return (
                        <tr key={u.id} className="hover:bg-slate-50 transition">
                          <td className="py-3.5 px-4 font-bold text-slate-900">
                            {u.fullName}
                            <span className="block text-[10px] text-slate-400 font-mono">{u.id}</span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 text-[11px] font-bold uppercase">
                              {u.role}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-slate-600 font-mono">
                            {u.phone}
                            <span className="block text-[11px] text-slate-400">{u.email}</span>
                          </td>
                          <td className="py-3.5 px-4 text-slate-600">
                            {u.organizationName || `${u.village || ""}, ${u.district || "Maharashtra"}`}
                          </td>
                          <td className="py-3.5 px-4">
                            <Badge variant={isSuspended ? "danger" : "success"} size="sm">
                              {isSuspended ? "SUSPENDED" : "ACTIVE VERIFIED"}
                            </Badge>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <Button
                              size="sm"
                              variant={isSuspended ? "primary" : "outline"}
                              onClick={() => {
                                toggleUserStatus(u.id);
                                showToast(`User ${u.fullName} is now ${isSuspended ? "ACTIVATED" : "SUSPENDED"}.`);
                              }}
                              className="text-xs"
                            >
                              {isSuspended ? "Activate User" : "Suspend Account"}
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 3: MODERATION & LISTINGS ================= */}
        {activeTab === "moderation" && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
              {[
                { id: "produce", label: `Produce Lots (${produceListings.length})` },
                { id: "equipment", label: `Machinery Fleet (${equipment.length})` },
                { id: "reports", label: `Reported Content Queue (${reports.length})` },
              ].map((mt) => (
                <button
                  key={mt.id}
                  onClick={() => setModerationTab(mt.id as any)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                    moderationTab === mt.id
                      ? "bg-brand-primary text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {mt.label}
                </button>
              ))}
            </div>

            {/* Produce Lots Table */}
            {moderationTab === "produce" && (
              <div className="bg-white rounded-3xl p-6 shadow-card border border-slate-200 space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 uppercase font-black tracking-wider text-[10px]">
                      <tr>
                        <th className="py-3 px-4 rounded-l-xl">Listing ID & Crop</th>
                        <th className="py-3 px-4">Farmer / Seller</th>
                        <th className="py-3 px-4">Lot Size (Quintals)</th>
                        <th className="py-3 px-4">Rate / Quintal</th>
                        <th className="py-3 px-4">Quality Grade</th>
                        <th className="py-3 px-4">Availability</th>
                        <th className="py-3 px-4 rounded-r-xl text-right">Moderation Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                      {produceListings.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-50 transition">
                          <td className="py-3.5 px-4 font-bold text-slate-900">
                            {p.cropName} ({p.variety})
                            <span className="block text-[10px] text-slate-400 font-mono">{p.id}</span>
                          </td>
                          <td className="py-3.5 px-4">{p.farmerName}</td>
                          <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                            {p.quantity} {p.unit || "Qtl"}
                          </td>
                          <td className="py-3.5 px-4 font-mono font-bold text-emerald-700">
                            ₹{p.pricePerUnit.toLocaleString()}
                          </td>
                          <td className="py-3.5 px-4">
                            <Badge variant="lime" size="sm">{p.qualityGrade}</Badge>
                          </td>
                          <td className="py-3.5 px-4">
                            <Badge variant={p.availabilityStatus === "available" ? "success" : "neutral"} size="sm">
                              {p.availabilityStatus.toUpperCase()}
                            </Badge>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {p.availabilityStatus === "available" ? (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    moderateListing(p.id, "delist", "produce");
                                    showToast(`Listing ${p.id} delisted from public marketplace.`);
                                  }}
                                  className="text-[11px] text-rose-600 border-rose-200 hover:bg-rose-50"
                                >
                                  Delist Lot
                                </Button>
                              ) : (
                                <Button
                                  size="sm"
                                  variant="primary"
                                  onClick={() => {
                                    moderateListing(p.id, "approve", "produce");
                                    showToast(`Listing ${p.id} approved and made visible.`);
                                  }}
                                  className="text-[11px]"
                                >
                                  Approve Lot
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Equipment Fleet Table */}
            {moderationTab === "equipment" && (
              <div className="bg-white rounded-3xl p-6 shadow-card border border-slate-200 space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 uppercase font-black tracking-wider text-[10px]">
                      <tr>
                        <th className="py-3 px-4 rounded-l-xl">Machine & ID</th>
                        <th className="py-3 px-4">Category</th>
                        <th className="py-3 px-4">Provider Hub</th>
                        <th className="py-3 px-4">Rates (Hour / Day)</th>
                        <th className="py-3 px-4">Operator</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 rounded-r-xl text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                      {equipment.map((eq) => (
                        <tr key={eq.id} className="hover:bg-slate-50 transition">
                          <td className="py-3.5 px-4 font-bold text-slate-900">
                            {eq.title}
                            <span className="block text-[10px] text-slate-400 font-mono">{eq.id} • {eq.horsepowerOrCapacity}</span>
                          </td>
                          <td className="py-3.5 px-4">{eq.category}</td>
                          <td className="py-3.5 px-4 text-slate-600">{eq.providerName}</td>
                          <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                            ₹{eq.hourlyRate}/hr • ₹{eq.dailyRate}/day
                          </td>
                          <td className="py-3.5 px-4">
                            {eq.includesOperator ? "Included" : "Self-driven"}
                          </td>
                          <td className="py-3.5 px-4">
                            <Badge variant={eq.isAvailable ? "success" : "neutral"} size="sm">
                              {eq.isAvailable ? "AVAILABLE" : "MAINTENANCE"}
                            </Badge>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                moderateListing(eq.id, eq.isAvailable ? "flag" : "approve", "equipment");
                                showToast(`Machine ${eq.id} availability updated.`);
                              }}
                              className="text-[11px]"
                            >
                              {eq.isAvailable ? "Set Maintenance" : "Approve Available"}
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Reports Queue */}
            {moderationTab === "reports" && (
              <div className="bg-white rounded-3xl p-6 shadow-card border border-slate-200 space-y-4">
                <div className="space-y-3">
                  {reports.map((rep) => (
                    <div
                      key={rep.id}
                      className={`p-4 rounded-2xl border text-xs space-y-2 ${
                        rep.status === "pending" || rep.status === "investigating"
                          ? "bg-rose-50/40 border-rose-200"
                          : "bg-slate-50 border-slate-200"
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <Badge variant={rep.status === "resolved_flagged" ? "success" : "warning"} size="sm">
                            {rep.status.toUpperCase()}
                          </Badge>
                          <span className="font-bold text-slate-800">
                            Target Entity: <strong className="font-mono text-slate-900">{rep.entityType} ({rep.entityId})</strong>
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">{rep.createdAt}</span>
                      </div>

                      <p className="text-slate-700 leading-relaxed">
                        <strong>Reason:</strong> {rep.reason}
                      </p>

                      {rep.resolutionNotes && (
                        <p className="text-emerald-800 bg-emerald-100/50 p-2 rounded-xl text-[11px]">
                          <strong>Resolution:</strong> {rep.resolutionNotes}
                        </p>
                      )}

                      {rep.status !== "resolved_flagged" && rep.status !== "dismissed" && (
                        <div className="flex items-center gap-2 pt-2">
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={() => setResolveReportModal(rep)}
                            className="text-xs"
                          >
                            Resolve / Take Action
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 4: PLATFORM CATEGORIES ================= */}
        {activeTab === "categories" && (
          <div className="bg-white rounded-3xl p-6 shadow-card border border-slate-200 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-extrabold text-brand-text">
                  Standard Platform Taxonomies
                </h3>
                <p className="text-xs text-slate-500">Crops, equipment categories, and expense heads used platform-wide</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {categories.map((c) => (
                <div key={c.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                      {c.categoryType.replace("_", " ")}
                    </span>
                    <Badge variant={c.isActive ? "success" : "neutral"} size="sm">
                      {c.isActive ? "ACTIVE" : "DISABLED"}
                    </Badge>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">{c.name}</h4>
                  <p className="text-[11px] text-slate-500">{c.nameMarathi}</p>
                  <div className="pt-2">
                    <button
                      onClick={() => {
                        updatePlatformCategory(c.id, !c.isActive);
                        showToast(`Taxonomy ${c.name} ${!c.isActive ? "enabled" : "disabled"}.`);
                      }}
                      className="text-[11px] font-bold text-brand-primary hover:underline"
                    >
                      {c.isActive ? "Deactivate" : "Activate"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 5: SYSTEM ANNOUNCEMENTS ================= */}
        {activeTab === "announcements" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200">
              <div>
                <h3 className="text-sm font-black text-brand-text">Platform Broadcast Announcements</h3>
                <p className="text-xs text-slate-500">Announcements appear in farmer and participant notification bars</p>
              </div>
              <Button
                variant="accent"
                size="sm"
                onClick={() => setShowAnnouncementModal(true)}
                leftIcon={<PlusCircle className="w-4 h-4" />}
              >
                Create Announcement
              </Button>
            </div>

            <div className="space-y-3">
              {announcements.map((anc) => (
                <div key={anc.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="lime" size="sm">
                        {anc.category.toUpperCase()}
                      </Badge>
                      <Badge variant="neutral" size="sm">
                        Target: {anc.targetRoles.toUpperCase()}
                      </Badge>
                      {anc.priority === "high" && (
                        <Badge variant="danger" size="sm">HIGH PRIORITY</Badge>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">
                      Active until: {anc.activeUntil || "Indefinite"} • Posted {anc.createdAt}
                    </span>
                  </div>

                  <h4 className="text-sm font-black text-slate-900">{anc.title}</h4>
                  <p className="text-xs font-bold text-slate-600">{anc.titleMarathi}</p>
                  <p className="text-xs text-slate-600 leading-relaxed">{anc.message}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 6: AUDIT LOGS ================= */}
        {activeTab === "audit_logs" && (
          <div className="bg-white rounded-3xl p-6 shadow-card border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-extrabold text-brand-text">
                Audited State Transactions & System Ledger
              </h3>
              <Badge variant="neutral" size="sm">Immutable Ledger</Badge>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase font-black tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4 rounded-l-xl">Action Type</th>
                    <th className="py-3 px-4">Operator / Actor</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Entity Reference</th>
                    <th className="py-3 px-4">Timestamp</th>
                    <th className="py-3 px-4 rounded-r-xl text-right">Result</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {auditEvents.map((evt) => (
                    <tr key={evt.id} className="hover:bg-slate-50 transition">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                        {evt.action}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-800">{evt.user}</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold uppercase">
                          {evt.role}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-600">{evt.entity}</td>
                      <td className="py-3.5 px-4 text-slate-400">{evt.time}</td>
                      <td className="py-3.5 px-4 text-right">
                        <Badge variant="success" size="sm">{evt.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal: Broadcast Announcement */}
        <Modal
          isOpen={showAnnouncementModal}
          onClose={() => setShowAnnouncementModal(false)}
          title="Broadcast Platform Announcement"
          description="Dispatch high-priority communications or regulatory updates to farmers and participants."
        >
          <form onSubmit={handleCreateAnnouncement} className="space-y-4">
            <Input
              label="Announcement Title (English) *"
              placeholder="e.g. Maharashtra Solar Pump Grant Portal Open"
              value={ancTitle}
              onChange={(e) => setAncTitle(e.target.value)}
              required
            />

            <Input
              label="Announcement Title (मराठी)"
              placeholder="उदा. कुसुम-ब सौर कृषी पंप अर्ज सुरू"
              value={ancTitleMr}
              onChange={(e) => setAncTitleMr(e.target.value)}
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                <select
                  value={ancCategory}
                  onChange={(e) => setAncCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold"
                >
                  <option value="subsidy">Government Subsidy</option>
                  <option value="regulatory">Regulatory & APMC</option>
                  <option value="weather_alert">Weather Alert</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="general">General Broadcast</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Priority</label>
                <select
                  value={ancPriority}
                  onChange={(e) => setAncPriority(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold"
                >
                  <option value="normal">Normal</option>
                  <option value="high">High Priority</option>
                  <option value="urgent">Urgent Alarm</option>
                  <option value="low">Low Notice</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Target Roles</label>
                <select
                  value={ancTargetRoles}
                  onChange={(e) => setAncTargetRoles(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold"
                >
                  <option value="all">All Platform Users</option>
                  <option value="farmer">Farmers Only</option>
                  <option value="provider">Equipment Providers</option>
                  <option value="buyer">Buyers Only</option>
                  <option value="banker">Bank Representatives</option>
                </select>
              </div>
            </div>

            <Input
              label="Active Until (Expiration Date)"
              type="date"
              value={ancActiveUntil}
              onChange={(e) => setAncActiveUntil(e.target.value)}
            />

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Announcement Message *
              </label>
              <textarea
                rows={3}
                placeholder="Full details of the scheme, procedure, or maintenance window..."
                value={ancMessage}
                onChange={(e) => setAncMessage(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-primary"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <Button type="button" variant="ghost" onClick={() => setShowAnnouncementModal(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Broadcast Now
              </Button>
            </div>
          </form>
        </Modal>

        {/* Modal: Resolve Moderation Report */}
        <Modal
          isOpen={!!resolveReportModal}
          onClose={() => setResolveReportModal(null)}
          title="Resolve Moderation Ticket"
          description={`Report #${resolveReportModal?.id} on ${resolveReportModal?.entityType} (${resolveReportModal?.entityId})`}
        >
          <div className="space-y-4">
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs space-y-1">
              <span className="font-bold text-rose-900">Report Reason:</span>
              <p className="text-slate-700">{resolveReportModal?.reason}</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Resolution Notes & Corrective Action *
              </label>
              <textarea
                rows={3}
                placeholder="e.g. Conducted lab verification. Issued warning to vendor. Lot delisted."
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-primary"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleResolveReport("dismissed")}
              >
                Dismiss Report
              </Button>
              <Button
                type="button"
                variant="primary"
                onClick={() => handleResolveReport("resolved_flagged")}
              >
                Confirm Resolution
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </DashboardShell>
  );
}
