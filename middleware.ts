import { NextRequest, NextResponse } from "next/server";

const ADMIN_USERNAME = "komban";
const ADMIN_PASSWORD = "k0mb@n";
const COOKIE_NAME = "mg_admin_session";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin login page — always allow
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  // Admin API for login — allow through
  if (pathname === "/api/admin/auth") {
    return NextResponse.next();
  }

  // Protect all /admin/* routes
  if (pathname.startsWith("/admin")) {
    const sessionCookie = request.cookies.get(COOKIE_NAME);
    if (!sessionCookie || sessionCookie.value !== "1") {
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};

// Export credentials for use in the auth API route
export { ADMIN_USERNAME, ADMIN_PASSWORD, COOKIE_NAME };
