import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { initialSeedData } from "@/db/seed-data";

const ExpenseSchema = z.object({
  farmerId: z.string().default("usr_farmer_01"),
  farmId: z.string().optional(),
  fieldId: z.string().optional(),
  cropCycleId: z.string().optional(),
  cropName: z.string().min(1, "Crop name is required"),
  categoryCode: z.enum([
    "seeds",
    "fertilizers",
    "labour",
    "equipment_rental",
    "irrigation",
    "transportation",
    "pest_control",
    "other",
  ]),
  expenseDate: z.string().min(1, "Date is required"),
  amount: z.number().positive("Amount must be greater than zero"),
  quantity: z.number().optional(),
  unit: z.string().optional(),
  unitCost: z.number().optional(),
  vendorName: z.string().optional(),
  receiptDocUrl: z.string().optional(),
  paymentMode: z.enum(["cash", "upi", "bank_transfer", "kcc_loan"]).default("cash"),
  notes: z.string().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const farmerId = searchParams.get("farmerId") || "usr_farmer_01";
    const category = searchParams.get("category");
    const crop = searchParams.get("crop");

    let list = (initialSeedData.farmExpenses || []).filter((e) => e.farmerId === farmerId);

    if (category) {
      list = list.filter((e) => e.categoryCode === category);
    }
    if (crop) {
      list = list.filter((e) => e.cropName.toLowerCase().includes(crop.toLowerCase()));
    }

    const totalAmount = list.reduce((sum, e) => sum + Number(e.amount), 0);

    return NextResponse.json({
      success: true,
      totalExpensesCount: list.length,
      totalAmount,
      categories: initialSeedData.expenseCategories,
      expenses: list,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to fetch expenses" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = ExpenseSchema.parse(body);

    const newExpense = {
      id: `exp_${Date.now()}`,
      ...validated,
      createdAt: new Date().toISOString().replace("T", " ").substring(0, 16),
    };

    return NextResponse.json({
      success: true,
      message: "Farm expense recorded successfully",
      expense: newExpense,
    });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: err.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: err.message || "Failed to record expense" },
      { status: 500 }
    );
  }
}

