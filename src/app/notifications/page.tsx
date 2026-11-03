"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAppState } from "@/lib/store";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Info,
  Calendar,
  ShoppingBag,
  Wrench,
  Landmark,
  Sparkles,
  ArrowRight,
  SlidersHorizontal,
  CheckCheck,
  Smartphone,
  Mail,
  MessageSquare,
  Clock,
  Filter,
  Volume2,
  VolumeX,
  LayoutDashboard,
  Trees,
  Cpu,
  FlaskConical,
  Leaf,
  Activity,
  BarChart3,
  CheckSquare,
} from "lucide-react";

export default function NotificationCenterPage() {
  const {
    data,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    updateNotificationPreferences,
  } = useAppState();

  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [unreadOnly, setUnreadOnly] = useState<boolean>(false);
  const [showPreferencesModal, setShowPreferencesModal] = useState<boolean>(false);

  // Preference form state
  const farmer = data.users.find((u) => u.role === "farmer") || data.users[0];
  const userPrefs = (data.notificationPreferences || []).find((p) => p.userId === farmer.id) || {
    emailEnabled: true,
    smsEnabled: true,
    pushEnabled: true,
    whatsappEnabled: true,
    mutedCategories: [],
    quietHoursStart: "22:00",
    quietHoursEnd: "06:00",
  };

  const [emailEnabled, setEmailEnabled] = useState(userPrefs.emailEnabled);
  const [smsEnabled, setSmsEnabled] = useState(userPrefs.smsEnabled);
  const [pushEnabled, setPushEnabled] = useState(userPrefs.pushEnabled);
  const [whatsappEnabled, setWhatsappEnabled] = useState(userPrefs.whatsappEnabled);
  const [quietStart, setQuietStart] = useState(userPrefs.quietHoursStart);
  const [quietEnd, setQuietEnd] = useState(userPrefs.quietHoursEnd);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const notifications = data.notifications || [];
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const filteredNotifications = notifications.filter((item) => {
    if (activeCategory !== "all" && item.category !== activeCategory) {
      return false;
    }
    if (unreadOnly && item.isRead) {
      return false;
    }
    return true;
  });

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    updateNotificationPreferences({
      emailEnabled,
      smsEnabled,
      pushEnabled,
      whatsappEnabled,
      quietHoursStart: quietStart,
      quietHoursEnd: quietEnd,
    });
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setShowPreferencesModal(false);
    }, 1200);
  };

  const getCategoryDetails = (cat: string) => {
    switch (cat) {
      case "booking_update":
        return { label: "Machinery Booking", icon: Wrench, color: "text-emerald-700 bg-emerald-100" };
      case "marketplace_order":
        return { label: "Produce Mandi Order", icon: ShoppingBag, color: "text-indigo-700 bg-indigo-100" };
      case "loan_update":
        return { label: "Agri-Credit & Loan", icon: Landmark, color: "text-brand-dark bg-emerald-100" };
      case "soil_alert":
        return { label: "Soil Sentinel Alert", icon: AlertTriangle, color: "text-amber-700 bg-amber-100" };
      case "irrigation_reminder":
        return { label: "Irrigation Schedule", icon: Calendar, color: "text-sky-700 bg-sky-100" };
      case "ai_recommendation":
        return { label: "AI Crop Advisory", icon: Sparkles, color: "text-purple-700 bg-purple-100" };
      case "announcement":
        return { label: "Govt Scheme / News", icon: Info, color: "text-blue-700 bg-blue-100" };
      case "farming_activity":
        return { label: "Lab Test & Activity", icon: CheckCircle2, color: "text-teal-700 bg-teal-100" };
      default:
        return { label: "General Notice", icon: Bell, color: "text-slate-700 bg-slate-100" };
    }
  };

  const navItems = [
    { label: "Dashboard Overview", href: "/dashboard/farmer", icon: LayoutDashboard },
    { label: "Farm Analytics & Expenses", href: "/dashboard/farmer/analytics", icon: BarChart3, badge: "New" },
    { label: "Task Calendar", href: "/dashboard/farmer/tasks", icon: CheckSquare, badge: "Phase 10" },
    { label: "Notifications & Alerts", href: "/notifications", icon: Bell, badge: unreadCount > 0 ? `${unreadCount}` : undefined },
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
      roleTitle="Farmer Notification Center"
      roleSubtitle={`${farmer.fullName} • ${unreadCount} Unread Alerts`}
      roleIcon={Bell}
    >
      <div className="space-y-8">
        {/* Banner */}
        <div className="bg-gradient-to-r from-brand-dark via-emerald-900 to-brand-primary rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-brand-lime text-xs font-bold">
                <Bell className="w-3.5 h-3.5" />
                <span>Live Farm Communications & Alerts</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                Notification Center & Preferences
              </h1>
              <p className="text-xs text-stone-200 max-w-2xl leading-relaxed">
                Stay updated with machinery bookings, escrow payouts, IoT soil telemetry alerts, loan underwriting updates, and agricultural AI recommendations.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {unreadCount > 0 && (
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => markAllNotificationsAsRead()}
                  leftIcon={<CheckCheck className="w-4 h-4 text-brand-lime" />}
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  Mark All as Read ({unreadCount})
                </Button>
              )}

              <Button
                variant="accent"
                size="md"
                onClick={() => setShowPreferencesModal(true)}
                leftIcon={<SlidersHorizontal className="w-4 h-4" />}
              >
                Channel Preferences
              </Button>
            </div>
          </div>
        </div>

        {/* Filters bar */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {[
              { id: "all", label: `All Alerts (${notifications.length})` },
              { id: "booking_update", label: "Machinery CHC" },
              { id: "marketplace_order", label: "Mandi Orders" },
              { id: "loan_update", label: "KCC Loans" },
              { id: "soil_alert", label: "Soil Sentinels" },
              { id: "irrigation_reminder", label: "Drip Cycles" },
              { id: "ai_recommendation", label: "AI Agronomist" },
              { id: "announcement", label: "Govt Schemes" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                  activeCategory === tab.id
                    ? "bg-brand-primary text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Toggle unread */}
          <div className="flex items-center gap-2 border-t md:border-t-0 pt-2 md:pt-0">
            <button
              onClick={() => setUnreadOnly(!unreadOnly)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                unreadOnly
                  ? "bg-amber-100 text-amber-900 border border-amber-300"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Unread Only ({unreadCount})</span>
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {filteredNotifications.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center shadow-card border border-slate-200">
              <EmptyState
                title="No notifications found"
                description={
                  unreadOnly
                    ? "You are all caught up! There are no unread notifications matching your filter."
                    : "You do not have any notifications in this category."
                }
                actionLabel={unreadOnly ? "Show All Notifications" : undefined}
                onAction={unreadOnly ? () => setUnreadOnly(false) : undefined}
              />
            </div>
          ) : (
            filteredNotifications.map((notif) => {
              const meta = getCategoryDetails(notif.category);
              const CatIcon = meta.icon;

              return (
                <div
                  key={notif.id}
                  className={`bg-white rounded-2xl p-4 sm:p-5 border transition-all shadow-sm flex flex-col sm:flex-row sm:items-start justify-between gap-4 ${
                    notif.isRead
                      ? "border-slate-200 hover:border-slate-300"
                      : "border-brand-primary/40 bg-emerald-50/20 hover:border-brand-primary"
                  }`}
                >
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 ${meta.color}`}>
                      <CatIcon className="w-5 h-5" />
                    </div>

                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="neutral" size="sm">
                          {meta.label}
                        </Badge>
                        {notif.priority === "urgent" && (
                          <Badge variant="danger" size="sm" dot>
                            Urgent Priority
                          </Badge>
                        )}
                        {!notif.isRead && (
                          <span className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
                        )}
                        <span className="text-[11px] font-mono text-slate-400 font-bold ml-auto sm:ml-0">
                          {notif.createdAt}
                        </span>
                      </div>

                      <h3 className="text-sm font-black text-brand-text">
                        {notif.title}
                      </h3>
                      {notif.titleMarathi && notif.titleMarathi !== notif.title && (
                        <p className="text-xs font-bold text-slate-600">
                          {notif.titleMarathi}
                        </p>
                      )}

                      <p className="text-xs text-slate-600 leading-relaxed pt-0.5">
                        {notif.message}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:self-center border-t sm:border-t-0 pt-3 sm:pt-0">
                    {notif.actionUrl && (
                      <Link href={notif.actionUrl}>
                        <Button
                          size="sm"
                          variant="outline"
                          rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                          className="text-xs"
                        >
                          {notif.actionLabel || "View"}
                        </Button>
                      </Link>
                    )}

                    {!notif.isRead && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => markNotificationAsRead(notif.id)}
                        className="text-xs text-slate-500 hover:text-brand-primary"
                      >
                        Mark Read
                      </Button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal: Notification Preferences */}
        <Modal
          isOpen={showPreferencesModal}
          onClose={() => setShowPreferencesModal(false)}
          title="Notification Delivery Preferences"
          description="Select delivery channels and quiet hours for farm alerts and reminders."
        >
          <form onSubmit={handleSavePreferences} className="space-y-5">
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">
                Communication Channels
              </h4>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">WhatsApp Updates</p>
                    <p className="text-[11px] text-slate-500">Instant harvest orders & machinery dispatch messages</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={whatsappEnabled}
                  onChange={(e) => setWhatsappEnabled(e.target.checked)}
                  className="w-4 h-4 text-brand-primary rounded accent-brand-primary cursor-pointer"
                />
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">SMS Alerts</p>
                    <p className="text-[11px] text-slate-500">Critical root-zone moisture & pump tripping alerts</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={smsEnabled}
                  onChange={(e) => setSmsEnabled(e.target.checked)}
                  className="w-4 h-4 text-brand-primary rounded accent-brand-primary cursor-pointer"
                />
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                    <Bell className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">In-App & Push Notifications</p>
                    <p className="text-[11px] text-slate-500">Real-time alerts while browsing Mazhi Sheti</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={pushEnabled}
                  onChange={(e) => setPushEnabled(e.target.checked)}
                  className="w-4 h-4 text-brand-primary rounded accent-brand-primary cursor-pointer"
                />
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Email Digest & Reports</p>
                    <p className="text-[11px] text-slate-500">Weekly agronomy summary and bank loan sanction letters</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={emailEnabled}
                  onChange={(e) => setEmailEnabled(e.target.checked)}
                  className="w-4 h-4 text-brand-primary rounded accent-brand-primary cursor-pointer"
                />
              </div>
            </div>

            <div className="space-y-3 pt-2 border-t border-slate-100">
              <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">
                Do Not Disturb (Quiet Hours)
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Quiet Hours Start
                  </label>
                  <input
                    type="time"
                    value={quietStart}
                    onChange={(e) => setQuietStart(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Quiet Hours End
                  </label>
                  <input
                    type="time"
                    value={quietEnd}
                    onChange={(e) => setQuietEnd(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono font-bold"
                  />
                </div>
              </div>
              <p className="text-[10px] text-slate-400">
                Non-critical notifications (tips, marketplace offers) will be held during these hours. Urgent irrigation and safety alarms will still come through.
              </p>
            </div>

            {saveSuccess && (
              <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Preferences updated successfully!</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-3">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowPreferencesModal(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Save Preferences
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </DashboardShell>
  );
}

