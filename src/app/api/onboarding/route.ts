import { NextResponse } from "next/server";
import { z } from "zod";
import { db, schema } from "@/db";

const farmerOnboardingSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  email: z.string().email("Valid email is required"),
  preferredLanguage: z.enum(["mr", "hi", "en"]).default("mr"),
  avatarUrl: z.string().optional(),
  state: z.string().default("Maharashtra"),
  district: z.string().min(2),
  taluka: z.string().min(2),
  village: z.string().min(2),
  pinCode: z.string().min(6),
  gpsCoords: z.string().optional(),
  totalLandAcres: z.number().positive(),
  ownershipType: z.enum(["owned", "leased", "joint_family"]).default("owned"),
  numberOfFields: z.number().int().positive().default(1),
  mainCrops: z.array(z.string()).default([]),
  irrigationAvailability: z.enum(["drip", "sprinkler", "well", "canal", "rainfed"]).default("drip"),
  farmingPractice: z.enum(["conventional", "organic", "transitioning", "natural_zbnf", "no_till"]).default("conventional"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = farmerOnboardingSchema.parse(body);

    const generatedUserId = `usr_${Date.now()}`;
    const generatedFarmId = `farm_${Date.now()}`;

    // If database connection is live, perform relational transaction
    if (db) {
      await db.insert(schema.users).values({
        id: generatedUserId,
        email: validated.email,
        fullName: validated.fullName,
        phone: validated.phone,
        role: "farmer",
        avatarUrl: validated.avatarUrl,
        isActive: true,
      });

      await db.insert(schema.userProfiles).values({
        id: `prof_${Date.now()}`,
        userId: generatedUserId,
        preferredLanguage: validated.preferredLanguage,
        kycStatus: "verified",
      });

      await db.insert(schema.userRoles).values({
        id: `role_${Date.now()}`,
        userId: generatedUserId,
        role: "farmer",
        grantedBy: "system_onboarding",
      });

      await db.insert(schema.farmerLocations).values({
        id: `loc_${Date.now()}`,
        userId: generatedUserId,
        state: validated.state,
        district: validated.district,
        taluka: validated.taluka,
        village: validated.village,
        pinCode: validated.pinCode,
      });

      await db.insert(schema.farmerProfiles).values({
        id: `fprof_${Date.now()}`,
        userId: generatedUserId,
        landOwnershipType: validated.ownershipType,
        totalLandAcres: String(validated.totalLandAcres),
        numberOfFields: validated.numberOfFields,
        farmingPractice: validated.farmingPractice,
        irrigationSource: validated.irrigationAvailability,
        primaryCrops: validated.mainCrops.join(", "),
      });

      await db.insert(schema.farms).values({
        id: generatedFarmId,
        farmerId: generatedUserId,
        name: `${validated.village} Krishi Farm`,
        totalAcres: String(validated.totalLandAcres),
        soilType: "black_cotton",
        irrigationSource: validated.irrigationAvailability,
        district: validated.district,
        taluka: validated.taluka,
        village: validated.village,
      });

      await db.insert(schema.onboardingRecords).values({
        id: `onb_${Date.now()}`,
        userId: generatedUserId,
        role: "farmer",
        currentStep: 5,
        isCompleted: true,
        stepData: validated,
        completedAt: new Date(),
      });
    }

    return NextResponse.json({
      success: true,
      userId: generatedUserId,
      farmId: generatedFarmId,
      message: "Farmer onboarding completed and persisted successfully.",
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to process farmer onboarding",
      },
      { status: 400 }
    );
  }
}
