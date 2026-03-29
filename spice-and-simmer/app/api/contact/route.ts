import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { contactSchema } from "@/lib/validators/schemas";
import { saveContactMessage } from "@/lib/firebase/queries";
import { verifyHCaptcha } from "@/lib/utils/helpers";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const body   = await req.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { captchaToken, ...contactData } = parsed.data;

    // Verify hCaptcha
    const captchaOk = await verifyHCaptcha(captchaToken);
    if (!captchaOk) {
      return NextResponse.json({ error: "Captcha failed" }, { status: 400 });
    }

    // Save to Firestore
    await saveContactMessage(contactData);

    // Notify admin via email
    await resend.emails.send({
      from: `Spice & Simmer Contact <${process.env.RESEND_FROM_EMAIL}>`,
      to:   process.env.RESEND_FROM_EMAIL!,
      replyTo: contactData.email,
      subject: `New contact message from ${contactData.name}`,
      html: `
        <p><strong>From:</strong> ${contactData.name} (${contactData.email})</p>
        <p><strong>Message:</strong></p>
        <p>${contactData.message.replace(/\n/g, "<br>")}</p>
      `,
    }).catch(() => {}); // Don't fail if notification fails

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact form error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
