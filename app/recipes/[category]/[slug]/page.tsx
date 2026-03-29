import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { RecipeSteps } from '@/components/recipe/recipe-steps'
import { RecipeIngredients } from '@/components/recipe/recipe-ingredients'
import { RecipeRating } from '@/components/recipe/recipe-rating'
import { RecipeCard } from '@/components/recipe/recipe-card'
import { CommentSection } from '@/components/recipe/comment-section'
import { Newsletter } from '@/components/newsletter'
import { Button } from '@/components/ui/button'
import { 
  Clock, 
  Users, 
  ChefHat, 
  Printer, 
  Share2, 
  BookmarkPlus,
  Flame,
  Star
} from 'lucide-react'
import { fetchRecipeBySlug, fetchRelatedRecipes, fetchCommentsByRecipeId } from '@/lib/api'
import { recipes } from '@/lib/dummy-data'

interface RecipePageProps {
  params: Promise<{ category: string; slug: string }>
}

export async function generateMetadata({ params }: RecipePageProps): Promise<Metadata> {
  const { slug } = await params
  const recipe = await fetchRecipeBySlug(slug)
  
  if (!recipe) {
    return { title: 'Recipe Not Found' }
  }

  return {
    title: recipe.seoTitle,
    description: recipe.metaDescription,
    keywords: recipe.keywords,
    openGraph: {
      title: recipe.seoTitle,
      description: recipe.metaDescription,
      images: [{ url: recipe.image, width: 1200, height: 630 }],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: recipe.seoTitle,
      description: recipe.metaDescription,
      images: [recipe.image],
    },
    alternates: {
      canonical: `/recipes/${recipe.category}/${recipe.slug}`,
    },
  }
}

export async function generateStaticParams() {
  return recipes
    .filter(r => r.status === 'published')
    .map((recipe) => ({
      category: recipe.category,
      slug: recipe.slug,
    }))
}

export default async function RecipePage({ params }: RecipePageProps) {
  const { slug } = await params
  const recipe = await fetchRecipeBySlug(slug)

  if (!recipe) {
    notFound()
  }

  const [relatedRecipes, comments] = await Promise.all([
    fetchRelatedRecipes(recipe.relatedRecipes),
    fetchCommentsByRecipeId(recipe.id),
  ])

  const categoryName = recipe.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())

  // JSON-LD Schema
  const recipeSchema = {
    '@context': 'https://schema.org',
    '@type': 'Recipe',
    name: recipe.title,
    image: recipe.image,
    description: recipe.metaDescription,
    prepTime: `PT${recipe.prepTime}M`,
    cookTime: `PT${recipe.cookTime}M`,
    totalTime: `PT${recipe.totalTime}M`,
    recipeYield: `${recipe.servings} servings`,
    recipeIngredient: recipe.ingredients.map(i => `${i.amount} ${i.unit} ${i.item}`),
    recipeInstructions: recipe.steps.map(s => ({
      '@type': 'HowToStep',
      position: s.stepNumber,
      name: s.title,
      text: s.description,
    })),
    nutrition: {
      '@type': 'NutritionInformation',
      calories: `${recipe.nutrition.calories} calories`,
      proteinContent: `${recipe.nutrition.protein}g`,
      carbohydrateContent: `${recipe.nutrition.carbs}g`,
      fatContent: `${recipe.nutrition.fat}g`,
    },
    aggregateRating: recipe.ratingCount > 0 ? {
      '@type': 'AggregateRating',
      ratingValue: recipe.ratingAvg,
      reviewCount: recipe.ratingCount,
    } : undefined,
  }

  const faqSchema = recipe.faqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: recipe.faqs.map(f => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  } : null

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(recipeSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      
      <Header />
      <main className="flex-1">
        <article className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
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
                  <BreadcrumbLink href={`/recipes/${recipe.category}`}>{categoryName}</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{recipe.title}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          {/* Two Column Layout */}
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            {/* Main Content */}
            <div className="w-full lg:w-2/3 min-w-0">
              {/* Title & Rating */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-foreground mb-3 text-pretty">
                {recipe.title}
              </h1>
              
              <RecipeRating rating={recipe.ratingAvg} count={recipe.ratingCount} />

              {/* Hero Image */}
              <div className="relative w-full h-64 sm:h-80 lg:h-96 rounded-xl overflow-hidden my-6">
                <Image
                  src={recipe.image}
                  alt={`${recipe.title} recipe - Spice & Simmer`}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 66vw"
                />
              </div>

              {/* Quick Actions */}
              <div className="flex flex-wrap gap-2 mb-6">
                <Button variant="outline" size="sm" className="min-h-[44px]">
                  <Printer className="w-4 h-4 mr-2" />
                  Print
                </Button>
                <Button variant="outline" size="sm" className="min-h-[44px]">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
                <Button variant="outline" size="sm" className="min-h-[44px]">
                  <BookmarkPlus className="w-4 h-4 mr-2" />
                  Save
                </Button>
              </div>

              {/* Time & Difficulty Badges */}
              <div className="flex flex-wrap gap-3 mb-6">
                <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <div className="text-sm">
                    <span className="text-muted-foreground">Prep:</span>{' '}
                    <span className="font-medium">{recipe.prepTime} min</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg">
                  <Flame className="w-4 h-4 text-muted-foreground" />
                  <div className="text-sm">
                    <span className="text-muted-foreground">Cook:</span>{' '}
                    <span className="font-medium">{recipe.cookTime} min</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <div className="text-sm">
                    <span className="text-muted-foreground">Serves:</span>{' '}
                    <span className="font-medium">{recipe.servings}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg">
                  <ChefHat className="w-4 h-4 text-muted-foreground" />
                  <div className="text-sm">
                    <span className="font-medium">{recipe.difficulty}</span>
                  </div>
                </div>
              </div>

              {/* Jump to Recipe */}
              <a
                href="#ingredients"
                className="inline-block mb-8 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                Jump to Recipe
              </a>

              {/* Intro */}
              <p className="text-muted-foreground leading-relaxed mb-8">
                {recipe.metaDescription}
              </p>

              {/* Ad Slot */}
              <div className="min-h-[90px] bg-muted rounded-xl flex items-center justify-center text-muted-foreground text-sm mb-8">
                Ad Space
              </div>

              {/* Ingredients */}
              <section id="ingredients" className="mb-10 scroll-mt-24">
                <RecipeIngredients ingredients={recipe.ingredients} servings={recipe.servings} />
              </section>

              {/* Ad Slot */}
              <div className="min-h-[90px] bg-muted rounded-xl flex items-center justify-center text-muted-foreground text-sm mb-8">
                Ad Space
              </div>

              {/* Steps */}
              <section id="steps" className="mb-10">
                <RecipeSteps steps={recipe.steps} recipeId={recipe.id} recipeTitle={recipe.title} />
              </section>

              {/* Tips & Tricks */}
              {recipe.tips.length > 0 && (
                <section className="mb-8">
                  <h2 className="text-xl sm:text-2xl font-serif font-bold text-foreground mb-4">
                    Tips & Tricks
                  </h2>
                  <ul className="space-y-2">
                    {recipe.tips.map((tip, index) => (
                      <li key={index} className="flex items-start gap-3 text-sm sm:text-base text-muted-foreground">
                        <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 text-xs font-medium mt-0.5">
                          {index + 1}
                        </span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Common Mistakes */}
              {recipe.mistakes.length > 0 && (
                <section className="mb-8">
                  <h2 className="text-xl sm:text-2xl font-serif font-bold text-foreground mb-4">
                    Common Mistakes to Avoid
                  </h2>
                  <ul className="space-y-2">
                    {recipe.mistakes.map((mistake, index) => (
                      <li key={index} className="flex items-start gap-3 text-sm sm:text-base text-muted-foreground">
                        <span className="w-6 h-6 rounded-full bg-destructive/10 text-destructive flex items-center justify-center flex-shrink-0 text-xs">
                          !
                        </span>
                        {mistake}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Variations */}
              {recipe.variations.length > 0 && (
                <section className="mb-8">
                  <h2 className="text-xl sm:text-2xl font-serif font-bold text-foreground mb-4">
                    Variations
                  </h2>
                  <ul className="space-y-2">
                    {recipe.variations.map((variation, index) => (
                      <li key={index} className="flex items-start gap-3 text-sm sm:text-base text-muted-foreground">
                        <Star className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        {variation}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Nutrition */}
              <section className="mb-8">
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-foreground mb-4">
                  Nutrition Information
                </h2>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                  {Object.entries(recipe.nutrition).map(([key, value]) => (
                    <div key={key} className="text-center p-3 bg-muted rounded-lg">
                      <p className="text-lg sm:text-xl font-bold text-foreground">
                        {value}{key !== 'calories' && 'g'}
                      </p>
                      <p className="text-xs text-muted-foreground capitalize">{key}</p>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  * Per serving. Nutritional values are estimates.
                </p>
              </section>

              {/* FAQs */}
              {recipe.faqs.length > 0 && (
                <section className="mb-8">
                  <h2 className="text-xl sm:text-2xl font-serif font-bold text-foreground mb-4">
                    Frequently Asked Questions
                  </h2>
                  <div className="space-y-4">
                    {recipe.faqs.map((faq, index) => (
                      <div key={index} className="border border-border rounded-lg p-4">
                        <h3 className="font-semibold text-foreground mb-2">{faq.question}</h3>
                        <p className="text-sm text-muted-foreground">{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Related Recipes */}
              {relatedRecipes.length > 0 && (
                <section className="mb-8">
                  <h2 className="text-xl sm:text-2xl font-serif font-bold text-foreground mb-4">
                    Related Recipes
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {relatedRecipes.map((related) => (
                      <RecipeCard key={related.id} recipe={related} />
                    ))}
                  </div>
                </section>
              )}

              {/* Comments */}
              <section className="mb-8">
                <CommentSection recipeId={recipe.id} comments={comments} />
              </section>
            </div>

            {/* Sidebar */}
            <aside className="w-full lg:w-1/3 lg:sticky lg:top-24 lg:self-start">
              {/* Ad Slot */}
              <div className="min-h-[250px] bg-muted rounded-xl flex items-center justify-center text-muted-foreground text-sm mb-6">
                Sidebar Ad
              </div>

              {/* Newsletter */}
              <div className="mb-6">
                <Newsletter />
              </div>

              {/* Popular Tags */}
              <div className="p-6 bg-card border border-border rounded-xl">
                <h3 className="font-semibold text-foreground mb-3">Recipe Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {recipe.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/tags/${tag}`}
                      className="px-3 py-1.5 text-sm bg-muted text-muted-foreground rounded-full hover:bg-primary hover:text-primary-foreground transition-colors capitalize"
                    >
                      {tag.replace('-', ' ')}
                    </Link>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </article>
      </main>
      <Footer />
    </>
  )
}
