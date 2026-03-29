import { NextRequest, NextResponse } from 'next/server'
import { dummyRecipes } from '@/lib/dummy-data'
// Firebase imports for when you're ready to use real data
// import { db } from '@/lib/firebase'
// import { collection, getDocs, addDoc, query, where, orderBy, limit } from 'firebase/firestore'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')
  const featured = searchParams.get('featured')
  const limitParam = searchParams.get('limit')
  const search = searchParams.get('search')

  try {
    // Using dummy data - replace with Firebase when ready
    let recipes = [...dummyRecipes]

    // Filter by category
    if (category) {
      recipes = recipes.filter(r => r.category === category)
    }

    // Filter by featured
    if (featured === 'true') {
      recipes = recipes.filter(r => r.featured)
    }

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase()
      recipes = recipes.filter(r => 
        r.title.toLowerCase().includes(searchLower) ||
        r.description.toLowerCase().includes(searchLower) ||
        r.tags.some(tag => tag.toLowerCase().includes(searchLower))
      )
    }

    // Limit results
    if (limitParam) {
      recipes = recipes.slice(0, parseInt(limitParam))
    }

    return NextResponse.json({ recipes, total: recipes.length })

    /* Firebase implementation:
    const recipesRef = collection(db, 'recipes')
    let q = query(recipesRef, orderBy('createdAt', 'desc'))
    
    if (category) {
      q = query(q, where('category', '==', category))
    }
    
    if (featured === 'true') {
      q = query(q, where('featured', '==', true))
    }
    
    if (limitParam) {
      q = query(q, limit(parseInt(limitParam)))
    }
    
    const snapshot = await getDocs(q)
    const recipes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    
    return NextResponse.json({ recipes, total: recipes.length })
    */
  } catch (error) {
    console.error('Error fetching recipes:', error)
    return NextResponse.json({ error: 'Failed to fetch recipes' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    const requiredFields = ['title', 'description', 'category', 'ingredients', 'steps']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    // Using dummy data - just return the new recipe with a generated ID
    const newRecipe = {
      id: `recipe-${Date.now()}`,
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      views: 0,
      rating: 0,
      ratingCount: 0,
    }

    return NextResponse.json({ recipe: newRecipe, message: 'Recipe created successfully' })

    /* Firebase implementation:
    const recipesRef = collection(db, 'recipes')
    const docRef = await addDoc(recipesRef, {
      ...body,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      views: 0,
      rating: 0,
      ratingCount: 0,
    })
    
    return NextResponse.json({ 
      recipe: { id: docRef.id, ...body },
      message: 'Recipe created successfully' 
    })
    */
  } catch (error) {
    console.error('Error creating recipe:', error)
    return NextResponse.json({ error: 'Failed to create recipe' }, { status: 500 })
  }
}
