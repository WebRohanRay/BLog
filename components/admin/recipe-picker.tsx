'use client'

import { useState, useEffect } from 'react'
import { Search, X, ChefHat } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Recipe } from '@/lib/api'

interface RecipePickerProps {
  selectedIds: string[]
  onChange: (ids: string[]) => void
}

export function RecipePicker({ selectedIds, onChange }: RecipePickerProps) {
  const [allRecipes, setAllRecipes] = useState<Recipe[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const { fetchAllRecipes } = await import('@/lib/api')
        const recipes = await fetchAllRecipes()
        setAllRecipes(recipes)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const filtered = allRecipes.filter(r =>
    r.title.toLowerCase().includes(search.toLowerCase()) ||
    r.category?.toLowerCase().includes(search.toLowerCase())
  )

  const selectedRecipes = allRecipes.filter(r => selectedIds.includes(r.id))

  const toggle = (id: string) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter(s => s !== id))
    } else {
      onChange([...selectedIds, id])
    }
  }

  return (
    <div className="space-y-3">
      {/* Selected chips */}
      {selectedRecipes.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedRecipes.map(r => (
            <span
              key={r.id}
              className="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-sm px-3 py-1 rounded-full border border-primary/20"
            >
              <ChefHat className="w-3 h-3" />
              {r.title}
              <button
                type="button"
                onClick={() => toggle(r.id)}
                className="ml-0.5 hover:text-destructive transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search recipes to link..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 h-10 rounded-lg border border-input bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {/* Recipe List */}
      <div className="max-h-56 overflow-y-auto rounded-lg border border-border divide-y divide-border">
        {loading ? (
          <p className="text-sm text-muted-foreground text-center py-6">Loading recipes…</p>
        ) : filtered.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">No recipes found</p>
        ) : (
          filtered.map(recipe => {
            const selected = selectedIds.includes(recipe.id)
            return (
              <button
                key={recipe.id}
                type="button"
                onClick={() => toggle(recipe.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors hover:bg-muted',
                  selected && 'bg-primary/5'
                )}
              >
                {/* Checkbox */}
                <span className={cn(
                  'w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center transition-colors',
                  selected
                    ? 'bg-primary border-primary text-primary-foreground'
                    : 'border-border'
                )}>
                  {selected && (
                    <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 10 10">
                      <path d="M1.5 5l2.5 2.5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </span>
                <span className="flex-1 truncate font-medium text-foreground">{recipe.title}</span>
                {recipe.category && (
                  <span className="text-xs text-muted-foreground shrink-0 capitalize">{recipe.category}</span>
                )}
              </button>
            )
          })
        )}
      </div>

      {selectedIds.length > 0 && (
        <p className="text-xs text-muted-foreground">
          {selectedIds.length} recipe{selectedIds.length !== 1 ? 's' : ''} linked — readers will see a &quot;Try These Recipes&quot; section in the post.
        </p>
      )}
    </div>
  )
}
