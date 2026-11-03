"use client";

import React from "react";
import Link from "next/link";
import { useAppState } from "@/lib/store";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Badge } from "@/components/ui/Badge";
import { StatCard } from "@/components/ui/Card";
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
} from "lucide-react";

export default function AdminDashboard() {
  const { data } = useAppState();

  const auditEvents = [
    {
      id: "aud_01",
      action: "TELEMETRY_INGESTION_SYNC",
      user: "System Daemon (Sensor #MS-PRO-8841)",
      role: "IoT Gateway",
      entity: "soil_telemetry",
      time: "Just now",
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
      user: "Rajesh Khandelwal",
      role: "buyer",
      entity: "marketplace_listings #prod_01",
      time: "2 hours ago",
      status: "ESCROW_LOCKED",
    },
    {
      id: "aud_04",
      action: "KCC_CREDIT_UNDERWRITING",
      user: "Sunita Gokhale",
      role: "banker",
      entity: "financial_applications #app_kcc_01",
      time: "5 hours ago",
      status: "APPROVED",
    },
    {
      id: "aud_05",
      action: "DRONE_FLEET_DISPATCH",
      user: "Vilasrao Patil",
      role: "provider",
      entity: "equipment_listings #equip_02",
      time: "Yesterday",
      status: "DISPATCHED",
    },
  ];

  const navItems = [
    { label: "Governance & Metrics", href: "/dashboard/admin", icon: LayoutDashboard },
    { label: "IoT Telemetry Grid", href: "/sensors", icon: Activity },
    { label: "Return to Website", href: "/", icon: Sprout },
  ];

  return (
    <DashboardShell
      navItems={navItems}
      roleTitle="Platform Governance"
      roleSubtitle="सिस्टम प्रशासन व सुरक्षा"
      roleIcon={ShieldCheck}
    >
      <div className="space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-stone-950 via-stone-900 to-stone-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-400 text-xs font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>प्रणाली प्रशासन व सुरक्षा नियंत्रण • Platform Governance & Compliance</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                Mazhi Sheti Enterprise Console
              </h1>
              <p className="text-xs text-stone-300">
                Monitoring multi-tenant agricultural ecosystem, role authorization, and audit trail.
              </p>
            </div>

            <Badge variant="lime" dot>
              All Services Operational
            </Badge>
          </div>
        </div>

        {/* 4 Quantitative Status Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            label="Ecosystem Stakeholders"
            value={data.users.length}
            subtext="Across 6 verified role tiers"
            icon={<Users className="w-5 h-5 text-stone-700" />}
            iconBg="bg-slate-100"
          />
          <StatCard
            label="Active Soil Sentinels"
            value={data.sensors.length}
            subtext="Live telemetry sync every 15m"
            icon={<Cpu className="w-5 h-5 text-emerald-700" />}
            iconBg="bg-emerald-100"
          />
          <StatCard
            label="Database Store"
            value="Neon DB"
            subtext="PostgreSQL ACID Compliant"
            icon={<Database className="w-5 h-5 text-sky-700" />}
            iconBg="bg-sky-100"
          />
          <StatCard
            label="Auth & RBAC"
            value="Clerk Ready"
            subtext="Protected role boundaries"
            icon={<ShieldCheck className="w-5 h-5 text-purple-700" />}
            iconBg="bg-purple-100"
          />
        </div>

        {/* Real-time System Audit Trail */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-slate-200 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-black text-brand-text">Immutable Audit Trail & Compliance Log</h3>
              <p className="text-xs text-slate-500">
                Detailed ledger recording financial events, medical prescriptions, and sensor sync.
              </p>
            </div>
            <Badge variant="neutral">Audit Hash Verified</Badge>
          </div>

          <div className="divide-y divide-slate-100">
            {auditEvents.map((evt) => (
              <div key={evt.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                      {evt.action}
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="font-semibold text-slate-700">{evt.entity}</span>
                  </div>
                  <p className="text-slate-500">
                    Initiated by: <strong className="text-slate-800">{evt.user}</strong> ({evt.role})
                  </p>
                </div>

                <div className="flex items-center gap-4 text-right">
                  <span className="text-[11px] text-slate-400 font-mono">{evt.time}</span>
                  <Badge variant="success" size="sm">{evt.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
