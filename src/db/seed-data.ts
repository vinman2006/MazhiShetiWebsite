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

// =========================================================================
// PHASE 4 INTERFACES: SOIL HEALTH, SMART DEVICES, IRRIGATION & COMMANDS
// =========================================================================

export interface SoilTestRecord {
  id: string;
  farmerId: string;
  farmId: string;
  fieldId: string;
  fieldName: string;
  testDate: string;
  laboratoryName: string;
  sampleCode: string;
  reportDocumentUrl?: string;
  documentName?: string;
  soilTexture: string;
  overallHealthScore: number; // 0 - 100
  phLevel: number;
  electricalConductivity: number; // dS/m
  organicCarbonPct: number; // %
  nitrogenKgHa: number; // kg/ha
  phosphorusKgHa: number; // kg/ha
  potassiumKgHa: number; // kg/ha
  sulfurPpm: number;
  zincPpm: number;
  ironPpm: number;
  recommendations: string;
  status: "verified" | "pending_verification" | "draft";
  testedByTechnician: string;
}

export interface SoilMeasurementRecord {
  id: string;
  soilTestId?: string;
  fieldId: string;
  fieldName: string;
  parameterName: string;
  measuredValue: number;
  unit: string;
  measurementMethod: "laboratory" | "sensor" | "estimated";
  optimalMin: number;
  optimalMax: number;
  rating: "deficient" | "optimal" | "excess" | "critical";
  correctiveAction: string;
  recordedAt: string;
}

export interface AgriculturalDeviceRecord {
  id: string;
  farmerId: string;
  deviceType:
    | "soil_moisture_sensor"
    | "temperature_sensor"
    | "fertility_monitor"
    | "irrigation_controller"
    | "automatic_sprinkler";
  deviceName: string;
  serialNumber: string;
  manufacturer: string;
  modelNumber: string;
  firmwareVersion: string;
  hardwareMacOrEui: string;
  status: "online" | "offline" | "low_battery" | "maintenance";
  batteryPct: number;
  signalStrengthDbm: number;
  lastHeartbeatAt: string;
  assignedFieldId?: string;
  assignedFieldName?: string;
  installDepthCm?: number;
  isEnrolled: boolean;
}

export interface SensorReadingRecord {
  id: string;
  deviceId: string;
  deviceName: string;
  fieldId: string;
  fieldName: string;
  readingType: string;
  moisturePct?: number;
  temperatureC?: number;
  phLevel?: number;
  ecMsCm?: number;
  nitrogenPpm?: number;
  phosphorusPpm?: number;
  potassiumPpm?: number;
  flowRateLpm?: number;
  batteryVoltage?: number;
  timestamp: string;
}

export interface IrrigationScheduleRecord {
  id: string;
  farmId: string;
  fieldId: string;
  fieldName: string;
  deviceId?: string;
  deviceName?: string;
  scheduleName: string;
  startTime: string;
  durationMinutes: number;
  waterTargetLiters: number;
  recurrence: "daily" | "alternate_days" | "weekly" | "smart_moisture_trigger";
  isActive: boolean;
  automationEnabled: boolean;
  soilMoistureThresholdPct: number;
  nextRunAt: string;
}

export interface IrrigationEventRecord {
  id: string;
  farmId: string;
  fieldId: string;
  fieldName: string;
  deviceId?: string;
  deviceName?: string;
  scheduleId?: string;
  triggerType: "manual" | "scheduled" | "smart_sensor_threshold";
  startTime: string;
  endTime?: string;
  durationMinutes: number;
  waterVolumeLiters: number;
  waterSource: "borewell" | "well" | "canal" | "farm_pond";
  status: "completed" | "in_progress" | "interrupted" | "failed";
  energyUnitsKwh: number;
  notes?: string;
}

export interface DeviceCommandRecord {
  id: string;
  deviceId: string;
  deviceName: string;
  commandType:
    | "START_IRRIGATION"
    | "STOP_IRRIGATION"
    | "SET_FLOW_RATE"
    | "CALIBRATE_SENSOR"
    | "EMERGENCY_SHUTOFF";
  parameters: Record<string, any>;
  status: "PENDING" | "DISPATCHED" | "ACKNOWLEDGED" | "EXECUTED" | "FAILED";
  requestedByUserId: string;
  dispatchedAt: string;
  acknowledgedAt?: string;
  executedAt?: string;
  failureReason?: string;
  deviceAckPayload?: string;
}

// =========================================================================
// PHASE 5 INTERFACES: ORGANIC TRANSITION, NO-TILL & SUSTAINABLE AGRI
// =========================================================================

export interface OrganicProgramRecord {
  id: string;
  name: string;
  marathiName: string;
  certifyingBody: string;
  conversionPeriodMonths: number;
  standardGuidelines: string;
  description: string;
}

export interface OrganicTransitionRecord {
  id: string;
  farmerId: string;
  farmId: string;
  fieldId: string;
  fieldName: string;
  programId: string;
  programName: string;
  registrationDate: string;
  targetCertificationDate: string;
  currentStage:
    | "initial_assessment"
    | "soil_assessment"
    | "transition_planning"
    | "input_adoption"
    | "soil_improvement"
    | "crop_monitoring"
    | "documentation"
    | "certification_prep";
  conversionStatus:
    | "in_conversion_c1"
    | "in_conversion_c2"
    | "in_conversion_c3"
    | "under_audit"
    | "certified_verified";
  progressPct: number;
  inspectorAgency: string;
  auditNotes: string;
  baselineChemicalNpkKg: number;
  currentChemicalNpkKg: number;
  isCertified: boolean;
  lastAuditDate?: string;
  nextAuditDate?: string;
}

export interface FarmingPracticeRecord {
  id: string;
  fieldId: string;
  fieldName: string;
  transitionRecordId?: string;
  seasonYear: string;
  practiceType:
    | "synthetic_conventional"
    | "integrated_ipm"
    | "transitioning_organic"
    | "certified_organic"
    | "natural_zbnf";
  chemicalFertilizerUsedKg: number;
  chemicalPesticidesUsedLiters: number;
  bioInputsAdopted: string;
  soilConservationMethods: string;
  notes: string;
  recordedDate: string;
}

export interface OrganicInputRecord {
  id: string;
  name: string;
  marathiName: string;
  category:
    | "compost"
    | "vermicompost"
    | "biofertilizer"
    | "organic_manure"
    | "botanical_pest_control"
    | "green_manure"
    | "cover_crop";
  preparationMethod: string;
  composition: string;
  primaryNutrientsOrTarget: string;
  applicationGuidelines: string;
  isFarmPrepared: boolean;
  standardDosagePerAcre: string;
  certificationComplianceStatus: string;
}

export interface InputApplicationRecord {
  id: string;
  fieldId: string;
  fieldName: string;
  transitionRecordId?: string;
  organicInputId?: string;
  inputName: string;
  category: string;
  quantity: number;
  unit: string;
  applicationMethod:
    | "broadcasting"
    | "drip_fertigation"
    | "foliar_spray"
    | "soil_drenching"
    | "seed_treatment";
  appliedDate: string;
  costIncurred: number;
  batchLotNumber?: string;
  notes?: string;
}

export interface NoTillRecord {
  id: string;
  fieldId: string;
  fieldName: string;
  seasonYear: string;
  suitabilityScore: number;
  residueType: string;
  residueCoveragePct: number;
  coverCropPlanted: string;
  soilDisturbanceDepthCm: number;
  moistureRetentionScore: number;
  weedSuppressionMethod: string;
  notes: string;
  recordedDate: string;
}

export interface AgriculturalResourceRecord {
  id: string;
  title: string;
  marathiTitle?: string;
  marathiName?: string;
  category:
    | "organic_farming"
    | "soil_management"
    | "crop_planning"
    | "water_conservation"
    | "pest_management"
    | "no_till_farming"
    | "sustainable_agriculture";
  summary: string;
  readTimeMinutes: number;
  author: string;
  pdfGuideUrl?: string;
  contentHtmlOrMarkdown?: string;
  featured: boolean;
}

// =========================================================================
// PHASE 6 INTERFACES: EQUIPMENT RENTAL AND AGRICULTURAL SERVICES
// =========================================================================

export interface EquipmentListingItem {
  id: string;
  providerId: string;
  providerName: string;
  providerPhone: string;
  title: string;
  category:
    | "Tractors"
    | "Rotavators"
    | "Cultivators"
    | "Seed drills"
    | "Harvesters"
    | "Sprayers"
    | "Irrigation equipment"
    | "Other farming machinery";
  description: string;
  manufacturer: string;
  modelNumber?: string;
  horsepowerOrCapacity?: string;
  hourlyRate: number;
  dailyRate: number;
  location: string;
  locationDistrict: string;
  locationTaluka: string;
  includesOperator: boolean;
  operatingConditions: string;
  minimumRentalDuration: string;
  isAvailable: boolean;
  imageUrl: string;
  specs: string;
  rating: number;
  status: "active" | "in_use" | "maintenance";
}

export interface RentalBookingRecord {
  id: string;
  equipmentId: string;
  equipmentName: string;
  equipmentCategory: string;
  providerId: string;
  providerName: string;
  farmerId: string;
  farmerName: string;
  farmerPhone: string;
  startDate: string;
  endDate: string;
  duration: number;
  durationUnit: "hours" | "days";
  rateType: "hourly" | "daily";
  rateAmount: number;
  totalAmount: number;
  status: "requested" | "confirmed" | "dispatched" | "completed" | "cancelled" | "rejected";
  farmLocation: string;
  operatorIncluded: boolean;
  notes?: string;
  createdAt: string;
}

export interface AgriculturalServiceRecord {
  id: string;
  providerId: string;
  providerName: string;
  serviceName: string;
  category:
    | "soil_testing"
    | "farm_consultation"
    | "irrigation_installation"
    | "machinery_operators"
    | "organic_farming_consultation";
  description: string;
  priceAmount: number;
  pricingModel: "per_acre" | "per_sample" | "per_day" | "per_visit";
  serviceLocations: string;
  certifiedBadge: string;
  rating: number;
  isAvailable: boolean;
  imageUrl?: string;
}

export interface ServiceBookingRecord {
  id: string;
  serviceId: string;
  serviceName: string;
  category: string;
  providerId: string;
  providerName: string;
  farmerId: string;
  farmerName: string;
  farmerPhone: string;
  scheduledDate: string;
  farmLocation: string;
  areaAcresOrSamples: number;
  totalAmount: number;
  status: "requested" | "confirmed" | "in_progress" | "completed" | "cancelled";
  notes?: string;
  createdAt: string;
}

// =========================================================================
// PHASE 7 INTERFACES: PRODUCE MARKETPLACE, BUYER PROCUREMENT & ESCROW
// =========================================================================

export interface ProduceListingRecord {
  id: string;
  sellerId: string;
  farmerName: string;
  farmerPhone: string;
  cropName: string;
  variety: string;
  category:
    | "grains"
    | "pulses"
    | "oilseeds"
    | "vegetables"
    | "fruits"
    | "spices"
    | "cotton_fiber"
    | "organic";
  quantity: number;
  unit: "Quintals" | "Kg" | "Tons" | "Crates" | "Bags";
  pricePerUnit: number; // Farmer asking price
  mandiBenchmarkPrice?: number; // Government APMC benchmark MSP
  minimumOrderQuantity: number;
  qualityGrade:
    | "Grade A+ (Premium Export)"
    | "Grade A (Export Ready)"
    | "Grade A (Commercial)"
    | "Grade B (Standard)"
    | "Organic Certified";
  harvestDate: string;
  storageCondition: string;
  description: string;
  locationDistrict: string;
  locationTaluka: string;
  locationVillage: string;
  farmGateAddress: string;
  primaryImageUrl: string;
  isOrganicCertified: boolean;
  availabilityStatus: "available" | "under_negotiation" | "sold_out" | "in_harvest";
  viewsCount?: number;
  createdAt: string;
}

export interface PurchaseOrderRecord {
  id: string;
  listingId: string;
  farmerId: string;
  farmerName: string;
  farmerPhone: string;
  buyerId: string;
  buyerName: string;
  buyerPhone: string;
  cropName: string;
  variety: string;
  orderQuantity: number;
  unit: string;
  unitPrice: number;
  totalAmount: number;
  orderStatus:
    | "requested"
    | "confirmed"
    | "processing"
    | "dispatched"
    | "in_transit"
    | "delivered"
    | "completed"
    | "cancelled"
    | "rejected";
  paymentStatus:
    | "pending"
    | "escrow_locked"
    | "released_to_farmer"
    | "refunded"
    | "failed";
  escrowTransactionId?: string;
  deliveryMethod:
    | "farm_gate_pickup"
    | "buyer_logistics"
    | "fpo_consolidated"
    | "express_cold_chain";
  deliveryAddress: string;
  scheduledDeliveryDate: string;
  specialInstructions?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentTransactionRecord {
  id: string;
  orderId: string;
  buyerId: string;
  farmerId: string;
  amount: number;
  currency: string;
  paymentGateway: "razorpay_escrow" | "direct_upi_neft" | "apmc_mandi_settlement";
  gatewayPaymentId?: string;
  gatewaySignature?: string;
  status:
    | "initiated"
    | "escrow_authorized"
    | "verified"
    | "disbursed_to_farmer"
    | "refund_processed"
    | "failed";
  verificationMethod: string;
  refundReference?: string;
  createdAt: string;
}

export interface DeliveryRecordItem {
  id: string;
  orderId: string;
  transporterName: string;
  vehicleNumber: string;
  driverName: string;
  driverPhone: string;
  trackingNumberOrEwb?: string;
  pickupDate: string;
  estimatedArrival: string;
  actualDeliveryDate?: string;
  dispatchGatePass?: string;
  deliveryProofUrl?: string;
  status:
    | "scheduled"
    | "loaded_at_farm"
    | "in_transit"
    | "arrived_at_destination"
    | "quality_inspected"
    | "accepted"
    | "rejected";
  createdAt: string;
}

export interface BuyerProfileRecord {
  id: string;
  userId: string;
  companyOrTraderName: string;
  buyerType:
    | "wholesaler"
    | "food_processor"
    | "retail_chain"
    | "exporter"
    | "fpo_buyer"
    | "individual_trader";
  apmcLicenseNumber: string;
  gstinNumber: string;
  contactPhone: string;
  deliveryWarehouseAddress: string;
  isVerifiedTrader: boolean;
  trustScore: number;
  procurementCapacityTons: number;
}

// =========================================================================
// PHASE 8 INTERFACES: FINANCIAL SERVICES, LOAN UNDERWRITING & BANKING
// =========================================================================

export interface FinancialInstitutionRecord {
  id: string;
  name: string;
  institutionType: "public_sector_bank" | "regional_rural_bank" | "cooperative_bank" | "nbfc_mfi";
  rbiRegistrationCode: string;
  headquartersAddress: string;
  nodalOfficerName: string;
  contactPhone: string;
  contactEmail: string;
  isActive: boolean;
}

export interface FinancialProductRecord {
  id: string;
  institutionId: string;
  institutionName: string;
  productName: string;
  category: "crop_loan" | "equipment_loan" | "irrigation_loan" | "infrastructure_loan" | "warehouse_receipt_loan";
  interestRatePct: number;
  subventionPct: number;
  effectiveInterestRatePct: number; // e.g. 4% for KCC after subvention
  minAmount: number;
  maxAmount: number;
  maxTenureMonths: number;
  eligibilityCriteria: string;
  requiredDocuments: string[];
  processingFeePct: number;
  isGovtSponsored: boolean;
  description: string;
}

export interface LoanDocumentItem {
  id: string;
  documentType:
    | "7_12_extract"
    | "8a_holding_certificate"
    | "aadhaar_card"
    | "pan_card"
    | "bank_passbook"
    | "soil_health_card"
    | "machinery_quotation"
    | "crop_sowing_declaration";
  documentName: string;
  fileUrl: string;
  verificationStatus: "uploaded" | "verified_authentic" | "rejected_unclear" | "resubmission_needed";
  verifiedAt?: string;
  verifiedByOfficer?: string;
  notes?: string;
}

export interface LoanApplicationRecord {
  id: string;
  farmerId: string;
  farmerName: string;
  farmerPhone: string;
  productId: string;
  productName: string;
  institutionId: string;
  institutionName: string;
  category: string;
  requestedAmount: number;
  sanctionedAmount?: number;
  tenureMonths: number;
  interestRatePct: number;
  farmAreaAcres: number;
  cropCycleOrPurpose: string;
  status:
    | "submitted"
    | "under_scrutiny"
    | "documents_verified"
    | "field_inspection_scheduled"
    | "credit_approved"
    | "disbursed"
    | "rejected"
    | "additional_info_requested";
  bankNotes?: string;
  rejectionReason?: string;
  sanctionLetterUrl?: string;
  documents: LoanDocumentItem[];
  appliedDate: string;
  updatedAt: string;
}

export interface LoanReviewRecord {
  id: string;
  applicationId: string;
  reviewerId: string;
  reviewerName: string;
  cibilOrCreditScore: number;
  landValuationRupees: number;
  cropRiskAssessment: "low_risk_irrigated" | "moderate_risk_rainfed" | "high_risk_drought_prone";
  fieldVisitCompleted: boolean;
  internalAppraisalNotes: string;
  recommendation: "recommend_approval" | "recommend_rejection" | "seek_collateral_guarantee";
  decisionDate: string;
}

export interface UserConsentRecord {
  id: string;
  userId: string;
  applicationId?: string;
  consentType: "cibil_credit_bureau_check" | "land_record_mahabhulekh_verification" | "aadhaar_ekyc_agreement";
  consentText: string;
  isGranted: boolean;
  ipAddress: string;
  grantedAt: string;
}

// =========================================================================
// PHASE 9 INTERFACES: AI FARMING ASSISTANT, CONVERSATIONS & RECOMMENDATIONS
// =========================================================================

export interface AiConversationRecord {
  id: string;
  farmerId: string;
  title: string;
  language: "mr" | "hi" | "en";
  contextSnapshot?: string;
  totalMessages: number;
  lastMessageAt: string;
  createdAt: string;
}

export interface AiMessageRecord {
  id: string;
  conversationId: string;
  sender: "user" | "assistant";
  content: string;
  language: "mr" | "hi" | "en";
  attachedImageUrl?: string;
  imageAnalysisResult?: {
    symptomsIdentified: string[];
    probableCause: string;
    confidencePct: number;
    recommendedRemedy: string;
    requiresExpertVerification: boolean;
  };
  citedFieldId?: string;
  citedSoilTestId?: string;
  suggestedActions?: Array<{ label: string; actionRoute?: string; queryText?: string }>;
  createdAt: string;
}

export interface AiRecommendationRecord {
  id: string;
  farmerId: string;
  conversationId?: string;
  recommendationType:
    | "crop_selection"
    | "soil_health"
    | "fertilizer_management"
    | "organic_transition"
    | "irrigation_scheduling"
    | "pest_disease_alert"
    | "no_till_practice";
  title: string;
  titleMarathi: string;
  description: string;
  descriptionMarathi: string;
  urgency: "info" | "advisory" | "urgent";
  status: "active" | "applied" | "dismissed";
  actionRoute?: string;
  createdAt: string;
}

export interface AiFeedbackRecord {
  id: string;
  messageId: string;
  farmerId: string;
  rating: "thumbs_up" | "thumbs_down";
  feedbackText?: string;
  category?: string;
  createdAt: string;
}


// =========================================================================
// PHASE 10: ANALYTICS, EXPENSE TRACKING, NOTIFICATIONS & TASK MANAGEMENT
// =========================================================================

export interface ExpenseCategoryRecord {
  id: string;
  code: "seeds" | "fertilizers" | "labour" | "equipment_rental" | "irrigation" | "transportation" | "pest_control" | "other";
  name: string;
  nameMarathi: string;
  icon: string;
  description?: string;
}

export interface FarmExpenseRecord {
  id: string;
  farmerId: string;
  farmId?: string;
  fieldId?: string;
  cropCycleId?: string;
  cropName: string;
  categoryCode: "seeds" | "fertilizers" | "labour" | "equipment_rental" | "irrigation" | "transportation" | "pest_control" | "other";
  expenseDate: string;
  amount: number;
  quantity?: number;
  unit?: string;
  unitCost?: number;
  vendorName?: string;
  receiptDocUrl?: string;
  paymentMode: "cash" | "upi" | "bank_transfer" | "kcc_loan";
  notes?: string;
  createdAt: string;
}

export interface NotificationRecord {
  id: string;
  userId: string;
  category: "booking_update" | "marketplace_order" | "loan_update" | "irrigation_reminder" | "farming_activity" | "soil_alert" | "ai_recommendation" | "announcement";
  title: string;
  titleMarathi: string;
  message: string;
  messageMarathi: string;
  priority: "low" | "normal" | "high" | "urgent";
  isRead: boolean;
  readAt?: string;
  actionUrl?: string;
  actionLabel?: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

export interface NotificationPreferencesRecord {
  id: string;
  userId: string;
  emailEnabled: boolean;
  smsEnabled: boolean;
  pushEnabled: boolean;
  whatsappEnabled: boolean;
  mutedCategories: string[];
  quietHoursStart: string;
  quietHoursEnd: string;
  updatedAt: string;
}

export interface FarmingTaskRecord {
  id: string;
  farmerId: string;
  farmId?: string;
  fieldId?: string;
  cropName?: string;
  title: string;
  titleMarathi: string;
  description?: string;
  taskCategory: "sowing" | "weeding" | "spraying" | "irrigation" | "fertilizer" | "harvesting" | "soil_testing" | "maintenance";
  priority: "low" | "medium" | "high" | "urgent";
  status: "pending" | "in_progress" | "completed" | "deferred" | "cancelled";
  dueDate: string;
  completedAt?: string;
  estimatedLaborDays?: number;
  estimatedCost?: number;
  notes?: string;
  createdAt: string;
}

export interface TaskHistoryRecord {
  id: string;
  taskId: string;
  changedByUserId: string;
  oldStatus: string;
  newStatus: string;
  remarks?: string;
  recordedAt: string;
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
  equipment: EquipmentListingItem[];
  rentalBookings: RentalBookingRecord[];
  agriculturalServices: AgriculturalServiceRecord[];
  serviceBookings: ServiceBookingRecord[];
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
  // Phase 4: Soil Health, Devices, Irrigation & Commands
  soilTests: SoilTestRecord[];
  soilMeasurements: SoilMeasurementRecord[];
  devices: AgriculturalDeviceRecord[];
  sensorReadings: SensorReadingRecord[];
  irrigationSchedules: IrrigationScheduleRecord[];
  irrigationEvents: IrrigationEventRecord[];
  deviceCommands: DeviceCommandRecord[];
  // Phase 5: Organic Programs, Transition, Practices, Inputs, No-Till, Resources
  organicPrograms: OrganicProgramRecord[];
  organicTransitions: OrganicTransitionRecord[];
  farmingPractices: FarmingPracticeRecord[];
  organicInputs: OrganicInputRecord[];
  inputApplications: InputApplicationRecord[];
  noTillRecords: NoTillRecord[];
  agriculturalResources: AgriculturalResourceRecord[];
  // Phase 7: Produce Marketplace & Buyer Procurement
  produceListings: ProduceListingRecord[];
  purchaseOrders: PurchaseOrderRecord[];
  buyerProfiles: BuyerProfileRecord[];
  paymentTransactions: PaymentTransactionRecord[];
  deliveryRecords: DeliveryRecordItem[];
  // Phase 8: Financial Institutions, Products, Applications, Reviews & Consents
  financialInstitutions: FinancialInstitutionRecord[];
  financialProducts: FinancialProductRecord[];
  loanApplications: LoanApplicationRecord[];
  loanReviews: LoanReviewRecord[];
  userConsents: UserConsentRecord[];
  // Phase 9: AI Farming Assistant, Conversations, Recommendations & Feedback
  aiConversations: AiConversationRecord[];
  aiMessages: AiMessageRecord[];
  aiRecommendations: AiRecommendationRecord[];
  aiFeedback: AiFeedbackRecord[];
  // Phase 10: Farm Analytics, Expenses, Notifications & Task Management
  expenseCategories: ExpenseCategoryRecord[];
  farmExpenses: FarmExpenseRecord[];
  notifications: NotificationRecord[];
  notificationPreferences: NotificationPreferencesRecord[];
  farmingTasks: FarmingTaskRecord[];
  taskHistory: TaskHistoryRecord[];
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
      providerId: "usr_provider_01",
      providerName: "Mahalaxmi Custom Hiring Center",
      providerPhone: "+91 98230 77123",
      title: "Mahindra 575 DI Sarpanch 45HP Tractor",
      category: "Tractors",
      description: "Fuel-efficient 4-cylinder m-Drop engine equipped with high-torque hydraulics, dual-clutch, and power steering. Ideal for deep plowing, rotavator operations, and heavy haulage.",
      manufacturer: "Mahindra Tractors",
      modelNumber: "575 DI Sarpanch",
      horsepowerOrCapacity: "45 HP",
      hourlyRate: 850,
      dailyRate: 6500,
      location: "Wardha & Karanja Hub (25km service radius)",
      locationDistrict: "Wardha",
      locationTaluka: "Karanja (Lad)",
      includesOperator: true,
      operatingConditions: "Includes certified machinery driver. Diesel included for the first 4 operating hours. Farmer provides field boundaries and guidance.",
      minimumRentalDuration: "2 Hours",
      isAvailable: true,
      imageUrl: "https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?auto=format&fit=crop&q=80&w=600",
      specs: "45 HP Engine • 1600 kg Lift Capacity • Dual PTO 540 RPM • Trained Operator Included",
      rating: 4.9,
      status: "active",
    },
    {
      id: "equip_02",
      providerId: "usr_provider_01",
      providerName: "Mahalaxmi Custom Hiring Center",
      providerPhone: "+91 98230 77123",
      title: "Shaktiman Semi-Champion 7-Feet Multi-Speed Rotavator",
      category: "Rotavators",
      description: "High-performance secondary tillage rotavator with boron steel L-blades. Breaks clods, pulverizes hard vertisols into a fine seedbed in a single pass.",
      manufacturer: "Shaktiman Agro",
      modelNumber: "Semi-Champion 210",
      horsepowerOrCapacity: "7 Feet Width (48 Blades)",
      hourlyRate: 450,
      dailyRate: 3200,
      location: "Wardha, Ashti, Arvi",
      locationDistrict: "Wardha",
      locationTaluka: "Ashti",
      includesOperator: true,
      operatingConditions: "Requires minimum 45HP tractor PTO linkage. Suitable for dry or moist black cotton soil.",
      minimumRentalDuration: "2 Hours",
      isAvailable: true,
      imageUrl: "https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&q=80&w=600",
      specs: "48 L-Type Boron Steel Blades • Multi-Speed Gearbox • Depth Skid Shoes • Operator Attached",
      rating: 4.8,
      status: "active",
    },
    {
      id: "equip_03",
      providerId: "usr_provider_01",
      providerName: "Kisan Krishi Seva Fleet",
      providerPhone: "+91 98230 77123",
      title: "Heavy-Duty 9-Tyne Spring Loaded Tiller Cultivator",
      category: "Cultivators",
      description: "Robust spring-loaded tiller designed to break deep hard-pan layers and uproot persistent weeds without damaging soil structure. Shovel points are reversible.",
      manufacturer: "Fieldking Agro",
      modelNumber: "FK-9T-HD",
      horsepowerOrCapacity: "9 Tynes Spring Loaded",
      hourlyRate: 350,
      dailyRate: 2400,
      location: "Nagpur, Wardha, Katol",
      locationDistrict: "Nagpur",
      locationTaluka: "Katol",
      includesOperator: true,
      operatingConditions: "Pre-irrigation or post-harvest dry soil recommended.",
      minimumRentalDuration: "2 Hours",
      isAvailable: true,
      imageUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=600",
      specs: "9 Tynes with High Tensile Springs • 65mm Channel Frame • Reversible Shovels",
      rating: 4.7,
      status: "active",
    },
    {
      id: "equip_04",
      providerId: "usr_provider_01",
      providerName: "Vidarbha Conservation Machinery",
      providerPhone: "+91 98230 77123",
      title: "Zero-Till Multi-Crop Happy Seeder & Fertilizer Drill",
      category: "Seed drills",
      description: "Direct-drill zero-tillage sowing machine that chops standing stubble and places seeds and fertilizer directly into undisturbed soil. Eliminates residue burning.",
      manufacturer: "National Agro Industries",
      modelNumber: "HappySeeder-9R",
      horsepowerOrCapacity: "9 Rows Multi-Crop",
      hourlyRate: 650,
      dailyRate: 4800,
      location: "Wardha, Karanja, Hinganghat",
      locationDistrict: "Wardha",
      locationTaluka: "Karanja (Lad)",
      includesOperator: true,
      operatingConditions: "Includes calibrated seed metering disc for soybean, wheat, and chickpea. Operator sets sowing depth.",
      minimumRentalDuration: "3 Hours",
      isAvailable: true,
      imageUrl: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&q=80&w=600",
      specs: "Zero-Tillage Flail Blades • Dual Seed & Fertilizer Box • Calibrated Depth Wheels",
      rating: 4.9,
      status: "active",
    },
    {
      id: "equip_05",
      providerId: "usr_provider_01",
      providerName: "Mahalaxmi Combine Harvesters",
      providerPhone: "+91 98230 77123",
      title: "CLAAS Crop Tiger 30 Rubber Track Combine Harvester",
      category: "Harvesters",
      description: "Heavy-duty multi-crop combine harvester equipped with rubber crawler tracks for wet and muddy soil conditions. High-efficiency threshing and cleaning system for soybean, wheat, and rice.",
      manufacturer: "CLAAS India",
      modelNumber: "Crop Tiger 30 Terra Trac",
      horsepowerOrCapacity: "60 HP Turbocharged",
      hourlyRate: 2200,
      dailyRate: 16500,
      location: "Available across Vidarbha & Marathwada",
      locationDistrict: "Wardha",
      locationTaluka: "Wardha",
      includesOperator: true,
      operatingConditions: "Includes 2 experienced combine operators and grain unloader. Grain bagger provided. Minimum 4-hour booking.",
      minimumRentalDuration: "4 Hours",
      isAvailable: true,
      imageUrl: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=600",
      specs: "Rubber Track Crawlers • Tangential Threshing Drum • 1200L Grain Tank • 2 Operators Included",
      rating: 5.0,
      status: "active",
    },
    {
      id: "equip_06",
      providerId: "usr_provider_01",
      providerName: "Kisan Drones Maharashtra",
      providerPhone: "+91 98230 77123",
      title: "DJI Agras T40 Ultra-Precision Agricultural Drone Sprayer",
      category: "Sprayers",
      description: "State-of-the-art agricultural drone with 40 kg spray payload, dual centrifugal atomization nozzles, and active phased-array radar. Sprays 1 acre in 6 minutes with millimeter RTK GPS accuracy.",
      manufacturer: "DJI Agriculture",
      modelNumber: "Agras T40 Pro",
      horsepowerOrCapacity: "40 Liters Payload",
      hourlyRate: 1400,
      dailyRate: 9800,
      location: "Wardha, Nagpur, Jalgaon, Amravati",
      locationDistrict: "Wardha",
      locationTaluka: "Ashti",
      includesOperator: true,
      operatingConditions: "Operated strictly by DGCA-certified commercial drone pilot. Farmer provides clean water and biological formulation/pesticide.",
      minimumRentalDuration: "2 Hours (Covers 15-20 Acres)",
      isAvailable: true,
      imageUrl: "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&q=80&w=600",
      specs: "40L Spray Tank • 12m Swath Width • Centrifugal Nozzles • DGCA Licensed Pilot Included",
      rating: 4.9,
      status: "active",
    },
    {
      id: "equip_07",
      providerId: "usr_provider_01",
      providerName: "Mahalaxmi Custom Hiring Center",
      providerPhone: "+91 98230 77123",
      title: "7.5 HP Portable Diesel Engine Water Pump + 500m Lay-Flat Hose",
      category: "Irrigation equipment",
      description: "High-head portable 4-stroke diesel engine water pump kit with 500 meters flexible lay-flat hose and foot-valve strainer. Perfect for drawing water from farm ponds or open wells.",
      manufacturer: "Kirloskar Oil Engines",
      modelNumber: "Mega-T 7.5D",
      horsepowerOrCapacity: "7.5 HP Diesel",
      hourlyRate: 300,
      dailyRate: 2000,
      location: "Wardha, Ashti, Talegaon",
      locationDistrict: "Wardha",
      locationTaluka: "Ashti",
      includesOperator: false,
      operatingConditions: "Self-driven unit. Initial fuel provided (5 Liters); additional diesel provided by farmer.",
      minimumRentalDuration: "4 Hours",
      isAvailable: true,
      imageUrl: "https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&q=80&w=600",
      specs: "7.5 HP Diesel • 65,000 Liters/hr Discharge • 500m 3-inch Flexible Hose • Self-Priming",
      rating: 4.6,
      status: "active",
    },
    {
      id: "equip_08",
      providerId: "usr_provider_01",
      providerName: "Shree Ganesh Agri Mechanics",
      providerPhone: "+91 98230 77123",
      title: "Laser Land Leveler with Dual-Slope Transmitter Unit",
      category: "Other farming machinery",
      description: "Rotary laser transmitter, mast receiver, and hydraulic scraper bucket. Levels uneven agricultural land to exact 0-degree plane, reducing irrigation water consumption by 35%.",
      manufacturer: "Spectra Precision / Trimble",
      modelNumber: "GL-422 Dual Slope",
      horsepowerOrCapacity: "8 Feet Scraper Bucket",
      hourlyRate: 1100,
      dailyRate: 8500,
      location: "Nagpur, Wardha, Amravati, Yavatmal",
      locationDistrict: "Nagpur",
      locationTaluka: "Katol",
      includesOperator: true,
      operatingConditions: "Includes 75HP tractor unit, laser mast, and survey specialist. Land must be cultivated beforehand.",
      minimumRentalDuration: "3 Hours",
      isAvailable: true,
      imageUrl: "https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?auto=format&fit=crop&q=80&w=600",
      specs: "Dual-Slope Laser Transmitter • 8ft Heavy Scraper Bucket • 75HP 4WD Pulling Unit Included",
      rating: 4.9,
      status: "active",
    },
  ],
  rentalBookings: [
    {
      id: "book_01",
      equipmentId: "equip_01",
      equipmentName: "Mahindra 575 DI Sarpanch 45HP Tractor",
      equipmentCategory: "Tractors",
      providerId: "usr_provider_01",
      providerName: "Mahalaxmi Custom Hiring Center",
      farmerId: "usr_farmer_01",
      farmerName: "Rameshwar Sadashiv Shinde",
      farmerPhone: "+91 98223 41092",
      startDate: "2026-11-05",
      endDate: "2026-11-06",
      duration: 2,
      durationUnit: "days",
      rateType: "daily",
      rateAmount: 6500,
      totalAmount: 13000,
      status: "confirmed",
      farmLocation: "Sadashiv Krishi Tirth, Gat 142/A, Ashti, Wardha",
      operatorIncluded: true,
      notes: "Field plowing before post-monsoon chickpea sowing. Operator assigned: Santosh Patil.",
      createdAt: "2026-11-02 10:15",
    },
    {
      id: "book_02",
      equipmentId: "equip_06",
      equipmentName: "DJI Agras T40 Drone Sprayer",
      equipmentCategory: "Sprayers",
      providerId: "usr_provider_01",
      providerName: "Kisan Drones Maharashtra",
      farmerId: "usr_farmer_01",
      farmerName: "Rameshwar Sadashiv Shinde",
      farmerPhone: "+91 98223 41092",
      startDate: "2026-11-08",
      endDate: "2026-11-08",
      duration: 4,
      durationUnit: "hours",
      rateType: "hourly",
      rateAmount: 1400,
      totalAmount: 5600,
      status: "requested",
      farmLocation: "Field C - Salem Turmeric, Gat 143/B, Ashti",
      operatorIncluded: true,
      notes: "Biological Neemastra foliar spray across 10 acres. Morning 07:00 AM slot requested.",
      createdAt: "2026-11-03 08:30",
    },
    {
      id: "book_03",
      equipmentId: "equip_04",
      equipmentName: "Zero-Till Happy Seeder",
      equipmentCategory: "Seed drills",
      providerId: "usr_provider_01",
      providerName: "Vidarbha Conservation Machinery",
      farmerId: "usr_buyer_01",
      farmerName: "Sachin Patil",
      farmerPhone: "+91 98201 54321",
      startDate: "2026-10-25",
      endDate: "2026-10-25",
      duration: 1,
      durationUnit: "days",
      rateType: "daily",
      rateAmount: 4800,
      totalAmount: 4800,
      status: "completed",
      farmLocation: "Pachora, Jalgaon Farm #2",
      operatorIncluded: true,
      notes: "Direct sowing through standing wheat stubble. Job completed successfully.",
      createdAt: "2026-10-22 14:00",
    },
  ],
  agriculturalServices: [
    {
      id: "srv_01",
      providerId: "usr_provider_01",
      providerName: "Dr. PDKV & Krishi Seva Soil Testing Lab",
      serviceName: "GPS-Grid Scientific Soil Sampling & 12-Parameter Lab Testing",
      category: "soil_testing",
      description: "Certified soil sample collection with GPS georeferencing, DTPA micronutrient extraction, pH, electrical conductivity, and tailored fertilizer prescription card.",
      priceAmount: 450,
      pricingModel: "per_sample",
      serviceLocations: "Wardha, Nagpur, Amravati, Yavatmal",
      certifiedBadge: "NABL & ICAR Accredited",
      rating: 4.9,
      isAvailable: true,
      imageUrl: "https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&q=80&w=600",
    },
    {
      id: "srv_02",
      providerId: "usr_provider_01",
      providerName: "Aditi Organic Agro Advisory Wing",
      serviceName: "NPOP & PGS-India Organic Conversion Certification Guidance",
      category: "organic_farming_consultation",
      description: "On-site farm inspection, chemical residue risk assessment, 36-month conversion plan preparation, and official record-book verification.",
      priceAmount: 1800,
      pricingModel: "per_visit",
      serviceLocations: "Entire Maharashtra State",
      certifiedBadge: "APEDA Approved Inspector",
      rating: 5.0,
      isAvailable: true,
      imageUrl: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=600",
    },
    {
      id: "srv_03",
      providerId: "usr_provider_01",
      providerName: "Jain IrriTech Smart Solutions",
      serviceName: "Automated Drip & Solenoid Sprinkler Site Engineering & Setup",
      category: "irrigation_installation",
      description: "End-to-end hydraulic pressure calculation, mainline PVC laying, inline dripper installation, Venturi fertigation unit, and IoT solenoid valve controller calibration.",
      priceAmount: 3500,
      pricingModel: "per_acre",
      serviceLocations: "Vidarbha & Khandesh",
      certifiedBadge: "Certified Irrigation Engineer",
      rating: 4.8,
      isAvailable: true,
      imageUrl: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&q=80&w=600",
    },
    {
      id: "srv_04",
      providerId: "usr_provider_01",
      providerName: "Mahalaxmi Operator Bureau",
      serviceName: "Licensed Heavy Tractor, Combine & DGCA Drone Operators",
      category: "machinery_operators",
      description: "Pre-screened, licensed machine operators with minimum 5 years field experience. Includes insurance and safety gear.",
      priceAmount: 900,
      pricingModel: "per_day",
      serviceLocations: "Wardha, Nagpur, Jalgaon",
      certifiedBadge: "Verified Operator Pool",
      rating: 4.8,
      isAvailable: true,
      imageUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=600",
    },
    {
      id: "srv_05",
      providerId: "usr_provider_01",
      providerName: "PDKV Agri Extension Clinic",
      serviceName: "On-Site Crop Health Diagnostics & IPM Biological Prescriptions",
      category: "farm_consultation",
      description: "Senior agronomist field visit to diagnose wilting, sucking pests, fungal leaf spots, and soil compaction. Prescribes targeted biological concoctions.",
      priceAmount: 1200,
      pricingModel: "per_visit",
      serviceLocations: "Wardha District Hub (35km radius)",
      certifiedBadge: "M.Sc. / Ph.D. Agronomists",
      rating: 4.9,
      isAvailable: true,
      imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600",
    },
  ],
  serviceBookings: [
    {
      id: "sb_01",
      serviceId: "srv_01",
      serviceName: "Scientific GPS Soil Sampling & 12-Parameter Lab Testing",
      category: "soil_testing",
      providerId: "usr_provider_01",
      providerName: "Dr. PDKV & Krishi Seva Soil Testing Lab",
      farmerId: "usr_farmer_01",
      farmerName: "Rameshwar Sadashiv Shinde",
      farmerPhone: "+91 98223 41092",
      scheduledDate: "2026-11-10",
      farmLocation: "Sadashiv Krishi Tirth, Gat 142/A, Ashti",
      areaAcresOrSamples: 3,
      totalAmount: 1350,
      status: "confirmed",
      notes: "Sampling North Acre and East Gat parcels. Technician dispatched with GPS core auger.",
      createdAt: "2026-11-02 11:30",
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
  soilTests: [
    {
      id: "stl_pdkv_01",
      farmerId: "usr_farmer_01",
      farmId: "farm_01",
      fieldId: "field_01",
      fieldName: "North Acre - Gat 142/A (Cotton BG-II)",
      testDate: "2026-09-18",
      laboratoryName: "Dr. PDKV Regional Soil Testing Laboratory, Akola",
      sampleCode: "STL-2026-WRD-092",
      reportDocumentUrl: "/docs/soil-health-card-gat-142a.pdf",
      documentName: "Soil_Health_Card_Gat142A_PDKV.pdf",
      soilTexture: "Deep Black Cotton Clay Loam (Vertisol)",
      overallHealthScore: 88,
      phLevel: 7.7,
      electricalConductivity: 0.42,
      organicCarbonPct: 0.68,
      nitrogenKgHa: 312,
      phosphorusKgHa: 22.4,
      potassiumKgHa: 285,
      sulfurPpm: 18.5,
      zincPpm: 1.15,
      ironPpm: 4.8,
      recommendations: "Soil structure and nutrient buffering are healthy. Apply 2 tonnes well-decomposed Farmyard Manure (FYM) or Vermicompost before next irrigation to boost organic carbon beyond 0.75%. Top-dress with 25 kg Zinc Sulfate per acre to correct marginal zinc deficiency.",
      status: "verified",
      testedByTechnician: "Dr. V. G. Kulkarni (Senior Soil Analyst)",
    },
    {
      id: "stl_krishi_02",
      farmerId: "usr_farmer_01",
      farmId: "farm_01",
      fieldId: "field_02",
      fieldName: "East Gat 143/B (Soybean JS-335)",
      testDate: "2026-08-10",
      laboratoryName: "Vasantrao Naik State Agri Testing Center, Wardha",
      sampleCode: "STL-2026-WRD-041",
      reportDocumentUrl: "/docs/soil-health-card-gat-143b.pdf",
      documentName: "Soil_Health_Report_Soybean_Gat143B.pdf",
      soilTexture: "Medium Black Loam with high drainage",
      overallHealthScore: 85,
      phLevel: 7.4,
      electricalConductivity: 0.38,
      organicCarbonPct: 0.74,
      nitrogenKgHa: 295,
      phosphorusKgHa: 19.8,
      potassiumKgHa: 310,
      sulfurPpm: 22.1,
      zincPpm: 1.42,
      ironPpm: 5.2,
      recommendations: "Rhizobium nodulation is active. Maintain balanced phosphorus fertigation using single superphosphate (SSP) during pod initiation. No gypsum required.",
      status: "verified",
      testedByTechnician: "S. P. Thakare (Lab In-charge)",
    },
    {
      id: "stl_hist_03",
      farmerId: "usr_farmer_01",
      farmId: "farm_01",
      fieldId: "field_01",
      fieldName: "North Acre - Gat 142/A (Pre-Monsoon Baseline)",
      testDate: "2025-05-22",
      laboratoryName: "District Agri Soil Testing Lab, Wardha",
      sampleCode: "STL-2025-WRD-118",
      reportDocumentUrl: "/docs/soil-baseline-2025.pdf",
      documentName: "Soil_Baseline_May2025.pdf",
      soilTexture: "Black Cotton Clay",
      overallHealthScore: 74,
      phLevel: 8.2,
      electricalConductivity: 0.52,
      organicCarbonPct: 0.52,
      nitrogenKgHa: 242,
      phosphorusKgHa: 14.1,
      potassiumKgHa: 235,
      sulfurPpm: 12.0,
      zincPpm: 0.85,
      ironPpm: 3.9,
      recommendations: "Moderate salinity and low organic carbon detected. Recommended green manuring with Dhaincha and deep summer plowing.",
      status: "verified",
      testedByTechnician: "R. M. Joshi",
    },
  ],
  soilMeasurements: [
    {
      id: "sm_ph_01",
      soilTestId: "stl_pdkv_01",
      fieldId: "field_01",
      fieldName: "North Acre - Gat 142/A",
      parameterName: "Soil pH (Acidity / Alkalinity)",
      measuredValue: 7.7,
      unit: "pH",
      measurementMethod: "laboratory",
      optimalMin: 6.5,
      optimalMax: 7.8,
      rating: "optimal",
      correctiveAction: "Maintain current irrigation water quality; no pH amender required.",
      recordedAt: "2026-09-18",
    },
    {
      id: "sm_n_02",
      soilTestId: "stl_pdkv_01",
      fieldId: "field_01",
      fieldName: "North Acre - Gat 142/A",
      parameterName: "Available Nitrogen (N)",
      measuredValue: 312,
      unit: "kg/ha",
      measurementMethod: "laboratory",
      optimalMin: 280,
      optimalMax: 560,
      rating: "optimal",
      correctiveAction: "Apply split dose of Neem-coated Urea at 45 Days After Sowing (DAS).",
      recordedAt: "2026-09-18",
    },
    {
      id: "sm_p_03",
      soilTestId: "stl_pdkv_01",
      fieldId: "field_01",
      fieldName: "North Acre - Gat 142/A",
      parameterName: "Available Phosphorus (P₂O₅)",
      measuredValue: 22.4,
      unit: "kg/ha",
      measurementMethod: "laboratory",
      optimalMin: 15,
      optimalMax: 25,
      rating: "optimal",
      correctiveAction: "Adequate phosphorus reserve. Use PSB (Phosphorus Solubilizing Bacteria) with irrigation.",
      recordedAt: "2026-09-18",
    },
    {
      id: "sm_k_04",
      soilTestId: "stl_pdkv_01",
      fieldId: "field_01",
      fieldName: "North Acre - Gat 142/A",
      parameterName: "Available Potassium (K₂O)",
      measuredValue: 285,
      unit: "kg/ha",
      measurementMethod: "laboratory",
      optimalMin: 150,
      optimalMax: 300,
      rating: "optimal",
      correctiveAction: "Potassium levels support boll retention and fiber strength.",
      recordedAt: "2026-09-18",
    },
    {
      id: "sm_oc_05",
      soilTestId: "stl_pdkv_01",
      fieldId: "field_01",
      fieldName: "North Acre - Gat 142/A",
      parameterName: "Organic Carbon (OC)",
      measuredValue: 0.68,
      unit: "%",
      measurementMethod: "laboratory",
      optimalMin: 0.75,
      optimalMax: 1.25,
      rating: "deficient",
      correctiveAction: "Organic carbon is slightly below 0.75% threshold. Add 2 metric tonnes vermicompost or apply crop residue mulching.",
      recordedAt: "2026-09-18",
    },
    {
      id: "sm_ec_06",
      soilTestId: "stl_pdkv_01",
      fieldId: "field_01",
      fieldName: "North Acre - Gat 142/A",
      parameterName: "Electrical Conductivity (EC)",
      measuredValue: 0.42,
      unit: "dS/m",
      measurementMethod: "laboratory",
      optimalMin: 0.1,
      optimalMax: 1.0,
      rating: "optimal",
      correctiveAction: "Non-saline soil condition. Excellent root elongation buffer.",
      recordedAt: "2026-09-18",
    },
    {
      id: "sm_moist_sensor_07",
      fieldId: "field_01",
      fieldName: "North Acre - Gat 142/A",
      parameterName: "Live Root-Zone Moisture",
      measuredValue: 38.4,
      unit: "%",
      measurementMethod: "sensor",
      optimalMin: 32,
      optimalMax: 48,
      rating: "optimal",
      correctiveAction: "Real-time capacitive probe reading at 25 cm depth. Moisture level is in optimal transpirational range.",
      recordedAt: "2026-11-03",
    },
    {
      id: "sm_temp_sensor_08",
      fieldId: "field_01",
      fieldName: "North Acre - Gat 142/A",
      parameterName: "Soil Root Temperature",
      measuredValue: 24.2,
      unit: "°C",
      measurementMethod: "sensor",
      optimalMin: 18,
      optimalMax: 30,
      rating: "optimal",
      correctiveAction: "Live digital RTD probe reading. Temperature promotes optimal microbial nitrification.",
      recordedAt: "2026-11-03",
    },
    {
      id: "sm_estimated_n_09",
      fieldId: "field_02",
      fieldName: "East Gat 143/B",
      parameterName: "Bio-Available N Uptake (Estimated)",
      measuredValue: 275,
      unit: "kg/ha",
      measurementMethod: "estimated",
      optimalMin: 250,
      optimalMax: 400,
      rating: "optimal",
      correctiveAction: "Calculated via crop growth stage formula (Soybean Pod Filling phase).",
      recordedAt: "2026-11-01",
    },
  ],
  devices: [
    {
      id: "dev_moist_01",
      farmerId: "usr_farmer_01",
      deviceType: "soil_moisture_sensor",
      deviceName: "Sentinel Capacitive Moisture Probe #1",
      serialNumber: "MS-PRO-8841-WRD",
      manufacturer: "Mazhi Sheti IoT Labs",
      modelNumber: "Sentinel-M3 Pro",
      firmwareVersion: "v2.4.1",
      hardwareMacOrEui: "A8:40:41:1B:90:3E",
      status: "online",
      batteryPct: 96,
      signalStrengthDbm: -68,
      lastHeartbeatAt: "Just now (4 min ago)",
      assignedFieldId: "field_01",
      assignedFieldName: "North Acre - Gat 142/A",
      installDepthCm: 25,
      isEnrolled: true,
    },
    {
      id: "dev_npk_02",
      farmerId: "usr_farmer_01",
      deviceType: "fertility_monitor",
      deviceName: "Deep Root Multi-Param NPK Sentinel #2",
      serialNumber: "MS-NPK-4420-WRD",
      manufacturer: "Mazhi Sheti IoT Labs",
      modelNumber: "NutriSense-Pro-7P",
      firmwareVersion: "v2.4.1",
      hardwareMacOrEui: "A8:40:41:1B:92:AA",
      status: "online",
      batteryPct: 88,
      signalStrengthDbm: -72,
      lastHeartbeatAt: "12 min ago",
      assignedFieldId: "field_01",
      assignedFieldName: "North Acre - Gat 142/A",
      installDepthCm: 30,
      isEnrolled: true,
    },
    {
      id: "dev_sprink_03",
      farmerId: "usr_farmer_01",
      deviceType: "automatic_sprinkler",
      deviceName: "Automatic High-Pressure Sprinkler Solenoid Valve",
      serialNumber: "MS-SPR-7731-WRD",
      manufacturer: "Jain IrriTech & Mazhi Sheti Connected",
      modelNumber: "SmartValve-LoRa-32",
      firmwareVersion: "v3.1.0",
      hardwareMacOrEui: "B2:70:12:44:81:9F",
      status: "online",
      batteryPct: 100, // Solar trickle charged
      signalStrengthDbm: -61,
      lastHeartbeatAt: "Just now (2 min ago)",
      assignedFieldId: "field_01",
      assignedFieldName: "North Acre - Gat 142/A",
      installDepthCm: 0,
      isEnrolled: true,
    },
    {
      id: "dev_ctrl_04",
      farmerId: "usr_farmer_01",
      deviceType: "irrigation_controller",
      deviceName: "Borewell Pump Smart Automation Controller",
      serialNumber: "MS-PUMP-9011-WRD",
      manufacturer: "Kirloskar-Mazhi Smart Controller",
      modelNumber: "AgriPump-GSM-4G",
      firmwareVersion: "v1.8.4",
      hardwareMacOrEui: "C4:55:78:90:12:11",
      status: "online",
      batteryPct: 98,
      signalStrengthDbm: -59,
      lastHeartbeatAt: "Just now (1 min ago)",
      assignedFieldId: "field_02",
      assignedFieldName: "East Gat 143/B",
      isEnrolled: true,
    },
    {
      id: "dev_temp_05",
      farmerId: "usr_farmer_01",
      deviceType: "temperature_sensor",
      deviceName: "Canopy & Micro-Climate Ambience Sensor",
      serialNumber: "MS-AMB-3109-WRD",
      manufacturer: "Mazhi Sheti IoT Labs",
      modelNumber: "ClimaSense-RTD",
      firmwareVersion: "v2.0.2",
      hardwareMacOrEui: "D1:22:90:88:14:62",
      status: "online",
      batteryPct: 92,
      signalStrengthDbm: -70,
      lastHeartbeatAt: "8 min ago",
      assignedFieldId: "field_03",
      assignedFieldName: "South Turmeric Plot",
      installDepthCm: 15,
      isEnrolled: true,
    },
  ],
  sensorReadings: [
    {
      id: "sr_01",
      deviceId: "dev_moist_01",
      deviceName: "Sentinel Capacitive Moisture Probe #1",
      fieldId: "field_01",
      fieldName: "North Acre - Gat 142/A",
      readingType: "telemetry_packet",
      moisturePct: 38.4,
      temperatureC: 24.2,
      phLevel: 7.6,
      ecMsCm: 0.44,
      batteryVoltage: 3.65,
      timestamp: "Today, 08:15 AM",
    },
    {
      id: "sr_02",
      deviceId: "dev_npk_02",
      deviceName: "Deep Root Multi-Param NPK Sentinel #2",
      fieldId: "field_01",
      fieldName: "North Acre - Gat 142/A",
      readingType: "npk",
      nitrogenPpm: 124,
      phosphorusPpm: 18,
      potassiumPpm: 215,
      timestamp: "Today, 07:45 AM",
    },
    {
      id: "sr_03",
      deviceId: "dev_sprink_03",
      deviceName: "Automatic High-Pressure Sprinkler Solenoid Valve",
      fieldId: "field_01",
      fieldName: "North Acre - Gat 142/A",
      readingType: "flow_rate",
      flowRateLpm: 0,
      timestamp: "Today, 08:20 AM",
    },
  ],
  irrigationSchedules: [
    {
      id: "irrs_01",
      farmId: "farm_01",
      fieldId: "field_01",
      fieldName: "North Acre - Gat 142/A",
      deviceId: "dev_sprink_03",
      deviceName: "Automatic High-Pressure Sprinkler Solenoid Valve",
      scheduleName: "Morning Automated Sprinkler Cycle (Gat 142/A)",
      startTime: "06:30 AM",
      durationMinutes: 45,
      waterTargetLiters: 3500,
      recurrence: "daily",
      isActive: true,
      automationEnabled: true,
      soilMoistureThresholdPct: 35,
      nextRunAt: "Tomorrow, 06:30 AM",
    },
    {
      id: "irrs_02",
      farmId: "farm_01",
      fieldId: "field_02",
      fieldName: "East Gat 143/B",
      deviceId: "dev_ctrl_04",
      deviceName: "Borewell Pump Smart Automation Controller",
      scheduleName: "Evening Drip Fertigation - Soybean",
      startTime: "05:15 PM",
      durationMinutes: 30,
      waterTargetLiters: 2400,
      recurrence: "alternate_days",
      isActive: true,
      automationEnabled: false,
      soilMoistureThresholdPct: 30,
      nextRunAt: "Today, 05:15 PM",
    },
  ],
  irrigationEvents: [
    {
      id: "irrv_01",
      farmId: "farm_01",
      fieldId: "field_01",
      fieldName: "North Acre - Gat 142/A",
      deviceId: "dev_sprink_03",
      deviceName: "Automatic High-Pressure Sprinkler Solenoid Valve",
      scheduleId: "irrs_01",
      triggerType: "smart_sensor_threshold",
      startTime: "2026-11-02 06:30",
      endTime: "2026-11-02 07:15",
      durationMinutes: 45,
      waterVolumeLiters: 3500,
      waterSource: "borewell",
      status: "completed",
      energyUnitsKwh: 2.1,
      notes: "Triggered automatically when moisture dropped to 33.8%. Completed without line pressure drops.",
    },
    {
      id: "irrv_02",
      farmId: "farm_01",
      fieldId: "field_02",
      fieldName: "East Gat 143/B",
      deviceId: "dev_ctrl_04",
      deviceName: "Borewell Pump Smart Automation Controller",
      triggerType: "manual",
      startTime: "2026-10-31 16:45",
      endTime: "2026-10-31 17:30",
      durationMinutes: 45,
      waterVolumeLiters: 3200,
      waterSource: "farm_pond",
      status: "completed",
      energyUnitsKwh: 1.8,
      notes: "Manual drip irrigation with 19:19:19 water-soluble fertigation injection.",
    },
  ],
  deviceCommands: [
    {
      id: "cmd_01",
      deviceId: "dev_sprink_03",
      deviceName: "Automatic High-Pressure Sprinkler Solenoid Valve",
      commandType: "START_IRRIGATION",
      parameters: { durationMinutes: 45, targetFlowLpm: 60, valveIndex: 1 },
      status: "EXECUTED",
      requestedByUserId: "usr_farmer_01",
      dispatchedAt: "2026-11-02 06:30:02",
      acknowledgedAt: "2026-11-02 06:30:05",
      executedAt: "2026-11-02 07:15:00",
      deviceAckPayload: "ACK_OK: Valve 1 opened at 60 LPM, executed duration 45m. Closed cleanly.",
    },
    {
      id: "cmd_02",
      deviceId: "dev_moist_01",
      deviceName: "Sentinel Capacitive Moisture Probe #1",
      commandType: "CALIBRATE_SENSOR",
      parameters: { referenceSoilType: "Black Cotton Clay", temperatureRefC: 25 },
      status: "ACKNOWLEDGED",
      requestedByUserId: "usr_farmer_01",
      dispatchedAt: "2026-10-28 11:14:00",
      acknowledgedAt: "2026-10-28 11:14:02",
      executedAt: "2026-10-28 11:14:15",
      deviceAckPayload: "CALIBRATION_OK: Zero-drift adjusted, calibrated against baseline vertisol index.",
    },
  ],
  organicPrograms: [
    {
      id: "org_prog_01",
      name: "NPOP National Organic Program",
      marathiName: "राष्ट्रीय सेंद्रिय उत्पादन कार्यक्रम (NPOP)",
      certifyingBody: "APEDA & Accredited Certification Bodies",
      conversionPeriodMonths: 36,
      standardGuidelines: "Adheres strictly to the National Standards for Organic Production (NSOP). Prohibits all synthetic chemical fertilizers, GMO seeds, synthetic pesticides, and sewage sludge. Requires mandatory 3-year documented transition period with third-party accredited audits.",
      description: "India's official export and domestic organic standard recognized across EU, Switzerland, and USA equivalence frameworks.",
    },
    {
      id: "org_prog_02",
      name: "PGS-India Organic (Participatory Guarantee System)",
      marathiName: "सहभागी हमी प्रणाली - सेंद्रिय भारत (PGS-India)",
      certifyingBody: "National Centre of Organic Farming (NCOF) & Regional Councils",
      conversionPeriodMonths: 36,
      standardGuidelines: "Peer-review certification model where local farmer groups audit each other's fields. Emphasizes farmer empowerment, local consumption, trust-based verification, and zero certification fees.",
      description: "Low-cost community-driven certification system ideal for domestic markets, local haats, and farmer producer companies.",
    },
    {
      id: "org_prog_03",
      name: "Bharatiya Prakritik Krishi Paddhati (BPKP)",
      marathiName: "भारतीय प्राकृतिक कृषी पद्धती (नैसर्गिक शेती)",
      certifyingBody: "State Department of Agriculture & Natural Farming Mission",
      conversionPeriodMonths: 24,
      standardGuidelines: "Zero external inputs. Exclusively relies on on-farm indigenous cow-based formulations (Jeev Amrit, Beejamrit, Acchadana mulching, Whapasa aeration, and botanical insect repellents).",
      description: "Sub-scheme under Paramparagat Krishi Vikas Yojana (PKVY) promoting traditional natural agroecology.",
    },
  ],
  organicTransitions: [
    {
      id: "tr_01",
      farmerId: "usr_farmer_01",
      farmId: "farm_01",
      fieldId: "field_01",
      fieldName: "North Acre - Gat 142/A (Cotton BG-II)",
      programId: "org_prog_01",
      programName: "NPOP National Organic Program",
      registrationDate: "2024-07-15",
      targetCertificationDate: "2027-07-15",
      currentStage: "input_adoption",
      conversionStatus: "in_conversion_c2", // Year 2 of 3
      progressPct: 65,
      inspectorAgency: "Aditi Organic Certifications Pvt. Ltd.",
      auditNotes: "Year-2 annual surveillance inspection completed on 2026-08-20. Soil analysis confirmed zero organophosphate or synthetic nitrogen residues. Soil organic carbon improved to 0.68%. Permitted to label produce as 'In-Conversion Organic - Year 2'.",
      baselineChemicalNpkKg: 180,
      currentChemicalNpkKg: 0,
      isCertified: false, // Strict: NOT certified yet! Must finish Year 3
      lastAuditDate: "2026-08-20",
      nextAuditDate: "2027-01-20",
    },
    {
      id: "tr_02",
      farmerId: "usr_farmer_01",
      farmId: "farm_01",
      fieldId: "field_turmeric_03",
      fieldName: "Field C - Salem Turmeric",
      programId: "org_prog_02",
      programName: "PGS-India Organic",
      registrationDate: "2023-06-10",
      targetCertificationDate: "2026-06-10",
      currentStage: "certification_prep",
      conversionStatus: "under_audit", // Final Year 3 audit
      progressPct: 92,
      inspectorAgency: "Wardha PGS Local Farmer Council #18",
      auditNotes: "Final conversion audit in progress. Local peer group verified continuous 3-year record book of farmyard manure, Jeevamrit, and botanical sprays. Curcumin sample sent for residue clearance.",
      baselineChemicalNpkKg: 140,
      currentChemicalNpkKg: 0,
      isCertified: false, // In final review
      lastAuditDate: "2026-09-14",
      nextAuditDate: "2026-11-20",
    },
  ],
  farmingPractices: [
    {
      id: "fp_2026_01",
      fieldId: "field_01",
      fieldName: "North Acre - Gat 142/A",
      transitionRecordId: "tr_01",
      seasonYear: "Kharif 2026 (Current)",
      practiceType: "transitioning_organic",
      chemicalFertilizerUsedKg: 0,
      chemicalPesticidesUsedLiters: 0,
      bioInputsAdopted: "Jeev Amrit (400L total via drip), Vermicompost (2 tonnes), Neemastra foliar spray",
      soilConservationMethods: "Zero-till stalk retention, Sunn hemp green mulching, contour bunding",
      notes: "100% synthetic chemical elimination maintained for 24 months. Root nodulation and earthworm activity thriving.",
      recordedDate: "2026-10-15",
    },
    {
      id: "fp_2025_02",
      fieldId: "field_01",
      fieldName: "North Acre - Gat 142/A",
      transitionRecordId: "tr_01",
      seasonYear: "Kharif 2025 (Conversion Year 1)",
      practiceType: "transitioning_organic",
      chemicalFertilizerUsedKg: 40,
      chemicalPesticidesUsedLiters: 0,
      bioInputsAdopted: "FYM manure, Trichoderma seed treatment, Dashparni Ark",
      soilConservationMethods: "Deep summer plowing and crop residue incorporation",
      notes: "Year 1 step-down: phased out chemical pesticides completely; reduced synthetic urea by 75%.",
      recordedDate: "2025-10-10",
    },
    {
      id: "fp_2024_03",
      fieldId: "field_01",
      fieldName: "North Acre - Gat 142/A",
      seasonYear: "Kharif 2024 (Baseline Prior to Transition)",
      practiceType: "synthetic_conventional",
      chemicalFertilizerUsedKg: 180,
      chemicalPesticidesUsedLiters: 3.5,
      bioInputsAdopted: "None (Conventional practice)",
      soilConservationMethods: "Standard conventional disc tilling",
      notes: "Baseline year before enrolling in NPOP organic transition program.",
      recordedDate: "2024-06-15",
    },
  ],
  organicInputs: [
    {
      id: "inp_jeev_01",
      name: "Jeev Amrit (जीवामृत)",
      marathiName: "जीवामृत खत",
      category: "biofertilizer",
      preparationMethod: "Mix 10 kg indigenous Desi Cow dung, 10 liters Desi Cow urine, 2 kg jaggery, 2 kg besan (gram flour), and 1 handful virgin forest soil in 200 liters water. Stir clockwise twice daily and ferment in shade for 48 to 72 hours.",
      composition: "Millions of aerobic and anaerobic nitrogen-fixing, phosphate-solubilizing, and carbon-digesting beneficial soil microbes.",
      primaryNutrientsOrTarget: "Soil microbiome multiplier, root stimulant, and bio-available macro/micro nutrient unlocker.",
      applicationGuidelines: "Apply 200 liters per acre with irrigation water or via drip fertigation twice monthly.",
      isFarmPrepared: true,
      standardDosagePerAcre: "200 Liters / Acre",
      certificationComplianceStatus: "100% compliant with NPOP & PGS standards",
    },
    {
      id: "inp_vermi_02",
      name: "Vermicompost (गांडूळ खत)",
      marathiName: "सेंद्रिय गांडूळ खत",
      category: "vermicompost",
      preparationMethod: "Bed system using Eisenia fetida earthworms feeding on semi-decomposed cow dung, crop residue, and green biomass for 60 to 75 days.",
      composition: "Organic Carbon (18-22%), Total Nitrogen (1.5-2.0%), Available Phosphorus (0.8-1.0%), Potassium (1.2-1.5%), Humic acid.",
      primaryNutrientsOrTarget: "Improves soil water-holding capacity, porous aggregate formation, and cation exchange capacity.",
      applicationGuidelines: "Broadcast evenly across field and lightly incorporate into soil before sowing or during earthing-up.",
      isFarmPrepared: true,
      standardDosagePerAcre: "1.5 to 2.0 Tonnes / Acre",
      certificationComplianceStatus: "Fully approved under Annex 1 of NPOP standards",
    },
    {
      id: "inp_neem_03",
      name: "Neemastra (निमास्त्र)",
      marathiName: "निमास्त्र कीटकनाशक",
      category: "botanical_pest_control",
      preparationMethod: "Crush 5 kg Neem leaves and 5 kg Neem fruits/seeds. Soak in 5 liters cow urine and 2 kg cow dung in 100 liters water. Ferment for 48 hours and strain through cloth.",
      composition: "Azadirachtin (natural tetranortriterpenoid), Meliantriol, and Nimbin alkaloid complex.",
      primaryNutrientsOrTarget: "Anti-feedant and repellent against sucking pests: Whiteflies, Jassids, Aphids, and Thrips.",
      applicationGuidelines: "Foliar spray at 5-10% dilution in early morning or evening at first sign of sucking pest infestation.",
      isFarmPrepared: true,
      standardDosagePerAcre: "100 Liters solution / Acre",
      certificationComplianceStatus: "Approved botanical pest formulation",
    },
    {
      id: "inp_brahma_04",
      name: "Brahmastra (ब्रह्मास्त्र)",
      marathiName: "ब्रह्मास्त्र अर्क",
      category: "botanical_pest_control",
      preparationMethod: "Boil leaves of Neem, Custard Apple (Sitaphal), Papaya, Guava, and Castor in 10 liters Desi Cow urine until volume reduces by half. Cool and ferment for 24 hours.",
      composition: "Complex botanical phyto-toxins with strong repellent and neurotoxic action on caterpillars.",
      primaryNutrientsOrTarget: "Helicoverpa bollworms, Spodoptera armyworms, and fruit/pod borers.",
      applicationGuidelines: "Foliar spray at 2-3 liters concoction per 100 liters water.",
      isFarmPrepared: true,
      standardDosagePerAcre: "2.5 Liters concentrate in 100L water",
      certificationComplianceStatus: "Approved non-synthetic pest control",
    },
    {
      id: "inp_tricho_05",
      name: "Trichoderma Viride (जैविक बुरशीनाशक)",
      marathiName: "ट्रायकोडर्मा व्हिरीडी",
      category: "biofertilizer",
      preparationMethod: "Lab-isolated fungal bio-agent cultivated on sterilized sorghum/millets.",
      composition: "Trichoderma viride 1.0% WP (Min. 2 x 10^6 CFU/gm).",
      primaryNutrientsOrTarget: "Biological mycoparasite combating Fusarium wilt, Rhizoctonia root rot, and damping off.",
      applicationGuidelines: "Seed treatment at 10g/kg seed or soil application mixed with 100kg farmyard manure per acre.",
      isFarmPrepared: false,
      standardDosagePerAcre: "2.5 kg / Acre in FYM",
      certificationComplianceStatus: "Certified organic biological input",
    },
    {
      id: "inp_green_06",
      name: "Green Manure - Dhaincha (ढेचा / Sesbania)",
      marathiName: "ताग व ढेंचा हिरवळीचे खत",
      category: "green_manure",
      preparationMethod: "Broadcast Sesbania aculeata seeds at 25 kg/acre with pre-monsoon showers. Grow for 45 days until flowering.",
      composition: "Succulent biomass yielding 15-20 tonnes/ha containing 80-100 kg atmospheric nitrogen fixed.",
      primaryNutrientsOrTarget: "Rapidly boosts soil active humus, fixes atmospheric nitrogen, and loosens hard black clay pans.",
      applicationGuidelines: "Chop and incorporate into root zone using disc harrow or rotavator 10 days before primary sowing.",
      isFarmPrepared: true,
      standardDosagePerAcre: "25 kg seeds / Acre",
      certificationComplianceStatus: "Core mandatory practice under organic guidelines",
    },
  ],
  inputApplications: [
    {
      id: "ia_01",
      fieldId: "field_01",
      fieldName: "North Acre - Gat 142/A",
      transitionRecordId: "tr_01",
      organicInputId: "inp_jeev_01",
      inputName: "Jeev Amrit (जीवामृत)",
      category: "biofertilizer",
      quantity: 200,
      unit: "liters",
      applicationMethod: "drip_fertigation",
      appliedDate: "2026-10-22",
      costIncurred: 180, // On-farm ingredient cost
      batchLotNumber: "JA-2026-OCT-B2",
      notes: "Injected through Venturi drip system during morning irrigation. Soil active smell fresh and earthy.",
    },
    {
      id: "ia_02",
      fieldId: "field_01",
      fieldName: "North Acre - Gat 142/A",
      transitionRecordId: "tr_01",
      organicInputId: "inp_vermi_02",
      inputName: "Vermicompost (गांडूळ खत)",
      category: "vermicompost",
      quantity: 1.5,
      unit: "tonnes",
      applicationMethod: "broadcasting",
      appliedDate: "2026-09-25",
      costIncurred: 4500,
      batchLotNumber: "VC-FARM-2026-04",
      notes: "Top-dressed along root lines before earthing up. Earthworm casts clearly visible in top 5 cm.",
    },
    {
      id: "ia_03",
      fieldId: "field_01",
      fieldName: "North Acre - Gat 142/A",
      transitionRecordId: "tr_01",
      organicInputId: "inp_neem_03",
      inputName: "Neemastra (निमास्त्र)",
      category: "botanical_pest_control",
      quantity: 80,
      unit: "liters",
      applicationMethod: "foliar_spray",
      appliedDate: "2026-10-04",
      costIncurred: 220,
      batchLotNumber: "NEEM-2026-09",
      notes: "Foliar mist applied at 8% dilution for Jassid and whitefly control. 95% pest suppression achieved without synthetic chemicals.",
    },
  ],
  noTillRecords: [
    {
      id: "ntr_01",
      fieldId: "field_01",
      fieldName: "North Acre - Gat 142/A",
      seasonYear: "Kharif 2026",
      suitabilityScore: 92,
      residueType: "cotton_stalk_mulch",
      residueCoveragePct: 85,
      coverCropPlanted: "Sunn hemp (ताग) + Cowpea cover",
      soilDisturbanceDepthCm: 0, // Strict zero-till
      moistureRetentionScore: 94,
      weedSuppressionMethod: "dense_mulch_roller",
      notes: "Soybean and cotton stubble rolled flat with chevron roller-crimper. Happy Seeder zero-till planted directly through mulch mat. Zero deep plowing.",
      recordedDate: "2026-10-20",
    },
    {
      id: "ntr_02",
      fieldId: "field_02",
      fieldName: "East Gat 143/B",
      seasonYear: "Kharif 2026",
      suitabilityScore: 84,
      residueType: "soybean_stubble",
      residueCoveragePct: 70,
      coverCropPlanted: "Chickpea (हरभरा) Stubble residue",
      soilDisturbanceDepthCm: 3, // Minimal strip-till
      moistureRetentionScore: 88,
      weedSuppressionMethod: "cover_crop_allelopathy",
      notes: "Conservation strip-till along planting rows. Inter-row mulch preserved undisturbed.",
      recordedDate: "2026-09-30",
    },
  ],
  agriculturalResources: [
    {
      id: "res_01",
      title: "Complete NPOP Organic Conversion Manual: 3-Year Transition Roadmap",
      marathiTitle: "सेंद्रिय शेती संक्रमण मार्गदर्शक: ३ वर्षांची संपूर्ण कार्यप्रणाली",
      category: "organic_farming",
      summary: "Comprehensive guide detailing the 8-stage transition roadmap for converting conventional farmland into certified organic production under Indian National Standards for Organic Production (NPOP). Covers audit documentation, buffer zones, and accredited verification.",
      readTimeMinutes: 8,
      author: "Dr. Anjali Deshmukh (Ph.D. Soil Agronomy, PDKV Akola)",
      pdfGuideUrl: "/docs/NPOP_Organic_Conversion_Manual.pdf",
      featured: true,
    },
    {
      id: "res_02",
      title: "Zero-Budget Natural Farming: Standard Preparation of Jeev Amrit & Beejamrit",
      marathiTitle: "नैसर्गिक शेती: जीवामृत व बीजामृत बनवण्याची प्रमाणित कृती",
      category: "sustainable_agriculture",
      summary: "Step-by-step masterclass on preparing active microbial inoculants using indigenous Desi Cow dung and urine. Details fermentation temperatures, stirring schedules, and Venturi drip delivery without nozzle clogging.",
      readTimeMinutes: 6,
      author: "Vilasrao Patil & Regional Krishi Vigyan Kendra",
      pdfGuideUrl: "/docs/Jeev_Amrit_Preparation_Guide.pdf",
      featured: true,
    },
    {
      id: "res_03",
      title: "Conservation No-Till Farming on Black Cotton Vertisols",
      marathiTitle: "काळी कसदार जमिनीत मशागत विरहित (No-Till) शाश्वत शेती",
      category: "no_till_farming",
      summary: "How to eliminate deep plowing on cracking vertisol soils. Explains stubble retention, roller-crimping cover crops, preventing hard-pan formation, and cutting soil evaporation by up to 45%.",
      readTimeMinutes: 7,
      author: "ICAR - Central Research Institute for Dryland Agriculture",
      pdfGuideUrl: "/docs/No_Till_Conservation_Agriculture.pdf",
      featured: true,
    },
    {
      id: "res_04",
      title: "Botanical Pest Formulations: Neemastra, Brahmastra & Agniastra Protocols",
      marathiTitle: "वनस्पतीजन्य कीटकनाशके: निमास्त्र, ब्रह्मास्त्र व अग्नीअस्त्र बनवणे",
      category: "pest_management",
      summary: "Non-toxic organic pest repellents crafted from local medicinal leaves. Protocols for controlling sucking pests (thrips, aphids) and leaf-eating bollworms without synthetic organophosphates.",
      readTimeMinutes: 5,
      author: "Maharashtra State Organic Farming Mission",
      pdfGuideUrl: "/docs/Botanical_Formulations_Master.pdf",
      featured: false,
    },
    {
      id: "res_05",
      title: "Living Soil Food Web: Building Soil Organic Carbon Past 1.25%",
      marathiTitle: "सजीव माती परिसंस्था: सेंद्रिय कर्ब १.२५% च्या पुढे वाढवणे",
      category: "soil_management",
      summary: "Deep dive into mycorrhizal networks, earthworm cast aggregates, green manuring with Dhaincha/Sunn hemp, and unlocking bound phosphorus using native bio-fertilizer strains.",
      readTimeMinutes: 9,
      author: "Dr. V. G. Kulkarni (Senior Soil Microbiologist)",
      pdfGuideUrl: "/docs/Living_Soil_Organic_Carbon.pdf",
      featured: false,
    },
    {
      id: "res_06",
      title: "Smart Water Conservation: Drip Mulch Synergy in Rain-Deficit Zones",
      marathiTitle: "पाणी बचत: ठिबक सिंचन व सेंद्रिय आच्छादन (Mulching) तंत्र",
      category: "water_conservation",
      summary: "Techniques for combining organic residue mulching with low-pressure drip irrigation. Reduces irrigation frequency by 40% while preserving root-zone moisture buffers in drought-prone areas.",
      readTimeMinutes: 6,
      author: "Jain IrriTech Agronomy Cell",
      pdfGuideUrl: "/docs/Water_Conservation_Mulch_Drip.pdf",
      featured: false,
    },
  ],
  // Phase 7: Agricultural Marketplace, Buyer Procurement & Escrow
  produceListings: [
    {
      id: "prod_01",
      sellerId: "usr_farmer_01",
      farmerName: "Rameshwar Sadashiv Shinde",
      farmerPhone: "+91 98223 41092",
      cropName: "Organic Certified Soybean",
      variety: "JS 335 (High Protein)",
      category: "oilseeds",
      quantity: 120,
      unit: "Quintals",
      pricePerUnit: 5400,
      mandiBenchmarkPrice: 4892,
      minimumOrderQuantity: 10,
      qualityGrade: "Organic Certified",
      harvestDate: "2026-10-24",
      storageCondition: "Dry moisture-controlled aerated warehouse (Moisture < 10%)",
      description: "Naturally grown non-GMO soybean cultivated with vermicompost and Jeevamrutha under NPOP guidelines. Hand-sorted, high oil and protein content, zero synthetic residue.",
      locationDistrict: "Wardha",
      locationTaluka: "Karanja (Lad)",
      locationVillage: "Ashti",
      farmGateAddress: "Gat No. 142, Wardha Road, Ashti Village",
      primaryImageUrl: "https://images.unsplash.com/photo-1599818816946-b3cd8ae243d0?auto=format&fit=crop&q=80&w=600",
      isOrganicCertified: true,
      availabilityStatus: "available",
      viewsCount: 142,
      createdAt: "2026-10-25 10:30",
    },
    {
      id: "prod_02",
      sellerId: "usr_farmer_01",
      farmerName: "Rameshwar Sadashiv Shinde",
      farmerPhone: "+91 98223 41092",
      cropName: "Long-Staple BT Cotton",
      variety: "Bollgard II RCH-659",
      category: "cotton_fiber",
      quantity: 85,
      unit: "Quintals",
      pricePerUnit: 7650,
      mandiBenchmarkPrice: 7121,
      minimumOrderQuantity: 15,
      qualityGrade: "Grade A (Export Ready)",
      harvestDate: "2026-10-28",
      storageCondition: "Dry ginning bale packhouse with poly-wrap protection",
      description: "Premium 29.5mm long staple fiber with high tensile strength (28.5 g/tex) and low micronaire (3.8 - 4.2). Clean white lint harvested before dew, trash content less than 2.5%.",
      locationDistrict: "Wardha",
      locationTaluka: "Karanja (Lad)",
      locationVillage: "Ashti",
      farmGateAddress: "Gat No. 144, Cotton Ginning Yard, Ashti",
      primaryImageUrl: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&q=80&w=600",
      isOrganicCertified: false,
      availabilityStatus: "available",
      viewsCount: 219,
      createdAt: "2026-10-29 14:15",
    },
    {
      id: "prod_03",
      sellerId: "usr_farmer_02",
      farmerName: "Dnyaneshwar Babanrao Patil",
      farmerPhone: "+91 98221 88301",
      cropName: "Nashik Export Red Onion",
      variety: "Phule Samarth (Gavran Special)",
      category: "vegetables",
      quantity: 250,
      unit: "Quintals",
      pricePerUnit: 2850,
      mandiBenchmarkPrice: 2400,
      minimumOrderQuantity: 25,
      qualityGrade: "Grade A+ (Premium Export)",
      harvestDate: "2026-10-18",
      storageCondition: "Natural bamboo ventilated Kanda Chawl storage",
      description: "Medium to large 55mm+ uniform red globes with thin tight neck and deep scarlet outer skin. High pungency, long shelf life of 4+ months without sprouting. Ideal for Middle East and SE Asia export.",
      locationDistrict: "Nashik",
      locationTaluka: "Lasalgaon",
      locationVillage: "Niphad",
      farmGateAddress: "Mandi Road, Niphad Agro Center, Lasalgaon",
      primaryImageUrl: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&q=80&w=600",
      isOrganicCertified: false,
      availabilityStatus: "available",
      viewsCount: 480,
      createdAt: "2026-10-20 09:00",
    },
    {
      id: "prod_04",
      sellerId: "usr_farmer_03",
      farmerName: "Vinayak Govind Sawant",
      farmerPhone: "+91 98234 55110",
      cropName: "Ratnagiri GI Alphonso Mangoes",
      variety: "Konkan Hapus (Geographical Indication Registered)",
      category: "fruits",
      quantity: 450,
      unit: "Crates",
      pricePerUnit: 1650,
      mandiBenchmarkPrice: 1300,
      minimumOrderQuantity: 10,
      qualityGrade: "Grade A+ (Premium Export)",
      harvestDate: "2026-10-15",
      storageCondition: "Naturally ripened in paddy straw crates; zero ethylene gas treatment",
      description: "Authentic coastal Ratnagiri Alphonso mangoes with trademark aroma, saffron-orange pulp, and zero fiber. Export grade certified with APEDA traceability barcode on every wooden crate.",
      locationDistrict: "Ratnagiri",
      locationTaluka: "Devgad",
      locationVillage: "Shirgaon",
      farmGateAddress: "Sawant Mango Orchards, Coastal Highway, Shirgaon",
      primaryImageUrl: "https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&q=80&w=600",
      isOrganicCertified: true,
      availabilityStatus: "available",
      viewsCount: 610,
      createdAt: "2026-10-16 11:20",
    },
    {
      id: "prod_05",
      sellerId: "usr_farmer_01",
      farmerName: "Rameshwar Sadashiv Shinde",
      farmerPhone: "+91 98223 41092",
      cropName: "Vidarbha White Pigeon Pea (Tur Dal)",
      variety: "BDN-711 (Phule Rajeshwari)",
      category: "pulses",
      quantity: 95,
      unit: "Quintals",
      pricePerUnit: 10800,
      mandiBenchmarkPrice: 7550,
      minimumOrderQuantity: 5,
      qualityGrade: "Grade A (Commercial)",
      harvestDate: "2026-10-26",
      storageCondition: "Sun-dried in clean jute bags with neem leaf fumigation",
      description: "Bold grain pigeon pea with quick cooking time, rich aroma, and high protein (22%). Hand-winnowed to remove foreign material; moisture strictly below 9.5%.",
      locationDistrict: "Wardha",
      locationTaluka: "Karanja (Lad)",
      locationVillage: "Ashti",
      farmGateAddress: "Gat No. 142, Ashti Village Gate",
      primaryImageUrl: "https://images.unsplash.com/photo-1585994192700-4e50882e987c?auto=format&fit=crop&q=80&w=600",
      isOrganicCertified: false,
      availabilityStatus: "available",
      viewsCount: 175,
      createdAt: "2026-10-27 16:40",
    },
    {
      id: "prod_06",
      sellerId: "usr_farmer_04",
      farmerName: "Balasaheb Thorat",
      farmerPhone: "+91 98230 44901",
      cropName: "Pusa Basmati 1121 Paddy Rice",
      variety: "Pusa 1121 Extra Long Grain",
      category: "grains",
      quantity: 300,
      unit: "Quintals",
      pricePerUnit: 4150,
      mandiBenchmarkPrice: 3600,
      minimumOrderQuantity: 20,
      qualityGrade: "Grade A+ (Premium Export)",
      harvestDate: "2026-10-22",
      storageCondition: "Concrete floor grain shed, moisture tested at 12%",
      description: "Aromatic extra-long grain paddy with grain elongation ratio of 2.5x after boiling. Minimal broken kernel percentage, processed from river basin loamy soil.",
      locationDistrict: "Kolhapur",
      locationTaluka: "Shirol",
      locationVillage: "Jaisingpur",
      farmGateAddress: "Thorat Agro Farm, Krishna Canal Road, Jaisingpur",
      primaryImageUrl: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=600",
      isOrganicCertified: false,
      availabilityStatus: "available",
      viewsCount: 330,
      createdAt: "2026-10-23 12:00",
    },
    {
      id: "prod_07",
      sellerId: "usr_farmer_05",
      farmerName: "Chandrashekhar Bhoyar",
      farmerPhone: "+91 98224 99120",
      cropName: "GI-Tagged Nagpur Sweet Oranges",
      variety: "Nagpur Mandarin (Santra)",
      category: "fruits",
      quantity: 600,
      unit: "Crates",
      pricePerUnit: 950,
      mandiBenchmarkPrice: 780,
      minimumOrderQuantity: 25,
      qualityGrade: "Grade A (Commercial)",
      harvestDate: "2026-10-29",
      storageCondition: "Cold room precooling at 7°C, wax-coated for freshness",
      description: "Juicy, thin-skinned citrus grown in basalt black soil with high natural sugar-to-acid ratio. Blemish-free fruit graded by electronic optical weight sorter.",
      locationDistrict: "Nagpur",
      locationTaluka: "Katol",
      locationVillage: "Narkhed",
      farmGateAddress: "Bhoyar Citrus Orchards, Katol-Narkhed State Highway",
      primaryImageUrl: "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&q=80&w=600",
      isOrganicCertified: false,
      availabilityStatus: "available",
      viewsCount: 290,
      createdAt: "2026-10-30 08:30",
    },
    {
      id: "prod_08",
      sellerId: "usr_farmer_06",
      farmerName: "Prakash Jadhav",
      farmerPhone: "+91 98231 66200",
      cropName: "Kolhapuri Natural Jaggery Cubes (Gul)",
      variety: "Organic Sugarcane Co-86032",
      category: "organic",
      quantity: 150,
      unit: "Quintals",
      pricePerUnit: 4900,
      mandiBenchmarkPrice: 4200,
      minimumOrderQuantity: 10,
      qualityGrade: "Organic Certified",
      harvestDate: "2026-10-20",
      storageCondition: "Air-sealed moisture proof 10kg cartons with food-grade liner",
      description: "Traditional Kolhapur jaggery prepared with natural okra plant juice clarifier. Zero chemical hydrosulphite, rich golden color, preserves natural iron and trace minerals.",
      locationDistrict: "Kolhapur",
      locationTaluka: "Karveer",
      locationVillage: "Kagal",
      farmGateAddress: "Shree Shahu Jaggery Yard, Kagal MIDC Road",
      primaryImageUrl: "https://images.unsplash.com/photo-1606787366850-de6330128bfc?auto=format&fit=crop&q=80&w=600",
      isOrganicCertified: true,
      availabilityStatus: "available",
      viewsCount: 410,
      createdAt: "2026-10-21 15:00",
    },
  ],
  buyerProfiles: [
    {
      id: "bp_01",
      userId: "usr_buyer_01",
      companyOrTraderName: "Mahavishnu Agro Commodities Pvt. Ltd.",
      buyerType: "wholesaler",
      apmcLicenseNumber: "APMC/MUM/2021/8842",
      gstinNumber: "27AABCM9124K1Z5",
      contactPhone: "+91 98200 44123",
      deliveryWarehouseAddress: "Sector 19, APMC Grain Market, Vashi, Navi Mumbai 400705",
      isVerifiedTrader: true,
      trustScore: 4.9,
      procurementCapacityTons: 120,
    },
    {
      id: "bp_02",
      userId: "usr_buyer_02",
      companyOrTraderName: "Sahyadri Mega Food Park & Exports",
      buyerType: "food_processor",
      apmcLicenseNumber: "APMC/NSK/2019/3310",
      gstinNumber: "27AAACS1820L1ZP",
      contactPhone: "+91 98220 99870",
      deliveryWarehouseAddress: "Plot A-12, Agro Processing Zone, Dindori, Nashik 422202",
      isVerifiedTrader: true,
      trustScore: 5.0,
      procurementCapacityTons: 350,
    },
  ],
  purchaseOrders: [
    {
      id: "po_101",
      listingId: "prod_01",
      farmerId: "usr_farmer_01",
      farmerName: "Rameshwar Sadashiv Shinde",
      farmerPhone: "+91 98223 41092",
      buyerId: "usr_buyer_01",
      buyerName: "Mahavishnu Agro Commodities Pvt. Ltd.",
      buyerPhone: "+91 98200 44123",
      cropName: "Organic Certified Soybean",
      variety: "JS 335 (High Protein)",
      orderQuantity: 20,
      unit: "Quintals",
      unitPrice: 5400,
      totalAmount: 108000,
      orderStatus: "requested",
      paymentStatus: "pending",
      deliveryMethod: "buyer_logistics",
      deliveryAddress: "Sector 19, APMC Grain Market, Vashi, Navi Mumbai",
      scheduledDeliveryDate: "2026-11-08",
      specialInstructions: "Moisture must be under 10%. Please provide NPOP certification copy with delivery challan.",
      createdAt: "2026-11-02 11:30",
      updatedAt: "2026-11-02 11:30",
    },
    {
      id: "po_102",
      listingId: "prod_03",
      farmerId: "usr_farmer_02",
      farmerName: "Dnyaneshwar Babanrao Patil",
      farmerPhone: "+91 98221 88301",
      buyerId: "usr_buyer_02",
      buyerName: "Sahyadri Mega Food Park & Exports",
      buyerPhone: "+91 98220 99870",
      cropName: "Nashik Export Red Onion",
      variety: "Phule Samarth (Gavran Special)",
      orderQuantity: 40,
      unit: "Quintals",
      unitPrice: 2850,
      totalAmount: 114000,
      orderStatus: "in_transit",
      paymentStatus: "escrow_locked",
      escrowTransactionId: "txn_escrow_88201",
      deliveryMethod: "express_cold_chain",
      deliveryAddress: "Agro Processing Cold Store, Dindori, Nashik",
      scheduledDeliveryDate: "2026-11-04",
      specialInstructions: "Mesh bags packed in 25kg standard export sacks.",
      createdAt: "2026-11-01 09:15",
      updatedAt: "2026-11-02 16:00",
    },
    {
      id: "po_103",
      listingId: "prod_05",
      farmerId: "usr_farmer_01",
      farmerName: "Rameshwar Sadashiv Shinde",
      farmerPhone: "+91 98223 41092",
      buyerId: "usr_buyer_01",
      buyerName: "Mahavishnu Agro Commodities Pvt. Ltd.",
      buyerPhone: "+91 98200 44123",
      cropName: "Vidarbha White Pigeon Pea (Tur Dal)",
      variety: "BDN-711 (Phule Rajeshwari)",
      orderQuantity: 15,
      unit: "Quintals",
      unitPrice: 10800,
      totalAmount: 162000,
      orderStatus: "completed",
      paymentStatus: "released_to_farmer",
      escrowTransactionId: "txn_escrow_77192",
      deliveryMethod: "farm_gate_pickup",
      deliveryAddress: "Vashi APMC Central Silos, Navi Mumbai",
      scheduledDeliveryDate: "2026-10-31",
      specialInstructions: "Quality inspected and verified at farm gate.",
      createdAt: "2026-10-28 14:00",
      updatedAt: "2026-10-31 18:30",
    },
  ],
  paymentTransactions: [
    {
      id: "txn_escrow_88201",
      orderId: "po_102",
      buyerId: "usr_buyer_02",
      farmerId: "usr_farmer_02",
      amount: 114000,
      currency: "INR",
      paymentGateway: "razorpay_escrow",
      gatewayPaymentId: "pay_Rzp9821389",
      gatewaySignature: "sig_hmac_881920acb091f9",
      status: "verified",
      verificationMethod: "server_webhook_hmac",
      createdAt: "2026-11-01 10:05",
    },
    {
      id: "txn_escrow_77192",
      orderId: "po_103",
      buyerId: "usr_buyer_01",
      farmerId: "usr_farmer_01",
      amount: 162000,
      currency: "INR",
      paymentGateway: "razorpay_escrow",
      gatewayPaymentId: "pay_Rzp1149201",
      gatewaySignature: "sig_hmac_771920fca1028e",
      status: "disbursed_to_farmer",
      verificationMethod: "server_webhook_hmac",
      createdAt: "2026-10-28 14:20",
    },
  ],
  deliveryRecords: [
    {
      id: "del_88201",
      orderId: "po_102",
      transporterName: "Kisan Gati Shakti Cold Logistics",
      vehicleNumber: "MH-15-EG-4402",
      driverName: "Santosh Ramrao Jadhav",
      driverPhone: "+91 98225 11099",
      trackingNumberOrEwb: "EWB-2026-98124018",
      pickupDate: "2026-11-02 14:00",
      estimatedArrival: "2026-11-04 10:00",
      dispatchGatePass: "GP-NSK-1092",
      status: "in_transit",
      createdAt: "2026-11-02 14:05",
    },
  ],
  // Phase 8: Financial Institutions, Products, Applications, Reviews & Consents
  financialInstitutions: [
    {
      id: "fi_01",
      name: "Bank of Maharashtra",
      institutionType: "public_sector_bank",
      rbiRegistrationCode: "MAHB00001",
      headquartersAddress: "Lokmangal, 1501 Shivajinagar, Pune 411005",
      nodalOfficerName: "Shri Sunil Dinkar Deshmukh (GM - Agri Credit)",
      contactPhone: "+91 20 2553 2731",
      contactEmail: "agri.credit@mahabank.co.in",
      isActive: true,
    },
    {
      id: "fi_02",
      name: "Vidarbha Konkan Gramin Bank (VKGB)",
      institutionType: "regional_rural_bank",
      rbiRegistrationCode: "VKGB00010",
      headquartersAddress: "Chandraprastha Building, Deopur, Dhule & Wardha Regional Office",
      nodalOfficerName: "Smt. Manjusha Joshi (Chief Regional Manager)",
      contactPhone: "+91 7152 245100",
      contactEmail: "loans.wardha@vkgb.co.in",
      isActive: true,
    },
    {
      id: "fi_03",
      name: "State Bank of India (SBI Agri Commercial Hub)",
      institutionType: "public_sector_bank",
      rbiRegistrationCode: "SBIN0000300",
      headquartersAddress: "State Bank Bhavan, Madame Cama Road, Nariman Point, Mumbai",
      nodalOfficerName: "Shri Ravindra Wagh (Chief Manager - Agri Banking)",
      contactPhone: "+91 22 2274 0841",
      contactEmail: "agri.mumbai@sbi.co.in",
      isActive: true,
    },
    {
      id: "fi_04",
      name: "NABARD Agri Refinance Cell",
      institutionType: "public_sector_bank",
      rbiRegistrationCode: "NABARD0001",
      headquartersAddress: "Bandra Kurla Complex, Bandra (East), Mumbai 400051",
      nodalOfficerName: "Dr. K. S. Rao (Chief General Manager)",
      contactPhone: "+91 22 2653 9895",
      contactEmail: "mumbai@nabard.org",
      isActive: true,
    },
  ],
  financialProducts: [
    {
      id: "prod_loan_01",
      institutionId: "fi_01",
      institutionName: "Bank of Maharashtra",
      productName: "Kisan Credit Card (KCC) Crop Working Capital Loan",
      category: "crop_loan",
      interestRatePct: 7.0,
      subventionPct: 3.0,
      effectiveInterestRatePct: 4.0,
      minAmount: 25000,
      maxAmount: 300000,
      maxTenureMonths: 12,
      eligibilityCriteria: "Owner-cultivator or recorded tenant farmer cultivating notified Kharif/Rabi crops with valid 7/12 extract.",
      requiredDocuments: [
        "7/12 Land Record Extract",
        "8A Holding Certificate",
        "Aadhaar Card",
        "PAN Card",
        "Bank Passbook",
        "Crop Sowing Declaration",
      ],
      processingFeePct: 0.0,
      isGovtSponsored: true,
      description: "Concessional revolving credit at 4% effective interest upon prompt annual repayment. Covers seed, fertilizer, pesticide, harvesting and post-harvest maintenance costs.",
    },
    {
      id: "prod_loan_02",
      institutionId: "fi_03",
      institutionName: "State Bank of India",
      productName: "PM-KUSUM Component-B Standalone Solar Irrigation Pump",
      category: "irrigation_loan",
      interestRatePct: 6.8,
      subventionPct: 0.0,
      effectiveInterestRatePct: 6.8,
      minAmount: 80000,
      maxAmount: 450000,
      maxTenureMonths: 60,
      eligibilityCriteria: "Farmers with verified borewell/open well with perennial water source and no existing grid connection (MEDA verified).",
      requiredDocuments: [
        "7/12 Extract showing water source",
        "Groundwater Survey Certificate",
        "Quotation from MEDA Empanelled Solar Vendor",
        "Electricity Non-Availability Certificate",
      ],
      processingFeePct: 0.5,
      isGovtSponsored: true,
      description: "60% government subsidy (30% Central + 30% State MEDA), with 30% bank term loan and only 10% farmer beneficiary contribution. High efficiency 3HP/5HP/7.5HP AC surface or submersible pump.",
    },
    {
      id: "prod_loan_03",
      institutionId: "fi_02",
      institutionName: "Vidarbha Konkan Gramin Bank",
      productName: "Tractor & Farm Mechanization Term Loan",
      category: "equipment_loan",
      interestRatePct: 8.5,
      subventionPct: 0.0,
      effectiveInterestRatePct: 8.5,
      minAmount: 150000,
      maxAmount: 1200000,
      maxTenureMonths: 84,
      eligibilityCriteria: "Minimum 3 acres of irrigated agricultural land, valid driving license, clean credit history.",
      requiredDocuments: [
        "Proforma Invoice from Authorized Dealer",
        "7/12 Extract & 8A Khata",
        "6 Months Bank Statement",
        "Aadhaar & PAN KYC",
      ],
      processingFeePct: 1.0,
      isGovtSponsored: false,
      description: "Finance up to 85% of on-road tractor cost, combine harvester, or laser leveler with seasonal repayment schedules mapped to post-harvest cycles.",
    },
    {
      id: "prod_loan_04",
      institutionId: "fi_01",
      institutionName: "Bank of Maharashtra",
      productName: "Agri Infrastructure Fund (AIF) Packhouse & Cold Storage",
      category: "infrastructure_loan",
      interestRatePct: 8.5,
      subventionPct: 3.0,
      effectiveInterestRatePct: 5.5,
      minAmount: 500000,
      maxAmount: 20000000,
      maxTenureMonths: 120,
      eligibilityCriteria: "Individual farmers, FPOs, and agri-entrepreneurs setting up primary processing, grading, sorting, or cold storage.",
      requiredDocuments: [
        "Detailed Project Report (DPR)",
        "Land Title Deed / Non-Agriculture (NA) Sanction",
        "Civil Construction Plan & Quotation",
        "FPO Registration or KYC",
      ],
      processingFeePct: 0.5,
      isGovtSponsored: true,
      description: "3% interest subvention for 7 years on term loans up to ₹2 Crore, with credit guarantee coverage under CGTMSE paid by central government.",
    },
    {
      id: "prod_loan_05",
      institutionId: "fi_03",
      institutionName: "State Bank of India",
      productName: "Electronic Warehouse Receipt (e-NWR) Pledge Loan",
      category: "warehouse_receipt_loan",
      interestRatePct: 7.2,
      subventionPct: 0.0,
      effectiveInterestRatePct: 7.2,
      minAmount: 50000,
      maxAmount: 2500000,
      maxTenureMonths: 9,
      eligibilityCriteria: "Farmers holding electronic warehouse receipts (e-NWR) issued by WDRA accredited warehouses for harvested produce.",
      requiredDocuments: [
        "e-NWR Electronic Warehouse Receipt",
        "Commodity Quality & Assaying Certificate",
        "Applicant KYC & 7/12 Extract",
      ],
      processingFeePct: 0.25,
      isGovtSponsored: true,
      description: "Prevent distress selling of harvest by pledging warehouse receipts for immediate liquidity up to 75% of commodity market value.",
    },
  ],
  loanApplications: [
    {
      id: "app_kcc_01",
      farmerId: "usr_farmer_01",
      farmerName: "Rameshwar Sadashiv Shinde",
      farmerPhone: "+91 98223 41092",
      productId: "prod_loan_01",
      productName: "Kisan Credit Card (KCC) Crop Working Capital Loan",
      institutionId: "fi_01",
      institutionName: "Bank of Maharashtra",
      category: "crop_loan",
      requestedAmount: 250000,
      sanctionedAmount: 250000,
      tenureMonths: 12,
      interestRatePct: 4.0,
      farmAreaAcres: 12.5,
      cropCycleOrPurpose: "Kharif Cotton & Soybean Cultivation (Seed, Biofertilizers & Tillage)",
      status: "credit_approved",
      bankNotes: "CIBIL Score 745. Verified 12.5 acres title with Mahabhulekh. Credit committee sanctioned full requested limit at 4% concessional rate.",
      sanctionLetterUrl: "/docs/sanction_letters/KCC_MAHB_2026_0912.pdf",
      documents: [
        {
          id: "doc_01",
          documentType: "7_12_extract",
          documentName: "Satbara_Gat_142_144_Ashti.pdf",
          fileUrl: "/docs/satbara_sample.pdf",
          verificationStatus: "verified_authentic",
          verifiedAt: "2026-10-23",
          verifiedByOfficer: "Sunil Deshmukh (Lead Agri Credit Officer)",
          notes: "Verified against Maharashtra Land Revenue records",
        },
        {
          id: "doc_02",
          documentType: "8a_holding_certificate",
          documentName: "Khata_Extract_8A_Wardha.pdf",
          fileUrl: "/docs/khata_sample.pdf",
          verificationStatus: "verified_authentic",
          verifiedAt: "2026-10-23",
          verifiedByOfficer: "Sunil Deshmukh",
        },
        {
          id: "doc_03",
          documentType: "aadhaar_card",
          documentName: "Aadhaar_UIDAI_Masked.pdf",
          fileUrl: "/docs/aadhaar_masked.pdf",
          verificationStatus: "verified_authentic",
          verifiedAt: "2026-10-23",
          verifiedByOfficer: "Sunil Deshmukh",
        },
      ],
      appliedDate: "2026-10-22",
      updatedAt: "2026-10-24",
    },
    {
      id: "app_kusum_02",
      farmerId: "usr_farmer_01",
      farmerName: "Rameshwar Sadashiv Shinde",
      farmerPhone: "+91 98223 41092",
      productId: "prod_loan_02",
      productName: "PM-KUSUM Component-B Standalone Solar Irrigation Pump",
      institutionId: "fi_03",
      institutionName: "State Bank of India",
      category: "irrigation_loan",
      requestedAmount: 210000,
      tenureMonths: 60,
      interestRatePct: 6.8,
      farmAreaAcres: 12.5,
      cropCycleOrPurpose: "5HP Solar Submersible Pump on West Borewell Parcel B",
      status: "field_inspection_scheduled",
      bankNotes: "MEDA subsidy allocation reference approved. Technical field engineer visit scheduled for borewell discharge yield test on 06-Nov-2026.",
      documents: [
        {
          id: "doc_04",
          documentType: "7_12_extract",
          documentName: "Satbara_Water_Source_Certificate.pdf",
          fileUrl: "/docs/satbara_sample.pdf",
          verificationStatus: "verified_authentic",
          verifiedAt: "2026-10-28",
          verifiedByOfficer: "Ravindra Wagh (SBI Agri Hub)",
        },
        {
          id: "doc_05",
          documentType: "machinery_quotation",
          documentName: "Jain_Solar_5HP_Quotation_MEDA.pdf",
          fileUrl: "/docs/jain_solar_quote.pdf",
          verificationStatus: "verified_authentic",
          verifiedAt: "2026-10-28",
          verifiedByOfficer: "Ravindra Wagh",
        },
      ],
      appliedDate: "2026-10-27",
      updatedAt: "2026-10-29",
    },
    {
      id: "app_trac_03",
      farmerId: "usr_farmer_02",
      farmerName: "Dnyaneshwar Babanrao Patil",
      farmerPhone: "+91 98221 88301",
      productId: "prod_loan_03",
      productName: "Tractor & Farm Mechanization Term Loan",
      institutionId: "fi_02",
      institutionName: "Vidarbha Konkan Gramin Bank",
      category: "equipment_loan",
      requestedAmount: 650000,
      tenureMonths: 84,
      interestRatePct: 8.5,
      farmAreaAcres: 8.0,
      cropCycleOrPurpose: "Mahindra 575 DI 45HP Tractor with Multi-Speed Rotavator",
      status: "under_scrutiny",
      bankNotes: "Application received. Dealer proforma invoice verified. Credit bureau evaluation in progress.",
      documents: [
        {
          id: "doc_06",
          documentType: "machinery_quotation",
          documentName: "Mahindra_Tractor_Proforma_Dealer.pdf",
          fileUrl: "/docs/mahindra_quote.pdf",
          verificationStatus: "uploaded",
        },
        {
          id: "doc_07",
          documentType: "7_12_extract",
          documentName: "Satbara_Nashik_Niphad.pdf",
          fileUrl: "/docs/satbara_sample.pdf",
          verificationStatus: "uploaded",
        },
      ],
      appliedDate: "2026-11-01",
      updatedAt: "2026-11-02",
    },
  ],
  loanReviews: [
    {
      id: "rev_01",
      applicationId: "app_kcc_01",
      reviewerId: "usr_banker_01",
      reviewerName: "Sunil Deshmukh (Lead Agri Credit Officer)",
      cibilOrCreditScore: 745,
      landValuationRupees: 3200000,
      cropRiskAssessment: "low_risk_irrigated",
      fieldVisitCompleted: true,
      internalAppraisalNotes: "Applicant holds clean 12.5 acres unencumbered black cotton soil with perennial well. Historical repayment track record is immaculate. Recommended for full KCC sanction.",
      recommendation: "recommend_approval",
      decisionDate: "2026-10-24",
    },
    {
      id: "rev_02",
      applicationId: "app_kusum_02",
      reviewerId: "usr_banker_01",
      reviewerName: "Ravindra Wagh (Chief Manager - Agri Banking)",
      cibilOrCreditScore: 745,
      landValuationRupees: 3200000,
      cropRiskAssessment: "low_risk_irrigated",
      fieldVisitCompleted: false,
      internalAppraisalNotes: "MEDA subsidy allocation confirmed under PM-KUSUM Component-B. Field visit scheduled for borewell yield test before final sanction.",
      recommendation: "recommend_approval",
      decisionDate: "2026-10-29",
    },
  ],
  userConsents: [
    {
      id: "con_01",
      userId: "usr_farmer_01",
      applicationId: "app_kcc_01",
      consentType: "cibil_credit_bureau_check",
      consentText: "I hereby give my explicit digital consent to Bank of Maharashtra and Mazhi Sheti to pull and review my credit information from TransUnion CIBIL / Experian for evaluating my agricultural credit application.",
      isGranted: true,
      ipAddress: "49.36.128.45",
      grantedAt: "2026-10-22 10:14",
    },
    {
      id: "con_02",
      userId: "usr_farmer_01",
      applicationId: "app_kcc_01",
      consentType: "land_record_mahabhulekh_verification",
      consentText: "I authorize institutional lenders to fetch, verify, and monitor my land record title details from Mahabhulekh (Revenue Department, Government of Maharashtra).",
      isGranted: true,
      ipAddress: "49.36.128.45",
      grantedAt: "2026-10-22 10:15",
    },
  ],
  // Phase 9: AI Farming Assistant, Conversations, Recommendations & Feedback
  aiConversations: [
    {
      id: "conv_01",
      farmerId: "usr_farmer_01",
      title: "कापूस पिकावरील कीड नियंत्रण व खत नियोजन (Cotton Pest & Fertigation)",
      language: "mr",
      contextSnapshot: JSON.stringify({
        farmerName: "Rameshwar Sadashiv Shinde",
        village: "Ashti, Wardha",
        primaryCrop: "Cotton (Ajeet-155 BG-II)",
        fieldAreaAcres: 5.5,
        soilNitrogen: "142 kg/ha (Deficient)",
        soilMoisture: "38%",
      }),
      totalMessages: 4,
      lastMessageAt: "2026-11-02 16:45",
      createdAt: "2026-11-02 16:30",
    },
    {
      id: "conv_02",
      farmerId: "usr_farmer_01",
      title: "Soil Test NPK Analysis & Organic Carbon Roadmap",
      language: "en",
      contextSnapshot: JSON.stringify({
        farmerName: "Rameshwar Sadashiv Shinde",
        village: "Ashti, Wardha",
        organicCarbonPct: 0.72,
        soilPh: 7.4,
      }),
      totalMessages: 2,
      lastMessageAt: "2026-11-01 11:20",
      createdAt: "2026-11-01 11:10",
    },
  ],
  aiMessages: [
    {
      id: "msg_01",
      conversationId: "conv_01",
      sender: "user",
      content: "राम राम, माझ्या फील्ड A मधील कापूस (Ajeet-155 BG-II) च्या पानांवर पांढऱ्या माशीचा प्रादुर्भाव दिसत आहे आणि खालची पाने पिवळी पडत आहेत. माझ्या जमिनीच्या तपासणी अहवालानुसार योग्य जैविक उपाय सांगा.",
      language: "mr",
      createdAt: "2026-11-02 16:30",
    },
    {
      id: "msg_02",
      conversationId: "conv_01",
      sender: "assistant",
      content: `राम राम रामेश्वरजी! तुमच्या **फील्ड A (५.५ एकर, कापूस Ajeet-155 BG-II)** च्या परिस्थितीचे विश्लेषण खालीलप्रमाणे आहे:

१. **पाने पिवळी पडण्याचे मुख्य कारण**:
तुमच्या माती परीक्षण अहवालानुसार (**st_01**) जमिनीतील **उपलब्ध नत्र (Nitrogen) १४२ किलो/हेक्टर** आहे, जे आवश्यकतेपेक्षा कमी (Deficient) आहे. बोंडे भरण्याच्या अवस्थेत झाडाला नत्राची जास्त गरज असते.

२. **पांढरी माशी (Whitefly) जैविक नियंत्रण**:
- **निंबोळी अर्क ५% (NSKE)** किंवा **दशपर्णी अर्क २०० मिली प्रति १५ लिटर पंप** फवारणी करा.
- शेतात एकरी ५ पिवळे चिकट सापळे (Yellow Sticky Traps) लावा.

३. **नत्र व पोषण सुधारणा**:
- ठिबक सिंचनाद्वारे **एकरी २०० लिटर जीवामृत** व्हेंचुरीने सोडा.
- तात्काळ पानांवरील पोषणासाठी **१९:१९:१९ विद्राव्य खत १०० ग्रॅम + चिलेटेड झिंक १५ ग्रॅम प्रति पंप** फवारणी करा.

⚠️ *महत्त्वाची सूचना: जर एका पानावर १५ पेक्षा जास्त प्रौढ पांढऱ्या माश्या दिसत असतील (आर्थिक नुकसान पातळी ओलांडली असल्यास), तर कृपया कृषी विज्ञान केंद्र (KVK) वर्धा अथवा डॉ. पंजाबराव देशमुख कृषी विद्यापीठाच्या तज्ज्ञांशी थेट संपर्क साधावा.*`,
      language: "mr",
      citedFieldId: "field_cotton_01",
      citedSoilTestId: "st_01",
      suggestedActions: [
        { label: "फील्ड A माती आरोग्य अहवाल पहा", actionRoute: "/dashboard/farmer/soil-health" },
        { label: "जीवामृत फवारणी नोंद करा", actionRoute: "/dashboard/farmer/organic" },
        { label: "कृषी तज्ज्ञांशी संपर्क साधा", actionRoute: "/advisory" },
      ],
      createdAt: "2026-11-02 16:31",
    },
    {
      id: "msg_03",
      conversationId: "conv_01",
      sender: "user",
      content: "मी पानाचा फोटो काढला आहे, कृपया तपासणी करून सांगा.",
      language: "mr",
      attachedImageUrl: "https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?auto=format&fit=crop&q=80&w=400",
      createdAt: "2026-11-02 16:42",
    },
    {
      id: "msg_04",
      conversationId: "conv_01",
      sender: "assistant",
      content: `मी तुमच्या पानाच्या छायाचित्राचे कॉम्प्युटर व्हिजनद्वारे विश्लेषण केले आहे:

🔍 **निरीक्षण व लक्षणे**:
- शिरांमधील पिवळेपणा (Interveinal Chlorosis) स्पष्ट दिसत आहे.
- पानाच्या मागील बाजूस प्राथमिक पांढऱ्या माशीचे कोष दिसत आहेत.

📊 **कृत्रिम बुद्धिमत्ता निदान**:
- **संभाव्य समस्या**: सुरुवातीची रसशोषक कीड + नत्र आणि सूक्ष्मअन्नद्रव्यांची कमतरता.
- **अचूकता विश्वासार्हता**: ८८% (AI Confidence Score)

🌿 **तात्काळ शिफारस**:
- आज संध्याकाळी ५ वाजल्यानंतर **दशपर्णी अर्क + २% गोमूत्र** फवारणी करावी.
- जमिनीतील ओलावा ३८% असल्याने उद्या सकाळी ४५ मिनिटे ठिबक सिंचन चालवावे.

⚠️ *टीप: हे निदान डिजिटल फोटोवर आधारित आहे. रोग जास्त पसरल्यास प्रत्यक्ष पीक डॉक्टरांकडून शहानिशा करून घ्यावी.*`,
      language: "mr",
      imageAnalysisResult: {
        symptomsIdentified: ["शिरांमधील पिवळेपणा (Interveinal Chlorosis)", "पांढऱ्या माशीचे प्राथमिक अवशेष"],
        probableCause: "सुरुवातीची रसशोषक कीड + मातीतील कमी नत्र पातळी (142 kg/ha)",
        confidencePct: 88,
        recommendedRemedy: "दशपर्णी अर्क फवारणी + ठिबकद्वारे जीवामृत ड्रेन्चिंग",
        requiresExpertVerification: false,
      },
      suggestedActions: [
        { label: "ठिबक सिंचन सुरू करा", actionRoute: "/dashboard/farmer/devices" },
        { label: "जैविक नोंदवहीत नोंदवा", actionRoute: "/dashboard/farmer/organic" },
      ],
      createdAt: "2026-11-02 16:45",
    },
  ],
  aiRecommendations: [
    {
      id: "rec_01",
      farmerId: "usr_farmer_01",
      conversationId: "conv_01",
      recommendationType: "soil_health",
      title: "Nitrogen Replenishment for Field A (Cotton Parcel)",
      titleMarathi: "फील्ड A कापूस पिकासाठी नत्र संवर्धन उपाय",
      description: "Soil test st_01 shows available Nitrogen at 142 kg/ha (deficient). Apply 200L Jeevamrutha per acre via venturi before peak boll formation to prevent premature senescence.",
      descriptionMarathi: "माती परीक्षणात नत्र १४२ किलो/हेक्टर (कमी) आढळले आहे. बोंडे भरण्याच्या काळात एकरी २०० लिटर जीवामृत ठिबकद्वारे देऊन नत्राची कमतरता भरून काढा.",
      urgency: "urgent",
      status: "active",
      actionRoute: "/dashboard/farmer/soil-health",
      createdAt: "2026-11-02 16:32",
    },
    {
      id: "rec_02",
      farmerId: "usr_farmer_01",
      recommendationType: "organic_transition",
      title: "NPOP C1 Transition: Biological Seed Coating Protocol",
      titleMarathi: "सेंद्रिय संक्रमण टप्पा: रब्बी हरभरा रायझोबियम बीजप्रक्रिया",
      description: "For your upcoming rabi chickpea sowing on Field B, inoculate seeds with Rhizobium leguminosarum + PSB liquid bio-fertilizer to naturally fix 35 kg atmospheric Nitrogen/ha.",
      descriptionMarathi: "फील्ड B वरील रब्बी हरभरा पेरणीसाठी रायझोबियम आणि पीएसबी द्रवरूप जिवाणू खताची बीजप्रक्रिया करा, ज्यामुळे हेक्टरी ३५ किलो नत्र नैसर्गिकरित्या जमिनीत स्थिरावेल.",
      urgency: "advisory",
      status: "active",
      actionRoute: "/dashboard/farmer/organic",
      createdAt: "2026-11-01 10:00",
    },
    {
      id: "rec_03",
      farmerId: "usr_farmer_01",
      recommendationType: "irrigation_scheduling",
      title: "Root-Zone Moisture Depletion Alert (Plot A)",
      titleMarathi: "ठिबक सिंचन सूचना: रूट-झोन ओलावा ३८% खाली",
      description: "Soil telemetry node MS-PRO-8841 indicates 38% moisture at 30cm root depth. Run inline drip emitters for 45 minutes to maintain optimal capillary tension.",
      descriptionMarathi: "३० सेमी मुळांच्या खोलीवर ओलावा ३८% पर्यंत खाली आला आहे. इष्टतम आर्द्रता राखण्यासाठी उद्या सकाळी ४५ मिनिटे ठिबक सिंचन चालवावे.",
      urgency: "advisory",
      status: "active",
      actionRoute: "/dashboard/farmer/devices",
      createdAt: "2026-11-02 17:00",
    },
  ],
  aiFeedback: [
    {
      id: "fb_01",
      messageId: "msg_02",
      farmerId: "usr_farmer_01",
      rating: "thumbs_up",
      feedbackText: "खूप अचूक माहिती मिळाली! माझ्या माती अहवालानुसार जैविक उपाय सांगितल्याने फायदा झाला.",
      category: "accurate",
      createdAt: "2026-11-02 16:35",
    },
  ],

  // Phase 10: Expense Categories
  expenseCategories: [
    { id: "exp_cat_01", code: "seeds", name: "Seeds & Saplings", nameMarathi: "बियाणे व रोपे", icon: "Sprout", description: "Certified seeds, hybrid varieties, and nursery saplings" },
    { id: "exp_cat_02", code: "fertilizers", name: "Fertilizers & Organic Inputs", nameMarathi: "खते व सेंद्रिय निविष्ठा", icon: "FlaskConical", description: "Jeevamrutha, compost, micronutrients, bio-fertilizers" },
    { id: "exp_cat_03", code: "labour", name: "Farm Labour & Wages", nameMarathi: "शेतमजुरी व कामाचे वेतन", icon: "Users", description: "Sowing, weeding, intercultural, spraying, and harvesting labour" },
    { id: "exp_cat_04", code: "equipment_rental", name: "Machinery & Equipment Rental", nameMarathi: "कृषी यंत्रे व अवजारे भाडे", icon: "Wrench", description: "Tractor plowing, rotavators, spray drones, harvesters" },
    { id: "exp_cat_05", code: "irrigation", name: "Irrigation & Water Charges", nameMarathi: "सिंचन व पाणीपट्टी खर्च", icon: "Droplets", description: "Canal cess, pump electricity, drip maintenance, filter repairs" },
    { id: "exp_cat_06", code: "transportation", name: "Logistics & Transport", nameMarathi: "वाहतूक व बाजार मालभाडे", icon: "Truck", description: "Transporting produce to APMC Mandi, FPO warehouse" },
    { id: "exp_cat_07", code: "pest_control", name: "Biological Pest Management", nameMarathi: "जैविक कीड नियंत्रण", icon: "Bug", description: "Neem extracts, Trichoderma, pheromone traps, yellow sticky cards" },
    { id: "exp_cat_08", code: "other", name: "Miscellaneous Farm Expenses", nameMarathi: "इतर संकीर्ण शेती खर्च", icon: "Receipt", description: "Soil testing fees, farm boundary fencing, packaging bags" },
  ],

  // Phase 10: Farm Expenses (Rameshwar Shinde usr_farmer_01)
  farmExpenses: [
    {
      id: "exp_01",
      farmerId: "usr_farmer_01",
      farmId: "farm_01",
      fieldId: "field_01",
      cropCycleId: "cycle_01",
      cropName: "Cotton (कापूस)",
      categoryCode: "seeds",
      expenseDate: "2026-06-18",
      amount: 5100,
      quantity: 6,
      unit: "packets",
      unitCost: 850,
      vendorName: "Mahalaxmi Krishi Seva Kendra, Karanja",
      paymentMode: "upi",
      notes: "Ajeet-155 BG-II certified bollworm resistant cotton seeds.",
      createdAt: "2026-06-18 11:30",
    },
    {
      id: "exp_02",
      farmerId: "usr_farmer_01",
      farmId: "farm_01",
      fieldId: "field_02",
      cropCycleId: "cycle_02",
      cropName: "Soybean (सोयाबीन)",
      categoryCode: "seeds",
      expenseDate: "2026-06-20",
      amount: 9600,
      quantity: 3,
      unit: "bags (30kg)",
      unitCost: 3200,
      vendorName: "Maharashtra State Seeds Corp (Mahabeej)",
      paymentMode: "bank_transfer",
      notes: "JS-335 foundation certified seed bags for 4.5 acres.",
      createdAt: "2026-06-20 14:00",
    },
    {
      id: "exp_03",
      farmerId: "usr_farmer_01",
      farmId: "farm_01",
      fieldId: "field_01",
      cropCycleId: "cycle_01",
      cropName: "Cotton (कापूस)",
      categoryCode: "fertilizers",
      expenseDate: "2026-07-10",
      amount: 6800,
      quantity: 400,
      unit: "liters",
      unitCost: 17,
      vendorName: "Self-prepared On-farm (Gau-Mutra + Dung + Jaggery)",
      paymentMode: "cash",
      notes: "Organic Jeevamrutha preparation ingredients for venturi fertigation.",
      createdAt: "2026-07-10 09:15",
    },
    {
      id: "exp_04",
      farmerId: "usr_farmer_01",
      farmId: "farm_01",
      fieldId: "field_01",
      cropCycleId: "cycle_01",
      cropName: "Cotton (कापूस)",
      categoryCode: "fertilizers",
      expenseDate: "2026-08-05",
      amount: 3400,
      quantity: 2,
      unit: "bags (25kg)",
      unitCost: 1700,
      vendorName: "Ashti Farmers Cooperative Society",
      paymentMode: "upi",
      notes: "Water Soluble Potash (13:00:45) for foliar boll enhancement.",
      createdAt: "2026-08-05 16:45",
    },
    {
      id: "exp_05",
      farmerId: "usr_farmer_01",
      farmId: "farm_01",
      fieldId: "field_01",
      cropCycleId: "cycle_01",
      cropName: "Cotton (कापूस)",
      categoryCode: "labour",
      expenseDate: "2026-07-28",
      amount: 4200,
      quantity: 12,
      unit: "days",
      unitCost: 350,
      vendorName: "Karanji Village Labour Toli",
      paymentMode: "cash",
      notes: "First manual intercultural weeding in Plot A black clay soil.",
      createdAt: "2026-07-28 18:30",
    },
    {
      id: "exp_06",
      farmerId: "usr_farmer_01",
      farmId: "farm_01",
      fieldId: "field_02",
      cropCycleId: "cycle_02",
      cropName: "Soybean (सोयाबीन)",
      categoryCode: "labour",
      expenseDate: "2026-08-15",
      amount: 3000,
      quantity: 6,
      unit: "days",
      unitCost: 500,
      vendorName: "Local Irrigation Mechanics",
      paymentMode: "cash",
      notes: "Drip sub-main flush and inline emitter layout verification.",
      createdAt: "2026-08-15 17:00",
    },
    {
      id: "exp_07",
      farmerId: "usr_farmer_01",
      farmId: "farm_01",
      fieldId: "field_01",
      cropCycleId: "cycle_01",
      cropName: "Cotton (कापूस)",
      categoryCode: "equipment_rental",
      expenseDate: "2026-06-12",
      amount: 5400,
      quantity: 6,
      unit: "hours",
      unitCost: 900,
      vendorName: "Mahalaxmi Custom Hiring Center",
      paymentMode: "upi",
      notes: "John Deere 5050D Deep MB Ploughing & Rotavator seedbed prep.",
      createdAt: "2026-06-12 15:00",
    },
    {
      id: "exp_08",
      farmerId: "usr_farmer_01",
      farmId: "farm_01",
      fieldId: "field_01",
      cropCycleId: "cycle_01",
      cropName: "Cotton (कापूस)",
      categoryCode: "equipment_rental",
      expenseDate: "2026-09-02",
      amount: 3600,
      quantity: 8,
      unit: "acres",
      unitCost: 450,
      vendorName: "Kisan Drones Agro Services",
      paymentMode: "upi",
      notes: "DJI Agras T40 precision foliar spray for uniform coverage.",
      createdAt: "2026-09-02 12:20",
    },
    {
      id: "exp_09",
      farmerId: "usr_farmer_01",
      farmId: "farm_01",
      fieldId: "field_01",
      cropCycleId: "cycle_01",
      cropName: "Cotton (कापूस)",
      categoryCode: "irrigation",
      expenseDate: "2026-09-25",
      amount: 2800,
      quantity: 1,
      unit: "quarterly bill",
      unitCost: 2800,
      vendorName: "MSEDCL Agricultural Feeder",
      paymentMode: "kcc_loan",
      notes: "Solar + grid subsidised power tariff for agricultural tube well.",
      createdAt: "2026-09-25 10:15",
    },
    {
      id: "exp_10",
      farmerId: "usr_farmer_01",
      farmId: "farm_01",
      fieldId: "field_02",
      cropCycleId: "cycle_02",
      cropName: "Soybean (सोयाबीन)",
      categoryCode: "transportation",
      expenseDate: "2026-10-18",
      amount: 1500,
      quantity: 1,
      unit: "trips",
      unitCost: 1500,
      vendorName: "Shree Ganesh Freight Carriers",
      paymentMode: "cash",
      notes: "Tata Ace loading freight for sample harvest batch to APMC Wardha.",
      createdAt: "2026-10-18 16:30",
    },
    {
      id: "exp_11",
      farmerId: "usr_farmer_01",
      farmId: "farm_01",
      fieldId: "field_01",
      cropCycleId: "cycle_01",
      cropName: "Cotton (कापूस)",
      categoryCode: "pest_control",
      expenseDate: "2026-09-14",
      amount: 2200,
      quantity: 5,
      unit: "kg",
      unitCost: 440,
      vendorName: "PDKV Akola Bio-Control Laboratory",
      paymentMode: "upi",
      notes: "Verticillium lecanii + Trichoderma viride biological bio-agents.",
      createdAt: "2026-09-14 13:45",
    },
    {
      id: "exp_12",
      farmerId: "usr_farmer_01",
      farmId: "farm_01",
      fieldId: "field_03",
      cropCycleId: "cycle_03",
      cropName: "Turmeric (हळद)",
      categoryCode: "labour",
      expenseDate: "2026-10-05",
      amount: 2800,
      quantity: 8,
      unit: "days",
      unitCost: 350,
      vendorName: "Ashti Local Farm Hands",
      paymentMode: "cash",
      notes: "Earthing up soil around turmeric rhizome mounds in Plot C.",
      createdAt: "2026-10-05 17:15",
    },
  ],

  // Phase 10: Notifications
  notifications: [
    {
      id: "notif_01",
      userId: "usr_farmer_01",
      category: "booking_update",
      title: "Machinery Booking Confirmed: John Deere 5050D",
      titleMarathi: "यंत्र नोंदणी मंजूर: जॉन डीअर ट्रॅक्टर ५ नोव्हेंबर",
      message: "Mahalaxmi Custom Hiring Center has confirmed your tractor rental for 05 Nov 2026 (08:00 AM). Operator Sandip Patil assigned.",
      messageMarathi: "महालक्ष्मी कस्टम हायरिंग सेंटरने तुमची ०५ नोव्हेंबर २०२६ ची नोंदणी स्वीकारली आहे. ऑपरेटर संदीप पाटील उपस्थित राहतील.",
      priority: "high",
      isRead: false,
      actionUrl: "/rentals",
      actionLabel: "View Booking Details",
      createdAt: "2026-11-03 07:45",
    },
    {
      id: "notif_02",
      userId: "usr_farmer_01",
      category: "marketplace_order",
      title: "New Purchase Order: 1,200 kg Organic Cotton",
      titleMarathi: "नवीन खरेदी मागणी: १,२०० किलो सेंद्रिय कापूस (₹७८.५०/किलो)",
      message: "Buyer Mahyco Agri Procurement locked escrow for PO-2026-8801. Total order value: ₹94,200.",
      messageMarathi: "खरेदीदार मायको अग्री प्रोक्योरमेंटने ₹९४,२०० चा एस्क्रो फंड जमा केला आहे. कृपया डिलिव्हरी शेड्युल तपासा.",
      priority: "high",
      isRead: false,
      actionUrl: "/marketplace",
      actionLabel: "Review Mandi Order",
      createdAt: "2026-11-02 18:20",
    },
    {
      id: "notif_03",
      userId: "usr_farmer_01",
      category: "loan_update",
      title: "Kisan Credit Card (KCC) Sanctioned: ₹1,65,000",
      titleMarathi: "किसान क्रेडिट कार्ड कर्ज मंजूर: ₹१,६५,००० (बँक ऑफ महाराष्ट्र)",
      message: "Underwriting officer Rajesh Deshmukh approved your KCC Kharif limit with 4% interest subvention.",
      messageMarathi: "बँक ऑफ महाराष्ट्रने तुमचे किसान क्रेडिट कार्ड मंजूर केले असून ४% सवलतीच्या व्याजदराचा लाभ दिला आहे.",
      priority: "high",
      isRead: true,
      readAt: "2026-11-02 14:10",
      actionUrl: "/finance",
      actionLabel: "Download Sanction Letter",
      createdAt: "2026-11-02 11:30",
    },
    {
      id: "notif_04",
      userId: "usr_farmer_01",
      category: "soil_alert",
      title: "Soil Moisture Below Threshold: 38% at Plot A",
      titleMarathi: "माती आर्द्रता चेतावणी: प्लॉट A मधील ओलावा ३८% पर्यंत घसरला",
      message: "Root-zone sentinel node MS-PRO-8841 dropped below the optimal 40% threshold. Automated drip trigger recommended.",
      messageMarathi: "प्लॉट A मधील मातीतील ओलावा ३८% वर आला आहे. पिकाची पाण्याची गरज पूर्ण करण्यासाठी ठिबक सिंचन सुरू करा.",
      priority: "urgent",
      isRead: false,
      actionUrl: "/dashboard/farmer/devices",
      actionLabel: "Activate Smart Valve",
      createdAt: "2026-11-03 06:15",
    },
    {
      id: "notif_05",
      userId: "usr_farmer_01",
      category: "irrigation_reminder",
      title: "Automated Drip Cycle Scheduled: Plot B & C",
      titleMarathi: "ठिबक सिंचन वेळापत्रक: उद्या सकाळी ०६:३० वाजता",
      message: "Scheduled 45-minute drip hydration scheduled for Plot B (Soybean) and Plot C (Turmeric).",
      messageMarathi: "प्लॉट B आणि C साठी उद्या सकाळी ४५ मिनिटांचे नियोजित ठिबक सिंचन स्वयंचलितरित्या सुरू होईल.",
      priority: "normal",
      isRead: true,
      readAt: "2026-11-02 19:40",
      actionUrl: "/dashboard/farmer/devices",
      actionLabel: "Check Irrigation Logs",
      createdAt: "2026-11-02 17:00",
    },
    {
      id: "notif_06",
      userId: "usr_farmer_01",
      category: "ai_recommendation",
      title: "AI Agronomist: Foliar Potassium Nitrate Advisory",
      titleMarathi: "AI शेती सल्लागार: कपाशीसाठी १३:००:४५ फवारणी शिफारस",
      message: "Analysis of your Cotton Ajeet-155 BG-II bolls suggests foliar spray of 1% KNO3 to maximize fiber tensile strength.",
      messageMarathi: "कपाशीच्या बोंड विकासासाठी १% पोटॅशियम नायट्रेट (१३:००:४५) ची फवारणी उपयुक्त ठरेल.",
      priority: "normal",
      isRead: false,
      actionUrl: "/advisory",
      actionLabel: "Open AI Crop Clinic",
      createdAt: "2026-11-01 10:15",
    },
    {
      id: "notif_07",
      userId: "usr_farmer_01",
      category: "announcement",
      title: "KUSUM-B Solar Agricultural Pump Subsidy Open",
      titleMarathi: "कुसुम-ब योजना: ५ एचपी सौर कृषी पंपावर ७५% अनुदान सुरू",
      message: "Mahavitaran and MEDA portal opened applications for Vidarbha district farmers. Subsidy up to 75% for 3HP/5HP solar pumps.",
      messageMarathi: "महावितरण व मेडा अंतर्गत सौर कृषी पंपासाठी ऑनलाईन अर्ज सुरू झाले आहेत. आजच अर्ज करा.",
      priority: "normal",
      isRead: true,
      readAt: "2026-10-30 15:00",
      actionUrl: "/finance",
      actionLabel: "Explore Solar Schemes",
      createdAt: "2026-10-30 09:00",
    },
    {
      id: "notif_08",
      userId: "usr_farmer_01",
      category: "farming_activity",
      title: "PDKV Soil Testing Report Uploaded",
      titleMarathi: "माती आरोग्य पत्रिका उपलब्ध: सेंद्रिय कर्ब ०.६८% वाढले",
      message: "Lab testing for Field A is complete. Available Nitrogen: 142 kg/ha, Organic Carbon: 0.68%, Soil Health Index: 88/100.",
      messageMarathi: "फील्ड A चे माती परीक्षण पूर्ण झाले असून सेंद्रिय कर्ब ०.६८% पर्यंत सुधारले आहे.",
      priority: "normal",
      isRead: true,
      readAt: "2026-10-29 11:20",
      actionUrl: "/dashboard/farmer/soil-health",
      actionLabel: "View Soil Health Card",
      createdAt: "2026-10-29 10:00",
    },
  ],

  // Phase 10: Notification Preferences
  notificationPreferences: [
    {
      id: "pref_01",
      userId: "usr_farmer_01",
      emailEnabled: true,
      smsEnabled: true,
      pushEnabled: true,
      whatsappEnabled: true,
      mutedCategories: [],
      quietHoursStart: "22:00",
      quietHoursEnd: "06:00",
      updatedAt: "2026-11-01 10:00",
    },
  ],

  // Phase 10: Farming Tasks (Activity Calendar & Task Manager)
  farmingTasks: [
    {
      id: "task_01",
      farmerId: "usr_farmer_01",
      farmId: "farm_01",
      fieldId: "field_01",
      cropName: "Cotton (कापूस)",
      title: "Foliar Spray of 13:00:45 on Cotton BG-II",
      titleMarathi: "कपाशीवर १३:००:४५ ची पानांवर फवारणी",
      description: "Spray 1% solution (100g in 10L water) during late afternoon to promote boll size and stop premature square dropping.",
      taskCategory: "spraying",
      priority: "high",
      status: "pending",
      dueDate: "2026-11-04",
      estimatedLaborDays: 1,
      estimatedCost: 800,
      notes: "Ensure drone or backpack sprayer operates with hollow cone nozzles.",
      createdAt: "2026-11-02 08:30",
    },
    {
      id: "task_02",
      farmerId: "usr_farmer_01",
      farmId: "farm_01",
      fieldId: "field_01",
      cropName: "Cotton (कापूस)",
      title: "Turn on Drip Irrigation Zone 1 & 2",
      titleMarathi: "झोन १ आणि २ मध्ये ठिबक सिंचन सुरू करणे",
      description: "Sensor moisture reached 38%. Run drip lines for 45 minutes from Solar Borewell pump.",
      taskCategory: "irrigation",
      priority: "urgent",
      status: "pending",
      dueDate: "2026-11-04",
      estimatedLaborDays: 0.5,
      estimatedCost: 150,
      notes: "Check sand filter backwash pressure before initiating flow.",
      createdAt: "2026-11-03 06:20",
    },
    {
      id: "task_03",
      farmerId: "usr_farmer_01",
      farmId: "farm_01",
      fieldId: "field_02",
      cropName: "Soybean (सोयाबीन)",
      title: "Intercultural Weeding in Soybean Plot",
      titleMarathi: "सोयाबीन प्लॉटमध्ये खुरपणी व तण नियंत्रण",
      description: "Manual weeding between rows to remove late-season weeds and aerate roots.",
      taskCategory: "weeding",
      priority: "medium",
      status: "in_progress",
      dueDate: "2026-11-06",
      estimatedLaborDays: 4,
      estimatedCost: 1400,
      notes: "Use hand hoe (खुरपे) without disturbing shallow soybean nodules.",
      createdAt: "2026-11-01 09:00",
    },
    {
      id: "task_04",
      farmerId: "usr_farmer_01",
      farmId: "farm_01",
      fieldId: "field_03",
      cropName: "Turmeric (हळद)",
      title: "Harvest Maturity Check & Foliar Bio-potash",
      titleMarathi: "हळद पक्वता तपासणी आणि जैविक पोटॅश ड्रेन्चिंग",
      description: "Inspect bottom leaves drying pattern and drench 200L Jeevamrutha around rhizome ridges.",
      taskCategory: "fertilizer",
      priority: "low",
      status: "pending",
      dueDate: "2026-11-15",
      estimatedLaborDays: 2,
      estimatedCost: 700,
      notes: "Turmeric crop is in day 135 rhizome development stage.",
      createdAt: "2026-10-28 14:00",
    },
    {
      id: "task_05",
      farmerId: "usr_farmer_01",
      farmId: "farm_01",
      fieldId: "field_01",
      cropName: "Cotton (कापूस)",
      title: "Soil Sentinels Battery Check & Recalibration",
      titleMarathi: "माती सेन्सर्स बॅटरी तपासणी व रिकॅलिब्रेशन",
      description: "Clean solar top plate and verify RS485 communication with LoRa gateway node.",
      taskCategory: "maintenance",
      priority: "low",
      status: "completed",
      dueDate: "2026-11-01",
      completedAt: "2026-11-01 16:30",
      estimatedLaborDays: 0.5,
      estimatedCost: 200,
      notes: "Sensor node MS-PRO-8841 signal quality confirmed at 94% RSSI.",
      createdAt: "2026-10-27 10:00",
    },
    {
      id: "task_06",
      farmerId: "usr_farmer_01",
      farmId: "farm_01",
      fieldId: "field_02",
      cropName: "Gram / Harbhara (हरभरा)",
      title: "Seed Treatment with Rhizobium for Rabi Chickpea",
      titleMarathi: "रब्बी हरभरा रायझोबियम आणि ट्रायकोडर्मा बीजप्रक्रिया",
      description: "Coat Digvijay chickpea seeds with bio-fertilizers 2 hours before rabi sowing.",
      taskCategory: "sowing",
      priority: "medium",
      status: "pending",
      dueDate: "2026-11-10",
      estimatedLaborDays: 1,
      estimatedCost: 450,
      notes: "Crucial step for NPOP Stage 2 biological nitrogen fixation.",
      createdAt: "2026-10-31 11:00",
    },
  ],

  // Phase 10: Task History
  taskHistory: [
    {
      id: "th_01",
      taskId: "task_05",
      changedByUserId: "usr_farmer_01",
      oldStatus: "pending",
      newStatus: "completed",
      remarks: "Cleaned sentinel sensor casing and confirmed LoRa packet delivery.",
      recordedAt: "2026-11-01 16:30",
    },
    {
      id: "th_02",
      taskId: "task_03",
      changedByUserId: "usr_farmer_01",
      oldStatus: "pending",
      newStatus: "in_progress",
      remarks: "Labourers started weeding on northern half of Plot B.",
      recordedAt: "2026-11-02 10:15",
    },
  ],

};
