import { NextRequest, NextResponse } from 'next/server'
import { dummyComments } from '@/lib/dummy-data'
// Firebase imports for when you're ready to use real data
// import { db } from '@/lib/firebase'
// import { collection, addDoc, getDocs, query, where, orderBy } from 'firebase/firestore'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const recipeId = searchParams.get('recipeId')
  const status = searchParams.get('status')

  try {
    let comments = [...dummyComments]

    if (recipeId) {
      comments = comments.filter(c => c.recipeId === recipeId)
    }

    if (status) {
      comments = comments.filter(c => c.status === status)
    }

    // Sort by date, newest first
    comments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return NextResponse.json({ comments, total: comments.length })

    /* Firebase implementation:
    const commentsRef = collection(db, 'comments')
    let q = query(commentsRef, orderBy('createdAt', 'desc'))
    
    if (recipeId) {
      q = query(q, where('recipeId', '==', recipeId))
    }
    
    if (status) {
      q = query(q, where('status', '==', status))
    }
    
    const snapshot = await getDocs(q)
    const comments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    
    return NextResponse.json({ comments, total: comments.length })
    */
  } catch (error) {
    console.error('Error fetching comments:', error)
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { recipeId, name, email, content, rating } = await request.json()

    if (!recipeId || !name || !email || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
    }

    // Using dummy data
    const newComment = {
      id: `comment-${Date.now()}`,
      recipeId,
      name,
      email,
      content,
      rating: rating || null,
      status: 'pending', // Comments need approval
      createdAt: new Date().toISOString(),
    }

    return NextResponse.json({ 
      comment: newComment, 
      message: 'Comment submitted for review' 
    })

    /* Firebase implementation:
    const commentsRef = collection(db, 'comments')
    const docRef = await addDoc(commentsRef, {
      recipeId,
      name,
      email,
      content,
      rating: rating || null,
      status: 'pending',
      createdAt: serverTimestamp(),
    })
    
    return NextResponse.json({ 
      comment: { id: docRef.id },
      message: 'Comment submitted for review' 
    })
    */
  } catch (error) {
    console.error('Error creating comment:', error)
    return NextResponse.json({ error: 'Failed to submit comment' }, { status: 500 })
  }
}
