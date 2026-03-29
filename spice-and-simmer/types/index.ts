// ============================================================
// Spice & Simmer — Global TypeScript Types
// ============================================================

// ── Shared ─────────────────────────────────────────────────

export type Status = "draft" | "published";
export type Difficulty = "Easy" | "Medium" | "Hard";
export type StepPhase = "prep" | "cooking" | "finishing";
export type CommentStatus = "pending" | "approved" | "rejected";

export interface Author {
  name: string;
  uid: string;
  avatar?: string;
}

export interface SeoFields {
  seoTitle: string;
  metaDescription: string;
  keywords: string[];
}

// ── Recipe ──────────────────────────────────────────────────

export interface Ingredient {
  item: string;
  amount: number;
  unit: string;
}

export interface RecipeStep {
  stepNumber: number;
  phase: StepPhase;
  title: string;
  description: string;
  image?: string;        // Cloudinary URL
  timer?: number;        // seconds
  tip?: string;
}

export interface Nutrition {
  calories: number;
  protein: number;      // grams
  carbs: number;        // grams
  fat: number;          // grams
  fiber: number;        // grams
  sodium: number;       // mg
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface Recipe {
  id: string;
  title: string;
  slug: string;
  category: string;
  subcategory?: string;
  author: Author;
  ingredients: Ingredient[];
  steps: RecipeStep[];
  tips: string[];
  mistakes: string[];
  variations: string[];
  faqs: FAQ[];
  seoTitle: string;
  metaDescription: string;
  keywords: string[];
  tags: string[];
  image: string;
  readingTime: number;      // minutes
  prepTime: number;         // minutes
  cookTime: number;         // minutes
  totalTime: number;        // minutes
  servings: number;
  nutrition: Nutrition;
  difficulty: Difficulty;
  cuisine: string;
  status: Status;
  featured: boolean;
  relatedRecipes: string[]; // recipe IDs
  relatedBlogs: string[];   // blog IDs
  createdAt: string;        // ISO string
  updatedAt: string;
  publishedAt?: string;
  viewCount: number;
  ratingAvg?: number;
  ratingCount?: number;
}

export type RecipeCard = Pick<
  Recipe,
  | "id" | "title" | "slug" | "category" | "image"
  | "totalTime" | "difficulty" | "servings"
  | "ratingAvg" | "ratingCount" | "featured"
>;

// ── Category ────────────────────────────────────────────────

export interface Category {
  id: string;
  name: string;
  slug: string;
  seoIntro: string;         // 300-500 word SEO intro
  image: string;
  createdAt: string;
}

// ── Tag ─────────────────────────────────────────────────────

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

// ── Blog ────────────────────────────────────────────────────

export interface Blog {
  id: string;
  title: string;
  slug: string;
  content: string;          // HTML or Markdown
  excerpt: string;
  author: Author;
  seoTitle: string;
  metaDescription: string;
  tags: string[];
  image: string;
  readingTime: number;
  status: Status;
  relatedRecipes: string[];
  relatedBlogs: string[];
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export type BlogCard = Pick<
  Blog,
  | "id" | "title" | "slug" | "excerpt" | "image"
  | "readingTime" | "publishedAt" | "tags"
>;

// ── Subscriber ──────────────────────────────────────────────

export interface Subscriber {
  id: string;
  email: string;
  confirmed: boolean;
  confirmToken: string;
  createdAt: string;
  confirmedAt?: string;
}

// ── Comment ─────────────────────────────────────────────────

export interface Comment {
  id: string;
  recipeId: string;
  name: string;
  email: string;
  comment: string;
  rating: number;           // 1-5
  status: CommentStatus;
  createdAt: string;
}

// ── Contact ─────────────────────────────────────────────────

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

// ── Admin Dashboard ─────────────────────────────────────────

export interface DashboardStats {
  recipeCount: number;
  publishedRecipeCount: number;
  blogCount: number;
  confirmedSubscribers: number;
  pendingComments: number;
  totalViews: number;
}

// ── API Responses ───────────────────────────────────────────

export interface ApiSuccess<T = unknown> {
  success: true;
  data: T;
}

export interface ApiError {
  success: false;
  error: string;
  details?: unknown;
}

export type ApiResponse<T = unknown> = ApiSuccess<T> | ApiError;

// ── Pagination ──────────────────────────────────────────────

export interface PaginationMeta {
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export interface PaginatedResult<T> {
  items: T[];
  meta: PaginationMeta;
}

// ── Search (Pagefind) ───────────────────────────────────────

export interface PagefindResult {
  url: string;
  content: string;
  meta: {
    title: string;
    image?: string;
    category?: string;
  };
  excerpt: string;
  score: number;
}

// ── Cloudinary ──────────────────────────────────────────────

export interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}

// ── Navigation ──────────────────────────────────────────────

export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}
