---
name: universal_platform_builder
description: Comprehensive workflow to build a highly professional, multi-phased Next.js + Firebase + Cloudinary platform for any type of business.
---

# Universal Business Platform Builder & Architecture Guide

**Goal**: Act as the master instruction manual for generating a complete, professional, custom software platform (both customer-facing website and an internal Admin dashboard) for ANY business (e.g., Bakery, Gym, SaaS, Agency, E-commerce). This workflow enforces a predictable, high-quality, 5-Phase process driven entirely by strict requirement gathering and a Frontend-First (Dummy Data) philosophy.

---

## Part 1: Core AI Directives

As the AI agent automatically executing this workflow, you MUST obey these rules at ALL times:

1. **Exhaustive Detail Gathering First:** Before even thinking about planning or coding, you must relentlessly ask questions until you possess *each and every detail* about the website. You must fully understand the exact goal, brand, and target user flow. Never assume anything.
2. **Google Maps Intelligence:** If a user provides a Google Maps link to their business, you MUST use your web search capabilities to analyze their business, extract details (name, hours, services, photos, vibe from reviews), and proactively suggest custom features based on what the business offers and what competitors in that space do.
3. **Competitor Research:** Always search for 2-3 competitor websites in the same business niche. Analyze their sections, features, and UX patterns. Use this intelligence to proactively suggest features that will give the user's website a competitive edge.
4. **Continuous Verification (Testing at Each Stage):** At the end of EVERY phase, a test must be implemented or a manual verification step must be explicitly requested. You CANNOT proceed to the next phase until the current phase's output is verified working perfectly.
5. **Plan Approval Required:** You must generate a detailed `implementation_plan.md` artifact outlining the chosen schemas and architectural approach. DO NOT proceed to Phase 2 until the user explicitly approves this plan.
6. **Strict Frontend-First Development:** You must build the entire UI, including complex Admin CRUD forms and public storefront logic, entirely driven by a robust `lib/dummy-data.ts` file *before* configuring any database or third-party service.
7. **Professional UI Quality:** The design must be breathtaking. Boring, simple white-and-gray forms are unacceptable. Employ modern Tailwind techniques (micro-interactions, proper typography scales, subtle shadows, glassmorphism if applicable, highly responsive grids). Use `shadcn/ui` extensively.
8. **Dark Mode by Default:** Every platform MUST ship with a fully functional Light/Dark mode toggle. Use CSS variables and Tailwind's `dark:` variant. The theme toggle must be accessible from the Navbar. Both modes must look equally stunning.
9. **No Raw `<img>` Tags:** Always use the Next.js `<Image />` component for every image rendered on the platform. Enforce `loading="lazy"`, proper `sizes` attributes, and `priority` on above-the-fold hero images for optimal Core Web Vitals.
10. **Skeleton Loading & Error States:** Every page and component that fetches data must implement: (a) A polished skeleton/shimmer loading state, (b) A graceful error boundary with retry functionality, (c) A beautifully designed empty-state illustration when no data exists yet.
11. **Cache Revalidation Strategy:** All data mutations in the Admin panel (create, update, delete) MUST use Next.js Server Actions with `revalidatePath()` or `revalidateTag()` to ensure changes are instantly visible on the public storefront. Stale data after mutations is unacceptable.
12. **Auto-Generate Favicon & OG Images:** Use the `generate_image` tool to create a custom favicon and OpenGraph social sharing image (1200x630) based on the brand colors and business name. Never ship a project with default Next.js icons.
13. **Accessibility (WCAG) Enforcement:** Every interactive element must have proper `aria-labels`. All buttons & links must be keyboard-navigable with visible focus rings. Color contrast ratios must meet WCAG AA standards. Use semantic HTML (`<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`) everywhere.
14. **Optimistic UI Updates:** When an admin creates, edits, or deletes an item, the UI must update instantly (optimistic update) while the Firebase call happens in the background. If the call fails, the UI must rollback and show an error toast. This makes the admin feel blazing fast.
15. **Spam Protection on Public Forms:** All public-facing forms (Contact, Comments, Newsletter) must include a hidden honeypot field. If the honeypot is filled, silently reject the submission. Optionally add basic client-side rate limiting (disable submit for 5 seconds after submission).
16. **Page Transition Animations:** Install `framer-motion` and wrap the main content area with `<AnimatePresence>` and `<motion.div>` for smooth fade/slide page transitions. This gives the website a native-app-like premium feel.
17. **Real-Time Search & Filter on Listings:** Every public listing page (menu, products, classes, etc.) must include a debounced search input and category/tag filter dropdown that filters items in real-time on the client side. The filter state should be reflected in the URL query params for shareability.
18. **Tech Stack Enforcement:** Next.js (App Router), Tailwind CSS, shadcn/ui, Firebase (Auth & Firestore), Cloudinary, and framer-motion. No deviations.

---

## Part 2: The 5-Phase Execution Protocol

### Phase 1: Exhaustive Discovery & Deep Understanding (NO CODING)

**Step 1.1 — Interrogate the User:**
Immediately ask the following structured questions. Do NOT proceed until every single one is answered:

1. **Google Maps Context**: "Do you have a Google Maps link or Google Business Profile for this business? If yes, share it and I will deeply analyze everything about the business before we begin."
2. **Business Identity & Goal**: "What exactly does this business do? What is the single most important action a visitor should take on this website (e.g., place an order, book a class, contact you)?"
3. **Target Audience**: "Who is the ideal customer visiting this site? (Age range, tech-savviness, local vs global audience)"
4. **Pages & Sections**: "What specific pages do you need? (e.g., Home, About, Menu/Services, Gallery, Contact, Blog, Testimonials, FAQ)"
5. **Exhaustive Entity Mapping**: "What are the *exact* pieces of data we are storing and managing via the Admin panel? List every single field for each entity. (e.g., For a Dish: name, description, price, category, image, allergens, spice level, availability status)"
6. **Complex Features**: "Beyond a standard website and admin panel, what advanced features do you need? (e.g., Online ordering, Booking calendar, User reviews, Newsletter subscription, WhatsApp integration, Payment gateway)"
7. **Micro-Branding & Aesthetic**: "What is the exact visual vibe? Share specific hex codes for brand colors if you have them. Do you prefer sharp corners or rounded? Serif or sans-serif fonts? Minimalist or maximalist?"
8. **Existing Assets**: "Do you have a logo, brand guidelines, or specific images you want used?"

**Step 1.2 — Google Maps & Competitor Deep Dive:**
If a Google Maps link was provided:
- Use `search_web` and `read_url_content` tools to extract: business name, address, hours, phone, rating, review highlights, photos, and service categories.
- Search for 2-3 direct competitor websites in the same niche and city/region.
- Analyze competitor sections (Hero, Menu/Services, Testimonials, CTAs) and note features the user's site should match or exceed.

**Step 1.3 — Proactive Feature Suggestions:**
Based on the Google Maps data and competitor analysis, proactively suggest:
- Features the competitors have that the user didn't mention (e.g., online ordering, loyalty programs).
- A floating **WhatsApp CTA button** for local businesses (bakeries, salons, gyms, restaurants) — this is a massive conversion booster.
- Testimonial/review sections pre-populated from their Google reviews.
- A gallery section if the business has strong visual appeal.

**Step 1.4 — Draft the Implementation Plan:**
After gathering ALL details, draft a comprehensive `implementation_plan.md` artifact containing:
- Full feature list (user-requested + AI-suggested).
- Exhaustive TypeScript/Zod-style interface schemas for every entity.
- Sitemap showing every page and route.
- Chosen design aesthetic with specific color palette (hex codes), font choices, and border-radius values.
- The exact phase-by-phase execution breakdown.

Example schema:
```typescript
interface MenuItem {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string; // slug reference
  allergens: string[];
  spiceLevel: 'mild' | 'medium' | 'hot';
  imageUrl: string; // Cloudinary URL
  imagePublicId: string; // For deletion
  featured: boolean;
  available: boolean;
  status: 'draft' | 'published';
  createdAt: string;
  updatedAt: string;
}
```

**VERIFICATION STEP:** Stop execution completely. Present the plan to the user and wait for explicit approval. Do NOT write any code until the user says "approved" or "go ahead."

---

### Phase 2: Core Foundation Setup

1. **Initialization:** Initialize a Next.js `app` directory project (if not already existing). Use `pnpm` as the package manager.
2. **Styling Setup:**
   - Install Tailwind CSS and configure it with the brand's exact color palette as CSS custom properties in `app/globals.css`.
   - Define both `light` and `dark` theme variables. Example:
     ```css
     :root {
       --background: 0 0% 100%;
       --foreground: 222.2 84% 4.9%;
       --primary: 24 95% 53%; /* Brand orange etc. */
     }
     .dark {
       --background: 222.2 84% 4.9%;
       --foreground: 210 40% 98%;
       --primary: 24 95% 60%;
     }
     ```
   - Install `lucide-react` for icons.
   - Install a professional Google Font (e.g., Inter, Outfit, Poppins) matching the brand vibe.
3. **Component System:** Install `shadcn/ui` and initialize these base components (minimum):
   `button`, `input`, `textarea`, `card`, `select`, `switch`, `label`, `dialog`, `dropdown-menu`, `table`, `badge`, `skeleton`, `toast` (sonner), `sheet` (for mobile nav).
4. **Animation Library:** Install `framer-motion`. Create a reusable `components/page-transition.tsx` wrapper:
   ```tsx
   'use client'
   import { motion } from 'framer-motion'
   export default function PageTransition({ children }: { children: React.ReactNode }) {
     return (
       <motion.div
         initial={{ opacity: 0, y: 12 }}
         animate={{ opacity: 1, y: 0 }}
         exit={{ opacity: 0, y: -12 }}
         transition={{ duration: 0.3, ease: 'easeInOut' }}
       >
         {children}
       </motion.div>
     )
   }
   ```
   Wrap every page's main content with `<PageTransition>` for smooth route transitions.
5. **Dark Mode Toggle:** Implement `next-themes` provider and a polished theme toggle button in the Navbar (Sun/Moon icon with smooth transition).
6. **Favicon & OG Image Generation:** Use the `generate_image` tool to create:
   - A custom **favicon** (512x512) using the brand's primary color and the business initial/logo.
   - A custom **OpenGraph image** (1200x630) for social sharing, featuring the business name, tagline, and brand colors.
   - Place these in `app/favicon.ico` (or `app/icon.png`) and `public/og-image.png`.
7. **Layout Scaffolding:**
   - Build a highly engaging responsive `Navbar` (with mobile hamburger menu using `Sheet`) and `Footer` in `app/layout.tsx`.
   - All interactive elements must have `aria-labels`, visible keyboard focus rings (`focus-visible:ring-2`), and semantic HTML tags (`<nav>`, `<main>`, `<footer>`).
   - Build an Admin wrapper in `app/admin/layout.tsx` featuring a permanent sidebar with icons linking to every entity defined in Phase 1 (e.g., `/admin/menu-items`, `/admin/categories`, `/admin/orders`).
8. **Error Boundary Setup:** Create a global `app/error.tsx` and `app/not-found.tsx` with professional, branded error pages. Both must be fully accessible.

**VERIFICATION STEP:** Run `pnpm dev`. Open the browser and verify:
- The Navbar renders on both mobile and desktop.
- The dark/light mode toggle works perfectly.
- The Admin sidebar layout renders without errors.
- The 404 page displays correctly.
Fix any issues before proceeding.

---

### Phase 3: Frontend First, High-Converting UI & Copywriting (Dummy Data)

**CRITICAL RULES FOR THIS PHASE:**
- Do NOT configure Firebase or Cloudinary keys yet.
- ZERO "Lorem Ipsum" text allowed anywhere. All copy must be realistic and business-specific.
- Every image must use the Next.js `<Image />` component with proper `sizes` and lazy loading.
- Every list/grid must have a skeleton loading state and an empty state.

**Step 3.1 — AI Copywriter & Mock Data Generation:**
Create a massive, realistic `lib/dummy-data.ts`. It must:
- Export typed arrays matching every entity schema from Phase 1.
- Use the Google Maps context and competitor analysis to write highly specific, professionally written names, descriptions, and sales copy.
- Include realistic Unsplash placeholder image URLs matching the business niche.

**Step 3.2 — Hero Section Brainstorming:**
Before coding the homepage, explicitly present 3 highly engaging Hero Section design concepts to the user, tailored to this specific business. Examples:
- **Option A:** Full-bleed background image with overlaid gradient text + floating CTA button with micro-animation.
- **Option B:** Split-screen layout — left side: punchy headline + CTA, right side: auto-rotating image carousel.
- **Option C:** Video background with frosted glass overlay card containing the headline and CTA.
Wait for user preference before coding.

**Step 3.3 — Public Storefront Assembly:**
Build all public-facing pages querying `dummy-data.ts`. Wrap every page in `<PageTransition>`:
- `app/page.tsx` — Hero section (chosen design) + featured items grid + testimonials + CTA sections.
- `app/about/page.tsx` — Business story, team (if applicable), values.
- `app/[entity-plural]/page.tsx` — Grid/list page. **MUST include:**
  - A debounced search input (300ms) filtering items by name/title in real-time.
  - A category/tag dropdown filter.
  - URL query param sync so filtered views are shareable (e.g., `/menu?search=cake&category=desserts`).
  - Smooth `framer-motion` `layout` animations when items filter in/out.
- `app/[entity-plural]/[slug]/page.tsx` — Individual detail pages.
- `app/contact/page.tsx` — Contact form + embedded Google Map + business hours. **Include a hidden honeypot field** (e.g., `<input name="website" className="hidden" />`) and silently reject submissions where it is filled. Disable the submit button for 5 seconds after submission to prevent spam.
- `app/gallery/page.tsx` — Masonry or lightbox image gallery (if applicable).
- All hero text, CTAs, and descriptions must be high-converting copy based on the business's actual value proposition.
- For local businesses, add a **floating WhatsApp CTA button** (fixed bottom-right, with pulse animation).
- **Accessibility check:** Verify every button has `aria-label`, every image has descriptive `alt` text, and all form inputs have associated `<label>` elements.

**Step 3.4 — Admin Dashboard Assembly:**
For every entity defined in Phase 1:
- **List View** (`app/admin/[entity]/page.tsx`): Shadcn Table with columns, status badges, search/filter bar, and action buttons (Edit, Delete with confirmation dialog).
- **Create/Edit Form** (`app/admin/[entity]/new/page.tsx` and `app/admin/[entity]/[id]/edit/page.tsx`): Full forms using `useState` or `react-hook-form`. Use Shadcn complex inputs (`Select`, `Switch`, `Textarea`).
- **Mock Image Upload:** Render a styled `ImageUpload` component placeholder that stores a dummy URL for now.
- **Dashboard Home** (`app/admin/page.tsx`): Stats cards (total items, pending reviews, etc.) with animated counters using dummy numbers.

**Step 3.5 — Responsive Verification:**
You MUST explicitly verify the entire application renders beautifully at these three breakpoints:
- **Mobile:** 375px width
- **Tablet:** 768px width
- **Desktop:** 1440px width

**VERIFICATION STEP:** Instruct the user to run the dev server and navigate the entire application. They must approve:
- The hero section design and copywriting.
- The storefront pages and data grid layouts.
- The admin forms and table layouts.
- Responsiveness across all screen sizes.
- Dark mode appearance on every page.
Do NOT proceed until approval is received.

---

### Phase 4: Backend Service Integration (Firebase & Cloudinary)

**Step 4.1 — Firebase Initialization:**
Set up `lib/firebase.ts` using the singleton `getApps()` pattern:
```typescript
import { initializeApp, getApps } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
const db = getFirestore(app)
const auth = getAuth(app)

export { app, db, auth }
```

**Step 4.2 — Cloudinary Reliability Architecture:**
To prevent the upload failures experienced in past projects, enforce this robust pattern:
- **Server-Side Signing Route** (`app/api/cloudinary/sign/route.ts`):
  ```typescript
  import { v2 as cloudinary } from 'cloudinary'
  import { NextResponse } from 'next/server'

  cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  })

  export async function POST(request: Request) {
    const body = await request.json()
    const { folder } = body
    const timestamp = Math.round(new Date().getTime() / 1000)
    const signature = cloudinary.utils.api_sign_request(
      { timestamp, folder },
      process.env.CLOUDINARY_API_SECRET!
    )
    return NextResponse.json({ timestamp, signature, cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, apiKey: process.env.CLOUDINARY_API_KEY })
  }
  ```
- **Deletion Route** (`app/api/cloudinary/delete/route.ts`): Similar pattern for secure server-side image deletion.
- **Robust `<ImageUpload />` Component** (`components/admin/image-upload.tsx`): Requests the signature from `/api/cloudinary/sign`, then performs a signed upload to Cloudinary. Includes drag-and-drop, preview, progress bar, and error retry with toast notifications.

**Step 4.3 — Generic API Layer:**
Create `lib/api.ts` with generic, reusable Firestore CRUD functions:
```typescript
import { db } from './firebase'
import { collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, query, where, orderBy, serverTimestamp, limit as limitFn } from 'firebase/firestore'

// Generic Create
export async function createDocument<T>(collectionName: string, data: Omit<T, 'id'>): Promise<string> {
  const docRef = await addDoc(collection(db, collectionName), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return docRef.id
}

// Generic Read (all)
export async function getDocuments<T>(collectionName: string, publishedOnly = false): Promise<T[]> {
  let q = query(collection(db, collectionName), orderBy('createdAt', 'desc'))
  if (publishedOnly) q = query(q, where('status', '==', 'published'))
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T))
}

// Generic Read (single by ID)
export async function getDocumentById<T>(collectionName: string, id: string): Promise<T | null> {
  const docRef = doc(db, collectionName, id)
  const docSnap = await getDoc(docRef)
  if (!docSnap.exists()) return null
  return { id: docSnap.id, ...docSnap.data() } as T
}

// Generic Update
export async function updateDocument<T>(collectionName: string, id: string, data: Partial<T>): Promise<void> {
  const docRef = doc(db, collectionName, id)
  await updateDoc(docRef, { ...data, updatedAt: serverTimestamp() })
}

// Generic Delete
export async function deleteDocument(collectionName: string, id: string): Promise<void> {
  const docRef = doc(db, collectionName, id)
  await deleteDoc(docRef)
}
```
Then create entity-specific wrapper files (e.g., `lib/api/menu-items.ts`) that import and call these generics with the correct collection name and type for developer convenience.

**Step 4.4 — Server Actions for Cache Revalidation:**
Create Next.js Server Actions (e.g., `app/actions.ts`) that wrap the API calls and call `revalidatePath()` after every mutation:
```typescript
'use server'
import { revalidatePath } from 'next/cache'

export async function revalidateEntity(path: string) {
  revalidatePath(path)
}
```
Every Admin create/update/delete action must call the relevant Server Action to bust the cache immediately.

**Step 4.5 — Environment Variable Documentation:**
Create a `.env.example` file documenting every required environment variable:
```
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

**VERIFICATION STEP:** Before wiring to the UI, write an isolated test:
- Create a temporary API route (`app/api/test/route.ts`) that creates a test document in Firestore, reads it back, and deletes it.
- Test the Cloudinary signing endpoint with a sample upload.
- Verify both work perfectly. Delete the test route after verification.

---

### Phase 5: Final Wiring, Polish, SEO & Deployment Readiness

**Step 5.1 — Replace Mock Data with Optimistic Live Queries:**
Systematically replace all imports from `lib/dummy-data.ts` across every admin and public page with live asynchronous calls to `lib/api.ts`. Ensure every page properly handles:
- Loading states (skeleton shimmer animations).
- Error states (error boundary with retry button).
- Empty states (beautiful illustration/message when no data exists yet).

**Optimistic UI Pattern for Admin:** When performing create/update/delete in the Admin panel, immediately update the local state (optimistic) before the Firebase call resolves. If the call fails, rollback the state and display an error toast. Example pattern:
```typescript
// Optimistic delete example
const handleDelete = async (id: string) => {
  const previousItems = [...items] // Save current state
  setItems(items.filter(item => item.id !== id)) // Optimistic remove
  try {
    await deleteDocument('menu-items', id)
    toast.success('Item deleted successfully')
    await revalidateEntity('/menu') // Bust cache
  } catch (error) {
    setItems(previousItems) // Rollback on failure
    toast.error('Failed to delete item. Please try again.')
  }
}
```

**Step 5.2 — Security & Authentication:**
- Integrate Firebase Auth (Email/Password + Google Sign-In).
- Create `lib/auth-context.tsx` with a React context provider wrapping the entire app.
- Create `components/auth-guard.tsx` that redirects unauthenticated users away from `/admin/*` routes.
- Build a professionally styled `/login` page with the brand's design language.

**Step 5.3 — SEO Polish:**
- Add dynamic `generateMetadata()` functions to every public page, mapping title and description to the business's actual content.
- Create `app/sitemap.ts` that dynamically generates a sitemap from all published entities.
- Create `app/robots.ts` with proper crawl rules.
- Ensure every page has a single `<h1>`, proper heading hierarchy, and semantic HTML.

**Step 5.4 — Performance & Image Optimization Audit:**
- Confirm every single image uses the Next.js `<Image />` component.
- Verify `priority` is set on above-the-fold hero images.
- Ensure proper `sizes` attributes are set for responsive image loading.
- Check that no unnecessary client-side JavaScript is shipped on public pages.

**Step 5.5 — Deployment Readiness Checklist:**
Before announcing completion, verify:
- [ ] `.env.example` file exists documenting all required variables.
- [ ] `next.config.mjs` has proper `images.remotePatterns` for Cloudinary and Unsplash domains.
- [ ] The project builds successfully with `pnpm build` (zero errors).
- [ ] The Vercel deployment configuration is ready (no special config needed for standard Next.js).
- [ ] All admin CRUD operations work end-to-end (create → appears on storefront, delete → disappears instantly).
- [ ] Optimistic UI updates work (instant feedback, rollback on error).
- [ ] Dark mode works on every single page.
- [ ] Mobile responsiveness is verified at 375px, 768px, and 1440px.
- [ ] Custom favicon and OG image are generated and in place (not default Next.js icons).
- [ ] Page transition animations are smooth across all routes.
- [ ] Public listing pages have working search and filter with URL param sync.
- [ ] Contact/comment forms have honeypot spam protection.
- [ ] All interactive elements pass basic accessibility checks (aria-labels, focus rings, semantic HTML).
- [ ] All images have descriptive `alt` text.

**FINAL VERIFICATION STEP:** Perform a full end-to-end test:
1. Log in to the Admin panel.
2. Create a new entity with an image (uploaded to Cloudinary).
3. Verify it appears on the public storefront immediately (cache revalidation working).
4. Edit the entity and verify the update reflects.
5. Delete the entity and verify it disappears.
6. Verify the SEO meta tags are correct on the entity's page.
7. Announce to the user: "Your custom business platform is fully tested, operational, and ready for content and deployment!"
