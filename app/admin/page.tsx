import { Metadata } from 'next'
import Link from 'next/link'
import { BookOpen, FileText, Users, MessageSquare, Plus, Eye, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { fetchAdminStats, fetchLatestRecipes, fetchLatestBlogs } from '@/lib/api'

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  robots: { index: false, follow: false },
}

export default async function AdminDashboardPage() {
  const [stats, latestRecipes, latestBlogs] = await Promise.all([
    fetchAdminStats(),
    fetchLatestRecipes(5),
    fetchLatestBlogs(5),
  ])

  const statCards = [
    {
      title: 'Total Recipes',
      value: stats.recipeCount,
      icon: BookOpen,
      href: '/admin/recipes',
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
    },
    {
      title: 'Blog Posts',
      value: stats.blogCount,
      icon: FileText,
      href: '/admin/blogs',
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Subscribers',
      value: stats.subscriberCount.toLocaleString(),
      icon: Users,
      href: '/admin/subscribers',
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      title: 'Pending Comments',
      value: stats.pendingComments,
      icon: MessageSquare,
      href: '/admin/comments',
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
  ]

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-foreground">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Welcome back! Here&apos;s what&apos;s happening with your site.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/recipes/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Recipe
            </Button>
          </Link>
          <Link href="/admin/blogs/new">
            <Button variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              New Post
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat) => (
          <Link key={stat.title} href={stat.href}>
            <Card className="hover:border-primary/50 transition-colors">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.title}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Recent Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Recipes */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold">Recent Recipes</CardTitle>
            <Link href="/admin/recipes">
              <Button variant="ghost" size="sm">View All</Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {latestRecipes.map((recipe) => (
                <div key={recipe.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-foreground truncate">{recipe.title}</p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {(recipe.viewCount || (recipe as any).stats?.views || 0).toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        {recipe.ratingAvg.toFixed(1)}
                      </span>
                    </div>
                  </div>
                  <Link href={`/admin/recipes/${recipe.id}/edit`}>
                    <Button variant="ghost" size="sm">Edit</Button>
                  </Link>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Blog Posts */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold">Recent Blog Posts</CardTitle>
            <Link href="/admin/blogs">
              <Button variant="ghost" size="sm">View All</Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {latestBlogs.map((blog) => (
                <div key={blog.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-foreground truncate">{blog.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(blog.publishedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Link href={`/admin/blogs/${blog.id}/edit`}>
                    <Button variant="ghost" size="sm">Edit</Button>
                  </Link>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Link href="/admin/recipes/new">
              <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2">
                <BookOpen className="w-5 h-5" />
                <span className="text-sm">Add Recipe</span>
              </Button>
            </Link>
            <Link href="/admin/blogs/new">
              <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2">
                <FileText className="w-5 h-5" />
                <span className="text-sm">Write Post</span>
              </Button>
            </Link>
            <Link href="/admin/comments">
              <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2">
                <MessageSquare className="w-5 h-5" />
                <span className="text-sm">Moderate</span>
              </Button>
            </Link>
            <Link href="/" target="_blank">
              <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2">
                <Eye className="w-5 h-5" />
                <span className="text-sm">View Site</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
