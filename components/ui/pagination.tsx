import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PaginationProps {
  currentPage: number
  totalPages: number
  basePath: string // e.g. '/recipes' or '/blog'
}

export function Pagination({ currentPage, totalPages, basePath }: PaginationProps) {
  if (totalPages <= 1) return null

  const pages: (number | '...')[] = []

  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i)
  } else {
    pages.push(1)
    if (currentPage > 3) pages.push('...')
    const start = Math.max(2, currentPage - 1)
    const end = Math.min(totalPages - 1, currentPage + 1)
    for (let i = start; i <= end; i++) pages.push(i)
    if (currentPage < totalPages - 2) pages.push('...')
    pages.push(totalPages)
  }

  const pageHref = (p: number) =>
    p === 1 ? basePath : `${basePath}?page=${p}`

  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-center gap-1 mt-10"
    >
      {/* Prev */}
      {currentPage > 1 ? (
        <Link
          href={pageHref(currentPage - 1)}
          className="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-border text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          aria-label="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
        </Link>
      ) : (
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-border text-muted-foreground/30 cursor-not-allowed">
          <ChevronLeft className="w-4 h-4" />
        </span>
      )}

      {/* Page Numbers */}
      {pages.map((page, i) =>
        page === '...' ? (
          <span key={`ellipsis-${i}`} className="w-10 h-10 inline-flex items-center justify-center text-muted-foreground text-sm">
            …
          </span>
        ) : (
          <Link
            key={page}
            href={pageHref(page)}
            aria-current={page === currentPage ? 'page' : undefined}
            className={cn(
              'inline-flex items-center justify-center w-10 h-10 rounded-lg text-sm font-medium transition-colors',
              page === currentPage
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'border border-border text-foreground hover:bg-muted'
            )}
          >
            {page}
          </Link>
        )
      )}

      {/* Next */}
      {currentPage < totalPages ? (
        <Link
          href={pageHref(currentPage + 1)}
          className="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-border text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          aria-label="Next page"
        >
          <ChevronRight className="w-4 h-4" />
        </Link>
      ) : (
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-border text-muted-foreground/30 cursor-not-allowed">
          <ChevronRight className="w-4 h-4" />
        </span>
      )}
    </nav>
  )
}
