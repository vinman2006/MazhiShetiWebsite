import { NextResponse, type NextRequest } from "next/server";

// Role-protected route prefix mapping
const ROLE_ROUTE_MAP: Record<string, string[]> = {
  farmer: ["/dashboard/farmer", "/sensors", "/advisory", "/marketplace", "/rentals", "/finance", "/onboarding"],
  expert: ["/dashboard/expert", "/advisory", "/sensors"],
  provider: ["/dashboard/provider", "/rentals", "/marketplace"],
  equipment_provider: ["/dashboard/provider", "/rentals", "/marketplace"],
  service_provider: ["/dashboard/provider", "/rentals", "/advisory"],
  buyer: ["/dashboard/buyer", "/marketplace", "/rentals"],
  banker: ["/dashboard/banker", "/finance", "/sensors"],
  admin: ["/dashboard/admin", "/dashboard", "/sensors", "/marketplace", "/rentals", "/finance", "/advisory"],
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow static files, api routes, and public paths
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/assets") ||
    pathname.startsWith("/api") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
