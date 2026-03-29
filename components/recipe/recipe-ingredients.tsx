'use client'

import { useState } from 'react'
import { Check, Minus, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface Ingredient {
  item: string
  amount: string
  unit: string
}

interface RecipeIngredientsProps {
  ingredients: Ingredient[]
  servings: number
}

export function RecipeIngredients({ ingredients, servings: baseServings }: RecipeIngredientsProps) {
  const [multiplier, setMultiplier] = useState(1)
  const [checkedIngredients, setCheckedIngredients] = useState<number[]>([])

  const toggleIngredient = (index: number) => {
    setCheckedIngredients((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    )
  }

  const parseRecipeAmount = (amount: string): number | null => {
    const str = amount.trim()
    // 1 1/2 format
    const mixedMatch = str.match(/^(\d+)\s+(\d+)\/(\d+)$/)
    if (mixedMatch) return parseInt(mixedMatch[1]) + (parseInt(mixedMatch[2]) / parseInt(mixedMatch[3]))
    
    // 1/2 format
    const fracMatch = str.match(/^(\d+)\/(\d+)$/)
    if (fracMatch) return parseInt(fracMatch[1]) / parseInt(fracMatch[2])

    // Standard number (e.g., 1, 1.5)
    // Avoid returning 1 for "1/2" by ensuring what we parseFloat is essentially the whole string
    const matchFallback = str.match(/^(\d*\.?\d+)/)
    if (matchFallback) {
        const num = parseFloat(matchFallback[1])
        // if the string after the number is exactly a slash, like "1/2", we shouldn't fallback to parseFloat!
        if (str.startsWith(matchFallback[1] + '/')) {
            return null; // Let it be captured by fracMatch instead, or fail if malformed
        }
        return num
    }

    return null
  }

  const formatFraction = (num: number): string => {
    // A tiny helper to convert decimals back to simple strings if wanted, or just decimals.
    // Let's stick to decimals or exact fractions for neatness
    const tolerance = 1.0E-6;
    if (Math.abs(num - Math.round(num)) < tolerance) return Math.round(num).toString()
    
    // Let's not build a full fraction library. Decimal format is safe.
    return num.toFixed(2).replace(/\.?0+$/, '')
  }

  const scaleAmount = (amount: string): string => {
    if (!amount) return ''
    
    // If we have a range like "2-3", scale both!
    if (amount.includes('-')) {
        const parts = amount.split('-').map(p => p.trim())
        if (parts.length === 2) {
            const p1 = parseRecipeAmount(parts[0])
            const p2 = parseRecipeAmount(parts[1])
            if (p1 !== null && p2 !== null) {
                return `${formatFraction(p1 * multiplier)}-${formatFraction(p2 * multiplier)}`
            }
        }
    }

    const num = parseRecipeAmount(amount)
    if (num === null) return amount // Un-scalable string like "A pinch"

    return formatFraction(num * multiplier)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl sm:text-2xl font-serif font-bold text-foreground">
          Ingredients
        </h2>
        <span className="text-sm text-muted-foreground">
          {baseServings * multiplier} servings
        </span>
      </div>

      {/* Scaling Buttons */}
      <div className="flex items-center gap-2 mb-6">
        <span className="text-sm text-muted-foreground mr-2">Scale:</span>
        {[0.5, 1, 2, 3].map((mult) => (
          <Button
            key={mult}
            onClick={() => setMultiplier(mult)}
            variant={multiplier === mult ? 'default' : 'outline'}
            size="sm"
            className="min-w-[44px] min-h-[44px]"
          >
            {mult === 0.5 ? '½' : `${mult}x`}
          </Button>
        ))}
        <div className="flex items-center gap-1 ml-2">
          <Button
            onClick={() => setMultiplier(Math.max(0.25, multiplier - 0.25))}
            variant="outline"
            size="icon"
            className="w-8 h-8"
          >
            <Minus className="w-3 h-3" />
          </Button>
          <Button
            onClick={() => setMultiplier(multiplier + 0.25)}
            variant="outline"
            size="icon"
            className="w-8 h-8"
          >
            <Plus className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* Ingredients List */}
      <ul className="space-y-2">
        {ingredients.map((ingredient, index) => (
          <li key={index}>
            <button
              onClick={() => toggleIngredient(index)}
              className={cn(
                'w-full flex items-start gap-3 p-3 rounded-lg text-left transition-colors',
                'hover:bg-muted',
                checkedIngredients.includes(index) && 'bg-muted/50'
              )}
            >
              <div
                className={cn(
                  'w-5 h-5 rounded border flex-shrink-0 flex items-center justify-center mt-0.5',
                  checkedIngredients.includes(index)
                    ? 'bg-primary border-primary text-primary-foreground'
                    : 'border-border'
                )}
              >
                {checkedIngredients.includes(index) && <Check className="w-3 h-3" />}
              </div>
              <span
                className={cn(
                  'text-sm sm:text-base',
                  checkedIngredients.includes(index)
                    ? 'line-through text-muted-foreground'
                    : 'text-foreground'
                )}
              >
                <span className="font-medium">
                  {scaleAmount(ingredient.amount)} {ingredient.unit}
                </span>{' '}
                {ingredient.item}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
