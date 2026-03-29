import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes that require Firebase Auth
const ADMIN_ROUTES = ["/admin"];

// Routes that should be noindex
const NOINDEX_ROUTES = ["/search", "/admin"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();

  // ── noindex on search + admin ─────────────────────────────
  if (NOINDEX_ROUTES.some((r) => pathname.startsWith(r))) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }

  // ── Admin route guard ─────────────────────────────────────
  // NOTE: Full auth check is done client-side with Firebase Auth.
  // This middleware adds a secondary layer — checks for a session cookie
  // set after successful Firebase Auth sign-in.
  if (ADMIN_ROUTES.some((r) => pathname.startsWith(r))) {
    // Allow the login page itself
    if (pathname === "/admin/login") return response;

    const sessionCookie = request.cookies.get("admin_session");
    if (!sessionCookie) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return response;
}

export const config = {
  matcher: [
    // Match all routes except static files and API
    "/((?!_next/static|_next/image|favicon.ico|images|sounds|pagefind).*)",
  ],
};
