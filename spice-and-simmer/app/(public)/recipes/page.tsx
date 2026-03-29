import type { Metadata } from "next";
import { getPublishedRecipes } from "@/lib/firebase/recipes";
import { getAllCategories }    from "@/lib/firebase/queries";
import RecipeCardComponent    from "@/components/recipe/RecipeCard";
import Breadcrumb              from "@/components/layout/Breadcrumb";
import Pagination              from "@/components/ui/Pagination";
import AdSlot                  from "@/components/ui/AdSlot";
import CategoryCard            from "@/components/ui/CategoryCard";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "All Recipes — Indian-American Fusion | Spice & Simmer",
  description:
    "Browse all our Indian-American fusion recipes. Easy, quick, and bold meals for busy home cooks. Filter by category, difficulty, and more.",
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/recipes`,
  },
};

interface RecipesPageProps {
  searchParams: { page?: string; category?: string };
}

export default async function RecipesPage({ searchParams }: RecipesPageProps) {
  const page     = Number(searchParams.page) || 1;
  const category = searchParams.category;

  const [{ items: recipes, meta }, categories] = await Promise.all([
    getPublishedRecipes({ page, perPage: 12, category }).catch(() => ({
      items: [],
      meta: { total: 0, page: 1, perPage: 12, totalPages: 0 },
    })),
    getAllCategories().catch(() => []),
  ]);

  return (
    <div className="container-base py-8">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Recipes" }]} />

      <div className="mb-8">
        <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
          {category ? `${category} Recipes` : "All Recipes"}
        </h1>
        <p className="text-gray-500 text-sm sm:text-base">
          {meta.total} recipe{meta.total !== 1 ? "s" : ""} found
          {category ? ` in ${category}` : ""}
        </p>
      </div>

      {/* Category filter pills — horizontally scrollable on mobile */}
      {categories.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-2 mb-8 scrollbar-hide">
          <a
            href="/recipes"
            className={`flex-shrink-0 px-4 py-2 rounded-full border text-sm font-medium whitespace-nowrap transition-colors ${
              !category
                ? "bg-brand-500 text-white border-brand-500"
                : "border-gray-200 text-gray-600 hover:border-brand-300 hover:text-brand-600"
            }`}
          >
            All
          </a>
          {categories.map((cat) => (
            <a
              key={cat.id}
              href={`/recipes?category=${encodeURIComponent(cat.name)}`}
              className={`flex-shrink-0 px-4 py-2 rounded-full border text-sm font-medium whitespace-nowrap transition-colors ${
                category === cat.name
                  ? "bg-brand-500 text-white border-brand-500"
                  : "border-gray-200 text-gray-600 hover:border-brand-300 hover:text-brand-600"
              }`}
            >
              {cat.name}
            </a>
          ))}
        </div>
      )}

      {/* Ad slot */}
      <AdSlot format="banner" className="mb-8" />

      {/* Recipe grid */}
      {recipes.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {recipes.map((recipe, i) => (
              <RecipeCardComponent key={recipe.id} recipe={recipe} priority={i < 6} />
            ))}
          </div>
          <Pagination total={meta.total} page={meta.page} perPage={meta.perPage} />
        </>
      ) : (
        <div className="text-center py-20">
          <div className="text-6xl mb-4" role="img" aria-hidden>🍽️</div>
          <h2 className="font-display text-xl font-bold text-gray-700 mb-2">
            No recipes yet
          </h2>
          <p className="text-gray-400 text-sm">
            Check back soon — we&apos;re cooking up something great!
          </p>
        </div>
      )}
    </div>
  );
}
