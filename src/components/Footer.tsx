import React from "react";
import Link from "next/link";
import { Sprout, Phone, Mail, MapPin, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-agri-green-950 text-white pt-16 pb-10 border-t border-agri-green-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-agri-green-900/60">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="w-9 h-9 rounded-xl bg-agri-lime flex items-center justify-center text-agri-green-950 font-black">
                MS
              </span>
              <span className="text-xl font-extrabold tracking-tight text-white">
                Mazhi Sheti
              </span>
            </div>
            <p className="text-sm text-stone-300 max-w-sm leading-relaxed">
              Empowering farmers with smart root-zone soil telemetry, precision AI crop advisories, fair mandi marketplace access, and agricultural finance.
            </p>
            <div className="flex flex-col gap-2 pt-2 text-xs text-stone-300">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-agri-lime" />
                <span>Nagpur & Wardha Regional Hub, Maharashtra, India</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-agri-lime" />
                <span>support@mazhisheti.in</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-agri-lime" />
                <span>Toll-Free Kisan Helpline: 1800-889-SHETI</span>
              </div>
            </div>
          </div>

          {/* Stakeholder Portals */}
          <div>
            <h4 className="text-xs font-bold tracking-wider uppercase text-agri-lime mb-4">
              Stakeholder Portals
            </h4>
            <ul className="space-y-2 text-xs text-stone-300">
              <li><Link href="/dashboard/farmer" className="hover:text-white transition">Farmer Command Center</Link></li>
              <li><Link href="/dashboard/expert" className="hover:text-white transition">Agronomist Clinic</Link></li>
              <li><Link href="/dashboard/provider" className="hover:text-white transition">Equipment & Drone Fleet</Link></li>
              <li><Link href="/dashboard/buyer" className="hover:text-white transition">Mandi Wholesale Exchange</Link></li>
              <li><Link href="/dashboard/banker" className="hover:text-white transition">Agri-Credit & PMFBY Desk</Link></li>
              <li><Link href="/dashboard/admin" className="hover:text-white transition">Governance & Audit Console</Link></li>
            </ul>
          </div>

          {/* Solutions & Tools */}
          <div>
            <h4 className="text-xs font-bold tracking-wider uppercase text-agri-lime mb-4">
              Solutions & Tools
            </h4>
            <ul className="space-y-2 text-xs text-stone-300">
              <li><Link href="/sensors" className="hover:text-white transition">Root-Zone Soil Telemetry</Link></li>
              <li><Link href="/marketplace" className="hover:text-white transition">Direct Farm Gate Market</Link></li>
              <li><Link href="/rentals" className="hover:text-white transition">Custom Hiring Center</Link></li>
              <li><Link href="/advisory" className="hover:text-white transition">AI Crop Doctor</Link></li>
              <li><Link href="/finance" className="hover:text-white transition">PM-KUSUM & KCC Scheme</Link></li>
            </ul>
          </div>

          {/* Compliance & Trust */}
          <div>
            <h4 className="text-xs font-bold tracking-wider uppercase text-agri-lime mb-4">
              Trust & Governance
            </h4>
            <ul className="space-y-2 text-xs text-stone-300">
              <li><span>Soil Health Card Protocol</span></li>
              <li><span>e-NAM Mandi Integration</span></li>
              <li><span>ISO 27001 Cloud Security</span></li>
              <li><span>Neon PostgreSQL ACID Store</span></li>
              <li><span>Clerk Institutional RBAC</span></li>
            </ul>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400">
          <p>© {new Date().getFullYear()} Mazhi Sheti Agri-Tech Ecosystem. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            Built with deep dedication for the farmers of Maharashtra and India.
          </p>
        </div>
      </div>
    </footer>
  );
}
