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
  Wrench,
  PlusCircle,
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  TrendingUp,
  Truck,
  LayoutDashboard,
  ShoppingBag,
  Stethoscope,
} from "lucide-react";

export default function ProviderDashboard() {
  const { data } = useAppState();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("Tractor");
  const [newHourlyRate, setNewHourlyRate] = useState(850);
  const [newDailyRate, setNewDailyRate] = useState(6500);

  const provider = data.users.find((u) => u.role === "provider") || data.users[2];
  const fleet = data.equipment;

  const navItems = [
    { label: "Fleet & Bookings", href: "/dashboard/provider", icon: LayoutDashboard },
    { label: "Public Equipment Hub", href: "/rentals", icon: Wrench },
    { label: "Produce Mandi", href: "/marketplace", icon: ShoppingBag },
    { label: "Agronomy Network", href: "/advisory", icon: Stethoscope },
  ];

  return (
    <DashboardShell
      navItems={navItems}
      roleTitle="Custom Hiring Center"
      roleSubtitle={`${provider.organizationName} • Jalgaon`}
      roleIcon={Wrench}
    >
      <div className="space-y-8">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-amber-950 via-amber-900 to-orange-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-bold">
                <Wrench className="w-3.5 h-3.5" />
                <span>कस्टम हायरिंग सेंटर • Custom Hiring Fleet Hub</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                {provider.organizationName}
              </h1>
              <p className="text-xs text-amber-200">
                Operator: {provider.fullName} • Base Hub: {provider.village}, {provider.district}
              </p>
            </div>

            <div className="flex items-center gap-4 bg-white/10 px-5 py-3 rounded-2xl backdrop-blur-sm border border-white/10 text-right">
              <div>
                <span className="text-2xl font-black text-amber-300">₹84,500</span>
                <p className="text-[11px] text-stone-200 font-medium">This Month&apos;s Rental Revenue</p>
              </div>
            </div>
          </div>
        </div>

        {/* Fleet Inventory Management */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <div>
              <h3 className="text-base font-bold text-brand-text">Active Machinery & Drone Fleet</h3>
              <p className="text-xs text-slate-500">
                Manage live equipment availability, rental rates, and certified operators.
              </p>
            </div>
            <Button
              size="sm"
              variant="accent"
              onClick={() => setShowAddModal(true)}
              leftIcon={<PlusCircle className="w-4 h-4" />}
            >
              Register Machine
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {fleet.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl p-6 shadow-card border border-slate-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="warning">{item.category}</Badge>
                    <Badge variant="success" dot>Available</Badge>
                  </div>

                  <h4 className="text-base font-extrabold text-brand-text leading-snug">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    {item.specs}
                  </p>

                  <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-700">
                    <div className="flex justify-between">
                      <span>Hourly Rate:</span>
                      <strong className="text-brand-text font-mono">₹{item.hourlyRate}/hr</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Full Day Rate:</span>
                      <strong className="text-brand-text font-mono">₹{item.dailyRate}/day</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Operator:</span>
                      <strong className="text-emerald-700">Trained Driver Included</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Location:</span>
                      <span className="text-slate-600">{item.location}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    Edit Rates
                  </Button>
                  <Button variant="primary" size="sm" className="flex-1">
                    View Schedule
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal for adding new machine */}
        <Modal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="Register New Fleet Equipment"
          description="List tractors, sprayers, harvesters, or drones available for rental booking."
          footer={
            <>
              <Button variant="ghost" size="sm" onClick={() => setShowAddModal(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  alert("Machine registered to fleet successfully!");
                  setShowAddModal(false);
                }}
              >
                Save to Fleet
              </Button>
            </>
          }
        >
          <div className="space-y-3">
            <Input
              label="Equipment Name / Model"
              placeholder="e.g. John Deere 5050D 50HP 4WD"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              required
            />
            <div className="grid grid-cols-2 gap-3">
              <Select
                label="Category"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                options={[
                  { value: "Tractor", label: "Tractor" },
                  { value: "Drone Sprayer", label: "Drone Sprayer" },
                  { value: "Harvester", label: "Harvester" },
                  { value: "Laser Leveler", label: "Laser Leveler" },
                  { value: "Rotavator", label: "Rotavator" },
                ]}
              />
              <Input
                label="Daily Rate (₹)"
                type="number"
                value={newDailyRate}
                onChange={(e) => setNewDailyRate(Number(e.target.value))}
                required
              />
            </div>
          </div>
        </Modal>
      </div>
    </DashboardShell>
  );
}
