import Image from 'next/image'
import Link from 'next/link'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { RecipeCard } from '@/components/recipe/recipe-card'
import { CategoryCard } from '@/components/recipe/category-card'
import { Newsletter } from '@/components/newsletter'
import { BlogCard } from '@/components/blog/blog-card'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import {
  fetchFeaturedRecipes,
  fetchLatestRecipes,
  fetchAllCategories,
  fetchLatestBlogs,
} from '@/lib/api'

export default async function HomePage() {
  const [featuredRecipes, latestRecipes, categories, latestBlogs] = await Promise.all([
    fetchFeaturedRecipes(),
    fetchLatestRecipes(6),
    fetchAllCategories(),
    fetchLatestBlogs(3),
  ])

  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative min-h-[60vh] sm:min-h-[70vh] flex items-center">
          <Image
            src="https://images.unsplash.com/photo-1596797038530-2c107229654b?w=1600&h=900&fit=crop"
            alt="Spice & Simmer - Indian-American fusion cooking"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
            <div className="max-w-2xl">
              <span className="inline-block px-3 py-1 text-xs sm:text-sm font-medium bg-primary text-primary-foreground rounded-full mb-4">
                Indian-American Fusion
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-6xl font-serif font-bold text-white mb-4 sm:mb-6 leading-tight">
                Bold Flavors for Busy Home Cooks
              </h1>
              <p className="text-base sm:text-xl text-white/90 mb-6 sm:mb-8 max-w-xl leading-relaxed">
                Discover delicious Indian-American fusion recipes that bring exciting spices to your everyday cooking. Fast, flavorful meals in 30 minutes or less.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Link href="/recipes">
                  <Button size="lg" className="w-full sm:w-auto min-h-[52px] px-8 text-base font-semibold">
                    Explore Recipes
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/about">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto min-h-[52px] px-8 text-base font-semibold bg-white/10 border-white/30 text-white hover:bg-white/20">
                    Meet the Chef
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Ad Slot Placeholder */}
        <div className="min-h-[90px] bg-muted flex items-center justify-center text-muted-foreground text-sm">
          Ad Space
        </div>

        {/* Featured Recipes */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-foreground">
                Featured Recipes
              </h2>
              <p className="text-muted-foreground mt-1">Our most popular fusion dishes</p>
            </div>
            <Link href="/recipes" className="hidden sm:block">
              <Button variant="ghost" className="font-medium">
                View All
                <ArrowRight className="ml-1 w-4 h-4" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {featuredRecipes.slice(0, 3).map((recipe, index) => (
              <RecipeCard key={recipe.id} recipe={recipe} priority={index === 0} />
            ))}
          </div>
          <Link href="/recipes" className="sm:hidden block mt-6 text-center">
            <Button variant="outline" className="w-full">
              View All Recipes
              <ArrowRight className="ml-1 w-4 h-4" />
            </Button>
          </Link>
        </section>

        {/* Categories */}
        <section className="bg-secondary py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-foreground">
                Browse by Category
              </h2>
              <p className="text-muted-foreground mt-1">Find the perfect dish for any occasion</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          </div>
        </section>

        {/* Latest Recipes */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-foreground">
                Latest Recipes
              </h2>
              <p className="text-muted-foreground mt-1">Fresh from the kitchen</p>
            </div>
            <Link href="/recipes" className="hidden sm:block">
              <Button variant="ghost" className="font-medium">
                View All
                <ArrowRight className="ml-1 w-4 h-4" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {latestRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <Newsletter />
        </section>

        {/* Latest Blog Posts */}
        <section className="bg-secondary py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-foreground">
                  From the Blog
                </h2>
                <p className="text-muted-foreground mt-1">Tips, stories & cooking guides</p>
              </div>
              <Link href="/blog" className="hidden sm:block">
                <Button variant="ghost" className="font-medium">
                  All Posts
                  <ArrowRight className="ml-1 w-4 h-4" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              {latestBlogs.map((blog) => (
                <BlogCard key={blog.id} blog={blog} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
