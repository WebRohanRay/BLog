import { notFound }          from "next/navigation";
import Image                  from "next/image";
import Link                   from "next/link";
import type { Metadata }      from "next";

import { getRecipeBySlug, getRelatedRecipes, incrementViewCount } from "@/lib/firebase/recipes";
import { getApprovedComments } from "@/lib/firebase/recipes";
import { getLatestBlogs }     from "@/lib/firebase/queries";

import Breadcrumb             from "@/components/layout/Breadcrumb";
import AdSlot                 from "@/components/ui/AdSlot";
import StarRating             from "@/components/ui/StarRating";
import RecipeCardComponent    from "@/components/recipe/RecipeCard";

import RecipeSteps            from "@/components/recipe/RecipeSteps";
import RecipeNutrition        from "@/components/recipe/RecipeNutrition";
import RecipeFAQ              from "@/components/recipe/RecipeFAQ";
import RecipeComments         from "@/components/recipe/RecipeComments";
import RecipeActions          from "@/components/recipe/RecipeActions";
import RecipeSidebar          from "@/components/recipe/RecipeSidebar";

import { formatTime, minutesToISO } from "@/lib/utils/helpers";

export const revalidate = 60;

interface RecipePageProps {
  params: { category: string; slug: string };
}

// ── Metadata ───────────────────────────────────────────────────
export async function generateMetadata({ params }: RecipePageProps): Promise<Metadata> {
  const recipe = await getRecipeBySlug(params.slug).catch(() => null);
  if (!recipe) return { title: "Recipe Not Found" };

  return {
    title: recipe.seoTitle,
    description: recipe.metaDescription,
    keywords: recipe.keywords,
    openGraph: {
      title: recipe.seoTitle,
      description: recipe.metaDescription,
      type: "article",
      images: [{ url: recipe.image, width: 1200, height: 630, alt: recipe.title }],
      publishedTime: recipe.publishedAt,
      modifiedTime:  recipe.updatedAt,
    },
    twitter: {
      card: "summary_large_image",
      title: recipe.seoTitle,
      description: recipe.metaDescription,
      images: [recipe.image],
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/recipes/${params.category}/${params.slug}`,
    },
  };
}

// ── Page ────────────────────────────────────────────────────────
export default async function RecipePage({ params }: RecipePageProps) {
  const recipe = await getRecipeBySlug(params.slug).catch(() => null);
  if (!recipe || recipe.status !== "published") notFound();

  // Fetch supporting data in parallel
  const [relatedRecipes, approvedComments] = await Promise.all([
    getRelatedRecipes(recipe.relatedRecipes || []).catch(() => []),
    getApprovedComments(recipe.id).catch(() => []),
  ]);

  // Track view (non-blocking)
  incrementViewCount(recipe.id).catch(() => {});

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const recipeUrl = `${siteUrl}/recipes/${params.category}/${params.slug}`;

  // ── JSON-LD Schemas ─────────────────────────────────────────
  const recipeSchema = {
    "@context": "https://schema.org",
    "@type": "Recipe",
    name: recipe.title,
    image: recipe.image,
    description: recipe.metaDescription,
    author: { "@type": "Person", name: recipe.author.name },
    datePublished: recipe.publishedAt,
    dateModified: recipe.updatedAt,
    prepTime: minutesToISO(recipe.prepTime),
    cookTime: minutesToISO(recipe.cookTime),
    totalTime: minutesToISO(recipe.totalTime),
    recipeYield: `${recipe.servings} servings`,
    recipeCategory: recipe.category,
    recipeCuisine: recipe.cuisine,
    keywords: recipe.keywords.join(", "),
    recipeIngredient: recipe.ingredients.map(
      (i) => `${i.amount} ${i.unit} ${i.item}`.trim()
    ),
    recipeInstructions: recipe.steps.map((s) => ({
      "@type": "HowToStep",
      position: s.stepNumber,
      name: s.title,
      text: s.description,
      ...(s.image ? { image: s.image } : {}),
      url: `${recipeUrl}#step-${s.stepNumber}`,
    })),
    nutrition: {
      "@type": "NutritionInformation",
      calories: `${recipe.nutrition.calories} calories`,
      proteinContent: `${recipe.nutrition.protein}g`,
      carbohydrateContent: `${recipe.nutrition.carbs}g`,
      fatContent: `${recipe.nutrition.fat}g`,
      fiberContent: `${recipe.nutrition.fiber}g`,
      sodiumContent: `${recipe.nutrition.sodium}mg`,
    },
    ...(recipe.ratingCount && recipe.ratingCount > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: recipe.ratingAvg,
            reviewCount: recipe.ratingCount,
          },
        }
      : {}),
  };

  const faqSchema = recipe.faqs?.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: recipe.faqs.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
      }
    : null;

  return (
    <>
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(recipeSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      {/* Main layout */}
      <div className="container-base py-6 sm:py-8">

        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Recipes", href: "/recipes" },
            { label: recipe.category, href: `/recipes/${params.category}` },
            { label: recipe.title },
          ]}
        />

        {/* Two-column layout: main + sidebar */}
        <div className="flex flex-col lg:flex-row gap-8 mt-4">

          {/* ── Main content ───────────────────────────────── */}
          <main
            className="w-full lg:w-2/3 min-w-0"
            id="recipe-content"
            data-pagefind-body
            data-pagefind-meta={`title:${recipe.title},category:${recipe.category},image:${recipe.image}`}
          >
            {/* H1 */}
            <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 text-balance">
              {recipe.seoTitle}
            </h1>

            {/* Rating + meta */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              {recipe.ratingAvg && recipe.ratingCount ? (
                <StarRating rating={recipe.ratingAvg} count={recipe.ratingCount} size="md" />
              ) : null}
              <span className="text-sm text-gray-400">
                By {recipe.author.name}
              </span>
            </div>

            {/* Hero image */}
            <div className="relative w-full rounded-2xl overflow-hidden mb-6 bg-gray-100"
              style={{ aspectRatio: "16/9" }}
            >
              <Image
                src={recipe.image || "/images/placeholder.jpg"}
                alt={`${recipe.title} recipe — Spice & Simmer`}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 66vw"
                className="object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = "/images/placeholder.jpg";
                }}
              />
            </div>

            {/* Jump to Recipe */}
            <div className="mb-6">
              <a
                href="#ingredients"
                className="btn-primary btn-sm"
              >
                ↓ Jump to Recipe
              </a>
            </div>

            {/* Time + difficulty badges */}
            <div className="flex flex-wrap gap-3 mb-6">
              {[
                { icon: "⏱️", label: "Prep",  value: formatTime(recipe.prepTime) },
                { icon: "🔥", label: "Cook",  value: formatTime(recipe.cookTime) },
                { icon: "⏰", label: "Total", value: formatTime(recipe.totalTime) },
                { icon: "🍽️", label: "Serves", value: String(recipe.servings) },
              ].map((b) => (
                <div
                  key={b.label}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-xl border border-gray-100"
                >
                  <span className="text-base" role="img" aria-hidden>{b.icon}</span>
                  <div>
                    <div className="text-xs text-gray-400 uppercase tracking-wide leading-none">{b.label}</div>
                    <div className="text-sm font-bold text-gray-800">{b.value}</div>
                  </div>
                </div>
              ))}
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-xl border border-gray-100">
                <span className="text-base" role="img" aria-hidden>📊</span>
                <div>
                  <div className="text-xs text-gray-400 uppercase tracking-wide leading-none">Level</div>
                  <div className={`text-sm font-bold ${
                    recipe.difficulty === "Easy" ? "text-green-600"
                    : recipe.difficulty === "Medium" ? "text-yellow-600"
                    : "text-red-600"
                  }`}>{recipe.difficulty}</div>
                </div>
              </div>
            </div>

            {/* Tags */}
            {recipe.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {recipe.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/tags/${tag.toLowerCase().replace(/\s+/g, "-")}`}
                    className="badge-gray hover:badge-orange transition-colors"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            )}

            {/* Intro paragraph */}
            <div className="prose prose-sm sm:prose max-w-none mb-8 text-gray-700 leading-relaxed">
              <p>{recipe.metaDescription}</p>
            </div>

            {/* Ad between intro and ingredients */}
            <AdSlot format="inline" className="mb-8" />

            {/* ── Ingredients ── */}
            <section id="ingredients" aria-labelledby="ingredients-heading">
              <h2 id="ingredients-heading" className="font-display text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                Ingredients
              </h2>

              {/* Serving scaler — client component */}
              <RecipeActions recipe={recipe} recipeUrl={recipeUrl} />

              <ul className="space-y-2 mb-8" role="list">
                {recipe.ingredients.map((ing, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 py-2 border-b border-gray-50 last:border-0"
                  >
                    <span className="w-2 h-2 rounded-full bg-brand-400 flex-shrink-0 mt-2" aria-hidden />
                    <span className="text-sm sm:text-base text-gray-700">
                      <strong className="text-gray-900 ingredient-amount">
                        {ing.amount} {ing.unit}
                      </strong>{" "}
                      {ing.item}
                    </span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Ad between ingredients and steps */}
            <AdSlot format="inline" className="mb-8" />

            {/* ── Steps ── */}
            <section aria-labelledby="instructions-heading">
              <h2 id="instructions-heading" className="font-display text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                Instructions
              </h2>
              <p className="text-sm text-gray-400 mb-6">
                {recipe.steps.length} steps · {formatTime(recipe.totalTime)} total
              </p>
              <RecipeSteps steps={recipe.steps} recipeId={recipe.id} recipeTitle={recipe.title} />
            </section>

            {/* ── Tips ── */}
            {recipe.tips?.length > 0 && (
              <section className="mt-10" aria-labelledby="tips-heading">
                <h2 id="tips-heading" className="font-display text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                  💡 Pro Tips
                </h2>
                <ul className="space-y-3">
                  {recipe.tips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm sm:text-base text-gray-700">
                      <span className="text-brand-500 font-bold flex-shrink-0">✓</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* ── Common Mistakes ── */}
            {recipe.mistakes?.length > 0 && (
              <section className="mt-10" aria-labelledby="mistakes-heading">
                <h2 id="mistakes-heading" className="font-display text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                  ⚠️ Common Mistakes to Avoid
                </h2>
                <ul className="space-y-3">
                  {recipe.mistakes.map((m, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm sm:text-base text-gray-700">
                      <span className="text-red-500 flex-shrink-0">✗</span>
                      {m}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* ── Variations ── */}
            {recipe.variations?.length > 0 && (
              <section className="mt-10" aria-labelledby="variations-heading">
                <h2 id="variations-heading" className="font-display text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                  🔄 Variations & Substitutions
                </h2>
                <ul className="space-y-3">
                  {recipe.variations.map((v, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm sm:text-base text-gray-700">
                      <span className="text-brand-400 flex-shrink-0">→</span>
                      {v}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* ── Nutrition ── */}
            <RecipeNutrition nutrition={recipe.nutrition} servings={recipe.servings} />

            {/* Ad above FAQ */}
            <AdSlot format="inline" className="my-8" />

            {/* ── FAQ ── */}
            {recipe.faqs?.length > 0 && (
              <RecipeFAQ faqs={recipe.faqs} />
            )}

            {/* ── Related Recipes ── */}
            {relatedRecipes.length > 0 && (
              <section className="mt-12" aria-labelledby="related-heading">
                <h2 id="related-heading" className="font-display text-xl sm:text-2xl font-bold text-gray-900 mb-6">
                  You Might Also Like
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                  {relatedRecipes.map((r) => (
                    <RecipeCardComponent key={r.id} recipe={r} />
                  ))}
                </div>
              </section>
            )}

            {/* ── Comments ── */}
            <RecipeComments
              recipeId={recipe.id}
              initialComments={approvedComments}
            />
          </main>

          {/* ── Sidebar ─────────────────────────────────────── */}
          <RecipeSidebar recipe={recipe} />
        </div>
      </div>
    </>
  );
}
