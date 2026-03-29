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

  const scaleAmount = (amount: string): string => {
    const num = parseFloat(amount)
    if (isNaN(num)) return amount
    const scaled = num * multiplier
    // Handle fractions nicely
    if (scaled === Math.floor(scaled)) {
      return scaled.toString()
    }
    return scaled.toFixed(2).replace(/\.?0+$/, '')
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
