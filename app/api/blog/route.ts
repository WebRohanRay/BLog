import { NextRequest, NextResponse } from 'next/server'
import { blogPosts as dummyBlogPosts } from '@/lib/dummy-data'
// Firebase imports for when you're ready to use real data
// import { db } from '@/lib/firebase'
// import { collection, getDocs, addDoc, query, where, orderBy, limit, serverTimestamp } from 'firebase/firestore'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')
  const limitParam = searchParams.get('limit')
  const status = searchParams.get('status')

  try {
    // Using dummy data - replace with Firebase when ready
    let posts = [...dummyBlogPosts]

    // Filter by category
    if (category) {
      posts = posts.filter(p => p.category === category)
    }

    // Filter by status
    if (status) {
      posts = posts.filter(p => (p.status || 'published') === status)
    }

    // Limit results
    if (limitParam) {
      posts = posts.slice(0, parseInt(limitParam))
    }

    return NextResponse.json({ posts, total: posts.length })

    /* Firebase implementation:
    const postsRef = collection(db, 'blog_posts')
    let q = query(postsRef, orderBy('publishedAt', 'desc'))
    
    if (category) {
      q = query(q, where('category', '==', category))
    }
    
    if (status) {
      q = query(q, where('status', '==', status))
    }
    
    if (limitParam) {
      q = query(q, limit(parseInt(limitParam)))
    }
    
    const snapshot = await getDocs(q)
    const posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    
    return NextResponse.json({ posts, total: posts.length })
    */
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return NextResponse.json({ error: 'Failed to fetch blog posts' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    const requiredFields = ['title', 'slug', 'content']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    // Using dummy data - just return the new post with a generated ID
    const newPost = {
      id: `blog-${Date.now()}`,
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      views: 0,
    }

    return NextResponse.json({ post: newPost, message: 'Blog post created successfully' })

    /* Firebase implementation:
    const postsRef = collection(db, 'blog_posts')
    const docRef = await addDoc(postsRef, {
      ...body,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      views: 0,
    })
    
    return NextResponse.json({ 
      post: { id: docRef.id, ...body },
      message: 'Blog post created successfully' 
    })
    */
  } catch (error) {
    console.error('Error creating blog post:', error)
    return NextResponse.json({ error: 'Failed to create blog post' }, { status: 500 })
  }
}
