import { NextRequest, NextResponse } from 'next/server'
// import { blogPosts as dummyBlogPosts } from '@/lib/dummy-data'
// Firebase imports
// import { db } from '@/lib/firebase'
// import { doc, getDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  try {
    // Using dummy data
    const post = dummyBlogPosts.find(p => p.id === id)
    
    if (!post) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 })
    }

    return NextResponse.json({ post })

    /* Firebase implementation:
    const docRef = doc(db, 'blog_posts', id)
    const docSnap = await getDoc(docRef)
    
    if (!docSnap.exists()) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 })
    }
    
    return NextResponse.json({ post: { id: docSnap.id, ...docSnap.data() } })
    */
  } catch (error) {
    console.error('Error fetching blog post:', error)
    return NextResponse.json({ error: 'Failed to fetch blog post' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  try {
    const body = await request.json()
    
    // Using dummy data - return updated post
    const updatedPost = {
      id,
      ...body,
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json({ post: updatedPost, message: 'Blog post updated successfully' })

    /* Firebase implementation:
    const docRef = doc(db, 'blog_posts', id)
    await updateDoc(docRef, {
      ...body,
      updatedAt: serverTimestamp(),
    })
    
    return NextResponse.json({ message: 'Blog post updated successfully' })
    */
  } catch (error) {
    console.error('Error updating blog post:', error)
    return NextResponse.json({ error: 'Failed to update blog post' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  try {
    // Using dummy data - just acknowledge delete
    return NextResponse.json({ message: 'Blog post deleted successfully' })

    /* Firebase implementation:
    const docRef = doc(db, 'blog_posts', id)
    await deleteDoc(docRef)
    
    return NextResponse.json({ message: 'Blog post deleted successfully' })
    */
  } catch (error) {
    console.error('Error deleting blog post:', error)
    return NextResponse.json({ error: 'Failed to delete blog post' }, { status: 500 })
  }
}
