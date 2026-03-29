import type { Metadata } from "next";
import { notFound }           from "next/navigation";
import { getTagBySlug }       from "@/lib/firebase/queries";
import { getPublishedRecipes } from "@/lib/firebase/recipes";
import RecipeCardComponent    from "@/components/recipe/RecipeCard";
import Breadcrumb             from "@/components/layout/Breadcrumb";

export const revalidate = 60;

interface TagPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const tag = await getTagBySlug(params.slug).catch(() => null);
  if (!tag) return { title: "Tag Not Found" };
  return {
    title: `#${tag.name} Recipes — Spice & Simmer`,
    description: `Browse all ${tag.name} recipes on Spice & Simmer. Easy Indian-American fusion recipes tagged with ${tag.name}.`,
    alternates: { canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/tags/${params.slug}` },
  };
}

export default async function TagPage({ params }: TagPageProps) {
  const tag = await getTagBySlug(params.slug).catch(() => null);
  if (!tag) notFound();

  const { items: recipes } = await getPublishedRecipes({
    tag: tag.name,
    perPage: 24,
  }).catch(() => ({ items: [] }));

  return (
    <div className="container-base py-8">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Tags" }, { label: `#${tag.name}` }]} />

      <div className="mb-8 mt-4">
        <span className="badge-orange text-sm mb-3 inline-block">Tag</span>
        <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
          #{tag.name}
        </h1>
        <p className="text-gray-500 text-sm">
          {recipes.length} recipe{recipes.length !== 1 ? "s" : ""} tagged with #{tag.name}
        </p>
      </div>

      {recipes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {recipes.map((recipe, i) => (
            <RecipeCardComponent key={recipe.id} recipe={recipe} priority={i < 3} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="text-6xl mb-4" role="img" aria-hidden>🏷️</div>
          <p className="text-gray-500">No recipes with this tag yet.</p>
        </div>
      )}
    </div>
  );
}
