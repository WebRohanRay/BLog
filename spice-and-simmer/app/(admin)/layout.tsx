"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/firebase/AuthContext";
import { signOut } from "@/lib/firebase/auth";
import { AuthProvider } from "@/lib/firebase/AuthContext";
import toast from "react-hot-toast";

const NAV = [
  { label: "Dashboard",   href: "/admin",             icon: "📊" },
  { label: "Recipes",     href: "/admin/recipes",      icon: "🍳" },
  { label: "Blogs",       href: "/admin/blogs",        icon: "📝" },
  { label: "Categories",  href: "/admin/categories",   icon: "📂" },
  { label: "Tags",        href: "/admin/tags",         icon: "🏷️" },
  { label: "Comments",    href: "/admin/comments",     icon: "💬" },
  { label: "Subscribers", href: "/admin/subscribers",  icon: "📧" },
];

function AdminSidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/admin/login");
    toast.success("Signed out");
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-100 flex flex-col min-h-screen flex-shrink-0">
      {/* Brand */}
      <div className="px-5 py-5 border-b border-gray-100">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-spice-red flex items-center justify-center text-sm">🌶️</div>
          <div>
            <p className="font-display font-bold text-sm text-gray-900">Spice & Simmer</p>
            <p className="text-[10px] text-gray-400 uppercase tracking-wide">Admin Panel</p>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1" aria-label="Admin navigation">
        {NAV.map((item) => {
          const active = item.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={active ? "admin-nav-item-active" : "admin-nav-item"}
              aria-current={active ? "page" : undefined}
            >
              <span aria-hidden>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-gray-100">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-bold text-xs flex-shrink-0">
            {user?.email?.charAt(0).toUpperCase()}
          </div>
          <p className="text-xs text-gray-500 truncate">{user?.email}</p>
        </div>
        <button onClick={handleSignOut} className="btn-ghost btn-sm w-full text-xs text-gray-500">
          Sign out
        </button>
        <Link href="/" className="block mt-1 text-center text-xs text-gray-400 hover:text-gray-600 py-1">
          ← View site
        </Link>
      </div>
    </aside>
  );
}

function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user && pathname !== "/admin/login") {
      router.push(`/admin/login?redirect=${pathname}`);
    }
  }, [user, loading, pathname, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-3 animate-bounce-light" role="img" aria-hidden>🌶️</div>
          <p className="text-sm text-gray-500">Loading admin…</p>
        </div>
      </div>
    );
  }

  if (!user && pathname !== "/admin/login") return null;
  return <>{children}</>;
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AdminGuard>
        <div className="flex min-h-screen bg-gray-50">
          <AdminSidebar />
          <main className="flex-1 min-w-0 overflow-auto">
            {children}
          </main>
        </div>
      </AdminGuard>
    </AuthProvider>
  );
}
