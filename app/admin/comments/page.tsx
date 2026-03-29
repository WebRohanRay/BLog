'use client'

import { useState } from 'react'
import { Check, X, Star, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
// import { comments, recipes } from '@/lib/dummy-data'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export default function AdminCommentsPage() {
  const [commentList, setCommentList] = useState(comments)

  const handleApprove = (id: string) => {
    setCommentList((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: 'approved' as const } : c))
    )
    toast.success('Comment approved')
  }

  const handleReject = (id: string) => {
    setCommentList((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: 'rejected' as const } : c))
    )
    toast.success('Comment rejected')
  }

  const getRecipeTitle = (recipeId: string) => {
    const recipe = recipes.find((r) => r.id === recipeId)
    return recipe?.title || 'Unknown Recipe'
  }

  const pending = commentList.filter((c) => c.status === 'pending')
  const approved = commentList.filter((c) => c.status === 'approved')
  const rejected = commentList.filter((c) => c.status === 'rejected')

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-foreground">
          Comments
        </h1>
        <p className="text-muted-foreground mt-1">
          Moderate user comments and reviews
        </p>
      </div>

      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending" className="flex items-center gap-2">
            Pending
            {pending.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                {pending.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="approved">Approved ({approved.length})</TabsTrigger>
          <TabsTrigger value="rejected">Rejected ({rejected.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <CommentList
            comments={pending}
            onApprove={handleApprove}
            onReject={handleReject}
            getRecipeTitle={getRecipeTitle}
            showActions
          />
        </TabsContent>

        <TabsContent value="approved">
          <CommentList
            comments={approved}
            getRecipeTitle={getRecipeTitle}
          />
        </TabsContent>

        <TabsContent value="rejected">
          <CommentList
            comments={rejected}
            getRecipeTitle={getRecipeTitle}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface CommentListProps {
  comments: typeof comments
  onApprove?: (id: string) => void
  onReject?: (id: string) => void
  getRecipeTitle: (id: string) => string
  showActions?: boolean
}

function CommentList({ comments, onApprove, onReject, getRecipeTitle, showActions }: CommentListProps) {
  if (comments.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <MessageSquare className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
          <p className="text-muted-foreground">No comments to display</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Comments ({comments.length})</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="border border-border rounded-lg p-4"
          >
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-foreground">{comment.name}</span>
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          'w-3 h-3',
                          i < comment.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'fill-muted text-muted'
                        )}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  on <span className="font-medium">{getRecipeTitle(comment.recipeId)}</span>
                </p>
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {new Date(comment.createdAt).toLocaleDateString()}
              </span>
            </div>

            <p className="text-sm text-muted-foreground mb-4">{comment.comment}</p>

            {showActions && onApprove && onReject && (
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  onClick={() => onApprove(comment.id)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Check className="w-4 h-4 mr-1" />
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => onReject(comment.id)}
                >
                  <X className="w-4 h-4 mr-1" />
                  Reject
                </Button>
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
