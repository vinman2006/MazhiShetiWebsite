"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { initialSeedData, SeedData } from "@/db/seed-data";

export type RoleType =
  | "farmer"
  | "equipment_provider"
  | "service_provider"
  | "provider" // alias
  | "buyer"
  | "expert"
  | "banker"
  | "admin";

export interface FarmerOnboardingData {
  // Step 1: Personal
  fullName: string;
  phone: string;
  email: string;
  avatarUrl: string;
  preferredLanguage: "mr" | "hi" | "en";
  // Step 2: Location
  state: string;
  district: string;
  taluka: string;
  village: string;
  pinCode: string;
  gpsCoords?: string;
  // Step 3: Farm info
  totalLandAcres: number;
  ownershipType: "owned" | "leased" | "joint_family";
  numberOfFields: number;
  mainCrops: string[];
  irrigationAvailability: "drip" | "sprinkler" | "well" | "canal" | "rainfed";
  // Step 4: Practices
  farmingPractice: "conventional" | "organic" | "transitioning" | "natural_zbnf" | "no_till";
  soilHealthTestingFrequency: string;
  // Meta
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
  // Actions
  triggerSensorSync: () => void;
  addConsultation: (crop: string, title: string, description: string, urgency: "low" | "medium" | "high" | "critical") => void;
  resolveConsultation: (id: string, diagnosis: string, prescription: string) => void;
  addMarketListing: (crop: string, variety: string, grade: string, quantityKg: number, pricePerKg: number, location: string) => void;
  bookEquipment: (equipmentId: string, startDate: string, endDate: string, totalDays: number, location: string) => void;
  applyForFinance: (type: string, schemeName: string, requestedAmount: number, farmArea: number) => void;
  updateFinanceStatus: (id: string, status: "submitted" | "under_scrutiny" | "approved" | "disbursed" | "rejected") => void;
}

const STORAGE_KEY = "mazhi_sheti_state_v2";
const ONBOARDING_KEY = "mazhi_sheti_onboarding_v2";

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
        console.error("Onboarding storage save failed", err);
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

  // 1. Live Soil Sensor Read Action
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

  // 2. Submit Expert Consultation Query
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

  // 3. Agronomist Resolves Consultation
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

  // 4. Farmer / Seller Adds Marketplace Listing
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

  // 5. Farmer Books Machinery Rental
  const bookEquipment = (
    equipmentId: string,
    startDate: string,
    endDate: string,
    totalDays: number,
    location: string
  ) => {
    saveState({ ...data });
  };

  // 6. Farmer Applies for Finance / Insurance
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

  // 7. Banker Updates Application Status
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
        triggerSensorSync,
        addConsultation,
        resolveConsultation,
        addMarketListing,
        bookEquipment,
        applyForFinance,
        updateFinanceStatus,
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
