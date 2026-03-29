import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import type { Category } from '@/lib/api'

interface CategoryCardProps {
  category: Category
  className?: string
}

export function CategoryCard({ category, className }: CategoryCardProps) {
  return (
    <Link
      href={`/recipes/${category.slug}`}
      className={cn(
        'group block relative rounded-xl overflow-hidden aspect-square',
        className
      )}
    >
      {/* Background Image */}
      <Image
        src={category.image}
        alt={`${category.name} recipes - Spice & Simmer`}
        fill
        className="object-cover group-hover:scale-110 transition-transform duration-500"
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
      
      {/* Content */}
      <div className="absolute inset-0 flex items-end p-3 sm:p-4">
        <h3 className="text-sm sm:text-base font-semibold text-white">
          {category.name}
        </h3>
      </div>
    </Link>
  )
}
