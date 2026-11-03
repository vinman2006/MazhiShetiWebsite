import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { initialSeedData } from "@/db/seed-data";

const PurchaseOrderSchema = z.object({
  listingId: z.string().min(1, "Listing ID is required"),
  farmerId: z.string().default("usr_farmer_01"),
  farmerName: z.string().min(2, "Farmer name is required"),
  farmerPhone: z.string().min(10, "Farmer phone is required"),
  buyerId: z.string().default("usr_buyer_01"),
  buyerName: z.string().min(2, "Buyer name is required"),
  buyerPhone: z.string().min(10, "Buyer phone is required"),
  cropName: z.string().min(2, "Crop name is required"),
  variety: z.string().min(2, "Variety is required"),
  orderQuantity: z.number().positive("Quantity must be greater than zero"),
  unit: z.string().default("Quintals"),
  unitPrice: z.number().positive("Unit price is required"),
  deliveryMethod: z.enum([
    "farm_gate_pickup",
    "buyer_logistics",
    "fpo_consolidated",
    "express_cold_chain",
  ]).default("farm_gate_pickup"),
  deliveryAddress: z.string().min(5, "Delivery address is required"),
  scheduledDeliveryDate: z.string().min(4, "Delivery date is required"),
  specialInstructions: z.string().optional(),
});

const StatusUpdateSchema = z.object({
  orderId: z.string().min(1, "Order ID is required"),
  status: z.enum([
    "requested",
    "confirmed",
    "processing",
    "dispatched",
    "in_transit",
    "delivered",
    "completed",
    "cancelled",
    "rejected",
  ]),
  notes: z.string().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const farmerId = searchParams.get("farmerId");
    const buyerId = searchParams.get("buyerId");

    let orders = initialSeedData.purchaseOrders || [];

    if (farmerId) {
      orders = orders.filter((o) => o.farmerId === farmerId);
    }
    if (buyerId) {
      orders = orders.filter((o) => o.buyerId === buyerId);
    }

    return NextResponse.json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to fetch purchase orders" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = PurchaseOrderSchema.parse(body);

    const totalAmount = Math.round(validated.orderQuantity * validated.unitPrice);

    const newOrder = {
      id: `po_${Date.now()}`,
      ...validated,
      totalAmount,
      orderStatus: "requested" as const,
      paymentStatus: "pending" as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      message: `Purchase order #${newOrder.id} placed for ${validated.orderQuantity} ${validated.unit} of ${validated.cropName}. Total: ₹${totalAmount.toLocaleString("en-IN")}.`,
      order: newOrder,
    });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: err.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: err.message || "Failed to place purchase order" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, status, notes } = StatusUpdateSchema.parse(body);

    return NextResponse.json({
      success: true,
      message: `Order #${orderId} status transitioned to "${status}".`,
      orderId,
      status,
      notes,
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
      { success: false, error: err.message || "Failed to update order status" },
      { status: 500 }
    );
  }
}

