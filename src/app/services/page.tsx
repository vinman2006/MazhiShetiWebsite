import React from "react";
import Link from "next/link";
import {
  Droplets,
  Stethoscope,
  ShoppingBag,
  Wrench,
  Landmark,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function ServicesPage() {
  const services = [
    {
      title: "Smart Root-Zone Soil Telemetry",
      marathi: "स्मार्ट मृदा सेन्सर्स",
      description: "Patented IoT probe measuring soil moisture, NPK, temperature, pH and electrical conductivity at 15-minute intervals.",
      icon: Droplets,
      color: "bg-sky-100 text-sky-800",
      features: [
        "Continuous 24/7 root zone monitoring",
        "Solar & cellular battery with 60-day backup",
        "Automated Soil Health Card export",
      ],
      link: "/sensors",
      actionText: "Explore Sensor Telemetry",
    },
    {
      title: "AI Crop Doctor & University Agronomy",
      marathi: "पीक सल्ला व कृषी तज्ज्ञ",
      description: "Direct connection with university research stations (Dr. Anjali Deshmukh, PDKV Akola) for diagnostic reviews and prescriptions.",
      icon: Stethoscope,
      color: "bg-blue-100 text-blue-800",
      features: [
        "Sucking pest & rust photo diagnostics",
        "Crop-stage specific fertigation schedules",
        "Preventive weather alerts before rainfall",
      ],
      link: "/advisory",
      actionText: "Consult Crop Doctor",
    },
    {
      title: "Direct Wholesale Mandi Exchange",
      marathi: "थोक शेतमाल खरेदी विक्री",
      description: "Farm-gate marketplace connecting growers directly with APMC buyers, food processors, and international exporters.",
      icon: ShoppingBag,
      color: "bg-purple-100 text-purple-800",
      features: [
        "Transparent pricing matched against e-NAM",
        "Certified quality grading and moisture rating",
        "Protected digital escrow contract settlements",
      ],
      link: "/marketplace",
      actionText: "Browse Produce Lots",
    },
    {
      title: "Agri-Machinery & Drone Spraying Fleet",
      marathi: "अवजारे व ड्रोन फवारणी",
      description: "On-demand mechanization from verified Custom Hiring Centers with trained operators and calibrated equipment.",
      icon: Wrench,
      color: "bg-amber-100 text-amber-800",
      features: [
        "45HP & 55HP Tractors with rotavators",
        "RTK-guided DJI Agras T40 spray drones",
        "Laser land levelers for 35% water conservation",
      ],
      link: "/rentals",
      actionText: "Book Machinery Fleet",
    },
    {
      title: "Agri-Credit & PMFBY Crop Insurance",
      marathi: "किसान क्रेडिट कार्ड व विमा",
      description: "Simplified applications for 4% Kisan Credit Cards, PM-KUSUM 90% solar water pump subsidies, and fast-track claim settlement.",
      icon: Landmark,
      color: "bg-teal-100 text-teal-800",
      features: [
        "Automated land record & 7/12 verification",
        "Tier-1 low-risk agronomic credit scoring",
        "Direct branch officer scrutiny workflow",
      ],
      link: "/finance",
      actionText: "Check Financial Eligibility",
    },
    {
      title: "Enterprise FPO & Estate Grid",
      marathi: "शेतकरी उत्पादक कंपनी (FPO)",
      description: "Multi-sensor mesh grids, cluster telemetry, and ERP data exports for Farmer Producer Companies and large orchards.",
      icon: ShieldCheck,
      color: "bg-emerald-100 text-emerald-800",
      features: [
        "Multi-plot centralized dashboard",
        "Bulk drone spraying fleet scheduling",
        "Export documentation & pesticide residue tracking",
      ],
      link: "/contact",
      actionText: "Contact Enterprise Desk",
    },
  ];

  return (
    <div className="min-h-screen bg-brand-cream py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-light text-brand-dark text-xs font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-primary" />
            <span>आमच्या सेवा • Full-Stack Agricultural Services</span>
          </div>
          <h1 className="text-display">
            Integrated Solutions <br />
            <span className="text-brand-primary">From Sowing to Mandi.</span>
          </h1>
          <p className="text-body text-base sm:text-lg">
            Every service is interconnected. Soil telemetry informs your fertigation, university agronomists review crop health, and your ready produce is sold with verified quality metrics.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-2xl ${s.color} flex items-center justify-center`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                      {s.marathi}
                    </span>
                  </div>

                  <h3 className="text-lg font-extrabold text-brand-text">{s.title}</h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">{s.description}</p>

                  <div className="mt-6 pt-4 border-t border-slate-100 space-y-2.5">
                    {s.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2 text-xs text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-100">
                  <Link href={s.link}>
                    <Button variant="outline" className="w-full text-xs font-bold justify-between">
                      <span>{s.actionText}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
