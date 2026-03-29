// ============================================================
// Categories, Tags, Blogs, Subscribers, Contacts DB Helpers
// ============================================================
import {
  doc,
  getDoc,
  getDocs,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  writeBatch,
} from "firebase/firestore";

import { db } from "./client";
import {
  categoriesCol, categoryDoc,
  tagsCol, tagDoc,
  blogsCol, blogDoc,
  subscribersCol, subscriberDoc,
  contactsCol,
  COLLECTIONS,
} from "./collections";
import type {
  Category, Tag, Blog, BlogCard, Subscriber, ContactMessage, PaginatedResult,
} from "@/types";
import { generateId, toSlug } from "@/lib/utils/helpers";

// ============================================================
// CATEGORIES
// ============================================================

export async function getAllCategories(): Promise<Category[]> {
  const snap = await getDocs(query(categoriesCol, orderBy("name")));
  return snap.docs.map((d) => d.data());
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const q = query(categoriesCol, where("slug", "==", slug), limit(1));
  const snap = await getDocs(q);
  return snap.empty ? null : snap.docs[0].data();
}

export async function getCategoryById(id: string): Promise<Category | null> {
  const snap = await getDoc(categoryDoc(id));
  return snap.exists() ? snap.data() : null;
}

export async function createCategory(
  data: Omit<Category, "id" | "createdAt">
): Promise<string> {
  const id = generateId();
  await setDoc(doc(db, COLLECTIONS.CATEGORIES, id), {
    ...data,
    id,
    slug: data.slug || toSlug(data.name),
    createdAt: new Date().toISOString(),
  });
  return id;
}

export async function updateCategory(
  id: string,
  data: Partial<Omit<Category, "id">>
): Promise<void> {
  await updateDoc(doc(db, COLLECTIONS.CATEGORIES, id), data);
}

export async function deleteCategory(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTIONS.CATEGORIES, id));
}

// ============================================================
// TAGS
// ============================================================

export async function getAllTags(): Promise<Tag[]> {
  const snap = await getDocs(query(tagsCol, orderBy("name")));
  return snap.docs.map((d) => d.data());
}

export async function getTagBySlug(slug: string): Promise<Tag | null> {
  const q = query(tagsCol, where("slug", "==", slug), limit(1));
  const snap = await getDocs(q);
  return snap.empty ? null : snap.docs[0].data();
}

export async function createTag(name: string): Promise<string> {
  const id = generateId();
  await setDoc(doc(db, COLLECTIONS.TAGS, id), {
    id,
    name,
    slug: toSlug(name),
  });
  return id;
}

export async function deleteTag(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTIONS.TAGS, id));
}

// ============================================================
// BLOGS
// ============================================================

export async function getBlogBySlug(slug: string): Promise<Blog | null> {
  const q = query(
    blogsCol,
    where("slug", "==", slug),
    where("status", "==", "published"),
    limit(1)
  );
  const snap = await getDocs(q);
  return snap.empty ? null : snap.docs[0].data();
}

export async function getBlogById(id: string): Promise<Blog | null> {
  const snap = await getDoc(blogDoc(id));
  return snap.exists() ? snap.data() : null;
}

export async function getPublishedBlogs(opts: {
  page?: number;
  perPage?: number;
} = {}): Promise<PaginatedResult<BlogCard>> {
  const { page = 1, perPage = 9 } = opts;

  const q = query(
    blogsCol,
    where("status", "==", "published"),
    orderBy("publishedAt", "desc"),
    limit(perPage)
  );
  const snap = await getDocs(q);
  const countSnap = await getDocs(
    query(blogsCol, where("status", "==", "published"))
  );

  const items: BlogCard[] = snap.docs.map((d) => {
    const b = d.data();
    return {
      id: b.id, title: b.title, slug: b.slug,
      excerpt: b.excerpt, image: b.image,
      readingTime: b.readingTime,
      publishedAt: b.publishedAt,
      tags: b.tags,
    };
  });

  return {
    items,
    meta: {
      total: countSnap.size,
      page,
      perPage,
      totalPages: Math.ceil(countSnap.size / perPage),
    },
  };
}

export async function getLatestBlogs(count = 3): Promise<BlogCard[]> {
  const q = query(
    blogsCol,
    where("status", "==", "published"),
    orderBy("publishedAt", "desc"),
    limit(count)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const b = d.data();
    return {
      id: b.id, title: b.title, slug: b.slug,
      excerpt: b.excerpt, image: b.image,
      readingTime: b.readingTime, publishedAt: b.publishedAt, tags: b.tags,
    };
  });
}

export async function createBlog(
  data: Omit<Blog, "id" | "createdAt" | "updatedAt">
): Promise<string> {
  const id = generateId();
  const now = new Date().toISOString();
  await setDoc(doc(db, COLLECTIONS.BLOGS, id), {
    ...data, id, createdAt: now, updatedAt: now,
  });
  return id;
}

export async function updateBlog(
  id: string,
  data: Partial<Omit<Blog, "id" | "createdAt">>
): Promise<void> {
  await updateDoc(doc(db, COLLECTIONS.BLOGS, id), {
    ...data,
    updatedAt: new Date().toISOString(),
  });
}

export async function deleteBlog(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTIONS.BLOGS, id));
}

export async function getAllBlogsAdmin(): Promise<Blog[]> {
  const snap = await getDocs(query(blogsCol, orderBy("createdAt", "desc")));
  return snap.docs.map((d) => d.data());
}

export async function getAllBlogsForSitemap(): Promise<
  Pick<Blog, "slug" | "updatedAt">[]
> {
  const q = query(blogsCol, where("status", "==", "published"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const b = d.data();
    return { slug: b.slug, updatedAt: b.updatedAt };
  });
}

// ============================================================
// SUBSCRIBERS
// ============================================================

export async function addSubscriber(
  email: string,
  confirmToken: string
): Promise<string> {
  // Check if already subscribed
  const existing = await getDocs(
    query(subscribersCol, where("email", "==", email), limit(1))
  );
  if (!existing.empty) {
    const sub = existing.docs[0].data();
    if (sub.confirmed) throw new Error("ALREADY_CONFIRMED");
    // Resend confirmation — update token
    await updateDoc(doc(db, COLLECTIONS.SUBSCRIBERS, sub.id), { confirmToken });
    return sub.id;
  }

  const id = generateId();
  await setDoc(doc(db, COLLECTIONS.SUBSCRIBERS, id), {
    id,
    email,
    confirmed: false,
    confirmToken,
    createdAt: new Date().toISOString(),
  });
  return id;
}

export async function confirmSubscriber(token: string): Promise<Subscriber | null> {
  const q = query(subscribersCol, where("confirmToken", "==", token), limit(1));
  const snap = await getDocs(q);
  if (snap.empty) return null;

  const sub = snap.docs[0].data();
  await updateDoc(doc(db, COLLECTIONS.SUBSCRIBERS, sub.id), {
    confirmed: true,
    confirmedAt: new Date().toISOString(),
    confirmToken: "",   // Clear token after use
  });

  return { ...sub, confirmed: true };
}

export async function getSubscriber(email: string): Promise<Subscriber | null> {
  const q = query(subscribersCol, where("email", "==", email), limit(1));
  const snap = await getDocs(q);
  return snap.empty ? null : snap.docs[0].data();
}

export async function getAllSubscribers(): Promise<Subscriber[]> {
  const snap = await getDocs(query(subscribersCol, orderBy("createdAt", "desc")));
  return snap.docs.map((d) => d.data());
}

export async function unsubscribe(email: string): Promise<void> {
  const q = query(subscribersCol, where("email", "==", email), limit(1));
  const snap = await getDocs(q);
  if (!snap.empty) {
    await deleteDoc(doc(db, COLLECTIONS.SUBSCRIBERS, snap.docs[0].id));
  }
}

export async function getSubscriberCount(): Promise<{ total: number; confirmed: number }> {
  const allSnap = await getDocs(subscribersCol);
  const confirmedSnap = await getDocs(
    query(subscribersCol, where("confirmed", "==", true))
  );
  return { total: allSnap.size, confirmed: confirmedSnap.size };
}

// ============================================================
// CONTACTS
// ============================================================

export async function saveContactMessage(
  data: Omit<ContactMessage, "id" | "createdAt">
): Promise<string> {
  const id = generateId();
  await setDoc(doc(db, COLLECTIONS.CONTACTS, id), {
    ...data,
    id,
    createdAt: new Date().toISOString(),
  });
  return id;
}

// ============================================================
// COMMENTS (Admin)
// ============================================================

export async function getAllCommentsAdmin(opts: {
  status?: "pending" | "approved" | "rejected";
} = {}): Promise<import("@/types").Comment[]> {
  const { default: commentsColImport } = await import("./collections");
  const q = opts.status
    ? query(commentsCol, where("status", "==", opts.status), orderBy("createdAt", "desc"))
    : query(commentsCol, orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as import("@/types").Comment);
}

export async function updateCommentStatus(
  id: string,
  status: "approved" | "rejected"
): Promise<void> {
  await updateDoc(doc(db, COLLECTIONS.COMMENTS, id), { status });
}

export async function deleteComment(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTIONS.COMMENTS, id));
}

// ============================================================
// DASHBOARD STATS
// ============================================================

export async function getDashboardStats(): Promise<import("@/types").DashboardStats> {
  const [
    recipesSnap, publishedRecipesSnap,
    blogsSnap, confirmedSubSnap,
    pendingCommentsSnap,
  ] = await Promise.all([
    getDocs(query(doc(db, COLLECTIONS.RECIPES, "_").parent)),
    getDocs(query(
      doc(db, COLLECTIONS.RECIPES, "_").parent,
      where("status", "==", "published")
    )),
    getDocs(query(doc(db, COLLECTIONS.BLOGS, "_").parent)),
    getDocs(query(
      doc(db, COLLECTIONS.SUBSCRIBERS, "_").parent,
      where("confirmed", "==", true)
    )),
    getDocs(query(
      doc(db, COLLECTIONS.COMMENTS, "_").parent,
      where("status", "==", "pending")
    )),
  ]);

  return {
    recipeCount:           recipesSnap.size,
    publishedRecipeCount:  publishedRecipesSnap.size,
    blogCount:             blogsSnap.size,
    confirmedSubscribers:  confirmedSubSnap.size,
    pendingComments:       pendingCommentsSnap.size,
    totalViews:            0, // Aggregated separately
  };
}
