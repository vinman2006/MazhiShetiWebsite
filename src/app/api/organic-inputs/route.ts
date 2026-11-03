import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

const InputApplicationSchema = z.object({
  fieldId: z.string().min(1, "Field selection is required"),
  fieldName: z.string().min(1, "Field name is required"),
  organicInputId: z.string().optional(),
  inputName: z.string().min(1, "Input name is required"),
  category: z.string().default("biofertilizer"),
  quantity: z.number().min(0.1, "Quantity must be greater than zero"),
  unit: z.enum(["kg", "liters", "tonnes", "bags"]).default("liters"),
  applicationMethod: z.enum([
    "broadcasting",
    "drip_fertigation",
    "foliar_spray",
    "soil_drenching",
    "seed_treatment",
  ]),
  appliedDate: z.string().default(() => new Date().toISOString().split("T")[0]),
  costIncurred: z.number().default(0),
  batchLotNumber: z.string().optional(),
  notes: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = InputApplicationSchema.parse(body);

    const newApplication = {
      id: `ia_${Date.now()}`,
      ...validated,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      message: `Organic input ${validated.inputName} logged for field ${validated.fieldName}.`,
      application: newApplication,
    });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: err.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: err.message || "Failed to log input application" },
      { status: 500 }
    );
  }
}

