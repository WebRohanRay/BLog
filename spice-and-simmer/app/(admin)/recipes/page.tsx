import Link from "next/link";
import { getAllRecipesAdmin } from "@/lib/firebase/recipes";
import { formatDateShort }   from "@/lib/utils/helpers";

export const dynamic = "force-dynamic";

export default async function AdminRecipesPage() {
  const recipes = await getAllRecipesAdmin().catch(() => []);

  return (
    <div className="p-6 sm:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">Recipes</h1>
          <p className="text-gray-400 text-sm mt-1">{recipes.length} total recipes</p>
        </div>
        <Link href="/admin/recipes/new" className="btn-primary gap-2">
          <span aria-hidden>+</span> New Recipe
        </Link>
      </div>

      <div className="card overflow-hidden">
        <table className="table-base">
          <thead>
            <tr>
              <th>Title</th>
              <th className="hidden sm:table-cell">Category</th>
              <th className="hidden md:table-cell">Status</th>
              <th className="hidden lg:table-cell">Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {recipes.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-12 text-gray-400">
                  No recipes yet.{" "}
                  <Link href="/admin/recipes/new" className="text-brand-500 font-semibold">
                    Create your first recipe →
                  </Link>
                </td>
              </tr>
            ) : (
              recipes.map((r) => (
                <tr key={r.id}>
                  <td>
                    <p className="font-semibold text-gray-900 text-sm line-clamp-1 max-w-xs">
                      {r.title}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5 font-mono">{r.slug}</p>
                  </td>
                  <td className="hidden sm:table-cell">
                    <span className="badge-gray text-xs">{r.category}</span>
                  </td>
                  <td className="hidden md:table-cell">
                    <span className={r.status === "published" ? "badge-green" : "badge-gray"}>
                      {r.status}
                    </span>
                  </td>
                  <td className="hidden lg:table-cell text-sm text-gray-400">
                    {formatDateShort(r.createdAt)}
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/recipes/${r.id}/edit`} className="btn-secondary btn-sm text-xs">
                        Edit
                      </Link>
                      {r.status === "published" && (
                        <Link
                          href={`/recipes/${r.category.toLowerCase().replace(/\s+/g, "-")}/${r.slug}`}
                          target="_blank"
                          className="btn-ghost btn-sm text-xs text-gray-400"
                        >
                          View ↗
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
