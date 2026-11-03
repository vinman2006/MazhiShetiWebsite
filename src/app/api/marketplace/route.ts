import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { initialSeedData } from "@/db/seed-data";

const ProduceListingSchema = z.object({
  sellerId: z.string().default("usr_farmer_01"),
  farmerName: z.string().min(2, "Farmer name is required"),
  farmerPhone: z.string().min(10, "Valid phone number is required"),
  cropName: z.string().min(2, "Crop name is required"),
  variety: z.string().min(2, "Variety is required"),
  category: z.enum([
    "grains",
    "pulses",
    "oilseeds",
    "vegetables",
    "fruits",
    "spices",
    "cotton_fiber",
    "organic",
  ]),
  quantity: z.number().positive("Quantity must be greater than zero"),
  unit: z.enum(["Quintals", "Kg", "Tons", "Crates", "Bags"]).default("Quintals"),
  pricePerUnit: z.number().positive("Price must be greater than zero"),
  mandiBenchmarkPrice: z.number().optional(),
  minimumOrderQuantity: z.number().positive().default(1),
  qualityGrade: z.enum([
    "Grade A+ (Premium Export)",
    "Grade A (Export Ready)",
    "Grade A (Commercial)",
    "Grade B (Standard)",
    "Organic Certified",
  ]).default("Grade A (Commercial)"),
  harvestDate: z.string().min(4, "Harvest date is required"),
  storageCondition: z.string().default("Ventilated dry farm warehouse"),
  description: z.string().min(5, "Description is required"),
  locationDistrict: z.string().min(2, "District is required"),
  locationTaluka: z.string().min(2, "Taluka is required"),
  locationVillage: z.string().min(2, "Village is required"),
  farmGateAddress: z.string().min(5, "Farm gate pickup address is required"),
  primaryImageUrl: z.string().default("https://images.unsplash.com/photo-1599818816946-b3cd8ae243d0?auto=format&fit=crop&q=80&w=600"),
  isOrganicCertified: z.boolean().default(false),
  availabilityStatus: z.enum(["available", "under_negotiation", "sold_out", "in_harvest"]).default("available"),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const district = searchParams.get("district");
    const search = searchParams.get("search")?.toLowerCase();
    const organicOnly = searchParams.get("organic") === "true";
    const minPrice = searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : null;
    const maxPrice = searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : null;

    let listings = initialSeedData.produceListings || [];

    if (category && category !== "all") {
      listings = listings.filter((item) => item.category === category);
    }
    if (district && district !== "all") {
      listings = listings.filter((item) => item.locationDistrict.toLowerCase() === district.toLowerCase());
    }
    if (organicOnly) {
      listings = listings.filter((item) => item.isOrganicCertified);
    }
    if (minPrice !== null && !isNaN(minPrice)) {
      listings = listings.filter((item) => item.pricePerUnit >= minPrice);
    }
    if (maxPrice !== null && !isNaN(maxPrice)) {
      listings = listings.filter((item) => item.pricePerUnit <= maxPrice);
    }
    if (search) {
      listings = listings.filter(
        (item) =>
          item.cropName.toLowerCase().includes(search) ||
          item.variety.toLowerCase().includes(search) ||
          item.farmerName.toLowerCase().includes(search) ||
          item.locationVillage.toLowerCase().includes(search)
      );
    }

    return NextResponse.json({
      success: true,
      count: listings.length,
      data: listings,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to fetch produce listings" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = ProduceListingSchema.parse(body);

    const newListing = {
      id: `prod_${Date.now()}`,
      ...validated,
      viewsCount: 1,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      message: `Produce lot for ${validated.cropName} (${validated.variety}) listed successfully on Wholesale Mandi!`,
      listing: newListing,
    });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: err.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: err.message || "Failed to create produce listing" },
      { status: 500 }
    );
  }
}

