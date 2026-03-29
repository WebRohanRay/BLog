"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";

// ── Nav items ──────────────────────────────────────────────────
const NAV_ITEMS = [
  {
    label: "Recipes",
    href: "/recipes",
    children: [
      { label: "All Recipes",       href: "/recipes" },
      { label: "Fusion Mains",      href: "/recipes/fusion-mains" },
      { label: "Indian Breakfasts", href: "/recipes/indian-breakfasts" },
      { label: "Quick Dinners",     href: "/recipes/quick-dinners" },
      { label: "Vegetarian",        href: "/recipes/vegetarian" },
      { label: "Street Food",       href: "/recipes/street-food" },
      { label: "Desserts",          href: "/recipes/desserts" },
    ],
  },
  { label: "Blog",    href: "/blog" },
  { label: "About",   href: "/about" },
  { label: "Contact", href: "/contact" },
];

// ── Logo ───────────────────────────────────────────────────────
function Logo({ onClick }: { onClick?: () => void }) {
  return (
    <Link
      href="/"
      onClick={onClick}
      className="flex items-center gap-2.5 flex-shrink-0 group"
      aria-label="Spice & Simmer — Home"
    >
      {/* Flame logo mark */}
      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-spice-red flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
        <span className="text-white text-lg leading-none" role="img" aria-hidden>🌶️</span>
      </div>
      <div className="leading-tight">
        <span className="block font-display font-bold text-lg text-gray-900 group-hover:text-brand-600 transition-colors">
          Spice &amp; Simmer
        </span>
        <span className="block text-[10px] text-gray-400 font-body tracking-widest uppercase -mt-0.5">
          Fusion Kitchen
        </span>
      </div>
    </Link>
  );
}

// ── Search bar ─────────────────────────────────────────────────
function SearchBar({ className = "" }: { className?: string }) {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const q = query.trim();
      if (q) router.push(`/search?q=${encodeURIComponent(q)}`);
    },
    [query, router]
  );

  // Keyboard shortcut: Ctrl+K or Cmd+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  return (
    <form onSubmit={handleSearch} className={`relative ${className}`} role="search">
      <label htmlFor="nav-search" className="sr-only">
        Search recipes
      </label>
      <input
        ref={inputRef}
        id="nav-search"
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search recipes…"
        className="
          w-full h-10 pl-10 pr-16
          bg-gray-100 border border-transparent rounded-xl
          text-sm text-gray-900 placeholder-gray-400
          focus:outline-none focus:bg-white focus:border-brand-300
          focus:ring-2 focus:ring-brand-200
          transition-all duration-200
        "
        aria-label="Search recipes"
      />
      {/* Search icon */}
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" aria-hidden>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </span>
      {/* Keyboard hint */}
      <span className="absolute right-3 top-1/2 -translate-y-1/2 hidden lg:flex items-center gap-0.5 pointer-events-none">
        <kbd className="text-[10px] font-mono bg-gray-200 text-gray-500 px-1.5 py-0.5 rounded">⌘K</kbd>
      </span>
    </form>
  );
}

// ── Desktop Dropdown ───────────────────────────────────────────
function DropdownMenu({
  children,
  isOpen,
}: {
  children: React.ReactNode;
  isOpen: boolean;
}) {
  if (!isOpen) return null;
  return (
    <div className="absolute top-full left-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-dropdown animate-fade-in">
      {children}
    </div>
  );
}

// ── Mobile Drawer ──────────────────────────────────────────────
function MobileDrawer({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();

  // Lock body scroll when drawer open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // Close on route change
  useEffect(() => { onClose(); }, [pathname]); // eslint-disable-line

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 z-overlay transition-opacity duration-300 md:hidden ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <div
        className={`
          fixed top-0 right-0 h-full w-[85vw] max-w-sm
          bg-white shadow-2xl z-modal
          flex flex-col
          transform transition-transform duration-300 ease-out
          md:hidden
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <Logo onClick={onClose} />
          <button
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors"
            aria-label="Close navigation menu"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Search */}
        <div className="px-5 py-4 border-b border-gray-100">
          <SearchBar />
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto px-4 py-4">
          {NAV_ITEMS.map((item) => (
            <div key={item.href}>
              <Link
                href={item.href}
                className="flex items-center justify-between py-3 px-2 text-base font-semibold text-gray-800 hover:text-brand-600 rounded-xl hover:bg-brand-50 transition-colors"
                aria-current={pathname === item.href ? "page" : undefined}
              >
                {item.label}
              </Link>
              {/* Sub items */}
              {item.children && (
                <div className="ml-4 mb-2 border-l-2 border-gray-100 pl-3">
                  {item.children.slice(1).map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className="block py-2 px-2 text-sm text-gray-600 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                      aria-current={pathname === child.href ? "page" : undefined}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* CTA at bottom */}
        <div className="px-5 py-4 border-t border-gray-100">
          <Link
            href="/recipes"
            className="btn-primary btn-lg w-full text-center"
            onClick={onClose}
          >
            Browse All Recipes
          </Link>
          <Link
            href="/admin"
            className="block mt-3 text-center text-xs text-gray-400 hover:text-gray-600 transition-colors py-2"
            onClick={onClose}
          >
            Admin ↗
          </Link>
        </div>
      </div>
    </>
  );
}

// ── Main Navbar ────────────────────────────────────────────────
export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Scroll shadow
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close dropdown on route change
  useEffect(() => { setActiveDropdown(null); }, [pathname]);

  const toggleDropdown = (label: string) =>
    setActiveDropdown((prev) => (prev === label ? null : label));

  return (
    <>
      <header
        className={`sticky top-0 z-sticky bg-white transition-shadow duration-200 ${
          scrolled ? "shadow-md border-b border-gray-100" : "border-b border-gray-100"
        }`}
        role="banner"
      >
        <div className="container-base">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Logo />

            {/* Desktop nav */}
            <nav
              className="hidden md:flex items-center gap-1"
              role="navigation"
              aria-label="Main navigation"
              ref={dropdownRef}
            >
              {NAV_ITEMS.map((item) => (
                <div key={item.href} className="relative">
                  {item.children ? (
                    <>
                      <button
                        onClick={() => toggleDropdown(item.label)}
                        className={`
                          flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-semibold
                          transition-colors duration-150 min-h-[40px]
                          ${
                            pathname.startsWith(item.href)
                              ? "text-brand-600 bg-brand-50"
                              : "text-gray-700 hover:text-brand-600 hover:bg-gray-50"
                          }
                        `}
                        aria-expanded={activeDropdown === item.label}
                        aria-haspopup="true"
                      >
                        {item.label}
                        <svg
                          className={`w-3.5 h-3.5 transition-transform duration-200 ${
                            activeDropdown === item.label ? "rotate-180" : ""
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      <DropdownMenu isOpen={activeDropdown === item.label}>
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className={`
                              block px-4 py-2 text-sm transition-colors duration-100
                              ${
                                pathname === child.href
                                  ? "text-brand-600 bg-brand-50 font-semibold"
                                  : "text-gray-700 hover:text-brand-600 hover:bg-gray-50"
                              }
                            `}
                            aria-current={pathname === child.href ? "page" : undefined}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </DropdownMenu>
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      className={`
                        px-3 py-2 rounded-lg text-sm font-semibold transition-colors duration-150 min-h-[40px] flex items-center
                        ${
                          pathname === item.href
                            ? "text-brand-600 bg-brand-50"
                            : "text-gray-700 hover:text-brand-600 hover:bg-gray-50"
                        }
                      `}
                      aria-current={pathname === item.href ? "page" : undefined}
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
            </nav>

            {/* Desktop right: search + CTA */}
            <div className="hidden lg:flex items-center gap-3">
              <SearchBar className="w-56" />
              <Link
                href="/recipes"
                className="btn-primary whitespace-nowrap"
              >
                Browse Recipes
              </Link>
            </div>

            {/* Tablet: search icon only */}
            <div className="hidden md:flex lg:hidden items-center gap-2">
              <Link
                href="/search"
                className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors"
                aria-label="Search"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </Link>
            </div>

            {/* Mobile: hamburger */}
            <button
              className="md:hidden min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
            >
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

          </div>
        </div>
      </header>

      {/* Mobile drawer (rendered outside header for proper z-index) */}
      <MobileDrawer
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />
    </>
  );
}
