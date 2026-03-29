// ============================================================
// Recipe DB Helpers — server-side (uses Admin SDK)
// ============================================================
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  Timestamp,
  increment,
  runTransaction,
  writeBatch,
  type QueryDocumentSnapshot,
} from "firebase/firestore";

import { db } from "./client";
import {
  recipesCol,
  recipeDoc,
  commentsCol,
  COLLECTIONS,
} from "./collections";
import type { Recipe, RecipeCard, Comment, PaginatedResult } from "@/types";
import { generateSlug, generateId } from "@/lib/utils/helpers";

// ── Read ───────────────────────────────────────────────────────

/** Get a single published recipe by slug */
export async function getRecipeBySlug(slug: string): Promise<Recipe | null> {
  const q = query(
    recipesCol,
    where("slug", "==", slug),
    where("status", "==", "published"),
    limit(1)
  );
  const snap = await getDocs(q);
  if (snap.empty) return null;
  return snap.docs[0].data();
}

/** Get a recipe by ID (any status — for admin) */
export async function getRecipeById(id: string): Promise<Recipe | null> {
  const snap = await getDoc(recipeDoc(id));
  return snap.exists() ? snap.data() : null;
}

/** Get all published recipes (paginated) */
export async function getPublishedRecipes(opts: {
  page?: number;
  perPage?: number;
  category?: string;
  tag?: string;
  featured?: boolean;
  lastDoc?: QueryDocumentSnapshot;
} = {}): Promise<PaginatedResult<RecipeCard>> {
  const { perPage = 12, category, tag, featured, lastDoc } = opts;

  let q = query(
    recipesCol,
    where("status", "==", "published"),
    orderBy("publishedAt", "desc")
  );

  if (category) q = query(q, where("category", "==", category));
  if (tag)      q = query(q, where("tags", "array-contains", tag));
  if (featured !== undefined) q = query(q, where("featured", "==", featured));
  if (lastDoc)  q = query(q, startAfter(lastDoc));

  q = query(q, limit(perPage));

  const snap = await getDocs(q);
  const items = snap.docs.map((d) => {
    const r = d.data();
    return {
      id: r.id,
      title: r.title,
      slug: r.slug,
      category: r.category,
      image: r.image,
      totalTime: r.totalTime,
      difficulty: r.difficulty,
      servings: r.servings,
      ratingAvg: r.ratingAvg,
      ratingCount: r.ratingCount,
      featured: r.featured,
    } as RecipeCard;
  });

  // Get total count for pagination
  const countSnap = await getDocs(
    query(recipesCol, where("status", "==", "published"))
  );

  return {
    items,
    meta: {
      total: countSnap.size,
      page: opts.page ?? 1,
      perPage,
      totalPages: Math.ceil(countSnap.size / perPage),
    },
  };
}

/** Get featured recipes for homepage */
export async function getFeaturedRecipes(count = 6): Promise<RecipeCard[]> {
  const q = query(
    recipesCol,
    where("status", "==", "published"),
    where("featured", "==", true),
    orderBy("publishedAt", "desc"),
    limit(count)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const r = d.data();
    return {
      id: r.id, title: r.title, slug: r.slug, category: r.category,
      image: r.image, totalTime: r.totalTime, difficulty: r.difficulty,
      servings: r.servings, ratingAvg: r.ratingAvg, ratingCount: r.ratingCount,
      featured: r.featured,
    } as RecipeCard;
  });
}

/** Get latest recipes */
export async function getLatestRecipes(count = 6): Promise<RecipeCard[]> {
  const q = query(
    recipesCol,
    where("status", "==", "published"),
    orderBy("publishedAt", "desc"),
    limit(count)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const r = d.data();
    return {
      id: r.id, title: r.title, slug: r.slug, category: r.category,
      image: r.image, totalTime: r.totalTime, difficulty: r.difficulty,
      servings: r.servings, ratingAvg: r.ratingAvg, ratingCount: r.ratingCount,
      featured: r.featured,
    } as RecipeCard;
  });
}

/** Get related recipes by IDs */
export async function getRelatedRecipes(ids: string[]): Promise<RecipeCard[]> {
  if (!ids.length) return [];
  const snaps = await Promise.all(ids.slice(0, 3).map((id) => getDoc(recipeDoc(id))));
  return snaps
    .filter((s) => s.exists())
    .map((s) => {
      const r = s.data()!;
      return {
        id: r.id, title: r.title, slug: r.slug, category: r.category,
        image: r.image, totalTime: r.totalTime, difficulty: r.difficulty,
        servings: r.servings, ratingAvg: r.ratingAvg, ratingCount: r.ratingCount,
        featured: r.featured,
      } as RecipeCard;
    });
}

/** Get all recipes for sitemap */
export async function getAllPublishedRecipesForSitemap(): Promise<
  Pick<Recipe, "slug" | "category" | "updatedAt">[]
> {
  const q = query(
    recipesCol,
    where("status", "==", "published"),
    orderBy("updatedAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const r = d.data();
    return { slug: r.slug, category: r.category, updatedAt: r.updatedAt };
  });
}

// ── Write ──────────────────────────────────────────────────────

/** Create a new recipe (admin only) */
export async function createRecipe(
  data: Omit<Recipe, "id" | "createdAt" | "updatedAt" | "viewCount" | "ratingAvg" | "ratingCount">
): Promise<string> {
  const now = new Date().toISOString();
  const id = generateId();
  const docRef = doc(db, COLLECTIONS.RECIPES, id);

  await writeBatch(db).set(docRef, {
    ...data,
    id,
    createdAt: now,
    updatedAt: now,
    viewCount: 0,
    ratingAvg: 0,
    ratingCount: 0,
  }).commit();

  return id;
}

/** Update an existing recipe */
export async function updateRecipe(
  id: string,
  data: Partial<Omit<Recipe, "id" | "createdAt">>
): Promise<void> {
  const docRef = doc(db, COLLECTIONS.RECIPES, id);
  await updateDoc(docRef, {
    ...data,
    updatedAt: new Date().toISOString(),
  });
}

/** Publish a recipe — sets status + publishedAt */
export async function publishRecipe(id: string): Promise<void> {
  const docRef = doc(db, COLLECTIONS.RECIPES, id);
  const now = new Date().toISOString();
  await updateDoc(docRef, {
    status: "published",
    publishedAt: now,
    updatedAt: now,
  });
}

/** Unpublish (revert to draft) */
export async function unpublishRecipe(id: string): Promise<void> {
  const docRef = doc(db, COLLECTIONS.RECIPES, id);
  await updateDoc(docRef, {
    status: "draft",
    updatedAt: new Date().toISOString(),
  });
}

/** Delete recipe */
export async function deleteRecipe(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTIONS.RECIPES, id));
}

/** Check slug uniqueness */
export async function isSlugUnique(slug: string, excludeId?: string): Promise<boolean> {
  const q = query(recipesCol, where("slug", "==", slug), limit(1));
  const snap = await getDocs(q);
  if (snap.empty) return true;
  if (excludeId && snap.docs[0].id === excludeId) return true;
  return false;
}

/** Get unique slug (adds counter if collision) */
export async function getUniqueSlug(title: string, excludeId?: string): Promise<string> {
  const base = generateSlug(title);
  if (await isSlugUnique(base, excludeId)) return base;
  let counter = 2;
  while (!(await isSlugUnique(`${base}-${counter}`, excludeId))) counter++;
  return `${base}-${counter}`;
}

/** Increment view count */
export async function incrementViewCount(id: string): Promise<void> {
  const docRef = doc(db, COLLECTIONS.RECIPES, id);
  await updateDoc(docRef, { viewCount: increment(1) });
}

// ── Comments ───────────────────────────────────────────────────

/** Get approved comments for a recipe */
export async function getApprovedComments(recipeId: string): Promise<Comment[]> {
  const q = query(
    commentsCol,
    where("recipeId", "==", recipeId),
    where("status", "==", "approved"),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data());
}

/** Add a comment (pending by default) */
export async function addComment(
  data: Omit<Comment, "id" | "createdAt" | "status">
): Promise<string> {
  const id = generateId();
  const docRef = doc(db, COLLECTIONS.COMMENTS, id);
  const batch = writeBatch(db);
  batch.set(docRef, {
    ...data,
    id,
    status: "pending",
    createdAt: new Date().toISOString(),
  });
  await batch.commit();
  return id;
}

/** Update comment rating aggregate on recipe */
export async function updateRecipeRating(recipeId: string): Promise<void> {
  const q = query(
    commentsCol,
    where("recipeId", "==", recipeId),
    where("status", "==", "approved")
  );
  const snap = await getDocs(q);
  const ratings = snap.docs.map((d) => d.data().rating).filter(Boolean);
  if (!ratings.length) return;

  const avg = ratings.reduce((a, b) => a + b, 0) / ratings.length;
  await updateDoc(doc(db, COLLECTIONS.RECIPES, recipeId), {
    ratingAvg: Math.round(avg * 10) / 10,
    ratingCount: ratings.length,
  });
}

// ── Admin: all recipes ─────────────────────────────────────────

export async function getAllRecipesAdmin(): Promise<Recipe[]> {
  const q = query(recipesCol, orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data());
}
