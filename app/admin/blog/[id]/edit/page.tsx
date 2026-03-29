'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, Loader2, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { ImageUpload } from '@/components/admin/image-upload'
import { fetchBlogById, updateBlog } from '@/lib/api'

const blogCategories = [
  'Cooking Tips',
  'Kitchen Hacks',
  'Ingredient Spotlight',
  'Cultural Food Stories',
  'Meal Planning',
  'Seasonal Cooking',
]

export default function EditBlogPostPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [loading, setLoading] = useState(false)
  const [initialLoad, setInitialLoad] = useState(true)
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: '',
    excerpt: '',
    content: '',
    image: '',
    imagePublicId: '',
    metaDescription: '',
    status: 'draft',
    author: 'Admin',
  })

  useEffect(() => {
    const fetchBlogPost = async () => {
      try {
        const blogPost = await fetchBlogById(id)
        if (!blogPost) {
          toast.error('Blog post not found')
          router.push('/admin/blog')
          return
        }

        setFormData({
          title: blogPost.title || '',
          slug: blogPost.slug || '',
          category: (blogPost as any).category || '',
          excerpt: blogPost.excerpt || '',
          content: blogPost.content || '',
          image: blogPost.image || '',
          imagePublicId: (blogPost as any).imagePublicId || '',
          metaDescription: blogPost.metaDescription || '',
          status: blogPost.status || 'draft',
          author: typeof blogPost.author === 'string' 
            ? blogPost.author 
            : ((blogPost.author as any)?.name || 'Admin'),
        })
      } catch (error) {
        console.error('Error fetching blog post:', error)
        toast.error('Failed to load blog post')
      } finally {
        setInitialLoad(false)
      }
    }

    if (id) {
      fetchBlogPost()
    }
  }, [id, router])

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  const handleTitleChange = (title: string) => {
    setFormData({
      ...formData,
      title,
      slug: generateSlug(title),
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (!formData.title || !formData.image) {
        toast.error('Title and image are required.')
        setLoading(false)
        return
      }

      await updateBlog(id, {
        ...formData,
        readTime: Math.ceil(formData.content.length / 1000) + ' min read',
        publishedAt: formData.status === 'published' ? new Date().toISOString() : null,
      })

      toast.success('Blog post updated successfully!')
      router.push('/admin/blog')
    } catch (error) {
      console.error('Error updating blog post:', error)
      toast.error('Failed to update blog post')
    } finally {
      setLoading(false)
    }
  }

  if (initialLoad) {
    return <div className="p-8 text-center flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
  }

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/blog">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-serif font-bold text-foreground">
            Edit Blog Post
          </h1>
          <p className="text-muted-foreground text-sm">
            Modify your existing article
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>Post Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g., 10 Essential Spices for Indian Cooking"
                required
              />
            </div>

            <div>
              <Label htmlFor="slug">URL Slug</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="10-essential-spices-for-indian-cooking"
              />
              <p className="text-xs text-muted-foreground mt-1">
                URL: /blog/{formData.slug || 'your-post-slug'}
              </p>
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
                    {blogCategories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="author">Author</Label>
                <Input
                  id="author"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label>Featured Image</Label>
              <ImageUpload
                value={formData.image}
                onChange={(url) => setFormData(prev => ({ ...prev, image: url }))}
                onPublicIdChange={(id) => setFormData(prev => ({ ...prev, imagePublicId: id }))}
                aspectRatio="video"
              />
            </div>

            <div>
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea
                id="excerpt"
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                placeholder="A brief summary of the post (displayed in listings)..."
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        {/* Content */}
        <Card>
          <CardHeader>
            <CardTitle>Content</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <Label htmlFor="content">Post Content</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Write your blog post content here... (Markdown supported)"
                rows={15}
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Supports Markdown formatting
              </p>
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
              <p className="text-xs text-muted-foreground mt-1">
                {formData.metaDescription?.length || 0}/160 characters
              </p>
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
          <Link href="/admin/blog">
            <Button variant="outline" type="button">Cancel</Button>
          </Link>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Update Post
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
