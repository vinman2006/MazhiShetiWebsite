"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAppState } from "@/lib/store";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { SearchBar } from "@/components/ui/Breadcrumbs";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import {
  ShoppingBag,
  TrendingUp,
  MapPin,
  CheckCircle2,
  Calendar,
  Search,
  Filter,
  DollarSign,
  PackageCheck,
  ShieldCheck,
  LayoutDashboard,
  Wrench,
} from "lucide-react";

export default function BuyerDashboard() {
  const { data } = useAppState();
  const [filterQuery, setFilterQuery] = useState("");
  const [selectedLot, setSelectedLot] = useState<any>(null);
  const [bidAmount, setBidAmount] = useState<number>(0);
  const [bidSuccess, setBidSuccess] = useState(false);

  const buyer = data.users.find((u) => u.role === "buyer") || data.users[3];
  const listings = data.marketplace.filter((m) =>
    m.crop.toLowerCase().includes(filterQuery.toLowerCase()) ||
    m.location.toLowerCase().includes(filterQuery.toLowerCase())
  );

  const handlePlaceBid = (e: React.FormEvent) => {
    e.preventDefault();
    setBidSuccess(true);
    setTimeout(() => {
      setBidSuccess(false);
      setSelectedLot(null);
    }, 3000);
  };

  const navItems = [
    { label: "Mandi Trading Lots", href: "/dashboard/buyer", icon: LayoutDashboard, badge: `${listings.length}` },
    { label: "Public Marketplace", href: "/marketplace", icon: ShoppingBag },
    { label: "Transport Logistics", href: "/rentals", icon: Wrench },
  ];

  return (
    <DashboardShell
      navItems={navItems}
      roleTitle="Wholesale Mandi Desk"
      roleSubtitle={`${buyer.organizationName}`}
      roleIcon={ShoppingBag}
    >
      <div className="space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-950 via-purple-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-purple-300 text-xs font-bold">
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>थोक कृषी खरेदी केंद्र • Wholesale Mandi & Export Desk</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{buyer.organizationName}</h1>
              <p className="text-xs text-purple-200">
                Trader: {buyer.fullName} • Licensed APMC Buyer (Vashi / Lasalgaon / Nagpur)
              </p>
            </div>

            <div className="bg-white/10 px-5 py-3 rounded-2xl backdrop-blur-sm border border-white/10 text-right">
              <span className="text-2xl font-black text-purple-300 font-mono">28.5 MT</span>
              <p className="text-[11px] text-stone-200 font-medium">Procured This Kharif Season</p>
            </div>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <SearchBar
            value={filterQuery}
            onChange={setFilterQuery}
            placeholder="Search by crop (Cotton, Banana, Onion, Orange)..."
            className="w-full sm:w-96"
          />
          <Badge variant="lime">{listings.length} Farm-Gate Lots Available</Badge>
        </div>

        {/* Success Alert */}
        {bidSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Procurement offer submitted to farmer! An escrow contract will be initiated upon approval.</span>
          </div>
        )}

        {/* Listings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {listings.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl overflow-hidden shadow-card hover:shadow-card-hover border border-slate-200 transition flex flex-col justify-between"
            >
              <div>
                <div className="h-44 w-full relative overflow-hidden bg-slate-100">
                  <img
                    src={item.image}
                    alt={item.crop}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge variant="neutral">{item.grade}</Badge>
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <div>
                    <h4 className="text-base font-extrabold text-brand-text leading-snug">{item.crop}</h4>
                    <p className="text-xs text-slate-500">{item.variety}</p>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-700 pt-2 border-t border-slate-100">
                    <div className="flex justify-between">
                      <span>Available Lot:</span>
                      <strong className="text-slate-900 font-mono">{item.quantityKg.toLocaleString()} kg</strong>
                    </div>
                    <div className="flex justify-between items-baseline">
                      <span>Farmer Ask:</span>
                      <strong className="text-base font-black text-purple-900 font-mono">₹{item.pricePerKg}/kg</strong>
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-500">
                      <span>Mandi Benchmark:</span>
                      <span className="font-mono">₹{item.mandiBenchmarkPrice}/kg</span>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-slate-500 pt-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span className="truncate">{item.location}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0">
                <Button
                  variant="primary"
                  size="sm"
                  className="w-full bg-purple-700 hover:bg-purple-800"
                  onClick={() => {
                    setSelectedLot(item);
                    setBidAmount(item.pricePerKg);
                  }}
                >
                  Place Procurement Bid
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Bid Modal */}
        {selectedLot && (
          <Modal
            isOpen={!!selectedLot}
            onClose={() => setSelectedLot(null)}
            title="Procurement Offer"
            description={`${selectedLot.crop} • ${selectedLot.grade} (${selectedLot.quantityKg} kg)`}
          >
            <form onSubmit={handlePlaceBid} className="space-y-4">
              <Input
                label="Your Offer Price (₹ per kg)"
                type="number"
                step="0.5"
                value={bidAmount}
                onChange={(e) => setBidAmount(Number(e.target.value))}
                helperText={`Total Estimated Order Value: ₹${(bidAmount * selectedLot.quantityKg).toLocaleString()}`}
                required
              />

              <div className="p-3 rounded-2xl bg-purple-50 text-[11px] text-purple-900 space-y-1">
                <p className="font-bold flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-purple-700" />
                  <span>Protected Farm-Gate Escrow</span>
                </p>
                <p>Payment released upon weighing and digital gate pass receipt at mandi.</p>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <Button variant="ghost" size="sm" type="button" onClick={() => setSelectedLot(null)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit" className="bg-purple-700 hover:bg-purple-800">
                  Submit Official Bid
                </Button>
              </div>
            </form>
          </Modal>
        )}
      </div>
    </DashboardShell>
  );
}
