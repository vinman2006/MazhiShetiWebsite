"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  initialSeedData,
  SeedData,
  FarmRecord,
  FarmFieldRecord,
  CropCycleRecord,
  FarmActivityRecord,
  CropObservationRecord,
  HarvestRecordItem,
  SoilTestRecord,
  SoilMeasurementRecord,
  AgriculturalDeviceRecord,
  SensorReadingRecord,
  IrrigationScheduleRecord,
  IrrigationEventRecord,
  DeviceCommandRecord,
  OrganicProgramRecord,
  OrganicTransitionRecord,
  FarmingPracticeRecord,
  OrganicInputRecord,
  InputApplicationRecord,
  NoTillRecord,
  AgriculturalResourceRecord,
  EquipmentListingItem,
  RentalBookingRecord,
  AgriculturalServiceRecord,
  ServiceBookingRecord,
} from "@/db/seed-data";

export type RoleType =
  | "farmer"
  | "equipment_provider"
  | "service_provider"
  | "provider"
  | "buyer"
  | "expert"
  | "banker"
  | "admin";

export interface FarmerOnboardingData {
  fullName: string;
  phone: string;
  email: string;
  avatarUrl: string;
  preferredLanguage: "mr" | "hi" | "en";
  state: string;
  district: string;
  taluka: string;
  village: string;
  pinCode: string;
  gpsCoords?: string;
  totalLandAcres: number;
  ownershipType: "owned" | "leased" | "joint_family";
  numberOfFields: number;
  mainCrops: string[];
  irrigationAvailability: "drip" | "sprinkler" | "well" | "canal" | "rainfed";
  farmingPractice: "conventional" | "organic" | "transitioning" | "natural_zbnf" | "no_till";
  soilHealthTestingFrequency: string;
  currentStep: number;
  isCompleted: boolean;
}

export const initialOnboardingData: FarmerOnboardingData = {
  fullName: "Rameshwar Sadashiv Shinde",
  phone: "+91 98223 41092",
  email: "rameshwar.shinde@farmer.in",
  avatarUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=256",
  preferredLanguage: "mr",
  state: "Maharashtra",
  district: "Wardha",
  taluka: "Karanja (Lad)",
  village: "Ashti",
  pinCode: "442202",
  gpsCoords: "21.1965° N, 78.4312° E",
  totalLandAcres: 12.5,
  ownershipType: "owned",
  numberOfFields: 3,
  mainCrops: ["Cotton (कापूस)", "Soybean (सोयाबीन)", "Turmeric (हळद)"],
  irrigationAvailability: "drip",
  farmingPractice: "transitioning",
  soilHealthTestingFrequency: "Every Season (Mazhi Sheti IoT)",
  currentStep: 1,
  isCompleted: true,
};

interface AppStateContextType {
  data: SeedData;
  activeRole: RoleType;
  setActiveRole: (role: RoleType) => void;
  // Onboarding
  onboarding: FarmerOnboardingData;
  updateOnboarding: (partial: Partial<FarmerOnboardingData>) => void;
  setOnboardingStep: (step: number) => void;
  completeFarmerOnboarding: () => void;
  resetOnboarding: () => void;
  // Phase 3 Farm & Field Operations
  addFarm: (farm: Omit<FarmRecord, "id">) => void;
  editFarm: (id: string, farm: Partial<FarmRecord>) => void;
  deleteFarm: (id: string) => void;
  addField: (field: Omit<FarmFieldRecord, "id">) => void;
  editField: (id: string, field: Partial<FarmFieldRecord>) => void;
  deleteField: (id: string) => void;
  addCropCycle: (crop: Omit<CropCycleRecord, "id">) => void;
  updateCropStage: (id: string, stage: string) => void;
  addFarmActivity: (activity: Omit<FarmActivityRecord, "id">) => void;
  addCropObservation: (observation: Omit<CropObservationRecord, "id">) => void;
  addHarvestRecord: (record: Omit<HarvestRecordItem, "id">) => void;
  // Phase 1 & 2 Actions
  triggerSensorSync: () => void;
  addConsultation: (crop: string, title: string, description: string, urgency: "low" | "medium" | "high" | "critical") => void;
  resolveConsultation: (id: string, diagnosis: string, prescription: string) => void;
  addMarketListing: (crop: string, variety: string, grade: string, quantityKg: number, pricePerKg: number, location: string) => void;
  bookEquipment: (equipmentId: string, startDate: string, endDate: string, totalDays: number, location: string) => void;
  applyForFinance: (type: string, schemeName: string, requestedAmount: number, farmArea: number) => void;
  updateFinanceStatus: (id: string, status: "submitted" | "under_scrutiny" | "approved" | "disbursed" | "rejected") => void;
  // Phase 4: Soil Health, Smart Devices, Irrigation & Sprinklers
  addSoilTest: (test: Omit<SoilTestRecord, "id">) => void;
  addSoilMeasurement: (measurement: Omit<SoilMeasurementRecord, "id">) => void;
  registerDevice: (device: Omit<AgriculturalDeviceRecord, "id">) => void;
  assignDeviceToField: (deviceId: string, fieldId: string, installDepthCm?: number) => void;
  updateDeviceStatus: (deviceId: string, status: "online" | "offline" | "low_battery" | "maintenance") => void;
  dispatchDeviceCommand: (
    deviceId: string,
    commandType: "START_IRRIGATION" | "STOP_IRRIGATION" | "SET_FLOW_RATE" | "CALIBRATE_SENSOR" | "EMERGENCY_SHUTOFF",
    parameters?: Record<string, any>
  ) => Promise<DeviceCommandRecord>;
  acknowledgeDeviceCommand: (
    commandId: string,
    ackPayload: string,
    status: "ACKNOWLEDGED" | "EXECUTED" | "FAILED"
  ) => void;
  addIrrigationSchedule: (schedule: Omit<IrrigationScheduleRecord, "id">) => void;
  toggleIrrigationSchedule: (scheduleId: string, isActive?: boolean) => void;
  recordIrrigationEvent: (event: Omit<IrrigationEventRecord, "id">) => void;
  // Phase 5: Organic Transition, No-Till & Inputs
  registerOrganicTransition: (plan: Omit<OrganicTransitionRecord, "id">) => void;
  updateTransitionStage: (
    transitionId: string,
    stage: OrganicTransitionRecord["currentStage"],
    progressPct: number
  ) => void;
  logFarmingPractice: (practice: Omit<FarmingPracticeRecord, "id">) => void;
  addOrganicInput: (input: Omit<OrganicInputRecord, "id">) => void;
  recordInputApplication: (application: Omit<InputApplicationRecord, "id">) => void;
  recordNoTillActivity: (record: Omit<NoTillRecord, "id">) => void;
  // Phase 6: Equipment & Service Provider Marketplace Actions
  addEquipmentListing: (item: Omit<EquipmentListingItem, "id">) => void;
  updateEquipmentAvailability: (id: string, isAvailable: boolean) => void;
  createRentalBooking: (booking: Omit<RentalBookingRecord, "id" | "status" | "createdAt">) => void;
  updateBookingStatus: (bookingId: string, status: RentalBookingRecord["status"]) => void;
  createServiceBooking: (booking: Omit<ServiceBookingRecord, "id" | "status" | "createdAt">) => void;
  updateServiceBookingStatus: (bookingId: string, status: ServiceBookingRecord["status"]) => void;
}

const STORAGE_KEY = "mazhi_sheti_state_v6";
const ONBOARDING_KEY = "mazhi_sheti_onboarding_v3";

const AppStateContext = createContext<AppStateContextType | undefined>(undefined);

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<SeedData>(initialSeedData);
  const [activeRole, setActiveRoleState] = useState<RoleType>("farmer");
  const [onboarding, setOnboarding] = useState<FarmerOnboardingData>(initialOnboardingData);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setData(JSON.parse(saved));
      }
      const savedOnboarding = localStorage.getItem(ONBOARDING_KEY);
      if (savedOnboarding) {
        setOnboarding(JSON.parse(savedOnboarding));
      }
      const savedRole = localStorage.getItem("mazhi_sheti_role");
      if (
        savedRole &&
        [
          "farmer",
          "equipment_provider",
          "service_provider",
          "provider",
          "buyer",
          "expert",
          "banker",
          "admin",
        ].includes(savedRole)
      ) {
        setActiveRoleState(savedRole as RoleType);
      }
    } catch {
      // Fallback
    }
  }, []);

  const saveState = (updated: SeedData) => {
    setData(updated);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (err) {
        console.error("Storage save failed", err);
      }
    }
  };

  const saveOnboarding = (updated: FarmerOnboardingData) => {
    setOnboarding(updated);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(ONBOARDING_KEY, JSON.stringify(updated));
      } catch (err) {
        console.error("Onboarding save failed", err);
      }
    }
  };

  const updateOnboarding = (partial: Partial<FarmerOnboardingData>) => {
    const updated = { ...onboarding, ...partial };
    saveOnboarding(updated);
  };

  const setOnboardingStep = (step: number) => {
    updateOnboarding({ currentStep: step });
  };

  const completeFarmerOnboarding = () => {
    updateOnboarding({ isCompleted: true, currentStep: 5 });
    setActiveRole("farmer");
  };

  const resetOnboarding = () => {
    saveOnboarding({
      ...initialOnboardingData,
      isCompleted: false,
      currentStep: 1,
    });
  };

  const setActiveRole = (role: RoleType) => {
    setActiveRoleState(role);
    if (typeof window !== "undefined") {
      localStorage.setItem("mazhi_sheti_role", role);
    }
  };

  // ================= PHASE 3 FARM & FIELD ACTIONS =================

  const addFarm = (farm: Omit<FarmRecord, "id">) => {
    const newFarm: FarmRecord = {
      ...farm,
      id: `farm_${Date.now()}`,
    };
    saveState({
      ...data,
      farms: [newFarm, ...data.farms],
    });
  };

  const editFarm = (id: string, farmUpdate: Partial<FarmRecord>) => {
    const updatedFarms = data.farms.map((f) => (f.id === id ? { ...f, ...farmUpdate } : f));
    saveState({
      ...data,
      farms: updatedFarms,
    });
  };

  const deleteFarm = (id: string) => {
    const updatedFarms = data.farms.filter((f) => f.id !== id);
    const updatedFields = data.fields.filter((fld) => fld.farmId !== id);
    saveState({
      ...data,
      farms: updatedFarms,
      fields: updatedFields,
    });
  };

  const addField = (field: Omit<FarmFieldRecord, "id">) => {
    const newField: FarmFieldRecord = {
      ...field,
      id: `field_${Date.now()}`,
    };
    saveState({
      ...data,
      fields: [...data.fields, newField],
    });
  };

  const editField = (id: string, fieldUpdate: Partial<FarmFieldRecord>) => {
    const updatedFields = data.fields.map((fld) => (fld.id === id ? { ...fld, ...fieldUpdate } : fld));
    saveState({
      ...data,
      fields: updatedFields,
    });
  };

  const deleteField = (id: string) => {
    const updatedFields = data.fields.filter((fld) => fld.id !== id);
    saveState({
      ...data,
      fields: updatedFields,
    });
  };

  const addCropCycle = (crop: Omit<CropCycleRecord, "id">) => {
    const newCycle: CropCycleRecord = {
      ...crop,
      id: `cycle_${Date.now()}`,
    };
    saveState({
      ...data,
      cropCycles: [newCycle, ...data.cropCycles],
    });
  };

  const updateCropStage = (id: string, stage: string) => {
    const updatedCycles = data.cropCycles.map((c) => (c.id === id ? { ...c, growthStage: stage } : c));
    saveState({
      ...data,
      cropCycles: updatedCycles,
    });
  };

  const addFarmActivity = (activity: Omit<FarmActivityRecord, "id">) => {
    const newActivity: FarmActivityRecord = {
      ...activity,
      id: `act_${Date.now()}`,
    };
    saveState({
      ...data,
      farmActivities: [newActivity, ...data.farmActivities],
    });
  };

  const addCropObservation = (observation: Omit<CropObservationRecord, "id">) => {
    const newObs: CropObservationRecord = {
      ...observation,
      id: `obs_${Date.now()}`,
    };
    saveState({
      ...data,
      cropObservations: [newObs, ...data.cropObservations],
    });
  };

  const addHarvestRecord = (record: Omit<HarvestRecordItem, "id">) => {
    const newHarvest: HarvestRecordItem = {
      ...record,
      id: `hr_${Date.now()}`,
    };
    saveState({
      ...data,
      harvestRecords: [newHarvest, ...data.harvestRecords],
    });
  };

  // ================= SENSOR & TELEMETRY ACTIONS =================

  const triggerSensorSync = () => {
    const randomMoisture = Number((44 + Math.random() * 8).toFixed(1));
    const randomN = Math.floor(68 + Math.random() * 10);
    const randomTemp = Number((24 + Math.random() * 4).toFixed(1));
    const randomPH = Number((6.5 + Math.random() * 0.4).toFixed(1));
    const randomEC = Number((0.75 + Math.random() * 0.15).toFixed(2));

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

    const updated: SeedData = {
      ...data,
      currentTelemetry: {
        ...data.currentTelemetry,
        moisturePct: randomMoisture,
        nitrogenPpm: randomN,
        temperatureC: randomTemp,
        phLevel: randomPH,
        ecMsCm: randomEC,
        history: [
          ...data.currentTelemetry.history.slice(1),
          {
            time: timeStr,
            moisture: randomMoisture,
            nitrogen: randomN,
            temp: randomTemp,
            ph: randomPH,
          },
        ],
      },
    };
    saveState(updated);
  };

  const addConsultation = (
    crop: string,
    title: string,
    description: string,
    urgency: "low" | "medium" | "high" | "critical"
  ) => {
    const newConsultation = {
      id: `cons_${Date.now()}`,
      farmerId: "usr_farmer_01",
      farmerName: onboarding.fullName || "Rameshwar Shinde",
      cropName: crop,
      title,
      description,
      urgency,
      status: "pending" as const,
      createdAt: "Just now",
    };
    saveState({
      ...data,
      consultations: [newConsultation, ...data.consultations],
    });
  };

  const resolveConsultation = (id: string, diagnosis: string, prescription: string) => {
    const updatedConsultations = data.consultations.map((c) =>
      c.id === id
        ? {
            ...c,
            status: "diagnosed" as const,
            diagnosis,
            prescription,
          }
        : c
    );
    saveState({
      ...data,
      consultations: updatedConsultations,
    });
  };

  const addMarketListing = (
    crop: string,
    variety: string,
    grade: string,
    quantityKg: number,
    pricePerKg: number,
    location: string
  ) => {
    const newListing = {
      id: `prod_${Date.now()}`,
      sellerName: `${onboarding.fullName} (${onboarding.district})`,
      crop,
      variety,
      grade,
      quantityKg,
      pricePerKg,
      mandiBenchmarkPrice: Number((pricePerKg * 0.94).toFixed(1)),
      location,
      harvestDate: "Immediate Harvest",
      status: "active" as const,
      image: crop.toLowerCase().includes("cotton")
        ? "https://images.unsplash.com/photo-1594489428504-5c0c480a15fd?auto=format&fit=crop&q=80&w=600"
        : "https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&q=80&w=600",
    };
    saveState({
      ...data,
      marketplace: [newListing, ...data.marketplace],
    });
  };

  const bookEquipment = (
    equipmentId: string,
    startDate: string,
    endDate: string,
    totalDays: number,
    location: string
  ) => {
    saveState({ ...data });
  };

  const applyForFinance = (
    type: string,
    schemeName: string,
    requestedAmount: number,
    farmArea: number
  ) => {
    const newApplication = {
      id: `app_${Date.now()}`,
      applicantName: onboarding.fullName || "Rameshwar Sadashiv Shinde",
      farmName: `${onboarding.village} Farm (${farmArea} Acres)`,
      type,
      schemeName,
      requestedAmount,
      tenureMonths: 12,
      interestRatePct: 4.0,
      status: "submitted" as const,
      appliedDate: new Date().toISOString().split("T")[0],
    };
    saveState({
      ...data,
      financialApplications: [newApplication, ...data.financialApplications],
    });
  };

  const updateFinanceStatus = (
    id: string,
    status: "submitted" | "under_scrutiny" | "approved" | "disbursed" | "rejected"
  ) => {
    const updated = data.financialApplications.map((app) =>
      app.id === id ? { ...app, status } : app
    );
    saveState({
      ...data,
      financialApplications: updated,
    });
  };

  // ================= PHASE 4: SOIL HEALTH, SMART DEVICES & IRRIGATION =================

  const addSoilTest = (test: Omit<SoilTestRecord, "id">) => {
    const newTest: SoilTestRecord = {
      ...test,
      id: `stl_${Date.now()}`,
    };

    // Also auto-generate linked soil parameter measurements
    const linkedMeasurements: SoilMeasurementRecord[] = [
      {
        id: `sm_ph_${Date.now()}`,
        soilTestId: newTest.id,
        fieldId: newTest.fieldId,
        fieldName: newTest.fieldName,
        parameterName: "Soil pH",
        measuredValue: newTest.phLevel,
        unit: "pH",
        measurementMethod: "laboratory",
        optimalMin: 6.5,
        optimalMax: 7.8,
        rating: newTest.phLevel >= 6.5 && newTest.phLevel <= 7.8 ? "optimal" : newTest.phLevel < 6.5 ? "deficient" : "excess",
        correctiveAction: newTest.phLevel > 7.8 ? "Apply gypsum or acidifying sulfur amender." : newTest.phLevel < 6.5 ? "Apply agricultural lime." : "pH within ideal range.",
        recordedAt: newTest.testDate,
      },
      {
        id: `sm_n_${Date.now()}`,
        soilTestId: newTest.id,
        fieldId: newTest.fieldId,
        fieldName: newTest.fieldName,
        parameterName: "Available Nitrogen (N)",
        measuredValue: newTest.nitrogenKgHa,
        unit: "kg/ha",
        measurementMethod: "laboratory",
        optimalMin: 280,
        optimalMax: 560,
        rating: newTest.nitrogenKgHa >= 280 ? "optimal" : "deficient",
        correctiveAction: newTest.nitrogenKgHa < 280 ? "Top-dress with Neem-coated Urea or split fertigation." : "Nitrogen levels are healthy.",
        recordedAt: newTest.testDate,
      },
      {
        id: `sm_oc_${Date.now()}`,
        soilTestId: newTest.id,
        fieldId: newTest.fieldId,
        fieldName: newTest.fieldName,
        parameterName: "Organic Carbon (OC)",
        measuredValue: newTest.organicCarbonPct,
        unit: "%",
        measurementMethod: "laboratory",
        optimalMin: 0.75,
        optimalMax: 1.25,
        rating: newTest.organicCarbonPct >= 0.75 ? "optimal" : "deficient",
        correctiveAction: newTest.organicCarbonPct < 0.75 ? "Incorporate 2 tonnes/acre FYM or vermicompost." : "Organic carbon is well buffered.",
        recordedAt: newTest.testDate,
      },
      {
        id: `sm_ec_${Date.now()}`,
        soilTestId: newTest.id,
        fieldId: newTest.fieldId,
        fieldName: newTest.fieldName,
        parameterName: "Electrical Conductivity (EC)",
        measuredValue: newTest.electricalConductivity,
        unit: "dS/m",
        measurementMethod: "laboratory",
        optimalMin: 0.1,
        optimalMax: 1.0,
        rating: newTest.electricalConductivity <= 1.0 ? "optimal" : "excess",
        correctiveAction: newTest.electricalConductivity > 1.0 ? "Salinity hazard detected; leach with fresh canal water." : "Salinity is low.",
        recordedAt: newTest.testDate,
      },
    ];

    saveState({
      ...data,
      soilTests: [newTest, ...(data.soilTests || [])],
      soilMeasurements: [...linkedMeasurements, ...(data.soilMeasurements || [])],
    });
  };

  const addSoilMeasurement = (measurement: Omit<SoilMeasurementRecord, "id">) => {
    const newMeasurement: SoilMeasurementRecord = {
      ...measurement,
      id: `sm_${Date.now()}`,
    };
    saveState({
      ...data,
      soilMeasurements: [newMeasurement, ...(data.soilMeasurements || [])],
    });
  };

  const registerDevice = (device: Omit<AgriculturalDeviceRecord, "id">) => {
    const newDevice: AgriculturalDeviceRecord = {
      ...device,
      id: `dev_${Date.now()}`,
    };
    saveState({
      ...data,
      devices: [newDevice, ...(data.devices || [])],
    });
  };

  const assignDeviceToField = (deviceId: string, fieldId: string, installDepthCm?: number) => {
    const targetField = (data.fields || []).find((f) => f.id === fieldId);
    const updatedDevices = (data.devices || []).map((d) =>
      d.id === deviceId
        ? {
            ...d,
            assignedFieldId: fieldId,
            assignedFieldName: targetField ? targetField.name : "Assigned Field",
            installDepthCm: installDepthCm !== undefined ? installDepthCm : d.installDepthCm,
          }
        : d
    );
    saveState({
      ...data,
      devices: updatedDevices,
    });
  };

  const updateDeviceStatus = (
    deviceId: string,
    status: "online" | "offline" | "low_battery" | "maintenance"
  ) => {
    const updated = (data.devices || []).map((d) => (d.id === deviceId ? { ...d, status } : d));
    saveState({
      ...data,
      devices: updated,
    });
  };

  const dispatchDeviceCommand = async (
    deviceId: string,
    commandType: "START_IRRIGATION" | "STOP_IRRIGATION" | "SET_FLOW_RATE" | "CALIBRATE_SENSOR" | "EMERGENCY_SHUTOFF",
    parameters: Record<string, any> = {}
  ): Promise<DeviceCommandRecord> => {
    const targetDevice = (data.devices || []).find((d) => d.id === deviceId);
    const nowIso = new Date().toISOString().replace("T", " ").substring(0, 19);

    const newCommand: DeviceCommandRecord = {
      id: `cmd_${Date.now()}`,
      deviceId,
      deviceName: targetDevice ? targetDevice.deviceName : "Agricultural Device",
      commandType,
      parameters,
      status: "DISPATCHED",
      requestedByUserId: "usr_farmer_01",
      dispatchedAt: nowIso,
    };

    // Update state with dispatched command
    let currentData = {
      ...data,
      deviceCommands: [newCommand, ...(data.deviceCommands || [])],
    };
    saveState(currentData);

    // Simulate edge IoT device handshake (LoRaWAN/MQTT ACK protocol)
    return new Promise((resolve) => {
      setTimeout(() => {
        const ackIso = new Date().toISOString().replace("T", " ").substring(0, 19);
        let ackMsg = `ACK_OK: Command ${commandType} verified and executed by device firmware.`;
        let updatedEvents = [...(currentData.irrigationEvents || [])];

        if (commandType === "START_IRRIGATION") {
          const duration = parameters.durationMinutes || 45;
          const flowRate = parameters.flowRateLpm || 55;
          const calculatedLiters = duration * flowRate;
          ackMsg = `ACK_OK: Solenoid valve engaged. Flow rate ${flowRate} LPM active for ${duration} mins.`;

          // Add active irrigation event
          const newEvent: IrrigationEventRecord = {
            id: `irrv_${Date.now()}`,
            farmId: "farm_01",
            fieldId: targetDevice?.assignedFieldId || "field_01",
            fieldName: targetDevice?.assignedFieldName || "North Acre - Gat 142/A",
            deviceId: targetDevice?.id,
            deviceName: targetDevice?.deviceName,
            triggerType: "manual",
            startTime: ackIso,
            durationMinutes: duration,
            waterVolumeLiters: calculatedLiters,
            waterSource: "borewell",
            status: "in_progress",
            energyUnitsKwh: Number(((duration / 60) * 2.2).toFixed(1)),
            notes: `Dispatched via remote command ${newCommand.id}. Solenoid valve open.`,
          };
          updatedEvents = [newEvent, ...updatedEvents];
        } else if (commandType === "STOP_IRRIGATION" || commandType === "EMERGENCY_SHUTOFF") {
          ackMsg = `ACK_OK: Shutoff command executed. Solenoid valve closed. Pressure stabilized.`;
          updatedEvents = updatedEvents.map((ev) =>
            ev.status === "in_progress"
              ? {
                  ...ev,
                  status: "completed" as const,
                  endTime: ackIso,
                  notes: `${ev.notes || ""} • Stopped remotely via ${commandType}.`,
                }
              : ev
          );
        } else if (commandType === "CALIBRATE_SENSOR") {
          ackMsg = `CALIBRATION_OK: Zero-drift compensated. Probe calibrated against reference clay loam.`;
        }

        const executedCommand: DeviceCommandRecord = {
          ...newCommand,
          status: "EXECUTED",
          acknowledgedAt: ackIso,
          executedAt: ackIso,
          deviceAckPayload: ackMsg,
        };

        const finalizedCommands = (currentData.deviceCommands || []).map((c) =>
          c.id === newCommand.id ? executedCommand : c
        );

        const finalizedData = {
          ...currentData,
          deviceCommands: finalizedCommands,
          irrigationEvents: updatedEvents,
        };
        saveState(finalizedData);
        resolve(executedCommand);
      }, 700);
    });
  };

  const acknowledgeDeviceCommand = (
    commandId: string,
    ackPayload: string,
    status: "ACKNOWLEDGED" | "EXECUTED" | "FAILED"
  ) => {
    const updated = (data.deviceCommands || []).map((c) =>
      c.id === commandId
        ? {
            ...c,
            status,
            deviceAckPayload: ackPayload,
            acknowledgedAt: new Date().toISOString(),
            ...(status === "EXECUTED" ? { executedAt: new Date().toISOString() } : {}),
          }
        : c
    );
    saveState({
      ...data,
      deviceCommands: updated,
    });
  };

  const addIrrigationSchedule = (schedule: Omit<IrrigationScheduleRecord, "id">) => {
    const newSchedule: IrrigationScheduleRecord = {
      ...schedule,
      id: `irrs_${Date.now()}`,
    };
    saveState({
      ...data,
      irrigationSchedules: [newSchedule, ...(data.irrigationSchedules || [])],
    });
  };

  const toggleIrrigationSchedule = (scheduleId: string, isActive?: boolean) => {
    const updated = (data.irrigationSchedules || []).map((s) =>
      s.id === scheduleId
        ? {
            ...s,
            isActive: isActive !== undefined ? isActive : !s.isActive,
          }
        : s
    );
    saveState({
      ...data,
      irrigationSchedules: updated,
    });
  };

  const recordIrrigationEvent = (event: Omit<IrrigationEventRecord, "id">) => {
    const newEvent: IrrigationEventRecord = {
      ...event,
      id: `irrv_${Date.now()}`,
    };
    saveState({
      ...data,
      irrigationEvents: [newEvent, ...(data.irrigationEvents || [])],
    });
  };

  // ================= PHASE 5: ORGANIC TRANSITION, NO-TILL & INPUTS =================

  const registerOrganicTransition = (plan: Omit<OrganicTransitionRecord, "id">) => {
    const newRecord: OrganicTransitionRecord = {
      ...plan,
      id: `tr_${Date.now()}`,
    };
    saveState({
      ...data,
      organicTransitions: [newRecord, ...(data.organicTransitions || [])],
    });
  };

  const updateTransitionStage = (
    transitionId: string,
    stage: OrganicTransitionRecord["currentStage"],
    progressPct: number
  ) => {
    const updated = (data.organicTransitions || []).map((t) => {
      if (t.id !== transitionId) return t;

      // Strict validation: isCertified is NEVER auto-set to true
      // It only becomes certified if approved through formal audit & progress is 100%
      const newStatus =
        progressPct >= 100
          ? ("under_audit" as const)
          : progressPct >= 65
          ? ("in_conversion_c2" as const)
          : progressPct >= 35
          ? ("in_conversion_c1" as const)
          : t.conversionStatus;

      return {
        ...t,
        currentStage: stage,
        progressPct,
        conversionStatus: newStatus,
        updatedAt: new Date().toISOString(),
      };
    });

    saveState({
      ...data,
      organicTransitions: updated,
    });
  };

  const logFarmingPractice = (practice: Omit<FarmingPracticeRecord, "id">) => {
    const newPractice: FarmingPracticeRecord = {
      ...practice,
      id: `fp_${Date.now()}`,
    };
    saveState({
      ...data,
      farmingPractices: [newPractice, ...(data.farmingPractices || [])],
    });
  };

  const addOrganicInput = (input: Omit<OrganicInputRecord, "id">) => {
    const newInput: OrganicInputRecord = {
      ...input,
      id: `inp_${Date.now()}`,
    };
    saveState({
      ...data,
      organicInputs: [newInput, ...(data.organicInputs || [])],
    });
  };

  const recordInputApplication = (application: Omit<InputApplicationRecord, "id">) => {
    const newApp: InputApplicationRecord = {
      ...application,
      id: `ia_${Date.now()}`,
    };
    saveState({
      ...data,
      inputApplications: [newApp, ...(data.inputApplications || [])],
    });
  };

  const recordNoTillActivity = (record: Omit<NoTillRecord, "id">) => {
    const newRecord: NoTillRecord = {
      ...record,
      id: `ntr_${Date.now()}`,
    };
    saveState({
      ...data,
      noTillRecords: [newRecord, ...(data.noTillRecords || [])],
    });
  };

  // ================= PHASE 6: EQUIPMENT & SERVICE PROVIDER MARKETPLACE =================

  const addEquipmentListing = (item: Omit<EquipmentListingItem, "id">) => {
    const newItem: EquipmentListingItem = {
      ...item,
      id: `equip_${Date.now()}`,
    };
    saveState({
      ...data,
      equipment: [newItem, ...(data.equipment || [])],
    });
  };

  const updateEquipmentAvailability = (id: string, isAvailable: boolean) => {
    const updated = (data.equipment || []).map((eq) =>
      eq.id === id ? { ...eq, isAvailable, status: isAvailable ? ("active" as const) : ("maintenance" as const) } : eq
    );
    saveState({
      ...data,
      equipment: updated,
    });
  };

  const createRentalBooking = (booking: Omit<RentalBookingRecord, "id" | "status" | "createdAt">) => {
    const newBooking: RentalBookingRecord = {
      ...booking,
      id: `book_${Date.now()}`,
      status: "requested",
      createdAt: new Date().toISOString().replace("T", " ").substring(0, 16),
    };
    saveState({
      ...data,
      rentalBookings: [newBooking, ...(data.rentalBookings || [])],
    });
  };

  const updateBookingStatus = (bookingId: string, status: RentalBookingRecord["status"]) => {
    const updated = (data.rentalBookings || []).map((b) =>
      b.id === bookingId ? { ...b, status } : b
    );
    saveState({
      ...data,
      rentalBookings: updated,
    });
  };

  const createServiceBooking = (booking: Omit<ServiceBookingRecord, "id" | "status" | "createdAt">) => {
    const newBooking: ServiceBookingRecord = {
      ...booking,
      id: `sb_${Date.now()}`,
      status: "requested",
      createdAt: new Date().toISOString().replace("T", " ").substring(0, 16),
    };
    saveState({
      ...data,
      serviceBookings: [newBooking, ...(data.serviceBookings || [])],
    });
  };

  const updateServiceBookingStatus = (bookingId: string, status: ServiceBookingRecord["status"]) => {
    const updated = (data.serviceBookings || []).map((sb) =>
      sb.id === bookingId ? { ...sb, status } : sb
    );
    saveState({
      ...data,
      serviceBookings: updated,
    });
  };

  return (
    <AppStateContext.Provider
      value={{
        data,
        activeRole,
        setActiveRole,
        onboarding,
        updateOnboarding,
        setOnboardingStep,
        completeFarmerOnboarding,
        resetOnboarding,
        addFarm,
        editFarm,
        deleteFarm,
        addField,
        editField,
        deleteField,
        addCropCycle,
        updateCropStage,
        addFarmActivity,
        addCropObservation,
        addHarvestRecord,
        triggerSensorSync,
        addConsultation,
        resolveConsultation,
        addMarketListing,
        bookEquipment,
        applyForFinance,
        updateFinanceStatus,
        addSoilTest,
        addSoilMeasurement,
        registerDevice,
        assignDeviceToField,
        updateDeviceStatus,
        dispatchDeviceCommand,
        acknowledgeDeviceCommand,
        addIrrigationSchedule,
        toggleIrrigationSchedule,
        recordIrrigationEvent,
        registerOrganicTransition,
        updateTransitionStage,
        logFarmingPractice,
        addOrganicInput,
        recordInputApplication,
        recordNoTillActivity,
        addEquipmentListing,
        updateEquipmentAvailability,
        createRentalBooking,
        updateBookingStatus,
        createServiceBooking,
        updateServiceBookingStatus,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error("useAppState must be used within an AppStateProvider");
  }
  return context;
}
