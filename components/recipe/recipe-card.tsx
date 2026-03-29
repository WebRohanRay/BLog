import Image from 'next/image'
import Link from 'next/link'
import { Clock, Users, Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Recipe } from '@/lib/api'

interface RecipeCardProps {
  recipe: Recipe
  priority?: boolean
  className?: string
}

export function RecipeCard({ recipe, priority = false, className }: RecipeCardProps) {
  return (
    <Link
      href={`/recipes/${recipe.category}/${recipe.slug}`}
      className={cn(
        'group block bg-card rounded-xl overflow-hidden border border-border shadow-sm hover:shadow-lg transition-all duration-300',
        className
      )}
    >
      {/* Image */}
      <div className="relative w-full h-48 sm:h-56 lg:h-64 overflow-hidden">
        <Image
          src={recipe.image}
          alt={`${recipe.title} recipe - Spice & Simmer`}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          priority={priority}
        />
        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 text-xs font-medium bg-primary text-primary-foreground rounded-full capitalize">
            {recipe.category.replace('-', ' ')}
          </span>
        </div>
        {/* Difficulty Badge */}
        <div className="absolute top-3 right-3">
          <span className={cn(
            'px-2.5 py-1 text-xs font-medium rounded-full',
            recipe.difficulty === 'Easy' && 'bg-green-100 text-green-800',
            recipe.difficulty === 'Medium' && 'bg-yellow-100 text-yellow-800',
            recipe.difficulty === 'Hard' && 'bg-red-100 text-red-800'
          )}>
            {recipe.difficulty}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5">
        {/* Title */}
        <h3 className="text-base sm:text-lg font-semibold text-card-foreground line-clamp-2 group-hover:text-primary transition-colors mb-2">
          {recipe.title}
        </h3>

        {/* Meta */}
        <div className="flex items-center gap-4 text-xs sm:text-sm text-muted-foreground mb-3">
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{recipe.totalTime} min</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            <span>{recipe.servings} servings</span>
          </div>
        </div>

        {/* Rating */}
        {recipe.ratingCount > 0 && (
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    'w-3.5 h-3.5',
                    i < Math.round(recipe.ratingAvg)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'fill-muted text-muted'
                  )}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">
              ({recipe.ratingCount})
            </span>
          </div>
        )}
      </div>
    </Link>
  )
}
