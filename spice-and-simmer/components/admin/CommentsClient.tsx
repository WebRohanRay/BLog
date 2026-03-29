"use client";

import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import type { Comment } from "@/types";
import { formatDate } from "@/lib/utils/helpers";
import { updateCommentStatus, deleteComment } from "@/lib/firebase/queries";
import StarRating from "@/components/ui/StarRating";

interface CommentsClientProps {
  comments: Comment[];
  currentStatus: "pending" | "approved" | "rejected";
}

export default function CommentsClient({ comments: initial, currentStatus }: CommentsClientProps) {
  const [comments, setComments] = useState<Comment[]>(initial);
  const [loading,  setLoading]  = useState<string | null>(null);

  const approve = async (id: string) => {
    setLoading(id);
    try {
      await updateCommentStatus(id, "approved");
      setComments((c) => c.filter((x) => x.id !== id));
      toast.success("Comment approved");
    } catch { toast.error("Failed"); }
    finally { setLoading(null); }
  };

  const reject = async (id: string) => {
    setLoading(id);
    try {
      await updateCommentStatus(id, "rejected");
      setComments((c) => c.filter((x) => x.id !== id));
      toast.success("Comment rejected");
    } catch { toast.error("Failed"); }
    finally { setLoading(null); }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this comment permanently?")) return;
    setLoading(id);
    try {
      await deleteComment(id);
      setComments((c) => c.filter((x) => x.id !== id));
      toast.success("Comment deleted");
    } catch { toast.error("Failed"); }
    finally { setLoading(null); }
  };

  return (
    <div className="p-6 sm:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">Comments</h1>
          <p className="text-gray-400 text-sm mt-1">{comments.length} {currentStatus} comment{comments.length !== 1 ? "s" : ""}</p>
        </div>
      </div>

      {/* Status tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        {(["pending", "approved", "rejected"] as const).map((s) => (
          <Link key={s} href={`/admin/comments?status=${s}`}
            className={`px-4 py-2 text-sm font-semibold capitalize transition-colors border-b-2 -mb-px ${
              s === currentStatus ? "border-brand-500 text-brand-600" : "border-transparent text-gray-500 hover:text-gray-700"
            }`}>
            {s}
          </Link>
        ))}
      </div>

      {comments.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-3" role="img" aria-hidden>💬</div>
          <p className="text-gray-400">No {currentStatus} comments.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((c) => (
            <div key={c.id} className="card p-5">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-bold text-sm flex-shrink-0">
                    {c.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{c.name}</p>
                    <p className="text-xs text-gray-400">{c.email} · {formatDate(c.createdAt)}</p>
                  </div>
                </div>
                <StarRating rating={c.rating} size="sm" />
              </div>

              <p className="text-sm text-gray-700 mt-3 leading-relaxed border-l-4 border-gray-100 pl-3">
                {c.comment}
              </p>

              <p className="text-xs text-gray-400 mt-2">
                Recipe: <Link href={`/admin/recipes/${c.recipeId}/edit`} className="text-brand-500 hover:underline">{c.recipeId}</Link>
              </p>

              <div className="flex gap-2 mt-4">
                {currentStatus !== "approved" && (
                  <button onClick={() => approve(c.id)} disabled={loading === c.id}
                    className="btn-secondary btn-sm text-xs text-green-700 border-green-200 hover:bg-green-50">
                    ✓ Approve
                  </button>
                )}
                {currentStatus !== "rejected" && (
                  <button onClick={() => reject(c.id)} disabled={loading === c.id}
                    className="btn-secondary btn-sm text-xs text-yellow-700 border-yellow-200 hover:bg-yellow-50">
                    ✗ Reject
                  </button>
                )}
                <button onClick={() => remove(c.id)} disabled={loading === c.id}
                  className="btn-danger btn-sm text-xs">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
