'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Plus, Edit, Eye, MoreHorizontal, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { fetchAllBlogs, deleteBlog } from '@/lib/api'
import type { Blog } from '@/lib/dummy-data'
import { toast } from 'sonner'

export default function AdminBlogPage() {
  const [blogPosts, setBlogPosts] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true)
      try {
        const blogs = await fetchAllBlogs(true)
        setBlogPosts(blogs)
      } catch {
        toast.error('Failed to load blog posts')
      } finally {
        setLoading(false)
      }
    }
    fetchBlogs()
  }, [])

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this blog post?')) return
    
    setDeletingId(id)
    try {
      await deleteBlog(id)
      setBlogPosts((prev) => prev.filter(b => b.id !== id))
      toast.success('Blog post deleted')
    } catch {
      toast.error('Failed to delete blog post')
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
            Blog Posts
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your blog articles
          </p>
        </div>
        <Link href="/admin/blog/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Post
          </Button>
        </Link>
      </div>

      {/* Blog Posts Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">All Posts ({blogPosts.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
             <div className="p-8 text-center text-muted-foreground">Loading posts...</div>
          ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Post</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground hidden sm:table-cell">Category</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground hidden md:table-cell">Status</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground hidden lg:table-cell">Date</th>
                  <th className="text-right p-4 text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {blogPosts.map((post) => (
                  <tr key={post.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                          {post.image && (
                            <Image
                              src={post.image}
                              alt={post.title}
                              fill
                              className="object-cover"
                            />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-foreground truncate max-w-[200px] sm:max-w-[300px]">
                            {post.title}
                          </p>
                          <p className="text-xs text-muted-foreground sm:hidden">
                            {post.category}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 hidden sm:table-cell">
                      <span className="text-sm text-muted-foreground">
                        {post.category}
                      </span>
                    </td>
                    <td className="p-4 hidden md:table-cell">
                      <span className={cn(
                        'inline-flex px-2 py-1 text-xs font-medium rounded-full',
                        post.status === 'published'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      )}>
                        {post.status || 'published'}
                      </span>
                    </td>
                    <td className="p-4 hidden lg:table-cell">
                      <span className="text-sm text-muted-foreground">
                        {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'Draft'}
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
                            <Link href={`/admin/blog/${post.id}/edit`}>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/blog/${post.slug}`} target="_blank">
                              <Eye className="w-4 h-4 mr-2" />
                              View
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(post.id)} disabled={deletingId === post.id}>
                            <Trash2 className="w-4 h-4 mr-2" />
                            {deletingId === post.id ? 'Deleting...' : 'Delete'}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
                {blogPosts.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-muted-foreground">
                      No blog posts found. Create one!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
