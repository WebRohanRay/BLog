import { MetadataRoute } from "next";
import { getAllPublishedRecipesForSitemap } from "@/lib/firebase/recipes";
import { getAllBlogsForSitemap, getAllCategories } from "@/lib/firebase/queries";

export const revalidate = 3600; // rebuild sitemap every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://spiceandsimmer.com";

  const [recipes, blogs, categories] = await Promise.all([
    getAllPublishedRecipesForSitemap().catch(() => []),
    getAllBlogsForSitemap().catch(() => []),
    getAllCategories().catch(() => []),
  ]);

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${siteUrl}/recipes`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${siteUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  // Category pages
  const categoryPages: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${siteUrl}/recipes/${cat.slug}`,
    lastModified: new Date(cat.createdAt),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Recipe pages — highest priority for SEO
  const recipePages: MetadataRoute.Sitemap = recipes.map((r) => ({
    url: `${siteUrl}/recipes/${r.category.toLowerCase().replace(/\s+/g, "-")}/${r.slug}`,
    lastModified: new Date(r.updatedAt),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Blog pages
  const blogPages: MetadataRoute.Sitemap = blogs.map((b) => ({
    url: `${siteUrl}/blog/${b.slug}`,
    lastModified: new Date(b.updatedAt),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...categoryPages, ...recipePages, ...blogPages];
}
