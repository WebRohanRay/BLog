'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2, Send, CheckCircle } from 'lucide-react'
import { subscribeToNewsletter } from '@/lib/api'
import { toast } from 'sonner'

export function Newsletter() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setLoading(true)
    try {
      const result = await subscribeToNewsletter(email)
      if (result.success) {
        setSuccess(true)
        setEmail('')
        toast.success(result.message)
      }
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <section className="bg-primary/10 rounded-2xl p-6 sm:p-10 text-center max-w-2xl mx-auto">
        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-xl sm:text-2xl font-serif font-bold text-foreground mb-2">
          You&apos;re In!
        </h3>
        <p className="text-muted-foreground text-sm sm:text-base">
          Check your inbox to confirm your subscription and get your free recipe PDF.
        </p>
      </section>
    )
  }

  return (
    <section className="bg-primary/10 rounded-2xl p-6 sm:p-10 text-center max-w-2xl mx-auto">
      <h3 className="text-xl sm:text-2xl font-serif font-bold text-foreground mb-2">
        Get 10 Free Fusion Recipes
      </h3>
      <p className="text-muted-foreground text-sm sm:text-base mb-6">
        Join 1,000+ home cooks. Get our free PDF + weekly recipes straight to your inbox.
      </p>
      
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          className="flex-1 min-h-[48px] text-base"
          disabled={loading}
        />
        <Button
          type="submit"
          disabled={loading}
          className="min-h-[48px] px-6 font-semibold"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Get Free PDF
            </>
          )}
        </Button>
      </form>
      
      <p className="text-xs text-muted-foreground mt-4">
        No spam, ever. Unsubscribe anytime.
      </p>
    </section>
  )
}
