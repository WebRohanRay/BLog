import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { RecipeCard } from '@/components/recipe/recipe-card'
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { fetchCategoryBySlug, fetchRecipesByCategory, fetchAllCategories } from '@/lib/api'


interface CategoryPageProps {
  params: Promise<{ category: string }>
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category: categorySlug } = await params
  const category = await fetchCategoryBySlug(categorySlug)
  
  if (!category) {
    return { title: 'Category Not Found' }
  }

  return {
    title: `${category.name} Recipes`,
    description: category.seoIntro,
    openGraph: {
      title: `${category.name} Recipes | Spice & Simmer`,
      description: category.seoIntro,
      images: [{ url: category.image, width: 1200, height: 630 }],
    },
  }
}

export async function generateStaticParams() {
  const categories = await fetchAllCategories()
  if (!categories || !Array.isArray(categories)) return []
  return categories.map((category: any) => ({
    category: category.slug,
  }))
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category: categorySlug } = await params
  const [category, recipes] = await Promise.all([
    fetchCategoryBySlug(categorySlug),
    fetchRecipesByCategory(categorySlug),
  ])

  if (!category) {
    notFound()
  }

  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* Breadcrumb */}
          <div className="hidden sm:block mb-6">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/recipes">Recipes</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{category.name}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          {/* Page Header */}
          <div className="mb-8 sm:mb-12">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-foreground mb-4">
              {category.name} Recipes
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed max-w-3xl">
              {category.seoIntro}
            </p>
          </div>

          {/* Recipes Grid */}
          {recipes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {recipes.map((recipe, index) => (
                <RecipeCard key={recipe.id} recipe={recipe} priority={index < 3} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg mb-4">
                No recipes in this category yet.
              </p>
              <Link
                href="/recipes"
                className="text-primary font-medium hover:underline"
              >
                Browse all recipes
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
