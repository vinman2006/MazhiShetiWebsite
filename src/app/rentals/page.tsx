"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAppState } from "@/lib/store";
import {
  Wrench,
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  ShieldCheck,
  UserCheck,
  PlusCircle,
} from "lucide-react";

export default function RentalsPage() {
  const { data, bookEquipment } = useAppState();
  const [selectedMachine, setSelectedMachine] = useState<any>(null);
  const [startDate, setStartDate] = useState("2026-11-05");
  const [endDate, setEndDate] = useState("2026-11-06");
  const [totalDays, setTotalDays] = useState(2);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const fleet = data.equipment;

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMachine) return;
    bookEquipment(selectedMachine.id, startDate, endDate, totalDays, "Wardha Farm");
    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      setSelectedMachine(null);
    }, 3500);
  };

  return (
    <div className="min-h-screen bg-[#fdfbf7] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-stone-200">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold mb-2">
              <Wrench className="w-3.5 h-3.5" />
              <span>कस्टम हायरिंग सेंटर • Farm Machinery & Drone Fleet</span>
            </div>
            <h1 className="text-3xl font-black text-stone-900 tracking-tight">
              Agri-Equipment Rentals
            </h1>
            <p className="text-xs text-stone-600 mt-1">
              On-demand mechanization: certified tractors, laser levelers, and RTK spray drones with trained operators.
            </p>
          </div>

          <Link
            href="/dashboard/provider"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold shadow-md transition active:scale-95"
          >
            <span>Provider Fleet Management</span>
          </Link>
        </div>

        {bookingSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold animate-in fade-in flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Rental booking confirmed! Operator dispatch schedule has been confirmed for your plot.</span>
          </div>
        )}

        {/* Fleet Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {fleet.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl p-6 shadow-card hover:shadow-card-hover border border-stone-200 transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                    {item.category}
                  </span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Available Now
                  </span>
                </div>

                <h4 className="text-base font-extrabold text-stone-900 leading-snug">
                  {item.title}
                </h4>
                <p className="text-xs text-stone-500 mt-2 leading-relaxed">
                  {item.specs}
                </p>

                <div className="mt-4 pt-4 border-t border-stone-100 space-y-2 text-xs text-stone-700">
                  <div className="flex justify-between">
                    <span>Hourly Rate:</span>
                    <strong className="text-stone-900">₹{item.hourlyRate}/hr</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Full Day Rate:</span>
                    <strong className="text-stone-900">₹{item.dailyRate}/day</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Operator:</span>
                    <strong className="text-emerald-700">Trained Driver Included</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Coverage Hub:</span>
                    <span className="text-stone-600">{item.location}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-stone-100">
                <button
                  onClick={() => setSelectedMachine(item)}
                  className="w-full py-2.5 rounded-xl text-center text-xs font-bold bg-agri-green-900 hover:bg-agri-green-800 text-white shadow-sm transition active:scale-95"
                >
                  Book Machine for Field
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Booking Modal */}
        {selectedMachine && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-4 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <div>
                  <h3 className="text-base font-black text-stone-900">Book Equipment</h3>
                  <p className="text-xs text-stone-500">{selectedMachine.title}</p>
                </div>
                <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2 py-1 rounded">
                  ₹{selectedMachine.dailyRate}/day
                </span>
              </div>

              <form onSubmit={handleBooking} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Start Date:</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-600 focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Duration (Days):</label>
                    <input
                      type="number"
                      min={1}
                      max={14}
                      value={totalDays}
                      onChange={(e) => setTotalDays(Number(e.target.value))}
                      className="w-full text-xs p-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-600 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-amber-50 text-[11px] text-amber-900 space-y-1">
                  <p className="font-bold flex items-center gap-1">
                    <UserCheck className="w-4 h-4 text-amber-700" />
                    <span>Certified Operator Assigned</span>
                  </p>
                  <p>Operator arrives at your farm gate with diesel, equipment calibration & RTK setup.</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                  <div>
                    <span className="text-[11px] text-stone-500">Total Estimation:</span>
                    <strong className="block text-base font-black text-stone-900">
                      ₹{(totalDays * selectedMachine.dailyRate).toLocaleString()}
                    </strong>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedMachine(null)}
                      className="px-3 py-2 text-xs font-bold text-stone-600 hover:bg-stone-100 rounded-xl"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 text-xs font-bold bg-amber-700 hover:bg-amber-800 text-white rounded-xl shadow-md"
                    >
                      Confirm Booking
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
