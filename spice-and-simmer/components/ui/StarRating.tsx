"use client";

interface StarRatingProps {
  rating: number;        // 0–5
  count?: number;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  onRate?: (rating: number) => void;
  className?: string;
}

export default function StarRating({
  rating,
  count,
  size = "md",
  interactive = false,
  onRate,
  className = "",
}: StarRatingProps) {
  const sizes = { sm: "w-3.5 h-3.5", md: "w-4 h-4", lg: "w-5 h-5" };
  const textSizes = { sm: "text-xs", md: "text-sm", lg: "text-base" };

  return (
    <div
      className={`flex items-center gap-1 ${className}`}
      aria-label={`Rating: ${rating.toFixed(1)} out of 5${count !== undefined ? `, ${count} reviews` : ""}`}
      role={interactive ? "group" : undefined}
    >
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = star <= Math.round(rating);
          const half = !filled && star - 0.5 <= rating;

          return (
            <button
              key={star}
              type="button"
              onClick={() => interactive && onRate?.(star)}
              disabled={!interactive}
              className={`
                ${interactive ? "cursor-pointer hover:scale-110 transition-transform" : "cursor-default"}
                disabled:cursor-default focus:outline-none
              `}
              aria-label={interactive ? `Rate ${star} star${star !== 1 ? "s" : ""}` : undefined}
            >
              <svg
                className={`${sizes[size]} ${
                  filled
                    ? "text-brand-500"
                    : half
                    ? "text-brand-300"
                    : "text-gray-200"
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </button>
          );
        })}
      </div>

      {count !== undefined && (
        <span className={`text-gray-500 ${textSizes[size]}`}>
          <span className="font-semibold text-gray-700">{rating.toFixed(1)}</span>
          {" "}({count.toLocaleString()})
        </span>
      )}
    </div>
  );
}
