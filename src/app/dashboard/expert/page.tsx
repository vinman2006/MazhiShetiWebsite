"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAppState } from "@/lib/store";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  Stethoscope,
  CheckCircle2,
  AlertCircle,
  FileText,
  Send,
  User,
  MapPin,
  Clock,
  Sparkles,
  Search,
  Droplets,
  Activity,
  LayoutDashboard,
} from "lucide-react";

export default function ExpertDashboard() {
  const { data, resolveConsultation } = useAppState();
  const [selectedTicketId, setSelectedTicketId] = useState<string>(data.consultations[0]?.id || "");
  const [diagnosisText, setDiagnosisText] = useState("");
  const [prescriptionText, setPrescriptionText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const expert = data.users.find((u) => u.role === "expert") || data.users[1];
  const consultations = data.consultations;
  const activeTicket = consultations.find((c) => c.id === selectedTicketId) || consultations[0];

  const handleResolve = (e: React.FormEvent) => {
    e.preventDefault();
    if (!diagnosisText || !prescriptionText) {
      alert("Please enter both the diagnosis and treatment prescription.");
      return;
    }
    setSubmitting(true);
    resolveConsultation(activeTicket.id, diagnosisText, prescriptionText);
    setTimeout(() => {
      setSubmitting(false);
      setSuccessMsg("Prescription issued and dispatched to farmer's mobile dashboard successfully!");
      setDiagnosisText("");
      setPrescriptionText("");
      setTimeout(() => setSuccessMsg(""), 4000);
    }, 400);
  };

  const navItems = [
    { label: "Diagnostic Queue", href: "/dashboard/expert", icon: LayoutDashboard, badge: `${consultations.length}` },
    { label: "Consultation History", href: "/advisory", icon: Stethoscope },
    { label: "Root Telemetry Lab", href: "/sensors", icon: Activity },
  ];

  return (
    <DashboardShell
      navItems={navItems}
      roleTitle="Agronomist Clinic"
      roleSubtitle={`${expert.fullName} • PDKV`}
      roleIcon={Stethoscope}
    >
      <div className="space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-sky-300 text-xs font-bold">
                <Stethoscope className="w-3.5 h-3.5" />
                <span>कृषी तज्ज्ञ सल्ला केंद्र • Agronomist Advisory Desk</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{expert.fullName}</h1>
              <p className="text-xs text-sky-100 max-w-xl">
                {expert.organizationName} • Akola & Vidarbha Division. Reviewing soil health parameters, crop diagnostics, and micro-nutrient recommendations.
              </p>
            </div>

            <div className="bg-white/10 px-5 py-3 rounded-2xl backdrop-blur-sm border border-white/10 text-right">
              <span className="text-2xl font-black text-sky-200 font-mono">
                {consultations.filter((c) => c.status === "diagnosed").length} / {consultations.length}
              </span>
              <p className="text-[11px] text-stone-200 font-medium">Tickets Resolved Today</p>
            </div>
          </div>
        </div>

        {/* Success Alert */}
        {successMsg && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Master-Detail Consultation Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Consultation Queue */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <h3 className="text-sm font-extrabold text-brand-text uppercase tracking-wider">
                Inbound Inquiries ({consultations.length})
              </h3>
              <Badge variant="lime" dot size="sm">Live Queue</Badge>
            </div>

            <div className="space-y-3">
              {consultations.map((item) => {
                const isSelected = item.id === activeTicket?.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setSelectedTicketId(item.id);
                      if (item.diagnosis) {
                        setDiagnosisText(item.diagnosis);
                        setPrescriptionText(item.prescription || "");
                      } else {
                        setDiagnosisText("");
                        setPrescriptionText("");
                      }
                    }}
                    className={`w-full text-left p-4 rounded-2xl transition-all border ${
                      isSelected
                        ? "bg-white border-blue-600 shadow-md ring-2 ring-blue-500/20"
                        : "bg-white/80 border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="neutral">{item.cropName}</Badge>
                      <Badge variant={item.status === "diagnosed" ? "success" : "warning"}>
                        {item.status === "diagnosed" ? "Diagnosed" : "Needs Review"}
                      </Badge>
                    </div>

                    <h4 className="text-xs font-extrabold text-brand-text line-clamp-1">{item.title}</h4>
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{item.description}</p>

                    <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                      <span>Farmer: <strong className="text-slate-700">{item.farmerName}</strong></span>
                      <span>{item.createdAt}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Detailed Diagnostic & Prescription Form */}
          <div className="lg:col-span-7">
            {activeTicket ? (
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-slate-200 space-y-6">
                <div>
                  <div className="flex items-center justify-between">
                    <Badge variant="info">Ticket #{activeTicket.id}</Badge>
                    <span className="text-xs text-slate-500 font-medium">Received: {activeTicket.createdAt}</span>
                  </div>

                  <h2 className="text-xl font-black text-brand-text mt-3">{activeTicket.title}</h2>

                  <div className="flex items-center gap-4 text-xs text-slate-600 mt-2">
                    <span className="flex items-center gap-1 font-semibold text-slate-800">
                      <User className="w-3.5 h-3.5 text-slate-500" />
                      {activeTicket.farmerName} (Wardha)
                    </span>
                    <span>•</span>
                    <span>Crop: <strong>{activeTicket.cropName}</strong></span>
                    <span>•</span>
                    <span>Urgency: <strong className="text-amber-700 uppercase">{activeTicket.urgency}</strong></span>
                  </div>
                </div>

                {/* Farmer Observation */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <p className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Farmer&apos;s Field Observation:
                  </p>
                  <p className="text-xs text-slate-800 leading-relaxed">{activeTicket.description}</p>
                </div>

                {/* Live Root-Zone Snapshot */}
                <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200/80">
                  <p className="text-xs font-bold text-blue-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-blue-700" />
                    <span>Synchronized Sensor Telemetry at Ticket Submission:</span>
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="bg-white p-2 rounded-xl border border-blue-100">
                      <span className="text-slate-500">Moisture:</span>{" "}
                      <strong className="text-slate-900 font-mono">{data.currentTelemetry.moisturePct}%</strong>
                    </div>
                    <div className="bg-white p-2 rounded-xl border border-blue-100">
                      <span className="text-slate-500">Nitrogen:</span>{" "}
                      <strong className="text-slate-900 font-mono">{data.currentTelemetry.nitrogenPpm} ppm</strong>
                    </div>
                    <div className="bg-white p-2 rounded-xl border border-blue-100">
                      <span className="text-slate-500">pH Level:</span>{" "}
                      <strong className="text-slate-900 font-mono">{data.currentTelemetry.phLevel}</strong>
                    </div>
                    <div className="bg-white p-2 rounded-xl border border-blue-100">
                      <span className="text-slate-500">EC:</span>{" "}
                      <strong className="text-slate-900 font-mono">{data.currentTelemetry.ecMsCm} mS/cm</strong>
                    </div>
                  </div>
                </div>

                {/* Form to issue diagnosis */}
                <form onSubmit={handleResolve} className="space-y-4 pt-2 border-t border-slate-200">
                  <div>
                    <label className="text-form-label">Scientific Diagnosis & Pathology Analysis:</label>
                    <textarea
                      rows={3}
                      value={diagnosisText}
                      onChange={(e) => setDiagnosisText(e.target.value)}
                      placeholder="e.g. Sucking pest infestation (Jassids/Thrips) combined with cloudy weather tie-up..."
                      className="w-full text-xs font-medium text-slate-900 bg-white border border-slate-300 rounded-xl p-3 outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-light"
                    />
                  </div>

                  <div>
                    <label className="text-form-label">Prescribed Agronomy Treatment & Dosage Guide:</label>
                    <textarea
                      rows={3}
                      value={prescriptionText}
                      onChange={(e) => setPrescriptionText(e.target.value)}
                      placeholder="e.g. Spray Neem oil (10,000 ppm) @ 2ml/Ltr + Fipronil 5% SC @ 2ml/Ltr..."
                      className="w-full text-xs font-medium text-slate-900 bg-white border border-slate-300 rounded-xl p-3 outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-light"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-[11px] text-slate-500">
                      Logged with official Agronomist license verification.
                    </span>
                    <Button type="submit" variant="primary" size="md" isLoading={submitting} leftIcon={<Send className="w-3.5 h-3.5" />}>
                      Issue & Send Prescription
                    </Button>
                  </div>
                </form>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
