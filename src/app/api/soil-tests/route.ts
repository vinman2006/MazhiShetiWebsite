import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

const SoilTestInputSchema = z.object({
  farmerId: z.string().default("usr_farmer_01"),
  farmId: z.string().default("farm_01"),
  fieldId: z.string().min(1, "Field assignment is required"),
  fieldName: z.string().min(1, "Field name is required"),
  testDate: z.string().min(1, "Test date is required"),
  laboratoryName: z.string().min(1, "Laboratory name is required"),
  sampleCode: z.string().min(1, "Sample code is required"),
  soilTexture: z.string().default("Clay Loam"),
  phLevel: z.number().min(3).max(11),
  electricalConductivity: z.number().min(0).max(10),
  organicCarbonPct: z.number().min(0).max(5),
  nitrogenKgHa: z.number().min(0).max(1000),
  phosphorusKgHa: z.number().min(0).max(500),
  potassiumKgHa: z.number().min(0).max(1000),
  sulfurPpm: z.number().optional().default(15),
  zincPpm: z.number().optional().default(1.0),
  ironPpm: z.number().optional().default(4.5),
  recommendations: z.string().optional().default("Standard agronomic management recommended."),
  testedByTechnician: z.string().optional().default("Certified Lab Analyst"),
  documentName: z.string().optional().default("Soil_Test_Report.pdf"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = SoilTestInputSchema.parse(body);

    // Calculate overall health score dynamically based on agronomic thresholds
    let score = 70;
    if (validated.phLevel >= 6.5 && validated.phLevel <= 7.8) score += 10;
    if (validated.organicCarbonPct >= 0.75) score += 10;
    if (validated.nitrogenKgHa >= 280) score += 5;
    if (validated.phosphorusKgHa >= 15 && validated.phosphorusKgHa <= 25) score += 5;
    if (validated.electricalConductivity <= 1.0) score += 5;
    const finalScore = Math.min(100, score);

    const newTest = {
      id: `stl_${Date.now()}`,
      ...validated,
      overallHealthScore: finalScore,
      status: "verified" as const,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      message: "Soil test report successfully logged.",
      test: newTest,
    });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: err.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: err.message || "Failed to save soil test" },
      { status: 500 }
    );
  }
}
