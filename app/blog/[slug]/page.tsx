import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { RecipeCard } from '@/components/recipe/recipe-card'
import { Newsletter } from '@/components/newsletter'
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { Clock, User, ArrowLeft } from 'lucide-react'
import { fetchBlogBySlug, fetchRelatedRecipes, fetchRelatedBlogs, fetchAllBlogs, fetchCommentsByBlogId } from '@/lib/api'
import { BlogCard } from '@/components/blog/blog-card'
import { CommentSection } from '@/components/recipe/comment-section'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface BlogPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { slug } = await params
  const blog = await fetchBlogBySlug(slug)

  if (!blog) {
    return { title: 'Blog Post Not Found' }
  }

  return {
    title: blog.seoTitle,
    description: blog.metaDescription,
    openGraph: {
      title: blog.seoTitle,
      description: blog.metaDescription,
      images: [{ url: blog.image, width: 1200, height: 630 }],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: blog.seoTitle,
      description: blog.metaDescription,
      images: [blog.image],
    },
  }
}

export async function generateStaticParams() {
  try {
    const blogs = await fetchAllBlogs()
    return blogs.map((blog) => ({
      slug: blog.slug,
    }))
  } catch {
    return []
  }
}

export default async function BlogPostPage({ params }: BlogPageProps) {
  const { slug } = await params
  const blog = await fetchBlogBySlug(slug)

  if (!blog) {
    notFound()
  }

  const [relatedRecipes, relatedBlogs, comments] = await Promise.all([
    fetchRelatedRecipes(blog.relatedRecipes),
    fetchRelatedBlogs(blog.relatedBlogs),
    fetchCommentsByBlogId(blog.id),
  ])

  return (
    <>
      <Header />
      <main className="flex-1">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* Breadcrumb */}
          <div className="hidden sm:block mb-6">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/blog">Blog</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{blog.title}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          {/* Back Link (Mobile) */}
          <Link
            href="/blog"
            className="sm:hidden flex items-center gap-1 text-sm text-muted-foreground mb-4 hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {blog.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full capitalize"
              >
                {tag.replace('-', ' ')}
              </span>
            ))}
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-foreground mb-4 text-pretty">
            {blog.title}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
            <div className="flex items-center gap-1.5">
              <User className="w-4 h-4" />
              <span>{typeof blog.author === 'string' ? blog.author : (blog.author as any)?.name || 'Admin'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              <span>{(blog as any).readTime || blog.readingTime || '5 min read'}</span>
            </div>
            <span>
              {new Date(blog.publishedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>

          {/* Hero Image */}
          <div className="relative w-full h-64 sm:h-80 lg:h-96 rounded-xl overflow-hidden mb-8">
            <Image
              src={blog.image}
              alt={blog.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Content */}
          <div 
            className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:font-bold prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

          {/* Newsletter */}
          <div className="my-12">
            <Newsletter />
          </div>

          {/* Comments */}
          <div className="my-12">
            <CommentSection blogId={blog.id} comments={comments} />
          </div>

          {/* Related Recipes */}
          {relatedRecipes.length > 0 && (
            <section className="my-12">
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-foreground mb-6">
                Related Recipes
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {relatedRecipes.map((recipe) => (
                  <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
              </div>
            </section>
          )}

          {/* Related Blog Posts */}
          {relatedBlogs.length > 0 && (
            <section className="my-12">
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-foreground mb-6">
                Related Articles
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {relatedBlogs.map((relatedBlog) => (
                  <BlogCard key={relatedBlog.id} blog={relatedBlog} />
                ))}
              </div>
            </section>
          )}
        </article>
      </main>
      <Footer />
    </>
  )
}
