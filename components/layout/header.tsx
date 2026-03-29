'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Search, ChefHat, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '/recipes', label: 'Recipes' },
  { href: '/recipes/appetizers', label: 'Appetizers' },
  { href: '/recipes/desserts', label: 'Desserts' },
  { href: '/blog', label: 'Blog' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const closeMobile = () => setMobileMenuOpen(false)

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group" onClick={closeMobile}>
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <ChefHat className="w-6 h-6 text-primary-foreground" />
            </div>
            <div className="hidden sm:block">
              <span className="font-serif text-xl sm:text-2xl font-bold text-foreground tracking-tight">
                Spice &amp; Simmer
              </span>
              <p className="text-xs text-muted-foreground -mt-0.5">Indian Flavors, Global Inspirations</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-4 py-2 text-sm font-medium transition-colors rounded-lg hover:bg-accent',
                  pathname === link.href || pathname.startsWith(link.href + '/')
                    ? 'text-foreground font-semibold'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {link.label}
              </Link>
            ))}
            <Link href="/admin" className="ml-2">
              <Button variant="outline" size="sm" className="gap-1.5">
                <Settings className="w-3.5 h-3.5" />
                Admin
              </Button>
            </Link>
          </div>

          {/* Right side — Search & Mobile Toggle */}
          <div className="flex items-center gap-1">
            <Link href="/search">
              <Button variant="ghost" size="icon" className="h-10 w-10">
                <Search className="h-5 w-5" />
                <span className="sr-only">Search</span>
              </Button>
            </Link>

            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden h-10 w-10"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <div
          className={cn(
            'lg:hidden overflow-hidden transition-all duration-1000 ease-in-out',
            mobileMenuOpen ? 'max-h-[32rem] pb-4' : 'max-h-0'
          )}
        >
          <div className="flex flex-col gap-1 pt-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMobile}
                className={cn(
                  'px-4 py-3 text-base font-medium rounded-lg transition-colors',
                  pathname === link.href || pathname.startsWith(link.href + '/')
                    ? 'bg-accent text-foreground font-semibold'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                )}
              >
                {link.label}
              </Link>
            ))}

            {/* Divider */}
            <div className="my-2 border-t border-border" />

            {/* Admin — full-width button */}
            <Link href="/admin" onClick={closeMobile}>
              <Button className="w-full gap-2" variant="default">
                <Settings className="w-4 h-4" />
                Admin Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </nav>
    </header>
  )
}
