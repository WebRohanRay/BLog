import { NextRequest, NextResponse } from 'next/server'
import { dummyRecipes } from '@/lib/dummy-data'
// Firebase imports for when you're ready to use real data
// import { db } from '@/lib/firebase'
// import { doc, getDoc, updateDoc, deleteDoc, increment } from 'firebase/firestore'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  try {
    // Using dummy data
    const recipe = dummyRecipes.find(r => r.id === id || r.slug === id)
    
    if (!recipe) {
      return NextResponse.json({ error: 'Recipe not found' }, { status: 404 })
    }

    return NextResponse.json({ recipe })

    /* Firebase implementation:
    const docRef = doc(db, 'recipes', id)
    const docSnap = await getDoc(docRef)
    
    if (!docSnap.exists()) {
      return NextResponse.json({ error: 'Recipe not found' }, { status: 404 })
    }
    
    // Increment view count
    await updateDoc(docRef, { views: increment(1) })
    
    return NextResponse.json({ recipe: { id: docSnap.id, ...docSnap.data() } })
    */
  } catch (error) {
    console.error('Error fetching recipe:', error)
    return NextResponse.json({ error: 'Failed to fetch recipe' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  try {
    const body = await request.json()
    
    // Using dummy data - just return the updated recipe
    const recipeIndex = dummyRecipes.findIndex(r => r.id === id)
    
    if (recipeIndex === -1) {
      return NextResponse.json({ error: 'Recipe not found' }, { status: 404 })
    }

    const updatedRecipe = {
      ...dummyRecipes[recipeIndex],
      ...body,
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json({ recipe: updatedRecipe, message: 'Recipe updated successfully' })

    /* Firebase implementation:
    const docRef = doc(db, 'recipes', id)
    const docSnap = await getDoc(docRef)
    
    if (!docSnap.exists()) {
      return NextResponse.json({ error: 'Recipe not found' }, { status: 404 })
    }
    
    await updateDoc(docRef, {
      ...body,
      updatedAt: serverTimestamp(),
    })
    
    return NextResponse.json({ message: 'Recipe updated successfully' })
    */
  } catch (error) {
    console.error('Error updating recipe:', error)
    return NextResponse.json({ error: 'Failed to update recipe' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  try {
    // Using dummy data
    const recipe = dummyRecipes.find(r => r.id === id)
    
    if (!recipe) {
      return NextResponse.json({ error: 'Recipe not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Recipe deleted successfully' })

    /* Firebase implementation:
    const docRef = doc(db, 'recipes', id)
    await deleteDoc(docRef)
    
    return NextResponse.json({ message: 'Recipe deleted successfully' })
    */
  } catch (error) {
    console.error('Error deleting recipe:', error)
    return NextResponse.json({ error: 'Failed to delete recipe' }, { status: 500 })
  }
}
