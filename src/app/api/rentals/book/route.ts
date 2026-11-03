import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

const BookingInputSchema = z.object({
  equipmentId: z.string().min(1, "Equipment selection required"),
  equipmentName: z.string().min(1, "Equipment name required"),
  equipmentCategory: z.string().default("Tractors"),
  providerId: z.string().default("usr_provider_01"),
  providerName: z.string().default("Mahalaxmi Custom Hiring Center"),
  farmerId: z.string().default("usr_farmer_01"),
  farmerName: z.string().default("Rameshwar Sadashiv Shinde"),
  farmerPhone: z.string().default("+91 98223 41092"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  duration: z.number().min(1, "Duration must be at least 1"),
  durationUnit: z.enum(["hours", "days"]).default("days"),
  rateType: z.enum(["hourly", "daily"]).default("daily"),
  rateAmount: z.number().min(1),
  farmLocation: z.string().min(2, "Farm location is required"),
  operatorIncluded: z.boolean().default(true),
  notes: z.string().optional(),
});

const BookingStatusUpdateSchema = z.object({
  bookingId: z.string().min(1),
  status: z.enum(["requested", "confirmed", "dispatched", "completed", "cancelled", "rejected"]),
  reason: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = BookingInputSchema.parse(body);

    const totalAmount = validated.duration * validated.rateAmount;

    const newBooking = {
      id: `book_${Date.now()}`,
      ...validated,
      totalAmount,
      status: "requested" as const,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      message: `Booking request for ${validated.equipmentName} submitted. Provider notified.`,
      booking: newBooking,
    });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: err.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: err.message || "Failed to submit booking" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = BookingStatusUpdateSchema.parse(body);

    return NextResponse.json({
      success: true,
      message: `Booking ${validated.bookingId} status updated to ${validated.status}.`,
      bookingId: validated.bookingId,
      status: validated.status,
      updatedAt: new Date().toISOString(),
    });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: err.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: err.message || "Failed to update booking status" },
      { status: 500 }
    );
  }
}

