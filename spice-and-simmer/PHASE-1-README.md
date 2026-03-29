# 🌶️ Spice & Simmer — Phase 1: Foundation Complete

## What's in Phase 1

| File | Purpose |
|------|---------|
| `package.json` | All dependencies (Next.js 14, Firebase, Zod, Resend, etc.) |
| `next.config.js` | Image domains, security headers, redirects |
| `tailwind.config.ts` | Full design system (colors, fonts, animations, shadows) |
| `tsconfig.json` | TypeScript with path aliases (`@/components`, `@/lib`, etc.) |
| `.env.example` | All environment variables with comments |
| `.gitignore` | Comprehensive ignore list |
| `types/index.ts` | **All TypeScript types** for the entire platform |
| `styles/globals.css` | Design tokens, CSS variables, all component classes |
| `app/layout.tsx` | Root layout (fonts, metadata, OG, Twitter, structured data) |
| `app/(public)/layout.tsx` | Public layout wrapping Navbar + Footer |
| `app/robots.ts` | SEO robots.txt (blocks /admin, /search, AI bots) |
| `app/not-found.tsx` | Custom 404 page |
| `app/loading.tsx` | Global loading skeleton |
| `middleware.ts` | Admin route guard + noindex headers |
| `components/layout/Navbar.tsx` | Full responsive navbar (mobile drawer, search, dropdown) |
| `components/layout/Footer.tsx` | Full footer (links, social, newsletter CTA) |
| `components/layout/Breadcrumb.tsx` | Breadcrumb with JSON-LD schema |
| `components/ui/AdSlot.tsx` | AdSense slot with CLS=0 min-heights |
| `components/ui/Pagination.tsx` | Smart pagination with ellipsis |
| `components/ui/StarRating.tsx` | Interactive + display star rating |
| `lib/utils/helpers.ts` | All utilities (slug, time, SEO, Cloudinary, etc.) |

---

## Setup Steps

### 1. Create Next.js project
```bash
npx create-next-app@14 spice-and-simmer --typescript --tailwind --eslint --app --src-dir=no --import-alias="@/*"
cd spice-and-simmer
```

### 2. Copy all Phase 1 files into your project
Replace the generated files with the ones from this ZIP.

### 3. Install additional dependencies
```bash
npm install firebase firebase-admin zod resend @hcaptcha/react-hcaptcha \
  react-beautiful-dnd jspdf html2canvas uuid slugify date-fns \
  react-hot-toast clsx tailwind-merge pagefind @types/uuid \
  @types/react-beautiful-dnd @tailwindcss/typography \
  @tailwindcss/forms @tailwindcss/aspect-ratio
```

### 4. Set up environment variables
```bash
cp .env.example .env.local
# Then fill in your values
```

### 5. Run the dev server
```bash
npm run dev
```

---

## Environment Variables Needed

| Variable | Where to Get |
|----------|-------------|
| `NEXT_PUBLIC_FIREBASE_*` | Firebase Console → Project Settings → Your apps |
| `FIREBASE_ADMIN_*` | Firebase Console → Project Settings → Service Accounts |
| `NEXT_PUBLIC_CLOUDINARY_*` | Cloudinary Dashboard → Settings |
| `RESEND_API_KEY` | resend.com → API Keys |
| `NEXT_PUBLIC_HCAPTCHA_SITE_KEY` | hcaptcha.com → Sites |
| `HCAPTCHA_SECRET_KEY` | hcaptcha.com → Settings |
| `REVALIDATE_SECRET` | Run: `openssl rand -hex 32` |
| `NEXT_PUBLIC_SITE_URL` | Your domain or `http://localhost:3000` for dev |

---

## Folder Structure Created

```
spice-and-simmer/
├── app/
│   ├── (public)/          ← All public pages
│   │   ├── recipes/
│   │   ├── blog/
│   │   ├── about/
│   │   ├── contact/
│   │   ├── privacy-policy/
│   │   ├── search/
│   │   └── tags/
│   ├── (admin)/           ← Admin panel (Firebase Auth protected)
│   │   ├── recipes/
│   │   ├── blogs/
│   │   ├── categories/
│   │   ├── tags/
│   │   ├── subscribers/
│   │   └── comments/
│   └── api/               ← API routes
│       ├── revalidate/
│       ├── newsletter/
│       ├── contact/
│       ├── comments/
│       └── admin/upload/
├── components/
│   ├── layout/            ← Navbar, Footer, Breadcrumb
│   ├── ui/                ← AdSlot, Pagination, StarRating, etc.
│   ├── recipe/            ← (Phase 5 & 6)
│   ├── blog/              ← (Phase 7)
│   ├── admin/             ← (Phase 10)
│   └── seo/               ← (Phase 3)
├── lib/
│   ├── firebase/          ← (Phase 2)
│   ├── utils/             ← helpers.ts ✅
│   ├── validators/        ← (Phase 9)
│   └── hooks/             ← (Phases 5-6)
├── types/index.ts         ← All types ✅
└── styles/globals.css     ← Full design system ✅
```

---

## Next: Phase 2 — Firebase Setup
- Firestore client + admin SDK config
- All database helper functions (getRecipe, getCategory, etc.)
- Firestore indexes config
- Firebase Auth setup

---

*Phase 1 of 10 complete. Total files: 21*
