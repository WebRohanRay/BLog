import { z } from "zod";

// ── Contact ────────────────────────────────────────────────────
export const contactSchema = z.object({
  name:         z.string().min(2, "Name must be at least 2 characters").max(100),
  email:        z.string().email("Invalid email address"),
  message:      z.string().min(10, "Message must be at least 10 characters").max(2000),
  captchaToken: z.string().min(1, "Captcha required"),
});

// ── Newsletter ─────────────────────────────────────────────────
export const subscriberSchema = z.object({
  email:        z.string().email("Invalid email address"),
  captchaToken: z.string().min(1, "Captcha required"),
});

// ── Comment ────────────────────────────────────────────────────
export const commentSchema = z.object({
  recipeId:     z.string().min(1),
  name:         z.string().min(2, "Name too short").max(100),
  email:        z.string().email("Invalid email"),
  comment:      z.string().min(5, "Comment too short").max(1000),
  rating:       z.number().int().min(1).max(5),
  captchaToken: z.string().min(1, "Captcha required"),
});

// ── Recipe (admin) ─────────────────────────────────────────────
export const ingredientSchema = z.object({
  item:   z.string().min(1),
  amount: z.number().positive(),
  unit:   z.string(),
});

export const recipeStepSchema = z.object({
  stepNumber:  z.number().int().positive(),
  phase:       z.enum(["prep", "cooking", "finishing"]),
  title:       z.string().min(1).max(200),
  description: z.string().min(1).max(2000),
  image:       z.string().url().optional().or(z.literal("")),
  timer:       z.number().int().nonnegative().optional(),
  tip:         z.string().max(500).optional().or(z.literal("")),
});

export const faqSchema = z.object({
  question: z.string().min(5).max(300),
  answer:   z.string().min(5).max(1000),
});

export const nutritionSchema = z.object({
  calories: z.number().nonnegative(),
  protein:  z.number().nonnegative(),
  carbs:    z.number().nonnegative(),
  fat:      z.number().nonnegative(),
  fiber:    z.number().nonnegative(),
  sodium:   z.number().nonnegative(),
});

export const recipeSchema = z.object({
  title:          z.string().min(3, "Title required").max(200),
  slug:           z.string().min(3).max(200).regex(/^[a-z0-9-]+$/, "Slug must be lowercase with hyphens only"),
  category:       z.string().min(1, "Category required"),
  subcategory:    z.string().optional(),
  ingredients:    z.array(ingredientSchema).min(1, "At least 1 ingredient required"),
  steps:          z.array(recipeStepSchema).min(1, "At least 1 step required"),
  tips:           z.array(z.string().max(500)).default([]),
  mistakes:       z.array(z.string().max(500)).default([]),
  variations:     z.array(z.string().max(500)).default([]),
  faqs:           z.array(faqSchema).default([]),
  seoTitle:       z.string().min(10).max(70),
  metaDescription: z.string().min(50).max(160),
  keywords:       z.array(z.string()).min(1),
  tags:           z.array(z.string()).default([]),
  image:          z.string().url("Image URL required"),
  prepTime:       z.number().int().positive(),
  cookTime:       z.number().int().nonnegative(),
  totalTime:      z.number().int().positive(),
  servings:       z.number().int().positive(),
  nutrition:      nutritionSchema,
  difficulty:     z.enum(["Easy", "Medium", "Hard"]),
  cuisine:        z.string().min(1),
  status:         z.enum(["draft", "published"]).default("draft"),
  featured:       z.boolean().default(false),
  relatedRecipes: z.array(z.string()).default([]),
  relatedBlogs:   z.array(z.string()).default([]),
});

export type RecipeFormData = z.infer<typeof recipeSchema>;

// ── Blog (admin) ───────────────────────────────────────────────
export const blogSchema = z.object({
  title:          z.string().min(5).max(200),
  slug:           z.string().min(3).max(200).regex(/^[a-z0-9-]+$/),
  content:        z.string().min(100, "Content too short"),
  excerpt:        z.string().min(20).max(300),
  seoTitle:       z.string().min(10).max(70),
  metaDescription: z.string().min(50).max(160),
  tags:           z.array(z.string()).default([]),
  image:          z.string().url("Image required"),
  status:         z.enum(["draft", "published"]).default("draft"),
  relatedRecipes: z.array(z.string()).default([]),
  relatedBlogs:   z.array(z.string()).default([]),
});

export type BlogFormData = z.infer<typeof blogSchema>;

// ── Category (admin) ───────────────────────────────────────────
export const categorySchema = z.object({
  name:     z.string().min(2).max(100),
  slug:     z.string().min(2).max(100).regex(/^[a-z0-9-]+$/),
  seoIntro: z.string().min(100).max(1000),
  image:    z.string().url("Image required"),
});
