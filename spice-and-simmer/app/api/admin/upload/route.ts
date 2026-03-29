import { NextRequest, NextResponse } from "next/server";
import { getAdminAuth } from "@/lib/firebase/admin";

/** POST /api/admin/upload — get Cloudinary signature for direct upload */
export async function POST(req: NextRequest) {
  // Verify admin session
  const sessionCookie = req.cookies.get("admin_session")?.value;
  if (!sessionCookie) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const adminAuth = getAdminAuth();
    await adminAuth.verifySessionCookie(sessionCookie, true);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cloudName   = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
  const apiKey      = process.env.CLOUDINARY_API_KEY!;
  const apiSecret   = process.env.CLOUDINARY_API_SECRET!;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;

  const timestamp = Math.round(Date.now() / 1000);
  const folder    = "spice-and-simmer";

  // Generate signature
  const paramsToSign = `folder=${folder}&timestamp=${timestamp}&upload_preset=${uploadPreset}`;
  const crypto = await import("crypto");
  const signature = crypto
    .createHash("sha1")
    .update(paramsToSign + apiSecret)
    .digest("hex");

  return NextResponse.json({
    signature,
    timestamp,
    apiKey,
    cloudName,
    folder,
    uploadPreset,
  });
}
