'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Plus, Trash2, GripVertical, Loader2, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { fetchAllCategories, createRecipe } from '@/lib/api'
import { ImageUpload } from '@/components/admin/image-upload'

export default function NewRecipePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<any[]>([])
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    difficulty: 'Easy',
    prepTime: '',
    cookTime: '',
    servings: '',
    featured: false,
    status: 'draft',
    image: '',
    imagePublicId: '',
    metaDescription: '',
    ingredients: [{ item: '', amount: '', unit: '' }],
    steps: [{ phase: 'prep', title: '', description: '', tip: '' }],
    nutrition: { calories: '', protein: '', carbs: '', fat: '' },
  })

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const cats = await fetchAllCategories()
        setCategories(cats)
      } catch {
        toast.error('Failed to load categories')
      }
    }
    loadCategories()
  }, [])

  const addIngredient = () => {
    setFormData({
      ...formData,
      ingredients: [...formData.ingredients, { item: '', amount: '', unit: '' }],
    })
  }

  const removeIngredient = (index: number) => {
    setFormData({
      ...formData,
      ingredients: formData.ingredients.filter((_, i) => i !== index),
    })
  }

  const updateIngredient = (index: number, field: string, value: string) => {
    const updated = [...formData.ingredients]
    updated[index] = { ...updated[index], [field]: value }
    setFormData({ ...formData, ingredients: updated })
  }

  const addStep = () => {
    setFormData({
      ...formData,
      steps: [...formData.steps, { phase: 'cooking', title: '', description: '', tip: '' }],
    })
  }

  const removeStep = (index: number) => {
    setFormData({
      ...formData,
      steps: formData.steps.filter((_, i) => i !== index),
    })
  }

  const updateStep = (index: number, field: string, value: string) => {
    const updated = [...formData.steps]
    updated[index] = { ...updated[index], [field]: value }
    setFormData({ ...formData, steps: updated })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (!formData.title || !formData.category || !formData.image) {
        toast.error('Please fill all required fields including image.')
        setLoading(false)
        return
      }

      const slug = formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

      await createRecipe({
        ...formData,
        slug,
        title: formData.title,
        description: formData.metaDescription || '',
        image: formData.image,
        category: formData.category,
        difficulty: formData.difficulty as any,
        prepTime: formData.prepTime || '0',
        cookTime: formData.cookTime || '0',
        servings: formData.servings || '1',
        totalTime: String((Number(formData.prepTime) || 0) + (Number(formData.cookTime) || 0)),
        status: formData.status as any,
        featured: formData.featured,
        tags: [formData.category], // Just mapped from category for now
        ingredients: formData.ingredients,
        steps: formData.steps.map((step, index) => ({
          ...step,
          stepNumber: index + 1
        })),
        nutrition: {
          calories: parseInt(formData.nutrition.calories) || 0,
          protein: parseInt(formData.nutrition.protein) || 0,
          carbs: parseInt(formData.nutrition.carbs) || 0,
          fat: parseInt(formData.nutrition.fat) || 0,
        },
        author: {
          name: 'Admin',
          avatar: '',
        },
        stats: {
          likes: 0,
          views: 0,
          cookCount: 0,
        },
        ratingAvg: 0,
        ratingCount: 0,
        createdAt: new Date().toISOString()
      } as any)

      toast.success('Recipe created successfully!')
      router.push('/admin/recipes')
    } catch (e: any) {
      toast.error('Failed to create recipe: ' + (e.message || 'Unknown error'))
      console.error('Submission Error:', e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/recipes">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-serif font-bold text-foreground">
            New Recipe
          </h1>
          <p className="text-muted-foreground text-sm">
            Add a new recipe to your collection.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Recipe Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Butter Chicken Tacos"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.slug} value={cat.slug}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="difficulty">Difficulty</Label>
                <Select
                  value={formData.difficulty}
                  onValueChange={(value) => setFormData({ ...formData, difficulty: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Easy">Easy</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="prepTime">Prep Time (min)</Label>
                <Input
                  id="prepTime"
                  type="number"
                  value={formData.prepTime}
                  onChange={(e) => setFormData({ ...formData, prepTime: e.target.value })}
                  placeholder="15"
                />
              </div>
              <div>
                <Label htmlFor="cookTime">Cook Time (min)</Label>
                <Input
                  id="cookTime"
                  type="number"
                  value={formData.cookTime}
                  onChange={(e) => setFormData({ ...formData, cookTime: e.target.value })}
                  placeholder="30"
                />
              </div>
              <div>
                <Label htmlFor="servings">Servings</Label>
                <Input
                  id="servings"
                  type="number"
                  value={formData.servings}
                  onChange={(e) => setFormData({ ...formData, servings: e.target.value })}
                  placeholder="4"
                />
              </div>
            </div>

            <div>
              <Label>Recipe Image</Label>
              <ImageUpload
                value={formData.image}
                onChange={(url) => setFormData((prev) => ({ ...prev, image: url }))}
                onPublicIdChange={(id) => setFormData((prev) => ({ ...prev, imagePublicId: id }))}
                aspectRatio="video"
              />
            </div>
          </CardContent>
        </Card>

        {/* Ingredients */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Ingredients</CardTitle>
            <Button type="button" variant="outline" size="sm" onClick={addIngredient}>
              <Plus className="w-4 h-4 mr-1" />
              Add
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {formData.ingredients.map((ingredient, index) => (
              <div key={index} className="flex items-center gap-2">
                <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab" />
                <Input
                  placeholder="Amount"
                  value={ingredient.amount}
                  onChange={(e) => updateIngredient(index, 'amount', e.target.value)}
                  className="w-20"
                />
                <Input
                  placeholder="Unit"
                  value={ingredient.unit}
                  onChange={(e) => updateIngredient(index, 'unit', e.target.value)}
                  className="w-24"
                />
                <Input
                  placeholder="Ingredient"
                  value={ingredient.item}
                  onChange={(e) => updateIngredient(index, 'item', e.target.value)}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeIngredient(index)}
                  disabled={formData.ingredients.length === 1}
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Steps */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Instructions</CardTitle>
            <Button type="button" variant="outline" size="sm" onClick={addStep}>
              <Plus className="w-4 h-4 mr-1" />
              Add Step
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.steps.map((step, index) => (
              <div key={index} className="border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center">
                      {index + 1}
                    </span>
                    <Select
                      value={step.phase}
                      onValueChange={(value) => updateStep(index, 'phase', value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="prep">Prep</SelectItem>
                        <SelectItem value="cooking">Cooking</SelectItem>
                        <SelectItem value="finishing">Finishing</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeStep(index)}
                    disabled={formData.steps.length === 1}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
                <Input
                  placeholder="Step title"
                  value={step.title}
                  onChange={(e) => updateStep(index, 'title', e.target.value)}
                  className="mb-2"
                />
                <Textarea
                  placeholder="Step description..."
                  value={step.description}
                  onChange={(e) => updateStep(index, 'description', e.target.value)}
                  rows={3}
                  className="mb-2"
                />
                <Input
                  placeholder="Pro tip (optional)"
                  value={step.tip}
                  onChange={(e) => updateStep(index, 'tip', e.target.value)}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Nutrition */}
        <Card>
          <CardHeader>
            <CardTitle>Nutrition Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="calories">Calories</Label>
                <Input
                  id="calories"
                  type="number"
                  value={formData.nutrition.calories}
                  onChange={(e) => setFormData({
                    ...formData,
                    nutrition: { ...formData.nutrition, calories: e.target.value }
                  })}
                  placeholder="e.g., 350"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="protein">Protein (g)</Label>
                <Input
                  id="protein"
                  type="number"
                  value={formData.nutrition.protein}
                  onChange={(e) => setFormData({
                    ...formData,
                    nutrition: { ...formData.nutrition, protein: e.target.value }
                  })}
                  placeholder="e.g., 25"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="carbs">Carbs (g)</Label>
                <Input
                  id="carbs"
                  type="number"
                  value={formData.nutrition.carbs}
                  onChange={(e) => setFormData({
                    ...formData,
                    nutrition: { ...formData.nutrition, carbs: e.target.value }
                  })}
                  placeholder="e.g., 40"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="fat">Fat (g)</Label>
                <Input
                  id="fat"
                  type="number"
                  value={formData.nutrition.fat}
                  onChange={(e) => setFormData({
                    ...formData,
                    nutrition: { ...formData.nutrition, fat: e.target.value }
                  })}
                  placeholder="e.g., 15"
                  className="mt-1"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SEO */}
        <Card>
          <CardHeader>
            <CardTitle>SEO & Publishing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="metaDescription">Meta Description</Label>
              <Textarea
                id="metaDescription"
                value={formData.metaDescription}
                onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                placeholder="Brief description for search engines (150-160 characters)"
                rows={2}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="featured">Featured Recipe</Label>
                <p className="text-xs text-muted-foreground">Show on homepage</p>
              </div>
              <Switch
                id="featured"
                checked={formData.featured}
                onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
              />
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <Link href="/admin/recipes">
            <Button variant="outline" type="button">Cancel</Button>
          </Link>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Recipe
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
