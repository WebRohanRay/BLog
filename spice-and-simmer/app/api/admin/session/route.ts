import { NextRequest, NextResponse } from "next/server";
import { getAdminAuth } from "@/lib/firebase/admin";

const SESSION_COOKIE_NAME = "admin_session";
const SESSION_DURATION_DAYS = 5;

/** POST /api/admin/session — set session cookie after sign-in */
export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();
    if (!token) {
      return NextResponse.json({ error: "Token required" }, { status: 400 });
    }

    // Verify the Firebase ID token
    const adminAuth = getAdminAuth();
    const decoded = await adminAuth.verifyIdToken(token);

    const expiresIn = 60 * 60 * 24 * SESSION_DURATION_DAYS * 1000; // 5 days in ms
    const sessionCookie = await adminAuth.createSessionCookie(token, { expiresIn });

    const response = NextResponse.json({ success: true });
    response.cookies.set(SESSION_COOKIE_NAME, sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * SESSION_DURATION_DAYS,
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("Session creation error:", err);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

/** DELETE /api/admin/session — clear session cookie on sign-out */
export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete(SESSION_COOKIE_NAME);
  return response;
}
