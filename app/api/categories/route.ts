import { NextRequest, NextResponse } from 'next/server'
// import { categories as dummyCategories } from '@/lib/dummy-data'
import { db } from '@/lib/firebase'
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore'
// Firebase imports for real data
// import { db } from '@/lib/firebase'
// import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore'

export async function GET(request: NextRequest) {
  try {
    // Firestore implementation
    const snapshot = await getDocs(collection(db, 'categories'))
    const categories = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    return NextResponse.json({ categories })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    if (!body.name || !body.slug) {
      return NextResponse.json({ error: 'Missing name or slug' }, { status: 400 })
    }
    // Dummy: just echo
    return NextResponse.json({ category: body, message: 'Category created' })
    /* Firebase example:
    const docRef = await addDoc(collection(db, 'categories'), {
      ...body,
      createdAt: serverTimestamp(),
    })
    return NextResponse.json({ id: docRef.id, ...body, message: 'Category created' })
    */
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 })
  }
}
