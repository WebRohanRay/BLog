import { notFound }     from "next/navigation";
import Image            from "next/image";
import Link             from "next/link";
import type { Metadata } from "next";
import { getBlogById, getBlogBySlug } from "@/lib/firebase/queries";
import { getRelatedRecipes } from "@/lib/firebase/recipes";
import Breadcrumb       from "@/components/layout/Breadcrumb";
import RecipeCardComponent from "@/components/recipe/RecipeCard";
import AdSlot           from "@/components/ui/AdSlot";
import { formatDate }   from "@/lib/utils/helpers";

export const revalidate = 60;

interface BlogPostPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const blog = await getBlogBySlug(params.slug).catch(() => null);
  if (!blog) return { title: "Post Not Found" };
  return {
    title: blog.seoTitle,
    description: blog.metaDescription,
    openGraph: {
      title: blog.seoTitle,
      description: blog.metaDescription,
      type: "article",
      images: blog.image ? [{ url: blog.image }] : [],
      publishedTime: blog.publishedAt,
      modifiedTime: blog.updatedAt,
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/blog/${params.slug}`,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const blog = await getBlogBySlug(params.slug).catch(() => null);
  if (!blog || blog.status !== "published") notFound();

  const relatedRecipes = await getRelatedRecipes(blog.relatedRecipes || []).catch(() => []);

  return (
    <div className="container-base py-8">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Blog", href: "/blog" },
          { label: blog.title },
        ]}
      />

      <div className="max-w-3xl mx-auto">
        {/* Tags */}
        {blog.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4 mt-4">
            {blog.tags.map((tag) => (
              <Link
                key={tag}
                href={`/tags/${tag.toLowerCase().replace(/\s+/g, "-")}`}
                className="badge-orange"
              >
                {tag}
              </Link>
            ))}
          </div>
        )}

        <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 text-balance">
          {blog.title}
        </h1>

        <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
          <span>By {blog.author.name}</span>
          <span>·</span>
          <span>{blog.publishedAt ? formatDate(blog.publishedAt) : ""}</span>
          <span>·</span>
          <span>{blog.readingTime} min read</span>
        </div>

        {blog.image && (
          <div className="relative w-full rounded-2xl overflow-hidden mb-8 bg-gray-100"
            style={{ aspectRatio: "16/9" }}
          >
            <Image
              src={blog.image}
              alt={blog.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
            />
          </div>
        )}

        <AdSlot format="banner" className="mb-8" />

        {/* Blog content */}
        <div
          className="prose prose-sm sm:prose max-w-none prose-headings:font-display prose-a:text-brand-500 prose-a:no-underline hover:prose-a:underline"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />

        <AdSlot format="inline" className="my-10" />

        {/* Related recipes */}
        {relatedRecipes.length > 0 && (
          <section className="mt-12" aria-labelledby="blog-related-heading">
            <h2 id="blog-related-heading" className="font-display text-xl sm:text-2xl font-bold text-gray-900 mb-6">
              Try These Recipes
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              {relatedRecipes.map((r) => (
                <RecipeCardComponent key={r.id} recipe={r} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
