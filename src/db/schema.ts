import { pgTable, text, timestamp, numeric, integer, boolean } from "drizzle-orm/pg-core";

// 1. Users Table with Role-Based Access Control
export const users = pgTable("users", {
  id: text("id").primaryKey(),
  clerkId: text("clerk_id").unique(),
  email: text("email").notNull(),
  fullName: text("full_name").notNull(),
  phone: text("phone"),
  role: text("role").notNull().default("farmer"), // 'farmer' | 'expert' | 'provider' | 'buyer' | 'banker' | 'admin'
  language: text("language").default("mr"), // 'mr' | 'hi' | 'en'
  state: text("state").default("Maharashtra"),
  district: text("district"),
  taluka: text("taluka"),
  village: text("village"),
  avatarUrl: text("avatar_url"),
  organizationName: text("organization_name"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 2. Farms Table
export const farms = pgTable("farms", {
  id: text("id").primaryKey(),
  farmerId: text("farmer_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  name: text("name").notNull(),
  totalAcres: numeric("total_acres").notNull(),
  surveyNumber: text("survey_number"),
  soilType: text("soil_type").notNull(), // 'black_cotton' | 'red_loam' | 'alluvial' | 'laterite'
  irrigationSource: text("irrigation_source").notNull(), // 'drip' | 'sprinkler' | 'well' | 'canal' | 'rainfed'
  waterAvailability: text("water_availability").default("Adequate"),
  state: text("state").default("Maharashtra"),
  district: text("district").notNull(),
  taluka: text("taluka").notNull(),
  village: text("village").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 3. Farm Plots (Sub-divisions for crop rotation & sensor zones)
export const plots = pgTable("plots", {
  id: text("id").primaryKey(),
  farmId: text("farm_id").references(() => farms.id, { onDelete: "cascade" }).notNull(),
  name: text("name").notNull(),
  areaAcres: numeric("area_acres").notNull(),
  currentCrop: text("current_crop").notNull(),
  cropVariety: text("crop_variety"),
  sowingDate: text("sowing_date").notNull(),
  expectedHarvestDate: text("expected_harvest_date").notNull(),
  growthStage: text("growth_stage").notNull(), // 'Sowing' | 'Vegetative' | 'Flowering' | 'Maturity' | 'Harvesting'
  healthScore: integer("health_score").default(88), // 0-100
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 4. Smart Soil Sensors (Hardware integration)
export const soilSensors = pgTable("soil_sensors", {
  id: text("id").primaryKey(),
  plotId: text("plot_id").references(() => plots.id, { onDelete: "set null" }),
  serialNumber: text("serial_number").unique().notNull(),
  model: text("model").default("Mazhi Sheti Sensor v2.4 Pro"),
  status: text("status").default("active"), // 'active' | 'standby' | 'offline'
  batteryPct: integer("battery_pct").default(94),
  signalStrengthDbm: integer("signal_strength_dbm").default(-68),
  installDepthCm: integer("install_depth_cm").default(25),
  firmwareVersion: text("firmware_version").default("v2.4.1"),
  lastSyncAt: timestamp("last_sync_at").defaultNow().notNull(),
});

// 5. IoT Soil Telemetry Readings (Moisture, NPK, pH, Temp, EC)
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

// 6. Agronomist / Expert Consultations
export const consultations = pgTable("consultations", {
  id: text("id").primaryKey(),
  farmerId: text("farmer_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  expertId: text("expert_id").references(() => users.id, { onDelete: "set null" }),
  plotId: text("plot_id").references(() => plots.id, { onDelete: "set null" }),
  cropName: text("crop_name").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  urgency: text("urgency").default("medium"), // 'low' | 'medium' | 'high' | 'critical'
  status: text("status").default("pending"), // 'pending' | 'diagnosed' | 'completed'
  expertDiagnosis: text("expert_diagnosis"),
  prescribedTreatment: text("prescribed_treatment"),
  dosageGuide: text("dosage_guide"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  resolvedAt: timestamp("resolved_at"),
});

// 7. Produce Marketplace Listings (Direct Farm-to-Table / Mandi)
export const marketplaceListings = pgTable("marketplace_listings", {
  id: text("id").primaryKey(),
  sellerId: text("seller_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  crop: text("crop").notNull(),
  variety: text("variety").notNull(),
  grade: text("grade").notNull(), // 'Grade A - Export' | 'Grade B - Mandi' | 'Organic Certified'
  quantityAvailableKg: numeric("quantity_available_kg").notNull(),
  pricePerKg: numeric("price_per_kg").notNull(),
  mandiBenchmarkPrice: numeric("mandi_benchmark_price"),
  harvestDate: text("harvest_date").notNull(),
  location: text("location").notNull(),
  status: text("status").default("active"), // 'active' | 'in_negotiation' | 'sold'
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 8. Produce Marketplace Orders / Bids
export const marketplaceOrders = pgTable("marketplace_orders", {
  id: text("id").primaryKey(),
  listingId: text("listing_id").references(() => marketplaceListings.id, { onDelete: "cascade" }).notNull(),
  buyerId: text("buyer_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  quantityKg: numeric("quantity_kg").notNull(),
  offeredPricePerKg: numeric("offered_price_per_kg").notNull(),
  totalAmount: numeric("total_amount").notNull(),
  status: text("status").default("placed"), // 'placed' | 'accepted' | 'in_transit' | 'delivered' | 'cancelled'
  deliveryAddress: text("delivery_address").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 9. Agri-Equipment & Machinery Fleet
export const equipmentListings = pgTable("equipment_listings", {
  id: text("id").primaryKey(),
  providerId: text("provider_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  title: text("title").notNull(),
  category: text("category").notNull(), // 'Tractor' | 'Harvester' | 'Drone Sprayer' | 'Laser Leveler' | 'Rotavator'
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

// 10. Machinery Rental Bookings
export const rentalBookings = pgTable("rental_bookings", {
  id: text("id").primaryKey(),
  equipmentId: text("equipment_id").references(() => equipmentListings.id, { onDelete: "cascade" }).notNull(),
  farmerId: text("farmer_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  startDate: text("start_date").notNull(),
  endDate: text("end_date").notNull(),
  totalHoursOrDays: integer("total_hours_or_days").notNull(),
  rateType: text("rate_type").default("daily"), // 'hourly' | 'daily'
  totalAmount: numeric("total_amount").notNull(),
  status: text("status").default("requested"), // 'requested' | 'confirmed' | 'active' | 'completed' | 'declined'
  farmLocation: text("farm_location").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 11. Agricultural Finance & Crop Insurance Applications
export const financialApplications = pgTable("financial_applications", {
  id: text("id").primaryKey(),
  farmerId: text("farmer_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  bankId: text("bank_id").references(() => users.id, { onDelete: "set null" }),
  applicationType: text("application_type").notNull(), // 'Kisan Credit Card (KCC)' | 'Solar Water Pump (PM-KUSUM)' | 'Tractor Loan' | 'Crop Insurance (PMFBY)'
  schemeName: text("scheme_name").notNull(),
  requestedAmount: numeric("requested_amount").notNull(),
  sanctionedAmount: numeric("sanctioned_amount"),
  tenureMonths: integer("tenure_months").default(12),
  interestRatePct: numeric("interest_rate_pct").default("4.0"),
  farmAreaAcres: numeric("farm_area_acres").notNull(),
  status: text("status").default("submitted"), // 'submitted' | 'under_scrutiny' | 'approved' | 'disbursed' | 'rejected'
  bankNotes: text("bank_notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 12. System Audit & Compliance Logs
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
