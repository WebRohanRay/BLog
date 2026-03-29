import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-revalidate-secret") ||
    (await req.json().catch(() => ({}))).secret;

  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const { path, type, slug, category } = body;

  try {
    // Always revalidate sitemap
    revalidatePath("/sitemap.xml");

    if (path) {
      revalidatePath(path);
    }

    if (type === "recipe" && slug && category) {
      revalidatePath(`/recipes/${category}/${slug}`);
      revalidatePath(`/recipes/${category}`);
      revalidatePath("/recipes");
      revalidatePath("/");
    }

    if (type === "blog" && slug) {
      revalidatePath(`/blog/${slug}`);
      revalidatePath("/blog");
      revalidatePath("/");
    }

    if (type === "category" && slug) {
      revalidatePath(`/recipes/${slug}`);
      revalidatePath("/recipes");
    }

    return NextResponse.json({ revalidated: true, timestamp: Date.now() });
  } catch (err) {
    return NextResponse.json(
      { error: "Revalidation failed", details: String(err) },
      { status: 500 }
    );
  }
}
