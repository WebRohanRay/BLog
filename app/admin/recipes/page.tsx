"use client"

import Link from 'next/link'
import Image from 'next/image'
import { Plus, Edit, Eye, Star, MoreHorizontal, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useEffect, useState } from 'react'
import { fetchAllRecipes, deleteRecipe } from '@/lib/api'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export default function AdminRecipesPage() {
  const [recipeList, setRecipeList] = useState<any[]>([])
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadRecipes = async () => {
      setLoading(true)
      try {
        const recipes = await fetchAllRecipes(true)
        setRecipeList(recipes)
      } catch (error) {
        toast.error('Failed to load recipes')
      } finally {
        setLoading(false)
      }
    }
    loadRecipes()
  }, [])

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this recipe?')) return
    setDeletingId(id)
    try {
      await deleteRecipe(id)
      setRecipeList((prev) => prev.filter((r) => r.id !== id))
      toast.success('Recipe deleted successfully!')
    } catch (error) {
      toast.error('Failed to delete recipe')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-foreground">
            Recipes
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your recipe collection
          </p>
        </div>
        <Link href="/admin/recipes/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Recipe
          </Button>
        </Link>
      </div>

      {/* Recipes Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">All Recipes ({recipeList.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground">Loading recipes...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Recipe</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground hidden sm:table-cell">Category</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground hidden md:table-cell">Status</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground hidden lg:table-cell">Rating</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground hidden lg:table-cell">Views</th>
                    <th className="text-right p-4 text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recipeList.map((recipe) => (
                    <tr key={recipe.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0">
                            <Image
                              src={recipe.image}
                              alt={recipe.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-foreground truncate max-w-50 sm:max-w-75">
                              {recipe.title}
                            </p>
                            <p className="text-xs text-muted-foreground sm:hidden capitalize">
                              {recipe.category?.replace('-', ' ')}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 hidden sm:table-cell">
                        <span className="text-sm text-muted-foreground capitalize">
                          {recipe.category?.replace('-', ' ')}
                        </span>
                      </td>
                      <td className="p-4 hidden md:table-cell">
                        <span className={cn(
                          'inline-flex px-2 py-1 text-xs font-medium rounded-full',
                          recipe.status === 'published'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        )}>
                          {recipe.status}
                        </span>
                      </td>
                      <td className="p-4 hidden lg:table-cell">
                        <div className="flex items-center gap-1 text-sm">
                          <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                          <span>{recipe.ratingAvg?.toFixed(1) ?? '0.0'}</span>
                          <span className="text-muted-foreground">({recipe.ratingCount ?? 0})</span>
                        </div>
                      </td>
                      <td className="p-4 hidden lg:table-cell">
                        <span className="text-sm text-muted-foreground">
                          {recipe.viewCount?.toLocaleString?.() ?? '0'}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/recipes/${recipe.id}/edit`}>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/recipes/${recipe.category}/${recipe.slug}`} target="_blank">
                                <Eye className="w-4 h-4 mr-2" />
                                View
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => handleDelete(recipe.id)}
                              disabled={deletingId === recipe.id}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              {deletingId === recipe.id ? 'Deleting...' : 'Delete'}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
