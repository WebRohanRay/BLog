import Link from "next/link";
import Image from "next/image";
import type { BlogCard } from "@/types";
import { formatDateShort } from "@/lib/utils/helpers";

interface BlogCardProps {
  blog: BlogCard;
  priority?: boolean;
}

export default function BlogCardComponent({ blog, priority = false }: BlogCardProps) {
  const href = `/blog/${blog.slug}`;

  return (
    <article className="card group flex flex-col h-full">
      {/* Image */}
      <Link href={href} className="block overflow-hidden flex-shrink-0" tabIndex={-1} aria-hidden="true">
        <div className="relative w-full aspect-video bg-gray-100">
          <Image
            src={blog.image || "/images/placeholder.jpg"}
            alt={`${blog.title} — Spice & Simmer Blog`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            priority={priority}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = "/images/placeholder.jpg";
            }}
          />
        </div>
      </Link>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 sm:p-5">
        {/* Tags */}
        {blog.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {blog.tags.slice(0, 2).map((tag) => (
              <Link
                key={tag}
                href={`/tags/${tag.toLowerCase().replace(/\s+/g, "-")}`}
                className="badge-orange text-[11px]"
              >
                {tag}
              </Link>
            ))}
          </div>
        )}

        {/* Title */}
        <h3 className="font-display font-bold text-gray-900 text-base sm:text-lg leading-snug mb-2 line-clamp-2 group-hover:text-brand-600 transition-colors">
          <Link href={href}>{blog.title}</Link>
        </h3>

        {/* Excerpt */}
        <p className="text-sm text-gray-500 line-clamp-2 mb-4 leading-relaxed">
          {blog.excerpt}
        </p>

        {/* Meta */}
        <div className="flex items-center justify-between mt-auto text-xs text-gray-400 pt-3 border-t border-gray-100">
          <span>{blog.publishedAt ? formatDateShort(blog.publishedAt) : "Draft"}</span>
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {blog.readingTime} min read
          </span>
        </div>
      </div>
    </article>
  );
}
