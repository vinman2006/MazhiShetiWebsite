"use client";

import React, { useState } from "react";
import { MapPin, Phone, Mail, Clock, MessageSquare, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";

export default function ContactPage() {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [category, setCategory] = useState("farmer_support");
  const [district, setDistrict] = useState("Wardha");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setFullName("");
      setPhone("");
      setMessage("");
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-brand-cream py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-light text-brand-dark text-xs font-bold">
            <Phone className="w-3.5 h-3.5 text-brand-primary" />
            <span>संपर्क साधा • Get in Touch</span>
          </div>
          <h1 className="text-display">We&apos;re Here to Help.</h1>
          <p className="text-body text-base">
            Have questions about sensor installation, soil diagnostics, or wholesale trading? Reach out to our Vidarbha agronomy support team.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Contact Info & Helplines */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-brand-dark rounded-3xl p-8 text-white shadow-xl space-y-6">
              <div>
                <h3 className="text-xl font-black">Kisan Helpline Desk</h3>
                <p className="text-xs text-stone-300 mt-1">
                  Support available in Marathi, Hindi, and English.
                </p>
              </div>

              <div className="space-y-4 text-xs text-stone-200">
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-brand-lime flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-white text-sm">1800-889-SHETI (Toll Free)</p>
                    <p className="text-stone-300">Direct agronomy assistance: 07:00 AM – 08:00 PM</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-brand-lime flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-white text-sm">support@mazhisheti.in</p>
                    <p className="text-stone-300">Soil report queries: lab@mazhisheti.in</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-brand-lime flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-white text-sm">Regional Agronomy & Sensor Lab</p>
                    <p className="text-stone-300">Plot 18, Agri-Tech Innovation Park, Wardha Road, Nagpur, Maharashtra - 440025</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-brand-lime flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-white text-sm">Field Sensor Dispatch</p>
                    <p className="text-stone-300">Monday to Saturday: 08:00 AM – 07:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* FPO partnership card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card">
              <h4 className="text-xs font-bold uppercase tracking-wider text-brand-primary">
                FPO & Corporate Mandi Desk
              </h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Bulk procurement contracts, custom mesh sensor deployments, or institutional loan facilitation for co-operatives.
              </p>
              <p className="text-xs font-bold text-slate-900 mt-3">partnerships@mazhisheti.in</p>
            </div>
          </div>

          {/* Right: Interactive Message Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-card space-y-6">
              <div>
                <h3 className="text-xl font-black text-brand-text">Send Us an Inquiry</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Our field officers will review your farm details and respond within 24 hours.
                </p>
              </div>

              {sent && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-fadeIn">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <span>Inquiry received! Our regional field coordinator will call you back shortly.</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Farmer / Contact Name"
                    placeholder="e.g. Rameshwar Shinde"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                  <Input
                    label="Mobile Number (WhatsApp)"
                    placeholder="e.g. +91 98223 XXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Select
                    label="Inquiry Category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    options={[
                      { value: "farmer_support", label: "Farmer Soil Sensor & Advisory" },
                      { value: "mandi_buyer", label: "Produce Mandi Wholesale Buying" },
                      { value: "fleet_provider", label: "Equipment & Drone Fleet Partnership" },
                      { value: "bank_insurance", label: "Bank Loan / PMFBY Facilitation" },
                      { value: "fpo_corporate", label: "FPO Cluster Deployment" },
                    ]}
                  />
                  <Select
                    label="District / Location"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    options={[
                      { value: "Wardha", label: "Wardha (वर्धा)" },
                      { value: "Nagpur", label: "Nagpur (नागपूर)" },
                      { value: "Amravati", label: "Amravati (अमरावती)" },
                      { value: "Akola", label: "Akola (अकोला)" },
                      { value: "Jalgaon", label: "Jalgaon (जळगाव)" },
                      { value: "Nashik", label: "Nashik (नाशिक)" },
                      { value: "Other", label: "Other Maharashtra District" },
                    ]}
                  />
                </div>

                <div>
                  <label className="text-form-label">How can we assist your farm?</label>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us about your soil type, crops, or machinery needs..."
                    className="w-full text-xs font-medium text-slate-900 bg-white border border-slate-300 rounded-xl p-3.5 outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-light transition-all"
                    required
                  />
                </div>

                <div className="pt-2">
                  <Button type="submit" size="lg" className="w-full sm:w-auto">
                    Submit Inquiry
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
