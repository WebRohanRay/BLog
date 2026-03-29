# 🌶️ Spice & Simmer — Complete Next.js 14 Food Blog Platform

> **Indian-American Fusion Recipes · SEO Traffic Engine · $0/month**

A complete, production-ready food blog platform built with Next.js 14 App Router.
Every recipe = 1 Google-indexable SEO-optimized page = organic traffic = AdSense revenue.

---

## 📦 What's Included (All 10 Phases)

### Phase 1 — Foundation
- Next.js 14 App Router project scaffold
- Full folder structure (public + admin route groups)
- Tailwind CSS design system with custom tokens
- Global CSS with component classes, animations
- Root layout with Playfair Display + Lato fonts
- TypeScript types for entire platform
- `.env.example` with all 15 environment variables
- `.gitignore`, `tsconfig.json`, `next.config.js`

### Phase 2 — Firebase
- Firebase client SDK (singleton, hot-reload safe)
- Firebase Admin SDK (server-only)
- Typed Firestore collection refs + converters
- All recipe CRUD: create, read, update, publish, delete
- Slug generation + collision detection
- View count increment
- Comment CRUD + rating aggregation
- Categories, Tags, Blogs, Subscribers, Contacts helpers
- Dashboard stats aggregation
- Firebase Auth: signIn, signOut, session cookie
- `AuthContext` + `useAuth()` hook
- `firestore.rules` — security rules
- `firestore.indexes.json` — composite indexes
- ISR revalidation API route
- Admin session API route
- Cloudinary signed upload API route

### Phase 3 — Layout & Navigation
- `Navbar` — sticky, mobile drawer, desktop dropdown, search (⌘K)
- `Footer` — links, social icons, newsletter CTA
- `Breadcrumb` — with JSON-LD schema
- `AdSlot` — CLS=0 guaranteed min-heights
- `Pagination` — smart ellipsis
- `StarRating` — interactive + display modes
- `CategoryCard`, `RecipeCard`, `BlogCard`
- `NewsletterSection` — with hCaptcha
- `ContactForm` — with hCaptcha

### Phase 4 — Homepage
- Full homepage: hero, featured recipes, category grid, latest recipes
- "Why Spice & Simmer" features section
- Newsletter section
- Blog preview section
- Ad slots with min-heights (CLS=0)
- ISR `revalidate = 60`

### Phase 5 — Recipe Pages
- `/recipes` — all recipes with category filter pills, pagination
- `/recipes/[category]` — category page with SEO intro
- `/recipes/[category]/[slug]` — full recipe page:
  - JSON-LD: Recipe schema + FAQ schema + Breadcrumb schema
  - Hero image, time badges, difficulty, tags
  - Ingredient scaling (1×/2×/3×)
  - Step-by-step instructions
  - Tips, Mistakes, Variations sections
  - Nutrition panel (6-cell grid)
  - FAQ accordion
  - Related recipes
  - Comments + ratings
  - Print / PDF / Share buttons
  - Sticky sidebar (ad + popular recipes + newsletter)
  - `data-pagefind-body` for search indexing

### Phase 6 — Cook Engine
- `RecipeSteps` — full interactive step system:
  - Step cards with phase grouping (Prep/Cooking/Finishing)
  - Phase dividers with labels
  - Progress bar (steps done %)
  - Jump-to-step pills
  - Mark as Done (green check, 60% opacity)
  - Session persistence (`sessionStorage`)
  - Completion banner at 100%
- `StepTimer` — per-step countdown:
  - Circular SVG progress ring
  - Start/Pause/Reset controls
  - Audio chime on completion
  - Browser Notification API
- `CookMode` — full-screen overlay:
  - Wake Lock API (screen stays on while cooking)
  - Graceful fallback if Wake Lock denied
  - Keyboard navigation (Arrow keys, Escape)
  - Prev/Next step buttons (52px touch targets)
  - Mobile progress dots
  - Phase badge per step
- `RecipeActions` — serving scaler (1×/2×/3×), print, PDF (jsPDF + html2canvas), share

### Phase 7 — Blog System
- `/blog` — paginated blog listing
- `/blog/[slug]` — individual post with related recipes
- `BlogCard` component
- `BlogEditor` admin component

### Phase 8 — Supporting Pages & SEO Infrastructure
- `/search` — Pagefind browser-based search (no API, no cost)
- `/tags/[slug]` — tag listing page
- `/about` — about page
- `/contact` — contact page with form
- `/privacy-policy` — AdSense-required privacy policy
- `sitemap.ts` — dynamic sitemap (recipes + blogs + categories)
- `robots.ts` — blocks /admin, /search, AI bots
- `not-found.tsx` — custom 404
- `loading.tsx` — global skeleton
- `middleware.ts` — admin guard + noindex headers

### Phase 9 — Newsletter & Forms
- `/api/newsletter/subscribe` — hCaptcha + Zod + double opt-in flow
- `/api/newsletter/confirm` — token validation + welcome email with lead magnet
- `/api/contact` — hCaptcha + Zod + Resend notification
- `/api/comments` — hCaptcha + Zod + pending status
- All Zod validators in `lib/validators/schemas.ts`

### Phase 10 — Admin Panel
- Firebase Auth protected layout with sidebar navigation
- Admin login page (`/admin/login`)
- Dashboard with stat cards + quick actions + recent recipes table
- Recipe list with status, edit links
- **Recipe editor** (4-tab form):
  - Tab 1: Basic info, image, nutrition, ingredients
  - Tab 2: Steps (add/remove/reorder, phase, timer, tip)
  - Tab 3: Tips, mistakes, variations, FAQs, tags
  - Tab 4: SEO (Google preview, title, description, keywords)
  - Auto slug generation + immutability warning on published recipes
  - Auto SEO title + meta description generation
  - Draft save + Publish with ISR revalidation trigger
- Blog list + Blog editor (title, slug, HTML content, SEO, tags)
- Categories page (add/delete)
- Tags page (add/delete)
- Comments moderation (pending/approved/rejected tabs, approve/reject/delete)
- Subscribers table + CSV export
- `useCloudinaryUpload` hook for image uploads

---

## 🚀 Quick Start

### 1. Create Next.js project
```bash
npx create-next-app@14 spice-and-simmer \
  --typescript --tailwind --eslint --app \
  --src-dir=no --import-alias="@/*"
cd spice-and-simmer
```

### 2. Install all dependencies
```bash
npm install \
  firebase firebase-admin \
  zod resend \
  @hcaptcha/react-hcaptcha \
  react-beautiful-dnd \
  jspdf html2canvas \
  pagefind uuid slugify \
  date-fns react-hot-toast \
  clsx tailwind-merge \
  @types/uuid @types/react-beautiful-dnd

npm install -D \
  @tailwindcss/typography \
  @tailwindcss/forms \
  @tailwindcss/aspect-ratio
```

### 3. Copy all files from ZIP into project

### 4. Configure environment variables
```bash
cp .env.example .env.local
# Fill in all values
```

### 5. Deploy Firebase rules and indexes
```bash
npm install -g firebase-tools
firebase login
firebase init firestore  # select your project
firebase deploy --only firestore:rules,firestore:indexes
```

### 6. Create admin user
Firebase Console → Authentication → Users → Add user

### 7. Run dev server
```bash
npm run dev
# Open http://localhost:3000
# Admin: http://localhost:3000/admin/login
```

### 8. Production build (includes Pagefind indexing)
```bash
npm run build
```

---

## 📁 Complete File Tree

```
spice-and-simmer/
├── app/
│   ├── layout.tsx                          ← Root layout, fonts, OG, schemas
│   ├── loading.tsx                         ← Global skeleton
│   ├── not-found.tsx                       ← Custom 404
│   ├── robots.ts                           ← robots.txt
│   ├── sitemap.ts                          ← Dynamic sitemap
│   ├── (public)/
│   │   ├── layout.tsx                      ← Navbar + Footer
│   │   ├── page.tsx                        ← Homepage
│   │   ├── about/page.tsx
│   │   ├── contact/page.tsx
│   │   ├── privacy-policy/page.tsx
│   │   ├── search/page.tsx                 ← Pagefind search
│   │   ├── blog/
│   │   │   ├── page.tsx                    ← Blog listing
│   │   │   └── [slug]/page.tsx             ← Blog post
│   │   ├── recipes/
│   │   │   ├── page.tsx                    ← All recipes
│   │   │   └── [category]/
│   │   │       ├── page.tsx                ← Category listing
│   │   │       └── [slug]/page.tsx         ← Recipe page ⭐
│   │   └── tags/[slug]/page.tsx
│   ├── (admin)/
│   │   ├── layout.tsx                      ← Auth guard + sidebar
│   │   ├── login/page.tsx
│   │   ├── page.tsx                        ← Dashboard
│   │   ├── recipes/
│   │   │   ├── page.tsx
│   │   │   ├── new/page.tsx
│   │   │   └── [id]/edit/page.tsx
│   │   ├── blogs/
│   │   │   ├── page.tsx
│   │   │   ├── new/page.tsx
│   │   │   └── [id]/edit/page.tsx
│   │   ├── categories/page.tsx
│   │   ├── tags/page.tsx
│   │   ├── comments/page.tsx
│   │   └── subscribers/page.tsx
│   └── api/
│       ├── revalidate/route.ts
│       ├── contact/route.ts
│       ├── comments/route.ts
│       ├── newsletter/
│       │   ├── subscribe/route.ts
│       │   └── confirm/route.ts
│       └── admin/
│           ├── session/route.ts
│           └── upload/route.ts
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx                      ← Mobile drawer + search + dropdown
│   │   ├── Footer.tsx
│   │   └── Breadcrumb.tsx                  ← With JSON-LD
│   ├── ui/
│   │   ├── AdSlot.tsx                      ← CLS=0
│   │   ├── Pagination.tsx
│   │   ├── StarRating.tsx                  ← Interactive + display
│   │   ├── CategoryCard.tsx
│   │   ├── NewsletterSection.tsx           ← hCaptcha + double opt-in
│   │   └── ContactForm.tsx
│   ├── recipe/
│   │   ├── RecipeCard.tsx
│   │   ├── RecipeSteps.tsx                 ← Cook engine ⭐
│   │   ├── RecipeNutrition.tsx
│   │   ├── RecipeFAQ.tsx                   ← Accordion
│   │   ├── RecipeActions.tsx               ← Scale/Print/PDF/Share
│   │   ├── RecipeComments.tsx              ← hCaptcha + rating
│   │   └── RecipeSidebar.tsx               ← Sticky desktop
│   ├── blog/
│   │   └── BlogCard.tsx
│   └── admin/
│       ├── RecipeEditor.tsx                ← Full 4-tab editor ⭐
│       ├── BlogEditor.tsx
│       └── CommentsClient.tsx
├── lib/
│   ├── firebase/
│   │   ├── client.ts
│   │   ├── admin.ts
│   │   ├── collections.ts
│   │   ├── recipes.ts
│   │   ├── queries.ts
│   │   ├── auth.ts
│   │   └── AuthContext.tsx
│   ├── utils/
│   │   └── helpers.ts
│   ├── validators/
│   │   └── schemas.ts                      ← All Zod schemas
│   └── hooks/
│       ├── useCloudinaryUpload.ts
│       └── useDoneSteps.ts
├── types/index.ts                          ← All TypeScript types
├── styles/globals.css                      ← Design system
├── middleware.ts                           ← Auth guard + noindex
├── firestore.rules
├── firestore.indexes.json
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── .env.example                            ← 15 env variables
```

---

## 💰 Revenue Model

| Monthly Visitors | Est. AdSense Revenue |
|-----------------|---------------------|
| 1,000           | $5–15              |
| 10,000          | $50–150            |
| 50,000          | $250–750           |
| 100,000         | $500–1,500         |

**SEO Growth:** Every new recipe = 1 new Google-indexable page with:
- HowToStep rich results (Google SERP)
- Recipe schema (cooking time, ratings)
- FAQ schema (expanded SERP listing)
- Automatic sitemap inclusion within 60 seconds of publish

---

## ✅ Acceptance Criteria Met

| Requirement | Status |
|-------------|--------|
| Recipe page loads < 2s on 4G | ✅ ISR + Cloudinary CDN |
| Responsive 320px → 1280px+ | ✅ Mobile-first Tailwind |
| Cook Mode full-screen mobile | ✅ Wake Lock API |
| Step timer accurate | ✅ setInterval + audio chime |
| Search < 300ms | ✅ Pagefind browser search |
| Publish → live < 60s | ✅ ISR on-demand revalidation |
| Newsletter double opt-in | ✅ Resend + token confirmation |
| CLS = 0 | ✅ Explicit min-heights on all ads |
| Touch targets ≥ 44px | ✅ All buttons min-h-[44px] |
| Images with alt + fallback | ✅ onError → placeholder |
| noindex on /search + /admin | ✅ middleware.ts |
| Slug immutability warning | ✅ RecipeEditor |
| hCaptcha on all forms | ✅ Newsletter, Comment, Contact |
| Zod on all API routes | ✅ All POST routes |
| GDPR unsubscribe | ✅ Confirm email includes link |
| Total cost | ✅ $0/month |

---

*Built with ❤️ and 🌶️ — 10 phases, 60+ files, production-ready.*
