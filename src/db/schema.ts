import { pgTable, text, timestamp, numeric, integer, boolean, jsonb } from "drizzle-orm/pg-core";

// 1. Users Table (Core identity linked with Clerk user ID)
export const users = pgTable("users", {
  id: text("id").primaryKey(),
  clerkId: text("clerk_id").unique(),
  email: text("email").notNull(),
  fullName: text("full_name").notNull(),
  phone: text("phone"),
  role: text("role").notNull().default("farmer"),
  avatarUrl: text("avatar_url"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 2. User Profiles Table
export const userProfiles = pgTable("user_profiles", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }).notNull().unique(),
  bio: text("bio"),
  preferredLanguage: text("preferred_language").default("mr").notNull(),
  nationalIdMasked: text("national_id_masked"),
  kycStatus: text("kyc_status").default("pending").notNull(),
  organizationName: text("organization_name"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 3. User Roles Table
export const userRoles = pgTable("user_roles", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  role: text("role").notNull(),
  grantedAt: timestamp("granted_at").defaultNow().notNull(),
  grantedBy: text("granted_by").default("system").notNull(),
});

// 4. Farmer Profiles Table
export const farmerProfiles = pgTable("farmer_profiles", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }).notNull().unique(),
  landOwnershipType: text("land_ownership_type").notNull().default("owned"),
  totalLandAcres: numeric("total_land_acres").notNull().default("0"),
  numberOfFields: integer("number_of_fields").notNull().default(1),
  farmingPractice: text("farming_practice").notNull().default("conventional"),
  irrigationSource: text("irrigation_source").notNull().default("drip"),
  primaryCrops: text("primary_crops").default("Cotton, Soybean"),
  experienceYears: integer("experience_years").default(10),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 5. Farmer Locations Table
export const farmerLocations = pgTable("farmer_locations", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  state: text("state").default("Maharashtra").notNull(),
  district: text("district").notNull(),
  taluka: text("taluka").notNull(),
  village: text("village").notNull(),
  pinCode: text("pin_code").notNull(),
  latitude: numeric("latitude"),
  longitude: numeric("longitude"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 6. Farms Table
export const farms = pgTable("farms", {
  id: text("id").primaryKey(),
  farmerId: text("farmer_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  name: text("name").notNull(),
  totalAcres: numeric("total_acres").notNull(),
  surveyNumber: text("survey_number"),
  soilType: text("soil_type").notNull(), // 'black_cotton' | 'red_loam' | 'alluvial' | 'laterite'
  irrigationSource: text("irrigation_source").notNull(),
  waterAvailability: text("water_availability").default("Adequate"),
  state: text("state").default("Maharashtra"),
  district: text("district").notNull(),
  taluka: text("taluka").notNull(),
  village: text("village").notNull(),
  boundariesGeoJson: text("boundaries_geojson"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 7. Onboarding Records Table
export const onboardingRecords = pgTable("onboarding_records", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }).notNull().unique(),
  role: text("role").notNull(),
  currentStep: integer("current_step").default(1).notNull(),
  isCompleted: boolean("is_completed").default(false).notNull(),
  stepData: jsonb("step_data").notNull(),
  completedAt: timestamp("completed_at"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 8. Farm Fields Table (Multiple fields per farm)
export const farmFields = pgTable("farm_fields", {
  id: text("id").primaryKey(),
  farmId: text("farm_id").references(() => farms.id, { onDelete: "cascade" }).notNull(),
  name: text("name").notNull(), // e.g. "North Acre - Gat 142/A"
  areaAcres: numeric("area_acres").notNull(),
  locationNotes: text("location_notes"),
  soilType: text("soil_type").notNull(), // 'Deep Black Cotton', 'Medium Red Loam', 'Alluvial Silt'
  irrigationMethod: text("irrigation_method").notNull(), // 'Drip System', 'Micro-Sprinkler', 'Canal Flood', 'Rainfed'
  soilHealthScore: integer("soil_health_score").default(85), // 0-100
  organicCarbonPct: numeric("organic_carbon_pct").default("0.65"),
  boundaries: text("boundaries"),
  fieldNotes: text("field_notes"),
  farmingHistory: text("farming_history"), // Previous crops: "Soybean (Kharif 2025) -> Chickpea (Rabi 2025)"
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 9. Crops Master Catalog
export const crops = pgTable("crops", {
  id: text("id").primaryKey(),
  name: text("name").notNull(), // "Cotton", "Soybean", "Turmeric", "Banana", "Onion"
  marathiName: text("marathi_name").notNull(), // "कापूस", "सोयाबीन", "हळद"
  category: text("category").notNull(), // "Cash Crop", "Oilseed", "Spices", "Horticulture"
  season: text("season").notNull(), // "Kharif", "Rabi", "Annual"
  defaultDurationDays: integer("default_duration_days").notNull(),
  recommendedSoilTypes: text("recommended_soil_types"),
  npkRatioRecommendation: text("npk_ratio_recommendation"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 10. Crop Cycles Table (Planting cycles in a field)
export const cropCycles = pgTable("crop_cycles", {
  id: text("id").primaryKey(),
  fieldId: text("field_id").references(() => farmFields.id, { onDelete: "cascade" }).notNull(),
  cropId: text("crop_id").references(() => crops.id, { onDelete: "set null" }),
  cropName: text("crop_name").notNull(),
  variety: text("variety").notNull(), // e.g. "Ajeet-155 BG-II"
  seedBrandOrSource: text("seed_brand_or_source"), // "Mahyco Certified Seed Lot #884"
  sowingDate: text("sowing_date").notNull(),
  expectedHarvestDate: text("expected_harvest_date").notNull(),
  actualHarvestDate: text("actual_harvest_date"),
  growthStage: text("growth_stage").notNull(), // 'Sowing' | 'Vegetative' | 'Flowering' | 'Boll/Pod Formation' | 'Maturity' | 'Harvested'
  estimatedYieldKg: numeric("estimated_yield_kg"),
  actualYieldKg: numeric("actual_yield_kg"),
  status: text("status").default("active").notNull(), // 'active' | 'harvested' | 'cancelled'
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 11. Farm Activities Timeline Table
export const farmActivities = pgTable("farm_activities", {
  id: text("id").primaryKey(),
  farmId: text("farm_id").references(() => farms.id, { onDelete: "cascade" }).notNull(),
  fieldId: text("field_id").references(() => farmFields.id, { onDelete: "cascade" }).notNull(),
  cropCycleId: text("crop_cycle_id").references(() => cropCycles.id, { onDelete: "set null" }),
  activityType: text("activity_type").notNull(), // 'sowing' | 'irrigation' | 'fertilizer' | 'soil_testing' | 'pest_treatment' | 'harvesting'
  title: text("title").notNull(),
  description: text("description"),
  quantity: numeric("quantity"),
  unit: text("unit"), // 'kg', 'liters', 'hours', 'bags'
  costIncurred: numeric("cost_incurred").default("0"),
  performedDate: text("performed_date").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 12. Crop Observations Table (Pest, Disease, Nutrient Deficiency logs)
export const cropObservations = pgTable("crop_observations", {
  id: text("id").primaryKey(),
  cropCycleId: text("crop_cycle_id").references(() => cropCycles.id, { onDelete: "cascade" }).notNull(),
  fieldId: text("field_id").references(() => farmFields.id, { onDelete: "cascade" }).notNull(),
  observationType: text("observation_type").notNull(), // 'pest_infestation' | 'disease_symptom' | 'nutrient_deficiency' | 'weather_damage'
  pestOrDiseaseName: text("pest_or_disease_name").notNull(), // e.g. "Jassids / Sucking Thrips", "Yellow Mosaic Virus"
  severity: text("severity").notNull().default("medium"), // 'low' | 'medium' | 'high' | 'critical'
  affectedAreaPct: integer("affected_area_pct").default(10),
  observedDate: text("observed_date").notNull(),
  treatmentTaken: text("treatment_taken"),
  notes: text("notes"),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 13. Harvest Records Table
export const harvestRecords = pgTable("harvest_records", {
  id: text("id").primaryKey(),
  cropCycleId: text("crop_cycle_id").references(() => cropCycles.id, { onDelete: "cascade" }).notNull(),
  fieldId: text("field_id").references(() => farmFields.id, { onDelete: "cascade" }).notNull(),
  harvestDate: text("harvest_date").notNull(),
  yieldKg: numeric("yield_kg").notNull(),
  grade: text("grade").notNull(), // 'Grade A - Export', 'Grade B - Mandi', 'Organic Certified'
  moistureAtHarvestPct: numeric("moisture_at_harvest_pct"),
  storageLocation: text("storage_location"), // "Farm On-Site Shed #2", "APMC Wardha Warehouse"
  marketPricePerKg: numeric("market_price_per_kg"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 14. Smart Soil Sensors
export const soilSensors = pgTable("soil_sensors", {
  id: text("id").primaryKey(),
  fieldId: text("field_id").references(() => farmFields.id, { onDelete: "set null" }),
  serialNumber: text("serial_number").unique().notNull(),
  model: text("model").default("Mazhi Sheti Sensor v2.4 Pro"),
  status: text("status").default("active"),
  batteryPct: integer("battery_pct").default(94),
  signalStrengthDbm: integer("signal_strength_dbm").default(-68),
  installDepthCm: integer("install_depth_cm").default(25),
  firmwareVersion: text("firmware_version").default("v2.4.1"),
  lastSyncAt: timestamp("last_sync_at").defaultNow().notNull(),
});

// 15. IoT Soil Telemetry Readings
export const soilTelemetry = pgTable("soil_telemetry", {
  id: text("id").primaryKey(),
  sensorId: text("sensor_id").references(() => soilSensors.id, { onDelete: "cascade" }).notNull(),
  fieldId: text("field_id").references(() => farmFields.id, { onDelete: "cascade" }).notNull(),
  moisturePct: numeric("moisture_pct").notNull(),
  nitrogenPpm: numeric("nitrogen_ppm").notNull(),
  phosphorusPpm: numeric("phosphorus_ppm").notNull(),
  potassiumPpm: numeric("potassium_ppm").notNull(),
  temperatureC: numeric("temperature_c").notNull(),
  phLevel: numeric("ph_level").notNull(),
  ecMsCm: numeric("ec_ms_cm").notNull(),
  recordedAt: timestamp("recorded_at").defaultNow().notNull(),
});

// 16. Consultations
export const consultations = pgTable("consultations", {
  id: text("id").primaryKey(),
  farmerId: text("farmer_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  expertId: text("expert_id").references(() => users.id, { onDelete: "set null" }),
  fieldId: text("field_id").references(() => farmFields.id, { onDelete: "set null" }),
  cropName: text("crop_name").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  urgency: text("urgency").default("medium"),
  status: text("status").default("pending"),
  expertDiagnosis: text("expert_diagnosis"),
  prescribedTreatment: text("prescribed_treatment"),
  dosageGuide: text("dosage_guide"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  resolvedAt: timestamp("resolved_at"),
});

// 17. Produce Marketplace Listings
export const marketplaceListings = pgTable("marketplace_listings", {
  id: text("id").primaryKey(),
  sellerId: text("seller_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  crop: text("crop").notNull(),
  variety: text("variety").notNull(),
  grade: text("grade").notNull(),
  quantityAvailableKg: numeric("quantity_available_kg").notNull(),
  pricePerKg: numeric("price_per_kg").notNull(),
  mandiBenchmarkPrice: numeric("mandi_benchmark_price"),
  harvestDate: text("harvest_date").notNull(),
  location: text("location").notNull(),
  status: text("status").default("active"),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 18. Produce Marketplace Orders
export const marketplaceOrders = pgTable("marketplace_orders", {
  id: text("id").primaryKey(),
  listingId: text("listing_id").references(() => marketplaceListings.id, { onDelete: "cascade" }).notNull(),
  buyerId: text("buyer_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  quantityKg: numeric("quantity_kg").notNull(),
  offeredPricePerKg: numeric("offered_price_per_kg").notNull(),
  totalAmount: numeric("total_amount").notNull(),
  status: text("status").default("placed"),
  deliveryAddress: text("delivery_address").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 19. Agri-Equipment Listings
export const equipmentListings = pgTable("equipment_listings", {
  id: text("id").primaryKey(),
  providerId: text("provider_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  title: text("title").notNull(),
  category: text("category").notNull(),
  modelNumber: text("model_number"),
  hourlyRate: numeric("hourly_rate").notNull(),
  dailyRate: numeric("daily_rate").notNull(),
  location: text("location").notNull(),
  includesOperator: boolean("includes_operator").default(true),
  isAvailable: boolean("is_available").default(true),
  imageUrl: text("image_url"),
  specs: text("specs"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 20. Machinery Rental Bookings
export const rentalBookings = pgTable("rental_bookings", {
  id: text("id").primaryKey(),
  equipmentId: text("equipment_id").references(() => equipmentListings.id, { onDelete: "cascade" }).notNull(),
  farmerId: text("farmer_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  startDate: text("start_date").notNull(),
  endDate: text("end_date").notNull(),
  totalHoursOrDays: integer("total_hours_or_days").notNull(),
  rateType: text("rate_type").default("daily"),
  totalAmount: numeric("total_amount").notNull(),
  status: text("status").default("requested"),
  farmLocation: text("farm_location").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 21. Financial Applications
export const financialApplications = pgTable("financial_applications", {
  id: text("id").primaryKey(),
  farmerId: text("farmer_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  bankId: text("bank_id").references(() => users.id, { onDelete: "set null" }),
  applicationType: text("application_type").notNull(),
  schemeName: text("scheme_name").notNull(),
  requestedAmount: numeric("requested_amount").notNull(),
  sanctionedAmount: numeric("sanctioned_amount"),
  tenureMonths: integer("tenure_months").default(12),
  interestRatePct: numeric("interest_rate_pct").default("4.0"),
  farmAreaAcres: numeric("farm_area_acres").notNull(),
  status: text("status").default("submitted"),
  bankNotes: text("bank_notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 22. System Audit Logs
export const auditLogs = pgTable("audit_logs", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  userRole: text("user_role").notNull(),
  action: text("action").notNull(),
  entityType: text("entity_type").notNull(),
  entityId: text("entity_id").notNull(),
  details: text("details").notNull(),
  ipAddress: text("ip_address"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

// =========================================================================
// PHASE 4: SOIL HEALTH, SMART DEVICES, IRRIGATION & SPRINKLER INTEGRATION
// =========================================================================

// 23. Soil Tests Table (Laboratory & certified field test reports)
export const soilTests = pgTable("soil_tests", {
  id: text("id").primaryKey(),
  farmerId: text("farmer_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  farmId: text("farm_id").references(() => farms.id, { onDelete: "cascade" }).notNull(),
  fieldId: text("field_id").references(() => farmFields.id, { onDelete: "cascade" }).notNull(),
  testDate: text("test_date").notNull(),
  laboratoryName: text("laboratory_name").notNull(), // e.g. "PDKV Agricultural Soil Testing Lab", "Mahalaxmi Krishi Seva Lab"
  sampleCode: text("sample_code").notNull(), // e.g. "STL-2025-WRD-092"
  reportDocumentUrl: text("report_document_url"), // URL or path to uploaded PDF / certificate
  documentName: text("document_name"),
  soilTexture: text("soil_texture").notNull().default("Clay Loam"), // "Deep Black Clay", "Sandy Loam", etc.
  overallHealthScore: integer("overall_health_score").default(85).notNull(), // 0 - 100
  phLevel: numeric("ph_level").notNull(),
  electricalConductivity: numeric("electrical_conductivity").notNull(), // dS/m or mS/cm
  organicCarbonPct: numeric("organic_carbon_pct").notNull(), // %
  nitrogenKgHa: numeric("nitrogen_kg_ha").notNull(), // Available Nitrogen (kg/ha)
  phosphorusKgHa: numeric("phosphorus_kg_ha").notNull(), // Available Phosphorus (kg/ha)
  potassiumKgHa: numeric("potassium_kg_ha").notNull(), // Available Potassium (kg/ha)
  sulfurPpm: numeric("sulfur_ppm"),
  zincPpm: numeric("zinc_ppm"),
  ironPpm: numeric("iron_ppm"),
  recommendations: text("recommendations"),
  status: text("status").default("verified").notNull(), // 'verified' | 'pending_verification' | 'draft'
  testedByTechnician: text("tested_by_technician"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 24. Soil Measurements Table (Granular parameter records with methodology & ranges)
export const soilMeasurements = pgTable("soil_measurements", {
  id: text("id").primaryKey(),
  soilTestId: text("soil_test_id").references(() => soilTests.id, { onDelete: "cascade" }),
  fieldId: text("field_id").references(() => farmFields.id, { onDelete: "cascade" }).notNull(),
  parameterName: text("parameter_name").notNull(), // 'pH', 'Nitrogen (N)', 'Phosphorus (P)', 'Potassium (K)', 'Organic Carbon', 'Soil Moisture', 'Soil Temperature', 'Electrical Conductivity (EC)'
  measuredValue: numeric("measured_value").notNull(),
  unit: text("unit").notNull(), // 'pH', 'kg/ha', '%', '°C', 'dS/m'
  measurementMethod: text("measurement_method").notNull(), // 'laboratory' | 'sensor' | 'estimated'
  optimalMin: numeric("optimal_min").notNull(),
  optimalMax: numeric("optimal_max").notNull(),
  rating: text("rating").notNull(), // 'deficient' | 'optimal' | 'excess' | 'critical'
  correctiveAction: text("corrective_action"),
  recordedAt: timestamp("recorded_at").defaultNow().notNull(),
});

// 25. Agricultural Devices Table (IoT probes, Smart Sprinklers, Irrigation Controllers)
export const agriculturalDevices = pgTable("agricultural_devices", {
  id: text("id").primaryKey(),
  farmerId: text("farmer_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  deviceType: text("device_type").notNull(), // 'soil_moisture_sensor' | 'temperature_sensor' | 'fertility_monitor' | 'irrigation_controller' | 'automatic_sprinkler'
  deviceName: text("device_name").notNull(), // e.g. "East Gat Micro-Sprinkler Valve #1", "Sentinel Moisture Probe v2"
  serialNumber: text("serial_number").unique().notNull(), // e.g. "MS-SPR-9921-A"
  manufacturer: text("manufacturer").default("Mazhi Sheti IoT Labs").notNull(),
  modelNumber: text("model_number").default("SmartAgri-Pro-X1").notNull(),
  firmwareVersion: text("firmware_version").default("v2.4.1").notNull(),
  hardwareMacOrEui: text("hardware_mac_or_eui"),
  status: text("status").default("online").notNull(), // 'online' | 'offline' | 'low_battery' | 'maintenance'
  batteryPct: integer("battery_pct").default(95).notNull(),
  signalStrengthDbm: integer("signal_strength_dbm").default(-65).notNull(),
  lastHeartbeatAt: timestamp("last_heartbeat_at").defaultNow().notNull(),
  authTokenHash: text("auth_token_hash"), // Device authentication token hash for secure command dispatch
  isEnrolled: boolean("is_enrolled").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 26. Device Assignments Table (Attaching devices to parcels)
export const deviceAssignments = pgTable("device_assignments", {
  id: text("id").primaryKey(),
  deviceId: text("device_id").references(() => agriculturalDevices.id, { onDelete: "cascade" }).notNull(),
  fieldId: text("field_id").references(() => farmFields.id, { onDelete: "cascade" }).notNull(),
  farmId: text("farm_id").references(() => farms.id, { onDelete: "cascade" }).notNull(),
  installDepthCm: integer("install_depth_cm").default(25), // For soil probes
  installationNotes: text("installation_notes"),
  assignedAt: timestamp("assigned_at").defaultNow().notNull(),
  unassignedAt: timestamp("unassigned_at"),
  isActive: boolean("is_active").default(true).notNull(),
});

// 27. Sensor Readings Table (Live chronological telemetry stream)
export const sensorReadings = pgTable("sensor_readings", {
  id: text("id").primaryKey(),
  deviceId: text("device_id").references(() => agriculturalDevices.id, { onDelete: "cascade" }).notNull(),
  fieldId: text("field_id").references(() => farmFields.id, { onDelete: "cascade" }).notNull(),
  readingType: text("reading_type").default("telemetry_packet").notNull(), // 'telemetry_packet' | 'moisture' | 'temperature' | 'npk' | 'flow_rate'
  moisturePct: numeric("moisture_pct"),
  temperatureC: numeric("temperature_c"),
  phLevel: numeric("ph_level"),
  ecMsCm: numeric("ec_ms_cm"),
  nitrogenPpm: numeric("nitrogen_ppm"),
  phosphorusPpm: numeric("phosphorus_ppm"),
  potassiumPpm: numeric("potassium_ppm"),
  flowRateLpm: numeric("flow_rate_lpm"), // Liters per minute for irrigation controllers
  batteryVoltage: numeric("battery_voltage"),
  rawPayload: text("raw_payload"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

// 28. Irrigation Schedules Table (Automated & planned irrigation cycles)
export const irrigationSchedules = pgTable("irrigation_schedules", {
  id: text("id").primaryKey(),
  farmId: text("farm_id").references(() => farms.id, { onDelete: "cascade" }).notNull(),
  fieldId: text("field_id").references(() => farmFields.id, { onDelete: "cascade" }).notNull(),
  deviceId: text("device_id").references(() => agriculturalDevices.id, { onDelete: "set null" }),
  scheduleName: text("schedule_name").notNull(), // "Morning Drip Fertigation - Gat 142"
  startTime: text("start_time").notNull(), // "06:30"
  durationMinutes: integer("duration_minutes").notNull(), // 45
  waterTargetLiters: integer("water_target_liters").notNull(), // 3500
  recurrence: text("recurrence").default("daily").notNull(), // 'daily' | 'alternate_days' | 'weekly' | 'smart_moisture_trigger'
  isActive: boolean("is_active").default(true).notNull(),
  automationEnabled: boolean("automation_enabled").default(true).notNull(),
  soilMoistureThresholdPct: integer("soil_moisture_threshold_pct").default(35), // Trigger automatic sprinkler if moisture drops below this
  nextRunAt: text("next_run_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 29. Irrigation Events Table (Execution log of water delivered)
export const irrigationEvents = pgTable("irrigation_events", {
  id: text("id").primaryKey(),
  farmId: text("farm_id").references(() => farms.id, { onDelete: "cascade" }).notNull(),
  fieldId: text("field_id").references(() => farmFields.id, { onDelete: "cascade" }).notNull(),
  deviceId: text("device_id").references(() => agriculturalDevices.id, { onDelete: "set null" }),
  scheduleId: text("schedule_id").references(() => irrigationSchedules.id, { onDelete: "set null" }),
  triggerType: text("trigger_type").notNull(), // 'manual' | 'scheduled' | 'smart_sensor_threshold'
  startTime: text("start_time").notNull(),
  endTime: text("end_time"),
  durationMinutes: integer("duration_minutes").notNull(),
  waterVolumeLiters: numeric("water_volume_liters").notNull(),
  waterSource: text("water_source").notNull(), // 'borewell' | 'well' | 'canal' | 'farm_pond'
  status: text("status").default("completed").notNull(), // 'completed' | 'in_progress' | 'interrupted' | 'failed'
  energyUnitsKwh: numeric("energy_units_kwh").default("1.8"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 30. Device Commands Table (Secure commands dispatched to connected sprinklers & controllers)
export const deviceCommands = pgTable("device_commands", {
  id: text("id").primaryKey(),
  deviceId: text("device_id").references(() => agriculturalDevices.id, { onDelete: "cascade" }).notNull(),
  commandType: text("command_type").notNull(), // 'START_IRRIGATION' | 'STOP_IRRIGATION' | 'SET_FLOW_RATE' | 'CALIBRATE_SENSOR' | 'EMERGENCY_SHUTOFF'
  parameters: text("parameters").notNull(), // JSON string e.g. {"durationMinutes": 30, "flowRateLpm": 45}
  status: text("status").default("PENDING").notNull(), // 'PENDING' | 'DISPATCHED' | 'ACKNOWLEDGED' | 'EXECUTED' | 'FAILED'
  requestedByUserId: text("requested_by_user_id").notNull(),
  dispatchedAt: timestamp("dispatched_at"),
  acknowledgedAt: timestamp("acknowledged_at"),
  executedAt: timestamp("executed_at"),
  failureReason: text("failure_reason"),
  deviceAckPayload: text("device_ack_payload"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// =========================================================================
// PHASE 5: CROP MANAGEMENT, ORGANIC TRANSITION, NO-TILL & SUSTAINABLE AGRI
// =========================================================================

// 31. Organic Certification Programs (NPOP, PGS-India, ZBNF Natural)
export const organicPrograms = pgTable("organic_programs", {
  id: text("id").primaryKey(),
  name: text("name").notNull(), // "NPOP National Organic Program", "PGS-India Green / Organic"
  marathiName: text("marathi_name").notNull(), // "राष्ट्रीय सेंद्रिय उत्पादन कार्यक्रम"
  certifyingBody: text("certifying_body").notNull(), // "APEDA / Regional Council"
  conversionPeriodMonths: integer("conversion_period_months").default(36).notNull(), // 36 months for annual crops
  standardGuidelines: text("standard_guidelines").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 32. Organic Transition Records (Field-by-field multi-year conversion tracker)
export const organicTransitionRecords = pgTable("organic_transition_records", {
  id: text("id").primaryKey(),
  farmerId: text("farmer_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  farmId: text("farm_id").references(() => farms.id, { onDelete: "cascade" }).notNull(),
  fieldId: text("field_id").references(() => farmFields.id, { onDelete: "cascade" }).notNull(),
  programId: text("program_id").references(() => organicPrograms.id, { onDelete: "set null" }),
  registrationDate: text("registration_date").notNull(),
  targetCertificationDate: text("target_certification_date").notNull(),
  currentStage: text("current_stage").default("initial_assessment").notNull(), // 'initial_assessment' | 'soil_assessment' | 'transition_planning' | 'input_adoption' | 'soil_improvement' | 'crop_monitoring' | 'documentation' | 'certification_prep'
  conversionStatus: text("conversion_status").default("in_conversion_c1").notNull(), // 'in_conversion_c1' | 'in_conversion_c2' | 'in_conversion_c3' | 'under_audit' | 'certified_verified'
  progressPct: integer("progress_pct").default(15).notNull(), // 0 - 100
  inspectorAgency: text("inspector_agency"), // "Aditi Organic Certifications / Maharashtra Council"
  auditNotes: text("audit_notes"),
  baselineChemicalNpkKg: numeric("baseline_chemical_npk_kg").default("150").notNull(),
  currentChemicalNpkKg: numeric("current_chemical_npk_kg").default("0").notNull(),
  isCertified: boolean("is_certified").default(false).notNull(), // Strict: Never auto-certified without verified audit
  lastAuditDate: text("last_audit_date"),
  nextAuditDate: text("next_audit_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 33. Farming Practices History Table (Baseline & ongoing chemical/organic transition tracking)
export const farmingPractices = pgTable("farming_practices", {
  id: text("id").primaryKey(),
  fieldId: text("field_id").references(() => farmFields.id, { onDelete: "cascade" }).notNull(),
  transitionRecordId: text("transition_record_id").references(() => organicTransitionRecords.id, { onDelete: "set null" }),
  seasonYear: text("season_year").notNull(), // "Kharif 2026", "Rabi 2025"
  practiceType: text("practice_type").notNull(), // 'synthetic_conventional' | 'integrated_ipm' | 'transitioning_organic' | 'certified_organic' | 'natural_zbnf'
  chemicalFertilizerUsedKg: numeric("chemical_fertilizer_used_kg").default("0"),
  chemicalPesticidesUsedLiters: numeric("chemical_pesticides_used_liters").default("0"),
  bioInputsAdopted: text("bio_inputs_adopted"), // "Jeev Amrit, Trichoderma, Vermicompost"
  soilConservationMethods: text("soil_conservation_methods"), // "Mulching, Contour Bunding"
  notes: text("notes"),
  recordedDate: text("recorded_date").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 34. Organic Inputs Master Catalog (Composts, biofertilizers, botanical pest concoctions)
export const organicInputs = pgTable("organic_inputs", {
  id: text("id").primaryKey(),
  name: text("name").notNull(), // "Jeev Amrit (जीवामृत)", "Vermicompost (गांडूळ खत)", "Neemastra (निमास्त्र)", "Trichoderma Viride"
  marathiName: text("marathi_name").notNull(),
  category: text("category").notNull(), // 'compost' | 'vermicompost' | 'biofertilizer' | 'organic_manure' | 'botanical_pest_control' | 'green_manure' | 'cover_crop'
  preparationMethod: text("preparation_method"),
  composition: text("composition"),
  primaryNutrientsOrTarget: text("primary_nutrients_or_target"), // "Bio-nitrogen fixation", "Sucking pest control", "Microbial booster"
  applicationGuidelines: text("application_guidelines"),
  isFarmPrepared: boolean("is_farm_prepared").default(true).notNull(),
  standardDosagePerAcre: text("standard_dosage_per_acre").notNull(),
  certificationComplianceStatus: text("certification_compliance_status").default("allowed_under_npop").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 35. Organic Input Applications Table (Field application log)
export const inputApplications = pgTable("input_applications", {
  id: text("id").primaryKey(),
  fieldId: text("field_id").references(() => farmFields.id, { onDelete: "cascade" }).notNull(),
  transitionRecordId: text("transition_record_id").references(() => organicTransitionRecords.id, { onDelete: "set null" }),
  organicInputId: text("organic_input_id").references(() => organicInputs.id, { onDelete: "set null" }),
  inputName: text("input_name").notNull(),
  category: text("category").notNull(),
  quantity: numeric("quantity").notNull(),
  unit: text("unit").notNull(), // 'kg' | 'liters' | 'tonnes' | 'bags'
  applicationMethod: text("application_method").notNull(), // 'broadcasting' | 'drip_fertigation' | 'foliar_spray' | 'soil_drenching' | 'seed_treatment'
  appliedDate: text("applied_date").notNull(),
  costIncurred: numeric("cost_incurred").default("0"),
  batchLotNumber: text("batch_lot_number"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 36. No-Till Farming Records (Conservation agriculture, residue mulching & soil disturbance logs)
export const noTillRecords = pgTable("no_till_records", {
  id: text("id").primaryKey(),
  fieldId: text("field_id").references(() => farmFields.id, { onDelete: "cascade" }).notNull(),
  seasonYear: text("season_year").notNull(),
  suitabilityScore: integer("suitability_score").default(85).notNull(), // 0 - 100
  residueType: text("residue_type").notNull(), // 'cotton_stalk_mulch' | 'soybean_stubble' | 'paddy_straw' | 'dhaincha_cover'
  residueCoveragePct: integer("residue_coverage_pct").default(75).notNull(), // % surface covered
  coverCropPlanted: text("cover_crop_planted").default("Sunn hemp (ताग)"),
  soilDisturbanceDepthCm: integer("soil_disturbance_depth_cm").default(0).notNull(), // 0 cm for strict zero-till
  moistureRetentionScore: integer("moisture_retention_score").default(90).notNull(),
  weedSuppressionMethod: text("weed_suppression_method").default("dense_mulch_roller"), // 'dense_mulch_roller' | 'cover_crop_allelopathy' | 'manual_slashing'
  notes: text("notes"),
  recordedDate: text("recorded_date").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 37. Agricultural Knowledge Resources (Educational articles, guides, best practices)
export const agriculturalResources = pgTable("agricultural_resources", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  marathiTitle: text("marathi_title").notNull(),
  category: text("category").notNull(), // 'organic_farming' | 'soil_management' | 'crop_planning' | 'water_conservation' | 'pest_management' | 'no_till_farming' | 'sustainable_agriculture'
  summary: text("summary").notNull(),
  readTimeMinutes: integer("read_time_minutes").default(5).notNull(),
  author: text("author").notNull(),
  pdfGuideUrl: text("pdf_guide_url"),
  contentHtmlOrMarkdown: text("content_html_or_markdown"),
  featured: boolean("featured").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// =========================================================================
// PHASE 6: EQUIPMENT RENTAL AND SERVICE PROVIDER MARKETPLACE
// =========================================================================

// 38. Providers Table (Equipment & Service custom hiring center operators)
export const providers = pgTable("providers", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }).notNull().unique(),
  businessName: text("business_name").notNull(), // e.g. "Mahalaxmi Custom Hiring Center & Drone Fleet"
  providerType: text("provider_type").notNull().default("equipment_and_services"), // 'machinery' | 'services' | 'equipment_and_services'
  contactPerson: text("contact_person").notNull(),
  contactPhone: text("contact_phone").notNull(),
  contactEmail: text("contact_email"),
  district: text("district").notNull(),
  taluka: text("taluka").notNull(),
  baseVillage: text("base_village").notNull(),
  serviceRadiusKm: integer("service_radius_km").default(45).notNull(),
  isVerified: boolean("is_verified").default(true).notNull(),
  rating: numeric("rating").default("4.9"),
  totalBookingsCompleted: integer("total_bookings_completed").default(38),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 39. Provider Profiles Table
export const providerProfiles = pgTable("provider_profiles", {
  id: text("id").primaryKey(),
  providerId: text("provider_id").references(() => providers.id, { onDelete: "cascade" }).notNull().unique(),
  businessLicenseOrGst: text("business_license_or_gst"),
  yearsInOperation: integer("years_in_operation").default(6),
  machineryFleetCount: integer("machinery_fleet_count").default(8),
  trainedOperatorsCount: integer("trained_operators_count").default(5),
  operatingHours: text("operating_hours").default("06:00 AM - 08:00 PM"),
  bankAccountMasked: text("bank_account_masked"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 40. Machinery & Equipment Fleet Master Table
export const equipment = pgTable("equipment", {
  id: text("id").primaryKey(),
  providerId: text("provider_id").references(() => providers.id, { onDelete: "cascade" }).notNull(),
  name: text("name").notNull(), // e.g. "Mahindra 575 DI Sarpanch Tractor (45 HP)"
  category: text("category").notNull(), // 'Tractors' | 'Rotavators' | 'Cultivators' | 'Seed drills' | 'Harvesters' | 'Sprayers' | 'Irrigation equipment' | 'Other farming machinery'
  description: text("description").notNull(),
  manufacturer: text("manufacturer").notNull(),
  modelYear: integer("model_year").default(2024),
  horsepowerOrCapacity: text("horsepower_or_capacity"), // "45 HP", "16 Liters RTK", "7-Tyne"
  hourlyRate: numeric("hourly_rate").notNull(),
  dailyRate: numeric("daily_rate").notNull(),
  locationDistrict: text("location_district").notNull(),
  locationTaluka: text("location_taluka").notNull(),
  locationVillage: text("location_village").notNull(),
  includesOperator: boolean("includes_operator").default(true).notNull(),
  operatingConditions: text("operating_conditions"), // "Diesel included for first 4 hours; Farmer provides clean water for spray"
  minimumBookingDuration: text("minimum_booking_duration").default("2 Hours"),
  primaryImageUrl: text("primary_image_url").notNull(),
  isAvailable: boolean("is_available").default(true).notNull(),
  status: text("status").default("active").notNull(), // 'active' | 'in_use' | 'maintenance' | 'standby'
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 41. Equipment Gallery Images Table
export const equipmentImages = pgTable("equipment_images", {
  id: text("id").primaryKey(),
  equipmentId: text("equipment_id").references(() => equipment.id, { onDelete: "cascade" }).notNull(),
  imageUrl: text("image_url").notNull(),
  caption: text("caption"),
  isPrimary: boolean("is_primary").default(false).notNull(),
  displayOrder: integer("display_order").default(1),
});

// 42. Equipment Availability Calendar Table
export const equipmentAvailability = pgTable("equipment_availability", {
  id: text("id").primaryKey(),
  equipmentId: text("equipment_id").references(() => equipment.id, { onDelete: "cascade" }).notNull(),
  date: text("date").notNull(),
  isBooked: boolean("is_booked").default(false).notNull(),
  status: text("status").default("available").notNull(), // 'available' | 'booked' | 'maintenance' | 'reserved'
  bookingId: text("booking_id"),
});

// 43. Agricultural Services Catalog Table
export const agriculturalServices = pgTable("agricultural_services", {
  id: text("id").primaryKey(),
  providerId: text("provider_id").references(() => providers.id, { onDelete: "cascade" }).notNull(),
  serviceName: text("service_name").notNull(), // e.g. "Professional GPS Soil Sample Collection & Lab Testing", "Drip Automation Installation"
  category: text("category").notNull(), // 'soil_testing' | 'farm_consultation' | 'irrigation_installation' | 'machinery_operators' | 'organic_farming_consultation'
  description: text("description").notNull(),
  priceAmount: numeric("price_amount").notNull(),
  pricingModel: text("pricing_model").notNull(), // 'per_acre' | 'per_sample' | 'per_day' | 'per_visit'
  serviceRadiusKm: integer("service_radius_km").default(40),
  certifiedBadge: text("certified_badge").default("PDKV Certified"),
  rating: numeric("rating").default("4.9"),
  isAvailable: boolean("is_available").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 44. Service Bookings Table
export const serviceBookings = pgTable("service_bookings", {
  id: text("id").primaryKey(),
  serviceId: text("service_id").references(() => agriculturalServices.id, { onDelete: "cascade" }).notNull(),
  providerId: text("provider_id").references(() => providers.id, { onDelete: "cascade" }).notNull(),
  farmerId: text("farmer_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  farmerName: text("farmer_name").notNull(),
  farmerPhone: text("farmer_phone").notNull(),
  scheduledDate: text("scheduled_date").notNull(),
  farmLocation: text("farm_location").notNull(),
  areaAcresOrSamples: numeric("area_acres_or_samples").default("1"),
  totalAmount: numeric("total_amount").notNull(),
  status: text("status").default("requested").notNull(), // 'requested' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
