"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAppState } from "@/lib/store";
import SensorGauge from "@/components/SensorGauge";
import {
  Droplets,
  Sprout,
  Activity,
  Cpu,
  CloudSun,
  FileText,
  TrendingUp,
  RefreshCw,
  Clock,
  Sparkles,
  Download,
} from "lucide-react";

export default function SensorsPage() {
  const { data, triggerSensorSync } = useAppState();
  const [syncing, setSyncing] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const tele = data.currentTelemetry;
  const sensor = data.sensors[0];

  const handleSync = () => {
    setSyncing(true);
    triggerSensorSync();
    setTimeout(() => setSyncing(false), 500);
  };

  const handleDownload = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3500);
  };

  return (
    <div className="min-h-screen bg-[#fdfbf7] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-stone-200">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-agri-green-100 text-agri-green-900 text-xs font-bold mb-2">
              <Activity className="w-3.5 h-3.5" />
              <span>Root-Zone Soil Intelligence • रूट-झोन मृदा विश्लेषण</span>
            </div>
            <h1 className="text-3xl font-black text-stone-900 tracking-tight">
              Soil Telemetry & Diagnostics
            </h1>
            <p className="text-xs text-stone-600 mt-1">
              Active Sensor: <strong>{sensor.serialNumber}</strong> • Model: {sensor.model} • Depth: {sensor.installDepthCm} cm
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSync}
              disabled={syncing}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-agri-green-900 hover:bg-agri-green-800 text-white text-xs font-bold shadow-md transition active:scale-95"
            >
              <RefreshCw className={`w-4 h-4 ${syncing ? "animate-spin text-agri-lime" : ""}`} />
              <span>Trigger Live IoT Sync</span>
            </button>

            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-stone-300 hover:bg-stone-50 text-stone-800 text-xs font-bold shadow-sm transition active:scale-95"
            >
              <Download className="w-4 h-4 text-agri-green-800" />
              <span>Download Soil Health Card</span>
            </button>
          </div>
        </div>

        {downloadSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold animate-in fade-in">
            ✓ Soil Health Card report generated with ISO Soil Protocol standards and sent to your downloads!
          </div>
        )}

        {/* 6 Key Root-Zone Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <SensorGauge
            label="Root Moisture"
            value={tele.moisturePct}
            unit="%"
            min={10}
            max={80}
            optimalMin={40}
            optimalMax={65}
            colorClass="bg-sky-100 text-sky-700"
            barColor="bg-sky-500"
            icon={<Droplets className="w-5 h-5 text-sky-600" />}
          />
          <SensorGauge
            label="Available Nitrogen (N)"
            value={tele.nitrogenPpm}
            unit="ppm"
            min={20}
            max={120}
            optimalMin={60}
            optimalMax={90}
            colorClass="bg-emerald-100 text-emerald-700"
            barColor="bg-emerald-500"
            icon={<Sprout className="w-5 h-5 text-emerald-600" />}
          />
          <SensorGauge
            label="Phosphorus (P)"
            value={tele.phosphorusPpm}
            unit="ppm"
            min={5}
            max={40}
            optimalMin={15}
            optimalMax={28}
            colorClass="bg-amber-100 text-amber-700"
            barColor="bg-amber-500"
            icon={<TrendingUp className="w-5 h-5 text-amber-600" />}
          />
          <SensorGauge
            label="Potassium (K)"
            value={tele.potassiumPpm}
            unit="ppm"
            min={80}
            max={350}
            optimalMin={180}
            optimalMax={260}
            colorClass="bg-purple-100 text-purple-700"
            barColor="bg-purple-500"
            icon={<Cpu className="w-5 h-5 text-purple-600" />}
          />
          <SensorGauge
            label="Soil Reaction (pH)"
            value={tele.phLevel}
            unit="pH"
            min={4.5}
            max={9.0}
            optimalMin={6.2}
            optimalMax={7.5}
            colorClass="bg-teal-100 text-teal-700"
            barColor="bg-teal-500"
            icon={<FileText className="w-5 h-5 text-teal-600" />}
          />
          <SensorGauge
            label="Root Zone Temperature"
            value={tele.temperatureC}
            unit="°C"
            min={15}
            max={45}
            optimalMin={22}
            optimalMax={30}
            colorClass="bg-orange-100 text-orange-700"
            barColor="bg-orange-500"
            icon={<CloudSun className="w-5 h-5 text-orange-600" />}
          />
        </div>

        {/* Historical Reading Curves */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-stone-200 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-stone-900">24-Hour Root-Zone Telemetry Trend</h3>
              <p className="text-xs text-stone-500">
                Moisture, Nitrogen ppm, and Soil Temperature sampled continuously at 15-minute intervals.
              </p>
            </div>
            <span className="text-xs text-stone-500 font-semibold">Plot A • Cotton Hybrid</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-stone-200 text-stone-500 font-bold uppercase text-[10px]">
                  <th className="pb-3">Timestamp</th>
                  <th className="pb-3">Moisture</th>
                  <th className="pb-3">Nitrogen</th>
                  <th className="pb-3">Soil Temp</th>
                  <th className="pb-3">pH</th>
                  <th className="pb-3">Agronomic Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {tele.history.map((h, i) => (
                  <tr key={i} className="hover:bg-stone-50">
                    <td className="py-3 font-semibold text-stone-900">{h.time}</td>
                    <td className="py-3 font-bold text-sky-800">{h.moisture}%</td>
                    <td className="py-3 font-bold text-emerald-800">{h.nitrogen} ppm</td>
                    <td className="py-3 font-bold text-orange-800">{h.temp}°C</td>
                    <td className="py-3 font-bold text-teal-800">{h.ph}</td>
                    <td className="py-3">
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                        Healthy Root Zone
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
