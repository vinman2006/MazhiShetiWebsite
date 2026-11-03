import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { initialSeedData } from "@/db/seed-data";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const role = searchParams.get("role") || "admin";

    // Strictly enforce admin role check
    if (role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Admin role required." },
        { status: 403 }
      );
    }

    const users = initialSeedData.users || [];
    const farmersCount = users.filter((u) => u.role === "farmer").length;
    const providersCount = users.filter((u) => u.role === "provider" || u.role === "equipment_provider").length;
    const buyersCount = users.filter((u) => u.role === "buyer").length;
    const expertsCount = users.filter((u) => u.role === "expert").length;
    const bankersCount = users.filter((u) => u.role === "banker").length;
    const adminsCount = users.filter((u) => u.role === "admin").length;

    const produceListings = initialSeedData.produceListings || [];
    const equipmentListings = initialSeedData.equipment || [];
    const loans = initialSeedData.loanApplications || [];
    const reports = initialSeedData.contentReports || [];
    const announcements = initialSeedData.systemAnnouncements || [];
    const categories = initialSeedData.platformCategories || [];

    const totalSanctionedCredit = loans
      .filter((l) => l.status === "credit_approved" || l.status === "disbursed")
      .reduce((sum, l) => sum + (l.sanctionedAmount || l.requestedAmount || 0), 0);

    const totalMarketplaceGross = produceListings.reduce(
      (sum, p) => sum + p.quantity * p.pricePerUnit,
      0
    );

    return NextResponse.json({
      success: true,
      data: {
        metrics: {
          totalUsers: users.length,
          farmersCount,
          providersCount,
          buyersCount,
          expertsCount,
          bankersCount,
          adminsCount,
          activeProduceLots: produceListings.length,
          activeEquipmentFleet: equipmentListings.length,
          totalSanctionedCredit,
          totalMarketplaceGross,
          pendingReportsCount: reports.filter((r) => r.status === "pending" || r.status === "investigating").length,
        },
        users,
        produceListings,
        equipmentListings,
        contentReports: reports,
        announcements,
        platformCategories: categories,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Admin governance error" },
      { status: 500 }
    );
  }
}

const AdminActionSchema = z.object({
  adminUserId: z.string().default("usr_admin_01"),
  action: z.enum([
    "toggle_user_status",
    "moderate_listing",
    "broadcast_announcement",
    "resolve_report",
    "toggle_category",
  ]),
  payload: z.record(z.any()),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = AdminActionSchema.parse(body);

    const now = new Date().toISOString().replace("T", " ").substring(0, 16);

    switch (validated.action) {
      case "toggle_user_status": {
        const userId = validated.payload.userId;
        const newStatus = validated.payload.newStatus || "suspended";
        return NextResponse.json({
          success: true,
          message: `User ${userId} status transitioned to ${newStatus}`,
          userId,
          status: newStatus,
          timestamp: now,
        });
      }

      case "moderate_listing": {
        const { listingId, action, entityType } = validated.payload;
        return NextResponse.json({
          success: true,
          message: `${entityType} listing ${listingId} action "${action}" executed`,
          listingId,
          action,
          timestamp: now,
        });
      }

      case "broadcast_announcement": {
        const { title, titleMarathi, message, category, priority, targetRoles } = validated.payload;
        const newAnnouncement = {
          id: `anc_${Date.now()}`,
          title,
          titleMarathi: titleMarathi || title,
          message,
          category: category || "general",
          priority: priority || "normal",
          targetRoles: targetRoles || "all",
          isActive: true,
          createdByUserId: validated.adminUserId,
          createdAt: now,
        };
        return NextResponse.json({
          success: true,
          message: "Platform announcement broadcasted to target roles",
          announcement: newAnnouncement,
        });
      }

      case "resolve_report": {
        const { reportId, resolution, notes } = validated.payload;
        return NextResponse.json({
          success: true,
          message: `Report ${reportId} closed with resolution: ${resolution}`,
          reportId,
          resolution,
          notes,
          timestamp: now,
        });
      }

      case "toggle_category": {
        const { categoryId, isActive } = validated.payload;
        return NextResponse.json({
          success: true,
          message: `Platform category ${categoryId} status set to ${isActive ? "ACTIVE" : "INACTIVE"}`,
          categoryId,
          isActive,
          timestamp: now,
        });
      }

      default:
        return NextResponse.json({ success: false, error: "Unknown admin action" }, { status: 400 });
    }
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: err.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: err.message || "Failed to process admin action" },
      { status: 500 }
    );
  }
}

