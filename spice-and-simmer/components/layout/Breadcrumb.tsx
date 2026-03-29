import Link from "next/link";
import type { BreadcrumbItem } from "@/types";

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumb({ items, className = "" }: BreadcrumbProps) {
  return (
    <>
      {/* Breadcrumb JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: items.map((item, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: item.label,
              ...(item.href ? { item: `${process.env.NEXT_PUBLIC_SITE_URL}${item.href}` } : {}),
            })),
          }),
        }}
      />

      {/* Visual breadcrumb — hidden on mobile */}
      <nav
        aria-label="Breadcrumb"
        className={`breadcrumb ${className}`}
      >
        <ol className="flex items-center flex-wrap gap-1.5" itemScope itemType="https://schema.org/BreadcrumbList">
          {items.map((item, i) => {
            const isLast = i === items.length - 1;
            return (
              <li
                key={i}
                className="flex items-center gap-1.5"
                itemProp="itemListElement"
                itemScope
                itemType="https://schema.org/ListItem"
              >
                {!isLast && item.href ? (
                  <>
                    <Link
                      href={item.href}
                      className="breadcrumb-item"
                      itemProp="item"
                    >
                      <span itemProp="name">{item.label}</span>
                    </Link>
                    <span className="breadcrumb-sep" aria-hidden="true">›</span>
                  </>
                ) : (
                  <span
                    className="text-gray-900 font-medium"
                    aria-current="page"
                    itemProp="name"
                  >
                    {item.label}
                  </span>
                )}
                <meta itemProp="position" content={String(i + 1)} />
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
