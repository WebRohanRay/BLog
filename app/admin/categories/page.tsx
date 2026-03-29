"use client"

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Plus, Edit, Trash2, Loader2, Save, Database } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { categories as dummyCategories, Category } from '@/lib/dummy-data'
import { ImageUpload } from '@/components/admin/image-upload'
import { createCategory, updateCategory, deleteCategory, fetchAllCategories } from '@/lib/api'

export default function AdminCategoriesPage() {
  const { isAdmin, loading } = useAuth();
  const [categories, setCategories] = useState<Category[]>([])
  const [formLoading, setFormLoading] = useState(false)
  const [form, setForm] = useState({ name: '', slug: '', seoIntro: '', image: '' })
  const [editing, setEditing] = useState<string | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [migrating, setMigrating] = useState(false)

  const loadCategories = async () => {
    try {
      const cats = await fetchAllCategories()
      setCategories(cats)
    } catch {
      toast.error('Failed to load categories')
      setCategories(dummyCategories)
    }
  }

  useEffect(() => {
    loadCategories()
  }, [])

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value, slug: name === 'name' ? value.toLowerCase().replace(/[^a-z0-9]+/g, '-') : form.slug })
  }

  const handleMigrate = async () => {
    setMigrating(true)
    try {
      for (const cat of dummyCategories) {
        await createCategory(cat)
      }
      toast.success('Successfully migrated dummy data to Firebase!')
      loadCategories()
    } catch (e) {
      toast.error('Failed to migrate data')
      console.error(e)
    } finally {
      setMigrating(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormLoading(true)
    try {
      if (editing) {
        await updateCategory(editing, form)
        toast.success('Category updated!')
      } else {
        await createCategory({
          ...form,
          id: Date.now().toString(),
          createdAt: new Date().toISOString()
        } as Category)
        toast.success('Category added!')
      }
      setForm({ name: '', slug: '', seoIntro: '', image: '' })
      setEditing(null)
      setFormOpen(false)
      loadCategories()
    } catch {
      toast.error('Failed to save category')
    } finally {
      setFormLoading(false)
    }
  }

  const handleEdit = (cat: any) => {
    setForm({ name: cat.name, slug: cat.slug, seoIntro: cat.seoIntro || '', image: cat.image || '' })
    setEditing(cat.slug)
    setFormOpen(true)
  }

  const handleDelete = async (slug: string) => {
    try {
      await deleteCategory(slug)
      toast.success('Category deleted!')
      loadCategories()
    } catch {
      toast.error('Failed to delete category')
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-[300px]">Loading...</div>;
  }
  if (!isAdmin) {
    return <div className="flex items-center justify-center min-h-[300px] text-destructive font-bold text-lg">Access denied: Admins only</div>;
  }
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-foreground">Categories</h1>
          <p className="text-muted-foreground mt-1">Manage recipe/blog categories</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleMigrate} disabled={migrating}>
            <Database className="w-4 h-4 mr-2" /> 
            {migrating ? 'Migrating...' : 'Migrate Dummy Data'}
          </Button>
          <Button onClick={() => { setFormOpen(true); setForm({ name: '', slug: '', seoIntro: '', image: '' }); setEditing(null); }}>
            <Plus className="w-4 h-4 mr-2" /> New Category
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">All Categories ({categories.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Name</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Slug</th>
                <th className="text-right p-4 text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.slug} className="border-b border-border last:border-0 hover:bg-muted/50">
                  <td className="p-4">{cat.name}</td>
                  <td className="p-4">{cat.slug}</td>
                  <td className="p-4 text-right flex gap-2 justify-end">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(cat)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(cat.slug)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Category Form Modal (simple inline for now) */}
      {formOpen && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-background rounded-lg shadow-lg p-6 w-full max-w-md">
            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="text-xl font-bold mb-2">{editing ? 'Edit' : 'Add'} Category</h2>
              <div>
                <label className="block mb-1 font-medium text-sm" htmlFor="name">Name</label>
                <Input id="name" name="name" value={form.name} onChange={handleInput} required />
              </div>
              <div>
                <label className="block mb-1 font-medium text-sm" htmlFor="slug">Slug</label>
                <Input id="slug" name="slug" value={form.slug} onChange={handleInput} required />
              </div>
              <div>
                <label className="block mb-1 font-medium text-sm" htmlFor="seoIntro">SEO Description</label>
                <textarea
                  id="seoIntro"
                  name="seoIntro"
                  value={form.seoIntro}
                  onChange={(e) => setForm({ ...form, seoIntro: e.target.value })}
                  className="w-full flex min-h-[80px] rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium text-sm">Image</label>
                <ImageUpload
                  value={form.image}
                  onChange={(url) => setForm({ ...form, image: url })}
                  aspectRatio="video"
                />
              </div>
              <div className="flex gap-2 justify-end pt-2">
                <Button type="button" variant="outline" onClick={() => { setFormOpen(false); setEditing(null); }}>Cancel</Button>
                <Button type="submit" disabled={formLoading}>
                  {formLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                  {editing ? 'Update' : 'Add'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
