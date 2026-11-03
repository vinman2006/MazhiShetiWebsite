import React from "react";
import Link from "next/link";
import { Sprout, Users, ShieldCheck, Heart, Target, Award, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function AboutPage() {
  const values = [
    {
      title: "Soil First Philosophy",
      marathi: "मृदा संवर्धन",
      description: "Healthy soil is the foundation of agricultural prosperity. We read the root zone before prescribing any input.",
      icon: Sprout,
    },
    {
      title: "Fair Value for Farmers",
      marathi: "शेतकऱ्यांचा नफा",
      description: "Eliminating predatory middlemen with direct farm-gate marketplace trade and certified quality grading.",
      icon: Target,
    },
    {
      title: "Frugal High-Tech",
      marathi: "सुलभ तंत्रज्ञान",
      description: "Precision IoT sensors and AI crop doctors simplified for vernacular languages and low-bandwidth rural conditions.",
      icon: Award,
    },
    {
      title: "Ecosystem Collaboration",
      marathi: "सर्वसमावेशक विकास",
      description: "Uniting agricultural universities, banks, equipment centers, and mandi buyers into one trusted network.",
      icon: Users,
    },
  ];

  return (
    <div className="min-h-screen bg-brand-cream py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-light text-brand-dark text-xs font-bold">
            <Heart className="w-3.5 h-3.5 text-brand-primary" />
            <span>आमची गोष्ट • The Mazhi Sheti Story</span>
          </div>
          <h1 className="text-display">
            Built with Farmers, <br />
            <span className="text-brand-primary">For Every Indian Grower.</span>
          </h1>
          <p className="text-body text-base sm:text-lg">
            “Mazhi Sheti” means <em>My Farm</em> in Marathi. We are an agritech collective of agronomists, software architects, and farmers&apos; children committed to making soil readable, crop advice scientific, and agricultural trade transparent.
          </p>
        </div>

        {/* 4 Impact Numbers */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-white p-8 rounded-3xl border border-slate-200/80 shadow-card">
          <div className="border-r border-slate-200 last:border-0 pr-4">
            <span className="text-3xl sm:text-4xl font-black text-brand-primary font-mono">10,000+</span>
            <p className="text-xs font-bold text-slate-800 mt-1">Farmers Empowered</p>
            <p className="text-[11px] text-slate-500">Across Vidarbha & Marathwada</p>
          </div>
          <div className="border-r border-slate-200 last:border-0 pr-4">
            <span className="text-3xl sm:text-4xl font-black text-brand-primary font-mono">25%</span>
            <p className="text-xs font-bold text-slate-800 mt-1">Yield Increase</p>
            <p className="text-[11px] text-slate-500">Targeted NPK root nutrition</p>
          </div>
          <div className="border-r border-slate-200 last:border-0 pr-4">
            <span className="text-3xl sm:text-4xl font-black text-brand-primary font-mono">40%</span>
            <p className="text-xs font-bold text-slate-800 mt-1">Water Conserved</p>
            <p className="text-[11px] text-slate-500">Sensor-guided drip irrigation</p>
          </div>
          <div>
            <span className="text-3xl sm:text-4xl font-black text-brand-primary font-mono">₹4.8 Cr+</span>
            <p className="text-xs font-bold text-slate-800 mt-1">Kisan Credit Disbursed</p>
            <p className="text-[11px] text-slate-500">Fast-tracked banking schemes</p>
          </div>
        </div>

        {/* Core Values Grid */}
        <div className="space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-page-title">Our Guiding Agricultural Principles</h2>
            <p className="text-body text-xs sm:text-sm mt-2">
              Every feature we design must directly benefit the grower at the farm gate.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => {
              const Icon = v.icon;
              return (
                <div
                  key={i}
                  className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-brand-light text-brand-dark flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-brand-primary" />
                    </div>
                    <span className="text-[10px] font-bold text-brand-primary bg-brand-light/60 px-2 py-0.5 rounded">
                      {v.marathi}
                    </span>
                    <h3 className="text-base font-extrabold text-brand-text mt-2">{v.title}</h3>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">{v.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Call to action */}
        <div className="bg-brand-dark rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl font-black">Ready to cultivate smarter?</h3>
            <p className="text-xs sm:text-sm text-stone-200 max-w-lg leading-relaxed">
              Join thousands of progressive farmers using Mazhi Sheti&apos;s smart soil sensors and direct mandi platform.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/register">
              <Button variant="accent" size="lg">
                Create Free Account
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                Contact Agronomist Desk
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
