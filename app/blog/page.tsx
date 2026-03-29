import { Metadata } from 'next'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { BlogCard } from '@/components/blog/blog-card'
import { Pagination } from '@/components/ui/pagination'
import { fetchBlogsPaginated } from '@/lib/api'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Tips, stories, and cooking guides to help you master Indian-American fusion cooking. Learn techniques, discover ingredients, and get inspired.',
}

interface BlogPageProps {
  searchParams: Promise<{ page?: string }>
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const { page: pageParam } = await searchParams
  const currentPage = Math.max(1, parseInt(pageParam || '1', 10))
  const PER_PAGE = 9

  const { blogs, total, totalPages } = await fetchBlogsPaginated(currentPage, PER_PAGE)

  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* Page Header */}
          <div className="mb-8 sm:mb-12 text-center max-w-2xl mx-auto">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-foreground mb-3">
              From the Blog
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
              Tips, stories, and cooking guides to help you master Indian-American fusion cooking. Learn techniques, discover ingredients, and get inspired.
            </p>
          </div>

          {/* Stats row */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-muted-foreground">
              {total} article{total !== 1 ? 's' : ''}
            </p>
            {totalPages > 1 && (
              <p className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </p>
            )}
          </div>

          {/* Blog Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {blogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>

          {blogs.length === 0 && (
            <p className="text-center text-muted-foreground py-16">No blog posts found.</p>
          )}

          <Pagination currentPage={currentPage} totalPages={totalPages} basePath="/blog" />
        </div>
      </main>
      <Footer />
    </>
  )
}
