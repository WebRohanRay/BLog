import { NextRequest, NextResponse } from 'next/server'
// Firebase imports for when you're ready to use real data
// import { db } from '@/lib/firebase'
// import { collection, addDoc } from 'firebase/firestore'

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message, type } = await request.json()

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email, and message are required' }, { status: 400 })
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
    }

    // Using dummy data - just simulate success
    console.log('Contact form submission:', { name, email, subject, message, type })
    
    return NextResponse.json({ 
      message: 'Message sent successfully! We will get back to you soon.',
      submission: {
        id: `contact-${Date.now()}`,
        name,
        email,
        subject,
        type,
        createdAt: new Date().toISOString(),
      }
    })

    /* Firebase implementation:
    const contactRef = collection(db, 'contact_submissions')
    const docRef = await addDoc(contactRef, {
      name,
      email,
      subject: subject || null,
      message,
      type: type || 'general',
      status: 'unread',
      createdAt: serverTimestamp(),
    })
    
    // Optionally send notification email here
    
    return NextResponse.json({ 
      message: 'Message sent successfully! We will get back to you soon.',
      submissionId: docRef.id
    })
    */
  } catch (error) {
    console.error('Error submitting contact form:', error)
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}
