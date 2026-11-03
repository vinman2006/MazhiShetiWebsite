"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAppState } from "@/lib/store";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import {
  ShoppingBag,
  PlusCircle,
  MapPin,
  CheckCircle2,
  TrendingUp,
  Tag,
  ShieldCheck,
  Search,
  Filter,
  Phone,
  Calendar,
  Layers,
  ArrowRight,
  Truck,
  Sparkles,
  Info,
  Scale,
  DollarSign,
  User,
  Package,
} from "lucide-react";
import { ProduceListingRecord } from "@/db/seed-data";

export default function MarketplacePage() {
  const { data, addProduceListing, createPurchaseOrder } = useAppState();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("all");
  const [organicOnly, setOrganicOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState<number | "">("");

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [orderModalItem, setOrderModalItem] = useState<ProduceListingRecord | null>(null);
  const [detailModalItem, setDetailModalItem] = useState<ProduceListingRecord | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Farmer Listing Form State
  const [newCropName, setNewCropName] = useState("");
  const [newVariety, setNewVariety] = useState("");
  const [newCategory, setNewCategory] = useState<ProduceListingRecord["category"]>("oilseeds");
  const [newQuantity, setNewQuantity] = useState(50);
  const [newUnit, setNewUnit] = useState<ProduceListingRecord["unit"]>("Quintals");
  const [newPricePerUnit, setNewPricePerUnit] = useState(5200);
  const [newMoq, setNewMoq] = useState(5);
  const [newGrade, setNewGrade] = useState<ProduceListingRecord["qualityGrade"]>("Grade A (Commercial)");
  const [newHarvestDate, setNewHarvestDate] = useState("2026-11-01");
  const [newStorage, setNewStorage] = useState("Aerated dry farm warehouse");
  const [newDistrict, setNewDistrict] = useState("Wardha");
  const [newTaluka, setNewTaluka] = useState("Karanja (Lad)");
  const [newVillage, setNewVillage] = useState("Ashti");
  const [newFarmGate, setNewFarmGate] = useState("Gat No. 114, Main Road");
  const [newDescription, setNewDescription] = useState("");
  const [newIsOrganic, setNewIsOrganic] = useState(false);

  // Buyer Purchase Order Form State
  const [orderQuantity, setOrderQuantity] = useState<number>(10);
  const [deliveryMethod, setDeliveryMethod] = useState<
    "farm_gate_pickup" | "buyer_logistics" | "fpo_consolidated" | "express_cold_chain"
  >("farm_gate_pickup");
  const [deliveryAddress, setDeliveryAddress] = useState(
    "APMC Commodity Warehouse, Sector 19, Vashi, Navi Mumbai 400705"
  );
  const [scheduledDate, setScheduledDate] = useState("2026-11-10");
  const [orderInstructions, setOrderInstructions] = useState(
    "Please provide moisture test report and weighbridge receipt with consignment."
  );

  const listings = data.produceListings || [];

  const triggerToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 4000);
  };

  const handleCreateListing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCropName.trim() || !newVariety.trim()) return;

    addProduceListing({
      sellerId: data.users[0]?.id || "usr_farmer_01",
      farmerName: data.users[0]?.fullName || "Rameshwar Sadashiv Shinde",
      farmerPhone: data.users[0]?.phone || "+91 98223 41092",
      cropName: newCropName.trim(),
      variety: newVariety.trim(),
      category: newCategory,
      quantity: Number(newQuantity),
      unit: newUnit,
      pricePerUnit: Number(newPricePerUnit),
      mandiBenchmarkPrice: Math.round(Number(newPricePerUnit) * 0.92),
      minimumOrderQuantity: Number(newMoq),
      qualityGrade: newGrade,
      harvestDate: newHarvestDate,
      storageCondition: newStorage,
      description:
        newDescription.trim() ||
        `${newCropName} (${newVariety}) harvested under certified agricultural practices. Prime quality lot stored in dry conditions.`,
      locationDistrict: newDistrict,
      locationTaluka: newTaluka,
      locationVillage: newVillage,
      farmGateAddress: newFarmGate,
      primaryImageUrl: "https://images.unsplash.com/photo-1599818816946-b3cd8ae243d0?auto=format&fit=crop&q=80&w=600",
      isOrganicCertified: newIsOrganic,
      availabilityStatus: "available",
    });

    setShowAddModal(false);
    triggerToast(`Lot for "${newCropName}" published successfully to the Wholesale Mandi!`);
    setNewCropName("");
    setNewVariety("");
    setNewDescription("");
  };

  const handleOpenOrderModal = (item: ProduceListingRecord) => {
    setOrderModalItem(item);
    setOrderQuantity(item.minimumOrderQuantity || 1);
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderModalItem) return;

    if (orderQuantity < orderModalItem.minimumOrderQuantity) {
      alert(`Minimum order quantity for this lot is ${orderModalItem.minimumOrderQuantity} ${orderModalItem.unit}.`);
      return;
    }

    if (orderQuantity > orderModalItem.quantity) {
      alert(`Only ${orderModalItem.quantity} ${orderModalItem.unit} available in this lot.`);
      return;
    }

    const currentBuyer = data.users.find((u) => u.role === "buyer") || data.users[3];
    const totalAmount = Math.round(orderQuantity * orderModalItem.pricePerUnit);

    createPurchaseOrder({
      listingId: orderModalItem.id,
      farmerId: orderModalItem.sellerId,
      farmerName: orderModalItem.farmerName,
      farmerPhone: orderModalItem.farmerPhone,
      buyerId: currentBuyer?.id || "usr_buyer_01",
      buyerName: currentBuyer?.organizationName || currentBuyer?.fullName || "Sahyadri Agro Commodities",
      buyerPhone: currentBuyer?.phone || "+91 98200 44123",
      cropName: orderModalItem.cropName,
      variety: orderModalItem.variety,
      orderQuantity: Number(orderQuantity),
      unit: orderModalItem.unit,
      unitPrice: orderModalItem.pricePerUnit,
      totalAmount,
      deliveryMethod,
      deliveryAddress,
      scheduledDeliveryDate: scheduledDate,
      specialInstructions: orderInstructions,
    });

    setOrderModalItem(null);
    triggerToast(
      `Purchase order for ${orderQuantity} ${orderModalItem.unit} of ${orderModalItem.cropName} submitted! Total: ₹${totalAmount.toLocaleString("en-IN")}.`
    );
  };

  // Filter listings
  const filteredListings = listings.filter((item) => {
    if (selectedCategory !== "all" && item.category !== selectedCategory) return false;
    if (selectedDistrict !== "all" && item.locationDistrict.toLowerCase() !== selectedDistrict.toLowerCase())
      return false;
    if (organicOnly && !item.isOrganicCertified) return false;
    if (maxPrice !== "" && item.pricePerUnit > Number(maxPrice)) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = item.cropName.toLowerCase().includes(q);
      const matchVariety = item.variety.toLowerCase().includes(q);
      const matchFarmer = item.farmerName.toLowerCase().includes(q);
      const matchVillage = item.locationVillage.toLowerCase().includes(q);
      if (!matchName && !matchVariety && !matchFarmer && !matchVillage) return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#FAFAF0] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Success Toast */}
        {successToast && (
          <div className="fixed bottom-6 right-6 z-50 bg-emerald-950 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-emerald-700 animate-in fade-in slide-in-from-bottom-5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <p className="text-sm font-semibold">{successToast}</p>
          </div>
        )}

        {/* Hero Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-green-950 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-lime-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-lime-300 text-xs font-bold backdrop-blur-sm">
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>थोक कृषी बाजार • Direct Farm-to-Buyer Mandi Exchange</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
                Maharashtra Produce Mandi
              </h1>
              <p className="text-xs sm:text-sm text-emerald-200 leading-relaxed">
                Source high-grade grains, pulses, oilseeds, fruits, and organic produce directly from verified farmers.
                Transparent pricing with zero middleman commissions and secure escrow settlement.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="accent"
                onClick={() => setShowAddModal(true)}
                leftIcon={<PlusCircle className="w-4 h-4" />}
              >
                List Harvest Lot (Farmer)
              </Button>
              <Link href="/dashboard/buyer">
                <Button variant="outline" className="text-white border-white/20 hover:bg-white/10 w-full sm:w-auto">
                  Buyer Procurement Desk
                </Button>
              </Link>
            </div>
          </div>

          {/* Pricing Policy Notice */}
          <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center gap-3 text-xs text-emerald-200">
            <div className="flex items-center gap-2 font-bold text-lime-300 shrink-0">
              <Scale className="w-4 h-4" />
              <span>Pricing Transparency:</span>
            </div>
            <p className="text-[11px] leading-relaxed text-emerald-300/90">
              Every listing displays the farmer&apos;s direct asking price alongside the daily APMC Mandi MSP benchmark.
              Prices are strictly farm-gate or warehouse-packed. Platform escrow holds buyer funds until physical consignment is inspected.
            </p>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative md:col-span-2">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Search crop, variety (Soybean, Onion, BT Cotton, Basmati)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <Select
              label=""
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              options={[
                { value: "all", label: "All Districts" },
                { value: "wardha", label: "Wardha" },
                { value: "nashik", label: "Nashik" },
                { value: "nagpur", label: "Nagpur" },
                { value: "kolhapur", label: "Kolhapur" },
                { value: "ratnagiri", label: "Ratnagiri" },
                { value: "jalgaon", label: "Jalgaon" },
                { value: "amravati", label: "Amravati" },
              ]}
            />

            <div className="flex items-center gap-3">
              <Input
                label=""
                placeholder="Max Price (₹)"
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value === "" ? "" : Number(e.target.value))}
              />
            </div>
          </div>

          {/* Category Chips & Organic Switch */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
            <div className="flex flex-wrap items-center gap-2">
              {[
                { id: "all", label: "All Commodities" },
                { id: "oilseeds", label: "Oilseeds" },
                { id: "cotton_fiber", label: "Cotton & Fiber" },
                { id: "vegetables", label: "Vegetables" },
                { id: "fruits", label: "Fruits" },
                { id: "pulses", label: "Pulses" },
                { id: "grains", label: "Grains & Cereals" },
                { id: "organic", label: "Organic Produce" },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                    selectedCategory === cat.id
                      ? "bg-emerald-900 text-white shadow-sm"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={organicOnly}
                onChange={(e) => setOrganicOnly(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
              />
              <span className="flex items-center gap-1 text-emerald-800">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                NPOP / PGS Certified Only
              </span>
            </label>
          </div>
        </div>

        {/* Listings Counter */}
        <div className="flex items-center justify-between">
          <p className="text-xs text-slate-500">
            Showing <strong className="text-brand-text font-bold">{filteredListings.length}</strong> active farm lots
          </p>
          <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
            Direct Farm-Gate Procurement
          </span>
        </div>

        {/* Produce Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredListings.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl overflow-hidden shadow-card hover:shadow-card-hover border border-slate-200 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Photo & Badges */}
                <div className="h-48 w-full relative overflow-hidden bg-slate-100">
                  <img
                    src={item.primaryImageUrl}
                    alt={item.cropName}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                    <span className="bg-white/95 backdrop-blur-sm text-slate-900 text-[10px] font-black px-2.5 py-1 rounded-full shadow-sm">
                      {item.qualityGrade}
                    </span>
                    {item.isOrganicCertified && (
                      <span className="bg-emerald-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5" />
                        Organic
                      </span>
                    )}
                  </div>
                  <span className="absolute bottom-3 right-3 bg-slate-950/80 backdrop-blur-sm text-white text-[10px] font-mono font-bold px-2.5 py-1 rounded-lg">
                    {item.quantity} {item.unit} available
                  </span>
                </div>

                {/* Content */}
                <div className="p-5 space-y-3">
                  <div>
                    <h3 className="text-base font-extrabold text-brand-text leading-snug">
                      {item.cropName}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">Variety: {item.variety}</p>
                  </div>

                  {/* Pricing Box */}
                  <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-100 space-y-1">
                    <div className="flex items-baseline justify-between">
                      <span className="text-[11px] text-slate-500">Asking Price:</span>
                      <strong className="text-lg font-black text-brand-dark font-mono">
                        ₹{item.pricePerUnit.toLocaleString("en-IN")}{" "}
                        <span className="text-[11px] font-normal text-slate-500">/ {item.unit}</span>
                      </strong>
                    </div>

                    {item.mandiBenchmarkPrice && (
                      <div className="flex items-center justify-between text-[11px] text-slate-500">
                        <span>APMC Mandi MSP:</span>
                        <span className="font-mono text-slate-600">
                          ₹{item.mandiBenchmarkPrice.toLocaleString("en-IN")}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-[10px] text-emerald-700 font-semibold pt-1 border-t border-slate-200/50">
                      <span>Min Order (MOQ):</span>
                      <span>
                        {item.minimumOrderQuantity} {item.unit}
                      </span>
                    </div>
                  </div>

                  {/* Farmer & Location details */}
                  <div className="space-y-1.5 text-xs text-slate-600">
                    <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
                      <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{item.farmerName}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">
                        {item.locationVillage}, {item.locationDistrict}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                      <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
                      <span>Harvested: {item.harvestDate}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="p-5 pt-0 space-y-2">
                <Button
                  variant="primary"
                  size="sm"
                  className="w-full"
                  onClick={() => handleOpenOrderModal(item)}
                  leftIcon={<ShoppingBag className="w-3.5 h-3.5" />}
                >
                  Place Purchase Order
                </Button>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-[11px]"
                    onClick={() => setDetailModalItem(item)}
                  >
                    View Specs
                  </Button>
                  <a
                    href={`tel:${item.farmerPhone}`}
                    className="inline-flex items-center justify-center px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs transition"
                    title="Call Farmer"
                  >
                    <Phone className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal 1: Place Purchase Order */}
        <Modal
          isOpen={!!orderModalItem}
          onClose={() => setOrderModalItem(null)}
          title={`Order Placement • ${orderModalItem?.cropName}`}
          description="Direct procurement order with escrow protection. Your payment is held safely until goods arrive."
          maxWidth="lg"
          footer={
            <>
              <Button variant="ghost" size="sm" onClick={() => setOrderModalItem(null)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleSubmitOrder}>
                Confirm Purchase Order (₹{((orderQuantity || 0) * (orderModalItem?.pricePerUnit || 0)).toLocaleString("en-IN")})
              </Button>
            </>
          }
        >
          {orderModalItem && (
            <form onSubmit={handleSubmitOrder} className="space-y-4">
              <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-extrabold text-emerald-950">
                    {orderModalItem.cropName} ({orderModalItem.variety})
                  </h4>
                  <p className="text-xs text-emerald-800">
                    Seller: {orderModalItem.farmerName} • {orderModalItem.locationVillage},{" "}
                    {orderModalItem.locationDistrict}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-base font-black text-brand-dark font-mono">
                    ₹{orderModalItem.pricePerUnit.toLocaleString("en-IN")}
                  </span>
                  <p className="text-[10px] text-emerald-700">per {orderModalItem.unit}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label={`Order Quantity (${orderModalItem.unit})`}
                  type="number"
                  min={orderModalItem.minimumOrderQuantity}
                  max={orderModalItem.quantity}
                  value={orderQuantity}
                  onChange={(e) => setOrderQuantity(Number(e.target.value))}
                  helperText={`Min Order: ${orderModalItem.minimumOrderQuantity} | Max Available: ${orderModalItem.quantity}`}
                  required
                />
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Estimated Total Order Value</label>
                  <div className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl font-mono text-base font-black text-brand-dark">
                    ₹{(orderQuantity * orderModalItem.pricePerUnit).toLocaleString("en-IN")}
                  </div>
                  <p className="text-[10px] text-slate-500">Excludes GST / transit toll if applicable</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Select
                  label="Logistics & Delivery Method"
                  value={deliveryMethod}
                  onChange={(e) => setDeliveryMethod(e.target.value as any)}
                  options={[
                    { value: "farm_gate_pickup", label: "Self Farm-Gate Pickup (Buyer Arranges Truck)" },
                    { value: "buyer_logistics", label: "Third-Party Logistics (MahaAgri Transporter)" },
                    { value: "fpo_consolidated", label: "FPO Consolidated Hub Delivery" },
                    { value: "express_cold_chain", label: "Express Cold-Chain Logistics" },
                  ]}
                />
                <Input
                  label="Preferred Delivery / Pickup Date"
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  required
                />
              </div>

              <Input
                label="Delivery Destination / Mill Warehouse"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                required
              />

              <Input
                label="Special Quality or Packaging Instructions"
                value={orderInstructions}
                onChange={(e) => setOrderInstructions(e.target.value)}
                placeholder="e.g. 50kg standard jute bags, moisture < 10%"
              />

              <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p>
                  <strong>Escrow Guarantee:</strong> Upon order approval, your funds are deposited into a secure escrow account.
                  Payment is only disbursed to the farmer after quality inspection at destination.
                </p>
              </div>
            </form>
          )}
        </Modal>

        {/* Modal 2: View Detailed Specifications */}
        <Modal
          isOpen={!!detailModalItem}
          onClose={() => setDetailModalItem(null)}
          title={detailModalItem ? `${detailModalItem.cropName} • Full Specifications` : ""}
          maxWidth="lg"
          footer={
            <Button variant="primary" size="sm" onClick={() => setDetailModalItem(null)}>
              Close
            </Button>
          }
        >
          {detailModalItem && (
            <div className="space-y-4 text-xs">
              <div className="h-56 w-full rounded-2xl overflow-hidden bg-slate-100">
                <img
                  src={detailModalItem.primaryImageUrl}
                  alt={detailModalItem.cropName}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-2">
                <h4 className="text-base font-extrabold text-brand-text">
                  {detailModalItem.cropName} ({detailModalItem.variety})
                </h4>
                <p className="text-slate-600 leading-relaxed">{detailModalItem.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div>
                  <span className="text-slate-500">Quality Classification:</span>
                  <p className="font-bold text-slate-800">{detailModalItem.qualityGrade}</p>
                </div>
                <div>
                  <span className="text-slate-500">Storage Environment:</span>
                  <p className="font-bold text-slate-800">{detailModalItem.storageCondition}</p>
                </div>
                <div>
                  <span className="text-slate-500">Harvest Date:</span>
                  <p className="font-bold text-slate-800">{detailModalItem.harvestDate}</p>
                </div>
                <div>
                  <span className="text-slate-500">Organic Status:</span>
                  <p className="font-bold text-emerald-700">
                    {detailModalItem.isOrganicCertified ? "NPOP / PGS Certified" : "Conventional GAP Grown"}
                  </p>
                </div>
                <div>
                  <span className="text-slate-500">Farm Gate Address:</span>
                  <p className="font-bold text-slate-800">{detailModalItem.farmGateAddress}</p>
                </div>
                <div>
                  <span className="text-slate-500">Farmer Contact:</span>
                  <p className="font-bold text-slate-800">
                    {detailModalItem.farmerName} ({detailModalItem.farmerPhone})
                  </p>
                </div>
              </div>
            </div>
          )}
        </Modal>

        {/* Modal 3: Farmer List Harvest Lot */}
        <Modal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="List Agricultural Harvest Lot"
          description="Sell grains, pulses, fruits, or vegetables directly to verified wholesale buyers and food processors."
          maxWidth="lg"
          footer={
            <>
              <Button variant="ghost" size="sm" onClick={() => setShowAddModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleCreateListing}>
                Publish Lot to Wholesale Mandi
              </Button>
            </>
          }
        >
          <form onSubmit={handleCreateListing} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input
                label="Crop Name"
                placeholder="e.g. Certified Organic Soybean, Nashik Red Onion"
                value={newCropName}
                onChange={(e) => setNewCropName(e.target.value)}
                required
              />
              <Input
                label="Variety / Hybrid Name"
                placeholder="e.g. JS 335, Phule Samarth, BDN-711"
                value={newVariety}
                onChange={(e) => setNewVariety(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Select
                label="Crop Category"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as any)}
                options={[
                  { value: "oilseeds", label: "Oilseeds (Soybean, Groundnut, Mustard)" },
                  { value: "cotton_fiber", label: "Cotton & Fiber" },
                  { value: "pulses", label: "Pulses (Tur, Chana, Moong, Urad)" },
                  { value: "grains", label: "Grains & Cereals (Wheat, Rice, Jowar, Bajra)" },
                  { value: "vegetables", label: "Vegetables (Onion, Tomato, Potato)" },
                  { value: "fruits", label: "Fruits (Mango, Orange, Pomegranate, Banana)" },
                  { value: "spices", label: "Spices (Turmeric, Ginger, Chilli)" },
                  { value: "organic", label: "Organic Produce & Jaggery" },
                ]}
              />
              <Input
                label="Quantity Available"
                type="number"
                value={newQuantity}
                onChange={(e) => setNewQuantity(Number(e.target.value))}
                required
              />
              <Select
                label="Unit of Measurement"
                value={newUnit}
                onChange={(e) => setNewUnit(e.target.value as any)}
                options={[
                  { value: "Quintals", label: "Quintals (100 kg)" },
                  { value: "Tons", label: "Metric Tons (1,000 kg)" },
                  { value: "Kg", label: "Kilograms (kg)" },
                  { value: "Crates", label: "Crates (Standard 20kg)" },
                  { value: "Bags", label: "Bags (Standard 50kg)" },
                ]}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Input
                label={`Asking Price (₹ per ${newUnit})`}
                type="number"
                value={newPricePerUnit}
                onChange={(e) => setNewPricePerUnit(Number(e.target.value))}
                required
              />
              <Input
                label={`Min Order Quantity (${newUnit})`}
                type="number"
                value={newMoq}
                onChange={(e) => setNewMoq(Number(e.target.value))}
                required
              />
              <Select
                label="Quality Grade"
                value={newGrade}
                onChange={(e) => setNewGrade(e.target.value as any)}
                options={[
                  { value: "Grade A+ (Premium Export)", label: "Grade A+ (Premium Export)" },
                  { value: "Grade A (Commercial)", label: "Grade A (Standard Commercial)" },
                  { value: "Grade B (Standard)", label: "Grade B (Domestic Processing)" },
                  { value: "Organic Certified", label: "Organic Certified (NPOP / PGS)" },
                ]}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Input
                label="Harvest Date"
                type="date"
                value={newHarvestDate}
                onChange={(e) => setNewHarvestDate(e.target.value)}
                required
              />
              <Input
                label="Storage Condition"
                placeholder="e.g. Ventilated Kanda Chawl, Silo"
                value={newStorage}
                onChange={(e) => setNewStorage(e.target.value)}
              />
              <Input
                label="District"
                value={newDistrict}
                onChange={(e) => setNewDistrict(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input
                label="Taluka & Village"
                value={`${newTaluka}, ${newVillage}`}
                onChange={(e) => {
                  const parts = e.target.value.split(",");
                  setNewTaluka(parts[0]?.trim() || "");
                  setNewVillage(parts[1]?.trim() || "");
                }}
                placeholder="Taluka, Village"
                required
              />
              <Input
                label="Farm Gate Pickup Address"
                value={newFarmGate}
                onChange={(e) => setNewFarmGate(e.target.value)}
                required
              />
            </div>

            <Input
              label="Product Description & Quality Notes"
              placeholder="e.g. Handpicked, moisture tested under 10%, clean seed coat without insect damage"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
            />

            <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
              <input
                type="checkbox"
                id="organicCheck"
                checked={newIsOrganic}
                onChange={(e) => setNewIsOrganic(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
              />
              <label htmlFor="organicCheck" className="text-xs text-slate-700 font-semibold cursor-pointer">
                Lot is Certified Organic (NPOP / PGS-India Verified)
              </label>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
}
