// API service layer - uses dummy data for now but structured for Firebase integration
// When Firebase is configured, replace dummy data imports with Firestore queries

import { db } from './firebase'
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit as limitFn,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore'
import { categories as dummyCategories, blogs as dummyBlogs, type Recipe, type Category, type Tag, type Blog, type Comment } from './dummy-data'

function sortBlogsByCreatedAtDesc(list: Blog[]): Blog[] {
  return [...list].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

function getDummyPublishedBlogs(): Blog[] {
  return sortBlogsByCreatedAtDesc(dummyBlogs.filter(blog => blog.status === 'published'))
}

function getDummyAllBlogs(includeDrafts: boolean): Blog[] {
  return includeDrafts ? sortBlogsByCreatedAtDesc(dummyBlogs) : getDummyPublishedBlogs()
}

// Re-export types so components can import from @/lib/api
export type { Recipe, Category, Tag, Blog, Comment }

// Recipe APIs
export async function fetchRecipeBySlug(slug: string): Promise<Recipe | null> {
  const q = query(collection(db, 'recipes'), where('slug', '==', slug), where('status', '==', 'published'))
  const snapshot = await getDocs(q)
  if (snapshot.empty) return null
  const docSnap = snapshot.docs[0]
  return { id: docSnap.id, ...docSnap.data() } as Recipe
}

export async function fetchRecipeById(id: string): Promise<Recipe | null> {
  const docRef = doc(db, 'recipes', id)
  const docSnap = await getDoc(docRef)
  if (!docSnap.exists()) return null
  return { id: docSnap.id, ...docSnap.data() } as Recipe
}

export async function fetchRecipesByCategory(categorySlug: string): Promise<Recipe[]> {
  const q = query(collection(db, 'recipes'), where('category', '==', categorySlug), where('status', '==', 'published'))
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Recipe))
}

export async function fetchFeaturedRecipes(): Promise<Recipe[]> {
  const q = query(collection(db, 'recipes'), where('featured', '==', true), where('status', '==', 'published'))
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Recipe))
}

export async function fetchLatestRecipes(limit: number = 6): Promise<Recipe[]> {
  const q = query(collection(db, 'recipes'), where('status', '==', 'published'), orderBy('createdAt', 'desc'), limitFn(limit))
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Recipe))
}

export async function fetchRecipesByTag(tagSlug: string): Promise<Recipe[]> {
  const q = query(collection(db, 'recipes'), where('tags', 'array-contains', tagSlug), where('status', '==', 'published'))
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Recipe))
}

export async function updateRecipe(id: string, recipeData: any): Promise<void> {
  const docRef = doc(db, 'recipes', id)
  await updateDoc(docRef, {
    ...recipeData,
    updatedAt: serverTimestamp(),
  })
}

export async function deleteRecipe(id: string): Promise<void> {
  const docRef = doc(db, 'recipes', id)
  await deleteDoc(docRef)
}

export async function fetchAllRecipes(includeDrafts: boolean = false): Promise<Recipe[]> {
  const recipesRef = collection(db, 'recipes')
  const q = includeDrafts 
    ? query(recipesRef)
    : query(recipesRef, where('status', '==', 'published'))
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Recipe))
}

export async function fetchRecipesPaginated(
  page: number = 1,
  perPage: number = 9,
  includeDrafts: boolean = false
): Promise<{ recipes: Recipe[]; total: number; totalPages: number }> {
  const recipesRef = collection(db, 'recipes')
  const q = includeDrafts 
    ? query(recipesRef, orderBy('createdAt', 'desc'))
    : query(recipesRef, where('status', '==', 'published'), orderBy('createdAt', 'desc'))
  const snapshot = await getDocs(q)
  const all = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Recipe))
  const total = all.length
  const totalPages = Math.max(1, Math.ceil(total / perPage))
  const safePage = Math.min(Math.max(1, page), totalPages)
  const recipes = all.slice((safePage - 1) * perPage, safePage * perPage)
  return { recipes, total, totalPages }
}

export async function createRecipe(recipeData: Omit<Recipe, 'id'>): Promise<string> {
  const docRef = await addDoc(collection(db, 'recipes'), {
    ...recipeData,
    createdAt: new Date().toISOString()
  });
  return docRef.id;
}

export async function fetchRelatedRecipes(recipeIds: string[] = []): Promise<Recipe[]> {
  if (!recipeIds || !recipeIds.length) return []
  const q = query(collection(db, 'recipes'), where('__name__', 'in', recipeIds))
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Recipe))
}

// Category APIs
export async function fetchAllCategories(): Promise<Category[]> {
  try {
    const snapshot = await getDocs(collection(db, 'categories'))
    if (!snapshot.empty) {
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category))
    }
  } catch (error) {
    console.warn("Failed to fetch categories from Firebase, using dummy data.", error)
  }
  return dummyCategories
}

export async function fetchCategoryBySlug(slug: string): Promise<Category | null> {
  const docRef = doc(db, 'categories', slug)
  const docSnap = await getDoc(docRef)
  if (!docSnap.exists()) {
    // Fallback block if document ID pattern is different
    const q = query(collection(db, 'categories'), where('slug', '==', slug))
    const snapshot = await getDocs(q)
    if (snapshot.empty) return null
    const fallBackDoc = snapshot.docs[0]
    return { id: fallBackDoc.id, ...fallBackDoc.data() } as Category
  }
  return { id: docSnap.id, ...docSnap.data() } as Category
}

export async function createCategory(category: Category): Promise<void> {
  const docRef = doc(db, 'categories', category.slug)
  await setDoc(docRef, category)
}

export async function updateCategory(slug: string, data: Partial<Category>): Promise<void> {
  const docRef = doc(db, 'categories', slug)
  await setDoc(docRef, data, { merge: true })
}

export async function deleteCategory(slug: string): Promise<void> {
  const docRef = doc(db, 'categories', slug)
  await deleteDoc(docRef)
}

// Tag APIs
export async function fetchAllTags(): Promise<Tag[]> {
  const snapshot = await getDocs(collection(db, 'tags'))
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Tag))
}

// Blog APIs
export async function fetchBlogBySlug(slug: string): Promise<Blog | null> {
  try {
    const q = query(collection(db, 'blogs'), where('slug', '==', slug), where('status', '==', 'published'))
    const snapshot = await getDocs(q)
    if (!snapshot.empty) {
      const docSnap = snapshot.docs[0]
      return { id: docSnap.id, ...docSnap.data() } as Blog
    }
  } catch (error) {
    console.warn('Failed to fetch blog by slug from Firebase, using dummy data.', error)
  }

  return dummyBlogs.find(blog => blog.slug === slug && blog.status === 'published') ?? null
}

export async function fetchLatestBlogs(limit: number = 3, featuredOnly: boolean = false): Promise<Blog[]> {
  try {
    const blogsRef = collection(db, 'blogs')
    let q = query(blogsRef, where('status', '==', 'published'), orderBy('createdAt', 'desc'), limitFn(limit))

    if (featuredOnly) {
      q = query(blogsRef, where('status', '==', 'published'), where('featured', '==', true), orderBy('createdAt', 'desc'), limitFn(limit))
    }

    const snapshot = await getDocs(q)
    const results = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Blog))

    if (featuredOnly && results.length < limit) {
      const fallbackQ = query(blogsRef, where('status', '==', 'published'), orderBy('createdAt', 'desc'), limitFn(limit))
      const fallbackSnapshot = await getDocs(fallbackQ)
      const fallbackResults = fallbackSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Blog))
      if (fallbackResults.length > 0) return fallbackResults
    }

    if (results.length > 0) return results
  } catch (error) {
    console.warn('Failed to fetch latest blogs from Firebase, using dummy data.', error)
  }

  const published = getDummyPublishedBlogs()
  if (featuredOnly) {
    const featured = published.filter(blog => blog.featured).slice(0, limit)
    if (featured.length === limit) return featured
    const fallback = published.slice(0, limit)
    return fallback
  }

  return published.slice(0, limit)
}

export async function fetchAllBlogs(includeDrafts: boolean = false): Promise<Blog[]> {
  try {
    const blogsRef = collection(db, 'blogs')
    const q = includeDrafts
      ? query(blogsRef, orderBy('createdAt', 'desc'))
      : query(blogsRef, where('status', '==', 'published'), orderBy('createdAt', 'desc'))
    const snapshot = await getDocs(q)
    const results = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Blog))
    if (results.length > 0) return results
  } catch (error) {
    console.warn('Failed to fetch all blogs from Firebase, using dummy data.', error)
  }

  return getDummyAllBlogs(includeDrafts)
}

export async function fetchBlogsPaginated(
  page: number = 1,
  perPage: number = 9
): Promise<{ blogs: Blog[]; total: number; totalPages: number }> {
  let all: Blog[] = []

  try {
    const blogsRef = collection(db, 'blogs')
    const q = query(blogsRef, where('status', '==', 'published'), orderBy('createdAt', 'desc'))
    const snapshot = await getDocs(q)
    all = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Blog))
  } catch (error) {
    console.warn('Failed to fetch paginated blogs from Firebase, using dummy data.', error)
  }

  if (all.length === 0) {
    all = getDummyPublishedBlogs()
  }

  const total = all.length
  const totalPages = Math.max(1, Math.ceil(total / perPage))
  const safePage = Math.min(Math.max(1, page), totalPages)
  const blogs = all.slice((safePage - 1) * perPage, safePage * perPage)
  return { blogs, total, totalPages }
}

export async function fetchRelatedBlogs(blogIds: string[]): Promise<Blog[]> {
  if (!blogIds || !blogIds.length) return []

  try {
    const q = query(collection(db, 'blogs'), where('__name__', 'in', blogIds))
    const snapshot = await getDocs(q)
    const results = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Blog))
    if (results.length > 0) return results
  } catch (error) {
    console.warn('Failed to fetch related blogs from Firebase, using dummy data.', error)
  }

  return dummyBlogs.filter(blog => blogIds.includes(blog.id) && blog.status === 'published')
}

export async function fetchBlogById(id: string): Promise<Blog | null> {
  try {
    const docRef = doc(db, 'blogs', id)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Blog
    }
  } catch (error) {
    console.warn('Failed to fetch blog by ID from Firebase, using dummy data.', error)
  }

  return dummyBlogs.find(blog => blog.id === id) ?? null
}

export async function createBlog(blogData: any): Promise<string> {
  const docRef = await addDoc(collection(db, 'blogs'), {
    ...blogData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return docRef.id
}

export async function updateBlog(id: string, blogData: any): Promise<void> {
  const docRef = doc(db, 'blogs', id)
  await updateDoc(docRef, {
    ...blogData,
    updatedAt: serverTimestamp(),
  })
}

export async function deleteBlog(id: string): Promise<void> {
  const docRef = doc(db, 'blogs', id)
  await deleteDoc(docRef)
}

// Comment APIs
export async function fetchCommentsByRecipeId(recipeId: string): Promise<Comment[]> {
  const q = query(collection(db, 'comments'), where('recipeId', '==', recipeId), where('status', '==', 'approved'))
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Comment))
}

export async function fetchCommentsByBlogId(blogId: string): Promise<Comment[]> {
  const q = query(collection(db, 'comments'), where('blogId', '==', blogId), where('status', '==', 'approved'))
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Comment))
}

export async function submitComment(data: {
  recipeId?: string
  blogId?: string
  name: string
  email: string
  comment: string
  rating: number
}): Promise<{ success: boolean; message: string }> {
  await addDoc(collection(db, 'comments'), {
    ...data,
    status: 'pending',
    createdAt: serverTimestamp(),
  })
  return { success: true, message: 'Comment submitted for review!' }
}

export async function fetchAllComments(): Promise<Comment[]> {
  const q = query(collection(db, 'comments'), orderBy('createdAt', 'desc'))
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Comment))
}

export async function updateCommentStatus(id: string, status: 'approved' | 'rejected'): Promise<void> {
  const docRef = doc(db, 'comments', id)
  await updateDoc(docRef, { status, updatedAt: serverTimestamp() })
}

// Newsletter APIs
export async function subscribeToNewsletter(email: string): Promise<{ success: boolean; message: string }> {
  await addDoc(collection(db, 'subscribers'), {
    email,
    confirmed: false,
    confirmToken: crypto.randomUUID(),
    createdAt: serverTimestamp(),
  })
  return { success: true, message: 'Please check your email to confirm your subscription!' }
}

// Contact APIs
export async function submitContactForm(data: {
  name: string
  email: string
  message: string
}): Promise<{ success: boolean; message: string }> {
  await addDoc(collection(db, 'contacts'), {
    ...data,
    createdAt: serverTimestamp(),
  })
  return { success: true, message: 'Thank you for your message! We\'ll get back to you soon.' }
}

// Search API (placeholder - will use Pagefind in production)
export async function searchRecipes(queryStr: string): Promise<Recipe[]> {
  // Firestore does not support full text search natively; this is a simple implementation
  const q = query(collection(db, 'recipes'), where('status', '==', 'published'))
  const snapshot = await getDocs(q)
  const lowerQuery = queryStr.toLowerCase()
  return snapshot.docs
    .map(doc => ({ id: doc.id, ...doc.data() } as Recipe))
    .filter(r =>
      r.title.toLowerCase().includes(lowerQuery) ||
      r.metaDescription.toLowerCase().includes(lowerQuery) ||
      (r.keywords && r.keywords.some((k: string) => k.toLowerCase().includes(lowerQuery))) ||
      (r.ingredients && r.ingredients.some((i: any) => i.item.toLowerCase().includes(lowerQuery)))
    )
}

// Admin APIs (for future use)
export async function fetchAdminStats(): Promise<{
  recipeCount: number
  blogCount: number
  subscriberCount: number
  pendingComments: number
}> {
  const [recipesSnap, blogsSnap, subsSnap, commentsSnap] = await Promise.all([
    getDocs(collection(db, 'recipes')),
    getDocs(collection(db, 'blogs')),
    getDocs(collection(db, 'subscribers')),
    getDocs(query(collection(db, 'comments'), where('status', '==', 'pending'))),
  ])
  return {
    recipeCount: recipesSnap.size,
    blogCount: blogsSnap.size,
    subscriberCount: subsSnap.size,
    pendingComments: commentsSnap.size,
  }
}
