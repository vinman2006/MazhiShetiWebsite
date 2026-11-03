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
  XCircle,
  Calendar,
  Clock,
  MapPin,
  TrendingUp,
  Truck,
  LayoutDashboard,
  ShoppingBag,
  Stethoscope,
  IndianRupee,
  Check,
  X,
  Phone,
  User,
  Power,
  ShieldCheck,
  Sparkles,
  Layers,
  Activity,
} from "lucide-react";
import { EquipmentListingItem } from "@/db/seed-data";

export default function ProviderDashboard() {
  const {
    data,
    addEquipmentListing,
    updateEquipmentAvailability,
    updateBookingStatus,
    updateServiceBookingStatus,
  } = useAppState();

  const [activeTab, setActiveTab] = useState<"bookings" | "fleet" | "services">("bookings");
  const [bookingFilter, setBookingFilter] = useState<"all" | "requested" | "confirmed" | "completed">("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // New Equipment Form State
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState<EquipmentListingItem["category"]>("Tractors");
  const [newManufacturer, setNewManufacturer] = useState("Mahindra");
  const [newModel, setNewModel] = useState("");
  const [newHpOrCap, setNewHpOrCap] = useState("50 HP");
  const [newHourlyRate, setNewHourlyRate] = useState(850);
  const [newDailyRate, setNewDailyRate] = useState(6500);
  const [newLocation, setNewLocation] = useState("Jalgaon Rural Hub");
  const [newTaluka, setNewTaluka] = useState("Jalgaon");
  const [newDistrict, setNewDistrict] = useState("Jalgaon");
  const [newOperator, setNewOperator] = useState(true);
  const [newConditions, setNewConditions] = useState("Fuel provided by hirer. Minimum 2 hours booking.");
  const [newSpecs, setNewSpecs] = useState("Heavy duty, 4WD, dual clutch, power steering");
  const [newMinDuration, setNewMinDuration] = useState("2 Hours");

  const provider = data.users.find((u) => u.role === "provider") || data.users[2];
  const fleet = data.equipment || [];
  const rentalBookings = data.rentalBookings || [];
  const serviceBookings = data.serviceBookings || [];

  // Metrics computation
  const totalFleetCount = fleet.length;
  const availableFleetCount = fleet.filter((m) => m.isAvailable).length;
  const pendingRequests = rentalBookings.filter((b) => b.status === "requested");
  const activeRentals = rentalBookings.filter((b) => b.status === "confirmed" || b.status === "dispatched");
  const completedRentals = rentalBookings.filter((b) => b.status === "completed");
  
  const totalRevenue = rentalBookings
    .filter((b) => b.status === "confirmed" || b.status === "dispatched" || b.status === "completed")
    .reduce((sum, b) => sum + (b.totalAmount || 0), 0);

  const navItems = [
    { label: "Fleet & Bookings", href: "/dashboard/provider", icon: LayoutDashboard },
    { label: "Public Equipment Hub", href: "/rentals", icon: Wrench },
    { label: "Produce Mandi", href: "/marketplace", icon: ShoppingBag },
    { label: "Agronomy Advisory", href: "/advisory", icon: Stethoscope },
  ];

  const triggerToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 4000);
  };

  const handleCreateEquipment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addEquipmentListing({
      providerId: provider.id,
      providerName: provider.organizationName || provider.fullName,
      providerPhone: provider.phone,
      title: newTitle.trim(),
      category: newCategory,
      manufacturer: newManufacturer,
      modelNumber: newModel || undefined,
      horsepowerOrCapacity: newHpOrCap,
      hourlyRate: Number(newHourlyRate),
      dailyRate: Number(newDailyRate),
      location: newLocation,
      locationTaluka: newTaluka,
      locationDistrict: newDistrict,
      includesOperator: newOperator,
      operatingConditions: newConditions,
      minimumRentalDuration: newMinDuration,
      isAvailable: true,
      imageUrl: "https://images.unsplash.com/photo-1592982537447-6f2a6a0c5c1b?auto=format&fit=crop&w=800&q=80",
      specs: newSpecs,
      rating: 4.8,
      status: "active",
      description: `${newTitle} by ${newManufacturer}. Ideal for precision farming, reliable performance in Maharashtra conditions.`,
    });

    setShowAddModal(false);
    triggerToast(`Machine "${newTitle}" added to your live rental fleet!`);
    // Reset inputs
    setNewTitle("");
    setModelDefaults();
  };

  const setModelDefaults = () => {
    setNewModel("");
    setNewHourlyRate(850);
    setNewDailyRate(6500);
  };

  const filteredBookings = rentalBookings.filter((b) => {
    if (bookingFilter === "all") return true;
    if (bookingFilter === "requested") return b.status === "requested";
    if (bookingFilter === "confirmed") return b.status === "confirmed" || b.status === "dispatched";
    if (bookingFilter === "completed") return b.status === "completed" || b.status === "rejected" || b.status === "cancelled";
    return true;
  });

  return (
    <DashboardShell
      navItems={navItems}
      roleTitle="Custom Hiring Center"
      roleSubtitle={`${provider.organizationName || "Shivaji Agri Machinery Hub"} • ${provider.district}`}
      roleIcon={Wrench}
    >
      <div className="space-y-8">
        {/* Toast Notification */}
        {successToast && (
          <div className="fixed bottom-6 right-6 z-50 bg-emerald-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-emerald-700 animate-in fade-in slide-in-from-bottom-5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <p className="text-sm font-semibold">{successToast}</p>
          </div>
        )}

        {/* Header Hero Banner */}
        <div className="bg-gradient-to-r from-amber-950 via-amber-900 to-orange-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-bold backdrop-blur-sm">
                <Wrench className="w-3.5 h-3.5" />
                <span>कस्टम हायरिंग केंद्र • Verified Custom Hiring Center</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                {provider.organizationName || "MahaAgri Custom Hiring Center"}
              </h1>
              <p className="text-xs text-amber-200">
                Hub Operator: <span className="font-semibold text-white">{provider.fullName}</span> • Location: {provider.village}, {provider.taluka}, {provider.district}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <div className="bg-white/10 px-5 py-3 rounded-2xl backdrop-blur-sm border border-white/10">
                <span className="text-2xl font-black text-amber-300 font-mono">
                  ₹{totalRevenue.toLocaleString("en-IN")}
                </span>
                <p className="text-[11px] text-stone-200 font-medium">Rental Order Value</p>
              </div>
              <Button
                variant="accent"
                onClick={() => setShowAddModal(true)}
                leftIcon={<PlusCircle className="w-4 h-4" />}
              >
                Register Machine
              </Button>
            </div>
          </div>
        </div>

        {/* KPI Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500">Fleet Strength</p>
              <h3 className="text-2xl font-black text-brand-text mt-1">{totalFleetCount} Machines</h3>
              <p className="text-[11px] text-emerald-600 font-medium mt-1">
                {availableFleetCount} ready to dispatch
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Truck className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500">Pending Requests</p>
              <h3 className="text-2xl font-black text-amber-600 mt-1">{pendingRequests.length} Bookings</h3>
              <p className="text-[11px] text-slate-500 font-medium mt-1">
                Awaiting your approval
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500">Active Field Deployments</p>
              <h3 className="text-2xl font-black text-blue-700 mt-1">{activeRentals.length} Machines</h3>
              <p className="text-[11px] text-blue-600 font-medium mt-1">
                Currently deployed on farms
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <Activity className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500">Completed Orders</p>
              <h3 className="text-2xl font-black text-slate-800 mt-1">{completedRentals.length} Jobs</h3>
              <p className="text-[11px] text-emerald-600 font-medium mt-1">
                100% verified farmer satisfaction
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-slate-200 space-x-2">
          <button
            onClick={() => setActiveTab("bookings")}
            className={`pb-3 px-4 font-bold text-sm transition-all border-b-2 flex items-center gap-2 ${
              activeTab === "bookings"
                ? "border-emerald-600 text-emerald-800"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Incoming Rental Requests</span>
            {pendingRequests.length > 0 && (
              <span className="bg-amber-500 text-white text-[10px] px-2 py-0.5 rounded-full font-black">
                {pendingRequests.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("fleet")}
            className={`pb-3 px-4 font-bold text-sm transition-all border-b-2 flex items-center gap-2 ${
              activeTab === "fleet"
                ? "border-emerald-600 text-emerald-800"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>Equipment Fleet Management ({fleet.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("services")}
            className={`pb-3 px-4 font-bold text-sm transition-all border-b-2 flex items-center gap-2 ${
              activeTab === "services"
                ? "border-emerald-600 text-emerald-800"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Agri Services Bookings ({serviceBookings.length})</span>
          </button>
        </div>

        {/* ===================== TAB 1: RENTAL BOOKINGS DESK ===================== */}
        {activeTab === "bookings" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-black text-brand-text">Booking Approvals & Dispatch Desk</h2>
                <p className="text-xs text-slate-500">
                  Review booking requests, allocate operators, dispatch tractors and mark orders completed.
                </p>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                <button
                  onClick={() => setBookingFilter("all")}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    bookingFilter === "all" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600"
                  }`}
                >
                  All ({rentalBookings.length})
                </button>
                <button
                  onClick={() => setBookingFilter("requested")}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    bookingFilter === "requested" ? "bg-white text-amber-700 shadow-sm" : "text-slate-600"
                  }`}
                >
                  Pending ({pendingRequests.length})
                </button>
                <button
                  onClick={() => setBookingFilter("confirmed")}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    bookingFilter === "confirmed" ? "bg-white text-blue-700 shadow-sm" : "text-slate-600"
                  }`}
                >
                  Active ({activeRentals.length})
                </button>
                <button
                  onClick={() => setBookingFilter("completed")}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    bookingFilter === "completed" ? "bg-white text-emerald-700 shadow-sm" : "text-slate-600"
                  }`}
                >
                  History ({completedRentals.length})
                </button>
              </div>
            </div>

            {filteredBookings.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-200">
                <Clock className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h4 className="text-base font-bold text-slate-700">No bookings in this category</h4>
                <p className="text-xs text-slate-500 mt-1">
                  New rental reservations submitted by farmers in your region will appear here.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {filteredBookings.map((b) => (
                  <div
                    key={b.id}
                    className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card flex flex-col justify-between"
                  >
                    <div className="space-y-4">
                      {/* Card Top */}
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                              {b.id}
                            </span>
                            <Badge variant="neutral">{b.equipmentCategory}</Badge>
                          </div>
                          <h4 className="text-base font-extrabold text-brand-text">{b.equipmentName}</h4>
                        </div>

                        {b.status === "requested" && <Badge variant="warning" dot>Requested</Badge>}
                        {b.status === "confirmed" && <Badge variant="info" dot>Confirmed</Badge>}
                        {b.status === "dispatched" && <Badge variant="lime" dot>Dispatched</Badge>}
                        {b.status === "completed" && <Badge variant="success">Completed</Badge>}
                        {b.status === "rejected" && <Badge variant="danger">Rejected</Badge>}
                        {b.status === "cancelled" && <Badge variant="neutral">Cancelled</Badge>}
                      </div>

                      {/* Farmer Details Box */}
                      <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500 flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-slate-400" />
                            Farmer Client:
                          </span>
                          <span className="font-bold text-slate-800">{b.farmerName}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500 flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5 text-slate-400" />
                            Phone Number:
                          </span>
                          <a
                            href={`tel:${b.farmerPhone}`}
                            className="font-mono text-emerald-700 hover:underline font-semibold"
                          >
                            {b.farmerPhone}
                          </a>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500 flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            Farm Location:
                          </span>
                          <span className="text-slate-700 font-medium">{b.farmLocation}</span>
                        </div>
                      </div>

                      {/* Booking Terms */}
                      <div className="grid grid-cols-2 gap-3 text-xs bg-amber-50/50 p-3.5 rounded-2xl border border-amber-100">
                        <div>
                          <p className="text-[11px] text-amber-900/70">Scheduled Slot</p>
                          <p className="font-bold text-amber-950 mt-0.5">
                            {b.startDate} {b.startDate !== b.endDate && `to ${b.endDate}`}
                          </p>
                          <p className="text-[10px] text-amber-800">
                            {b.duration} {b.durationUnit} ({b.rateType} billing)
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[11px] text-amber-900/70">Total Order Amount</p>
                          <p className="text-lg font-black text-brand-dark font-mono mt-0.5">
                            ₹{b.totalAmount.toLocaleString("en-IN")}
                          </p>
                          <p className="text-[10px] text-emerald-700 font-semibold">
                            {b.operatorIncluded ? "Operator Included" : "Self-Drive"}
                          </p>
                        </div>
                      </div>

                      {b.notes && (
                        <p className="text-xs text-slate-600 bg-white p-3 rounded-xl border border-slate-200 italic">
                          &quot;{b.notes}&quot;
                        </p>
                      )}
                    </div>

                    {/* Action Controls */}
                    <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2">
                      {b.status === "requested" && (
                        <>
                          <Button
                            variant="primary"
                            size="sm"
                            className="flex-1"
                            onClick={() => {
                              updateBookingStatus(b.id, "confirmed");
                              triggerToast(`Booking ${b.id} confirmed for ${b.farmerName}`);
                            }}
                            leftIcon={<Check className="w-4 h-4" />}
                          >
                            Accept Booking
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => {
                              updateBookingStatus(b.id, "rejected");
                              triggerToast(`Booking ${b.id} declined`);
                            }}
                            leftIcon={<X className="w-4 h-4" />}
                          >
                            Decline
                          </Button>
                        </>
                      )}

                      {b.status === "confirmed" && (
                        <>
                          <Button
                            variant="accent"
                            size="sm"
                            className="flex-1"
                            onClick={() => {
                              updateBookingStatus(b.id, "dispatched");
                              triggerToast(`Equipment dispatched to ${b.farmLocation}`);
                            }}
                            leftIcon={<Truck className="w-4 h-4" />}
                          >
                            Dispatch Equipment
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              updateBookingStatus(b.id, "cancelled");
                              triggerToast(`Booking cancelled`);
                            }}
                          >
                            Cancel
                          </Button>
                        </>
                      )}

                      {b.status === "dispatched" && (
                        <Button
                          variant="primary"
                          size="sm"
                          className="w-full"
                          onClick={() => {
                            updateBookingStatus(b.id, "completed");
                            triggerToast(`Rental #${b.id} marked completed! Payment credited to account.`);
                          }}
                          leftIcon={<CheckCircle2 className="w-4 h-4" />}
                        >
                          Mark Completed & Close Job
                        </Button>
                      )}

                      {b.status === "completed" && (
                        <div className="w-full text-center py-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 rounded-xl">
                          ✓ Completed & Invoiced
                        </div>
                      )}

                      {(b.status === "rejected" || b.status === "cancelled") && (
                        <div className="w-full text-center py-1.5 text-xs font-semibold text-slate-500 bg-slate-100 rounded-xl">
                          Closed / Inactive
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ===================== TAB 2: FLEET INVENTORY ===================== */}
        {activeTab === "fleet" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <div>
                <h3 className="text-base font-bold text-brand-text">Active Machinery Fleet ({fleet.length})</h3>
                <p className="text-xs text-slate-500">
                  Toggle live availability, verify specs, adjust daily/hourly rates, and monitor equipment condition.
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
                      <button
                        onClick={() => {
                          const nextState = !item.isAvailable;
                          updateEquipmentAvailability(item.id, nextState);
                          triggerToast(
                            `${item.title} marked as ${nextState ? "Available" : "Maintenance / Busy"}`
                          );
                        }}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                          item.isAvailable
                            ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        <Power className={`w-3 h-3 ${item.isAvailable ? "text-emerald-600" : "text-slate-400"}`} />
                        {item.isAvailable ? "Available" : "In Maintenance"}
                      </button>
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
                        <span>Operator Support:</span>
                        <strong className={item.includesOperator ? "text-emerald-700" : "text-slate-600"}>
                          {item.includesOperator ? "Certified Driver Included" : "Self-Drive"}
                        </strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Location:</span>
                        <span className="text-slate-600">{item.location}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2">
                    <Link href={`/rentals`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        View in Public Catalog
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================== TAB 3: SERVICES BOOKINGS ===================== */}
        {activeTab === "services" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <div>
                <h3 className="text-base font-bold text-brand-text">Agricultural Services Desk</h3>
                <p className="text-xs text-slate-500">
                  Manage soil testing, agronomy consultation, drone spraying, and irrigation installation assignments.
                </p>
              </div>
            </div>

            {serviceBookings.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-200">
                <Sparkles className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h4 className="text-base font-bold text-slate-700">No service bookings yet</h4>
                <p className="text-xs text-slate-500 mt-1">
                  When farmers request soil testing or consultation, they will appear here.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {serviceBookings.map((sb) => (
                  <div
                    key={sb.id}
                    className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Badge variant="info">{sb.category.replace(/_/g, " ").toUpperCase()}</Badge>
                        <Badge
                          variant={
                            sb.status === "confirmed"
                              ? "success"
                              : sb.status === "in_progress"
                              ? "lime"
                              : "warning"
                          }
                        >
                          {sb.status.toUpperCase()}
                        </Badge>
                      </div>

                      <h4 className="text-base font-extrabold text-brand-text">{sb.serviceName}</h4>

                      <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Client Farmer:</span>
                          <span className="font-bold text-slate-800">{sb.farmerName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Phone:</span>
                          <span className="font-mono text-emerald-700 font-semibold">{sb.farmerPhone}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Target Location:</span>
                          <span className="text-slate-700">{sb.farmLocation}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Scheduled Date:</span>
                          <span className="font-bold text-slate-900">{sb.scheduledDate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Estimated Total:</span>
                          <span className="font-black text-brand-dark font-mono text-sm">
                            ₹{sb.totalAmount.toLocaleString("en-IN")}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2">
                      {sb.status === "requested" && (
                        <Button
                          variant="primary"
                          size="sm"
                          className="w-full"
                          onClick={() => {
                            updateServiceBookingStatus(sb.id, "confirmed");
                            triggerToast(`Service booking ${sb.id} confirmed!`);
                          }}
                        >
                          Confirm Appointment
                        </Button>
                      )}

                      {sb.status === "confirmed" && (
                        <Button
                          variant="accent"
                          size="sm"
                          className="w-full"
                          onClick={() => {
                            updateServiceBookingStatus(sb.id, "completed");
                            triggerToast(`Service job completed successfully!`);
                          }}
                        >
                          Mark Service Completed
                        </Button>
                      )}

                      {sb.status === "completed" && (
                        <div className="w-full text-center py-2 text-xs font-bold text-emerald-700 bg-emerald-50 rounded-xl">
                          ✓ Completed & Certified
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Modal for Registering New Equipment */}
        <Modal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="Register New Fleet Equipment"
          description="List tractors, rotavators, sprayers, harvesters, or implements in your Custom Hiring Center."
          maxWidth="lg"
          footer={
            <>
              <Button variant="ghost" size="sm" onClick={() => setShowAddModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleCreateEquipment}>
                Publish to Marketplace
              </Button>
            </>
          }
        >
          <form onSubmit={handleCreateEquipment} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input
                label="Equipment Name & Model"
                placeholder="e.g. John Deere 5050D 50HP 4WD"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                required
              />
              <Select
                label="Category (8 Supported)"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as any)}
                options={[
                  { value: "Tractors", label: "Tractors" },
                  { value: "Rotavators", label: "Rotavators" },
                  { value: "Cultivators", label: "Cultivators" },
                  { value: "Seed drills", label: "Seed drills" },
                  { value: "Harvesters", label: "Harvesters" },
                  { value: "Sprayers", label: "Sprayers" },
                  { value: "Irrigation equipment", label: "Irrigation equipment" },
                  { value: "Other farming machinery", label: "Other farming machinery" },
                ]}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Input
                label="Manufacturer / Brand"
                placeholder="e.g. Mahindra, Swaraj, Kubota"
                value={newManufacturer}
                onChange={(e) => setNewManufacturer(e.target.value)}
                required
              />
              <Input
                label="Model Number / Edition"
                placeholder="e.g. 575 DI SP Plus"
                value={newModel}
                onChange={(e) => setNewModel(e.target.value)}
              />
              <Input
                label="Horsepower / Capacity"
                placeholder="e.g. 50 HP or 16L Tank"
                value={newHpOrCap}
                onChange={(e) => setNewHpOrCap(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Input
                label="Hourly Rate (₹)"
                type="number"
                value={newHourlyRate}
                onChange={(e) => setNewHourlyRate(Number(e.target.value))}
                required
              />
              <Input
                label="Full Day Rate (₹)"
                type="number"
                value={newDailyRate}
                onChange={(e) => setNewDailyRate(Number(e.target.value))}
                required
              />
              <Input
                label="Min Rental Duration"
                value={newMinDuration}
                onChange={(e) => setNewMinDuration(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Input
                label="Hub Location"
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
                required
              />
              <Input
                label="Taluka"
                value={newTaluka}
                onChange={(e) => setNewTaluka(e.target.value)}
                required
              />
              <Input
                label="District"
                value={newDistrict}
                onChange={(e) => setNewDistrict(e.target.value)}
                required
              />
            </div>

            <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
              <input
                type="checkbox"
                id="operatorCheck"
                checked={newOperator}
                onChange={(e) => setNewOperator(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
              />
              <label htmlFor="operatorCheck" className="text-xs text-slate-700 font-semibold cursor-pointer">
                Trained & Certified Machine Operator Included in Rental Cost
              </label>
            </div>

            <Input
              label="Key Specifications"
              placeholder="e.g. 4WD, dual clutch, reverse PTO, GPS guidance ready"
              value={newSpecs}
              onChange={(e) => setNewSpecs(e.target.value)}
            />

            <Input
              label="Operating Conditions & Terms"
              placeholder="e.g. Diesel/Fuel provided by hirer. Transport within 15km free."
              value={newConditions}
              onChange={(e) => setNewConditions(e.target.value)}
            />
          </form>
        </Modal>
      </div>
    </DashboardShell>
  );
}
