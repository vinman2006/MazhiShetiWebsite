import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

const LoanReviewSchema = z.object({
  applicationId: z.string().min(1, "Application ID is required"),
  reviewerId: z.string().default("usr_banker_01"),
  reviewerName: z.string().default("Sunil Deshmukh (Lead Agri Credit Officer)"),
  status: z.enum([
    "submitted",
    "under_scrutiny",
    "documents_verified",
    "field_inspection_scheduled",
    "credit_approved",
    "disbursed",
    "rejected",
    "additional_info_requested",
  ]),
  sanctionedAmount: z.number().optional(),
  cibilOrCreditScore: z.number().int().min(300).max(900).optional(),
  landValuationRupees: z.number().positive().optional(),
  cropRiskAssessment: z.enum(["low_risk_irrigated", "moderate_risk_rainfed", "high_risk_drought_prone"]).default("low_risk_irrigated"),
  fieldVisitCompleted: z.boolean().default(false),
  internalAppraisalNotes: z.string().min(5, "Review notes are required"),
  rejectionReason: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = LoanReviewSchema.parse(body);

    // Institutional Verification Rule Enforcement:
    if (validated.status === "credit_approved" && !validated.sanctionedAmount) {
      return NextResponse.json(
        {
          success: false,
          error: "Credit approval requires an explicit sanctioned amount verified by the bank credit committee.",
        },
        { status: 400 }
      );
    }

    const reviewDossier = {
      id: `rev_${Date.now()}`,
      applicationId: validated.applicationId,
      reviewerId: validated.reviewerId,
      reviewerName: validated.reviewerName,
      cibilOrCreditScore: validated.cibilOrCreditScore || 740,
      landValuationRupees: validated.landValuationRupees || 2500000,
      cropRiskAssessment: validated.cropRiskAssessment,
      fieldVisitCompleted: validated.fieldVisitCompleted,
      internalAppraisalNotes: validated.internalAppraisalNotes,
      status: validated.status,
      sanctionedAmount: validated.sanctionedAmount,
      rejectionReason: validated.rejectionReason,
      decisionDate: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      message: `Credit appraisal recorded for Application #${validated.applicationId}. Status updated to "${validated.status}".`,
      review: reviewDossier,
    });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: err.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: err.message || "Failed to record loan review" },
      { status: 500 }
    );
  }
}

