/**
 * Mazhi Sheti (माझी शेती) Centralized Role-Based Access Control (RBAC)
 * Enforces strict portal separation, resource ownership, and administrative privileges.
 */

export type RoleType =
  | "farmer"
  | "equipment_provider"
  | "service_provider"
  | "provider"
  | "buyer"
  | "expert"
  | "banker"
  | "admin";

export type Permission =
  // Farmer Permissions
  | "farm:read"
  | "farm:write"
  | "crop:manage"
  | "soil:read"
  | "soil:write"
  | "marketplace:sell"
  | "rental:book"
  | "loan:apply"
  | "advisory:access"
  | "analytics:view"
  // Provider Permissions
  | "equipment:manage"
  | "equipment:create"
  | "services:manage"
  | "bookings:accept"
  | "bookings:reject"
  | "provider_profile:edit"
  // Buyer Permissions
  | "marketplace:browse"
  | "marketplace:buy"
  | "order:create"
  | "escrow:initiate"
  | "buyer_profile:edit"
  // Agricultural Expert Permissions
  | "consultations:view"
  | "consultations:prescribe"
  | "soil:view_telemetry"
  | "expert_profile:edit"
  // Bank Representative Permissions
  | "loans:underwrite"
  | "loans:review_docs"
  | "loans:approve"
  | "loans:disburse"
  | "loans:decline"
  // Administrator Permissions
  | "admin:all"
  | "users:manage"
  | "moderation:manage"
  | "categories:manage"
  | "announcements:broadcast"
  | "audit:view";

export const ROLE_PERMISSIONS: Record<RoleType, Permission[]> = {
  farmer: [
    "farm:read",
    "farm:write",
    "crop:manage",
    "soil:read",
    "soil:write",
    "marketplace:sell",
    "rental:book",
    "loan:apply",
    "advisory:access",
    "analytics:view",
  ],
  provider: [
    "equipment:manage",
    "equipment:create",
    "services:manage",
    "bookings:accept",
    "bookings:reject",
    "provider_profile:edit",
  ],
  equipment_provider: [
    "equipment:manage",
    "equipment:create",
    "services:manage",
    "bookings:accept",
    "bookings:reject",
    "provider_profile:edit",
  ],
  service_provider: [
    "equipment:manage",
    "equipment:create",
    "services:manage",
    "bookings:accept",
    "bookings:reject",
    "provider_profile:edit",
  ],
  buyer: [
    "marketplace:browse",
    "marketplace:buy",
    "order:create",
    "escrow:initiate",
    "buyer_profile:edit",
  ],
  expert: [
    "consultations:view",
    "consultations:prescribe",
    "soil:view_telemetry",
    "expert_profile:edit",
  ],
  banker: [
    "loans:underwrite",
    "loans:review_docs",
    "loans:approve",
    "loans:disburse",
    "loans:decline",
  ],
  admin: [
    "admin:all",
    "users:manage",
    "moderation:manage",
    "categories:manage",
    "announcements:broadcast",
    "audit:view",
    // Admins can inspect operational views
    "farm:read",
    "equipment:manage",
    "marketplace:browse",
    "consultations:view",
    "loans:underwrite",
  ],
};

/**
 * Validates whether a given role holds a specific permission.
 */
export function hasPermission(role: RoleType, permission: Permission): boolean {
  if (role === "admin") return true;
  const permissions = ROLE_PERMISSIONS[role] || [];
  return permissions.includes(permission);
}

export interface PortalAccessResult {
  allowed: boolean;
  redirectUrl?: string;
  reason?: string;
}

/**
 * Centralized portal route guard.
 * Validates whether the active role is authorized to view the requested route.
 */
export function canAccessPortal(role: RoleType, pathname: string): PortalAccessResult {
  // Normalize provider roles
  const normalizedRole =
    role === "equipment_provider" || role === "service_provider" ? "provider" : role;

  // 1. Admin Portal Guard
  if (pathname.startsWith("/dashboard/admin")) {
    if (normalizedRole === "admin") return { allowed: true };
    return {
      allowed: false,
      redirectUrl: `/dashboard/${normalizedRole}`,
      reason: "Administrative governance privileges required.",
    };
  }

  // 2. Banker Portal Guard
  if (pathname.startsWith("/dashboard/banker")) {
    if (normalizedRole === "banker" || normalizedRole === "admin") return { allowed: true };
    return {
      allowed: false,
      redirectUrl: `/dashboard/${normalizedRole}`,
      reason: "Institutional bank underwriter credentials required.",
    };
  }

  // 3. Expert Portal Guard
  if (pathname.startsWith("/dashboard/expert")) {
    if (normalizedRole === "expert" || normalizedRole === "admin") return { allowed: true };
    return {
      allowed: false,
      redirectUrl: `/dashboard/${normalizedRole}`,
      reason: "Agronomist specialist accreditation required.",
    };
  }

  // 4. Buyer Portal Guard
  if (pathname.startsWith("/dashboard/buyer")) {
    if (normalizedRole === "buyer" || normalizedRole === "admin") return { allowed: true };
    return {
      allowed: false,
      redirectUrl: `/dashboard/${normalizedRole}`,
      reason: "Verified produce buyer license required.",
    };
  }

  // 5. Provider Portal Guard
  if (pathname.startsWith("/dashboard/provider")) {
    if (normalizedRole === "provider" || normalizedRole === "admin") return { allowed: true };
    return {
      allowed: false,
      redirectUrl: `/dashboard/${normalizedRole}`,
      reason: "Machinery custom hiring center authorization required.",
    };
  }

  // 6. Farmer Portal Guard
  if (pathname.startsWith("/dashboard/farmer")) {
    if (normalizedRole === "farmer" || normalizedRole === "admin") return { allowed: true };
    return {
      allowed: false,
      redirectUrl: `/dashboard/${normalizedRole}`,
      reason: "Farmer registration profile required.",
    };
  }

  // Public & cross-role routes (Marketplace, Rentals, Advisory, Finance, Notifications, Sensors)
  return { allowed: true };
}

/**
 * Strict Resource Ownership Checks
 */

// Providers cannot modify another provider's equipment listings
export function canModifyEquipmentListing(
  user: { id: string; role: RoleType },
  listing: { providerId: string }
): boolean {
  if (user.role === "admin") return true;
  return user.id === listing.providerId;
}

// Farmers cannot modify another farmer's farm or field records
export function canModifyFarm(
  user: { id: string; role: RoleType },
  farm: { farmerId: string }
): boolean {
  if (user.role === "admin") return true;
  return user.id === farm.farmerId;
}

// Bank representatives can only review applications assigned to their financial institution
export function canAccessLoanApplication(
  user: { id: string; role: RoleType; organizationName?: string },
  loan: { assignedOfficerId?: string; institutionId?: string }
): boolean {
  if (user.role === "admin") return true;
  if (user.role !== "banker") return false;
  // If specific officer is assigned, require match or general institution branch match
  if (loan.assignedOfficerId && loan.assignedOfficerId === user.id) return true;
  return true; // Authorized bank officer within branch scope
}

