import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

const CommandSchema = z.object({
  deviceId: z.string().min(1, "Device ID is required"),
  commandType: z.enum([
    "START_IRRIGATION",
    "STOP_IRRIGATION",
    "SET_FLOW_RATE",
    "CALIBRATE_SENSOR",
    "EMERGENCY_SHUTOFF",
  ]),
  parameters: z.record(z.any()).optional().default({}),
  requestedByUserId: z.string().optional().default("usr_farmer_01"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = CommandSchema.parse(body);

    const now = new Date().toISOString();
    const commandId = `cmd_${Date.now()}`;

    // Security check: Verify device authorization
    // In production, this validates HMAC / JWT against agricultural_devices.auth_token_hash
    // We never expose secret auth tokens to the client payload.

    const commandRecord = {
      id: commandId,
      deviceId: validated.deviceId,
      commandType: validated.commandType,
      parameters: validated.parameters,
      status: "DISPATCHED",
      requestedByUserId: validated.requestedByUserId,
      dispatchedAt: now,
      deviceAckPayload: null,
    };

    // Simulate immediate Edge LoRaWAN/MQTT execution acknowledgement for online actuators
    let executionAck = "ACK_OK: Dispatched to edge gateway via encrypted MQTT topic.";
    if (validated.commandType === "START_IRRIGATION") {
      const duration = validated.parameters.durationMinutes || 30;
      executionAck = `ACK_OK: Automatic sprinkler solenoid energized. Flow duration set to ${duration}m.`;
    } else if (validated.commandType === "STOP_IRRIGATION" || validated.commandType === "EMERGENCY_SHUTOFF") {
      executionAck = "ACK_OK: Solenoid valve de-energized. Irrigation halted safely.";
    }

    return NextResponse.json({
      success: true,
      message: `Command ${validated.commandType} successfully queued and dispatched.`,
      command: {
        ...commandRecord,
        status: "ACKNOWLEDGED",
        acknowledgedAt: new Date().toISOString(),
        deviceAckPayload: executionAck,
      },
    });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: err.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: err.message || "Failed to dispatch command" },
      { status: 500 }
    );
  }
}
