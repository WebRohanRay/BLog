// Global loading skeleton — shown by Next.js during page transitions
export default function Loading() {
  return (
    <div className="container-base py-8 animate-pulse">
      {/* Breadcrumb skeleton */}
      <div className="hidden sm:flex gap-2 mb-6">
        <div className="skeleton h-4 w-12 rounded" />
        <div className="skeleton h-4 w-3 rounded" />
        <div className="skeleton h-4 w-20 rounded" />
      </div>

      {/* Hero skeleton */}
      <div className="skeleton w-full h-64 sm:h-80 lg:h-96 rounded-2xl mb-8" />

      {/* Title skeleton */}
      <div className="space-y-3 mb-8">
        <div className="skeleton h-8 w-3/4 rounded-xl" />
        <div className="skeleton h-8 w-1/2 rounded-xl" />
      </div>

      {/* Badges skeleton */}
      <div className="flex gap-3 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="skeleton h-8 w-20 rounded-full" />
        ))}
      </div>

      {/* Body skeleton */}
      <div className="space-y-3">
        {[100, 90, 95, 80, 85].map((w, i) => (
          <div key={i} className={`skeleton h-4 rounded`} style={{ width: `${w}%` }} />
        ))}
      </div>
    </div>
  );
}
