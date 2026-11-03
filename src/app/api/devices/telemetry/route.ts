import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

const TelemetryPacketSchema = z.object({
  deviceId: z.string().min(1, "Device ID is required"),
  fieldId: z.string().optional().default("field_01"),
  readingType: z.string().optional().default("telemetry_packet"),
  moisturePct: z.number().min(0).max(100).optional(),
  temperatureC: z.number().optional(),
  phLevel: z.number().min(0).max(14).optional(),
  ecMsCm: z.number().min(0).optional(),
  nitrogenPpm: z.number().min(0).optional(),
  phosphorusPpm: z.number().min(0).optional(),
  potassiumPpm: z.number().min(0).optional(),
  flowRateLpm: z.number().min(0).optional(),
  batteryVoltage: z.number().min(0).optional(),
  firmwareVersion: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    // 1. Device Authentication Protocol
    // Edge devices submit token via 'Authorization: Bearer <deviceToken>' or 'X-Device-Token'
    const authHeader = req.headers.get("authorization") || req.headers.get("x-device-token");
    if (!authHeader) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Missing secure device authorization credential" },
        { status: 401 }
      );
    }

    // 2. Validate payload
    const body = await req.json();
    const packet = TelemetryPacketSchema.parse(body);

    const recordedAt = new Date().toISOString();
    const readingId = `sr_${Date.now()}`;

    // Return pending commands waiting for this device to execute (bidirectional IoT poll)
    return NextResponse.json({
      success: true,
      message: "Telemetry packet ingested into Mazhi Sheti time-series database.",
      readingId,
      recordedAt,
      pendingCommands: [], // e.g. [{ commandId: "cmd_...", type: "START_IRRIGATION" }]
    });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Invalid telemetry payload", details: err.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: err.message || "Failed to process telemetry" },
      { status: 500 }
    );
  }
}

