"use client"

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Search, Filter, X, Clock, Users } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { RecipeCard } from '@/components/recipe/recipe-card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { dummyRecipes, dummyCategories } from '@/lib/dummy-data'

function SearchContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const initialQuery = searchParams.get('q') || ''
  
  const [query, setQuery] = useState(initialQuery)
  const [showFilters, setShowFilters] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedDifficulty, setSelectedDifficulty] = useState<string[]>([])
  const [maxTime, setMaxTime] = useState<number | null>(null)
  const [results, setResults] = useState(dummyRecipes)

  useEffect(() => {
    let filtered = dummyRecipes

    // Filter by search query
    if (query) {
      const lowerQuery = query.toLowerCase()
      filtered = filtered.filter(recipe => 
        recipe.title.toLowerCase().includes(lowerQuery) ||
        recipe.description.toLowerCase().includes(lowerQuery) ||
        recipe.ingredients.some(ing => ing.name.toLowerCase().includes(lowerQuery)) ||
        recipe.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
      )
    }

    // Filter by categories
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(recipe => 
        selectedCategories.includes(recipe.category)
      )
    }

    // Filter by difficulty
    if (selectedDifficulty.length > 0) {
      filtered = filtered.filter(recipe => 
        selectedDifficulty.includes(recipe.difficulty)
      )
    }

    // Filter by max time
    if (maxTime) {
      filtered = filtered.filter(recipe => 
        recipe.prepTime + recipe.cookTime <= maxTime
      )
    }

    setResults(filtered)
  }, [query, selectedCategories, selectedDifficulty, maxTime])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(`/search?q=${encodeURIComponent(query)}`)
  }

  const toggleCategory = (categorySlug: string) => {
    setSelectedCategories(prev => 
      prev.includes(categorySlug) 
        ? prev.filter(c => c !== categorySlug)
        : [...prev, categorySlug]
    )
  }

  const toggleDifficulty = (difficulty: string) => {
    setSelectedDifficulty(prev => 
      prev.includes(difficulty) 
        ? prev.filter(d => d !== difficulty)
        : [...prev, difficulty]
    )
  }

  const clearFilters = () => {
    setSelectedCategories([])
    setSelectedDifficulty([])
    setMaxTime(null)
  }

  const hasActiveFilters = selectedCategories.length > 0 || selectedDifficulty.length > 0 || maxTime !== null

  return (
    <>
      <Header />
      <main className="flex-1 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* Search Header */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-foreground mb-4">
              Search Recipes
            </h1>
            <form onSubmit={handleSearch} className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search recipes, ingredients, or tags..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pl-10 h-12 text-base"
                />
              </div>
              <Button type="submit" size="lg" className="bg-primary hover:bg-primary/90">
                Search
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                size="lg"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Filters
                {hasActiveFilters && (
                  <Badge variant="secondary" className="ml-1 bg-primary text-primary-foreground">
                    {selectedCategories.length + selectedDifficulty.length + (maxTime ? 1 : 0)}
                  </Badge>
                )}
              </Button>
            </form>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="bg-background rounded-xl border p-6 mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">Filters</h3>
                {hasActiveFilters && (
                  <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground">
                    <X className="h-4 w-4 mr-1" />
                    Clear all
                  </Button>
                )}
              </div>
              
              <div className="grid sm:grid-cols-3 gap-6">
                {/* Categories */}
                <div>
                  <h4 className="font-medium mb-3 text-sm text-muted-foreground uppercase tracking-wide">Categories</h4>
                  <div className="space-y-2">
                    {dummyCategories.map(category => (
                      <div key={category.slug} className="flex items-center gap-2">
                        <Checkbox
                          id={`cat-${category.slug}`}
                          checked={selectedCategories.includes(category.slug)}
                          onCheckedChange={() => toggleCategory(category.slug)}
                        />
                        <Label htmlFor={`cat-${category.slug}`} className="cursor-pointer">
                          {category.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Difficulty */}
                <div>
                  <h4 className="font-medium mb-3 text-sm text-muted-foreground uppercase tracking-wide">Difficulty</h4>
                  <div className="space-y-2">
                    {['Easy', 'Medium', 'Hard'].map(difficulty => (
                      <div key={difficulty} className="flex items-center gap-2">
                        <Checkbox
                          id={`diff-${difficulty}`}
                          checked={selectedDifficulty.includes(difficulty)}
                          onCheckedChange={() => toggleDifficulty(difficulty)}
                        />
                        <Label htmlFor={`diff-${difficulty}`} className="cursor-pointer">
                          {difficulty}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Total Time */}
                <div>
                  <h4 className="font-medium mb-3 text-sm text-muted-foreground uppercase tracking-wide">Total Time</h4>
                  <div className="space-y-2">
                    {[
                      { label: 'Under 30 min', value: 30 },
                      { label: 'Under 1 hour', value: 60 },
                      { label: 'Under 2 hours', value: 120 },
                    ].map(option => (
                      <div key={option.value} className="flex items-center gap-2">
                        <Checkbox
                          id={`time-${option.value}`}
                          checked={maxTime === option.value}
                          onCheckedChange={() => setMaxTime(maxTime === option.value ? null : option.value)}
                        />
                        <Label htmlFor={`time-${option.value}`} className="cursor-pointer">
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Active Filters */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 mb-6">
              {selectedCategories.map(cat => {
                const category = dummyCategories.find(c => c.slug === cat)
                return (
                  <Badge key={cat} variant="secondary" className="flex items-center gap-1 py-1 px-3">
                    {category?.name}
                    <button onClick={() => toggleCategory(cat)} className="ml-1 hover:text-destructive">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )
              })}
              {selectedDifficulty.map(diff => (
                <Badge key={diff} variant="secondary" className="flex items-center gap-1 py-1 px-3">
                  {diff}
                  <button onClick={() => toggleDifficulty(diff)} className="ml-1 hover:text-destructive">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              {maxTime && (
                <Badge variant="secondary" className="flex items-center gap-1 py-1 px-3">
                  Under {maxTime} min
                  <button onClick={() => setMaxTime(null)} className="ml-1 hover:text-destructive">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
            </div>
          )}

          {/* Results */}
          <div className="mb-4">
            <p className="text-muted-foreground">
              {results.length} {results.length === 1 ? 'recipe' : 'recipes'} found
              {query && <span> for &quot;{query}&quot;</span>}
            </p>
          </div>

          {results.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map(recipe => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-background rounded-xl border">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No recipes found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your search or filters to find what you&apos;re looking for.
              </p>
              <Button onClick={clearFilters} variant="outline">
                Clear all filters
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  )
}
