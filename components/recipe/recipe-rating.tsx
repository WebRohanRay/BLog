import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface RecipeRatingProps {
  rating: number
  count: number
  size?: 'sm' | 'md' | 'lg'
}

export function RecipeRating({ rating, count, size = 'md' }: RecipeRatingProps) {
  const sizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  }

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  }

  if (count === 0) {
    return (
      <div className={cn('flex items-center gap-1.5', textSizes[size])}>
        <span className="text-muted-foreground">No reviews yet</span>
      </div>
    )
  }

  return (
    <div className={cn('flex items-center gap-1.5', textSizes[size])}>
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={cn(
              sizes[size],
              i < Math.round(rating)
                ? 'fill-yellow-400 text-yellow-400'
                : 'fill-muted text-muted'
            )}
          />
        ))}
      </div>
      <span className="font-medium text-foreground">{rating.toFixed(1)}</span>
      <span className="text-muted-foreground">
        ({count} {count === 1 ? 'review' : 'reviews'})
      </span>
    </div>
  )
}
