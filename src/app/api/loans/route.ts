import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { initialSeedData } from "@/db/seed-data";

const LoanApplicationSchema = z.object({
  farmerId: z.string().default("usr_farmer_01"),
  farmerName: z.string().min(2, "Farmer name is required"),
  farmerPhone: z.string().min(10, "Valid phone number is required"),
  productId: z.string().min(1, "Product ID is required"),
  productName: z.string().min(2, "Product name is required"),
  institutionId: z.string().min(1, "Institution ID is required"),
  institutionName: z.string().min(2, "Institution name is required"),
  category: z.string().default("crop_loan"),
  requestedAmount: z.number().positive("Requested amount must be greater than zero"),
  tenureMonths: z.number().int().positive("Tenure must be valid"),
  interestRatePct: z.number().nonnegative(),
  farmAreaAcres: z.number().positive("Farm area is required"),
  cropCycleOrPurpose: z.string().min(3, "Purpose or crop cycle is required"),
  digitalConsentGranted: z.boolean().refine((val) => val === true, {
    message: "Mandatory digital consent required for credit bureau check and land record audit.",
  }),
  documents: z.array(
    z.object({
      documentType: z.enum([
        "7_12_extract",
        "8a_holding_certificate",
        "aadhaar_card",
        "pan_card",
        "bank_passbook",
        "soil_health_card",
        "machinery_quotation",
        "crop_sowing_declaration",
      ]),
      documentName: z.string().min(2),
      fileUrl: z.string().min(2),
    })
  ).default([]),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const institutionId = searchParams.get("institutionId");

    let products = initialSeedData.financialProducts || [];

    if (category && category !== "all") {
      products = products.filter((p) => p.category === category);
    }
    if (institutionId && institutionId !== "all") {
      products = products.filter((p) => p.institutionId === institutionId);
    }

    return NextResponse.json({
      success: true,
      count: products.length,
      institutions: initialSeedData.financialInstitutions,
      data: products,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to fetch loan programs" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = LoanApplicationSchema.parse(body);

    const applicationId = `app_${Date.now()}`;
    const consentId = `con_${Date.now()}`;

    const newApplication = {
      id: applicationId,
      farmerId: validated.farmerId,
      farmerName: validated.farmerName,
      farmerPhone: validated.farmerPhone,
      productId: validated.productId,
      productName: validated.productName,
      institutionId: validated.institutionId,
      institutionName: validated.institutionName,
      category: validated.category,
      requestedAmount: validated.requestedAmount,
      tenureMonths: validated.tenureMonths,
      interestRatePct: validated.interestRatePct,
      farmAreaAcres: validated.farmAreaAcres,
      cropCycleOrPurpose: validated.cropCycleOrPurpose,
      status: "submitted" as const,
      consentId: consentId,
      documents: validated.documents.map((doc, idx) => ({
        id: `doc_${Date.now()}_${idx}`,
        ...doc,
        verificationStatus: "uploaded" as const,
      })),
      appliedDate: new Date().toISOString().substring(0, 10),
      updatedAt: new Date().toISOString().substring(0, 10),
    };

    return NextResponse.json({
      success: true,
      message: `Provisional application #${applicationId} submitted to ${validated.institutionName}. Assigned for document audit and credit underwriting.`,
      application: newApplication,
      consentLogged: true,
    });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: err.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: err.message || "Failed to submit loan application" },
      { status: 500 }
    );
  }
}

