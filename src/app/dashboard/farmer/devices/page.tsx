"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAppState } from "@/lib/store";
import { DashboardShell, NavItem } from "@/components/layout/DashboardShell";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, StatCard } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import {
  LayoutDashboard,
  Trees,
  Activity,
  ShoppingBag,
  Wrench,
  Stethoscope,
  Landmark,
  Cpu,
  FlaskConical,
  Wifi,
  WifiOff,
  Battery,
  BatteryCharging,
  Play,
  Square,
  RefreshCw,
  PlusCircle,
  Calendar,
  Clock,
  Droplets,
  AlertOctagon,
  CheckCircle2,
  Sliders,
  Send,
  Zap,
  Radio,
  MapPin,
  ShieldCheck,
  ChevronRight,
  Layers,
  History,
} from "lucide-react";

export default function SmartDevicesAndIrrigationPage() {
  const {
    data,
    registerDevice,
    assignDeviceToField,
    updateDeviceStatus,
    dispatchDeviceCommand,
    addIrrigationSchedule,
    toggleIrrigationSchedule,
    recordIrrigationEvent,
  } = useAppState();

  const farmer = data.users.find((u) => u.role === "farmer") || data.users[0];
  const devices = data.devices || [];
  const fields = data.fields || [];
  const irrigationSchedules = data.irrigationSchedules || [];
  const irrigationEvents = data.irrigationEvents || [];
  const deviceCommands = data.deviceCommands || [];

  const [activeTab, setActiveTab] = useState<"fleet" | "sprinklers" | "schedules" | "history">("fleet");
  const [deviceTypeFilter, setDeviceTypeFilter] = useState<string>("all");

  // Command execution loading
  const [commandInProgress, setCommandInProgress] = useState<string | null>(null);
  const [commandFeedback, setCommandFeedback] = useState<string | null>(null);

  // Modals
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showManualIrrigationModal, setShowManualIrrigationModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assigningDevice, setAssigningDevice] = useState<any>(null);
  const [targetFieldId, setTargetFieldId] = useState(fields[0]?.id || "field_01");

  // Register Device Form State
  const [devName, setDevName] = useState("");
  const [devType, setDevType] = useState<
    "soil_moisture_sensor" | "temperature_sensor" | "fertility_monitor" | "irrigation_controller" | "automatic_sprinkler"
  >("automatic_sprinkler");
  const [devSerial, setDevSerial] = useState(`MS-DEV-${Math.floor(1000 + Math.random() * 9000)}-WRD`);
  const [devManufacturer, setDevManufacturer] = useState("Jain IrriTech & Mazhi Sheti Connected");
  const [devModel, setDevModel] = useState("SmartValve-LoRa-32");
  const [devFieldId, setDevFieldId] = useState(fields[0]?.id || "field_01");

  // Schedule Form State
  const [schedName, setSchedName] = useState("");
  const [schedFieldId, setSchedFieldId] = useState(fields[0]?.id || "field_01");
  const [schedTime, setSchedTime] = useState("06:30 AM");
  const [schedDuration, setSchedDuration] = useState(45);
  const [schedWaterLiters, setSchedWaterLiters] = useState(3500);
  const [schedRecurrence, setSchedRecurrence] = useState<"daily" | "alternate_days" | "weekly" | "smart_moisture_trigger">("daily");
  const [schedMoistureThreshold, setSchedMoistureThreshold] = useState(35);

  // Manual Irrigation Form State
  const [manFieldId, setManFieldId] = useState(fields[0]?.id || "field_01");
  const [manDuration, setManDuration] = useState(30);
  const [manVolume, setManVolume] = useState(2400);
  const [manSource, setManSource] = useState<"borewell" | "well" | "canal" | "farm_pond">("borewell");
  const [manNotes, setManNotes] = useState("Manual pump cycle for root hydration");

  // Quick Command Launcher on Sprinkler
  const handleSprinklerCommand = async (
    deviceId: string,
    commandType: "START_IRRIGATION" | "STOP_IRRIGATION" | "EMERGENCY_SHUTOFF" | "CALIBRATE_SENSOR",
    params: Record<string, any> = {}
  ) => {
    setCommandInProgress(commandType);
    setCommandFeedback(null);
    try {
      const res = await dispatchDeviceCommand(deviceId, commandType, params);
      setCommandFeedback(res.deviceAckPayload || `Command ${commandType} executed successfully.`);
    } catch (err: any) {
      setCommandFeedback(`Command failed: ${err.message}`);
    } finally {
      setTimeout(() => setCommandInProgress(null), 800);
    }
  };

  const handleRegisterDeviceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const assignedField = fields.find((f) => f.id === devFieldId);

    registerDevice({
      farmerId: "usr_farmer_01",
      deviceType: devType,
      deviceName: devName || `${devType.replace(/_/g, " ").toUpperCase()} Unit`,
      serialNumber: devSerial,
      manufacturer: devManufacturer,
      modelNumber: devModel,
      firmwareVersion: "v2.5.0",
      hardwareMacOrEui: `A8:40:41:${Math.floor(10 + Math.random() * 89)}:${Math.floor(10 + Math.random() * 89)}:${Math.floor(10 + Math.random() * 89)}`,
      status: "online",
      batteryPct: 98,
      signalStrengthDbm: -64,
      lastHeartbeatAt: "Just now",
      assignedFieldId: devFieldId,
      assignedFieldName: assignedField ? assignedField.name : "Assigned Parcel",
      installDepthCm: devType.includes("sensor") || devType.includes("fertility") ? 25 : 0,
      isEnrolled: true,
    });

    setShowRegisterModal(false);
    setDevName("");
    setDevSerial(`MS-DEV-${Math.floor(1000 + Math.random() * 9000)}-WRD`);
  };

  const handleSaveSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    const assignedField = fields.find((f) => f.id === schedFieldId);
    const linkedDevice = devices.find((d) => d.assignedFieldId === schedFieldId);

    addIrrigationSchedule({
      farmId: assignedField?.farmId || "farm_01",
      fieldId: schedFieldId,
      fieldName: assignedField?.name || "Target Parcel",
      deviceId: linkedDevice?.id,
      deviceName: linkedDevice?.deviceName || "Automated Solenoid Controller",
      scheduleName: schedName || `Irrigation - ${assignedField?.name}`,
      startTime: schedTime,
      durationMinutes: schedDuration,
      waterTargetLiters: schedWaterLiters,
      recurrence: schedRecurrence,
      isActive: true,
      automationEnabled: true,
      soilMoistureThresholdPct: schedMoistureThreshold,
      nextRunAt: `Tomorrow, ${schedTime}`,
    });

    setShowScheduleModal(false);
    setSchedName("");
  };

  const handleSaveManualIrrigation = (e: React.FormEvent) => {
    e.preventDefault();
    const assignedField = fields.find((f) => f.id === manFieldId);

    recordIrrigationEvent({
      farmId: assignedField?.farmId || "farm_01",
      fieldId: manFieldId,
      fieldName: assignedField?.name || "Target Parcel",
      triggerType: "manual",
      startTime: new Date().toISOString().replace("T", " ").substring(0, 16),
      endTime: new Date(Date.now() + manDuration * 60000).toISOString().replace("T", " ").substring(0, 16),
      durationMinutes: manDuration,
      waterVolumeLiters: manVolume,
      waterSource: manSource,
      status: "completed",
      energyUnitsKwh: Number(((manDuration / 60) * 2.2).toFixed(1)),
      notes: manNotes,
    });

    setShowManualIrrigationModal(false);
  };

  const handleAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (assigningDevice) {
      assignDeviceToField(assigningDevice.id, targetFieldId);
      setShowAssignModal(false);
      setAssigningDevice(null);
    }
  };

  const filteredDevices = devices.filter((d) => {
    if (deviceTypeFilter === "all") return true;
    return d.deviceType === deviceTypeFilter;
  });

  const onlineDevicesCount = devices.filter((d) => d.status === "online").length;
  const activeSprinklers = devices.filter((d) => d.deviceType === "automatic_sprinkler" || d.deviceType === "irrigation_controller");
  const totalWaterDeliveredLiters = irrigationEvents.reduce((acc, ev) => acc + Number(ev.waterVolumeLiters || 0), 0);

  const navItems: NavItem[] = [
    { label: "Dashboard Overview", href: "/dashboard/farmer", icon: LayoutDashboard },
    { label: "My Farm & Fields", href: "/dashboard/farmer/my-farm", icon: Trees, badge: `${data.farms.length}` },
    { label: "Soil Health & Lab", href: "/dashboard/farmer/soil-health", icon: FlaskConical },
    { label: "Smart Devices & Valves", href: "/dashboard/farmer/devices", icon: Cpu, badge: "Phase 4" },
    { label: "Deep Root Telemetry", href: "/sensors", icon: Activity, badge: "Live" },
    { label: "Produce Mandi", href: "/marketplace", icon: ShoppingBag },
    { label: "Machinery Fleet", href: "/rentals", icon: Wrench },
    { label: "Agronomist Clinic", href: "/advisory", icon: Stethoscope },
    { label: "Agri-Credit & PMFBY", href: "/finance", icon: Landmark },
  ];

  return (
    <DashboardShell
      navItems={navItems}
      roleTitle="Farmer Command Center"
      roleSubtitle={`${farmer.fullName} • Wardha`}
      roleIcon={Cpu}
    >
      <div className="space-y-8">
        {/* ===================== BANNER & ACTION HEADER ===================== */}
        <div className="bg-gradient-to-r from-slate-900 via-brand-dark to-emerald-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-brand-lime/10 blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-brand-lime text-xs font-bold">
                <Radio className="w-3.5 h-3.5 text-brand-lime animate-pulse" />
                <span>Encrypted LoRaWAN & MQTT IoT Grid</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                Smart Devices & Automatic Irrigation Hub
              </h1>
              <p className="text-xs text-stone-300 max-w-2xl leading-relaxed">
                Remotely command automatic solenoid sprinklers, set smart moisture-triggered irrigation cycles,
                and monitor soil capacitive probes. Zero hardcoded credentials exposed.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="outline"
                size="md"
                onClick={() => setShowScheduleModal(true)}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                leftIcon={<Calendar className="w-4 h-4 text-brand-lime" />}
              >
                Plan Schedule
              </Button>
              <Button
                variant="accent"
                size="md"
                onClick={() => setShowRegisterModal(true)}
                leftIcon={<PlusCircle className="w-4 h-4" />}
              >
                Register Smart Device
              </Button>
            </div>
          </div>
        </div>

        {/* ===================== DEVICE & IRRIGATION STATS ===================== */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Online IoT Nodes"
            value={`${onlineDevicesCount}`}
            unit={`/ ${devices.length} Total`}
            change="100% Signal Integrity"
            trend="up"
            icon={<Wifi className="w-5 h-5 text-emerald-700" />}
            iconBg="bg-emerald-100"
          />
          <StatCard
            label="Connected Sprinklers"
            value={`${activeSprinklers.length}`}
            unit="Actuators"
            change="Remote Command Ready"
            trend="up"
            icon={<Droplets className="w-5 h-5 text-sky-700" />}
            iconBg="bg-sky-100"
          />
          <StatCard
            label="Water Delivered"
            value={(totalWaterDeliveredLiters / 1000).toFixed(1)}
            unit="kL (Cubic M)"
            change={`${irrigationEvents.length} cycles completed`}
            trend="neutral"
            icon={<Sliders className="w-5 h-5 text-blue-700" />}
            iconBg="bg-blue-100"
          />
          <StatCard
            label="Active Schedules"
            value={`${irrigationSchedules.filter((s) => s.isActive).length}`}
            unit="Automated"
            change="Smart Moisture Conditioned"
            trend="up"
            icon={<Zap className="w-5 h-5 text-amber-700" />}
            iconBg="bg-amber-100"
          />
        </div>

        {/* ===================== TAB SELECTOR ===================== */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto">
          {[
            { id: "fleet", label: `Device Fleet & Probes (${devices.length})` },
            { id: "sprinklers", label: `Sprinkler Remote Command Center (${activeSprinklers.length})` },
            { id: "schedules", label: `Irrigation Schedules (${irrigationSchedules.length})` },
            { id: "history", label: `Irrigation & Command Ledger (${irrigationEvents.length + deviceCommands.length})` },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                activeTab === t.id
                  ? "bg-brand-primary text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-200/60"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ===================== FLEET TAB ===================== */}
        {activeTab === "fleet" && (
          <div className="space-y-6">
            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">Filter by Device Category:</span>
                <select
                  value={deviceTypeFilter}
                  onChange={(e) => setDeviceTypeFilter(e.target.value)}
                  className="text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                >
                  <option value="all">All Devices ({devices.length})</option>
                  <option value="soil_moisture_sensor">Soil Moisture Probes</option>
                  <option value="fertility_monitor">NPK Fertility Sentinels</option>
                  <option value="automatic_sprinkler">Automatic Sprinklers</option>
                  <option value="irrigation_controller">Pump Controllers</option>
                  <option value="temperature_sensor">Micro-Climate Ambient</option>
                </select>
              </div>

              <div className="text-xs text-slate-500">
                Encrypted LoRa Heartbeat frequency: <strong className="text-slate-800">Every 10 minutes</strong>
              </div>
            </div>

            {/* Device Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredDevices.map((dev) => (
                <div
                  key={dev.id}
                  className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-4 hover:border-brand-primary/50 transition"
                >
                  <div className="space-y-3">
                    {/* Header line */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="p-2 rounded-xl bg-brand-light text-brand-primary">
                          {dev.deviceType.includes("sprinkler") || dev.deviceType.includes("controller") ? (
                            <Droplets className="w-5 h-5" />
                          ) : (
                            <Cpu className="w-5 h-5" />
                          )}
                        </span>
                        <div>
                          <h3 className="text-sm font-extrabold text-brand-text line-clamp-1">
                            {dev.deviceName}
                          </h3>
                          <span className="text-[10px] text-slate-400 font-mono block">
                            {dev.serialNumber}
                          </span>
                        </div>
                      </div>

                      <Badge
                        variant={dev.status === "online" ? "lime" : dev.status === "low_battery" ? "warning" : "neutral"}
                        dot
                        size="sm"
                      >
                        {dev.status}
                      </Badge>
                    </div>

                    {/* Metadata pill box */}
                    <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/70 text-xs space-y-1.5">
                      <div className="flex items-center justify-between text-slate-600">
                        <span className="text-slate-400 text-[11px]">Assigned Parcel:</span>
                        <strong className="text-brand-dark text-xs truncate max-w-[160px]">
                          {dev.assignedFieldName || "Unassigned"}
                        </strong>
                      </div>
                      <div className="flex items-center justify-between text-slate-600">
                        <span className="text-slate-400 text-[11px]">Hardware / Model:</span>
                        <span className="text-slate-700 text-xs font-mono">{dev.modelNumber}</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-600">
                        <span className="text-slate-400 text-[11px]">Firmware:</span>
                        <span className="text-slate-700 text-xs font-mono">{dev.firmwareVersion}</span>
                      </div>
                      {dev.installDepthCm !== undefined && dev.installDepthCm > 0 && (
                        <div className="flex items-center justify-between text-slate-600">
                          <span className="text-slate-400 text-[11px]">Sensor Probe Depth:</span>
                          <span className="text-emerald-700 font-bold">{dev.installDepthCm} cm deep</span>
                        </div>
                      )}
                    </div>

                    {/* Telemetry Telemetry badges */}
                    <div className="flex items-center justify-between text-[11px] px-1 text-slate-500">
                      <span className="flex items-center gap-1 font-medium">
                        <Battery className="w-3.5 h-3.5 text-emerald-600" />
                        {dev.batteryPct}% Battery
                      </span>
                      <span className="flex items-center gap-1 font-mono">
                        <Radio className="w-3.5 h-3.5 text-sky-600" />
                        {dev.signalStrengthDbm} dBm
                      </span>
                      <span className="text-[10px] text-slate-400">{dev.lastHeartbeatAt}</span>
                    </div>
                  </div>

                  {/* Actions footer */}
                  <div className="border-t border-slate-100 pt-3 flex items-center justify-between gap-2">
                    <button
                      onClick={() => {
                        setAssigningDevice(dev);
                        setTargetFieldId(dev.assignedFieldId || fields[0]?.id || "field_01");
                        setShowAssignModal(true);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1"
                    >
                      <MapPin className="w-3 h-3 text-slate-500" />
                      Reassign Field
                    </button>

                    {dev.deviceType === "automatic_sprinkler" || dev.deviceType === "irrigation_controller" ? (
                      <Button
                        variant="accent"
                        size="sm"
                        onClick={() =>
                          handleSprinklerCommand(dev.id, "START_IRRIGATION", {
                            durationMinutes: 30,
                            flowRateLpm: 60,
                          })
                        }
                        isLoading={commandInProgress === "START_IRRIGATION"}
                        leftIcon={<Play className="w-3 h-3" />}
                      >
                        Start 30m
                      </Button>
                    ) : (
                      <button
                        onClick={() =>
                          handleSprinklerCommand(dev.id, "CALIBRATE_SENSOR", {
                            calibrationMode: "vertisol_clay_auto",
                          })
                        }
                        className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition flex items-center gap-1"
                      >
                        <RefreshCw className="w-3 h-3 text-slate-500" />
                        Calibrate
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================== SPRINKLERS & COMMAND CENTER TAB ===================== */}
        {activeTab === "sprinklers" && (
          <div className="space-y-6">
            {/* Live Command Feedback Banner if active */}
            {commandFeedback && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center justify-between animate-fadeIn">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                  <span>{commandFeedback}</span>
                </div>
                <button
                  onClick={() => setCommandFeedback(null)}
                  className="font-bold text-emerald-700 hover:underline"
                >
                  Dismiss
                </button>
              </div>
            )}

            {/* Sprinkler Control Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {activeSprinklers.map((spk) => (
                <div
                  key={spk.id}
                  className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-6"
                >
                  <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-800 flex items-center justify-center flex-shrink-0">
                        <Droplets className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-base font-extrabold text-brand-text">
                          {spk.deviceName}
                        </h3>
                        <p className="text-xs text-slate-500">
                          {spk.assignedFieldName} • Hardware EUI:{" "}
                          <strong className="font-mono text-slate-700">{spk.hardwareMacOrEui}</strong>
                        </p>
                      </div>
                    </div>
                    <Badge variant={spk.status === "online" ? "lime" : "neutral"} dot>
                      {spk.status}
                    </Badge>
                  </div>

                  {/* Operational Telemetry Matrix */}
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/70">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                        Signal Strength
                      </span>
                      <p className="text-sm font-black font-mono text-brand-dark">
                        {spk.signalStrengthDbm} dBm
                      </p>
                    </div>
                    <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/70">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                        Power Buffer
                      </span>
                      <p className="text-sm font-black text-emerald-700">
                        {spk.batteryPct}% Solar trickle
                      </p>
                    </div>
                    <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/70">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                        Command State
                      </span>
                      <p className="text-sm font-black text-blue-700">
                        Authorized
                      </p>
                    </div>
                  </div>

                  {/* Remote Action Command Console */}
                  <div className="space-y-3">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                      Remote Solenoid Commands (Encrypted Handshake)
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      <Button
                        variant="accent"
                        size="sm"
                        onClick={() =>
                          handleSprinklerCommand(spk.id, "START_IRRIGATION", {
                            durationMinutes: 15,
                            flowRateLpm: 50,
                          })
                        }
                        isLoading={commandInProgress === "START_IRRIGATION"}
                        leftIcon={<Play className="w-3 h-3" />}
                        className="w-full text-xs"
                      >
                        Run 15 Min
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() =>
                          handleSprinklerCommand(spk.id, "START_IRRIGATION", {
                            durationMinutes: 45,
                            flowRateLpm: 60,
                          })
                        }
                        isLoading={commandInProgress === "START_IRRIGATION"}
                        leftIcon={<Play className="w-3 h-3" />}
                        className="w-full text-xs"
                      >
                        Run 45 Min
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleSprinklerCommand(spk.id, "STOP_IRRIGATION", {
                            reason: "user_command_stop",
                          })
                        }
                        isLoading={commandInProgress === "STOP_IRRIGATION"}
                        leftIcon={<Square className="w-3 h-3" />}
                        className="w-full text-xs text-amber-800 border-amber-300 hover:bg-amber-50"
                      >
                        Safe Stop
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleSprinklerCommand(spk.id, "EMERGENCY_SHUTOFF", {
                            reason: "emergency_kill_switch",
                          })
                        }
                        isLoading={commandInProgress === "EMERGENCY_SHUTOFF"}
                        leftIcon={<AlertOctagon className="w-3 h-3 text-rose-600" />}
                        className="w-full text-xs text-rose-700 border-rose-300 hover:bg-rose-50"
                      >
                        Kill Switch
                      </Button>
                    </div>
                  </div>

                  {/* Cryptographic Security Box */}
                  <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200/60 flex items-center gap-2.5 text-xs text-emerald-950">
                    <ShieldCheck className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                    <span>
                      Device authenticated via hardware token. Command signing protocol prevents unauthorized valve toggling.
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================== SCHEDULES TAB ===================== */}
        {activeTab === "schedules" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
              <div>
                <h2 className="text-base font-extrabold text-brand-text">
                  Automated Irrigation Schedules ({irrigationSchedules.length})
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Set recurring schedules or configure automatic sensor-driven irrigation based on soil moisture thresholds.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowManualIrrigationModal(true)}
                  leftIcon={<Droplets className="w-4 h-4 text-brand-primary" />}
                >
                  Record Manual Run
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setShowScheduleModal(true)}
                  leftIcon={<PlusCircle className="w-4 h-4" />}
                >
                  Create Schedule
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {irrigationSchedules.map((sched) => (
                <div
                  key={sched.id}
                  className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-4 hover:border-brand-primary/50 transition"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-base font-extrabold text-brand-text">
                          {sched.scheduleName}
                        </h3>
                        <p className="text-xs text-slate-500">
                          Field: <strong className="text-slate-800">{sched.fieldName}</strong>
                        </p>
                      </div>

                      <button
                        onClick={() => toggleIrrigationSchedule(sched.id)}
                        className={`px-3 py-1 rounded-full text-xs font-bold transition flex items-center gap-1.5 ${
                          sched.isActive
                            ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${
                            sched.isActive ? "bg-emerald-600" : "bg-slate-400"
                          }`}
                        />
                        {sched.isActive ? "Active" : "Paused"}
                      </button>
                    </div>

                    <div className="grid grid-cols-3 gap-3 p-3.5 rounded-2xl bg-stone-50 border border-stone-200/70 text-xs text-center">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-bold">Start Time</span>
                        <strong className="text-brand-dark">{sched.startTime}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-bold">Duration</span>
                        <strong className="text-brand-dark">{sched.durationMinutes} Mins</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-bold">Target Volume</span>
                        <strong className="text-brand-dark">{sched.waterTargetLiters} L</strong>
                      </div>
                    </div>

                    {sched.soilMoistureThresholdPct && (
                      <div className="p-3 rounded-xl bg-sky-50/60 border border-sky-200/60 text-xs text-sky-900 flex items-center gap-2">
                        <Zap className="w-4 h-4 text-sky-700 flex-shrink-0" />
                        <span>
                          Smart Trigger: Auto-activates when root moisture falls below{" "}
                          <strong>{sched.soilMoistureThresholdPct}%</strong>.
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-xs text-slate-500">
                    <span>Recurrence: <strong className="capitalize text-slate-800">{sched.recurrence}</strong></span>
                    <span>Next execution: <strong className="text-brand-primary">{sched.nextRunAt}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================== HISTORY & AUDIT TAB ===================== */}
        {activeTab === "history" && (
          <div className="space-y-6">
            {/* Irrigation Events Log */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-base font-extrabold text-brand-text">
                    Water Delivery Execution History
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Recorded water usage, flow duration, pump power units (kWh), and water sources.
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowManualIrrigationModal(true)}
                  leftIcon={<Droplets className="w-4 h-4 text-brand-primary" />}
                >
                  Record Manual Run
                </Button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-400 font-extrabold uppercase tracking-wider text-[10px] border-b border-slate-100">
                    <tr>
                      <th className="py-3 px-4">Start Time</th>
                      <th className="py-3 px-4">Field / Parcel</th>
                      <th className="py-3 px-4">Trigger Type</th>
                      <th className="py-3 px-4">Duration</th>
                      <th className="py-3 px-4">Water Delivered</th>
                      <th className="py-3 px-4">Source</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {irrigationEvents.map((ev) => (
                      <tr key={ev.id} className="hover:bg-slate-50/70 transition">
                        <td className="py-3.5 px-4 font-mono text-slate-700 font-bold">
                          {ev.startTime}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-brand-dark">
                          {ev.fieldName}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="capitalize px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium">
                            {ev.triggerType.replace(/_/g, " ")}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-slate-700">
                          {ev.durationMinutes} mins
                        </td>
                        <td className="py-3.5 px-4 font-black font-mono text-emerald-800">
                          {ev.waterVolumeLiters.toLocaleString()} Liters
                        </td>
                        <td className="py-3.5 px-4 capitalize text-slate-600">
                          {ev.waterSource.replace(/_/g, " ")}
                        </td>
                        <td className="py-3.5 px-4">
                          <Badge
                            variant={ev.status === "completed" ? "lime" : ev.status === "in_progress" ? "info" : "warning"}
                            size="sm"
                          >
                            {ev.status}
                          </Badge>
                        </td>
                        <td className="py-3.5 px-4 text-slate-500 max-w-xs truncate" title={ev.notes}>
                          {ev.notes || "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Cryptographic Device Command Pipeline Audit */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-base font-extrabold text-brand-text">
                  Authorized Device Command Pipeline Audit
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Complete trace of commands dispatched to connected irrigation hardware with edge ACK receipts.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-400 font-extrabold uppercase tracking-wider text-[10px] border-b border-slate-100">
                    <tr>
                      <th className="py-3 px-4">Command ID</th>
                      <th className="py-3 px-4">Target Actuator</th>
                      <th className="py-3 px-4">Command Type</th>
                      <th className="py-3 px-4">Pipeline Status</th>
                      <th className="py-3 px-4">Dispatched Time</th>
                      <th className="py-3 px-4">Edge Device Acknowledgement</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {deviceCommands.map((cmd) => (
                      <tr key={cmd.id} className="hover:bg-slate-50/70 transition">
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                          {cmd.id}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-brand-text">
                          {cmd.deviceName}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-emerald-800 font-bold">
                          {cmd.commandType}
                        </td>
                        <td className="py-3.5 px-4">
                          <Badge
                            variant={
                              cmd.status === "EXECUTED"
                                ? "lime"
                                : cmd.status === "ACKNOWLEDGED"
                                ? "info"
                                : "warning"
                            }
                            size="sm"
                          >
                            {cmd.status}
                          </Badge>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-slate-500">
                          {cmd.dispatchedAt}
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 font-mono text-[11px] max-w-sm truncate" title={cmd.deviceAckPayload}>
                          {cmd.deviceAckPayload || "Waiting for hardware ACK..."}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ===================== REGISTER DEVICE MODAL ===================== */}
        <Modal
          isOpen={showRegisterModal}
          onClose={() => setShowRegisterModal(false)}
          title="Register New Agricultural Smart Device"
          maxWidth="md"
        >
          <form onSubmit={handleRegisterDeviceSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Device Category *
              </label>
              <select
                value={devType}
                onChange={(e) => setDevType(e.target.value as any)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white font-medium focus:ring-2 focus:ring-brand-primary"
                required
              >
                <option value="automatic_sprinkler">Automatic High-Pressure Sprinkler</option>
                <option value="irrigation_controller">Pump / Solenoid Valve Controller</option>
                <option value="soil_moisture_sensor">Soil Moisture Capacitive Probe</option>
                <option value="fertility_monitor">NPK Soil Fertility Monitor</option>
                <option value="temperature_sensor">Micro-Climate Canopy Thermometer</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Device Name / Tag *
              </label>
              <input
                type="text"
                value={devName}
                onChange={(e) => setDevName(e.target.value)}
                placeholder="e.g. South Gat Sprinkler Valve #2"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white font-medium focus:ring-2 focus:ring-brand-primary"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Serial Number / EUI *
                </label>
                <input
                  type="text"
                  value={devSerial}
                  onChange={(e) => setDevSerial(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white font-mono font-medium focus:ring-2 focus:ring-brand-primary"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Manufacturer
                </label>
                <input
                  type="text"
                  value={devManufacturer}
                  onChange={(e) => setDevManufacturer(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white font-medium focus:ring-2 focus:ring-brand-primary"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Assign to Field Parcel *
              </label>
              <select
                value={devFieldId}
                onChange={(e) => setDevFieldId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white font-medium focus:ring-2 focus:ring-brand-primary"
                required
              >
                {fields.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name} ({f.areaAcres} Acres - {f.soilType})
                  </option>
                ))}
              </select>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-amber-950 text-xs">
              <span className="font-bold block mb-1">Secure Device Enrollment Protocol</span>
              <span>
                Mazhi Sheti IoT will generate a unique hardware enrollment key for this device. Device credentials are encrypted on the backend and never exposed in frontend bundles.
              </span>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={() => setShowRegisterModal(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="md">
                Enroll Device
              </Button>
            </div>
          </form>
        </Modal>

        {/* ===================== SCHEDULE MODAL ===================== */}
        <Modal
          isOpen={showScheduleModal}
          onClose={() => setShowScheduleModal(false)}
          title="Create Automated Irrigation Schedule"
          maxWidth="md"
        >
          <form onSubmit={handleSaveSchedule} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Schedule Title *
              </label>
              <input
                type="text"
                value={schedName}
                onChange={(e) => setSchedName(e.target.value)}
                placeholder="e.g. Morning Solenoid Sprinkler Cycle"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white font-medium focus:ring-2 focus:ring-brand-primary"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Target Field / Parcel *
              </label>
              <select
                value={schedFieldId}
                onChange={(e) => setSchedFieldId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white font-medium focus:ring-2 focus:ring-brand-primary"
                required
              >
                {fields.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name} ({f.irrigationMethod})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Start Time *
                </label>
                <input
                  type="text"
                  value={schedTime}
                  onChange={(e) => setSchedTime(e.target.value)}
                  placeholder="06:30 AM"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white font-medium focus:ring-2 focus:ring-brand-primary"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Duration (Minutes) *
                </label>
                <input
                  type="number"
                  value={schedDuration}
                  onChange={(e) => setSchedDuration(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white font-medium focus:ring-2 focus:ring-brand-primary"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Target Water Volume (Liters)
                </label>
                <input
                  type="number"
                  value={schedWaterLiters}
                  onChange={(e) => setSchedWaterLiters(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white font-medium focus:ring-2 focus:ring-brand-primary"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Recurrence
                </label>
                <select
                  value={schedRecurrence}
                  onChange={(e) => setSchedRecurrence(e.target.value as any)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white font-medium focus:ring-2 focus:ring-brand-primary"
                >
                  <option value="daily">Daily</option>
                  <option value="alternate_days">Alternate Days</option>
                  <option value="weekly">Weekly</option>
                  <option value="smart_moisture_trigger">Smart Sensor Trigger</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Soil Moisture Threshold Trigger (%)
              </label>
              <input
                type="number"
                value={schedMoistureThreshold}
                onChange={(e) => setSchedMoistureThreshold(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white font-medium focus:ring-2 focus:ring-brand-primary"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                Sprinklers will automatically engage if root-zone moisture drops below this value.
              </span>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={() => setShowScheduleModal(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="md">
                Save Schedule
              </Button>
            </div>
          </form>
        </Modal>

        {/* ===================== MANUAL IRRIGATION RUN MODAL ===================== */}
        <Modal
          isOpen={showManualIrrigationModal}
          onClose={() => setShowManualIrrigationModal(false)}
          title="Log Manual Irrigation Cycle"
          maxWidth="md"
        >
          <form onSubmit={handleSaveManualIrrigation} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Target Field Parcel *
              </label>
              <select
                value={manFieldId}
                onChange={(e) => setManFieldId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white font-medium focus:ring-2 focus:ring-brand-primary"
                required
              >
                {fields.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Pump Duration (Minutes) *
                </label>
                <input
                  type="number"
                  value={manDuration}
                  onChange={(e) => setManDuration(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white font-medium focus:ring-2 focus:ring-brand-primary"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Volume Delivered (Liters) *
                </label>
                <input
                  type="number"
                  value={manVolume}
                  onChange={(e) => setManVolume(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white font-medium focus:ring-2 focus:ring-brand-primary"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Water Source *
              </label>
              <select
                value={manSource}
                onChange={(e) => setManSource(e.target.value as any)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white font-medium focus:ring-2 focus:ring-brand-primary"
                required
              >
                <option value="borewell">Borewell Submersible</option>
                <option value="well">Open Well</option>
                <option value="farm_pond">Farm Pond (Shet Tale)</option>
                <option value="canal">Canal Gravity Feed</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Operation Notes
              </label>
              <textarea
                rows={2}
                value={manNotes}
                onChange={(e) => setManNotes(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white font-medium focus:ring-2 focus:ring-brand-primary"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={() => setShowManualIrrigationModal(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="md">
                Log Irrigation Event
              </Button>
            </div>
          </form>
        </Modal>

        {/* ===================== REASSIGN FIELD MODAL ===================== */}
        <Modal
          isOpen={showAssignModal}
          onClose={() => setShowAssignModal(false)}
          title={`Reassign Field for ${assigningDevice?.deviceName || "Device"}`}
          maxWidth="sm"
        >
          <form onSubmit={handleAssignSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Select Field Parcel *
              </label>
              <select
                value={targetFieldId}
                onChange={(e) => setTargetFieldId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white font-medium focus:ring-2 focus:ring-brand-primary"
                required
              >
                {fields.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name} ({f.areaAcres} Acres)
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={() => setShowAssignModal(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="md">
                Confirm Reassignment
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </DashboardShell>
  );
}
