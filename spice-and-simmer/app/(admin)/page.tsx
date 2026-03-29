import Link from "next/link";
import { getDashboardStats } from "@/lib/firebase/queries";
import { getLatestRecipes }  from "@/lib/firebase/recipes";
import { formatDateShort }   from "@/lib/utils/helpers";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [stats, latestRecipes] = await Promise.all([
    getDashboardStats().catch(() => ({
      recipeCount: 0, publishedRecipeCount: 0, blogCount: 0,
      confirmedSubscribers: 0, pendingComments: 0, totalViews: 0,
    })),
    getLatestRecipes(5).catch(() => []),
  ]);

  const STAT_CARDS = [
    { label: "Total Recipes",    value: stats.recipeCount,          icon: "🍳", href: "/admin/recipes" },
    { label: "Published",        value: stats.publishedRecipeCount, icon: "✅", href: "/admin/recipes?status=published" },
    { label: "Blog Posts",       value: stats.blogCount,            icon: "📝", href: "/admin/blogs" },
    { label: "Subscribers",      value: stats.confirmedSubscribers, icon: "📧", href: "/admin/subscribers" },
    { label: "Pending Comments", value: stats.pendingComments,      icon: "💬", href: "/admin/comments?status=pending" },
  ];

  return (
    <div className="p-6 sm:p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-gray-900 mb-1">Dashboard</h1>
        <p className="text-gray-400 text-sm">Welcome back! Here&apos;s what&apos;s happening.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
        {STAT_CARDS.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="card-flat p-4 hover:shadow-card-hover transition-shadow"
          >
            <span className="text-2xl mb-2 block" role="img" aria-hidden>{s.icon}</span>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900">{s.value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div className="mb-10">
        <h2 className="font-display font-bold text-gray-900 text-lg mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/recipes/new" className="btn-primary gap-2">
            <span aria-hidden>+</span> New Recipe
          </Link>
          <Link href="/admin/blogs/new" className="btn-secondary gap-2">
            <span aria-hidden>+</span> New Blog Post
          </Link>
          <Link href="/admin/comments?status=pending" className="btn-secondary gap-2 relative">
            <span aria-hidden>💬</span> Review Comments
            {stats.pendingComments > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {stats.pendingComments}
              </span>
            )}
          </Link>
          <Link href="/admin/categories" className="btn-secondary gap-2">
            <span aria-hidden>📂</span> Manage Categories
          </Link>
        </div>
      </div>

      {/* Recent recipes table */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-bold text-gray-900 text-lg">Recent Recipes</h2>
          <Link href="/admin/recipes" className="text-sm text-brand-500 hover:text-brand-700 font-semibold">
            View all →
          </Link>
        </div>
        <div className="card overflow-hidden">
          <table className="table-base">
            <thead>
              <tr>
                <th>Recipe</th>
                <th className="hidden sm:table-cell">Category</th>
                <th className="hidden md:table-cell">Status</th>
                <th className="hidden lg:table-cell">Views</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {latestRecipes.map((r) => (
                <tr key={r.id}>
                  <td>
                    <p className="font-semibold text-gray-900 text-sm line-clamp-1">{r.title}</p>
                  </td>
                  <td className="hidden sm:table-cell">
                    <span className="badge-gray text-xs">{r.category}</span>
                  </td>
                  <td className="hidden md:table-cell">
                    <span className="badge-green text-xs">Published</span>
                  </td>
                  <td className="hidden lg:table-cell text-gray-400 text-sm">—</td>
                  <td>
                    <Link
                      href={`/admin/recipes/${r.id}/edit`}
                      className="btn-secondary btn-sm text-xs"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
