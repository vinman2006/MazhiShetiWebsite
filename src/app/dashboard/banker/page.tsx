"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAppState } from "@/lib/store";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  Landmark,
  CheckCircle2,
  Clock,
  FileCheck,
  AlertCircle,
  TrendingUp,
  DollarSign,
  ShieldCheck,
  User,
  ArrowRight,
  LayoutDashboard,
  Activity,
} from "lucide-react";

export default function BankerDashboard() {
  const { data, updateFinanceStatus } = useAppState();
  const [selectedAppId, setSelectedAppId] = useState<string>(data.financialApplications[0]?.id || "");
  const [successNote, setSuccessNote] = useState("");

  const banker = data.users.find((u) => u.role === "banker") || data.users[4];
  const applications = data.financialApplications;
  const currentApp = applications.find((a) => a.id === selectedAppId) || applications[0];

  const handleStatusChange = (status: "approved" | "disbursed" | "under_scrutiny" | "rejected") => {
    if (!currentApp) return;
    updateFinanceStatus(currentApp.id, status);
    setSuccessNote(`Application #${currentApp.id} status updated to ${status.toUpperCase()} successfully.`);
    setTimeout(() => setSuccessNote(""), 4000);
  };

  const navItems = [
    { label: "Loan Docket", href: "/dashboard/banker", icon: LayoutDashboard, badge: `${applications.length}` },
    { label: "Public Finance Desk", href: "/finance", icon: Landmark },
    { label: "Soil Health Audit", href: "/sensors", icon: Activity },
  ];

  return (
    <DashboardShell
      navItems={navItems}
      roleTitle="Agri-Credit Desk"
      roleSubtitle={`${banker.organizationName}`}
      roleIcon={Landmark}
    >
      <div className="space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-950 via-teal-900 to-emerald-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-teal-300 text-xs font-bold">
                <Landmark className="w-3.5 h-3.5" />
                <span>बँक कृषी कर्ज व पीक विमा डेस्क • Agri-Finance & Insurance Underwriting</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{banker.organizationName}</h1>
              <p className="text-xs text-teal-200">
                Lead Agri-Credit Officer: {banker.fullName} • Regional Headquarters, Nagpur & Vidarbha
              </p>
            </div>

            <div className="flex items-center gap-4 bg-white/10 px-5 py-3 rounded-2xl backdrop-blur-sm border border-white/10 text-right">
              <div>
                <span className="text-2xl font-black text-teal-300 font-mono">₹4.85 Cr</span>
                <p className="text-[11px] text-stone-200 font-medium">Sanctioned Kharif Portfolio</p>
              </div>
            </div>
          </div>
        </div>

        {/* Success Alert */}
        {successNote && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{successNote}</span>
          </div>
        )}

        {/* Master-Detail Scheme Review */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Applications Queue */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <h3 className="text-sm font-extrabold text-brand-text uppercase tracking-wider">
                Application Docket ({applications.length})
              </h3>
              <Badge variant="lime" dot size="sm">KCC / PMFBY Queue</Badge>
            </div>

            <div className="space-y-3">
              {applications.map((app) => {
                const isSelected = app.id === currentApp?.id;
                return (
                  <button
                    key={app.id}
                    onClick={() => setSelectedAppId(app.id)}
                    className={`w-full text-left p-4 rounded-2xl transition-all border ${
                      isSelected
                        ? "bg-white border-teal-600 shadow-md ring-2 ring-teal-500/20"
                        : "bg-white/80 border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="neutral">{app.type}</Badge>
                      <Badge
                        variant={
                          app.status === "approved"
                            ? "success"
                            : app.status === "disbursed"
                            ? "info"
                            : "warning"
                        }
                      >
                        {app.status}
                      </Badge>
                    </div>

                    <h4 className="text-xs font-extrabold text-brand-text">{app.applicantName}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">{app.farmName}</p>

                    <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-500">Amount Requested:</span>
                      <strong className="text-teal-900 font-black font-mono">
                        ₹{app.requestedAmount.toLocaleString()}
                      </strong>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Detailed Verification View */}
          <div className="lg:col-span-7">
            {currentApp ? (
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-slate-200 space-y-6">
                <div>
                  <div className="flex items-center justify-between">
                    <Badge variant="info">Ref: #{currentApp.id}</Badge>
                    <span className="text-xs text-slate-500">Submitted: {currentApp.appliedDate}</span>
                  </div>

                  <h2 className="text-xl font-black text-brand-text mt-3">{currentApp.type}</h2>
                  <p className="text-xs text-slate-500 mt-1">{currentApp.schemeName}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <p className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Digital Land & Telemetry Verification Check:
                  </p>
                  <div className="grid grid-cols-2 gap-3 text-xs text-slate-700">
                    <div>
                      <span>Applicant Farmer:</span>
                      <strong className="block text-slate-900">{currentApp.applicantName}</strong>
                    </div>
                    <div>
                      <span>Survey Record:</span>
                      <strong className="block text-slate-900">Gat No. 142/2A (Wardha)</strong>
                    </div>
                    <div>
                      <span>Subvention Interest Rate:</span>
                      <strong className="block text-emerald-700">{currentApp.interestRatePct}% p.a. (Govt subsidized)</strong>
                    </div>
                    <div>
                      <span>Repayment Tenure:</span>
                      <strong className="block text-slate-900">{currentApp.tenureMonths} Months</strong>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-teal-50/60 border border-teal-200 text-xs text-teal-950 space-y-2">
                  <p className="font-bold flex items-center gap-1.5 text-teal-900">
                    <ShieldCheck className="w-4 h-4 text-teal-700" />
                    <span>Automated Agro-Risk Score: 94 / 100 (Tier-1 Low Risk)</span>
                  </p>
                  <p className="text-[11px] text-teal-800 leading-relaxed">
                    Verified through Mazhi Sheti root-zone soil sensor #MS-PRO-8841. Active cultivation verified with 0 default history.
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-200 space-y-3">
                  <p className="text-xs font-bold text-slate-700">Underwriting Actions:</p>
                  <div className="flex flex-wrap items-center gap-3">
                    <Button
                      variant="primary"
                      size="sm"
                      className="bg-teal-700 hover:bg-teal-800"
                      onClick={() => handleStatusChange("approved")}
                    >
                      Approve Credit Sanction
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleStatusChange("disbursed")}
                    >
                      Disburse Funds to Farmer
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStatusChange("under_scrutiny")}
                    >
                      Request Additional Documents
                    </Button>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
