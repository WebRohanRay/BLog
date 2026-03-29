import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found — Spice & Simmer",
  robots: { index: false },
};

export default function NotFound() {
  const SUGGESTIONS = [
    { label: "Browse All Recipes", href: "/recipes" },
    { label: "Fusion Mains",       href: "/recipes/fusion-mains" },
    { label: "Quick Dinners",      href: "/recipes/quick-dinners" },
    { label: "Read the Blog",      href: "/blog" },
    { label: "Contact Us",         href: "/contact" },
  ];

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-lg mx-auto animate-fade-in">
        {/* Big emoji */}
        <div className="text-8xl mb-6" role="img" aria-label="Confused chef">
          🍳
        </div>

        {/* Headline */}
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
          Oops! Recipe Not Found
        </h1>
        <p className="text-gray-500 text-base sm:text-lg mb-8 leading-relaxed">
          Looks like this page went missing — maybe it was eaten? Let&apos;s get you
          back to the good stuff.
        </p>

        {/* Quick links */}
        <div className="flex flex-wrap gap-3 justify-center mb-8">
          {SUGGESTIONS.map((s) => (
            <Link key={s.href} href={s.href} className="btn-secondary btn-sm">
              {s.label}
            </Link>
          ))}
        </div>

        {/* Home CTA */}
        <Link href="/" className="btn-primary btn-lg">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
