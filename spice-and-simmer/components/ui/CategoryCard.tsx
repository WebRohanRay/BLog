import Link from "next/link";
import Image from "next/image";
import type { Category } from "@/types";

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  const href = `/recipes/${category.slug}`;

  return (
    <Link
      href={href}
      className="group relative flex flex-col items-center rounded-2xl overflow-hidden bg-gray-100 aspect-square hover:shadow-card-hover transition-shadow duration-300"
      aria-label={`Browse ${category.name} recipes`}
    >
      {/* Background image */}
      {category.image && (
        <Image
          src={category.image}
          alt={`${category.name} recipes`}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />
      )}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

      {/* Label */}
      <div className="absolute bottom-0 left-0 right-0 p-3 text-center">
        <span className="text-white font-bold text-sm leading-tight block">
          {category.name}
        </span>
      </div>
    </Link>
  );
}
