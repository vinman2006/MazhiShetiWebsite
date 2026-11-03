"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAppState } from "@/lib/store";
import {
  Stethoscope,
  Sparkles,
  Send,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Activity,
  FileText,
} from "lucide-react";

export default function AdvisoryPage() {
  const { data, addConsultation } = useAppState();
  const [crop, setCrop] = useState("Cotton (कापूस)");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [urgency, setUrgency] = useState<"low" | "medium" | "high" | "critical">("medium");
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const consultations = data.consultations;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) {
      alert("Please provide the issue title and symptoms description.");
      return;
    }
    addConsultation(crop, title, description, urgency);
    setSubmittedSuccess(true);
    setTitle("");
    setDescription("");
    setTimeout(() => setSubmittedSuccess(false), 4500);
  };

  return (
    <div className="min-h-screen bg-[#fdfbf7] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-stone-200">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-900 text-xs font-bold mb-2">
              <Stethoscope className="w-3.5 h-3.5" />
              <span>कृषी तज्ज्ञ व पीक डॉक्टर क्लिनिक • AI & Agronomist Advisory</span>
            </div>
            <h1 className="text-3xl font-black text-stone-900 tracking-tight">
              Agronomy Clinic & Crop Doctor
            </h1>
            <p className="text-xs text-stone-600 mt-1">
              Direct access to university soil scientists (Dr. Anjali Deshmukh, PDKV) paired with real-time root telemetry.
            </p>
          </div>

          <Link
            href="/dashboard/expert"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold shadow-md transition active:scale-95"
          >
            <span>Agronomist Review Desk</span>
          </Link>
        </div>

        {submittedSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold animate-in fade-in flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Consultation ticket submitted to Dr. Anjali Deshmukh! Root-zone sensor telemetry has been attached automatically.</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Inquiry Form */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-stone-200 space-y-6">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-agri-lime" />
                <h3 className="text-base font-black text-stone-900">
                  Ask Crop Doctor / Submit Field Issue
                </h3>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Affected Crop:</label>
                  <select
                    value={crop}
                    onChange={(e) => setCrop(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  >
                    <option>Cotton (कापूस)</option>
                    <option>Soybean (सोयाबीन)</option>
                    <option>Turmeric (हळद)</option>
                    <option>Banana (केळी)</option>
                    <option>Onion (कांदा)</option>
                    <option>Orange (संत्री)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Issue Headline:</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Leaf curl & yellow spots on cotton boll branch"
                    className="w-full text-xs p-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Symptoms & Field Observations:</label>
                  <textarea
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe color changes, pest sighting, recent rainfall, or fertilizer applied..."
                    className="w-full text-xs p-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Urgency Level:</label>
                  <div className="grid grid-cols-4 gap-2">
                    {(["low", "medium", "high", "critical"] as const).map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setUrgency(lvl)}
                        className={`py-2 rounded-xl text-xs font-bold uppercase transition ${
                          urgency === lvl
                            ? "bg-agri-green-900 text-white shadow-sm"
                            : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-blue-50/70 text-[11px] text-blue-900 space-y-1">
                  <p className="font-bold flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-blue-700" />
                    <span>Live Sensor Telemetry Attached Automatically</span>
                  </p>
                  <p className="text-stone-600">
                    Moisture ({data.currentTelemetry.moisturePct}%), NPK ({data.currentTelemetry.nitrogenPpm}:{data.currentTelemetry.phosphorusPpm}:{data.currentTelemetry.potassiumPpm}), pH ({data.currentTelemetry.phLevel}) will be analyzed by the expert.
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 active:scale-95"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Ticket to Agronomist</span>
                </button>
              </form>
            </div>
          </div>

          {/* Active Consultation History */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="text-base font-black text-stone-900">
              Consultation History & Prescriptions ({consultations.length})
            </h3>

            <div className="space-y-4">
              {consultations.map((c) => (
                <div
                  key={c.id}
                  className="bg-white rounded-3xl p-6 shadow-card border border-stone-200 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-stone-900 bg-stone-100 px-2.5 py-0.5 rounded">
                        {c.cropName}
                      </span>
                      <h4 className="text-sm font-bold text-stone-900">{c.title}</h4>
                    </div>
                    <span
                      className={`text-xs font-bold px-3 py-0.5 rounded-full ${
                        c.status === "diagnosed"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {c.status === "diagnosed" ? "Diagnosed by Dr. Deshmukh" : "In Review"}
                    </span>
                  </div>

                  <p className="text-xs text-stone-600 leading-relaxed">{c.description}</p>

                  {c.diagnosis && (
                    <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-2 mt-3">
                      <p className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                        <Stethoscope className="w-4 h-4 text-blue-700" />
                        <span>Agronomist Diagnosis:</span>
                      </p>
                      <p className="text-xs text-blue-950">{c.diagnosis}</p>
                      <div className="pt-2 border-t border-blue-200">
                        <p className="text-xs font-bold text-blue-900">Prescribed Treatment:</p>
                        <p className="text-xs text-blue-900 mt-0.5">{c.prescription}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between items-center text-[10px] text-stone-400 pt-2 border-t border-stone-100">
                    <span>Ticket #{c.id}</span>
                    <span>Received: {c.createdAt}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
