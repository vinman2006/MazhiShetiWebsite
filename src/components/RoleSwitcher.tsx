"use client";

import React, { useState } from "react";
import { useAppState, RoleType } from "@/lib/store";
import { UserCheck, ChevronDown, Sprout, Stethoscope, Wrench, ShoppingBag, Landmark, ShieldCheck } from "lucide-react";

const ROLES: Array<{
  id: RoleType;
  title: string;
  marathi: string;
  icon: React.ElementType;
  badgeColor: string;
  description: string;
}> = [
  {
    id: "farmer",
    title: "Farmer",
    marathi: "शेतकरी",
    icon: Sprout,
    badgeColor: "bg-emerald-600 text-white",
    description: "Soil telemetry, crop advisory, produce sales & rentals",
  },
  {
    id: "expert",
    title: "Agronomist / Expert",
    marathi: "कृषी तज्ज्ञ",
    icon: Stethoscope,
    badgeColor: "bg-blue-600 text-white",
    description: "Soil report diagnostics, crop prescriptions & advisory",
  },
  {
    id: "provider",
    title: "Equipment Provider",
    marathi: "अवजारे व ड्रोन सेवा",
    icon: Wrench,
    badgeColor: "bg-amber-600 text-white",
    description: "Tractor & drone fleet hiring, booking schedule",
  },
  {
    id: "buyer",
    title: "Buyer & Trader",
    marathi: "खरेदीदार / व्यापारी",
    icon: ShoppingBag,
    badgeColor: "bg-purple-600 text-white",
    description: "Mandi procurement, wholesale produce bidding & contracts",
  },
  {
    id: "banker",
    title: "Bank & Financial Inst.",
    marathi: "बँक / विमा प्रतिनिधी",
    icon: Landmark,
    badgeColor: "bg-teal-700 text-white",
    description: "KCC loan evaluation, PM-KUSUM subsidy & PMFBY insurance",
  },
  {
    id: "admin",
    title: "Platform Admin",
    marathi: "प्रशासक",
    icon: ShieldCheck,
    badgeColor: "bg-stone-800 text-white",
    description: "Ecosystem governance, KYC compliance & audit logs",
  },
];

export default function RoleSwitcher() {
  const { activeRole, setActiveRole } = useAppState();
  const [open, setOpen] = useState(false);

  const currentRole = ROLES.find((r) => r.id === activeRole) || ROLES[0];
  const CurrentIcon = currentRole.icon;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-agri-green-800/20 bg-white/90 shadow-sm hover:border-agri-green-700 transition-all text-xs font-semibold text-agri-green-950"
        title="Switch stakeholder perspective"
      >
        <span className={`w-2 h-2 rounded-full ${currentRole.id === 'farmer' ? 'bg-emerald-500' : 'bg-lime-500'} animate-pulse`} />
        <CurrentIcon className="w-3.5 h-3.5 text-agri-green-800" />
        <span className="hidden sm:inline">Role:</span>
        <span className="text-agri-green-800 font-bold">{currentRole.title}</span>
        <span className="text-stone-500 text-[10px]">({currentRole.marathi})</span>
        <ChevronDown className="w-3 h-3 text-stone-400" />
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-stone-200 z-50 p-2 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="px-3 py-2 border-b border-stone-100">
              <p className="text-xs font-bold text-stone-900">Switch Ecosystem Role</p>
              <p className="text-[11px] text-stone-500">
                Experience role-tailored dashboards and operational controls.
              </p>
            </div>
            <div className="py-1 space-y-1">
              {ROLES.map((role) => {
                const Icon = role.icon;
                const isSelected = role.id === activeRole;
                return (
                  <button
                    key={role.id}
                    onClick={() => {
                      setActiveRole(role.id);
                      setOpen(false);
                    }}
                    className={`w-full text-left p-2.5 rounded-xl transition-colors flex items-start gap-3 ${
                      isSelected
                        ? "bg-agri-green-50 border border-agri-green-200"
                        : "hover:bg-stone-50"
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${isSelected ? role.badgeColor : "bg-stone-100 text-stone-600"}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-stone-900">
                          {role.title}
                        </span>
                        <span className="text-[10px] font-medium text-agri-green-800 bg-agri-green-100/60 px-1.5 py-0.5 rounded">
                          {role.marathi}
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-500 truncate mt-0.5">
                        {role.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
