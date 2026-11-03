"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAppState } from "@/lib/store";
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
} from "lucide-react";

export default function FinancePage() {
  const { data, applyForFinance } = useAppState();
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedScheme, setSelectedScheme] = useState("Kisan Credit Card (KCC)");
  const [schemeName, setSchemeName] = useState("4% Interest Prompt Repayment Scheme");
  const [requestedAmount, setRequestedAmount] = useState(300000);
  const [farmArea, setFarmArea] = useState(12.5);
  const [successNote, setSuccessNote] = useState("");

  const applications = data.financialApplications;

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    applyForFinance(selectedScheme, schemeName, requestedAmount, farmArea);
    setShowApplyModal(false);
    setSuccessNote("Application submitted to Maharashtra Gramin Bank Agri-Credit Desk!");
    setTimeout(() => setSuccessNote(""), 4500);
  };

  return (
    <div className="min-h-screen bg-[#fdfbf7] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-stone-200">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100 text-teal-900 text-xs font-bold mb-2">
              <Landmark className="w-3.5 h-3.5" />
              <span>कृषी कर्ज व पीक विमा • Kisan Credit & PMFBY Desk</span>
            </div>
            <h1 className="text-3xl font-black text-stone-900 tracking-tight">
              Agricultural Finance & Subsidies
            </h1>
            <p className="text-xs text-stone-600 mt-1">
              Low-interest Kisan Credit Cards (4% p.a.), PM-KUSUM 90% solar water pump subsidies, and fast-track PMFBY insurance.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowApplyModal(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold shadow-md transition active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Apply for Scheme</span>
            </button>

            <Link
              href="/dashboard/banker"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-stone-300 text-stone-800 text-xs font-bold shadow-sm hover:bg-stone-50 transition"
            >
              <span>Banker Underwriting Desk</span>
            </Link>
          </div>
        </div>

        {successNote && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold animate-in fade-in flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{successNote}</span>
          </div>
        )}

        {/* 3 Core Scheme Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-6 shadow-card border border-stone-200 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center mb-4">
                <Landmark className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-2 py-0.5 rounded">
                Govt of India & NABARD
              </span>
              <h3 className="text-base font-extrabold text-stone-900 mt-2">
                Kisan Credit Card (KCC)
              </h3>
              <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                Working capital for seeds, fertilizers, and drip upkeep. Effective interest rate is only 4% with 3% prompt repayment subvention.
              </p>
            </div>
            <button
              onClick={() => {
                setSelectedScheme("Kisan Credit Card (KCC)");
                setSchemeName("KCC 4% Interest Subvention Scheme");
                setRequestedAmount(350000);
                setShowApplyModal(true);
              }}
              className="mt-6 w-full py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold transition shadow-sm"
            >
              Apply for KCC
            </button>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-card border border-stone-200 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
                <Sun className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2 py-0.5 rounded">
                MNRE & MahaVitaran
              </span>
              <h3 className="text-base font-extrabold text-stone-900 mt-2">
                PM-KUSUM Solar Agri-Pump
              </h3>
              <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                Up to 90% government subsidy for installing 3HP, 5HP, or 7.5HP off-grid solar DC submersible water pumps on farm ponds.
              </p>
            </div>
            <button
              onClick={() => {
                setSelectedScheme("Solar Agriculture Pump (PM-KUSUM)");
                setSchemeName("MahaVitaran 7.5 HP DC Submersible Solar Pump");
                setRequestedAmount(265000);
                setShowApplyModal(true);
              }}
              className="mt-6 w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition shadow-sm"
            >
              Apply for Solar Subsidy
            </button>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-card border border-stone-200 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800 bg-blue-50 px-2 py-0.5 rounded">
                Pradhan Mantri Fasal Bima
              </span>
              <h3 className="text-base font-extrabold text-stone-900 mt-2">
                PMFBY Weather Insurance
              </h3>
              <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                Comprehensive yield and weather insurance covering localized calamities, pest attacks, and post-harvest drying losses.
              </p>
            </div>
            <button
              onClick={() => {
                setSelectedScheme("Crop Insurance (PMFBY)");
                setSchemeName("Comprehensive Kharif Crop Insurance Policy");
                setRequestedAmount(150000);
                setShowApplyModal(true);
              }}
              className="mt-6 w-full py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold transition shadow-sm"
            >
              Apply for PMFBY
            </button>
          </div>
        </div>

        {/* Existing Application Tracker */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-stone-200 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-stone-100">
            <div>
              <h3 className="text-base font-black text-stone-900">Your Agricultural Finance Docket</h3>
              <p className="text-xs text-stone-500">
                Track verification, bank officer review, and disbursement status.
              </p>
            </div>
            <span className="text-xs font-bold text-teal-800 bg-teal-50 px-3 py-1 rounded-full">
              {applications.length} Active Records
            </span>
          </div>

          <div className="divide-y divide-stone-100">
            {applications.map((app) => (
              <div key={app.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold text-stone-900">{app.type}</span>
                    <span className="text-stone-300">•</span>
                    <span className="text-xs text-stone-600">{app.schemeName}</span>
                  </div>
                  <p className="text-[11px] text-stone-400">
                    Application Ref: #{app.id} • Submitted: {app.appliedDate}
                  </p>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <span className="text-xs text-stone-500">Amount:</span>
                    <strong className="block text-sm font-black text-teal-950">
                      ₹{app.requestedAmount.toLocaleString()}
                    </strong>
                  </div>

                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                      app.status === "approved"
                        ? "bg-emerald-100 text-emerald-800"
                        : app.status === "disbursed"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {app.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal for Application */}
        {showApplyModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-4 shadow-2xl">
              <h3 className="text-lg font-black text-stone-900">Apply for Agricultural Finance</h3>
              <p className="text-xs text-stone-500">
                Direct integration with Maharashtra Gramin Bank & Land Record Portal.
              </p>

              <form onSubmit={handleApply} className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Scheme Category:</label>
                  <input
                    type="text"
                    value={selectedScheme}
                    readOnly
                    className="w-full text-xs p-3 rounded-xl border border-stone-200 bg-stone-50 font-bold text-stone-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Scheme Detail:</label>
                  <input
                    type="text"
                    value={schemeName}
                    onChange={(e) => setSchemeName(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-teal-600 focus:outline-none"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Requested Amount (₹):</label>
                    <input
                      type="number"
                      value={requestedAmount}
                      onChange={(e) => setRequestedAmount(Number(e.target.value))}
                      className="w-full text-xs p-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-teal-600 focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Farm Area (Acres):</label>
                    <input
                      type="number"
                      step="0.5"
                      value={farmArea}
                      onChange={(e) => setFarmArea(Number(e.target.value))}
                      className="w-full text-xs p-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-teal-600 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-teal-50 text-[11px] text-teal-900 space-y-1">
                  <p className="font-bold flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-teal-700" />
                    <span>Auto-attached 7/12 & Sensor Records</span>
                  </p>
                  <p>Your Gat No. 142 survey record and telemetry health score will be submitted to the bank.</p>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-stone-100">
                  <button
                    type="button"
                    onClick={() => setShowApplyModal(false)}
                    className="px-4 py-2 text-xs font-bold text-stone-600 hover:bg-stone-100 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold bg-teal-700 hover:bg-teal-800 text-white rounded-xl shadow-md"
                  >
                    Submit Application
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
