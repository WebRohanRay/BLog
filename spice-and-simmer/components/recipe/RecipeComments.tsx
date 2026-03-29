"use client";

import { useState, useRef } from "react";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import toast from "react-hot-toast";
import type { Comment } from "@/types";
import { formatDate } from "@/lib/utils/helpers";
import StarRating from "@/components/ui/StarRating";

interface RecipeCommentsProps {
  recipeId: string;
  initialComments: Comment[];
}

export default function RecipeComments({ recipeId, initialComments }: RecipeCommentsProps) {
  const [comments, setComments]   = useState<Comment[]>(initialComments);
  const [rating, setRating]       = useState(5);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [loading, setLoading]     = useState(false);
  const captchaRef = useRef<HCaptcha>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!captchaToken) { toast.error("Please complete the captcha"); return; }

    const fd = new FormData(e.currentTarget);
    const payload = {
      recipeId,
      name:    fd.get("name") as string,
      email:   fd.get("email") as string,
      comment: fd.get("comment") as string,
      rating,
      captchaToken,
    };

    setLoading(true);
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error((await res.json()).error || "Failed");

      toast.success("Comment submitted! It will appear after review.");
      (e.target as HTMLFormElement).reset();
      setRating(5);
      setCaptchaToken(null);
      captchaRef.current?.resetCaptcha();
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mt-12" aria-labelledby="comments-heading">
      <h2 id="comments-heading" className="font-display text-xl sm:text-2xl font-bold text-gray-900 mb-6">
        Reviews &amp; Comments
        {comments.length > 0 && (
          <span className="ml-2 text-sm font-normal text-gray-400">
            ({comments.length})
          </span>
        )}
      </h2>

      {/* Existing comments */}
      {comments.length > 0 ? (
        <div className="space-y-4 mb-10">
          {comments.map((c) => (
            <div key={c.id} className="card-flat p-4 sm:p-5">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-bold text-sm flex-shrink-0">
                    {c.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{c.name}</p>
                    <p className="text-xs text-gray-400">{formatDate(c.createdAt)}</p>
                  </div>
                </div>
                <StarRating rating={c.rating} size="sm" />
              </div>
              <p className="text-sm text-gray-700 leading-relaxed ml-12">{c.comment}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400 text-sm mb-8">
          No reviews yet. Be the first to leave one!
        </p>
      )}

      {/* Comment form */}
      <div className="bg-gray-50 rounded-2xl p-5 sm:p-6">
        <h3 className="font-display font-bold text-gray-900 text-lg mb-5">
          Leave a Review
        </h3>

        <form onSubmit={handleSubmit} noValidate>
          {/* Star rating picker */}
          <div className="mb-4">
            <label className="label">Your Rating *</label>
            <StarRating
              rating={rating}
              size="lg"
              interactive
              onRate={setRating}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="comment-name" className="label">Name *</label>
              <input
                id="comment-name"
                name="name"
                type="text"
                required
                minLength={2}
                maxLength={100}
                className="input"
                placeholder="Jane Smith"
              />
            </div>
            <div>
              <label htmlFor="comment-email" className="label">Email * (not published)</label>
              <input
                id="comment-email"
                name="email"
                type="email"
                required
                className="input"
                placeholder="jane@example.com"
              />
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="comment-text" className="label">Comment *</label>
            <textarea
              id="comment-text"
              name="comment"
              required
              minLength={5}
              maxLength={1000}
              rows={4}
              className="textarea"
              placeholder="How did it turn out? Any tips for others?"
            />
          </div>

          <div className="flex justify-center mb-4">
            <HCaptcha
              ref={captchaRef}
              sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY || "10000000-ffff-ffff-ffff-000000000001"}
              onVerify={setCaptchaToken}
              theme="light"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !captchaToken}
            className="btn-primary w-full sm:w-auto"
          >
            {loading ? "Submitting…" : "Submit Review"}
          </button>

          <p className="text-xs text-gray-400 mt-3">
            Reviews are moderated and will appear within 24 hours.
          </p>
        </form>
      </div>
    </section>
  );
}
