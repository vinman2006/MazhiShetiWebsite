"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAppState } from "@/lib/store";
import {
  ShoppingBag,
  PlusCircle,
  MapPin,
  CheckCircle2,
  TrendingUp,
  Tag,
  ShieldCheck,
  Search,
} from "lucide-react";

export default function MarketplacePage() {
  const { data, addMarketListing } = useAppState();
  const [showAddModal, setShowAddModal] = useState(false);
  const [crop, setCrop] = useState("");
  const [variety, setVariety] = useState("");
  const [grade, setGrade] = useState("Grade A - Clean Handpicked");
  const [quantityKg, setQuantityKg] = useState(2500);
  const [pricePerKg, setPricePerKg] = useState(55);
  const [location, setLocation] = useState("Wardha Farm Gate");
  const [successMsg, setSuccessMsg] = useState("");

  const listings = data.marketplace;

  const handleAddListing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!crop || !variety) {
      alert("Please provide the crop name and variety.");
      return;
    }
    addMarketListing(crop, variety, grade, quantityKg, pricePerKg, location);
    setShowAddModal(false);
    setSuccessMsg("Harvest lot listed on the Wholesale Mandi Exchange successfully!");
    setCrop("");
    setVariety("");
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  return (
    <div className="min-h-screen bg-[#fdfbf7] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-stone-200">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-900 text-xs font-bold mb-2">
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>थोक कृषी बाजार • Direct Farm-to-Table Mandi</span>
            </div>
            <h1 className="text-3xl font-black text-stone-900 tracking-tight">
              Produce Marketplace
            </h1>
            <p className="text-xs text-stone-600 mt-1">
              Direct procurement from certified growers across Maharashtra without middlemen fees.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-agri-green-900 hover:bg-agri-green-800 text-white text-xs font-bold shadow-md transition active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>List My Harvest Lot</span>
          </button>
        </div>

        {successMsg && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold animate-in fade-in flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Listings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {listings.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl overflow-hidden shadow-card hover:shadow-card-hover border border-stone-200 transition flex flex-col justify-between"
            >
              <div>
                <div className="h-44 w-full relative overflow-hidden bg-stone-100">
                  <img
                    src={item.image}
                    alt={item.crop}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-stone-900 text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-sm">
                    {item.grade}
                  </span>
                </div>

                <div className="p-5 space-y-3">
                  <div>
                    <h4 className="text-base font-extrabold text-stone-900 leading-snug">
                      {item.crop}
                    </h4>
                    <p className="text-xs text-stone-500">{item.variety}</p>
                  </div>

                  <div className="space-y-1.5 text-xs text-stone-700 pt-2 border-t border-stone-100">
                    <div className="flex justify-between">
                      <span>Available Lot:</span>
                      <strong className="text-stone-900">{item.quantityKg.toLocaleString()} kg</strong>
                    </div>
                    <div className="flex justify-between items-baseline">
                      <span>Price:</span>
                      <strong className="text-base font-black text-agri-green-950">₹{item.pricePerKg}/kg</strong>
                    </div>
                    <div className="flex justify-between text-[11px] text-stone-500">
                      <span>Mandi Benchmark:</span>
                      <span>₹{item.mandiBenchmarkPrice}/kg</span>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-stone-500 pt-1">
                      <MapPin className="w-3.5 h-3.5 text-stone-400 flex-shrink-0" />
                      <span className="truncate">{item.location}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0">
                <Link
                  href="/dashboard/buyer"
                  className="block w-full py-2.5 rounded-xl text-center text-xs font-bold bg-purple-700 hover:bg-purple-800 text-white shadow-sm transition active:scale-95"
                >
                  Inspect & Place Offer
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Modal to list harvest */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-4 shadow-2xl">
              <h3 className="text-lg font-black text-stone-900">List Your Ready Harvest</h3>
              <p className="text-xs text-stone-500">
                Connect with bulk buyers, exporters, and APMC traders directly from your field.
              </p>

              <form onSubmit={handleAddListing} className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Crop Name:</label>
                  <input
                    type="text"
                    value={crop}
                    onChange={(e) => setCrop(e.target.value)}
                    placeholder="e.g. Certified Bt-Cotton / Soybean / Nagpur Orange"
                    className="w-full text-xs p-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-agri-green-800 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Variety / Quality Tag:</label>
                  <input
                    type="text"
                    value={variety}
                    onChange={(e) => setVariety(e.target.value)}
                    placeholder="e.g. Ajeet 155 BG-II (29.5mm Staple)"
                    className="w-full text-xs p-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-agri-green-800 focus:outline-none"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Quantity (kg):</label>
                    <input
                      type="number"
                      value={quantityKg}
                      onChange={(e) => setQuantityKg(Number(e.target.value))}
                      className="w-full text-xs p-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-agri-green-800 focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Expected Price (₹/kg):</label>
                    <input
                      type="number"
                      step="0.5"
                      value={pricePerKg}
                      onChange={(e) => setPricePerKg(Number(e.target.value))}
                      className="w-full text-xs p-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-agri-green-800 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-stone-100">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 text-xs font-bold text-stone-600 hover:bg-stone-100 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold bg-agri-green-900 hover:bg-agri-green-800 text-white rounded-xl shadow-md"
                  >
                    Publish Harvest Lot
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
