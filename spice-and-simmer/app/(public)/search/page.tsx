"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link  from "next/link";

interface PagefindResult {
  url: string;
  excerpt: string;
  meta: { title?: string; image?: string; category?: string };
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQ = searchParams.get("q") || "";

  const [query,    setQuery]    = useState(initialQ);
  const [results,  setResults]  = useState<PagefindResult[]>([]);
  const [loading,  setLoading]  = useState(false);
  const [pagefind, setPagefind] = useState<any>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load Pagefind bundle (generated at build time)
  useEffect(() => {
    // @ts-ignore
    import("/pagefind/pagefind.js")
      .then((pf) => setPagefind(pf))
      .catch(() => console.warn("Pagefind not available — run a production build first"));
  }, []);

  const doSearch = useCallback(
    async (q: string) => {
      if (!pagefind || !q.trim()) {
        setResults([]);
        return;
      }
      setLoading(true);
      try {
        const search = await pagefind.search(q);
        const data: PagefindResult[] = await Promise.all(
          search.results.slice(0, 20).map((r: any) => r.data())
        );
        setResults(data);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    },
    [pagefind]
  );

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      doSearch(query);
      // Update URL without reload
      const params = new URLSearchParams();
      if (query) params.set("q", query);
      router.replace(`/search?${params.toString()}`, { scroll: false });
    }, 300);
    return () => clearTimeout(timer);
  }, [query, doSearch, router]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="container-base py-8 sm:py-12">
      {/* Search input */}
      <div className="max-w-2xl mx-auto mb-10">
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center">
          Search Recipes &amp; Articles
        </h1>
        <div className="relative">
          <label htmlFor="search-input" className="sr-only">Search</label>
          <input
            ref={inputRef}
            id="search-input"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search recipes, ingredients, tips…"
            className="w-full h-14 pl-12 pr-5 text-base bg-white border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100 transition-all"
            autoComplete="off"
            aria-label="Search recipes"
          />
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {loading && (
            <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-500 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          )}
        </div>
        {query && (
          <p className="text-sm text-gray-400 mt-2 text-center">
            {results.length} result{results.length !== 1 ? "s" : ""} for &ldquo;{query}&rdquo;
          </p>
        )}
      </div>

      {/* Results */}
      {results.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {results.map((r) => (
            <Link
              key={r.url}
              href={r.url}
              className="card group flex flex-col"
            >
              {r.meta.image && (
                <div className="relative w-full aspect-video bg-gray-100 flex-shrink-0">
                  <Image
                    src={r.meta.image}
                    alt={r.meta.title || "Recipe"}
                    fill
                    sizes="(max-width: 640px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <div className="p-4 flex-1">
                {r.meta.category && (
                  <span className="text-xs text-brand-500 font-semibold uppercase tracking-wide mb-1 block">
                    {r.meta.category}
                  </span>
                )}
                <h2 className="font-display font-bold text-gray-900 text-base leading-snug mb-2 group-hover:text-brand-600 transition-colors">
                  {r.meta.title || r.url}
                </h2>
                <p
                  className="text-xs text-gray-500 line-clamp-2 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: r.excerpt }}
                />
              </div>
            </Link>
          ))}
        </div>
      ) : query && !loading ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4" role="img" aria-hidden>🔍</div>
          <h2 className="font-display text-xl font-bold text-gray-700 mb-2">
            No results for &ldquo;{query}&rdquo;
          </h2>
          <p className="text-gray-400 text-sm mb-6">
            Try a different keyword or browse by category.
          </p>
          <Link href="/recipes" className="btn-primary">
            Browse All Recipes
          </Link>
        </div>
      ) : !query ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg">Start typing to search recipes and articles…</p>
          <p className="text-sm mt-2">
            Powered by{" "}
            <a href="https://pagefind.app" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-600">
              Pagefind
            </a>{" "}
            — instant, free, browser-based search
          </p>
        </div>
      ) : null}
    </div>
  );
}
