import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";
import { addSubscriber } from "@/lib/firebase/queries";
import { verifyHCaptcha, generateToken } from "@/lib/utils/helpers";

const resend = new Resend(process.env.RESEND_API_KEY);

const schema = z.object({
  email:        z.string().email(),
  captchaToken: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const body   = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const { email, captchaToken } = parsed.data;

    // Verify hCaptcha
    const captchaOk = await verifyHCaptcha(captchaToken);
    if (!captchaOk) {
      return NextResponse.json({ error: "Captcha failed" }, { status: 400 });
    }

    // Generate confirmation token
    const confirmToken = generateToken();
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
    const confirmUrl = `${siteUrl}/api/newsletter/confirm?token=${confirmToken}`;

    // Add to Firestore (handles duplicate detection)
    try {
      await addSubscriber(email, confirmToken);
    } catch (err: any) {
      if (err.message === "ALREADY_CONFIRMED") {
        return NextResponse.json({
          success: true,
          message: "You're already subscribed!",
        });
      }
      throw err;
    }

    // Send confirmation email via Resend
    const { error: emailError } = await resend.emails.send({
      from: `${process.env.RESEND_FROM_NAME} <${process.env.RESEND_FROM_EMAIL}>`,
      to:   email,
      subject: "Confirm your Spice & Simmer subscription 🌶️",
      html: `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
        <body style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: #fff; color: #374151;">
          <div style="text-align: center; margin-bottom: 32px;">
            <div style="font-size: 48px; margin-bottom: 12px;">🌶️</div>
            <h1 style="font-size: 24px; font-weight: 700; color: #111827; margin: 0 0 8px;">
              One click to confirm!
            </h1>
            <p style="color: #6b7280; margin: 0;">You're almost part of the Spice &amp; Simmer family.</p>
          </div>

          <div style="background: #fff7ed; border-radius: 16px; padding: 32px; text-align: center; margin-bottom: 24px;">
            <p style="color: #374151; margin: 0 0 24px; font-size: 16px;">
              Click the button below to confirm your subscription and unlock your
              <strong>free PDF: 10 Bold Fusion Recipes</strong>.
            </p>
            <a href="${confirmUrl}"
               style="display: inline-block; background: #f97316; color: white; font-weight: 700;
                      padding: 14px 32px; border-radius: 12px; text-decoration: none; font-size: 16px;">
              ✅ Confirm Subscription
            </a>
            <p style="color: #9ca3af; font-size: 12px; margin: 16px 0 0;">
              Button not working? Copy this link:<br>
              <a href="${confirmUrl}" style="color: #f97316; word-break: break-all;">${confirmUrl}</a>
            </p>
          </div>

          <p style="color: #9ca3af; font-size: 12px; text-align: center; margin: 0;">
            You're receiving this because ${email} signed up at spiceandsimmer.com.<br>
            If you didn't sign up, you can safely ignore this email.
          </p>
        </body>
        </html>
      `,
    });

    if (emailError) {
      console.error("Resend error:", emailError);
      // Don't fail — subscriber is saved, they can request resend
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Subscribe error:", err);
    return NextResponse.json({ error: "Subscription failed" }, { status: 500 });
  }
}
