import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

import RecipeCardComponent from "@/components/recipe/RecipeCard";
import BlogCardComponent   from "@/components/blog/BlogCard";
import CategoryCard        from "@/components/ui/CategoryCard";
import NewsletterSection   from "@/components/ui/NewsletterSection";
import AdSlot              from "@/components/ui/AdSlot";

import {
  getFeaturedRecipes,
  getLatestRecipes,
} from "@/lib/firebase/recipes";
import { getAllCategories }  from "@/lib/firebase/queries";
import { getLatestBlogs }   from "@/lib/firebase/queries";

// ISR: rebuild homepage every 60 seconds
export const revalidate = 60;

export const metadata: Metadata = {
  title: "Spice & Simmer — Bold Indian-American Fusion Recipes",
  description:
    "Fast, flavorful Indian-American fusion recipes for busy home cooks. Step-by-step guides with cook mode, timers, and tips for bold meals in 30 minutes or less.",
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL,
  },
};

export default async function HomePage() {
  // Fetch all data in parallel
  const [featuredRecipes, latestRecipes, categories, latestBlogs] =
    await Promise.all([
      getFeaturedRecipes(6).catch(() => []),
      getLatestRecipes(6).catch(() => []),
      getAllCategories().catch(() => []),
      getLatestBlogs(3).catch(() => []),
    ]);

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────── */}
      <section
        className="relative min-h-[60vh] sm:min-h-[70vh] lg:min-h-[80vh] flex items-center overflow-hidden"
        aria-label="Hero section"
      >
        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=1600&q=80"
            alt="Colorful Indian-American fusion spread — Spice & Simmer"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative container-base py-16 sm:py-24">
          <div className="max-w-xl">
            {/* Eyebrow */}
            <span className="inline-flex items-center gap-2 badge-orange mb-4 text-sm">
              🌶️ Indian-American Fusion
            </span>

            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-5 leading-tight text-balance">
              Bold Flavors. <br className="hidden sm:block" />
              <span className="text-brand-400">30 Minutes.</span> <br />
              Real Life.
            </h1>

            <p className="text-brand-100 text-base sm:text-lg mb-8 leading-relaxed max-w-md">
              Step-by-step fusion recipes built for busy home cooks who want
              big flavor without the all-day kitchen commitment.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link href="/recipes" className="btn-primary btn-lg">
                Browse Recipes
              </Link>
              <Link
                href="#newsletter"
                className="btn-lg bg-white/10 text-white border border-white/30 hover:bg-white/20 backdrop-blur-sm"
              >
                Get Free PDF
              </Link>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-6 mt-10 text-white/80">
              {[
                { value: "50+", label: "Recipes" },
                { value: "30 min", label: "Avg cook time" },
                { value: "1K+", label: "Happy cooks" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-xs text-white/60 uppercase tracking-wide">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Ad below hero */}
      <div className="container-base py-4">
        <AdSlot format="banner" />
      </div>

      {/* ── Featured Recipes ─────────────────────────────── */}
      {featuredRecipes.length > 0 && (
        <section
          className="container-base py-12 sm:py-16"
          aria-labelledby="featured-heading"
        >
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 id="featured-heading" className="section-title">
                Featured Recipes
              </h2>
              <p className="section-subtitle">Our most-loved fusion hits</p>
            </div>
            <Link
              href="/recipes"
              className="hidden sm:flex items-center gap-1 text-sm font-semibold text-brand-500 hover:text-brand-700 transition-colors"
            >
              View all
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {featuredRecipes.map((recipe, i) => (
              <RecipeCardComponent key={recipe.id} recipe={recipe} priority={i < 3} />
            ))}
          </div>

          <div className="mt-6 text-center sm:hidden">
            <Link href="/recipes" className="btn-secondary">
              View all recipes →
            </Link>
          </div>
        </section>
      )}

      {/* ── Browse by Category ───────────────────────────── */}
      {categories.length > 0 && (
        <section
          className="bg-gray-50 py-12 sm:py-16"
          aria-labelledby="categories-heading"
        >
          <div className="container-base">
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 id="categories-heading" className="section-title">
                  Browse by Category
                </h2>
                <p className="section-subtitle">Find exactly what you're craving</p>
              </div>
              <Link
                href="/recipes"
                className="hidden sm:flex items-center gap-1 text-sm font-semibold text-brand-500 hover:text-brand-700 transition-colors"
              >
                All categories
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {/* 2 col mobile → 3 tablet → 6 desktop */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
              {categories.slice(0, 6).map((cat) => (
                <CategoryCard key={cat.id} category={cat} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Latest Recipes ───────────────────────────────── */}
      {latestRecipes.length > 0 && (
        <section
          className="container-base py-12 sm:py-16"
          aria-labelledby="latest-heading"
        >
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 id="latest-heading" className="section-title">
                Latest Recipes
              </h2>
              <p className="section-subtitle">Fresh off the stove</p>
            </div>
            <Link
              href="/recipes"
              className="hidden sm:flex items-center gap-1 text-sm font-semibold text-brand-500 hover:text-brand-700 transition-colors"
            >
              View all
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {latestRecipes.map((recipe) => (
              <RecipeCardComponent key={recipe.id} recipe={recipe} />
            ))}
          </div>
        </section>
      )}

      {/* ── Why Spice & Simmer ───────────────────────────── */}
      <section className="bg-brand-50 py-12 sm:py-16" aria-labelledby="why-heading">
        <div className="container-base">
          <h2 id="why-heading" className="section-title text-center mb-4">
            Why Spice &amp; Simmer?
          </h2>
          <p className="text-center section-subtitle mb-10 max-w-xl mx-auto">
            We make Indian-American fusion approachable, fast, and delicious for everyday home cooks.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: "⏱️",
                title: "30-Minute Meals",
                desc: "Every recipe is optimized for busy schedules without sacrificing flavor.",
              },
              {
                icon: "👨‍🍳",
                title: "Step-by-Step",
                desc: "Phase-by-phase guidance with optional cook mode and built-in timers.",
              },
              {
                icon: "🔥",
                title: "Bold Flavors",
                desc: "Real Indian spices, American techniques — fusion done right.",
              },
              {
                icon: "📱",
                title: "Cook Mode",
                desc: "Full-screen mobile-friendly mode keeps your screen on while you cook.",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="card-flat p-5 sm:p-6 flex flex-col items-center text-center"
              >
                <span className="text-4xl mb-3" role="img" aria-hidden>{f.icon}</span>
                <h3 className="font-display font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Newsletter ───────────────────────────────────── */}
      <NewsletterSection />

      {/* ── From the Blog ────────────────────────────────── */}
      {latestBlogs.length > 0 && (
        <section
          className="container-base py-12 sm:py-16"
          aria-labelledby="blog-heading"
        >
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 id="blog-heading" className="section-title">
                From the Blog
              </h2>
              <p className="section-subtitle">Tips, guides &amp; kitchen wisdom</p>
            </div>
            <Link
              href="/blog"
              className="hidden sm:flex items-center gap-1 text-sm font-semibold text-brand-500 hover:text-brand-700 transition-colors"
            >
              All posts
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {latestBlogs.map((blog) => (
              <BlogCardComponent key={blog.id} blog={blog} />
            ))}
          </div>
        </section>
      )}

      {/* Bottom ad */}
      <div className="container-base pb-8">
        <AdSlot format="banner" />
      </div>
    </>
  );
}
