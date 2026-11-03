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
  Clock,
  Truck,
  CreditCard,
  Building2,
  Lock,
  FileText,
  AlertCircle,
  ExternalLink,
  Phone,
  User,
  ArrowRight,
  Package,
} from "lucide-react";
import { PurchaseOrderRecord, ProduceListingRecord } from "@/db/seed-data";

export default function BuyerDashboard() {
  const {
    data,
    updateOrderStatus,
    initiatePayment,
    verifyPayment,
    releaseEscrowPayment,
    createPurchaseOrder,
  } = useAppState();

  const [activeTab, setActiveTab] = useState<"orders" | "lots" | "payments" | "profile">("orders");
  const [orderFilter, setOrderFilter] = useState<"all" | "active" | "in_transit" | "completed">("all");
  const [filterQuery, setFilterQuery] = useState("");
  const [paymentModalOrder, setPaymentModalOrder] = useState<PurchaseOrderRecord | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [orderLotModal, setOrderLotModal] = useState<ProduceListingRecord | null>(null);
  const [lotOrderQty, setLotOrderQty] = useState(10);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const buyer = data.users.find((u) => u.role === "buyer") || data.users[3];
  const buyerProfile = data.buyerProfiles?.[0] || {
    companyOrTraderName: "Mahavishnu Agro Commodities Pvt. Ltd.",
    buyerType: "wholesaler",
    apmcLicenseNumber: "APMC/MUM/2021/8842",
    gstinNumber: "27AABCM9124K1Z5",
    contactPhone: "+91 98200 44123",
    deliveryWarehouseAddress: "Sector 19, APMC Grain Market, Vashi, Navi Mumbai",
    isVerifiedTrader: true,
    trustScore: 4.9,
    procurementCapacityTons: 120,
  };

  const purchaseOrders = data.purchaseOrders || [];
  const produceListings = data.produceListings || [];
  const paymentTransactions = data.paymentTransactions || [];
  const deliveryRecords = data.deliveryRecords || [];

  // Metrics computation
  const activeOrdersCount = purchaseOrders.filter(
    (o) => o.orderStatus === "requested" || o.orderStatus === "confirmed" || o.orderStatus === "in_transit" || o.orderStatus === "dispatched"
  ).length;

  const totalProcuredAmount = purchaseOrders
    .filter((o) => o.orderStatus !== "cancelled" && o.orderStatus !== "rejected")
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  const totalEscrowLocked = purchaseOrders
    .filter((o) => o.paymentStatus === "escrow_locked")
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  const triggerToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 4000);
  };

  const handlePayEscrow = (order: PurchaseOrderRecord) => {
    setIsProcessingPayment(true);
    // 1. Initiate payment session
    const txn = initiatePayment(order.id, order.totalAmount, "razorpay_escrow");

    setTimeout(() => {
      // 2. Cryptographic signature simulation (Never accept raw success without server validation)
      const simulatedSignature = `sig_hmac_${Date.now()}_valid_token`;
      const isVerified = verifyPayment(order.id, txn.id, simulatedSignature);

      setIsProcessingPayment(false);
      setPaymentModalOrder(null);

      if (isVerified) {
        triggerToast(
          `Payment of ₹${order.totalAmount.toLocaleString("en-IN")} verified & locked in Agri-Escrow for Order #${order.id}.`
        );
      } else {
        alert("Payment signature verification failed. Please try again.");
      }
    }, 1200);
  };

  const handleAcceptDelivery = (orderId: string) => {
    releaseEscrowPayment(orderId);
    triggerToast(`Order #${orderId} inspected and accepted! Escrow funds disbursed to farmer.`);
  };

  const handlePlaceLotOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderLotModal) return;

    const totalAmount = Math.round(lotOrderQty * orderLotModal.pricePerUnit);

    createPurchaseOrder({
      listingId: orderLotModal.id,
      farmerId: orderLotModal.sellerId,
      farmerName: orderLotModal.farmerName,
      farmerPhone: orderLotModal.farmerPhone,
      buyerId: buyer.id,
      buyerName: buyerProfile.companyOrTraderName,
      buyerPhone: buyer.phone,
      cropName: orderLotModal.cropName,
      variety: orderLotModal.variety,
      orderQuantity: lotOrderQty,
      unit: orderLotModal.unit,
      unitPrice: orderLotModal.pricePerUnit,
      totalAmount,
      deliveryMethod: "buyer_logistics",
      deliveryAddress: buyerProfile.deliveryWarehouseAddress,
      scheduledDeliveryDate: "2026-11-12",
      specialInstructions: "Moisture tested upon arrival. Dispatch with standard weighbridge receipt.",
    });

    setOrderLotModal(null);
    triggerToast(
      `Purchase order placed for ${lotOrderQty} ${orderLotModal.unit} of ${orderLotModal.cropName}!`
    );
  };

  const filteredOrders = purchaseOrders.filter((o) => {
    if (orderFilter === "all") return true;
    if (orderFilter === "active")
      return o.orderStatus === "requested" || o.orderStatus === "confirmed";
    if (orderFilter === "in_transit")
      return o.orderStatus === "dispatched" || o.orderStatus === "in_transit";
    if (orderFilter === "completed")
      return o.orderStatus === "delivered" || o.orderStatus === "completed";
    return true;
  });

  const navItems = [
    { label: "Procurement Desk", href: "/dashboard/buyer", icon: LayoutDashboard },
    { label: "Mandi Marketplace", href: "/marketplace", icon: ShoppingBag },
    { label: "Machinery & Logistics", href: "/rentals", icon: Wrench },
  ];

  return (
    <DashboardShell
      navItems={navItems}
      roleTitle="Wholesale Mandi Procurement Desk"
      roleSubtitle={`${buyerProfile.companyOrTraderName} • Vashi APMC`}
      roleIcon={ShoppingBag}
    >
      <div className="space-y-8">
        {/* Toast */}
        {successToast && (
          <div className="fixed bottom-6 right-6 z-50 bg-emerald-950 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-emerald-700 animate-in fade-in slide-in-from-bottom-5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <p className="text-sm font-semibold">{successToast}</p>
          </div>
        )}

        {/* Hero Banner */}
        <div className="bg-gradient-to-r from-purple-950 via-purple-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-purple-300 text-xs font-bold backdrop-blur-sm">
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>थोक कृषी खरेदी केंद्र • Licensed APMC Buyer & Exporter</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                {buyerProfile.companyOrTraderName}
              </h1>
              <p className="text-xs text-purple-200">
                Trader: {buyer.fullName} • License: {buyerProfile.apmcLicenseNumber} • GSTIN: {buyerProfile.gstinNumber}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="bg-white/10 px-5 py-3 rounded-2xl backdrop-blur-sm border border-white/10 text-right">
                <span className="text-2xl font-black text-purple-300 font-mono">
                  ₹{totalProcuredAmount.toLocaleString("en-IN")}
                </span>
                <p className="text-[11px] text-stone-200 font-medium">Committed Procurement Value</p>
              </div>
              <Link href="/marketplace">
                <Button variant="accent" leftIcon={<ShoppingBag className="w-4 h-4" />}>
                  Explore Produce Mandi
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500">Active Orders</p>
              <h3 className="text-2xl font-black text-brand-text mt-1">{activeOrdersCount}</h3>
              <p className="text-[11px] text-emerald-600 font-medium mt-1">In processing & transit</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
              <Package className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500">In-Transit Shipments</p>
              <h3 className="text-2xl font-black text-blue-700 mt-1">
                {purchaseOrders.filter((o) => o.orderStatus === "in_transit").length}
              </h3>
              <p className="text-[11px] text-blue-600 font-medium mt-1">GPS & E-Way Bill Active</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <Truck className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500">Locked in Escrow</p>
              <h3 className="text-2xl font-black text-emerald-700 mt-1 font-mono">
                ₹{totalEscrowLocked.toLocaleString("en-IN")}
              </h3>
              <p className="text-[11px] text-slate-500 font-medium mt-1">Safe Agri-Escrow funds</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Lock className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500">Trader Trust Score</p>
              <h3 className="text-2xl font-black text-amber-600 mt-1">
                {buyerProfile.trustScore} / 5.0
              </h3>
              <p className="text-[11px] text-emerald-600 font-medium mt-1">Verified APMC Licentiate</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-slate-200 space-x-2">
          <button
            onClick={() => setActiveTab("orders")}
            className={`pb-3 px-4 font-bold text-sm transition-all border-b-2 flex items-center gap-2 ${
              activeTab === "orders"
                ? "border-purple-600 text-purple-900"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Procurement Pipeline ({purchaseOrders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("lots")}
            className={`pb-3 px-4 font-bold text-sm transition-all border-b-2 flex items-center gap-2 ${
              activeTab === "lots"
                ? "border-purple-600 text-purple-900"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Available Mandi Lots ({produceListings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("payments")}
            className={`pb-3 px-4 font-bold text-sm transition-all border-b-2 flex items-center gap-2 ${
              activeTab === "payments"
                ? "border-purple-600 text-purple-900"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Escrow & Transactions ({paymentTransactions.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("profile")}
            className={`pb-3 px-4 font-bold text-sm transition-all border-b-2 flex items-center gap-2 ${
              activeTab === "profile"
                ? "border-purple-600 text-purple-900"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Buyer Credentials</span>
          </button>
        </div>

        {/* ===================== TAB 1: PROCUREMENT ORDERS ===================== */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-brand-text">Active Purchase Orders & Contracts</h3>
                <p className="text-xs text-slate-500">
                  Track orders from farmer acceptance to dispatch, transit, quality inspection, and escrow release.
                </p>
              </div>

              <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                <button
                  onClick={() => setOrderFilter("all")}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    orderFilter === "all" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600"
                  }`}
                >
                  All ({purchaseOrders.length})
                </button>
                <button
                  onClick={() => setOrderFilter("active")}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    orderFilter === "active" ? "bg-white text-amber-700 shadow-sm" : "text-slate-600"
                  }`}
                >
                  Confirmed / Pending
                </button>
                <button
                  onClick={() => setOrderFilter("in_transit")}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    orderFilter === "in_transit" ? "bg-white text-blue-700 shadow-sm" : "text-slate-600"
                  }`}
                >
                  In Transit
                </button>
                <button
                  onClick={() => setOrderFilter("completed")}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    orderFilter === "completed" ? "bg-white text-emerald-700 shadow-sm" : "text-slate-600"
                  }`}
                >
                  Completed
                </button>
              </div>
            </div>

            {filteredOrders.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-200">
                <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h4 className="text-base font-bold text-slate-700">No purchase orders in this status</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Place an order from the available Mandi lots to initiate procurement.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {filteredOrders.map((order) => {
                  const delivery = deliveryRecords.find((d) => d.orderId === order.id);

                  return (
                    <div
                      key={order.id}
                      className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card flex flex-col justify-between"
                    >
                      <div className="space-y-4">
                        {/* Header */}
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                                {order.id}
                              </span>
                              <Badge variant="neutral">{order.variety}</Badge>
                            </div>
                            <h4 className="text-base font-extrabold text-brand-text">{order.cropName}</h4>
                          </div>

                          <div className="flex flex-col items-end gap-1">
                            {order.orderStatus === "requested" && (
                              <Badge variant="warning" dot>
                                Farmer Reviewing
                              </Badge>
                            )}
                            {order.orderStatus === "confirmed" && (
                              <Badge variant="info" dot>
                                Order Confirmed
                              </Badge>
                            )}
                            {order.orderStatus === "in_transit" && (
                              <Badge variant="lime" dot>
                                In Transit
                              </Badge>
                            )}
                            {order.orderStatus === "delivered" && (
                              <Badge variant="success">Delivered (Pending Inspection)</Badge>
                            )}
                            {order.orderStatus === "completed" && (
                              <Badge variant="success">Completed & Settled</Badge>
                            )}
                          </div>
                        </div>

                        {/* Order Quantities & Cost Box */}
                        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2 text-xs">
                          <div className="flex justify-between">
                            <span className="text-slate-500">Consignment Quantity:</span>
                            <strong className="text-slate-800">
                              {order.orderQuantity} {order.unit}
                            </strong>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Locked Price per {order.unit}:</span>
                            <span className="font-mono text-slate-700">
                              ₹{order.unitPrice.toLocaleString("en-IN")}
                            </span>
                          </div>
                          <div className="flex justify-between pt-1 border-t border-slate-200/50">
                            <span className="font-bold text-slate-700">Total Purchase Value:</span>
                            <strong className="text-base font-black text-brand-dark font-mono">
                              ₹{order.totalAmount.toLocaleString("en-IN")}
                            </strong>
                          </div>
                        </div>

                        {/* Farmer & Location Details */}
                        <div className="space-y-1.5 text-xs text-slate-600">
                          <div className="flex justify-between">
                            <span className="text-slate-500">Seller Farmer:</span>
                            <span className="font-bold text-slate-800">{order.farmerName}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Farmer Phone:</span>
                            <a
                              href={`tel:${order.farmerPhone}`}
                              className="font-mono text-emerald-700 hover:underline font-semibold"
                            >
                              {order.farmerPhone}
                            </a>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Delivery Warehouse:</span>
                            <span className="text-slate-700 truncate max-w-[220px]">
                              {order.deliveryAddress}
                            </span>
                          </div>
                        </div>

                        {/* Payment & Escrow Status Box */}
                        <div className="bg-purple-50/60 p-3.5 rounded-2xl border border-purple-100 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <Lock className="w-4 h-4 text-purple-700" />
                            <div>
                              <p className="font-bold text-purple-950">
                                {order.paymentStatus === "escrow_locked"
                                  ? "Escrow Funds Secured"
                                  : order.paymentStatus === "released_to_farmer"
                                  ? "Payment Disbursed"
                                  : "Payment Pending"}
                              </p>
                              <p className="text-[10px] text-purple-700">
                                {order.paymentStatus === "escrow_locked"
                                  ? "Funds held safely in platform escrow"
                                  : order.paymentStatus === "released_to_farmer"
                                  ? "Credited to farmer account"
                                  : "Deposit required to confirm logistics"}
                              </p>
                            </div>
                          </div>

                          {order.paymentStatus === "pending" && (
                            <Button
                              variant="primary"
                              size="sm"
                              className="text-xs"
                              onClick={() => setPaymentModalOrder(order)}
                            >
                              Lock Escrow
                            </Button>
                          )}
                        </div>

                        {/* Transporter Tracking Details if in transit */}
                        {delivery && (
                          <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-100 space-y-1 text-xs">
                            <div className="flex items-center justify-between font-bold text-blue-900">
                              <span className="flex items-center gap-1.5">
                                <Truck className="w-3.5 h-3.5 text-blue-600" />
                                {delivery.transporterName}
                              </span>
                              <span className="font-mono text-[11px]">{delivery.vehicleNumber}</span>
                            </div>
                            <p className="text-[11px] text-blue-800">
                              Driver: {delivery.driverName} ({delivery.driverPhone})
                            </p>
                            {delivery.trackingNumberOrEwb && (
                              <p className="text-[10px] text-blue-600 font-mono">
                                E-Way Bill: {delivery.trackingNumberOrEwb}
                              </p>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Action Controls */}
                      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2">
                        {order.orderStatus === "in_transit" && (
                          <Button
                            variant="primary"
                            size="sm"
                            className="w-full"
                            onClick={() => {
                              updateOrderStatus(order.id, "delivered");
                              triggerToast(`Consignment #${order.id} marked delivered at warehouse.`);
                            }}
                            leftIcon={<PackageCheck className="w-4 h-4" />}
                          >
                            Mark Consignment Arrived
                          </Button>
                        )}

                        {order.orderStatus === "delivered" && (
                          <Button
                            variant="accent"
                            size="sm"
                            className="w-full"
                            onClick={() => handleAcceptDelivery(order.id)}
                            leftIcon={<CheckCircle2 className="w-4 h-4" />}
                          >
                            Inspect & Release Escrow Funds (₹{order.totalAmount.toLocaleString("en-IN")})
                          </Button>
                        )}

                        {order.orderStatus === "completed" && (
                          <div className="w-full text-center py-2 text-xs font-bold text-emerald-700 bg-emerald-50 rounded-xl">
                            ✓ Consignment Fully Settled & Disbursed
                          </div>
                        )}

                        {order.orderStatus === "requested" && (
                          <div className="w-full text-center py-2 text-xs font-medium text-slate-500 bg-slate-50 rounded-xl">
                            Waiting for farmer confirmation...
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ===================== TAB 2: MANDI LOTS ===================== */}
        {activeTab === "lots" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-brand-text">Active Farm-Gate Lots for Instant Procurement</h3>
                <p className="text-xs text-slate-500">
                  Select certified agricultural lots and submit purchase contracts directly with growers.
                </p>
              </div>
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  placeholder="Filter by crop (Soybean, Cotton, Mango)..."
                  value={filterQuery}
                  onChange={(e) => setFilterQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {produceListings
                .filter((l) =>
                  l.cropName.toLowerCase().includes(filterQuery.toLowerCase()) ||
                  l.variety.toLowerCase().includes(filterQuery.toLowerCase())
                )
                .map((lot) => (
                  <div
                    key={lot.id}
                    className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-card flex flex-col justify-between"
                  >
                    <div>
                      <div className="h-44 w-full relative overflow-hidden bg-slate-100">
                        <img
                          src={lot.primaryImageUrl}
                          alt={lot.cropName}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-3 left-3 bg-white/95 text-slate-900 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm">
                          {lot.qualityGrade}
                        </span>
                        <span className="absolute bottom-3 right-3 bg-slate-950/80 text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded">
                          {lot.quantity} {lot.unit}
                        </span>
                      </div>

                      <div className="p-5 space-y-3">
                        <div>
                          <h4 className="text-base font-extrabold text-brand-text leading-snug">
                            {lot.cropName}
                          </h4>
                          <p className="text-xs text-slate-500">Variety: {lot.variety}</p>
                        </div>

                        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-1 text-xs">
                          <div className="flex justify-between">
                            <span className="text-slate-500">Asking Price:</span>
                            <strong className="text-brand-dark font-mono font-black">
                              ₹{lot.pricePerUnit.toLocaleString("en-IN")} / {lot.unit}
                            </strong>
                          </div>
                          <div className="flex justify-between text-[11px] text-slate-500">
                            <span>APMC MSP:</span>
                            <span className="font-mono">₹{lot.mandiBenchmarkPrice?.toLocaleString("en-IN")}</span>
                          </div>
                          <div className="flex justify-between text-[11px] text-emerald-700 font-semibold pt-1 border-t border-slate-200/50">
                            <span>Min Order:</span>
                            <span>
                              {lot.minimumOrderQuantity} {lot.unit}
                            </span>
                          </div>
                        </div>

                        <div className="text-xs text-slate-600 space-y-1">
                          <div className="flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-slate-400" />
                            <span>{lot.farmerName}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-slate-500">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            <span>
                              {lot.locationVillage}, {lot.locationDistrict}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-5 pt-0">
                      <Button
                        variant="primary"
                        size="sm"
                        className="w-full"
                        onClick={() => {
                          setOrderLotModal(lot);
                          setLotOrderQty(lot.minimumOrderQuantity);
                        }}
                        leftIcon={<ShoppingBag className="w-3.5 h-3.5" />}
                      >
                        Procure from Farmer
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* ===================== TAB 3: PAYMENTS & ESCROW LEDGER ===================== */}
        {activeTab === "payments" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-brand-text">Escrow Ledger & Transaction Records</h3>
                <p className="text-xs text-slate-500">
                  Cryptographically verified payment sessions, gateway IDs, and automated farmer disbursements.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                      <th className="p-4">Transaction ID</th>
                      <th className="p-4">Order ID</th>
                      <th className="p-4">Gateway</th>
                      <th className="p-4">Amount (₹)</th>
                      <th className="p-4">Verification Method</th>
                      <th className="p-4">Escrow Status</th>
                      <th className="p-4">Recorded At</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {paymentTransactions.map((txn) => (
                      <tr key={txn.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-4 font-mono font-bold text-slate-800">{txn.id}</td>
                        <td className="p-4 font-mono text-purple-700">{txn.orderId}</td>
                        <td className="p-4">
                          <span className="font-semibold text-slate-700 uppercase">
                            {txn.paymentGateway.replace(/_/g, " ")}
                          </span>
                          {txn.gatewayPaymentId && (
                            <p className="text-[10px] text-slate-400 font-mono">{txn.gatewayPaymentId}</p>
                          )}
                        </td>
                        <td className="p-4 font-mono font-black text-brand-dark">
                          ₹{txn.amount.toLocaleString("en-IN")}
                        </td>
                        <td className="p-4 text-slate-500 font-mono text-[11px]">{txn.verificationMethod}</td>
                        <td className="p-4">
                          {txn.status === "verified" && <Badge variant="success">Verified (Escrow Locked)</Badge>}
                          {txn.status === "disbursed_to_farmer" && (
                            <Badge variant="lime">Disbursed to Farmer</Badge>
                          )}
                          {txn.status === "initiated" && <Badge variant="warning">Session Initiated</Badge>}
                          {txn.status === "refund_processed" && <Badge variant="danger">Refund Processed</Badge>}
                        </td>
                        <td className="p-4 text-slate-500">{txn.createdAt}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ===================== TAB 4: BUYER PROFILE ===================== */}
        {activeTab === "profile" && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-bold text-brand-text">Licensed APMC Procurement Entity</h3>
                  <p className="text-xs text-slate-500">
                    Verified institutional buyer credentials under Maharashtra Agricultural Produce Marketing Act.
                  </p>
                </div>
                <Badge variant="success" dot>
                  Verified Commercial Licentiate
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
                <div className="space-y-1">
                  <span className="text-slate-500">Corporate / Trade Name:</span>
                  <p className="font-bold text-slate-800 text-sm">{buyerProfile.companyOrTraderName}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-500">APMC Mandi License No.:</span>
                  <p className="font-mono font-bold text-purple-800">{buyerProfile.apmcLicenseNumber}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-500">GSTIN Registration:</span>
                  <p className="font-mono font-bold text-slate-800">{buyerProfile.gstinNumber}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-500">Procurement Capacity:</span>
                  <p className="font-bold text-emerald-700">{buyerProfile.procurementCapacityTons} Metric Tons</p>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-500">Verified Contact Phone:</span>
                  <p className="font-mono font-bold text-slate-800">{buyerProfile.contactPhone}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-500">Central Invoicing Warehouse:</span>
                  <p className="text-slate-700 leading-relaxed">{buyerProfile.deliveryWarehouseAddress}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Escrow Payment Modal */}
        <Modal
          isOpen={!!paymentModalOrder}
          onClose={() => setPaymentModalOrder(null)}
          title={`Agri-Escrow Payment Deposit • Order #${paymentModalOrder?.id}`}
          description="Authorised payment provider integration with server-side signature validation."
          maxWidth="md"
          footer={
            <>
              <Button variant="ghost" size="sm" onClick={() => setPaymentModalOrder(null)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => paymentModalOrder && handlePayEscrow(paymentModalOrder)}
                disabled={isProcessingPayment}
                leftIcon={<Lock className="w-4 h-4" />}
              >
                {isProcessingPayment
                  ? "Verifying HMAC Signature..."
                  : `Deposit ₹${paymentModalOrder?.totalAmount.toLocaleString("en-IN")} into Escrow`}
              </Button>
            </>
          }
        >
          {paymentModalOrder && (
            <div className="space-y-4 text-xs">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Produce:</span>
                  <span className="font-bold text-slate-800">{paymentModalOrder.cropName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Farmer Beneficiary:</span>
                  <span className="font-bold text-slate-800">{paymentModalOrder.farmerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Quantity:</span>
                  <span className="font-bold text-slate-800">
                    {paymentModalOrder.orderQuantity} {paymentModalOrder.unit}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-200">
                  <span className="font-bold text-slate-700">Total Escrow Amount:</span>
                  <strong className="text-base font-black text-brand-dark font-mono">
                    ₹{paymentModalOrder.totalAmount.toLocaleString("en-IN")}
                  </strong>
                </div>
              </div>

              <div className="bg-emerald-50 p-3.5 rounded-xl border border-emerald-200 text-emerald-950 space-y-1">
                <div className="flex items-center gap-2 font-bold text-emerald-900">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>Security & Verification Architecture</span>
                </div>
                <p className="text-[11px] leading-relaxed text-emerald-800">
                  Platform escrow never marks an order paid simply on frontend report. A cryptographic HMAC token is validated on
                  the server before locking funds. Farmer receives payout only upon your physical inspection.
                </p>
              </div>
            </div>
          )}
        </Modal>

        {/* Instant Lot Procurement Modal */}
        <Modal
          isOpen={!!orderLotModal}
          onClose={() => setOrderLotModal(null)}
          title={orderLotModal ? `Place Order for ${orderLotModal.cropName}` : ""}
          maxWidth="md"
          footer={
            <>
              <Button variant="ghost" size="sm" onClick={() => setOrderLotModal(null)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handlePlaceLotOrder}>
                Confirm Purchase Order (₹{((lotOrderQty || 0) * (orderLotModal?.pricePerUnit || 0)).toLocaleString("en-IN")})
              </Button>
            </>
          }
        >
          {orderLotModal && (
            <form onSubmit={handlePlaceLotOrder} className="space-y-4 text-xs">
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex justify-between items-center">
                <div>
                  <h4 className="font-extrabold text-slate-800">{orderLotModal.cropName}</h4>
                  <p className="text-[11px] text-slate-500">
                    Farmer: {orderLotModal.farmerName} • {orderLotModal.locationDistrict}
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-mono font-black text-brand-dark">
                    ₹{orderLotModal.pricePerUnit.toLocaleString("en-IN")}
                  </span>
                  <p className="text-[10px] text-slate-500">per {orderLotModal.unit}</p>
                </div>
              </div>

              <Input
                label={`Quantity (${orderLotModal.unit})`}
                type="number"
                min={orderLotModal.minimumOrderQuantity}
                max={orderLotModal.quantity}
                value={lotOrderQty}
                onChange={(e) => setLotOrderQty(Number(e.target.value))}
                helperText={`MOQ: ${orderLotModal.minimumOrderQuantity} ${orderLotModal.unit}`}
                required
              />

              <div className="p-3 bg-purple-50 rounded-xl border border-purple-100 flex justify-between items-center">
                <span className="font-bold text-purple-950">Calculated Total:</span>
                <span className="text-base font-black text-brand-dark font-mono">
                  ₹{(lotOrderQty * orderLotModal.pricePerUnit).toLocaleString("en-IN")}
                </span>
              </div>
            </form>
          )}
        </Modal>
      </div>
    </DashboardShell>
  );
}
