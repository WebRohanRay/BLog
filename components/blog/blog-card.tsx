import Image from 'next/image'
import Link from 'next/link'
import { Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Blog } from '@/lib/dummy-data'

interface BlogCardProps {
  blog: Blog
  className?: string
}

export function BlogCard({ blog, className }: BlogCardProps) {
  return (
    <Link
      href={`/blog/${blog.slug}`}
      className={cn(
        'group block bg-card rounded-xl overflow-hidden border border-border shadow-sm hover:shadow-lg transition-all duration-300',
        className
      )}
    >
      {/* Image */}
      <div className="relative w-full h-40 sm:h-48 overflow-hidden">
        <Image
          src={blog.image}
          alt={blog.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, 33vw"
        />
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5">
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-2">
          {blog.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="text-xs font-medium text-primary capitalize"
            >
              #{tag.replace('-', ' ')}
            </span>
          ))}
        </div>

        {/* Title */}
        <h3 className="text-base sm:text-lg font-semibold text-card-foreground line-clamp-2 group-hover:text-primary transition-colors mb-2">
          {blog.title}
        </h3>

        {/* Excerpt */}
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {blog.excerpt}
        </p>

        {/* Meta */}
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="w-3.5 h-3.5" />
          <span>{blog.readingTime} min read</span>
        </div>
      </div>
    </Link>
  )
}
