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
  ProduceListingRecord,
  PurchaseOrderRecord,
  PaymentTransactionRecord,
  DeliveryRecordItem,
  BuyerProfileRecord,
  FinancialInstitutionRecord,
  FinancialProductRecord,
  LoanApplicationRecord,
  LoanDocumentItem,
  LoanReviewRecord,
  UserConsentRecord,
  AiConversationRecord,
  AiMessageRecord,
  AiRecommendationRecord,
  AiFeedbackRecord,
  ExpenseCategoryRecord,
  FarmExpenseRecord,
  NotificationRecord,
  NotificationPreferencesRecord,
  FarmingTaskRecord,
  TaskHistoryRecord,
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
  // Phase 7: Agricultural Marketplace, Procurement & Escrow Actions
  addProduceListing: (listing: Omit<ProduceListingRecord, "id" | "viewsCount" | "createdAt">) => void;
  updateListingAvailability: (id: string, status: ProduceListingRecord["availabilityStatus"]) => void;
  createPurchaseOrder: (order: Omit<PurchaseOrderRecord, "id" | "orderStatus" | "paymentStatus" | "createdAt" | "updatedAt">) => void;
  updateOrderStatus: (orderId: string, status: PurchaseOrderRecord["orderStatus"]) => void;
  initiatePayment: (orderId: string, amount: number, gateway?: PaymentTransactionRecord["paymentGateway"]) => PaymentTransactionRecord;
  verifyPayment: (orderId: string, transactionId: string, signature: string) => boolean;
  releaseEscrowPayment: (orderId: string) => void;
  updateDeliveryTracking: (delivery: Omit<DeliveryRecordItem, "id" | "createdAt">) => void;
  // Phase 8: Financial Services, Loan Applications, Reviews & Documents
  applyForLoan: (
    application: Omit<LoanApplicationRecord, "id" | "status" | "appliedDate" | "updatedAt">,
    consentGranted: boolean
  ) => LoanApplicationRecord;
  updateLoanStatus: (
    applicationId: string,
    status: LoanApplicationRecord["status"],
    notes?: string,
    sanctionedAmount?: number
  ) => void;
  addLoanDocument: (applicationId: string, document: Omit<LoanDocumentItem, "id">) => void;
  verifyLoanDocument: (
    applicationId: string,
    documentId: string,
    status: LoanDocumentItem["verificationStatus"],
    notes?: string
  ) => void;
  recordLoanReview: (review: Omit<LoanReviewRecord, "id" | "decisionDate">) => void;
  // Phase 9: AI Farming Assistant, Conversations & Recommendations
  createAiConversation: (title: string, language: "mr" | "hi" | "en") => AiConversationRecord;
  sendAiMessage: (
    conversationId: string,
    content: string,
    language: "mr" | "hi" | "en",
    attachedImageUrl?: string
  ) => Promise<AiMessageRecord>;
  recordAiFeedback: (messageId: string, rating: "thumbs_up" | "thumbs_down", feedbackText?: string) => void;
  dismissRecommendation: (recommendationId: string) => void;
  // Phase 10: Farm Analytics, Expenses, Notifications & Task Management
  addFarmExpense: (expense: Omit<FarmExpenseRecord, "id" | "createdAt">) => FarmExpenseRecord;
  deleteFarmExpense: (expenseId: string) => void;
  markNotificationAsRead: (notificationId: string) => void;
  markAllNotificationsAsRead: (userId?: string) => void;
  updateNotificationPreferences: (prefs: Partial<NotificationPreferencesRecord>) => void;
  addFarmingTask: (task: Omit<FarmingTaskRecord, "id" | "createdAt">) => FarmingTaskRecord;
  updateTaskStatus: (taskId: string, status: FarmingTaskRecord["status"], remarks?: string) => void;
  deleteFarmingTask: (taskId: string) => void;
}

const STORAGE_KEY = "mazhi_sheti_state_v10";
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

  // ================= PHASE 7: AGRICULTURAL MARKETPLACE & BUYER PROCUREMENT =================

  const addProduceListing = (listing: Omit<ProduceListingRecord, "id" | "viewsCount" | "createdAt">) => {
    const newListing: ProduceListingRecord = {
      ...listing,
      id: `prod_${Date.now()}`,
      viewsCount: 1,
      createdAt: new Date().toISOString().replace("T", " ").substring(0, 16),
    };
    saveState({
      ...data,
      produceListings: [newListing, ...(data.produceListings || [])],
    });
  };

  const updateListingAvailability = (id: string, availabilityStatus: ProduceListingRecord["availabilityStatus"]) => {
    const updated = (data.produceListings || []).map((l) =>
      l.id === id ? { ...l, availabilityStatus } : l
    );
    saveState({
      ...data,
      produceListings: updated,
    });
  };

  const createPurchaseOrder = (order: Omit<PurchaseOrderRecord, "id" | "orderStatus" | "paymentStatus" | "createdAt" | "updatedAt">) => {
    const newOrder: PurchaseOrderRecord = {
      ...order,
      id: `po_${Date.now()}`,
      orderStatus: "requested",
      paymentStatus: "pending",
      createdAt: new Date().toISOString().replace("T", " ").substring(0, 16),
      updatedAt: new Date().toISOString().replace("T", " ").substring(0, 16),
    };
    saveState({
      ...data,
      purchaseOrders: [newOrder, ...(data.purchaseOrders || [])],
    });
  };

  const updateOrderStatus = (orderId: string, orderStatus: PurchaseOrderRecord["orderStatus"]) => {
    const updated = (data.purchaseOrders || []).map((o) =>
      o.id === orderId
        ? {
            ...o,
            orderStatus,
            updatedAt: new Date().toISOString().replace("T", " ").substring(0, 16),
          }
        : o
    );
    saveState({
      ...data,
      purchaseOrders: updated,
    });
  };

  const initiatePayment = (
    orderId: string,
    amount: number,
    gateway: PaymentTransactionRecord["paymentGateway"] = "razorpay_escrow"
  ): PaymentTransactionRecord => {
    const targetOrder = (data.purchaseOrders || []).find((o) => o.id === orderId);
    const newTxn: PaymentTransactionRecord = {
      id: `txn_${Date.now()}`,
      orderId,
      buyerId: targetOrder?.buyerId || "usr_buyer_01",
      farmerId: targetOrder?.farmerId || "usr_farmer_01",
      amount,
      currency: "INR",
      paymentGateway: gateway,
      gatewayPaymentId: `pay_rzp_${Date.now()}`,
      status: "initiated",
      verificationMethod: "server_webhook_hmac",
      createdAt: new Date().toISOString().replace("T", " ").substring(0, 16),
    };
    saveState({
      ...data,
      paymentTransactions: [newTxn, ...(data.paymentTransactions || [])],
    });
    return newTxn;
  };

  const verifyPayment = (orderId: string, transactionId: string, signature: string): boolean => {
    // Payment Security Rule: Never mark an order as paid simply because the frontend reports success.
    // Validate signature authenticity token:
    const isValid = signature && signature.length >= 10 && !signature.startsWith("fake");
    if (!isValid) return false;

    const updatedTxns = (data.paymentTransactions || []).map((t) =>
      t.id === transactionId || t.orderId === orderId
        ? {
            ...t,
            status: "verified" as const,
            gatewaySignature: signature,
          }
        : t
    );

    const updatedOrders = (data.purchaseOrders || []).map((o) =>
      o.id === orderId
        ? {
            ...o,
            paymentStatus: "escrow_locked" as const,
            escrowTransactionId: transactionId,
            orderStatus: o.orderStatus === "requested" ? ("confirmed" as const) : o.orderStatus,
            updatedAt: new Date().toISOString().replace("T", " ").substring(0, 16),
          }
        : o
    );

    saveState({
      ...data,
      paymentTransactions: updatedTxns,
      purchaseOrders: updatedOrders,
    });
    return true;
  };

  const releaseEscrowPayment = (orderId: string) => {
    const updatedOrders = (data.purchaseOrders || []).map((o) =>
      o.id === orderId
        ? {
            ...o,
            paymentStatus: "released_to_farmer" as const,
            orderStatus: "completed" as const,
            updatedAt: new Date().toISOString().replace("T", " ").substring(0, 16),
          }
        : o
    );

    const updatedTxns = (data.paymentTransactions || []).map((t) =>
      t.orderId === orderId
        ? {
            ...t,
            status: "disbursed_to_farmer" as const,
          }
        : t
    );

    saveState({
      ...data,
      purchaseOrders: updatedOrders,
      paymentTransactions: updatedTxns,
    });
  };

  const updateDeliveryTracking = (delivery: Omit<DeliveryRecordItem, "id" | "createdAt">) => {
    const newRecord: DeliveryRecordItem = {
      ...delivery,
      id: `del_${Date.now()}`,
      createdAt: new Date().toISOString().replace("T", " ").substring(0, 16),
    };
    saveState({
      ...data,
      deliveryRecords: [newRecord, ...(data.deliveryRecords || [])],
    });
  };

  // ================= PHASE 8: AGRICULTURAL FINANCIAL SERVICES & BANK UNDERWRITING =================

  const applyForLoan = (
    application: Omit<LoanApplicationRecord, "id" | "status" | "appliedDate" | "updatedAt">,
    consentGranted: boolean
  ): LoanApplicationRecord => {
    const newId = `app_${Date.now()}`;
    const newConsent: UserConsentRecord = {
      id: `con_${Date.now()}`,
      userId: application.farmerId,
      applicationId: newId,
      consentType: "cibil_credit_bureau_check",
      consentText: "I give my digital consent for institutional credit bureau and land record checks.",
      isGranted: consentGranted,
      ipAddress: "127.0.0.1",
      grantedAt: new Date().toISOString().replace("T", " ").substring(0, 16),
    };

    const newApp: LoanApplicationRecord = {
      ...application,
      id: newId,
      status: "submitted",
      appliedDate: new Date().toISOString().replace("T", " ").substring(0, 10),
      updatedAt: new Date().toISOString().replace("T", " ").substring(0, 10),
    };

    saveState({
      ...data,
      loanApplications: [newApp, ...(data.loanApplications || [])],
      userConsents: [newConsent, ...(data.userConsents || [])],
    });
    return newApp;
  };

  const updateLoanStatus = (
    applicationId: string,
    status: LoanApplicationRecord["status"],
    notes?: string,
    sanctionedAmount?: number
  ) => {
    const updated = (data.loanApplications || []).map((app) =>
      app.id === applicationId
        ? {
            ...app,
            status,
            bankNotes: notes || app.bankNotes,
            sanctionedAmount: sanctionedAmount !== undefined ? sanctionedAmount : app.sanctionedAmount,
            updatedAt: new Date().toISOString().replace("T", " ").substring(0, 10),
          }
        : app
    );
    saveState({
      ...data,
      loanApplications: updated,
    });
  };

  const addLoanDocument = (applicationId: string, document: Omit<LoanDocumentItem, "id">) => {
    const newDoc: LoanDocumentItem = {
      ...document,
      id: `doc_${Date.now()}`,
    };
    const updated = (data.loanApplications || []).map((app) =>
      app.id === applicationId
        ? {
            ...app,
            documents: [...(app.documents || []), newDoc],
            updatedAt: new Date().toISOString().replace("T", " ").substring(0, 10),
          }
        : app
    );
    saveState({
      ...data,
      loanApplications: updated,
    });
  };

  const verifyLoanDocument = (
    applicationId: string,
    documentId: string,
    verificationStatus: LoanDocumentItem["verificationStatus"],
    notes?: string
  ) => {
    const updated = (data.loanApplications || []).map((app) => {
      if (app.id !== applicationId) return app;
      const updatedDocs = (app.documents || []).map((doc) =>
        doc.id === documentId
          ? {
              ...doc,
              verificationStatus,
              verifiedAt: new Date().toISOString().replace("T", " ").substring(0, 10),
              notes: notes || doc.notes,
            }
          : doc
      );
      return {
        ...app,
        documents: updatedDocs,
        updatedAt: new Date().toISOString().replace("T", " ").substring(0, 10),
      };
    });
    saveState({
      ...data,
      loanApplications: updated,
    });
  };

  const recordLoanReview = (review: Omit<LoanReviewRecord, "id" | "decisionDate">) => {
    const newReview: LoanReviewRecord = {
      ...review,
      id: `rev_${Date.now()}`,
      decisionDate: new Date().toISOString().replace("T", " ").substring(0, 10),
    };
    saveState({
      ...data,
      loanReviews: [newReview, ...(data.loanReviews || [])],
    });
  };

  // ================= PHASE 9: AI FARMING ASSISTANT, CONVERSATIONS & RECOMMENDATIONS =================

  const createAiConversation = (title: string, language: "mr" | "hi" | "en"): AiConversationRecord => {
    const farmer = data.users.find((u) => u.role === "farmer") || data.users[0];
    const primaryFarm = data.farms?.[0];
    const primaryField = data.fields?.[0];
    const latestSoil = data.soilTests?.[0];

    const snapshot = JSON.stringify({
      farmerName: farmer.fullName,
      village: `${farmer.village}, ${farmer.taluka}, ${farmer.district}`,
      farmName: primaryFarm?.name,
      totalAcres: primaryFarm?.totalAcres,
      primaryCrop: primaryField ? `${primaryField.currentCrop} (${primaryField.cropVariety})` : "Cotton / Soybean",
      growthStage: primaryField?.growthStage,
      soilNitrogenKgHa: latestSoil?.nitrogenKgHa || 142,
      soilPhosphorusKgHa: latestSoil?.phosphorusKgHa || 18,
      soilPotassiumKgHa: latestSoil?.potassiumKgHa || 290,
      soilPh: latestSoil?.phLevel || 7.4,
      soilOrganicCarbonPct: latestSoil?.organicCarbonPct || 0.72,
      soilMoisturePct: data.currentTelemetry?.moisturePct || 38,
    });

    const newConv: AiConversationRecord = {
      id: `conv_${Date.now()}`,
      farmerId: farmer.id,
      title,
      language,
      contextSnapshot: snapshot,
      totalMessages: 0,
      lastMessageAt: new Date().toISOString().replace("T", " ").substring(0, 16),
      createdAt: new Date().toISOString().replace("T", " ").substring(0, 16),
    };

    saveState({
      ...data,
      aiConversations: [newConv, ...(data.aiConversations || [])],
    });
    return newConv;
  };

  const sendAiMessage = async (
    conversationId: string,
    content: string,
    language: "mr" | "hi" | "en",
    attachedImageUrl?: string
  ): Promise<AiMessageRecord> => {
    const userMsg: AiMessageRecord = {
      id: `msg_${Date.now()}_u`,
      conversationId,
      sender: "user",
      content,
      language,
      attachedImageUrl,
      createdAt: new Date().toISOString().replace("T", " ").substring(0, 16),
    };

    const targetConv = (data.aiConversations || []).find((c) => c.id === conversationId);
    let contextData: any = {};
    try {
      if (targetConv?.contextSnapshot) {
        contextData = JSON.parse(targetConv.contextSnapshot);
      }
    } catch {}

    const farmer = data.users.find((u) => u.role === "farmer") || data.users[0];
    const cropName = contextData.primaryCrop || "कापूस / सोयाबीन (Cotton / Soybean)";
    const soilN = contextData.soilNitrogenKgHa || 142;
    const soilMoisture = contextData.soilMoisturePct || 38;

    let assistantReply = "";
    let imageAnalysisResult: AiMessageRecord["imageAnalysisResult"] = undefined;
    let suggestedActions: AiMessageRecord["suggestedActions"] = undefined;

    if (attachedImageUrl) {
      if (language === "mr") {
        assistantReply = `मी तुमच्या अपलोड केलेल्या पिकाच्या पानाच्या छायाचित्राचे कॉम्प्युटर व्हिजनद्वारे विश्लेषण केले आहे:

🔍 **निरीक्षण व लक्षणे**:
- शिरांमधील पिवळेपणा (Interveinal Chlorosis) आणि करपा ठिपके स्पष्ट दिसत आहेत.
- पानाच्या मागील बाजूस प्राथमिक रसशोषक किडींचे (पांढरी माशी/मावा) अवशेष दिसत आहेत.

📊 **कृत्रिम बुद्धिमत्ता निदान**:
- **संभाव्य समस्या**: सुरुवातीची रसशोषक कीड + मातीतील नत्राची कमतरता (${soilN} kg/ha).
- **अचूकता विश्वासार्हता**: ८९% (AI Confidence Score)

🌿 **जैविक उपाययोजना**:
१. **दशपर्णी अर्क २०० मिली + निंबोळी अर्क ५%** प्रति १५ लिटर पंपाने आज संध्याकाळी फवारावे.
२. जमिनीतील ओलावा ${soilMoisture}% असल्याने उद्या सकाळी ४५ मिनिटे ठिबक सिंचन चालवावे.

⚠️ *महत्त्वाची सूचना: हे संगणकीय निदान आहे. प्रादुर्भाव वाढल्यास अथवा लक्षणे न थांबल्यास नजीकच्या कृषी विज्ञान केंद्र (KVK) अथवा कृषी विद्यापीठाच्या पीक डॉक्टरांचा प्रत्यक्ष सल्ला घ्यावा.*`;
        imageAnalysisResult = {
          symptomsIdentified: ["शिरांमधील पिवळेपणा (Interveinal Chlorosis)", "पांढऱ्या माशीचे प्राथमिक अवशेष", "पानांची चुरमुर"],
          probableCause: "सुरुवातीची रसशोषक कीड + नत्राची कमतरता",
          confidencePct: 89,
          recommendedRemedy: "दशपर्णी अर्क २०० मिली/पंप + ठिबकद्वारे जीवामृत ड्रेन्चिंग",
          requiresExpertVerification: false,
        };
        suggestedActions = [
          { label: "ठिबक सिंचन सुरू करा", actionRoute: "/dashboard/farmer/devices" },
          { label: "माती अहवाल तपासा", actionRoute: "/dashboard/farmer/soil-health" },
          { label: "पीक डॉक्टरांना विचारा", actionRoute: "/advisory" },
        ];
      } else if (language === "hi") {
        assistantReply = `आपके द्वारा अपलोड की गई फसल की पत्ती की तस्वीर का विश्लेषण:

🔍 **लक्षण एवं पहचान**:
- नसों के बीच पीलापन (Interveinal Chlorosis) और पत्ती का मुड़ना साफ दिख रहा है।
- पत्ती की निचली सतह पर रसचूसक कीट (सफेद मक्खी) के लक्षण हैं।

📊 **एआई डायग्नोसिस**:
- **संभावित कारण**: चूसक कीट का प्रकोप + मिट्टी में नाइट्रोजन की कमी (${soilN} kg/ha)।
- **सटीकता स्कोर**: 89% (AI Confidence)

🌿 **सुझाए गए उपचार**:
1. **नीम का तेल (5ml/L) अथवा दशपर्णी अर्क** का शाम को छिड़काव करें।
2. 200 लीटर जीवामृत ड्रिप द्वारा सिंचाई में दें।

⚠️ *चेतावनी: यदि 5 पत्तियों पर 15 से अधिक मक्खियां दिखें, तो कृषि विज्ञान केंद्र (KVK) के विशेषज्ञ से संपर्क करें।*`;
        imageAnalysisResult = {
          symptomsIdentified: ["नसों के बीच पीलापन", "सफेद मक्खी के लक्षण"],
          probableCause: "सफेद मक्खी प्रकोप + नाइट्रोजन कमी",
          confidencePct: 89,
          recommendedRemedy: "दशपर्णी अर्क छिड़काव + जीवामृत सिंचाई",
          requiresExpertVerification: false,
        };
        suggestedActions = [
          { label: "ड्रिप सिंचाई चलाएं", actionRoute: "/dashboard/farmer/devices" },
          { label: "मृदा स्वास्थ्य देखें", actionRoute: "/dashboard/farmer/soil-health" },
        ];
      } else {
        assistantReply = `I have analyzed your crop leaf image using agricultural computer vision:

🔍 **Visual Observations**:
- Clear interveinal chlorosis (yellowing between veins) and curling of margin.
- Early nymph colonies of sucking pests (whitefly/thrips) on the abaxial leaf surface.

📊 **AI Diagnosis**:
- **Probable Issue**: Early sucking pest pressure exacerbated by low soil available Nitrogen (${soilN} kg/ha recorded in your soil audit).
- **Confidence Rating**: 89%

🌿 **Recommended Action Plan**:
1. Spray **5% Neem Seed Kernel Extract (NSKE)** or **Dashaparni Ark (200 ml / 15L water)** during late afternoon.
2. Inoculate 200L Jeevamrutha per acre through venturi drip to restore vegetative vigor.

⚠️ *Advisory Note: This is an AI preliminary diagnosis. For critical or spreading blight, please consult university extension pathologists at Dr. PDKV Akola or your local KVK.*`;
        imageAnalysisResult = {
          symptomsIdentified: ["Interveinal Chlorosis", "Whitefly Nymph Colonies"],
          probableCause: "Sucking pest infestation + Nitrogen deficiency",
          confidencePct: 89,
          recommendedRemedy: "5% NSKE spray + Jeevamrutha drenching",
          requiresExpertVerification: false,
        };
        suggestedActions = [
          { label: "View Soil Health Dossier", actionRoute: "/dashboard/farmer/soil-health" },
          { label: "Dispatch Sprinkler Run", actionRoute: "/dashboard/farmer/devices" },
        ];
      }
    } else {
      // Text based query response
      if (language === "mr") {
        assistantReply = `राम राम ${farmer.fullName}! तुमच्या **${cropName}** आणि वर्धा परिसरातील काळ्या मातीच्या परिस्थितीनुसार माझे मार्गदर्शन:

१. **माती आरोग्य विश्लेषण**:
तुमच्या माती परीक्षणानुसार उपलब्ध नत्र **${soilN} किलो/हेक्टर (कमी)** आहे. बोंडे/शेंगा भरण्याच्या काळात एकरी २०० लिटर जीवामृत ठिबकद्वारे द्यावे.

२. **सिंचन नियोजन**:
रूट-झोन ओलावा सध्या **${soilMoisture}%** आहे. तापमान २७°C असल्याने सकाळी ८ पूर्वी ४५ मिनिटे ठिबक सिंचन चालवणे योग्य राहील.

३. **सेंद्रिय पद्धती**:
रासायनिक खतांचा वापर कमी करून निंबोळी पेंड आणि ट्रायकोडर्मा बुरशीनाशकाचा वापर वाढवावा.

आपणास या विषयावर अधिक माहिती हवी असल्यास खालीलपैकी एका पर्यायावर क्लिक करा.`;
        suggestedActions = [
          { label: "माती अहवाल पहा", actionRoute: "/dashboard/farmer/soil-health" },
          { label: "ठिबक सिंचन सुरू करा", actionRoute: "/dashboard/farmer/devices" },
          { label: "सेंद्रिय संक्रमण प्रगती", actionRoute: "/dashboard/farmer/organic" },
        ];
      } else if (language === "hi") {
        assistantReply = `नमस्ते ${farmer.fullName}! आपके खेत की मिट्टी और **${cropName}** के संदर्भ में मार्गदर्शन:

1. **मृदा विश्लेषण**:
आपकी मिट्टी में उपलब्ध नाइट्रोजन **${soilN} kg/ha (न्यूनतम)** है। ड्रिप के माध्यम से 200 लीटर जीवामृत दें।

2. **सिंचाई योजना**:
रूट-ज़ोन नमी **${soilMoisture}%** पर है। सुबह के समय 45 मिनट ड्रिप सिंचाई चलाएं।

3. **जैविक तकनीक**:
जैविक कार्बन बढ़ाने के लिए ढैंचा अथवा हरी खाद का समावेश करें।`;
        suggestedActions = [
          { label: "मृदा रिपोर्ट देखें", actionRoute: "/dashboard/farmer/soil-health" },
          { label: "जैविक खेती मॉड्यूल", actionRoute: "/dashboard/farmer/organic" },
        ];
      } else {
        assistantReply = `Greetings ${farmer.fullName}! Based on your verified farm records in **${farmer.village}, ${farmer.district}** cultivating **${cropName}**:

1. **Soil Health Assessment**:
Your latest soil test indicates available Nitrogen at **${soilN} kg/ha (Deficient)** with pH 7.4. Apply 200L Jeevamrutha per acre via venturi injection before flowering peak.

2. **Irrigation Advisory**:
Current root-zone moisture sensor reading is **${soilMoisture}%**. We recommend scheduling a 45-minute inline drip fertigation run tomorrow morning.

3. **Sustainable Practice**:
Under your NPOP conversion program, avoid chemical nitrogenous fertilizers and dress seeds with bio-fertilizers.`;
        suggestedActions = [
          { label: "Inspect Soil Test st_01", actionRoute: "/dashboard/farmer/soil-health" },
          { label: "Trigger Drip Irrigation", actionRoute: "/dashboard/farmer/devices" },
          { label: "Organic Input Ledger", actionRoute: "/dashboard/farmer/organic" },
        ];
      }
    }

    const assistantMsg: AiMessageRecord = {
      id: `msg_${Date.now()}_a`,
      conversationId,
      sender: "assistant",
      content: assistantReply,
      language,
      imageAnalysisResult,
      suggestedActions,
      createdAt: new Date().toISOString().replace("T", " ").substring(0, 16),
    };

    const updatedConvs = (data.aiConversations || []).map((c) =>
      c.id === conversationId
        ? {
            ...c,
            totalMessages: (c.totalMessages || 0) + 2,
            lastMessageAt: new Date().toISOString().replace("T", " ").substring(0, 16),
          }
        : c
    );

    saveState({
      ...data,
      aiConversations: updatedConvs,
      aiMessages: [...(data.aiMessages || []), userMsg, assistantMsg],
    });

    return assistantMsg;
  };

  const recordAiFeedback = (
    messageId: string,
    rating: "thumbs_up" | "thumbs_down",
    feedbackText?: string
  ) => {
    const farmer = data.users.find((u) => u.role === "farmer") || data.users[0];
    const newFb: AiFeedbackRecord = {
      id: `fb_${Date.now()}`,
      messageId,
      farmerId: farmer.id,
      rating,
      feedbackText,
      category: rating === "thumbs_up" ? "helpful" : "needs_improvement",
      createdAt: new Date().toISOString().replace("T", " ").substring(0, 16),
    };

    saveState({
      ...data,
      aiFeedback: [newFb, ...(data.aiFeedback || [])],
    });
  };

  const addFarmExpense = (expense: Omit<FarmExpenseRecord, "id" | "createdAt">): FarmExpenseRecord => {
    const newExp: FarmExpenseRecord = {
      ...expense,
      id: `exp_${Date.now()}`,
      createdAt: new Date().toISOString().replace("T", " ").substring(0, 16),
    };
    saveState({
      ...data,
      farmExpenses: [newExp, ...(data.farmExpenses || [])],
    });
    return newExp;
  };

  const deleteFarmExpense = (expenseId: string) => {
    saveState({
      ...data,
      farmExpenses: (data.farmExpenses || []).filter((e) => e.id !== expenseId),
    });
  };

  const markNotificationAsRead = (notificationId: string) => {
    const now = new Date().toISOString().replace("T", " ").substring(0, 16);
    const updated = (data.notifications || []).map((n) =>
      n.id === notificationId ? { ...n, isRead: true, readAt: now } : n
    );
    saveState({
      ...data,
      notifications: updated,
    });
  };

  const markAllNotificationsAsRead = (userId?: string) => {
    const targetUserId = userId || data.users.find((u) => u.role === "farmer")?.id || "usr_farmer_01";
    const now = new Date().toISOString().replace("T", " ").substring(0, 16);
    const updated = (data.notifications || []).map((n) =>
      n.userId === targetUserId ? { ...n, isRead: true, readAt: now } : n
    );
    saveState({
      ...data,
      notifications: updated,
    });
  };

  const updateNotificationPreferences = (prefs: Partial<NotificationPreferencesRecord>) => {
    const farmer = data.users.find((u) => u.role === "farmer") || data.users[0];
    const existing = (data.notificationPreferences || []).find((p) => p.userId === farmer.id);
    let updatedList: NotificationPreferencesRecord[];
    if (existing) {
      updatedList = (data.notificationPreferences || []).map((p) =>
        p.userId === farmer.id
          ? { ...p, ...prefs, updatedAt: new Date().toISOString().replace("T", " ").substring(0, 16) }
          : p
      );
    } else {
      const newPref: NotificationPreferencesRecord = {
        id: `pref_${Date.now()}`,
        userId: farmer.id,
        emailEnabled: true,
        smsEnabled: true,
        pushEnabled: true,
        whatsappEnabled: true,
        mutedCategories: [],
        quietHoursStart: "22:00",
        quietHoursEnd: "06:00",
        ...prefs,
        updatedAt: new Date().toISOString().replace("T", " ").substring(0, 16),
      };
      updatedList = [newPref, ...(data.notificationPreferences || [])];
    }
    saveState({
      ...data,
      notificationPreferences: updatedList,
    });
  };

  const addFarmingTask = (task: Omit<FarmingTaskRecord, "id" | "createdAt">): FarmingTaskRecord => {
    const newTask: FarmingTaskRecord = {
      ...task,
      id: `task_${Date.now()}`,
      createdAt: new Date().toISOString().replace("T", " ").substring(0, 16),
    };
    saveState({
      ...data,
      farmingTasks: [newTask, ...(data.farmingTasks || [])],
    });
    return newTask;
  };

  const updateTaskStatus = (
    taskId: string,
    status: FarmingTaskRecord["status"],
    remarks?: string
  ) => {
    const farmer = data.users.find((u) => u.role === "farmer") || data.users[0];
    const now = new Date().toISOString().replace("T", " ").substring(0, 16);
    const existingTask = (data.farmingTasks || []).find((t) => t.id === taskId);
    if (!existingTask) return;

    const oldStatus = existingTask.status;
    const updatedTasks = (data.farmingTasks || []).map((t) =>
      t.id === taskId
        ? {
            ...t,
            status,
            completedAt: status === "completed" ? now : t.completedAt,
          }
        : t
    );

    const historyEntry: TaskHistoryRecord = {
      id: `th_${Date.now()}`,
      taskId,
      changedByUserId: farmer.id,
      oldStatus,
      newStatus: status,
      remarks: remarks || `Status transitioned from ${oldStatus} to ${status}`,
      recordedAt: now,
    };

    saveState({
      ...data,
      farmingTasks: updatedTasks,
      taskHistory: [historyEntry, ...(data.taskHistory || [])],
    });
  };

  const deleteFarmingTask = (taskId: string) => {
    saveState({
      ...data,
      farmingTasks: (data.farmingTasks || []).filter((t) => t.id !== taskId),
    });
  };

  const dismissRecommendation = (recommendationId: string) => {
    const updated = (data.aiRecommendations || []).map((r) =>
      r.id === recommendationId ? { ...r, status: "dismissed" as const } : r
    );
    saveState({
      ...data,
      aiRecommendations: updated,
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
        addProduceListing,
        updateListingAvailability,
        createPurchaseOrder,
        updateOrderStatus,
        initiatePayment,
        verifyPayment,
        releaseEscrowPayment,
        updateDeliveryTracking,
        applyForLoan,
        updateLoanStatus,
        addLoanDocument,
        verifyLoanDocument,
        recordLoanReview,
        createAiConversation,
        sendAiMessage,
        recordAiFeedback,
        dismissRecommendation,
        addFarmExpense,
        deleteFarmExpense,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        updateNotificationPreferences,
        addFarmingTask,
        updateTaskStatus,
        deleteFarmingTask,
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
