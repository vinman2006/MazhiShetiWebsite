import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { initialSeedData } from "@/db/seed-data";

const TaskSchema = z.object({
  farmerId: z.string().default("usr_farmer_01"),
  farmId: z.string().optional(),
  fieldId: z.string().optional(),
  cropName: z.string().optional(),
  title: z.string().min(1, "Task title is required"),
  titleMarathi: z.string().default("शेती काम"),
  description: z.string().optional(),
  taskCategory: z.enum([
    "sowing",
    "weeding",
    "spraying",
    "irrigation",
    "fertilizer",
    "harvesting",
    "soil_testing",
    "maintenance",
  ]),
  priority: z.enum(["low", "medium", "high", "urgent"]).default("medium"),
  status: z.enum(["pending", "in_progress", "completed", "deferred", "cancelled"]).default("pending"),
  dueDate: z.string().min(1, "Due date is required"),
  estimatedLaborDays: z.number().optional(),
  estimatedCost: z.number().optional(),
  notes: z.string().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const farmerId = searchParams.get("farmerId") || "usr_farmer_01";
    const status = searchParams.get("status");
    const priority = searchParams.get("priority");

    let list = (initialSeedData.farmingTasks || []).filter((t) => t.farmerId === farmerId);

    if (status && status !== "all") {
      list = list.filter((t) => t.status === status);
    }
    if (priority && priority !== "all") {
      list = list.filter((t) => t.priority === priority);
    }

    const pendingCount = list.filter((t) => t.status === "pending" || t.status === "in_progress").length;
    const completedCount = list.filter((t) => t.status === "completed").length;

    return NextResponse.json({
      success: true,
      totalTasks: list.length,
      pendingCount,
      completedCount,
      tasks: list,
      history: initialSeedData.taskHistory,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = TaskSchema.parse(body);

    const newTask = {
      id: `task_${Date.now()}`,
      ...validated,
      createdAt: new Date().toISOString().replace("T", " ").substring(0, 16),
    };

    return NextResponse.json({
      success: true,
      message: "Farming task created successfully",
      task: newTask,
    });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: err.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: err.message || "Failed to create task" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { taskId, status, remarks } = body;

    if (!taskId || !status) {
      return NextResponse.json(
        { success: false, error: "taskId and status are required" },
        { status: 400 }
      );
    }

    const now = new Date().toISOString().replace("T", " ").substring(0, 16);

    const historyEntry = {
      id: `th_${Date.now()}`,
      taskId,
      changedByUserId: "usr_farmer_01",
      oldStatus: "pending",
      newStatus: status,
      remarks: remarks || `Status changed to ${status}`,
      recordedAt: now,
    };

    return NextResponse.json({
      success: true,
      message: `Task ${taskId} status updated to ${status}`,
      taskId,
      newStatus: status,
      completedAt: status === "completed" ? now : null,
      historyEntry,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to update task status" },
      { status: 500 }
    );
  }
}

