import Link from "next/link";
import Image from "next/image";
import type { RecipeCard } from "@/types";
import { formatTime } from "@/lib/utils/helpers";
import StarRating from "@/components/ui/StarRating";

interface RecipeCardProps {
  recipe: RecipeCard;
  priority?: boolean;
}

const DIFFICULTY_COLORS = {
  Easy:   "badge-green",
  Medium: "badge-yellow",
  Hard:   "badge-red",
} as const;

export default function RecipeCardComponent({
  recipe,
  priority = false,
}: RecipeCardProps) {
  const href = `/recipes/${recipe.category
    .toLowerCase()
    .replace(/\s+/g, "-")}/${recipe.slug}`;

  return (
    <article className="card group flex flex-col h-full">
      {/* Image */}
      <Link href={href} className="block overflow-hidden flex-shrink-0" tabIndex={-1} aria-hidden="true">
        <div className="relative w-full aspect-card bg-gray-100">
          <Image
            src={recipe.image || "/images/placeholder.jpg"}
            alt={`${recipe.title} recipe — Spice & Simmer`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            priority={priority}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = "/images/placeholder.jpg";
            }}
          />
          {/* Featured badge */}
          {recipe.featured && (
            <span className="absolute top-3 left-3 badge badge-orange text-[11px] shadow-sm">
              ⭐ Featured
            </span>
          )}
          {/* Time badge overlay */}
          <span className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/70 text-white text-xs font-semibold px-2 py-1 rounded-lg backdrop-blur-sm">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {formatTime(recipe.totalTime)}
          </span>
        </div>
      </Link>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4">
        {/* Category + Difficulty */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs text-brand-500 font-semibold uppercase tracking-wide">
            {recipe.category}
          </span>
          <span className="text-gray-200">·</span>
          <span className={DIFFICULTY_COLORS[recipe.difficulty]}>
            {recipe.difficulty}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-display font-bold text-gray-900 text-base sm:text-lg leading-snug mb-2 line-clamp-2 group-hover:text-brand-600 transition-colors">
          <Link href={href} className="focus-visible:outline-brand-500 rounded">
            {recipe.title}
          </Link>
        </h3>

        {/* Rating + Servings */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
          {recipe.ratingAvg && recipe.ratingCount ? (
            <StarRating
              rating={recipe.ratingAvg}
              count={recipe.ratingCount}
              size="sm"
            />
          ) : (
            <span className="text-xs text-gray-400">No ratings yet</span>
          )}
          <span className="text-xs text-gray-500 flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Serves {recipe.servings}
          </span>
        </div>
      </div>
    </article>
  );
}
