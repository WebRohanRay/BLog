import { Metadata } from 'next'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { RecipeCard } from '@/components/recipe/recipe-card'
import { CategoryCard } from '@/components/recipe/category-card'
import { fetchAllRecipes, fetchAllCategories } from '@/lib/api'

export const metadata: Metadata = {
  title: 'All Recipes',
  description: 'Browse our collection of bold, flavorful Indian-American fusion recipes. From quick weeknight dinners to impressive weekend dishes.',
}

export default async function RecipesPage() {
  const [recipes, categories] = await Promise.all([
    fetchAllRecipes(),
    fetchAllCategories(),
  ])

  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* Page Header */}
          <div className="mb-8 sm:mb-12">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-foreground mb-2">
              All Recipes
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base max-w-2xl">
              Explore our collection of Indian-American fusion recipes. Bold spices meet American comfort food for delicious meals any day of the week.
            </p>
          </div>

          {/* Categories */}
          <section className="mb-10 sm:mb-14">
            <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-4">
              Browse by Category
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          </section>

          {/* All Recipes Grid */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg sm:text-xl font-semibold text-foreground">
                All Recipes ({recipes.length})
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {recipes.map((recipe, index) => (
                <RecipeCard key={recipe.id} recipe={recipe} priority={index < 3} />
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}
