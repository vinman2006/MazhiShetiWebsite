import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { initialSeedData } from "@/db/seed-data";

const EquipmentSchema = z.object({
  providerId: z.string().default("usr_provider_01"),
  providerName: z.string().default("Mahalaxmi Custom Hiring Center"),
  providerPhone: z.string().default("+91 98230 77123"),
  title: z.string().min(2, "Equipment title is required"),
  category: z.enum([
    "Tractors",
    "Rotavators",
    "Cultivators",
    "Seed drills",
    "Harvesters",
    "Sprayers",
    "Irrigation equipment",
    "Other farming machinery",
  ]),
  description: z.string().min(5, "Description is required"),
  manufacturer: z.string().min(2, "Manufacturer is required"),
  modelNumber: z.string().optional().default("Standard"),
  horsepowerOrCapacity: z.string().optional().default("45 HP"),
  hourlyRate: z.number().min(50, "Hourly rate must be realistic"),
  dailyRate: z.number().min(300, "Daily rate must be realistic"),
  location: z.string().min(2, "Location is required"),
  locationDistrict: z.string().default("Wardha"),
  locationTaluka: z.string().default("Ashti"),
  includesOperator: z.boolean().default(true),
  operatingConditions: z.string().optional().default("Certified operator included"),
  minimumRentalDuration: z.string().default("2 Hours"),
  imageUrl: z.string().default("https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?auto=format&fit=crop&q=80&w=600"),
  specs: z.string().optional().default("Certified Machinery Unit"),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const district = searchParams.get("district");
    const available = searchParams.get("available");

    let listings = initialSeedData.equipment || [];

    if (category && category !== "All") {
      listings = listings.filter((item) => item.category === category);
    }
    if (district && district !== "All") {
      listings = listings.filter((item) => item.locationDistrict.toLowerCase() === district.toLowerCase());
    }
    if (available === "true") {
      listings = listings.filter((item) => item.isAvailable);
    }

    return NextResponse.json({
      success: true,
      count: listings.length,
      data: listings,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to fetch rental equipment" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = EquipmentSchema.parse(body);

    const newMachine = {
      id: `equip_${Date.now()}`,
      ...validated,
      isAvailable: true,
      rating: 4.8,
      status: "active" as const,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      message: `Equipment ${validated.title} registered successfully in custom hiring fleet.`,
      equipment: newMachine,
    });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: err.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: err.message || "Failed to create equipment listing" },
      { status: 500 }
    );
  }
}
