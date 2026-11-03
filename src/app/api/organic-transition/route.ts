import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

const OrganicTransitionInputSchema = z.object({
  farmerId: z.string().default("usr_farmer_01"),
  farmId: z.string().default("farm_01"),
  fieldId: z.string().min(1, "Field selection is required"),
  fieldName: z.string().min(1, "Field name is required"),
  programId: z.string().default("org_prog_01"),
  programName: z.string().default("NPOP National Organic Program"),
  baselineChemicalNpkKg: z.number().min(0).default(150),
  baselinePesticidesLiters: z.number().min(0).default(2.5),
  transitionGoals: z.string().optional().default("100% synthetic elimination and NPOP compliance"),
  inspectorAgency: z.string().optional().default("Accredited Certification Agency"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = OrganicTransitionInputSchema.parse(body);

    const now = new Date();
    const registrationDate = now.toISOString().split("T")[0];

    // Standard 36 months conversion timeline
    const targetDate = new Date(now.setMonth(now.getMonth() + 36))
      .toISOString()
      .split("T")[0];

    // Strict rule: Never auto-certify upon registration
    const newTransition = {
      id: `tr_${Date.now()}`,
      farmerId: validated.farmerId,
      farmId: validated.farmId,
      fieldId: validated.fieldId,
      fieldName: validated.fieldName,
      programId: validated.programId,
      programName: validated.programName,
      registrationDate,
      targetCertificationDate: targetDate,
      currentStage: "initial_assessment" as const,
      conversionStatus: "in_conversion_c1" as const, // Year 1 of 3
      progressPct: 15,
      inspectorAgency: validated.inspectorAgency,
      auditNotes: "Initial farm baseline assessment registered. Commenced documented transition buffer period.",
      baselineChemicalNpkKg: validated.baselineChemicalNpkKg,
      currentChemicalNpkKg: 0,
      isCertified: false, // Strict: requires accredited audit verification after 36 months
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      message: `Field ${validated.fieldName} enrolled in ${validated.programName}. Conversion Stage 1 (C1) initiated.`,
      transition: newTransition,
    });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: err.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: err.message || "Failed to register organic transition" },
      { status: 500 }
    );
  }
}
