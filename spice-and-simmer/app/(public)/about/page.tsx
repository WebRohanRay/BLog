import type { Metadata } from "next";
import Image from "next/image";
import Link  from "next/link";
import Breadcrumb from "@/components/layout/Breadcrumb";

export const metadata: Metadata = {
  title: "About Us — Spice & Simmer",
  description:
    "Meet the team behind Spice & Simmer. We're passionate home cooks sharing bold Indian-American fusion recipes for busy weeknights.",
  alternates: { canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/about` },
};

export default function AboutPage() {
  return (
    <div className="container-base py-8 sm:py-12">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "About" }]} />

      <div className="max-w-3xl mx-auto">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-4" role="img" aria-hidden>🌶️</div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            About Spice &amp; Simmer
          </h1>
          <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
            We believe that bold, restaurant-quality Indian-American fusion meals
            should be accessible to any home cook — regardless of skill level or
            how much time they have on a weeknight.
          </p>
        </div>

        {/* Story */}
        <div className="relative w-full rounded-2xl overflow-hidden mb-10 bg-gray-100"
          style={{ aspectRatio: "16/9" }}
        >
          <Image
            src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1200&q=80"
            alt="Home kitchen cooking Indian-American fusion food"
            fill
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
          />
        </div>

        <div className="prose prose-sm sm:prose max-w-none prose-headings:font-display prose-a:text-brand-500 mb-12">
          <h2>Our Story</h2>
          <p>
            Spice &amp; Simmer started as a personal blog in 2023, born from a simple
            frustration: Indian recipes online were either too complex, too
            watered-down, or too slow for busy weeknights. And American fusion
            recipes often missed the authentic depth of spice that makes Indian
            food so special.
          </p>
          <p>
            We set out to bridge that gap — creating recipes that honor real
            Indian flavors while incorporating American cooking techniques and
            ingredients that make them approachable for home cooks everywhere.
          </p>
          <h2>What Makes Us Different</h2>
          <p>
            Every recipe on Spice &amp; Simmer is built with busy home cooks in mind.
            We include step-by-step cook mode with built-in timers, detailed
            phase-by-phase instructions, and honest tips about common mistakes.
            Our goal is that you feel confident in the kitchen — not overwhelmed.
          </p>
          <h2>Our Promise</h2>
          <p>
            We never publish a recipe we haven&apos;t tested multiple times in a real
            home kitchen. Every ingredient list is realistic, every timing is
            accurate, and every step is explained clearly.
          </p>
        </div>

        {/* Values grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          {[
            { icon: "🔥", title: "Authentic Flavor", desc: "Real spices, real techniques — never watered down." },
            { icon: "⏱️", title: "Weeknight Friendly", desc: "30-minute meals designed for real life schedules." },
            { icon: "📖", title: "Teach, Don't Just Tell", desc: "Understand the why behind every step." },
          ].map((v) => (
            <div key={v.title} className="card-flat p-5 text-center">
              <span className="text-4xl mb-3 block" role="img" aria-hidden>{v.icon}</span>
              <h3 className="font-display font-bold text-gray-900 mb-2">{v.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link href="/recipes" className="btn-primary btn-lg mr-3">
            Browse Recipes
          </Link>
          <Link href="/contact" className="btn-secondary btn-lg">
            Get in Touch
          </Link>
        </div>
      </div>
    </div>
  );
}
