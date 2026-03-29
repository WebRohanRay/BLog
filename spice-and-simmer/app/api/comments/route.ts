import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { addComment } from "@/lib/firebase/recipes";
import { verifyHCaptcha } from "@/lib/utils/helpers";

const commentSchema = z.object({
  recipeId:     z.string().min(1),
  name:         z.string().min(2).max(100),
  email:        z.string().email(),
  comment:      z.string().min(5).max(1000),
  rating:       z.number().int().min(1).max(5),
  captchaToken: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = commentSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { captchaToken, ...commentData } = parsed.data;

    // Verify hCaptcha
    const captchaOk = await verifyHCaptcha(captchaToken);
    if (!captchaOk) {
      return NextResponse.json({ error: "Captcha verification failed" }, { status: 400 });
    }

    const id = await addComment(commentData);
    return NextResponse.json({ success: true, id });
  } catch (err) {
    console.error("Comment submit error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
