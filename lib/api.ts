// API service layer - uses dummy data for now but structured for Firebase integration
// When Firebase is configured, replace dummy data imports with Firestore queries

import {
  recipes,
  categories,
  tags,
  blogs,
  comments,
  getRecipeBySlug,
  getRecipeById,
  getRecipesByCategory,
  getFeaturedRecipes,
  getLatestRecipes,
  getRecipesByTag,
  getCategoryBySlug,
  getBlogBySlug,
  getLatestBlogs,
  getCommentsByRecipeId,
  getRelatedRecipes,
  getRelatedBlogs,
  type Recipe,
  type Category,
  type Tag,
  type Blog,
  type Comment,
} from './dummy-data'

// Recipe APIs
export async function fetchRecipeBySlug(slug: string): Promise<Recipe | null> {
  // TODO: Replace with Firestore query when Firebase is configured
  // const docRef = doc(db, 'recipes', slug)
  // const docSnap = await getDoc(docRef)
  // return docSnap.exists() ? docSnap.data() as Recipe : null
  
  return getRecipeBySlug(slug) || null
}

export async function fetchRecipeById(id: string): Promise<Recipe | null> {
  return getRecipeById(id) || null
}

export async function fetchRecipesByCategory(categorySlug: string): Promise<Recipe[]> {
  // TODO: Replace with Firestore query
  // const q = query(collection(db, 'recipes'), where('category', '==', categorySlug), where('status', '==', 'published'))
  // const querySnapshot = await getDocs(q)
  // return querySnapshot.docs.map(doc => doc.data() as Recipe)
  
  return getRecipesByCategory(categorySlug)
}

export async function fetchFeaturedRecipes(): Promise<Recipe[]> {
  return getFeaturedRecipes()
}

export async function fetchLatestRecipes(limit: number = 6): Promise<Recipe[]> {
  return getLatestRecipes(limit)
}

export async function fetchRecipesByTag(tagSlug: string): Promise<Recipe[]> {
  return getRecipesByTag(tagSlug)
}

export async function fetchAllRecipes(): Promise<Recipe[]> {
  return recipes.filter(r => r.status === 'published')
}

export async function fetchRelatedRecipes(recipeIds: string[]): Promise<Recipe[]> {
  return getRelatedRecipes(recipeIds)
}

// Category APIs
export async function fetchAllCategories(): Promise<Category[]> {
  return categories
}

export async function fetchCategoryBySlug(slug: string): Promise<Category | null> {
  return getCategoryBySlug(slug) || null
}

// Tag APIs
export async function fetchAllTags(): Promise<Tag[]> {
  return tags
}

// Blog APIs
export async function fetchBlogBySlug(slug: string): Promise<Blog | null> {
  return getBlogBySlug(slug) || null
}

export async function fetchLatestBlogs(limit: number = 3): Promise<Blog[]> {
  return getLatestBlogs(limit)
}

export async function fetchAllBlogs(): Promise<Blog[]> {
  return blogs.filter(b => b.status === 'published')
}

export async function fetchRelatedBlogs(blogIds: string[]): Promise<Blog[]> {
  return getRelatedBlogs(blogIds)
}

// Comment APIs
export async function fetchCommentsByRecipeId(recipeId: string): Promise<Comment[]> {
  return getCommentsByRecipeId(recipeId)
}

export async function submitComment(data: {
  recipeId: string
  name: string
  email: string
  comment: string
  rating: number
}): Promise<{ success: boolean; message: string }> {
  // TODO: Add to Firestore when configured
  // await addDoc(collection(db, 'comments'), {
  //   ...data,
  //   status: 'pending',
  //   createdAt: serverTimestamp(),
  // })
  
  console.log('Comment submitted:', data)
  return { success: true, message: 'Comment submitted for review!' }
}

// Newsletter APIs
export async function subscribeToNewsletter(email: string): Promise<{ success: boolean; message: string }> {
  // TODO: Add to Firestore when configured
  // await addDoc(collection(db, 'subscribers'), {
  //   email,
  //   confirmed: false,
  //   confirmToken: crypto.randomUUID(),
  //   createdAt: serverTimestamp(),
  // })
  
  console.log('Newsletter subscription:', email)
  return { success: true, message: 'Please check your email to confirm your subscription!' }
}

// Contact APIs
export async function submitContactForm(data: {
  name: string
  email: string
  message: string
}): Promise<{ success: boolean; message: string }> {
  // TODO: Add to Firestore when configured
  // await addDoc(collection(db, 'contacts'), {
  //   ...data,
  //   createdAt: serverTimestamp(),
  // })
  
  console.log('Contact form submitted:', data)
  return { success: true, message: 'Thank you for your message! We\'ll get back to you soon.' }
}

// Search API (placeholder - will use Pagefind in production)
export async function searchRecipes(query: string): Promise<Recipe[]> {
  const lowerQuery = query.toLowerCase()
  return recipes.filter(r => 
    r.status === 'published' && (
      r.title.toLowerCase().includes(lowerQuery) ||
      r.metaDescription.toLowerCase().includes(lowerQuery) ||
      r.keywords.some(k => k.toLowerCase().includes(lowerQuery)) ||
      r.ingredients.some(i => i.item.toLowerCase().includes(lowerQuery))
    )
  )
}

// Admin APIs (for future use)
export async function fetchAdminStats(): Promise<{
  recipeCount: number
  blogCount: number
  subscriberCount: number
  pendingComments: number
}> {
  return {
    recipeCount: recipes.length,
    blogCount: blogs.length,
    subscriberCount: 1247, // Dummy count
    pendingComments: comments.filter(c => c.status === 'pending').length,
  }
}
