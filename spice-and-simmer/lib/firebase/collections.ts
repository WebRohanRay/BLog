// ============================================================
// Firestore Collection Names & Typed Converters
// ============================================================
import {
  collection,
  doc,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
  WithFieldValue,
  DocumentData,
} from "firebase/firestore";
import { db } from "./client";

// ── Collection name constants ──────────────────────────────────
export const COLLECTIONS = {
  RECIPES:     "recipes",
  CATEGORIES:  "categories",
  TAGS:        "tags",
  BLOGS:       "blogs",
  SUBSCRIBERS: "subscribers",
  COMMENTS:    "comments",
  CONTACTS:    "contacts",
} as const;

// ── Generic typed converter ────────────────────────────────────
// Ensures Firestore always stores/retrieves with correct types
export function createConverter<T extends { id: string }>(): FirestoreDataConverter<T> {
  return {
    toFirestore(data: WithFieldValue<T>): DocumentData {
      const { id, ...rest } = data as T;
      return rest;
    },
    fromFirestore(snap: QueryDocumentSnapshot, opts?: SnapshotOptions): T {
      const data = snap.data(opts);
      return { id: snap.id, ...data } as T;
    },
  };
}

// ── Typed collection references ────────────────────────────────
import type {
  Recipe,
  Category,
  Tag,
  Blog,
  Subscriber,
  Comment,
  ContactMessage,
} from "@/types";

export const recipesCol     = collection(db, COLLECTIONS.RECIPES).withConverter(createConverter<Recipe>());
export const categoriesCol  = collection(db, COLLECTIONS.CATEGORIES).withConverter(createConverter<Category>());
export const tagsCol        = collection(db, COLLECTIONS.TAGS).withConverter(createConverter<Tag>());
export const blogsCol       = collection(db, COLLECTIONS.BLOGS).withConverter(createConverter<Blog>());
export const subscribersCol = collection(db, COLLECTIONS.SUBSCRIBERS).withConverter(createConverter<Subscriber>());
export const commentsCol    = collection(db, COLLECTIONS.COMMENTS).withConverter(createConverter<Comment>());
export const contactsCol    = collection(db, COLLECTIONS.CONTACTS).withConverter(createConverter<ContactMessage>());

// ── Helper: get typed doc reference ───────────────────────────
export const recipeDoc    = (id: string) => doc(db, COLLECTIONS.RECIPES, id).withConverter(createConverter<Recipe>());
export const categoryDoc  = (id: string) => doc(db, COLLECTIONS.CATEGORIES, id).withConverter(createConverter<Category>());
export const tagDoc       = (id: string) => doc(db, COLLECTIONS.TAGS, id).withConverter(createConverter<Tag>());
export const blogDoc      = (id: string) => doc(db, COLLECTIONS.BLOGS, id).withConverter(createConverter<Blog>());
export const subscriberDoc = (id: string) => doc(db, COLLECTIONS.SUBSCRIBERS, id).withConverter(createConverter<Subscriber>());
export const commentDoc   = (id: string) => doc(db, COLLECTIONS.COMMENTS, id).withConverter(createConverter<Comment>());
