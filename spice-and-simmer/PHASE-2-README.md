# 🔥 Phase 2: Firebase Setup — Complete

## Files Added

| File | Purpose |
|------|---------|
| `lib/firebase/client.ts` | Firebase client SDK — Firestore + Auth initialized (singleton) |
| `lib/firebase/admin.ts` | Firebase Admin SDK — server-side only |
| `lib/firebase/collections.ts` | All typed Firestore collection refs + converters |
| `lib/firebase/recipes.ts` | All recipe CRUD: getBySlug, paginated list, create, update, publish, view count, comments, ratings |
| `lib/firebase/queries.ts` | Categories, Tags, Blogs, Subscribers, Contacts, Dashboard stats |
| `lib/firebase/auth.ts` | signIn, signOut, getCurrentUser, subscribeToAuthState |
| `lib/firebase/AuthContext.tsx` | React context provider + `useAuth()` hook |
| `firestore.indexes.json` | All required composite indexes (deploy with Firebase CLI) |
| `firestore.rules` | Security rules — public read published content, admin write-all |
| `app/api/revalidate/route.ts` | ISR on-demand revalidation endpoint |
| `app/api/admin/session/route.ts` | Set/clear session cookie after Firebase Auth |
| `app/api/admin/upload/route.ts` | Cloudinary signed upload — admin only |

---

## Firestore Setup Steps

### 1. Create Firebase project
- Go to [console.firebase.google.com](https://console.firebase.google.com)
- Create new project → Enable Firestore (production mode)
- Enable Firebase Auth → Email/Password provider

### 2. Create admin user
```bash
# In Firebase Console → Auth → Users → Add user
# Email: admin@spiceandsimmer.com
# Password: (strong password)
```

### 3. Deploy security rules
```bash
npm install -g firebase-tools
firebase login
firebase init firestore
firebase deploy --only firestore:rules
```

### 4. Deploy indexes
```bash
firebase deploy --only firestore:indexes
```

### 5. Fill in .env.local
All Firebase variables from Project Settings → Your Apps → SDK configuration.

---

## Collections Auto-Created on First Write

| Collection | Created when |
|------------|-------------|
| `recipes` | First recipe saved |
| `categories` | First category created |
| `tags` | First tag created |
| `blogs` | First blog post saved |
| `subscribers` | First newsletter signup |
| `comments` | First comment submitted |
| `contacts` | First contact form submission |

---

## Key Functions Reference

```typescript
// Recipes
getRecipeBySlug(slug)           // Single published recipe
getPublishedRecipes({ page, perPage, category, tag, featured })
getFeaturedRecipes(count)
getLatestRecipes(count)
createRecipe(data)              // Admin only
updateRecipe(id, data)          // Admin only
publishRecipe(id)               // Sets status=published + ISR trigger
getUniqueSlug(title)            // Auto slug with collision check

// Categories
getAllCategories()
getCategoryBySlug(slug)
createCategory(data)

// Blogs
getBlogBySlug(slug)
getPublishedBlogs({ page, perPage })
getLatestBlogs(count)

// Subscribers
addSubscriber(email, token)
confirmSubscriber(token)
unsubscribe(email)

// Comments
getApprovedComments(recipeId)
addComment(data)                // Status = pending by default
updateCommentStatus(id, status) // Admin approve/reject

// Auth
signIn(email, password)
signOut()
useAuth()                       // Hook for admin components
```

---

*Phase 2 of 10 complete. Total files: 33*
