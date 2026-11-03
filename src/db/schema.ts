import { pgTable, text, timestamp, numeric, integer, boolean, jsonb } from "drizzle-orm/pg-core";

// 1. Users Table (Core identity linked with Clerk user ID)
export const users = pgTable("users", {
  id: text("id").primaryKey(),
  clerkId: text("clerk_id").unique(),
  email: text("email").notNull(),
  fullName: text("full_name").notNull(),
  phone: text("phone"),
  role: text("role").notNull().default("farmer"), // 'farmer' | 'equipment_provider' | 'service_provider' | 'buyer' | 'expert' | 'banker' | 'admin'
  avatarUrl: text("avatar_url"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 2. User Profiles Table (General profile details)
export const userProfiles = pgTable("user_profiles", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }).notNull().unique(),
  bio: text("bio"),
  preferredLanguage: text("preferred_language").default("mr").notNull(), // 'mr' | 'hi' | 'en'
  nationalIdMasked: text("national_id_masked"), // e.g. Aadhar ending in 4109
  kycStatus: text("kyc_status").default("pending").notNull(), // 'pending' | 'verified' | 'rejected'
  organizationName: text("organization_name"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 3. User Roles Table (Role assignment and audit)
export const userRoles = pgTable("user_roles", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  role: text("role").notNull(), // 'farmer' | 'equipment_provider' | 'service_provider' | 'buyer' | 'expert' | 'banker' | 'admin'
  grantedAt: timestamp("granted_at").defaultNow().notNull(),
  grantedBy: text("granted_by").default("system").notNull(),
});

// 4. Farmer Profiles Table (Specialized agricultural attributes)
export const farmerProfiles = pgTable("farmer_profiles", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }).notNull().unique(),
  landOwnershipType: text("land_ownership_type").notNull().default("owned"), // 'owned' | 'leased' | 'joint_family'
  totalLandAcres: numeric("total_land_acres").notNull().default("0"),
  numberOfFields: integer("number_of_fields").notNull().default(1),
  farmingPractice: text("farming_practice").notNull().default("conventional"), // 'conventional' | 'organic' | 'transitioning' | 'natural_zbnf' | 'no_till'
  irrigationSource: text("irrigation_source").notNull().default("drip"), // 'drip' | 'sprinkler' | 'well' | 'canal' | 'rainfed'
  primaryCrops: text("primary_crops").default("Cotton, Soybean"),
  experienceYears: integer("experience_years").default(10),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 5. Farmer Locations Table (Detailed geolocation & postal records)
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

// 6. Farms Table (Physical agricultural properties)
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
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 7. Onboarding Records Table (Multi-step state persistence)
export const onboardingRecords = pgTable("onboarding_records", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }).notNull().unique(),
  role: text("role").notNull(),
  currentStep: integer("current_step").default(1).notNull(), // 1, 2, 3, 4, 5
  isCompleted: boolean("is_completed").default(false).notNull(),
  stepData: jsonb("step_data").notNull(), // Stores step 1-4 draft payload
  completedAt: timestamp("completed_at"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 8. Farm Plots
export const plots = pgTable("plots", {
  id: text("id").primaryKey(),
  farmId: text("farm_id").references(() => farms.id, { onDelete: "cascade" }).notNull(),
  name: text("name").notNull(),
  areaAcres: numeric("area_acres").notNull(),
  currentCrop: text("current_crop").notNull(),
  cropVariety: text("crop_variety"),
  sowingDate: text("sowing_date").notNull(),
  expectedHarvestDate: text("expected_harvest_date").notNull(),
  growthStage: text("growth_stage").notNull(),
  healthScore: integer("health_score").default(88),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 9. Smart Soil Sensors
export const soilSensors = pgTable("soil_sensors", {
  id: text("id").primaryKey(),
  plotId: text("plot_id").references(() => plots.id, { onDelete: "set null" }),
  serialNumber: text("serial_number").unique().notNull(),
  model: text("model").default("Mazhi Sheti Sensor v2.4 Pro"),
  status: text("status").default("active"),
  batteryPct: integer("battery_pct").default(94),
  signalStrengthDbm: integer("signal_strength_dbm").default(-68),
  installDepthCm: integer("install_depth_cm").default(25),
  firmwareVersion: text("firmware_version").default("v2.4.1"),
  lastSyncAt: timestamp("last_sync_at").defaultNow().notNull(),
});

// 10. IoT Soil Telemetry Readings
export const soilTelemetry = pgTable("soil_telemetry", {
  id: text("id").primaryKey(),
  sensorId: text("sensor_id").references(() => soilSensors.id, { onDelete: "cascade" }).notNull(),
  plotId: text("plot_id").references(() => plots.id, { onDelete: "cascade" }).notNull(),
  moisturePct: numeric("moisture_pct").notNull(),
  nitrogenPpm: numeric("nitrogen_ppm").notNull(),
  phosphorusPpm: numeric("phosphorus_ppm").notNull(),
  potassiumPpm: numeric("potassium_ppm").notNull(),
  temperatureC: numeric("temperature_c").notNull(),
  phLevel: numeric("ph_level").notNull(),
  ecMsCm: numeric("ec_ms_cm").notNull(),
  recordedAt: timestamp("recorded_at").defaultNow().notNull(),
});

// 11. Consultations
export const consultations = pgTable("consultations", {
  id: text("id").primaryKey(),
  farmerId: text("farmer_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  expertId: text("expert_id").references(() => users.id, { onDelete: "set null" }),
  plotId: text("plot_id").references(() => plots.id, { onDelete: "set null" }),
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

// 12. Produce Marketplace Listings
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

// 13. Produce Marketplace Orders
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

// 14. Agri-Equipment Listings
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

// 15. Machinery Rental Bookings
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

// 16. Financial Applications
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

// 17. System Audit Logs
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
