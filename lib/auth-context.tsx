'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { 
  User,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  sendPasswordResetEmail
} from 'firebase/auth'
import { auth } from './firebase'

interface AuthContextType {
  user: User | null
  loading: boolean
  isAdmin: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// For demo purposes - in production, remove this and use real Firebase auth
const DEMO_MODE = false
const ADMIN_EMAILS = ['Webrohanray@gmail.com']
const DEMO_CREDENTIALS = {
  email: 'Webrohanray@gmail.com',
  password: 'admin123'
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for demo session
    if (DEMO_MODE) {
      const demoSession = localStorage.getItem('demo_admin_session')
      if (demoSession) {
        setUser({ email: DEMO_CREDENTIALS.email } as User)
      }
      setLoading(false)
      return
    }

    // Real Firebase auth listener
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    // Demo mode authentication
    if (DEMO_MODE) {
      if (email === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password) {
        localStorage.setItem('demo_admin_session', 'true')
        setUser({ email: DEMO_CREDENTIALS.email } as User)
        return
      }
      throw new Error('Invalid credentials. Use admin@spiceandsimmer.com / admin123')
    }

    // Real Firebase authentication
    await signInWithEmailAndPassword(auth, email, password)
  }

  const signOut = async () => {
    if (DEMO_MODE) {
      localStorage.removeItem('demo_admin_session')
      setUser(null)
      return
    }
    await firebaseSignOut(auth)
  }

  const resetPassword = async (email: string) => {
    if (DEMO_MODE) {
      // Simulate password reset in demo mode
      await new Promise(resolve => setTimeout(resolve, 1000))
      return
    }
    await sendPasswordResetEmail(auth, email)
  }

  // Only allow admin user
  const isAdmin = Boolean(user && user.email && ADMIN_EMAILS.some(e => e.toLowerCase() === user.email!.toLowerCase()))

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, signIn, signOut, resetPassword }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
