import type { Metadata } from "next";
import { getPublishedBlogs } from "@/lib/firebase/queries";
import BlogCardComponent     from "@/components/blog/BlogCard";
import Breadcrumb            from "@/components/layout/Breadcrumb";
import Pagination            from "@/components/ui/Pagination";
import AdSlot                from "@/components/ui/AdSlot";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Blog — Indian Cooking Tips & Fusion Guides | Spice & Simmer",
  description:
    "Indian cooking tips, spice guides, fusion technique deep-dives, and kitchen wisdom for home cooks.",
  alternates: { canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/blog` },
};

interface BlogPageProps {
  searchParams: { page?: string };
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const page = Number(searchParams.page) || 1;
  const { items: blogs, meta } = await getPublishedBlogs({ page, perPage: 9 }).catch(() => ({
    items: [],
    meta: { total: 0, page: 1, perPage: 9, totalPages: 0 },
  }));

  return (
    <div className="container-base py-8">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Blog" }]} />

      <div className="mb-8">
        <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
          The Spice &amp; Simmer Blog
        </h1>
        <p className="text-gray-500 text-sm sm:text-base max-w-2xl">
          Indian cooking tips, spice guides, fusion technique deep-dives, and kitchen wisdom
          for home cooks who love bold flavor.
        </p>
      </div>

      <AdSlot format="banner" className="mb-8" />

      {blogs.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {blogs.map((blog, i) => (
              <BlogCardComponent key={blog.id} blog={blog} priority={i < 3} />
            ))}
          </div>
          <Pagination total={meta.total} page={meta.page} perPage={meta.perPage} />
        </>
      ) : (
        <div className="text-center py-20">
          <div className="text-6xl mb-4" role="img" aria-hidden>📝</div>
          <h2 className="font-display text-xl font-bold text-gray-700 mb-2">Blog posts coming soon</h2>
          <p className="text-gray-400 text-sm">We&apos;re writing up some great guides!</p>
        </div>
      )}
    </div>
  );
}
