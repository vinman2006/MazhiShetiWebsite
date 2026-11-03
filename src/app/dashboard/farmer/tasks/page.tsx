"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAppState } from "@/lib/store";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Button } from "@/components/ui/Button";
import { StatCard, Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  CheckSquare,
  Calendar,
  Clock,
  PlusCircle,
  AlertTriangle,
  CheckCircle2,
  Filter,
  Trash2,
  ArrowRight,
  History,
  Sprout,
  Droplets,
  Wrench,
  FlaskConical,
  Bug,
  LayoutDashboard,
  Trees,
  Cpu,
  Leaf,
  Sparkles,
  Landmark,
  Bell,
  BarChart3,
  Play,
} from "lucide-react";

export default function FarmingTasksPage() {
  const { data, addFarmingTask, updateTaskStatus, deleteFarmingTask } = useAppState();

  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [showHistoryModal, setShowHistoryModal] = useState<boolean>(false);
  const [selectedTaskHistory, setSelectedTaskHistory] = useState<any[]>([]);
  const [selectedTaskTitle, setSelectedTaskTitle] = useState<string>("");

  // Create task form state
  const [taskTitle, setTaskTitle] = useState<string>("");
  const [taskTitleMr, setTaskTitleMr] = useState<string>("");
  const [taskCategory, setTaskCategory] = useState<any>("spraying");
  const [taskCrop, setTaskCrop] = useState<string>("Cotton (कापूस)");
  const [taskPriority, setTaskPriority] = useState<any>("medium");
  const [taskDueDate, setTaskDueDate] = useState<string>(
    new Date(Date.now() + 86400000 * 2).toISOString().split("T")[0]
  );
  const [taskLaborDays, setTaskLaborDays] = useState<string>("1");
  const [taskEstimatedCost, setTaskEstimatedCost] = useState<string>("500");
  const [taskDescription, setTaskDescription] = useState<string>("");

  const farmer = data.users.find((u) => u.role === "farmer") || data.users[0];
  const tasks = data.farmingTasks || [];
  const history = data.taskHistory || [];

  const pendingTasks = tasks.filter((t) => t.status === "pending" || t.status === "in_progress");
  const completedTasks = tasks.filter((t) => t.status === "completed");
  const urgentTasks = tasks.filter((t) => t.priority === "urgent" && t.status !== "completed");

  const filteredTasks = tasks.filter((t) => {
    if (statusFilter !== "all" && t.status !== statusFilter) return false;
    if (priorityFilter !== "all" && t.priority !== priorityFilter) return false;
    return true;
  });

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle) return;

    addFarmingTask({
      farmerId: farmer.id,
      farmId: "farm_01",
      fieldId: "field_01",
      cropName: taskCrop,
      title: taskTitle,
      titleMarathi: taskTitleMr || taskTitle,
      description: taskDescription,
      taskCategory,
      priority: taskPriority,
      status: "pending",
      dueDate: taskDueDate,
      estimatedLaborDays: taskLaborDays ? Number(taskLaborDays) : undefined,
      estimatedCost: taskEstimatedCost ? Number(taskEstimatedCost) : undefined,
    });

    setShowCreateModal(false);
    setTaskTitle("");
    setTaskTitleMr("");
    setTaskDescription("");
  };

  const handleOpenHistory = (taskId: string, title: string) => {
    const taskLogs = history.filter((h) => h.taskId === taskId);
    setSelectedTaskHistory(taskLogs);
    setSelectedTaskTitle(title);
    setShowHistoryModal(true);
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case "sowing":
        return <Sprout className="w-4 h-4 text-emerald-600" />;
      case "irrigation":
        return <Droplets className="w-4 h-4 text-sky-600" />;
      case "fertilizer":
        return <FlaskConical className="w-4 h-4 text-brand-primary" />;
      case "spraying":
        return <Bug className="w-4 h-4 text-amber-600" />;
      case "maintenance":
        return <Wrench className="w-4 h-4 text-indigo-600" />;
      default:
        return <CheckSquare className="w-4 h-4 text-slate-500" />;
    }
  };

  const navItems = [
    { label: "Dashboard Overview", href: "/dashboard/farmer", icon: LayoutDashboard },
    { label: "Farm Analytics & Expenses", href: "/dashboard/farmer/analytics", icon: BarChart3 },
    { label: "Task Calendar", href: "/dashboard/farmer/tasks", icon: CheckSquare, badge: `${pendingTasks.length}` },
    { label: "Notifications & Alerts", href: "/notifications", icon: Bell },
    { label: "My Farm & Fields", href: "/dashboard/farmer/my-farm", icon: Trees },
    { label: "Soil Health & Lab", href: "/dashboard/farmer/soil-health", icon: FlaskConical },
    { label: "Smart Devices & Valves", href: "/dashboard/farmer/devices", icon: Cpu },
    { label: "Sustainable & Organic", href: "/dashboard/farmer/organic", icon: Leaf },
    { label: "AI शेती सल्लागार (Crop Clinic)", href: "/advisory", icon: Sparkles },
    { label: "Agri-Credit & PMFBY", href: "/finance", icon: Landmark },
  ];

  return (
    <DashboardShell
      navItems={navItems}
      roleTitle="Farm Operations & Task Manager"
      roleSubtitle={`${farmer.fullName} • ${pendingTasks.length} Pending Tasks`}
      roleIcon={CheckSquare}
    >
      <div className="space-y-8">
        {/* Banner */}
        <div className="bg-gradient-to-r from-brand-dark via-emerald-950 to-brand-primary rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-lime/20 text-brand-lime text-xs font-bold">
                <Calendar className="w-3.5 h-3.5" />
                <span>Operational Calendar & Labour Task Scheduling</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                Farming Activity & Task Manager
              </h1>
              <p className="text-xs text-stone-200 max-w-2xl leading-relaxed">
                Schedule foliar sprays, irrigation runs, intercultural weeding, and harvest checks. Audit labour days and maintain task completion logs.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="accent"
                size="md"
                onClick={() => setShowCreateModal(true)}
                leftIcon={<PlusCircle className="w-4 h-4" />}
              >
                Add Farming Task
              </Button>
            </div>
          </div>
        </div>

        {/* 3 Summary Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <StatCard
            label="Pending Tasks"
            value={pendingTasks.length}
            unit="Tasks"
            change="Scheduled for Kharif 2026"
            trend="neutral"
            icon={<Clock className="w-5 h-5 text-amber-800" />}
            iconBg="bg-amber-100"
          />
          <StatCard
            label="Urgent Priority Tasks"
            value={urgentTasks.length}
            unit="Urgent"
            change="Irrigation & Spraying"
            trend={urgentTasks.length > 0 ? "down" : "up"}
            icon={<AlertTriangle className="w-5 h-5 text-rose-800" />}
            iconBg="bg-rose-100"
          />
          <StatCard
            label="Completed Operations"
            value={completedTasks.length}
            unit="Done"
            change="Audited with history logs"
            trend="up"
            icon={<CheckCircle2 className="w-5 h-5 text-emerald-800" />}
            iconBg="bg-emerald-100"
          />
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-bold text-slate-700">Filter Tasks:</span>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto">
              {[
                { id: "all", label: `All (${tasks.length})` },
                { id: "pending", label: "Pending" },
                { id: "in_progress", label: "In Progress" },
                { id: "completed", label: "Completed" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setStatusFilter(tab.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                    statusFilter === tab.id
                      ? "bg-brand-primary text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">Priority:</span>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-primary"
            >
              <option value="all">All Priorities</option>
              <option value="urgent">Urgent Only</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>

        {/* Tasks List */}
        <div className="space-y-4">
          {filteredTasks.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center shadow-card border border-slate-200">
              <EmptyState
                title="No tasks match criteria"
                description="Keep your farm operating smoothly by scheduling upcoming seed coatings, drip cycles, and foliar treatments."
                actionLabel="Create Task"
                onAction={() => setShowCreateModal(true)}
              />
            </div>
          ) : (
            filteredTasks.map((task) => (
              <div
                key={task.id}
                className={`bg-white rounded-3xl p-6 border shadow-card transition flex flex-col md:flex-row md:items-center justify-between gap-6 ${
                  task.status === "completed"
                    ? "border-slate-200 bg-slate-50/50 opacity-80"
                    : task.priority === "urgent"
                    ? "border-rose-300 bg-rose-50/20"
                    : "border-slate-200 hover:border-brand-primary/60"
                }`}
              >
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div className="w-12 h-12 rounded-2xl bg-brand-light/70 flex items-center justify-center flex-shrink-0">
                    {getCategoryIcon(task.taskCategory)}
                  </div>

                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                        {task.taskCategory}
                      </span>

                      {task.priority === "urgent" && (
                        <Badge variant="danger" size="sm" dot>
                          Urgent Priority
                        </Badge>
                      )}
                      {task.priority === "high" && (
                        <Badge variant="warning" size="sm">
                          High Priority
                        </Badge>
                      )}
                      {task.priority === "medium" && (
                        <Badge variant="neutral" size="sm">
                          Medium
                        </Badge>
                      )}

                      <Badge
                        variant={
                          task.status === "completed"
                            ? "success"
                            : task.status === "in_progress"
                            ? "info"
                            : "neutral"
                        }
                        size="sm"
                      >
                        {task.status.replace("_", " ").toUpperCase()}
                      </Badge>
                    </div>

                    <h3 className={`text-base font-black ${task.status === "completed" ? "line-through text-slate-500" : "text-brand-text"}`}>
                      {task.title}
                    </h3>
                    {task.titleMarathi && task.titleMarathi !== task.title && (
                      <p className="text-xs font-bold text-slate-600">
                        {task.titleMarathi}
                      </p>
                    )}

                    {task.description && (
                      <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
                        {task.description}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-2 border-t border-slate-100">
                      <span className="flex items-center gap-1 font-bold text-slate-700">
                        <Calendar className="w-3.5 h-3.5 text-brand-primary" />
                        Due: <strong className="font-mono text-slate-900">{task.dueDate}</strong>
                      </span>
                      {task.cropName && (
                        <span>• Crop: <strong className="text-slate-800">{task.cropName}</strong></span>
                      )}
                      {task.estimatedLaborDays && (
                        <span>• Labour: <strong className="text-slate-800">{task.estimatedLaborDays} Days</strong></span>
                      )}
                      {task.estimatedCost && (
                        <span>• Est. Cost: <strong className="text-slate-800 font-mono">₹{task.estimatedCost}</strong></span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 md:self-center border-t md:border-t-0 pt-3 md:pt-0">
                  {task.status !== "completed" && (
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => updateTaskStatus(task.id, "completed", "Task completed on schedule.")}
                      leftIcon={<CheckCircle2 className="w-4 h-4" />}
                    >
                      Mark Complete
                    </Button>
                  )}

                  {task.status === "pending" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateTaskStatus(task.id, "in_progress", "Started operations in field.")}
                      leftIcon={<Play className="w-3.5 h-3.5 text-brand-primary" />}
                    >
                      Start Task
                    </Button>
                  )}

                  <button
                    onClick={() => handleOpenHistory(task.id, task.title)}
                    className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                    title="View Status Transition History"
                  >
                    <History className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => deleteFarmingTask(task.id)}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                    title="Delete Task"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal: Create Farming Task */}
        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Create New Farming Task"
          description="Add a scheduled activity with priority, due date, and labour estimates."
        >
          <form onSubmit={handleCreateTask} className="space-y-4">
            <Input
              label="Task Title (English) *"
              placeholder="e.g. Foliar spray 13:00:45 on Cotton BG-II"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              required
            />

            <Input
              label="Task Title (मराठी) *"
              placeholder="उदा. कपाशीवर पोटॅश खताची फवारणी"
              value={taskTitleMr}
              onChange={(e) => setTaskTitleMr(e.target.value)}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Task Category *
                </label>
                <select
                  value={taskCategory}
                  onChange={(e) => setTaskCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold"
                >
                  <option value="spraying">Foliar Spraying (फवारणी)</option>
                  <option value="irrigation">Irrigation Run (सिंचन)</option>
                  <option value="weeding">Weeding (खुरपणी / तण नियंत्रण)</option>
                  <option value="fertilizer">Fertilizer Application (खत व्यवस्थापन)</option>
                  <option value="sowing">Sowing & Seed Treatment (पेरणी व बीजप्रक्रिया)</option>
                  <option value="harvesting">Harvesting (कापणी व तोडणी)</option>
                  <option value="soil_testing">Soil Testing (माती नमुना तपासणी)</option>
                  <option value="maintenance">Equipment Maintenance (अवजारे देखभाल)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Target Crop
                </label>
                <select
                  value={taskCrop}
                  onChange={(e) => setTaskCrop(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold"
                >
                  <option value="Cotton (कापूस)">Cotton (कापूस)</option>
                  <option value="Soybean (सोयाबीन)">Soybean (सोयाबीन)</option>
                  <option value="Turmeric (हळद)">Turmeric (हळद)</option>
                  <option value="Gram / Harbhara (हरभरा)">Gram / Harbhara (हरभरा)</option>
                  <option value="General Farm">General Farm Infrastructure</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Priority
                </label>
                <select
                  value={taskPriority}
                  onChange={(e) => setTaskPriority(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold"
                >
                  <option value="urgent">Urgent</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>

              <Input
                label="Due Date *"
                type="date"
                value={taskDueDate}
                onChange={(e) => setTaskDueDate(e.target.value)}
                required
              />

              <Input
                label="Est. Labour Days"
                type="number"
                value={taskLaborDays}
                onChange={(e) => setTaskLaborDays(e.target.value)}
              />
            </div>

            <Input
              label="Estimated Cost (₹)"
              type="number"
              placeholder="e.g. 800"
              value={taskEstimatedCost}
              onChange={(e) => setTaskEstimatedCost(e.target.value)}
            />

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Detailed Instructions & Dosage Notes
              </label>
              <textarea
                rows={3}
                placeholder="e.g. Dissolve 100g 13:00:45 in 10L water. Spray between 4 PM and 6 PM to prevent evaporation."
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-primary"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowCreateModal(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Schedule Task
              </Button>
            </div>
          </form>
        </Modal>

        {/* Modal: Task History Audit Trail */}
        <Modal
          isOpen={showHistoryModal}
          onClose={() => setShowHistoryModal(false)}
          title="Task Status History & Audit Trail"
          description={`Logged state transitions for: "${selectedTaskTitle}"`}
        >
          <div className="space-y-4">
            {selectedTaskHistory.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-6">
                No state transition history recorded for this task yet.
              </p>
            ) : (
              <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {selectedTaskHistory.map((h) => (
                  <div key={h.id} className="relative flex items-start gap-3">
                    <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-brand-primary text-white flex items-center justify-center text-[10px] font-bold">
                      ✓
                    </div>
                    <div className="flex-1 bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800">
                          {h.oldStatus.toUpperCase()} → <strong className="text-brand-primary">{h.newStatus.toUpperCase()}</strong>
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">{h.recordedAt}</span>
                      </div>
                      <p className="text-slate-600 text-[11px]">{h.remarks}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="pt-3 text-right">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowHistoryModal(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </DashboardShell>
  );
}

