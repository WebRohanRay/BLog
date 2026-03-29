import { NextRequest, NextResponse } from 'next/server'
// Firebase imports for when you're ready to use real data
// import { db } from '@/lib/firebase'
// import { collection, addDoc, query, where, getDocs } from 'firebase/firestore'

export async function POST(request: NextRequest) {
  try {
    const { email, name } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
    }

    // Using dummy data - just simulate success
    console.log('Newsletter signup:', { email, name })
    
    return NextResponse.json({ 
      message: 'Successfully subscribed to newsletter!',
      subscriber: { email, name, subscribedAt: new Date().toISOString() }
    })

    /* Firebase implementation:
    const subscribersRef = collection(db, 'newsletter_subscribers')
    
    // Check if email already exists
    const q = query(subscribersRef, where('email', '==', email.toLowerCase()))
    const existingSnap = await getDocs(q)
    
    if (!existingSnap.empty) {
      return NextResponse.json({ error: 'Email already subscribed' }, { status: 409 })
    }
    
    // Add new subscriber
    await addDoc(subscribersRef, {
      email: email.toLowerCase(),
      name: name || null,
      subscribedAt: serverTimestamp(),
      status: 'active',
    })
    
    return NextResponse.json({ message: 'Successfully subscribed to newsletter!' })
    */
  } catch (error) {
    console.error('Error subscribing to newsletter:', error)
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 })
  }
}
