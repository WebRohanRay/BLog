import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { confirmSubscriber } from "@/lib/firebase/queries";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://spiceandsimmer.com";

  if (!token) {
    return NextResponse.redirect(`${siteUrl}/?confirmed=invalid`);
  }

  try {
    const subscriber = await confirmSubscriber(token);
    if (!subscriber) {
      return NextResponse.redirect(`${siteUrl}/?confirmed=invalid`);
    }

    // Send welcome email with lead magnet PDF
    await resend.emails.send({
      from: `${process.env.RESEND_FROM_NAME} <${process.env.RESEND_FROM_EMAIL}>`,
      to:   subscriber.email,
      subject: "🌶️ Welcome! Here are your 10 free fusion recipes",
      html: `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
        <body style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: #fff; color: #374151;">
          <div style="text-align: center; margin-bottom: 32px;">
            <div style="font-size: 48px; margin-bottom: 12px;">🎉</div>
            <h1 style="font-size: 24px; font-weight: 700; color: #111827; margin: 0 0 8px;">
              Welcome to Spice &amp; Simmer!
            </h1>
            <p style="color: #6b7280; margin: 0;">You're officially in the family.</p>
          </div>

          <div style="background: #fff7ed; border-radius: 16px; padding: 32px; margin-bottom: 24px;">
            <h2 style="font-size: 18px; color: #111827; margin: 0 0 16px;">Here's what you get:</h2>
            <ul style="color: #374151; margin: 0; padding-left: 20px; line-height: 1.8;">
              <li>📄 <strong>Your free PDF:</strong> 10 Bold Fusion Recipes</li>
              <li>📧 Weekly new recipes every Tuesday</li>
              <li>💡 Cooking tips &amp; spice guides</li>
              <li>🔔 First access to new content</li>
            </ul>
          </div>

          <div style="text-align: center; margin-bottom: 24px;">
            <a href="${siteUrl}/public/free-recipes.pdf"
               style="display: inline-block; background: #f97316; color: white; font-weight: 700;
                      padding: 14px 32px; border-radius: 12px; text-decoration: none; font-size: 16px;">
              📥 Download Your Free PDF
            </a>
          </div>

          <div style="text-align: center; margin-bottom: 24px;">
            <a href="${siteUrl}/recipes"
               style="display: inline-block; background: white; color: #f97316; font-weight: 700;
                      padding: 12px 28px; border-radius: 12px; text-decoration: none; font-size: 14px;
                      border: 2px solid #f97316;">
              Browse All Recipes →
            </a>
          </div>

          <p style="color: #9ca3af; font-size: 11px; text-align: center; margin: 0;">
            You subscribed at spiceandsimmer.com.<br>
            <a href="${siteUrl}/api/newsletter/unsubscribe?email=${encodeURIComponent(subscriber.email)}"
               style="color: #9ca3af;">Unsubscribe</a> anytime.
          </p>
        </body>
        </html>
      `,
    }).catch(() => {}); // Don't fail confirmation if email fails

    // Redirect to homepage with success message
    return NextResponse.redirect(`${siteUrl}/?confirmed=true`);
  } catch (err) {
    console.error("Confirm error:", err);
    return NextResponse.redirect(`${siteUrl}/?confirmed=error`);
  }
}
