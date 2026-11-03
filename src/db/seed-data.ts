export interface FarmRecord {
  id: string;
  farmerId: string;
  name: string;
  totalAcres: number;
  surveyNumber: string;
  soilType: string;
  irrigationSource: string;
  waterAvailability: string;
  village: string;
  taluka: string;
  district: string;
  boundaries?: string;
  notes?: string;
}

export interface FarmFieldRecord {
  id: string;
  farmId: string;
  name: string;
  areaAcres: number;
  locationNotes?: string;
  soilType: string;
  irrigationMethod: string;
  currentCrop: string;
  cropVariety: string;
  growthStage: string;
  soilHealthScore: number;
  organicCarbonPct: number;
  farmingHistory: string;
  fieldNotes: string;
}

export interface CropCycleRecord {
  id: string;
  fieldId: string;
  cropName: string;
  variety: string;
  seedBrandOrSource: string;
  sowingDate: string;
  expectedHarvestDate: string;
  growthStage: string;
  estimatedYieldKg: number;
  status: "active" | "harvested" | "cancelled";
}

export interface FarmActivityRecord {
  id: string;
  farmId: string;
  fieldId: string;
  fieldName: string;
  activityType: "sowing" | "irrigation" | "fertilizer" | "soil_testing" | "pest_treatment" | "harvesting";
  title: string;
  description: string;
  quantity?: number;
  unit?: string;
  costIncurred: number;
  performedDate: string;
}

export interface CropObservationRecord {
  id: string;
  fieldId: string;
  cropName: string;
  observationType: "pest_infestation" | "disease_symptom" | "nutrient_deficiency" | "weather_damage";
  pestOrDiseaseName: string;
  severity: "low" | "medium" | "high" | "critical";
  affectedAreaPct: number;
  observedDate: string;
  treatmentTaken: string;
}

export interface HarvestRecordItem {
  id: string;
  fieldId: string;
  cropName: string;
  harvestDate: string;
  yieldKg: number;
  grade: string;
  marketPricePerKg: number;
  notes: string;
}

export interface SeedData {
  users: Array<{
    id: string;
    fullName: string;
    email: string;
    phone: string;
    role: string;
    village: string;
    taluka: string;
    district: string;
    state: string;
    organizationName?: string;
    avatarUrl?: string;
  }>;
  farms: FarmRecord[];
  fields: FarmFieldRecord[];
  plots: Array<{
    id: string;
    farmId: string;
    name: string;
    areaAcres: number;
    currentCrop: string;
    cropVariety: string;
    sowingDate: string;
    expectedHarvestDate: string;
    growthStage: string;
    healthScore: number;
  }>;
  cropCycles: CropCycleRecord[];
  farmActivities: FarmActivityRecord[];
  cropObservations: CropObservationRecord[];
  harvestRecords: HarvestRecordItem[];
  sensors: Array<{
    id: string;
    plotId: string;
    serialNumber: string;
    model: string;
    status: "active" | "standby" | "offline";
    batteryPct: number;
    signalStrengthDbm: number;
    installDepthCm: number;
    lastSync: string;
  }>;
  currentTelemetry: {
    moisturePct: number;
    nitrogenPpm: number;
    phosphorusPpm: number;
    potassiumPpm: number;
    temperatureC: number;
    phLevel: number;
    ecMsCm: number;
    history: Array<{
      time: string;
      moisture: number;
      nitrogen: number;
      temp: number;
      ph: number;
    }>;
  };
  recommendations: Array<{
    id: string;
    title: string;
    category: "Irrigation" | "Fertilizer" | "Soil Health" | "Pest Alert";
    severity: "urgent" | "optimal" | "advisory";
    description: string;
    actionLabel: string;
  }>;
  consultations: Array<{
    id: string;
    farmerId: string;
    farmerName: string;
    cropName: string;
    title: string;
    description: string;
    urgency: "low" | "medium" | "high" | "critical";
    status: "pending" | "diagnosed" | "completed";
    diagnosis?: string;
    prescription?: string;
    createdAt: string;
  }>;
  marketplace: Array<{
    id: string;
    sellerName: string;
    crop: string;
    variety: string;
    grade: string;
    quantityKg: number;
    pricePerKg: number;
    mandiBenchmarkPrice: number;
    location: string;
    harvestDate: string;
    status: "active" | "in_negotiation" | "sold";
    image: string;
  }>;
  equipment: Array<{
    id: string;
    providerName: string;
    title: string;
    category: string;
    hourlyRate: number;
    dailyRate: number;
    location: string;
    includesOperator: boolean;
    isAvailable: boolean;
    specs: string;
  }>;
  financialApplications: Array<{
    id: string;
    applicantName: string;
    farmName: string;
    type: string;
    schemeName: string;
    requestedAmount: number;
    tenureMonths: number;
    interestRatePct: number;
    status: "submitted" | "under_scrutiny" | "approved" | "disbursed" | "rejected";
    appliedDate: string;
  }>;
}

export const initialSeedData: SeedData = {
  users: [
    {
      id: "usr_farmer_01",
      fullName: "Rameshwar Sadashiv Shinde",
      email: "rameshwar.shinde@farmer.in",
      phone: "+91 98223 41092",
      role: "farmer",
      village: "Ashti",
      taluka: "Karanja (Lad)",
      district: "Wardha",
      state: "Maharashtra",
      avatarUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=256",
    },
    {
      id: "usr_expert_01",
      fullName: "Dr. Anjali Deshmukh (Ph.D. Soil Agronomy)",
      email: "anjali.agri@pdkv-consult.org",
      phone: "+91 94231 87654",
      role: "expert",
      organizationName: "Regional Agricultural Research Station & PDKV Extension",
      village: "Borgaon",
      taluka: "Haveli",
      district: "Akola",
      state: "Maharashtra",
      avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256",
    },
    {
      id: "usr_provider_01",
      fullName: "Vilasrao Patil (Kisan Krishi Seva Kendra)",
      email: "vilas.patil@agrifleet.in",
      phone: "+91 98230 77123",
      role: "provider",
      organizationName: "Mahalaxmi Custom Hiring Center & Drone Services",
      village: "Bhadgaon",
      taluka: "Pachora",
      district: "Jalgaon",
      state: "Maharashtra",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256",
    },
    {
      id: "usr_buyer_01",
      fullName: "Rajesh Khandelwal",
      email: "rajesh@khandelwal-agritraders.com",
      phone: "+91 98201 54321",
      role: "buyer",
      organizationName: "Khandelwal Agri Food Exports & APMC Vashi Terminal",
      village: "Turbhe",
      taluka: "Thane",
      district: "Navi Mumbai",
      state: "Maharashtra",
      avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=256",
    },
    {
      id: "usr_banker_01",
      fullName: "Sunita Gokhale",
      email: "s.gokhale@mahagraminbank.gov.in",
      phone: "+91 97654 32109",
      role: "banker",
      organizationName: "Maharashtra Gramin Bank - Agri Credit & PMFBY Cell",
      village: "Civil Lines",
      taluka: "Nagpur Urban",
      district: "Nagpur",
      state: "Maharashtra",
      avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=256",
    },
    {
      id: "usr_admin_01",
      fullName: "Antigravity Platform Lead",
      email: "ops@mazhisheti.in",
      phone: "+91 712 2589000",
      role: "admin",
      organizationName: "Mazhi Sheti Agri-Tech HQ",
      village: "IT Park",
      taluka: "Nagpur",
      district: "Nagpur",
      state: "Maharashtra",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256",
    },
  ],
  farms: [
    {
      id: "farm_01",
      farmerId: "usr_farmer_01",
      name: "Sadashiv Krishi Tirth (Wardha)",
      totalAcres: 12.5,
      surveyNumber: "Gat No. 142/2A",
      soilType: "Deep Black Cotton (Regur)",
      irrigationSource: "Drip Irrigation + Farm Pond (Shet-tale)",
      waterAvailability: "Adequate for 2 Kharif/Rabi cycles",
      village: "Ashti",
      taluka: "Karanja",
      district: "Wardha",
      boundaries: "North: Canal Stream | South: Zilla Parishad Road | East: Gat 143 | West: Gat 141",
      notes: "Certified under Maharashtra Smart Agri mission. Equipped with automated drip filtration and solar pumps.",
    },
  ],
  fields: [
    {
      id: "field_cotton_01",
      farmId: "farm_01",
      name: "Field A - Desi Cotton Hybrid",
      areaAcres: 5.5,
      locationNotes: "North plot near farm pond",
      soilType: "Deep Black Cotton (Regur)",
      irrigationMethod: "Inline Drip Irrigation (1.2 LPH)",
      currentCrop: "Cotton (कापूस)",
      cropVariety: "Ajeet-155 BG-II",
      growthStage: "Boll Development & Maturation",
      soilHealthScore: 92,
      organicCarbonPct: 0.72,
      farmingHistory: "Soybean (Kharif 2025) -> Gram/Harbhara (Rabi 2025) -> Cotton (Kharif 2026)",
      fieldNotes: "Targeting 14 Quintals/Acre. Foliar spray of 13:00:45 scheduled.",
    },
    {
      id: "field_soybean_02",
      farmId: "farm_01",
      name: "Field B - Certified Soybean",
      areaAcres: 4.0,
      locationNotes: "Central flat bed",
      soilType: "Medium Black Regur",
      irrigationMethod: "Micro-Sprinklers + Rainfed",
      currentCrop: "Soybean (सोयाबीन)",
      cropVariety: "KDS-726 Phule Sangam",
      growthStage: "Pod Filling Stage",
      soilHealthScore: 86,
      organicCarbonPct: 0.65,
      farmingHistory: "Cotton (Kharif 2025) -> Wheat (Rabi 2025) -> Soybean (Kharif 2026)",
      fieldNotes: "Treated with Trichoderma and Rhizobium before sowing.",
    },
    {
      id: "field_turmeric_03",
      farmId: "farm_01",
      name: "Field C - Salem Turmeric",
      areaAcres: 3.0,
      locationNotes: "East ridge beds with high organic matter",
      soilType: "Well-Drained Black Loam",
      irrigationMethod: "Raised Bed Drip System",
      currentCrop: "Turmeric (हळद)",
      cropVariety: "Salem High Curcumin",
      growthStage: "Rhizome Expansion",
      soilHealthScore: 94,
      organicCarbonPct: 0.82,
      farmingHistory: "Ginger (2025) -> Turmeric (2026)",
      fieldNotes: "Mulched with sugarcane bagasse and farmyard manure.",
    },
  ],
  plots: [
    {
      id: "plot_cotton_01",
      farmId: "farm_01",
      name: "Plot A - Desi Cotton Hybrid",
      areaAcres: 5.5,
      currentCrop: "Cotton (कापूस)",
      cropVariety: "Ajeet-155 BG-II",
      sowingDate: "2026-06-18",
      expectedHarvestDate: "2026-12-10",
      growthStage: "Boll Development & Maturation",
      healthScore: 92,
    },
    {
      id: "plot_soybean_02",
      farmId: "farm_01",
      name: "Plot B - Certified Soybean",
      areaAcres: 4.0,
      currentCrop: "Soybean (सोयाबीन)",
      cropVariety: "JS-335 / KDS-726 Phule Sangam",
      sowingDate: "2026-06-25",
      expectedHarvestDate: "2026-10-15",
      growthStage: "Pod Filling Stage",
      healthScore: 86,
    },
    {
      id: "plot_turmeric_03",
      farmId: "farm_01",
      name: "Plot C - Salem Turmeric",
      areaAcres: 3.0,
      currentCrop: "Turmeric (हळद)",
      cropVariety: "Salem High Curcumin",
      sowingDate: "2026-05-10",
      expectedHarvestDate: "2027-02-20",
      growthStage: "Rhizome Expansion",
      healthScore: 94,
    },
  ],
  cropCycles: [
    {
      id: "cycle_cotton_01",
      fieldId: "field_cotton_01",
      cropName: "Cotton (कापूस)",
      variety: "Ajeet-155 BG-II",
      seedBrandOrSource: "Ajeet Seeds Certified Lot #8841-MH",
      sowingDate: "2026-06-18",
      expectedHarvestDate: "2026-12-10",
      growthStage: "Boll Development & Maturation",
      estimatedYieldKg: 3800,
      status: "active",
    },
    {
      id: "cycle_soybean_02",
      fieldId: "field_soybean_02",
      cropName: "Soybean (सोयाबीन)",
      variety: "KDS-726 Phule Sangam",
      seedBrandOrSource: "Mahabeej Certified Foundation Seeds",
      sowingDate: "2026-06-25",
      expectedHarvestDate: "2026-10-15",
      growthStage: "Pod Filling Stage",
      estimatedYieldKg: 4200,
      status: "active",
    },
    {
      id: "cycle_turmeric_03",
      fieldId: "field_turmeric_03",
      cropName: "Turmeric (हळद)",
      variety: "Salem High Curcumin (5.2% Curcumin)",
      seedBrandOrSource: "PDKV Agricultural University Mother Rhizomes",
      sowingDate: "2026-05-10",
      expectedHarvestDate: "2027-02-20",
      growthStage: "Rhizome Expansion",
      estimatedYieldKg: 9500,
      status: "active",
    },
  ],
  farmActivities: [
    {
      id: "act_01",
      farmId: "farm_01",
      fieldId: "field_cotton_01",
      fieldName: "Field A - Desi Cotton Hybrid",
      activityType: "fertilizer",
      title: "Potassium Nitrate (13:00:45) Foliar Application",
      description: "Applied 1% solution for boosting boll retention and weight.",
      quantity: 15,
      unit: "kg",
      costIncurred: 1850,
      performedDate: "2026-10-28",
    },
    {
      id: "act_02",
      farmId: "farm_01",
      fieldId: "field_cotton_01",
      fieldName: "Field A - Desi Cotton Hybrid",
      activityType: "irrigation",
      title: "Automated Drip Fertigation Run",
      description: "45-minute root zone irrigation through inline drippers.",
      quantity: 45,
      unit: "minutes",
      costIncurred: 120,
      performedDate: "2026-10-25",
    },
    {
      id: "act_03",
      farmId: "farm_01",
      fieldId: "field_cotton_01",
      fieldName: "Field A - Desi Cotton Hybrid",
      activityType: "pest_treatment",
      title: "Neem Oil Biological Spray (10,000 ppm)",
      description: "Preventive treatment against early sucking pests (Thrips/Jassids).",
      quantity: 2.5,
      unit: "liters",
      costIncurred: 950,
      performedDate: "2026-10-20",
    },
    {
      id: "act_04",
      farmId: "farm_01",
      fieldId: "field_soybean_02",
      fieldName: "Field B - Certified Soybean",
      activityType: "soil_testing",
      title: "Mazhi Sheti IoT Sensor Calibration",
      description: "Measured pH 6.7 and Electrical Conductivity 0.82 mS/cm.",
      quantity: 1,
      unit: "probe",
      costIncurred: 0,
      performedDate: "2026-10-15",
    },
    {
      id: "act_05",
      farmId: "farm_01",
      fieldId: "field_turmeric_03",
      fieldName: "Field C - Salem Turmeric",
      activityType: "sowing",
      title: "Rhizome Treatment & Broad-Bed Sowing",
      description: "Trichoderma viride biological dipping followed by furrow bed planting.",
      quantity: 400,
      unit: "kg rhizomes",
      costIncurred: 18400,
      performedDate: "2026-05-10",
    },
  ],
  cropObservations: [
    {
      id: "obs_01",
      fieldId: "field_cotton_01",
      cropName: "Cotton (कापूस)",
      observationType: "pest_infestation",
      pestOrDiseaseName: "Sucking Jassids (तुडतुडे) & Mild Leaf Curl",
      severity: "medium",
      affectedAreaPct: 8,
      observedDate: "2026-10-27",
      treatmentTaken: "Neem Oil 10,000 ppm spray applied within 24h.",
    },
  ],
  harvestRecords: [
    {
      id: "hr_prev_01",
      fieldId: "field_soybean_02",
      cropName: "Soybean (Kharif 2025)",
      harvestDate: "2025-10-18",
      yieldKg: 3850,
      grade: "Grade A - Clean Golden",
      marketPricePerKg: 46.5,
      notes: "Sold directly through Mazhi Sheti Mandi desk to APMC Vashi exporter.",
    },
  ],
  sensors: [
    {
      id: "sensor_01",
      plotId: "plot_cotton_01",
      serialNumber: "MS-PRO-8841-WRD",
      model: "Mazhi Sheti Soil Sentinel v2.4 Pro",
      status: "active",
      batteryPct: 94,
      signalStrengthDbm: -68,
      installDepthCm: 25,
      lastSync: "Just now (Live IoT)",
    },
  ],
  currentTelemetry: {
    moisturePct: 48.4,
    nitrogenPpm: 72,
    phosphorusPpm: 18,
    potassiumPpm: 210,
    temperatureC: 26.2,
    phLevel: 6.7,
    ecMsCm: 0.82,
    history: [
      { time: "00:00", moisture: 54, nitrogen: 74, temp: 22.1, ph: 6.7 },
      { time: "04:00", moisture: 52, nitrogen: 73, temp: 20.8, ph: 6.7 },
      { time: "08:00", moisture: 50, nitrogen: 73, temp: 24.3, ph: 6.7 },
      { time: "12:00", moisture: 46, nitrogen: 71, temp: 29.5, ph: 6.8 },
      { time: "16:00", moisture: 44, nitrogen: 70, temp: 28.1, ph: 6.7 },
      { time: "20:00", moisture: 48.4, nitrogen: 72, temp: 26.2, ph: 6.7 },
    ],
  },
  recommendations: [
    {
      id: "rec_01",
      title: "Optimal Drip Irrigation Window",
      category: "Irrigation",
      severity: "optimal",
      description:
        "Soil moisture is at 48.4%. Deep root zone water remains sufficient. Postpone heavy drip run until tomorrow 06:30 AM to conserve power and prevent root saturation.",
      actionLabel: "Schedule 45-min Drip Run",
    },
    {
      id: "rec_02",
      title: "Nitrogen Replenishment for Boll Filling",
      category: "Fertilizer",
      severity: "advisory",
      description:
        "Nitrogen levels at 72 ppm. At current cotton boll formation stage, foliar spray of 1% 13:00:45 (Potassium Nitrate) recommended within 3 days for increased boll weight.",
      actionLabel: "View Fertigation Guide",
    },
    {
      id: "rec_03",
      title: "Electrical Conductivity in Ideal Range",
      category: "Soil Health",
      severity: "optimal",
      description:
        "EC is 0.82 mS/cm. Salinity buildup is minimal. Soil microbial activity is flourishing under current moisture levels.",
      actionLabel: "Download Lab Report",
    },
  ],
  consultations: [
    {
      id: "cons_01",
      farmerId: "usr_farmer_01",
      farmerName: "Rameshwar Shinde",
      cropName: "Cotton (कापूस)",
      title: "Yellowing on upper leaves with slight curl",
      description:
        "Observed mild chlorosis on upper leaves after last week's rain. Suspect sucking pests (Thrips or Jassids) or early Magnesium deficiency.",
      urgency: "high",
      status: "diagnosed",
      diagnosis:
        "Field telemetry shows pH 6.7 and normal moisture. Symptoms indicate early Sucking Pest (Jassids) combined with light micro-nutrient tie-up after cloudy spell.",
      prescription:
        "Apply Neem oil (10,000 ppm) @ 2ml/Ltr + Fipronil 5% SC @ 2ml/Ltr. Add chelated Magnesium Sulfate @ 1.5g/Ltr during morning spray.",
      createdAt: "Yesterday at 04:15 PM",
    },
    {
      id: "cons_02",
      farmerId: "usr_farmer_01",
      farmerName: "Rameshwar Shinde",
      cropName: "Turmeric (हळद)",
      title: "Rhizome rot prevention protocol before winter",
      description:
        "Soil is heavy black regur. Seeking preventive biological drenching schedule before November drop in temperature.",
      urgency: "medium",
      status: "pending",
      createdAt: "Today at 07:45 AM",
    },
  ],
  marketplace: [
    {
      id: "prod_01",
      sellerName: "Rameshwar Shinde (Wardha)",
      crop: "Certified Bt-Cotton (कापूस)",
      variety: "Ajeet 155 Long Staple (29.5mm)",
      grade: "Grade A - Clean Handpicked",
      quantityKg: 3500,
      pricePerKg: 78.5,
      mandiBenchmarkPrice: 74.0,
      location: "Ashti, Wardha (Farm Gate)",
      harvestDate: "Dec 2026",
      status: "active",
      image: "https://images.unsplash.com/photo-1594489428504-5c0c480a15fd?auto=format&fit=crop&q=80&w=600",
    },
    {
      id: "prod_02",
      sellerName: "Sachin Patil (Jalgaon)",
      crop: "Grand Naine Bananas (केळी)",
      variety: "G9 Tissue Culture",
      grade: "Export Ready - Class 1",
      quantityKg: 12000,
      pricePerKg: 21.0,
      mandiBenchmarkPrice: 18.5,
      location: "Raver, Jalgaon Mandi",
      harvestDate: "Ready for Harvest",
      status: "active",
      image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&q=80&w=600",
    },
    {
      id: "prod_03",
      sellerName: "Savita More (Nashik)",
      crop: "Red Onion (लाल कांदा)",
      variety: "Panchganga Garwa Red",
      grade: "Grade A - Medium Bulb",
      quantityKg: 8500,
      pricePerKg: 28.0,
      mandiBenchmarkPrice: 25.5,
      location: "Lasalgaon Mandi Yard",
      harvestDate: "Dried & Cured",
      status: "active",
      image: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&q=80&w=600",
    },
    {
      id: "prod_04",
      sellerName: "Vitthalrao Kadam (Nagpur)",
      crop: "Nagpur Mandarin Orange (संत्री)",
      variety: "Mridia Bahar GI Tagged",
      grade: "Sweet Grade 1",
      quantityKg: 5000,
      pricePerKg: 65.0,
      mandiBenchmarkPrice: 58.0,
      location: "Katol, Nagpur",
      harvestDate: "In 2 Weeks",
      status: "active",
      image: "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&q=80&w=600",
    },
  ],
  equipment: [
    {
      id: "equip_01",
      providerName: "Mahalaxmi Custom Hiring Center",
      title: "Mahindra 575 DI 45HP Tractor + Multi-Speed Rotavator",
      category: "Tractor",
      hourlyRate: 850,
      dailyRate: 6500,
      location: "Wardha & Karanja Hub (15km radius)",
      includesOperator: true,
      isAvailable: true,
      specs: "Heavy-duty 4-cylinder m-Drop engine with fuel-saving hydraulics & trained driver.",
    },
    {
      id: "equip_02",
      providerName: "Kisan Drones Maharashtra",
      title: "DJI Agras T40 Ultra-Precision Agricultural Drone Sprayer",
      category: "Drone Sprayer",
      hourlyRate: 1400,
      dailyRate: 9800,
      location: "Available across Vidarbha & Marathwada",
      includesOperator: true,
      isAvailable: true,
      specs: "40kg payload, centrifugal dual atomizing nozzles, covers 40 acres in 4 hours with centimeter RTK accuracy.",
    },
    {
      id: "equip_03",
      providerName: "Shree Ganesh Agri Mechanics",
      title: "Laser Land Leveler + 75HP 4WD Pulling Unit",
      category: "Laser Leveler",
      hourlyRate: 1100,
      dailyRate: 8500,
      location: "Nagpur, Wardha, Amravati",
      includesOperator: true,
      isAvailable: true,
      specs: "Saves 35% irrigation water by ensuring exact 0-degree ground slope across flat beds.",
    },
  ],
  financialApplications: [
    {
      id: "app_kcc_01",
      applicantName: "Rameshwar Sadashiv Shinde",
      farmName: "Sadashiv Krishi Tirth (12.5 Acres)",
      type: "Kisan Credit Card (KCC)",
      schemeName: "State Bank / Gramin Agri Credit with 3% Prompt Repayment Subvention",
      requestedAmount: 350000,
      tenureMonths: 12,
      interestRatePct: 4.0,
      status: "approved",
      appliedDate: "2026-09-12",
    },
    {
      id: "app_solar_02",
      applicantName: "Rameshwar Sadashiv Shinde",
      farmName: "Sadashiv Krishi Tirth (Gat 142)",
      type: "Solar Agriculture Pump (PM-KUSUM)",
      schemeName: "MahaVitaran 7.5 HP DC Submersible Solar Pump (90% Govt Subsidy)",
      requestedAmount: 265000,
      tenureMonths: 24,
      interestRatePct: 2.5,
      status: "under_scrutiny",
      appliedDate: "2026-10-04",
    },
    {
      id: "app_pmfby_03",
      applicantName: "Rameshwar Sadashiv Shinde",
      farmName: "Cotton Plot A & Soybean Plot B",
      type: "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
      schemeName: "Comprehensive Weather & Pest Inundation Crop Insurance",
      requestedAmount: 120000,
      tenureMonths: 6,
      interestRatePct: 1.5,
      status: "disbursed",
      appliedDate: "2026-06-20",
    },
  ],
};
