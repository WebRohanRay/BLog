'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Star, Loader2, MessageSquare } from 'lucide-react'
import { submitComment } from '@/lib/api'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import type { Comment } from '@/lib/dummy-data'

interface CommentSectionProps {
  recipeId: string
  comments: Comment[]
}

export function CommentSection({ recipeId, comments }: CommentSectionProps) {
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    comment: '',
    rating: 5,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await submitComment({
        recipeId,
        ...formData,
      })
      if (result.success) {
        toast.success(result.message)
        setFormData({ name: '', email: '', comment: '', rating: 5 })
        setShowForm(false)
      }
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl sm:text-2xl font-serif font-bold text-foreground">
          Reviews & Comments
        </h2>
        <Button
          onClick={() => setShowForm(!showForm)}
          variant={showForm ? 'outline' : 'default'}
          className="min-h-[44px]"
        >
          <MessageSquare className="w-4 h-4 mr-2" />
          {showForm ? 'Cancel' : 'Leave a Review'}
        </Button>
      </div>

      {/* Comment Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="border border-border rounded-xl p-4 sm:p-6 mb-6">
          <h3 className="font-semibold text-foreground mb-4">Leave a Review</h3>

          {/* Rating */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-foreground mb-2">
              Your Rating
            </label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFormData({ ...formData, rating: star })}
                  className="p-1"
                >
                  <Star
                    className={cn(
                      'w-6 h-6 transition-colors',
                      star <= formData.rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'fill-muted text-muted hover:fill-yellow-200 hover:text-yellow-200'
                    )}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Name & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1.5">
                Name
              </label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="min-h-[44px]"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="min-h-[44px]"
              />
            </div>
          </div>

          {/* Comment */}
          <div className="mb-4">
            <label htmlFor="comment" className="block text-sm font-medium text-foreground mb-1.5">
              Your Review
            </label>
            <Textarea
              id="comment"
              value={formData.comment}
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              required
              rows={4}
              placeholder="Share your experience with this recipe..."
            />
          </div>

          <Button type="submit" disabled={loading} className="min-h-[44px]">
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Review'
            )}
          </Button>
        </form>
      )}

      {/* Comments List */}
      {comments.length > 0 ? (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="border border-border rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
                    {comment.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-medium text-foreground">{comment.name}</span>
                </div>
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        'w-3.5 h-3.5',
                        i < comment.rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'fill-muted text-muted'
                      )}
                    />
                  ))}
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{comment.comment}</p>
              <p className="text-xs text-muted-foreground mt-2">
                {new Date(comment.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 border border-dashed border-border rounded-xl">
          <MessageSquare className="w-10 h-10 text-muted-foreground/50 mx-auto mb-2" />
          <p className="text-muted-foreground">No reviews yet. Be the first to share your experience!</p>
        </div>
      )}
    </div>
  )
}
