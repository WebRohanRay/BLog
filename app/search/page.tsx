"use client"

import { useState, useEffect, useRef, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Search, X, BookOpen, FileText, Tag } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { RecipeCard } from '@/components/recipe/recipe-card'
import { BlogCard } from '@/components/blog/blog-card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { Recipe, Blog, Category } from '@/lib/api'

// ── Suggestion item types ──────────────────────────────────────────
interface Suggestion {
  type: 'recipe' | 'blog' | 'category'
  label: string
  sub?: string
  value: string
}

function SearchContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [inputVal, setInputVal] = useState(searchParams.get('q') || '')
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [highlightIdx, setHighlightIdx] = useState(-1)

  const [allRecipes, setAllRecipes] = useState<Recipe[]>([])
  const [allBlogs, setAllBlogs] = useState<Blog[]>([])
  const [allCategories, setAllCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  const [activeTab, setActiveTab] = useState<'recipes' | 'blog'>('recipes')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedDifficulty, setSelectedDifficulty] = useState('')

  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Load all data once
  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const { fetchAllRecipes, fetchAllBlogs, fetchAllCategories } = await import('@/lib/api')
        const [recipes, blogs, cats] = await Promise.all([
          fetchAllRecipes(),
          fetchAllBlogs(),
          fetchAllCategories(),
        ])
        setAllRecipes(recipes)
        setAllBlogs(blogs)
        setAllCategories(cats)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  // Build suggestions whenever input changes
  useEffect(() => {
    const q = inputVal.trim().toLowerCase()
    if (!q || q.length < 2) {
      setSuggestions([])
      return
    }

    const items: Suggestion[] = []

    // Categories first
    allCategories
      .filter(c => c.name.toLowerCase().includes(q))
      .slice(0, 3)
      .forEach(c => items.push({ type: 'category', label: c.name, value: c.name }))

    // Recipes
    allRecipes
      .filter(r => r.title.toLowerCase().includes(q))
      .slice(0, 4)
      .forEach(r => items.push({ type: 'recipe', label: r.title, sub: r.category, value: r.title }))

    // Blogs
    allBlogs
      .filter(b => b.title.toLowerCase().includes(q))
      .slice(0, 3)
      .forEach(b => items.push({ type: 'blog', label: b.title, sub: 'Blog', value: b.title }))

    setSuggestions(items.slice(0, 8))
    setHighlightIdx(-1)
  }, [inputVal, allRecipes, allBlogs, allCategories])

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current && !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current && !inputRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const applySearch = (value: string) => {
    setInputVal(value)
    setQuery(value)
    setShowSuggestions(false)
    router.push(`/search?q=${encodeURIComponent(value)}`, { scroll: false })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    applySearch(inputVal)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlightIdx(i => Math.min(i + 1, suggestions.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlightIdx(i => Math.max(i - 1, -1))
    } else if (e.key === 'Enter' && highlightIdx >= 0) {
      e.preventDefault()
      applySearch(suggestions[highlightIdx].value)
    } else if (e.key === 'Escape') {
      setShowSuggestions(false)
    }
  }

  const clearFilters = () => {
    setSelectedCategory('')
    setSelectedDifficulty('')
  }

  // Filtered results
  const filteredRecipes = allRecipes.filter(r => {
    const q = query.toLowerCase()
    const matchesQuery = !q ||
      r.title.toLowerCase().includes(q) ||
      (r as any).description?.toLowerCase().includes(q) ||
      r.tags?.some(t => t.toLowerCase().includes(q)) ||
      r.category?.toLowerCase().includes(q)
    const matchesCat = !selectedCategory || r.category === selectedCategory
    const matchesDiff = !selectedDifficulty || r.difficulty === selectedDifficulty
    return matchesQuery && matchesCat && matchesDiff
  })

  const filteredBlogs = allBlogs.filter(b => {
    const q = query.toLowerCase()
    return !q ||
      b.title.toLowerCase().includes(q) ||
      b.excerpt?.toLowerCase().includes(q) ||
      b.tags?.some(t => t.toLowerCase().includes(q))
  })

  const hasFilters = !!selectedCategory || !!selectedDifficulty

  const SuggestionIcon = ({ type }: { type: Suggestion['type'] }) => {
    if (type === 'recipe') return <BookOpen className="w-3.5 h-3.5 text-primary" />
    if (type === 'blog') return <FileText className="w-3.5 h-3.5 text-blue-500" />
    return <Tag className="w-3.5 h-3.5 text-orange-500" />
  }

  return (
    <>
      <Header />
      <main className="flex-1 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">

          {/* Search Bar */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-foreground mb-4">
              Search Recipes &amp; Blog
            </h1>
            <form onSubmit={handleSubmit} className="flex gap-3">
              {/* Input + dropdown wrapper */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground z-10" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search recipes, categories, tags, blog posts..."
                  value={inputVal}
                  onChange={(e) => { setInputVal(e.target.value); setShowSuggestions(true) }}
                  onFocus={() => { if (suggestions.length > 0) setShowSuggestions(true) }}
                  onKeyDown={handleKeyDown}
                  autoComplete="off"
                  className="w-full pl-10 pr-4 h-12 text-base rounded-md border border-input bg-background ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                />

                {/* Suggestions dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                  <div
                    ref={dropdownRef}
                    className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-xl shadow-lg z-50 overflow-hidden"
                  >
                    {suggestions.map((s, i) => (
                      <button
                        key={i}
                        type="button"
                        onMouseDown={() => applySearch(s.value)}
                        className={cn(
                          'w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-muted transition-colors',
                          highlightIdx === i && 'bg-muted'
                        )}
                      >
                        <SuggestionIcon type={s.type} />
                        <div className="flex-1 min-w-0">
                          <span className="text-sm text-foreground truncate block">{s.label}</span>
                        </div>
                        {s.sub && (
                          <span className="text-xs text-muted-foreground shrink-0">{s.sub}</span>
                        )}
                        <span className={cn(
                          'text-xs px-1.5 py-0.5 rounded font-medium shrink-0',
                          s.type === 'recipe' ? 'bg-primary/10 text-primary' :
                          s.type === 'blog' ? 'bg-blue-100 text-blue-600' :
                          'bg-orange-100 text-orange-600'
                        )}>
                          {s.type === 'category' ? 'Category' : s.type === 'blog' ? 'Blog' : 'Recipe'}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <Button type="submit" size="lg" className="bg-primary hover:bg-primary/90 shrink-0">
                Search
              </Button>
            </form>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setActiveTab('recipes')}
              className={`px-5 py-2 rounded-lg font-medium text-sm transition-colors ${
                activeTab === 'recipes'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-background border border-border text-muted-foreground hover:text-foreground'
              }`}
            >
              Recipes ({filteredRecipes.length})
            </button>
            <button
              onClick={() => setActiveTab('blog')}
              className={`px-5 py-2 rounded-lg font-medium text-sm transition-colors ${
                activeTab === 'blog'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-background border border-border text-muted-foreground hover:text-foreground'
              }`}
            >
              Blog ({filteredBlogs.length})
            </button>
          </div>

          {/* Recipe Filters */}
          {activeTab === 'recipes' && (
            <div className="flex flex-wrap gap-3 mb-6 items-center">
              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                className="h-10 px-3 rounded-lg border border-border bg-background text-sm text-foreground"
              >
                <option value="">All Categories</option>
                {allCategories.map(cat => (
                  <option key={cat.slug} value={cat.slug}>{cat.name}</option>
                ))}
              </select>

              <select
                value={selectedDifficulty}
                onChange={e => setSelectedDifficulty(e.target.value)}
                className="h-10 px-3 rounded-lg border border-border bg-background text-sm text-foreground"
              >
                <option value="">Any Difficulty</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>

              {hasFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground">
                  <X className="h-4 w-4 mr-1" />Clear
                </Button>
              )}
              {selectedCategory && (
                <Badge variant="secondary" className="flex items-center gap-1 py-1 px-3">
                  {allCategories.find(c => c.slug === selectedCategory)?.name}
                  <button onClick={() => setSelectedCategory('')}><X className="h-3 w-3 ml-1" /></button>
                </Badge>
              )}
              {selectedDifficulty && (
                <Badge variant="secondary" className="flex items-center gap-1 py-1 px-3">
                  {selectedDifficulty}
                  <button onClick={() => setSelectedDifficulty('')}><X className="h-3 w-3 ml-1" /></button>
                </Badge>
              )}
            </div>
          )}

          {/* Results */}
          {loading ? (
            <div className="text-center py-16 text-muted-foreground">Loading...</div>
          ) : activeTab === 'recipes' ? (
            filteredRecipes.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRecipes.map(recipe => (
                  <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-background rounded-xl border">
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No recipes found</h3>
                <p className="text-muted-foreground mb-4">Try a different search term or remove filters.</p>
                <Button onClick={clearFilters} variant="outline">Clear filters</Button>
              </div>
            )
          ) : (
            filteredBlogs.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBlogs.map(blog => (
                  <BlogCard key={blog.id} blog={blog} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-background rounded-xl border">
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No blog posts found</h3>
                <p className="text-muted-foreground">Try a different search term.</p>
              </div>
            )
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
