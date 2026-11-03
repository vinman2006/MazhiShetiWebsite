"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAppState } from "@/lib/store";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
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
  FileText,
  Building2,
  Check,
  X,
  Lock,
  Search,
  Scale,
  Phone,
  Calendar,
  AlertTriangle,
} from "lucide-react";
import { LoanApplicationRecord } from "@/db/seed-data";

export default function BankerDashboard() {
  const { data, updateLoanStatus, verifyLoanDocument, recordLoanReview } = useAppState();

  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>("all");
  const [selectedAppId, setSelectedAppId] = useState<string>(
    data.loanApplications?.[0]?.id || "app_kcc_01"
  );
  const [showSanctionModal, setShowSanctionModal] = useState(false);
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Review & Appraisal State
  const [sanctionAmount, setSanctionAmount] = useState<number>(250000);
  const [appraisalNotes, setAppraisalNotes] = useState("");
  const [cibilScore, setCibilScore] = useState<number>(745);
  const [landValuation, setLandValuation] = useState<number>(3200000);
  const [riskAssessment, setRiskAssessment] = useState<
    "low_risk_irrigated" | "moderate_risk_rainfed" | "high_risk_drought_prone"
  >("low_risk_irrigated");
  const [declineReason, setDeclineReason] = useState("");

  const banker = data.users.find((u) => u.role === "banker") || data.users[4];
  const applications = data.loanApplications || [];
  const selectedApp = applications.find((a) => a.id === selectedAppId) || applications[0];
  const reviews = data.loanReviews || [];
  const consents = data.userConsents || [];

  const triggerToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 4000);
  };

  const handleUpdateStatus = (
    status: LoanApplicationRecord["status"],
    notes?: string,
    amount?: number
  ) => {
    if (!selectedApp) return;
    updateLoanStatus(selectedApp.id, status, notes, amount);
    triggerToast(`Application #${selectedApp.id} status transitioned to "${status.toUpperCase()}".`);
  };

  const handleSaveSanction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApp) return;

    recordLoanReview({
      applicationId: selectedApp.id,
      reviewerId: banker.id,
      reviewerName: `${banker.fullName} (Lead Credit Officer)`,
      cibilOrCreditScore: cibilScore,
      landValuationRupees: landValuation,
      cropRiskAssessment: riskAssessment,
      fieldVisitCompleted: true,
      internalAppraisalNotes:
        appraisalNotes ||
        `Credit committee sanctioned ₹${sanctionAmount.toLocaleString("en-IN")}. Land title verified.`,
      recommendation: "recommend_approval",
    });

    handleUpdateStatus(
      "credit_approved",
      `Formally sanctioned by Credit Committee for ₹${sanctionAmount.toLocaleString("en-IN")} at ${selectedApp.interestRatePct}% p.a.`,
      sanctionAmount
    );

    setShowSanctionModal(false);
  };

  const handleSaveDecline = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApp) return;

    recordLoanReview({
      applicationId: selectedApp.id,
      reviewerId: banker.id,
      reviewerName: `${banker.fullName} (Lead Credit Officer)`,
      cibilOrCreditScore: cibilScore,
      landValuationRupees: landValuation,
      cropRiskAssessment: riskAssessment,
      fieldVisitCompleted: false,
      internalAppraisalNotes: declineReason || "Declined due to documentary or debt service mismatch.",
      recommendation: "recommend_rejection",
    });

    handleUpdateStatus(
      "rejected",
      `Application declined: ${declineReason || "Ineligible under institutional norms"}`
    );

    setShowDeclineModal(false);
  };

  const filteredApplications = applications.filter((a) => {
    if (selectedStatusFilter !== "all" && a.status !== selectedStatusFilter) return false;
    return true;
  });

  const totalSanctioned = applications
    .filter((a) => a.status === "credit_approved" || a.status === "disbursed")
    .reduce((sum, a) => sum + (a.sanctionedAmount || a.requestedAmount || 0), 0);

  const navItems = [
    { label: "Loan Docket Desk", href: "/dashboard/banker", icon: LayoutDashboard },
    { label: "Public Finance Catalog", href: "/finance", icon: Landmark },
    { label: "Produce Mandi", href: "/marketplace", icon: DollarSign },
  ];

  return (
    <DashboardShell
      navItems={navItems}
      roleTitle="Agri-Credit Underwriting Desk"
      roleSubtitle={`${banker.organizationName || "Bank of Maharashtra"} • Regional Zonal Cell`}
      roleIcon={Landmark}
    >
      <div className="space-y-8">
        {/* Toast */}
        {successToast && (
          <div className="fixed bottom-6 right-6 z-50 bg-emerald-950 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-emerald-700 animate-in fade-in slide-in-from-bottom-5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <p className="text-sm font-semibold">{successToast}</p>
          </div>
        )}

        {/* Hero Header */}
        <div className="bg-gradient-to-r from-teal-950 via-teal-900 to-emerald-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-teal-300 text-xs font-bold backdrop-blur-sm">
                <Landmark className="w-3.5 h-3.5" />
                <span>बँक कृषी कर्ज व विमा हमी डेस्क • Institutional Underwriting Portal</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                {banker.organizationName || "Bank of Maharashtra Agri Credit Division"}
              </h1>
              <p className="text-xs text-teal-200">
                Lead Credit Officer: <span className="font-semibold text-white">{banker.fullName}</span> •
                Regional Zonal Hub: {banker.district}, Maharashtra
              </p>
            </div>

            <div className="bg-white/10 px-5 py-3 rounded-2xl backdrop-blur-sm border border-white/10 text-right">
              <span className="text-2xl font-black text-teal-300 font-mono">
                ₹{(totalSanctioned / 100000).toFixed(2)} Lakh
              </span>
              <p className="text-[11px] text-stone-200 font-medium">Sanctioned Portfolio This Season</p>
            </div>
          </div>
        </div>

        {/* Security & Audit Mandate Banner */}
        <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-amber-950">
          <div className="flex items-center gap-2 font-bold text-amber-900">
            <Lock className="w-4 h-4 text-amber-700 shrink-0" />
            <span>Role-Based Access & Data Integrity Protocol:</span>
          </div>
          <p className="text-[11px] text-amber-900/90 leading-relaxed">
            Bank data is strictly isolated. Credit evaluations must strictly record authenticated review notes and
            mandated customer consent before fetching CIBIL or land records.
          </p>
        </div>

        {/* Master-Detail Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Applications Docket (Left column 5/12) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-brand-text">Assigned Loan Docket ({applications.length})</h3>
                <p className="text-xs text-slate-500">Filter applications by stage</p>
              </div>

              <select
                value={selectedStatusFilter}
                onChange={(e) => setSelectedStatusFilter(e.target.value)}
                className="bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="submitted">Submitted</option>
                <option value="under_scrutiny">Under Scrutiny</option>
                <option value="field_inspection_scheduled">Field Inspection</option>
                <option value="credit_approved">Sanctioned</option>
                <option value="disbursed">Disbursed</option>
              </select>
            </div>

            <div className="space-y-3">
              {filteredApplications.map((app) => (
                <div
                  key={app.id}
                  onClick={() => setSelectedAppId(app.id)}
                  className={`p-5 rounded-3xl border transition-all cursor-pointer ${
                    selectedApp?.id === app.id
                      ? "bg-white border-teal-600 shadow-card ring-2 ring-teal-600/20"
                      : "bg-white/80 border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                          {app.id}
                        </span>
                        <span className="text-[10px] font-bold text-teal-800">{app.institutionName}</span>
                      </div>
                      <h4 className="text-sm font-extrabold text-brand-text leading-snug">{app.productName}</h4>
                    </div>

                    <Badge
                      variant={
                        app.status === "credit_approved" || app.status === "disbursed"
                          ? "success"
                          : app.status === "field_inspection_scheduled"
                          ? "lime"
                          : app.status === "under_scrutiny"
                          ? "warning"
                          : "info"
                      }
                      size="sm"
                    >
                      {app.status.replace(/_/g, " ").toUpperCase()}
                    </Badge>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-xs pt-3 border-t border-slate-100">
                    <div>
                      <span className="text-[11px] text-slate-500">Applicant:</span>
                      <p className="font-bold text-slate-800">{app.farmerName}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] text-slate-500">Requested:</span>
                      <p className="font-mono font-black text-brand-dark">
                        ₹{app.requestedAmount.toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dossier & Appraisal Workbench (Right column 7/12) */}
          <div className="lg:col-span-7 space-y-6">
            {selectedApp ? (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6">
                {/* Dossier Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-500">{selectedApp.id}</span>
                      <Badge variant="neutral">{selectedApp.category.replace(/_/g, " ").toUpperCase()}</Badge>
                    </div>
                    <h2 className="text-xl font-black text-brand-text mt-1">{selectedApp.productName}</h2>
                    <p className="text-xs text-slate-500">
                      Applicant: <strong className="text-slate-800">{selectedApp.farmerName}</strong> • Phone:{" "}
                      <a href={`tel:${selectedApp.farmerPhone}`} className="text-teal-700 font-mono hover:underline">
                        {selectedApp.farmerPhone}
                      </a>
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-[11px] text-slate-500">Requested Credit Facility</p>
                    <p className="text-2xl font-black text-brand-dark font-mono">
                      ₹{selectedApp.requestedAmount.toLocaleString("en-IN")}
                    </p>
                    <p className="text-[10px] text-teal-700 font-semibold">
                      {selectedApp.interestRatePct}% p.a. • {selectedApp.tenureMonths} Months
                    </p>
                  </div>
                </div>

                {/* Farmer Profile & Land Overview */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs">
                  <div>
                    <span className="text-slate-500">Audited Land Area:</span>
                    <p className="font-bold text-slate-800">{selectedApp.farmAreaAcres} Acres</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Stated Investment Purpose:</span>
                    <p className="font-bold text-slate-800 truncate">{selectedApp.cropCycleOrPurpose}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">CIBIL Credit Score:</span>
                    <p className="font-mono font-black text-emerald-700">{cibilScore} (Prime Excellent)</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Mahabhulekh Land Title:</span>
                    <p className="font-bold text-emerald-700">✓ Free of prior mortgage</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Digital Consent:</span>
                    <p className="font-bold text-teal-800">✓ Verified (IP Timestamped)</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Applied Date:</span>
                    <p className="font-medium text-slate-800">{selectedApp.appliedDate}</p>
                  </div>
                </div>

                {/* Submitted Documents Audit Checklist */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-brand-text uppercase tracking-wider">
                      Submitted Document Records ({selectedApp.documents.length})
                    </h4>
                    <span className="text-[11px] text-slate-500">Audit authenticity against state databases</span>
                  </div>

                  <div className="space-y-2">
                    {selectedApp.documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2.5">
                          <FileText className="w-4 h-4 text-teal-700 shrink-0" />
                          <div>
                            <p className="font-bold text-slate-800">{doc.documentName}</p>
                            <p className="text-[10px] text-slate-500 uppercase">{doc.documentType.replace(/_/g, " ")}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {doc.verificationStatus === "verified_authentic" ? (
                            <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Authentic Verified
                            </span>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-[11px] py-1 h-7"
                              onClick={() => {
                                verifyLoanDocument(selectedApp.id, doc.id, "verified_authentic", "Officer verified");
                                triggerToast(`Document ${doc.documentName} verified as authentic.`);
                              }}
                            >
                              Verify Document
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Underwriter Status Action Controls */}
                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <h4 className="text-xs font-bold text-brand-text uppercase tracking-wider">
                    Institutional Underwriting Decision Controls
                  </h4>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUpdateStatus("under_scrutiny", "Document audit initiated by Agri Officer")}
                    >
                      Under Scrutiny
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleUpdateStatus(
                          "field_inspection_scheduled",
                          "Technical field officer inspection scheduled for soil and water verification"
                        )
                      }
                    >
                      Field Inspection
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => {
                        setSanctionAmount(selectedApp.requestedAmount);
                        setShowSanctionModal(true);
                      }}
                      leftIcon={<Check className="w-4 h-4" />}
                    >
                      Sanction Loan
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => setShowDeclineModal(true)}
                      leftIcon={<X className="w-4 h-4" />}
                    >
                      Decline
                    </Button>
                  </div>

                  {selectedApp.status === "credit_approved" && (
                    <div className="mt-3 p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-bold text-emerald-950">Loan Formally Sanctioned</p>
                        <p className="text-[11px] text-emerald-800">
                          Sanctioned Limit: ₹{selectedApp.sanctionedAmount?.toLocaleString("en-IN")}
                        </p>
                      </div>
                      <Button
                        variant="accent"
                        size="sm"
                        onClick={() =>
                          handleUpdateStatus("disbursed", "Credit limit disbursed to borrower SB account")
                        }
                      >
                        Disburse Funds to Bank A/C
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-200">
                <p className="text-xs text-slate-500">Select an application from the docket to begin appraisal.</p>
              </div>
            )}
          </div>
        </div>

        {/* Modal: Sanction Loan */}
        <Modal
          isOpen={showSanctionModal}
          onClose={() => setShowSanctionModal(false)}
          title={`Credit Sanction • ${selectedApp?.productName}`}
          description="Record institutional appraisal and formally issue sanctioned credit limit."
          maxWidth="md"
          footer={
            <>
              <Button variant="ghost" size="sm" onClick={() => setShowSanctionModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleSaveSanction}>
                Issue Sanction Letter (₹{Number(sanctionAmount).toLocaleString("en-IN")})
              </Button>
            </>
          }
        >
          {selectedApp && (
            <form onSubmit={handleSaveSanction} className="space-y-4 text-xs">
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1">
                <p className="font-bold text-slate-800">Borrower: {selectedApp.farmerName}</p>
                <p className="text-slate-500">Requested Amount: ₹{selectedApp.requestedAmount.toLocaleString("en-IN")}</p>
              </div>

              <Input
                label="Sanctioned Credit Limit (₹)"
                type="number"
                value={sanctionAmount}
                onChange={(e) => setSanctionAmount(Number(e.target.value))}
                required
              />

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Evaluated CIBIL Score"
                  type="number"
                  value={cibilScore}
                  onChange={(e) => setCibilScore(Number(e.target.value))}
                  required
                />
                <Select
                  label="Crop & Climate Risk"
                  value={riskAssessment}
                  onChange={(e) => setRiskAssessment(e.target.value as any)}
                  options={[
                    { value: "low_risk_irrigated", label: "Low Risk (Perennial Irrigated)" },
                    { value: "moderate_risk_rainfed", label: "Moderate Risk (Assured Rainfed)" },
                    { value: "high_risk_drought_prone", label: "High Risk (Drought Prone)" },
                  ]}
                />
              </div>

              <Input
                label="Internal Credit Appraisal Notes & Terms"
                value={appraisalNotes}
                onChange={(e) => setAppraisalNotes(e.target.value)}
                placeholder="e.g. Clean 7/12 title, prompt repayment track record, hypothecation of standing crops"
                required
              />
            </form>
          )}
        </Modal>

        {/* Modal: Decline Loan */}
        <Modal
          isOpen={showDeclineModal}
          onClose={() => setShowDeclineModal(false)}
          title={`Decline Application • ${selectedApp?.id}`}
          description="Record reason for rejection to communicate clearly with the farmer."
          maxWidth="md"
          footer={
            <>
              <Button variant="ghost" size="sm" onClick={() => setShowDeclineModal(false)}>
                Cancel
              </Button>
              <Button variant="danger" size="sm" onClick={handleSaveDecline}>
                Confirm Decline Decision
              </Button>
            </>
          }
        >
          <form onSubmit={handleSaveDecline} className="space-y-4 text-xs">
            <Input
              label="Official Rejection Rationale"
              value={declineReason}
              onChange={(e) => setDeclineReason(e.target.value)}
              placeholder="e.g. Existing encumbrance on 7/12 extract, or CIBIL score below institutional threshold"
              required
            />
          </form>
        </Modal>
      </div>
    </DashboardShell>
  );
}
