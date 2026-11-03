"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAppState } from "@/lib/store";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import {
  Landmark,
  ShieldCheck,
  CheckCircle2,
  FileText,
  DollarSign,
  TrendingUp,
  Sun,
  PlusCircle,
  HelpCircle,
  Clock,
  AlertCircle,
  Building2,
  Calendar,
  Lock,
  Upload,
  ArrowRight,
  ExternalLink,
  Percent,
  Check,
  X,
  Scale,
  FileCheck,
} from "lucide-react";
import { FinancialProductRecord, LoanApplicationRecord } from "@/db/seed-data";

export default function FinancePage() {
  const { data, applyForLoan } = useAppState();

  const [activeTab, setActiveTab] = useState<"programs" | "applications" | "vault">("programs");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedProduct, setSelectedProduct] = useState<FinancialProductRecord | null>(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Application Form State
  const [requestedAmount, setRequestedAmount] = useState<number>(250000);
  const [tenureMonths, setTenureMonths] = useState<number>(12);
  const [farmArea, setFarmArea] = useState<number>(12.5);
  const [cropCycleOrPurpose, setCropCycleOrPurpose] = useState(
    "Kharif Cotton & Soybean Cultivation (Seed, Biofertilizers & Tillage)"
  );
  const [consentGranted, setConsentGranted] = useState(true);
  const [attachedDocs, setAttachedDocs] = useState<string[]>([
    "7_12_extract",
    "8a_holding_certificate",
    "aadhaar_card",
  ]);

  const farmer = data.users.find((u) => u.role === "farmer") || data.users[0];
  const products = data.financialProducts || [];
  const applications = data.loanApplications || [];
  const institutions = data.financialInstitutions || [];

  const triggerToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 4000);
  };

  const handleOpenApply = (prod: FinancialProductRecord) => {
    setSelectedProduct(prod);
    setRequestedAmount(Math.min(prod.maxAmount, Math.max(prod.minAmount, 250000)));
    setTenureMonths(Math.min(prod.maxTenureMonths, 12));
    setShowApplyModal(true);
  };

  const handleSubmitApplication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    if (!consentGranted) {
      alert("Mandatory digital consent is required for credit bureau evaluation and land record audit.");
      return;
    }

    const newApp = applyForLoan(
      {
        farmerId: farmer.id,
        farmerName: farmer.fullName,
        farmerPhone: farmer.phone,
        productId: selectedProduct.id,
        productName: selectedProduct.productName,
        institutionId: selectedProduct.institutionId,
        institutionName: selectedProduct.institutionName,
        category: selectedProduct.category,
        requestedAmount: Number(requestedAmount),
        tenureMonths: Number(tenureMonths),
        interestRatePct: selectedProduct.effectiveInterestRatePct,
        farmAreaAcres: Number(farmArea),
        cropCycleOrPurpose,
        documents: attachedDocs.map((docType, idx) => ({
          id: `doc_${Date.now()}_${idx}`,
          documentType: docType as any,
          documentName: `${docType.toUpperCase()}_Verified_${farmer.village}.pdf`,
          fileUrl: `/docs/${docType}_sample.pdf`,
          verificationStatus: "uploaded",
        })),
      },
      consentGranted
    );

    setShowApplyModal(false);
    triggerToast(
      `Application #${newApp.id} for "${selectedProduct.productName}" submitted to ${selectedProduct.institutionName}!`
    );
  };

  const filteredProducts = products.filter((p) => {
    if (selectedCategory !== "all" && p.category !== selectedCategory) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#FAFAF0] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Toast */}
        {successToast && (
          <div className="fixed bottom-6 right-6 z-50 bg-emerald-950 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-emerald-700 animate-in fade-in slide-in-from-bottom-5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <p className="text-sm font-semibold">{successToast}</p>
          </div>
        )}

        {/* Hero Header */}
        <div className="bg-gradient-to-r from-teal-950 via-teal-900 to-emerald-950 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-teal-300 text-xs font-bold backdrop-blur-sm">
                <Landmark className="w-3.5 h-3.5" />
                <span>कृषी वित्त व संस्थात्मक कर्ज • Agricultural Finance & Subsidies</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
                Kisan Credit & Farm Subsidies
              </h1>
              <p className="text-xs sm:text-sm text-teal-200 leading-relaxed">
                Discover subsidized crop loans (4% KCC), PM-KUSUM 90% solar pump grants, farm mechanization credit,
                and warehouse receipt finance directly connected with Maharashtra public sector & rural banks.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/dashboard/banker">
                <Button variant="accent" leftIcon={<Landmark className="w-4 h-4" />}>
                  Bank Underwriter Desk
                </Button>
              </Link>
              <Button
                variant="outline"
                className="text-white border-white/20 hover:bg-white/10"
                onClick={() => setActiveTab("vault")}
                leftIcon={<FileCheck className="w-4 h-4" />}
              >
                Digital Land Vault
              </Button>
            </div>
          </div>

          {/* Compliance & Verification Disclaimer */}
          <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center gap-3 text-xs text-teal-200">
            <div className="flex items-center gap-2 font-bold text-teal-300 shrink-0">
              <ShieldCheck className="w-4 h-4" />
              <span>Institutional Verification Mandate:</span>
            </div>
            <p className="text-[11px] leading-relaxed text-teal-300/90">
              Loan eligibility and sanctions are strictly contingent upon formal documentary audit, CIBIL credit scoring,
              and field inspection by authorized bank credit officers. Mazhi Sheti never fabricates approval guarantee certificates.
            </p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-slate-200 space-x-2">
          <button
            onClick={() => setActiveTab("programs")}
            className={`pb-3 px-4 font-bold text-sm transition-all border-b-2 flex items-center gap-2 ${
              activeTab === "programs"
                ? "border-teal-700 text-teal-900"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>Loan Programs & Subsidies ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("applications")}
            className={`pb-3 px-4 font-bold text-sm transition-all border-b-2 flex items-center gap-2 ${
              activeTab === "applications"
                ? "border-teal-700 text-teal-900"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>My Applications & Status ({applications.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("vault")}
            className={`pb-3 px-4 font-bold text-sm transition-all border-b-2 flex items-center gap-2 ${
              activeTab === "vault"
                ? "border-teal-700 text-teal-900"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Document Vault & Consents</span>
          </button>
        </div>

        {/* ===================== TAB 1: LOAN PROGRAMS & SCHEMES ===================== */}
        {activeTab === "programs" && (
          <div className="space-y-6">
            {/* Category Filter Chips */}
            <div className="flex flex-wrap items-center gap-2 pb-2">
              {[
                { id: "all", label: "All Credit Programs" },
                { id: "crop_loan", label: "Crop Loans (KCC)" },
                { id: "irrigation_loan", label: "Solar & Irrigation (PM-KUSUM)" },
                { id: "equipment_loan", label: "Tractor & Machinery" },
                { id: "infrastructure_loan", label: "Agri Infrastructure (AIF)" },
                { id: "warehouse_receipt_loan", label: "Warehouse Receipt (e-NWR)" },
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategory(c.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    selectedCategory === c.id
                      ? "bg-teal-900 text-white shadow-sm"
                      : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((prod) => (
                <div
                  key={prod.id}
                  className="bg-white rounded-3xl p-6 shadow-card hover:shadow-card-hover border border-slate-200 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-100 flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5" />
                        {prod.institutionName}
                      </span>
                      {prod.isGovtSponsored && (
                        <Badge variant="lime" dot>
                          Govt Subsidized
                        </Badge>
                      )}
                    </div>

                    <div>
                      <h3 className="text-base font-extrabold text-brand-text leading-snug">
                        {prod.productName}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                        {prod.description}
                      </p>
                    </div>

                    {/* Financial Terms Card */}
                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2 text-xs">
                      <div className="flex justify-between items-baseline">
                        <span className="text-slate-500">Effective Interest:</span>
                        <strong className="text-lg font-black text-emerald-800 font-mono">
                          {prod.effectiveInterestRatePct}% p.a.
                        </strong>
                      </div>
                      {prod.subventionPct > 0 && (
                        <div className="flex justify-between text-[11px] text-teal-700 font-medium">
                          <span>Interest Subvention:</span>
                          <span>{prod.subventionPct}% Rebate</span>
                        </div>
                      )}
                      <div className="flex justify-between text-[11px]">
                        <span className="text-slate-500">Facility Limits:</span>
                        <span className="font-mono text-slate-800 font-bold">
                          ₹{(prod.minAmount / 1000).toFixed(0)}k - ₹{(prod.maxAmount / 100000).toFixed(1)} Lakh
                        </span>
                      </div>
                      <div className="flex justify-between text-[11px] pt-1 border-t border-slate-200/50">
                        <span className="text-slate-500">Max Repayment Tenure:</span>
                        <span className="font-semibold text-slate-700">{prod.maxTenureMonths} Months</span>
                      </div>
                    </div>

                    {/* Eligibility & Documents Snippet */}
                    <div className="space-y-1.5 text-[11px] text-slate-600">
                      <p className="font-semibold text-slate-800">Key Eligibility:</p>
                      <p className="text-slate-500 leading-snug">{prod.eligibilityCriteria}</p>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100">
                    <Button
                      variant="primary"
                      size="sm"
                      className="w-full"
                      onClick={() => handleOpenApply(prod)}
                      leftIcon={<PlusCircle className="w-4 h-4" />}
                    >
                      Apply for Loan
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================== TAB 2: MY APPLICATIONS ===================== */}
        {activeTab === "applications" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-brand-text">Your Loan Docket & Institutional Updates</h3>
                <p className="text-xs text-slate-500">
                  Track credit appraisal, land record audits, field inspections, and disbursement schedules.
                </p>
              </div>
            </div>

            {applications.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-200">
                <Landmark className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h4 className="text-base font-bold text-slate-700">No applications submitted yet</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Select a credit program from the catalog to submit your loan application.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {applications.map((app) => (
                  <div
                    key={app.id}
                    className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card space-y-4 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                              {app.id}
                            </span>
                            <span className="text-[11px] font-bold text-teal-800">{app.institutionName}</span>
                          </div>
                          <h4 className="text-base font-extrabold text-brand-text">{app.productName}</h4>
                        </div>

                        {app.status === "credit_approved" && <Badge variant="success">Sanctioned</Badge>}
                        {app.status === "field_inspection_scheduled" && (
                          <Badge variant="lime" dot>
                            Field Inspection
                          </Badge>
                        )}
                        {app.status === "under_scrutiny" && <Badge variant="warning" dot>Under Scrutiny</Badge>}
                        {app.status === "submitted" && <Badge variant="info">Submitted</Badge>}
                        {app.status === "disbursed" && <Badge variant="success">Disbursed</Badge>}
                        {app.status === "rejected" && <Badge variant="danger">Declined</Badge>}
                      </div>

                      <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Requested Amount:</span>
                          <span className="font-mono font-bold text-slate-800">
                            ₹{app.requestedAmount.toLocaleString("en-IN")}
                          </span>
                        </div>
                        {app.sanctionedAmount && (
                          <div className="flex justify-between text-emerald-800 font-bold">
                            <span>Sanctioned Credit Limit:</span>
                            <span className="font-mono text-sm">
                              ₹{app.sanctionedAmount.toLocaleString("en-IN")}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-slate-500">Interest Rate:</span>
                          <span className="font-mono text-emerald-700 font-semibold">{app.interestRatePct}% p.a.</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Repayment Period:</span>
                          <span className="text-slate-700">{app.tenureMonths} Months</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Audited Farm Land:</span>
                          <span className="text-slate-700">{app.farmAreaAcres} Acres</span>
                        </div>
                      </div>

                      {/* Bank Underwriter Review Notes */}
                      {app.bankNotes && (
                        <div className="bg-amber-50/70 p-3.5 rounded-2xl border border-amber-200/80 text-xs space-y-1">
                          <div className="flex items-center gap-1.5 font-bold text-amber-900">
                            <Clock className="w-3.5 h-3.5 text-amber-700" />
                            <span>Bank Reviewer Update:</span>
                          </div>
                          <p className="text-[11px] text-amber-900/90 leading-relaxed">{app.bankNotes}</p>
                        </div>
                      )}

                      {/* Attached Documents */}
                      <div className="space-y-1 text-xs">
                        <span className="text-[11px] font-semibold text-slate-500">Submitted Documents:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {app.documents.map((doc) => (
                            <span
                              key={doc.id}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-[10px] font-semibold"
                            >
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              {doc.documentType.replace(/_/g, " ")}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                      <span>Applied: {app.appliedDate}</span>
                      <span className="font-medium text-slate-700">Audit Status: Active</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ===================== TAB 3: DOCUMENT VAULT & CONSENTS ===================== */}
        {activeTab === "vault" && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-bold text-brand-text">Digital Land & Financial Document Vault</h3>
                  <p className="text-xs text-slate-500">
                    Pre-verified records synchronized with Mahabhulekh, UIDAI, and State Revenue Department.
                  </p>
                </div>
                <Badge variant="success" dot>
                  Encrypted & KYC Verified
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    title: "7/12 Land Record Extract",
                    subtitle: "Gat No. 142 & 144, Ashti, Wardha (12.5 Ac)",
                    status: "Verified Authentic",
                    date: "Updated Oct 2026",
                  },
                  {
                    title: "8A Holding Khata Certificate",
                    subtitle: "Single owner khata, zero prior encumbrance",
                    status: "Verified Authentic",
                    date: "Updated Oct 2026",
                  },
                  {
                    title: "Aadhaar e-KYC (Masked)",
                    subtitle: "XXXX-XXXX-9124 • Biometrics Verified",
                    status: "Active Verified",
                    date: "UIDAI Verified",
                  },
                  {
                    title: "Soil Health Card",
                    subtitle: "14 Parameters Analyzed • Score 88/100",
                    status: "Lab Verified",
                    date: "Updated Oct 2026",
                  },
                  {
                    title: "Bank Account Passbook",
                    subtitle: "Bank of Maharashtra • A/C Ending **4102",
                    status: "Active Mandate",
                    date: "PFS Verified",
                  },
                  {
                    title: "Crop Sowing Self-Declaration",
                    subtitle: "Kharif Cotton & Soybean Verified",
                    status: "Recorded",
                    date: "Oct 2026",
                  },
                ].map((doc, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-800">{doc.title}</span>
                      <Badge variant="success" size="sm">
                        {doc.status}
                      </Badge>
                    </div>
                    <p className="text-slate-500 text-[11px] leading-snug">{doc.subtitle}</p>
                    <p className="text-slate-400 text-[10px]">{doc.date}</p>
                  </div>
                ))}
              </div>

              {/* Digital Consents */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <h4 className="text-sm font-bold text-slate-800">Active Regulatory Digital Consents</h4>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-700">
                      TransUnion CIBIL & Credit Bureau Audit Mandate
                    </span>
                    <span className="text-emerald-700 font-bold">✓ Granted digitally (IP: 49.36.128.45)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-700">
                      Mahabhulekh Land Title Monitoring Consent
                    </span>
                    <span className="text-emerald-700 font-bold">✓ Granted digitally (IP: 49.36.128.45)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Loan Application */}
        <Modal
          isOpen={showApplyModal}
          onClose={() => setShowApplyModal(false)}
          title={selectedProduct ? `Apply for ${selectedProduct.productName}` : ""}
          description="Submit formal application to the institutional bank credit committee with digital verification."
          maxWidth="lg"
          footer={
            <>
              <Button variant="ghost" size="sm" onClick={() => setShowApplyModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleSubmitApplication}>
                Submit Loan Application (₹{Number(requestedAmount).toLocaleString("en-IN")})
              </Button>
            </>
          }
        >
          {selectedProduct && (
            <form onSubmit={handleSubmitApplication} className="space-y-4 text-xs">
              <div className="bg-teal-50 p-4 rounded-2xl border border-teal-100 flex items-center justify-between">
                <div>
                  <h4 className="font-extrabold text-teal-950 text-sm">{selectedProduct.productName}</h4>
                  <p className="text-teal-800 text-[11px]">Lending Partner: {selectedProduct.institutionName}</p>
                </div>
                <div className="text-right">
                  <span className="font-mono font-black text-lg text-brand-dark">
                    {selectedProduct.effectiveInterestRatePct}%
                  </span>
                  <p className="text-[10px] text-teal-700 font-semibold">Effective Interest</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Requested Credit Amount (₹)"
                  type="number"
                  min={selectedProduct.minAmount}
                  max={selectedProduct.maxAmount}
                  value={requestedAmount}
                  onChange={(e) => setRequestedAmount(Number(e.target.value))}
                  helperText={`Min: ₹${selectedProduct.minAmount.toLocaleString("en-IN")} | Max: ₹${selectedProduct.maxAmount.toLocaleString("en-IN")}`}
                  required
                />
                <Input
                  label="Repayment Tenure (Months)"
                  type="number"
                  min={6}
                  max={selectedProduct.maxTenureMonths}
                  value={tenureMonths}
                  onChange={(e) => setTenureMonths(Number(e.target.value))}
                  helperText={`Max Tenure: ${selectedProduct.maxTenureMonths} Months`}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Cultivated Farm Land Area (Acres)"
                  type="number"
                  step="0.1"
                  value={farmArea}
                  onChange={(e) => setFarmArea(Number(e.target.value))}
                  required
                />
                <Input
                  label="Primary Crop Cycle / Investment Purpose"
                  value={cropCycleOrPurpose}
                  onChange={(e) => setCropCycleOrPurpose(e.target.value)}
                  placeholder="e.g. Cotton cultivation, solar pump installation"
                  required
                />
              </div>

              {/* Document Attachments Checklist */}
              <div className="space-y-2">
                <label className="font-bold text-slate-700">Attach Verified Documents from Land Vault:</label>
                <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                  {[
                    { id: "7_12_extract", label: "7/12 Land Record Extract" },
                    { id: "8a_holding_certificate", label: "8A Khata Certificate" },
                    { id: "aadhaar_card", label: "Aadhaar Card (e-KYC)" },
                    { id: "soil_health_card", label: "Soil Health Report" },
                    { id: "machinery_quotation", label: "Vendor Quotation (if machinery)" },
                  ].map((doc) => (
                    <label key={doc.id} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={attachedDocs.includes(doc.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setAttachedDocs([...attachedDocs, doc.id]);
                          } else {
                            setAttachedDocs(attachedDocs.filter((d) => d !== doc.id));
                          }
                        }}
                        className="w-3.5 h-3.5 text-teal-700 rounded border-slate-300"
                      />
                      <span className="text-[11px] text-slate-700">{doc.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Digital Consent Checkbox */}
              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 flex items-start gap-2.5">
                <input
                  type="checkbox"
                  id="consentCheckbox"
                  checked={consentGranted}
                  onChange={(e) => setConsentGranted(e.target.checked)}
                  className="w-4 h-4 text-teal-700 rounded border-slate-300 mt-0.5"
                  required
                />
                <label htmlFor="consentCheckbox" className="text-[11px] text-amber-950 leading-relaxed cursor-pointer">
                  <strong>Digital Authorization:</strong> I authorize {selectedProduct.institutionName} and Mazhi Sheti
                  to access my land records on Mahabhulekh and query TransUnion CIBIL / Experian for evaluating this
                  agricultural credit request.
                </label>
              </div>
            </form>
          )}
        </Modal>
      </div>
    </div>
  );
}
