"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";

interface PaginationProps {
  total: number;
  page: number;
  perPage: number;
}

export default function Pagination({ total, page, perPage }: PaginationProps) {
  const totalPages = Math.ceil(total / perPage);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const goTo = useCallback(
    (p: number) => {
      const params = new URLSearchParams(searchParams.toString());
      if (p === 1) params.delete("page");
      else params.set("page", String(p));
      router.push(`${pathname}?${params.toString()}`, { scroll: true });
    },
    [pathname, router, searchParams]
  );

  if (totalPages <= 1) return null;

  // Build page number list with ellipsis
  const getPageNumbers = () => {
    const delta = 2;
    const range: (number | "...")[] = [];
    const rangeWithDots: (number | "...")[] = [];
    let l: number | undefined;

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= page - delta && i <= page + delta)) {
        range.push(i);
      }
    }

    for (const i of range) {
      if (l !== undefined) {
        if (typeof i === "number" && i - (l as number) === 2) {
          rangeWithDots.push(l + 1);
        } else if (typeof i === "number" && i - (l as number) !== 1) {
          rangeWithDots.push("...");
        }
      }
      rangeWithDots.push(i);
      l = i as number;
    }

    return rangeWithDots;
  };

  return (
    <nav
      className="flex items-center justify-center gap-2 mt-10 flex-wrap"
      aria-label="Pagination navigation"
    >
      {/* Previous */}
      <button
        onClick={() => goTo(page - 1)}
        disabled={page === 1}
        className="pagination-btn"
        aria-label="Previous page"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Page numbers */}
      {getPageNumbers().map((p, i) =>
        p === "..." ? (
          <span key={`dots-${i}`} className="px-2 text-gray-400 select-none">
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => goTo(p as number)}
            className={p === page ? "pagination-btn-active" : "pagination-btn"}
            aria-label={`Page ${p}`}
            aria-current={p === page ? "page" : undefined}
          >
            {p}
          </button>
        )
      )}

      {/* Next */}
      <button
        onClick={() => goTo(page + 1)}
        disabled={page === totalPages}
        className="pagination-btn"
        aria-label="Next page"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Summary */}
      <span className="text-xs text-gray-400 ml-2">
        Page {page} of {totalPages}
      </span>
    </nav>
  );
}
