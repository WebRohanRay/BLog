import type { Metadata } from "next";
import { notFound }            from "next/navigation";
import { getPublishedRecipes } from "@/lib/firebase/recipes";
import { getCategoryBySlug }   from "@/lib/firebase/queries";
import RecipeCardComponent     from "@/components/recipe/RecipeCard";
import Breadcrumb              from "@/components/layout/Breadcrumb";
import Pagination              from "@/components/ui/Pagination";
import AdSlot                  from "@/components/ui/AdSlot";

export const revalidate = 60;

interface CategoryPageProps {
  params: { category: string };
  searchParams: { page?: string };
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const category = await getCategoryBySlug(params.category).catch(() => null);
  if (!category) return { title: "Category Not Found" };

  return {
    title: `${category.name} Recipes — Easy & Quick | Spice & Simmer`,
    description: category.seoIntro.substring(0, 160),
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/recipes/${params.category}`,
    },
    openGraph: {
      title: `${category.name} Recipes`,
      description: category.seoIntro.substring(0, 160),
      images: category.image ? [{ url: category.image }] : [],
    },
  };
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const page = Number(searchParams.page) || 1;

  const [category, { items: recipes, meta }] = await Promise.all([
    getCategoryBySlug(params.category),
    getPublishedRecipes({
      page,
      perPage: 12,
      category: params.category
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" "),
    }).catch(() => ({ items: [], meta: { total: 0, page: 1, perPage: 12, totalPages: 0 } })),
  ]);

  if (!category) notFound();

  return (
    <div className="container-base py-8">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Recipes", href: "/recipes" },
          { label: category.name },
        ]}
      />

      {/* H1 + SEO intro */}
      <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mt-4 mb-3">
        {category.name} Recipes
      </h1>
      <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-6 max-w-3xl">
        {category.seoIntro}
      </p>

      {/* Recipe count */}
      <p className="text-sm text-gray-400 mb-6">
        {meta.total} recipe{meta.total !== 1 ? "s" : ""} in {category.name}
      </p>

      {/* Ad */}
      <AdSlot format="banner" className="mb-8" />

      {/* Recipe grid */}
      {recipes.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {recipes.map((recipe, i) => (
              <RecipeCardComponent key={recipe.id} recipe={recipe} priority={i < 3} />
            ))}
          </div>
          <Pagination total={meta.total} page={meta.page} perPage={meta.perPage} />
        </>
      ) : (
        <div className="text-center py-20">
          <div className="text-6xl mb-4" role="img" aria-hidden>🍳</div>
          <h2 className="font-display text-xl font-bold text-gray-700 mb-2">
            Recipes coming soon
          </h2>
          <p className="text-gray-400 text-sm">
            We&apos;re working on some great {category.name} recipes!
          </p>
        </div>
      )}
    </div>
  );
}
