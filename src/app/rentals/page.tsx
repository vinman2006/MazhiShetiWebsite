"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAppState } from "@/lib/store";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import {
  Wrench,
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  ShieldCheck,
  UserCheck,
  PlusCircle,
  Search,
  Filter,
  Phone,
  Fuel,
  Sliders,
  Sparkles,
  ChevronRight,
  Info,
  DollarSign,
  Droplets,
  Truck,
  Layers,
  ArrowRight,
} from "lucide-react";

const CATEGORIES = [
  "All Categories",
  "Tractors",
  "Rotavators",
  "Cultivators",
  "Seed drills",
  "Harvesters",
  "Sprayers",
  "Irrigation equipment",
  "Other farming machinery",
];

export default function RentalsPage() {
  const { data, createRentalBooking, createServiceBooking } = useAppState();

  const fleet = data.equipment || [];
  const services = data.agriculturalServices || [];
  const fields = data.fields || [];

  const [activeTab, setActiveTab] = useState<"equipment" | "services">("equipment");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");

  // Booking Modal State
  const [selectedMachine, setSelectedMachine] = useState<any>(null);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [endDate, setEndDate] = useState(
    new Date(Date.now() + 86400000).toISOString().split("T")[0]
  );
  const [duration, setDuration] = useState(1);
  const [rateType, setRateType] = useState<"hourly" | "daily">("daily");
  const [selectedFarmField, setSelectedFarmField] = useState(fields[0]?.name || "North Acre - Gat 142/A");
  const [bookingNotes, setBookingNotes] = useState("");
  const [bookingSuccessMsg, setBookingSuccessMsg] = useState<string | null>(null);

  // Filter equipment
  const filteredEquipment = fleet.filter((item) => {
    const matchesCategory =
      selectedCategory === "All Categories" || item.category === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.specs.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLocation =
      locationFilter === "all" ||
      item.location.toLowerCase().includes(locationFilter.toLowerCase());

    return matchesCategory && matchesSearch && matchesLocation;
  });

  const handleEquipmentBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMachine) return;

    const rate = rateType === "hourly" ? selectedMachine.hourlyRate : selectedMachine.dailyRate;
    const total = duration * rate;

    createRentalBooking({
      equipmentId: selectedMachine.id,
      equipmentName: selectedMachine.title,
      equipmentCategory: selectedMachine.category,
      providerId: selectedMachine.providerId,
      providerName: selectedMachine.providerName,
      farmerId: "usr_farmer_01",
      farmerName: "Rameshwar Sadashiv Shinde",
      farmerPhone: "+91 98223 41092",
      startDate,
      endDate,
      duration,
      durationUnit: rateType === "hourly" ? "hours" : "days",
      rateType,
      rateAmount: rate,
      totalAmount: total,
      farmLocation: selectedFarmField,
      operatorIncluded: selectedMachine.includesOperator,
      notes: bookingNotes,
    });

    setBookingSuccessMsg(
      `Booking request submitted for ${selectedMachine.title}! Provider ${selectedMachine.providerName} has been notified.`
    );
    setSelectedMachine(null);
    setBookingNotes("");
    setTimeout(() => setBookingSuccessMsg(null), 6000);
  };

  const handleServiceBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService) return;

    createServiceBooking({
      serviceId: selectedService.id,
      serviceName: selectedService.serviceName,
      category: selectedService.category,
      providerId: selectedService.providerId,
      providerName: selectedService.providerName,
      farmerId: "usr_farmer_01",
      farmerName: "Rameshwar Sadashiv Shinde",
      farmerPhone: "+91 98223 41092",
      scheduledDate: startDate,
      farmLocation: selectedFarmField,
      areaAcresOrSamples: duration,
      totalAmount: duration * selectedService.priceAmount,
      notes: bookingNotes,
    });

    setBookingSuccessMsg(
      `Service appointment scheduled for ${selectedService.serviceName} on ${startDate}.`
    );
    setSelectedService(null);
    setTimeout(() => setBookingSuccessMsg(null), 6000);
  };

  return (
    <div className="min-h-screen bg-[#FAFAF0] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* ===================== HERO HEADER ===================== */}
        <div className="bg-gradient-to-r from-amber-950 via-stone-900 to-brand-dark rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-brand-lime/10 blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-brand-lime text-xs font-bold">
                <Wrench className="w-3.5 h-3.5" />
                <span>कस्टम हायरिंग केंद्र • Verified Custom Hiring Center Fleet</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
                Agri-Equipment & Service Marketplace
              </h1>
              <p className="text-xs sm:text-sm text-stone-300 max-w-2xl leading-relaxed">
                Rent certified tractors, zero-till seed drills, harvesters, and RTK precision spray drones with licensed operators.
                Discover scientific soil sampling and irrigation installation services.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/dashboard/provider"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-brand-primary hover:bg-brand-dark text-white text-xs font-bold shadow-lg transition active:scale-95"
              >
                <span>Provider Fleet Portal</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* ===================== NOTIFICATION BANNER ===================== */}
        {bookingSuccessMsg && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold animate-fadeIn flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <span>{bookingSuccessMsg}</span>
            </div>
            <button
              onClick={() => setBookingSuccessMsg(null)}
              className="text-emerald-700 hover:underline font-bold"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* ===================== MARKETPLACE TAB SELECTOR ===================== */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab("equipment")}
              className={`px-5 py-2.5 rounded-2xl text-xs font-extrabold transition flex items-center gap-2 ${
                activeTab === "equipment"
                  ? "bg-brand-primary text-white shadow-sm"
                  : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              <Wrench className="w-4 h-4" />
              <span>Farm Machinery Fleet ({fleet.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("services")}
              className={`px-5 py-2.5 rounded-2xl text-xs font-extrabold transition flex items-center gap-2 ${
                activeTab === "services"
                  ? "bg-brand-primary text-white shadow-sm"
                  : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Agri-Services & Testing ({services.length})</span>
            </button>
          </div>

          <span className="hidden sm:inline-block text-xs text-slate-500 font-medium">
            100% transparent rates • Pay upon job completion
          </span>
        </div>

        {/* ===================== EQUIPMENT TAB ===================== */}
        {activeTab === "equipment" && (
          <div className="space-y-6">
            {/* Search & Filter Toolbar */}
            <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="relative flex-1 w-full">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search machinery by name, HP, category, or provider..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary"
                  />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <select
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    className="w-full sm:w-auto px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                  >
                    <option value="all">All Locations</option>
                    <option value="Wardha">Wardha District</option>
                    <option value="Nagpur">Nagpur District</option>
                    <option value="Jalgaon">Jalgaon District</option>
                    <option value="Amravati">Amravati District</option>
                  </select>
                </div>
              </div>

              {/* Category Pills Bar */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                      selectedCategory === cat
                        ? "bg-brand-primary text-white shadow-xs"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Equipment Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEquipment.map((machine) => (
                <div
                  key={machine.id}
                  className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-md transition flex flex-col justify-between group"
                >
                  <div>
                    {/* Machine Image Banner */}
                    <div className="h-48 w-full bg-slate-100 relative overflow-hidden">
                      <img
                        src={machine.imageUrl}
                        alt={machine.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                      <div className="absolute top-3 left-3 flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-xl bg-white/95 backdrop-blur-sm text-brand-dark text-[11px] font-extrabold shadow-xs">
                          {machine.category}
                        </span>
                      </div>

                      <div className="absolute top-3 right-3">
                        <span className="px-2.5 py-1 rounded-xl bg-emerald-500/90 text-white text-[11px] font-extrabold flex items-center gap-1 shadow-xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                          Available
                        </span>
                      </div>
                    </div>

                    {/* Machine Details */}
                    <div className="p-5 space-y-3">
                      <div>
                        <h3 className="text-base font-extrabold text-brand-text group-hover:text-brand-primary transition">
                          {machine.title}
                        </h3>
                        <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                          {machine.manufacturer} • {machine.horsepowerOrCapacity}
                        </p>
                      </div>

                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {machine.description}
                      </p>

                      {/* Specs Pill Box */}
                      <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/60 text-xs space-y-1.5">
                        <div className="flex items-center gap-1.5 text-slate-700">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                          <span className="truncate">{machine.specs}</span>
                        </div>
                        <div className="flex items-center justify-between text-slate-500 text-[11px] pt-1 border-t border-slate-200/50">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            {machine.location}
                          </span>
                          <span className="text-emerald-700 font-bold">
                            {machine.includesOperator ? "Operator Included" : "Self-Drive"}
                          </span>
                        </div>
                      </div>

                      {/* Operating Conditions note */}
                      <div className="text-[11px] text-slate-500 flex items-start gap-1.5">
                        <Fuel className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{machine.operatingConditions}</span>
                      </div>
                    </div>
                  </div>

                  {/* Pricing and Booking Footer */}
                  <div className="p-5 border-t border-slate-100 bg-stone-50/50 flex items-center justify-between">
                    <div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-lg font-black text-brand-dark">₹{machine.hourlyRate}</span>
                        <span className="text-[10px] text-slate-500 font-bold">/hr</span>
                        <span className="text-slate-300 mx-1">•</span>
                        <span className="text-xs font-extrabold text-slate-700">₹{machine.dailyRate}</span>
                        <span className="text-[10px] text-slate-500 font-bold">/day</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium">Min: {machine.minimumRentalDuration}</span>
                    </div>

                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => {
                        setSelectedMachine(machine);
                        setRateType("daily");
                        setDuration(1);
                      }}
                      className="text-xs font-bold"
                    >
                      Book Machine
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================== SERVICES TAB ===================== */}
        {activeTab === "services" && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-1">
              <h2 className="text-base font-extrabold text-brand-text">
                Agricultural Services & Technical Consultations
              </h2>
              <p className="text-xs text-slate-500">
                Book professional NABL accredited soil testing, certified organic conversion audits, and precision drone pilots.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((srv) => (
                <div
                  key={srv.id}
                  className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-5 hover:border-brand-primary/50 transition"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <span className="px-2.5 py-1 rounded-xl bg-purple-50 text-purple-700 text-[10px] font-extrabold uppercase tracking-wider border border-purple-200/60">
                        {srv.category.replace(/_/g, " ")}
                      </span>
                      <span className="text-xs font-bold text-amber-600 flex items-center gap-1">
                        ★ {srv.rating}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-extrabold text-brand-text leading-snug">
                        {srv.serviceName}
                      </h3>
                      <p className="text-xs text-brand-primary font-bold mt-0.5">
                        {srv.providerName}
                      </p>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                      {srv.description}
                    </p>

                    <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/60 text-xs space-y-1">
                      <div className="flex items-center justify-between text-slate-700">
                        <span className="text-slate-400 text-[11px]">Accreditation:</span>
                        <strong className="text-brand-dark">{srv.certifiedBadge}</strong>
                      </div>
                      <div className="flex items-center justify-between text-slate-500 text-[11px]">
                        <span>Service Coverage:</span>
                        <span className="text-slate-700">{srv.serviceLocations}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-xl font-black text-brand-dark">₹{srv.priceAmount}</span>
                      <span className="text-[10px] text-slate-500 font-bold ml-1">
                        / {srv.pricingModel.replace(/_/g, " ")}
                      </span>
                    </div>

                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => setSelectedService(srv)}
                      className="text-xs font-bold"
                    >
                      Book Service
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================== BOOK EQUIPMENT MODAL ===================== */}
        {selectedMachine && (
          <Modal
            isOpen={!!selectedMachine}
            onClose={() => setSelectedMachine(null)}
            title={`Book Machinery: ${selectedMachine.title}`}
            maxWidth="md"
          >
            <form onSubmit={handleEquipmentBookSubmit} className="space-y-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/70 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-700">Provider:</span>
                  <strong className="text-brand-dark">{selectedMachine.providerName}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Contact / Helpline:</span>
                  <span className="font-mono text-slate-700 font-bold">{selectedMachine.providerPhone}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Operator Policy:</span>
                  <span className="text-emerald-700 font-bold">
                    {selectedMachine.includesOperator ? "Certified Operator Included" : "Self-Drive"}
                  </span>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Deliver to Field Parcel *
                </label>
                <select
                  value={selectedFarmField}
                  onChange={(e) => setSelectedFarmField(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white font-medium focus:ring-2 focus:ring-brand-primary"
                  required
                >
                  {fields.map((f) => (
                    <option key={f.id} value={f.name}>
                      {f.name} ({f.areaAcres} Acres - {f.soilType})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Start Date *</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium focus:ring-2 focus:ring-brand-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">End Date *</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium focus:ring-2 focus:ring-brand-primary"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Rate Structure *</label>
                  <select
                    value={rateType}
                    onChange={(e) => setRateType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium focus:ring-2 focus:ring-brand-primary"
                  >
                    <option value="daily">Daily Rate (₹{selectedMachine.dailyRate}/day)</option>
                    <option value="hourly">Hourly Rate (₹{selectedMachine.hourlyRate}/hr)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Duration ({rateType === "hourly" ? "Hours" : "Days"}) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium focus:ring-2 focus:ring-brand-primary"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Special Instructions for Operator</label>
                <textarea
                  rows={2}
                  value={bookingNotes}
                  onChange={(e) => setBookingNotes(e.target.value)}
                  placeholder="e.g. Field access from south canal gate; deep plowing required..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium focus:ring-2 focus:ring-brand-primary"
                />
              </div>

              {/* Total Calculation Strip */}
              <div className="p-4 rounded-2xl bg-brand-light/70 border border-brand-light flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-500 block font-bold">Estimated Total Rental</span>
                  <span className="text-xl font-black text-brand-dark">
                    ₹{(duration * (rateType === "hourly" ? selectedMachine.hourlyRate : selectedMachine.dailyRate)).toLocaleString()}
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 font-medium">Payment after job completion</span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  onClick={() => setSelectedMachine(null)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="md">
                  Confirm Booking Request
                </Button>
              </div>
            </form>
          </Modal>
        )}

        {/* ===================== BOOK SERVICE MODAL ===================== */}
        {selectedService && (
          <Modal
            isOpen={!!selectedService}
            onClose={() => setSelectedService(null)}
            title={`Schedule Service: ${selectedService.serviceName}`}
            maxWidth="md"
          >
            <form onSubmit={handleServiceBookSubmit} className="space-y-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/70 space-y-1">
                <span className="text-slate-500">Service Agency:</span>
                <strong className="text-brand-dark block text-sm">{selectedService.providerName}</strong>
                <span className="text-[11px] text-emerald-700 font-bold block">{selectedService.certifiedBadge}</span>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Farm Field *</label>
                <select
                  value={selectedFarmField}
                  onChange={(e) => setSelectedFarmField(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white font-medium focus:ring-2 focus:ring-brand-primary"
                  required
                >
                  {fields.map((f) => (
                    <option key={f.id} value={f.name}>
                      {f.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Preferred Date *</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium focus:ring-2 focus:ring-brand-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Units ({selectedService.pricingModel.replace(/_/g, " ")}) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium focus:ring-2 focus:ring-brand-primary"
                    required
                  />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-brand-light/70 border border-brand-light flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-500 block font-bold">Total Service Fee</span>
                  <span className="text-xl font-black text-brand-dark">
                    ₹{(duration * selectedService.priceAmount).toLocaleString()}
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 font-medium">Technician arrives on site</span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  onClick={() => setSelectedService(null)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="md">
                  Schedule Service
                </Button>
              </div>
            </form>
          </Modal>
        )}
      </div>
    </div>
  );
}
