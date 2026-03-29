import Link from "next/link";
import { getAllBlogsAdmin } from "@/lib/firebase/queries";
import { formatDateShort }  from "@/lib/utils/helpers";

export const dynamic = "force-dynamic";

export default async function AdminBlogsPage() {
  const blogs = await getAllBlogsAdmin().catch(() => []);

  return (
    <div className="p-6 sm:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">Blog Posts</h1>
          <p className="text-gray-400 text-sm mt-1">{blogs.length} total posts</p>
        </div>
        <Link href="/admin/blogs/new" className="btn-primary gap-2">
          <span aria-hidden>+</span> New Post
        </Link>
      </div>

      <div className="card overflow-hidden">
        <table className="table-base">
          <thead>
            <tr>
              <th>Title</th>
              <th className="hidden md:table-cell">Status</th>
              <th className="hidden lg:table-cell">Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {blogs.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-12 text-gray-400">
                  No blog posts yet.{" "}
                  <Link href="/admin/blogs/new" className="text-brand-500 font-semibold">
                    Write your first post →
                  </Link>
                </td>
              </tr>
            ) : (
              blogs.map((b) => (
                <tr key={b.id}>
                  <td>
                    <p className="font-semibold text-gray-900 text-sm line-clamp-1 max-w-xs">{b.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5 font-mono">{b.slug}</p>
                  </td>
                  <td className="hidden md:table-cell">
                    <span className={b.status === "published" ? "badge-green" : "badge-gray"}>
                      {b.status}
                    </span>
                  </td>
                  <td className="hidden lg:table-cell text-sm text-gray-400">
                    {formatDateShort(b.createdAt)}
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/blogs/${b.id}/edit`} className="btn-secondary btn-sm text-xs">
                        Edit
                      </Link>
                      {b.status === "published" && (
                        <Link href={`/blog/${b.slug}`} target="_blank"
                          className="btn-ghost btn-sm text-xs text-gray-400">
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
