import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { initialSeedData } from "@/db/seed-data";

const UpdatePreferencesSchema = z.object({
  userId: z.string().default("usr_farmer_01"),
  emailEnabled: z.boolean().optional(),
  smsEnabled: z.boolean().optional(),
  pushEnabled: z.boolean().optional(),
  whatsappEnabled: z.boolean().optional(),
  mutedCategories: z.array(z.string()).optional(),
  quietHoursStart: z.string().optional(),
  quietHoursEnd: z.string().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId") || "usr_farmer_01";
    const category = searchParams.get("category");
    const unreadOnly = searchParams.get("unreadOnly") === "true";

    let list = (initialSeedData.notifications || []).filter((n) => n.userId === userId);

    if (category && category !== "all") {
      list = list.filter((n) => n.category === category);
    }
    if (unreadOnly) {
      list = list.filter((n) => !n.isRead);
    }

    const unreadCount = (initialSeedData.notifications || []).filter(
      (n) => n.userId === userId && !n.isRead
    ).length;

    const preferences = (initialSeedData.notificationPreferences || []).find(
      (p) => p.userId === userId
    ) || {
      id: "pref_default",
      userId,
      emailEnabled: true,
      smsEnabled: true,
      pushEnabled: true,
      whatsappEnabled: true,
      mutedCategories: [],
      quietHoursStart: "22:00",
      quietHoursEnd: "06:00",
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      totalCount: list.length,
      unreadCount,
      preferences,
      notifications: list,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const action = body.action; // 'mark_read' | 'mark_all_read' | 'update_preferences'

    if (action === "mark_read") {
      const notificationId = body.notificationId;
      if (!notificationId) {
        return NextResponse.json({ success: false, error: "notificationId is required" }, { status: 400 });
      }
      return NextResponse.json({
        success: true,
        message: `Notification ${notificationId} marked as read`,
        readAt: new Date().toISOString(),
      });
    }

    if (action === "mark_all_read") {
      const userId = body.userId || "usr_farmer_01";
      return NextResponse.json({
        success: true,
        message: `All notifications marked as read for user ${userId}`,
        readAt: new Date().toISOString(),
      });
    }

    if (action === "update_preferences") {
      const validated = UpdatePreferencesSchema.parse(body);
      return NextResponse.json({
        success: true,
        message: "Notification preferences updated successfully",
        preferences: validated,
      });
    }

    return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: "Validation failed", details: err.errors }, { status: 400 });
    }
    return NextResponse.json(
      { success: false, error: err.message || "Failed to update notification" },
      { status: 500 }
    );
  }
}

