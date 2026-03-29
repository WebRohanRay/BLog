import Link from "next/link";
import type { Recipe } from "@/types";
import AdSlot from "@/components/ui/AdSlot";
import NewsletterSection from "@/components/ui/NewsletterSection";
import { getFeaturedRecipes } from "@/lib/firebase/recipes";

interface RecipeSidebarProps {
  recipe: Recipe;
}

export default async function RecipeSidebar({ recipe }: RecipeSidebarProps) {
  const popularRecipes = await getFeaturedRecipes(4).catch(() => []);
  const others = popularRecipes.filter((r) => r.id !== recipe.id).slice(0, 3);

  return (
    <aside className="w-full lg:w-1/3 lg:sticky lg:top-20 lg:self-start space-y-6">
      {/* Sidebar ad */}
      <AdSlot format="sidebar" />

      {/* Popular Recipes */}
      {others.length > 0 && (
        <div className="card-flat p-5">
          <h3 className="font-display font-bold text-gray-900 mb-4 text-lg">
            Popular Recipes
          </h3>
          <ul className="space-y-4">
            {others.map((r) => (
              <li key={r.id}>
                <Link
                  href={`/recipes/${r.category.toLowerCase().replace(/\s+/g, "-")}/${r.slug}`}
                  className="flex items-center gap-3 group"
                >
                  <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                    {r.image && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={r.image}
                        alt={r.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-800 group-hover:text-brand-600 line-clamp-2 leading-snug transition-colors">
                      {r.title}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">{r.category}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>

          <Link
            href="/recipes"
            className="block mt-4 text-center text-sm font-semibold text-brand-500 hover:text-brand-700 transition-colors"
          >
            View all recipes →
          </Link>
        </div>
      )}

      {/* Newsletter mini widget */}
      <div className="rounded-2xl bg-gradient-to-br from-brand-500 to-spice-red p-5 text-white text-center">
        <div className="text-3xl mb-2" role="img" aria-hidden>📬</div>
        <h3 className="font-display font-bold text-lg mb-1">
          Get Free Recipes
        </h3>
        <p className="text-brand-100 text-xs mb-4 leading-relaxed">
          Join 1,000+ cooks. Get our free PDF + weekly fusion recipes.
        </p>
        <Link
          href="/#newsletter"
          className="block w-full bg-white text-brand-700 font-bold text-sm py-2.5 rounded-xl hover:bg-brand-50 transition-colors"
        >
          Subscribe Free →
        </Link>
      </div>

      {/* Category links */}
      <div className="card-flat p-5">
        <h3 className="font-display font-bold text-gray-900 mb-3 text-base">
          Browse Categories
        </h3>
        <div className="flex flex-wrap gap-2">
          {[
            "Fusion Mains", "Quick Dinners", "Indian Breakfasts",
            "Vegetarian", "Street Food", "Desserts",
          ].map((cat) => (
            <Link
              key={cat}
              href={`/recipes/${cat.toLowerCase().replace(/\s+/g, "-")}`}
              className="badge-gray hover:badge-orange text-xs transition-colors"
            >
              {cat}
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}
