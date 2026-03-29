"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import type { Recipe, RecipeStep, Ingredient, FAQ } from "@/types";
import { generateSeoTitle, generateMetaDescription, cloudinaryUrl } from "@/lib/utils/helpers";
import { createRecipe, updateRecipe, publishRecipe, getUniqueSlug } from "@/lib/firebase/recipes";

// ── Sub-editors ───────────────────────────────────────────────

function IngredientsEditor({
  ingredients,
  onChange,
}: {
  ingredients: Ingredient[];
  onChange: (ing: Ingredient[]) => void;
}) {
  const add = () => onChange([...ingredients, { item: "", amount: 0, unit: "" }]);
  const update = (i: number, field: keyof Ingredient, val: string | number) => {
    const updated = [...ingredients];
    (updated[i] as any)[field] = val;
    onChange(updated);
  };
  const remove = (i: number) => onChange(ingredients.filter((_, idx) => idx !== i));

  return (
    <div>
      <div className="space-y-2">
        {ingredients.map((ing, i) => (
          <div key={i} className="flex items-center gap-2">
            <input type="number" value={ing.amount || ""} onChange={(e) => update(i, "amount", Number(e.target.value))}
              placeholder="Amount" className="input w-20 text-sm" min={0} step="0.25" />
            <input type="text" value={ing.unit} onChange={(e) => update(i, "unit", e.target.value)}
              placeholder="Unit" className="input w-24 text-sm" />
            <input type="text" value={ing.item} onChange={(e) => update(i, "item", e.target.value)}
              placeholder="Ingredient" className="input flex-1 text-sm" />
            <button type="button" onClick={() => remove(i)}
              className="btn-danger btn-sm text-xs flex-shrink-0" aria-label={`Remove ${ing.item}`}>×</button>
          </div>
        ))}
      </div>
      <button type="button" onClick={add} className="btn-secondary btn-sm mt-3 text-xs">
        + Add Ingredient
      </button>
    </div>
  );
}

function StepsEditor({
  steps,
  onChange,
}: {
  steps: RecipeStep[];
  onChange: (s: RecipeStep[]) => void;
}) {
  const add = () => onChange([...steps, {
    stepNumber: steps.length + 1,
    phase: "prep", title: "", description: "", timer: 0, tip: "", image: "",
  }]);
  const update = (i: number, field: keyof RecipeStep, val: any) => {
    const updated = [...steps];
    (updated[i] as any)[field] = val;
    // Renumber
    updated.forEach((s, idx) => { s.stepNumber = idx + 1; });
    onChange(updated);
  };
  const remove = (i: number) => {
    const updated = steps.filter((_, idx) => idx !== i);
    updated.forEach((s, idx) => { s.stepNumber = idx + 1; });
    onChange(updated);
  };
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= steps.length) return;
    const updated = [...steps];
    [updated[i], updated[j]] = [updated[j], updated[i]];
    updated.forEach((s, idx) => { s.stepNumber = idx + 1; });
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      {steps.map((step, i) => (
        <div key={i} className="border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-7 h-7 rounded-full bg-brand-500 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
              {step.stepNumber}
            </span>
            <div className="flex gap-1 ml-auto">
              <button type="button" onClick={() => move(i, -1)} disabled={i === 0}
                className="btn-ghost btn-sm text-xs disabled:opacity-30" aria-label="Move up">↑</button>
              <button type="button" onClick={() => move(i, 1)} disabled={i === steps.length - 1}
                className="btn-ghost btn-sm text-xs disabled:opacity-30" aria-label="Move down">↓</button>
              <button type="button" onClick={() => remove(i)}
                className="btn-danger btn-sm text-xs" aria-label="Remove step">×</button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
            <div>
              <label className="label text-xs">Phase</label>
              <select value={step.phase} onChange={(e) => update(i, "phase", e.target.value)}
                className="input text-sm">
                <option value="prep">Prep</option>
                <option value="cooking">Cooking</option>
                <option value="finishing">Finishing</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="label text-xs">Step Title *</label>
              <input type="text" value={step.title} onChange={(e) => update(i, "title", e.target.value)}
                placeholder="e.g. Marinate the chicken" className="input text-sm" required />
            </div>
          </div>

          <div className="mb-3">
            <label className="label text-xs">Description *</label>
            <textarea value={step.description} onChange={(e) => update(i, "description", e.target.value)}
              rows={3} placeholder="Detailed step instructions…" className="textarea text-sm" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="label text-xs">Timer (minutes, 0 = none)</label>
              <input type="number" value={step.timer ? Math.floor(step.timer / 60) : 0}
                onChange={(e) => update(i, "timer", Number(e.target.value) * 60)}
                min={0} className="input text-sm" />
            </div>
            <div>
              <label className="label text-xs">Pro Tip (optional)</label>
              <input type="text" value={step.tip || ""} onChange={(e) => update(i, "tip", e.target.value)}
                placeholder="A quick tip for this step" className="input text-sm" />
            </div>
          </div>
        </div>
      ))}
      <button type="button" onClick={add} className="btn-secondary btn-sm text-xs w-full">
        + Add Step
      </button>
    </div>
  );
}

function ListEditor({ label, items, onChange, placeholder }: {
  label: string; items: string[]; onChange: (v: string[]) => void; placeholder?: string;
}) {
  const add  = () => onChange([...items, ""]);
  const upd  = (i: number, v: string) => { const a = [...items]; a[i] = v; onChange(a); };
  const rem  = (i: number) => onChange(items.filter((_, idx) => idx !== i));
  return (
    <div>
      <label className="label">{label}</label>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex gap-2">
            <input type="text" value={item} onChange={(e) => upd(i, e.target.value)}
              placeholder={placeholder} className="input flex-1 text-sm" />
            <button type="button" onClick={() => rem(i)} className="btn-danger btn-sm text-xs">×</button>
          </div>
        ))}
      </div>
      <button type="button" onClick={add} className="btn-secondary btn-sm mt-2 text-xs">+ Add</button>
    </div>
  );
}

// ── SEO Preview ────────────────────────────────────────────────
function SeoPreview({ title, description, slug }: { title: string; description: string; slug: string }) {
  const url = `${process.env.NEXT_PUBLIC_SITE_URL || "https://spiceandsimmer.com"}/recipes/category/${slug}`;
  return (
    <div className="border border-gray-200 rounded-xl p-4 bg-white">
      <p className="text-xs text-gray-400 uppercase tracking-wide font-bold mb-2">Google Preview</p>
      <p className="text-blue-700 text-sm font-medium truncate">{url}</p>
      <p className="text-purple-800 text-lg font-medium line-clamp-1 mt-0.5">{title || "Recipe title…"}</p>
      <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed mt-0.5">
        {description || "Meta description…"}
      </p>
      <div className="mt-2 flex gap-2">
        <span className={`text-xs font-mono ${title.length > 70 ? "text-red-500" : "text-gray-400"}`}>
          Title: {title.length}/70
        </span>
        <span className={`text-xs font-mono ${description.length > 160 ? "text-red-500" : "text-gray-400"}`}>
          Desc: {description.length}/160
        </span>
      </div>
    </div>
  );
}

// ── Main Editor ────────────────────────────────────────────────
interface RecipeEditorProps {
  recipe?: Recipe;
  isEdit?: boolean;
}

const EMPTY_RECIPE = {
  title: "", slug: "", category: "", subcategory: "",
  ingredients: [{ item: "", amount: 1, unit: "" }],
  steps: [{ stepNumber: 1, phase: "prep" as const, title: "", description: "", timer: 0, tip: "", image: "" }],
  tips: [], mistakes: [], variations: [],
  faqs: [],
  seoTitle: "", metaDescription: "", keywords: [], tags: [],
  image: "",
  prepTime: 15, cookTime: 20, totalTime: 35, servings: 4,
  nutrition: { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sodium: 0 },
  difficulty: "Easy" as const,
  cuisine: "Indian-American",
  status: "draft" as const,
  featured: false,
  relatedRecipes: [], relatedBlogs: [],
};

export default function RecipeEditor({ recipe, isEdit = false }: RecipeEditorProps) {
  const router = useRouter();
  const [form, setForm]     = useState(recipe || EMPTY_RECIPE);
  const [saving, setSaving] = useState(false);
  const [slugEdited, setSlugEdited] = useState(isEdit);
  const [activeTab, setActiveTab] = useState<"basic" | "steps" | "extras" | "seo">("basic");

  // Auto-generate slug from title
  useEffect(() => {
    if (slugEdited || !form.title) return;
    const base = form.title.toLowerCase().replace(/[^a-z0-9\s]/g, "").replace(/\s+/g, "-");
    setForm((f) => ({ ...f, slug: `easy-${base}-recipe` }));
  }, [form.title, slugEdited]);

  // Auto-generate SEO title
  useEffect(() => {
    if (!form.title) return;
    setForm((f) => ({
      ...f,
      seoTitle: generateSeoTitle(form.title),
      metaDescription: generateMetaDescription(form.title, form.prepTime, form.totalTime),
    }));
  }, [form.title, form.prepTime, form.totalTime]);

  // Auto total time
  useEffect(() => {
    setForm((f) => ({ ...f, totalTime: f.prepTime + f.cookTime }));
  }, [form.prepTime, form.cookTime]);

  const set = (key: string, val: any) => setForm((f) => ({ ...f, [key]: val }));

  const handleSave = async (publish = false) => {
    setSaving(true);
    try {
      const data = {
        ...form,
        author: { name: "Admin", uid: "admin" },
        status: publish ? "published" as const : "draft" as const,
        publishedAt: publish ? new Date().toISOString() : undefined,
        readingTime: Math.ceil(form.steps.length * 0.5 + form.ingredients.length * 0.1),
        viewCount: recipe?.viewCount ?? 0,
      };

      if (isEdit && recipe?.id) {
        await updateRecipe(recipe.id, data);
        if (publish) await publishRecipe(recipe.id);
        // Trigger ISR
        await fetch("/api/revalidate", {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-revalidate-secret": "" },
          body: JSON.stringify({
            secret: process.env.NEXT_PUBLIC_REVALIDATE_SECRET,
            type: "recipe",
            slug: form.slug,
            category: form.category.toLowerCase().replace(/\s+/g, "-"),
          }),
        });
        toast.success(publish ? "Published!" : "Draft saved!");
      } else {
        const id = await createRecipe(data as any);
        toast.success(publish ? "Published!" : "Draft saved!");
        router.push(`/admin/recipes/${id}/edit`);
      }
    } catch (err: any) {
      toast.error(err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const TABS = ["basic", "steps", "extras", "seo"] as const;

  return (
    <div className="p-6 sm:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">
            {isEdit ? "Edit Recipe" : "New Recipe"}
          </h1>
          {isEdit && (
            <p className="text-xs text-gray-400 mt-1 font-mono">ID: {recipe?.id}</p>
          )}
        </div>
        <div className="flex gap-2">
          <button onClick={() => handleSave(false)} disabled={saving} className="btn-secondary">
            {saving ? "Saving…" : "Save Draft"}
          </button>
          <button onClick={() => handleSave(true)} disabled={saving} className="btn-primary">
            {saving ? "Publishing…" : "Publish"}
          </button>
        </div>
      </div>

      {/* Slug immutability warning */}
      {isEdit && recipe?.status === "published" && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 text-sm text-yellow-800">
          ⚠️ <strong>Slug is locked:</strong> This recipe is published. Changing the slug will break existing links and SEO.
          The slug is <code className="bg-yellow-100 px-1 rounded">{recipe.slug}</code>.
        </div>
      )}

      {/* Tab nav */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6 overflow-x-auto">
        {TABS.map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-semibold capitalize transition-all whitespace-nowrap ${
              activeTab === tab ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"
            }`}>
            {tab === "basic" ? "📋 Basic Info" : tab === "steps" ? "👨‍🍳 Steps" : tab === "extras" ? "💡 Extras" : "🔍 SEO"}
          </button>
        ))}
      </div>

      {/* ── Tab: Basic Info ── */}
      {activeTab === "basic" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="sm:col-span-2">
              <label className="label">Recipe Title *</label>
              <input type="text" value={form.title} onChange={(e) => set("title", e.target.value)}
                className="input" placeholder="e.g. Butter Chicken Tacos" required />
            </div>
            <div>
              <label className="label">Slug *</label>
              <input type="text" value={form.slug}
                onChange={(e) => { setSlugEdited(true); set("slug", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-")); }}
                className="input font-mono text-sm"
                readOnly={isEdit && recipe?.status === "published"}
              />
            </div>
            <div>
              <label className="label">Category *</label>
              <select value={form.category} onChange={(e) => set("category", e.target.value)} className="input">
                <option value="">Select category</option>
                {["Fusion Mains", "Quick Dinners", "Indian Breakfasts", "Vegetarian", "Street Food", "Desserts"].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Difficulty</label>
              <select value={form.difficulty} onChange={(e) => set("difficulty", e.target.value)} className="input">
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
            <div>
              <label className="label">Cuisine</label>
              <input type="text" value={form.cuisine} onChange={(e) => set("cuisine", e.target.value)} className="input" />
            </div>
            <div>
              <label className="label">Prep Time (min)</label>
              <input type="number" value={form.prepTime} onChange={(e) => set("prepTime", Number(e.target.value))} min={1} className="input" />
            </div>
            <div>
              <label className="label">Cook Time (min)</label>
              <input type="number" value={form.cookTime} onChange={(e) => set("cookTime", Number(e.target.value))} min={0} className="input" />
            </div>
            <div>
              <label className="label">Total Time (min) — auto</label>
              <input type="number" value={form.totalTime} readOnly className="input bg-gray-50" />
            </div>
            <div>
              <label className="label">Servings</label>
              <input type="number" value={form.servings} onChange={(e) => set("servings", Number(e.target.value))} min={1} className="input" />
            </div>
          </div>

          {/* Hero image URL */}
          <div>
            <label className="label">Hero Image URL (Cloudinary) *</label>
            <input type="url" value={form.image} onChange={(e) => set("image", e.target.value)}
              className="input" placeholder="https://res.cloudinary.com/…" />
            {form.image && (
              <img src={form.image} alt="Preview" className="mt-2 w-full max-w-xs h-32 object-cover rounded-xl" />
            )}
          </div>

          {/* Featured toggle */}
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={form.featured} onChange={(e) => set("featured", e.target.checked)}
              className="w-5 h-5 rounded text-brand-500" />
            <span className="font-semibold text-gray-700">Feature this recipe on the homepage</span>
          </label>

          {/* Nutrition */}
          <div>
            <label className="label">Nutrition (per serving)</label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {(["calories", "protein", "carbs", "fat", "fiber", "sodium"] as const).map((key) => (
                <div key={key}>
                  <label className="text-xs text-gray-400 block mb-1 capitalize">{key}</label>
                  <input type="number" value={form.nutrition[key]}
                    onChange={(e) => set("nutrition", { ...form.nutrition, [key]: Number(e.target.value) })}
                    min={0} className="input text-sm" />
                </div>
              ))}
            </div>
          </div>

          {/* Ingredients */}
          <div>
            <label className="label">Ingredients *</label>
            <IngredientsEditor ingredients={form.ingredients} onChange={(v) => set("ingredients", v)} />
          </div>
        </div>
      )}

      {/* ── Tab: Steps ── */}
      {activeTab === "steps" && (
        <div>
          <p className="text-sm text-gray-500 mb-4">
            Add steps in order. Group them by phase: Prep → Cooking → Finishing.
          </p>
          <StepsEditor steps={form.steps} onChange={(v) => set("steps", v)} />
        </div>
      )}

      {/* ── Tab: Extras ── */}
      {activeTab === "extras" && (
        <div className="space-y-8">
          <ListEditor label="Pro Tips" items={form.tips} onChange={(v) => set("tips", v)} placeholder="A useful tip…" />
          <ListEditor label="Common Mistakes" items={form.mistakes} onChange={(v) => set("mistakes", v)} placeholder="Mistake to avoid…" />
          <ListEditor label="Variations & Substitutions" items={form.variations} onChange={(v) => set("variations", v)} placeholder="A variation or substitution…" />

          {/* FAQs */}
          <div>
            <label className="label">FAQs</label>
            <div className="space-y-3">
              {form.faqs.map((faq, i) => (
                <div key={i} className="border border-gray-200 rounded-xl p-4 space-y-2">
                  <input type="text" value={faq.question} placeholder="Question"
                    onChange={(e) => {
                      const updated = [...form.faqs];
                      updated[i] = { ...updated[i], question: e.target.value };
                      set("faqs", updated);
                    }} className="input text-sm" />
                  <textarea value={faq.answer} placeholder="Answer" rows={2}
                    onChange={(e) => {
                      const updated = [...form.faqs];
                      updated[i] = { ...updated[i], answer: e.target.value };
                      set("faqs", updated);
                    }} className="textarea text-sm" />
                  <button type="button" onClick={() => set("faqs", form.faqs.filter((_, idx) => idx !== i))}
                    className="btn-danger btn-sm text-xs">Remove</button>
                </div>
              ))}
              <button type="button" onClick={() => set("faqs", [...form.faqs, { question: "", answer: "" }])}
                className="btn-secondary btn-sm text-xs">+ Add FAQ</button>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="label">Tags (comma-separated)</label>
            <input type="text" value={form.tags.join(", ")}
              onChange={(e) => set("tags", e.target.value.split(",").map((t) => t.trim()).filter(Boolean))}
              className="input" placeholder="quick, spicy, vegetarian, 30-minutes" />
          </div>
        </div>
      )}

      {/* ── Tab: SEO ── */}
      {activeTab === "seo" && (
        <div className="space-y-6">
          <SeoPreview title={form.seoTitle} description={form.metaDescription} slug={form.slug} />

          <div>
            <label className="label">SEO Title (max 70 chars)</label>
            <input type="text" value={form.seoTitle} onChange={(e) => set("seoTitle", e.target.value)}
              maxLength={70} className="input" placeholder="Best Butter Chicken Tacos Recipe (Easy & Quick)" />
          </div>
          <div>
            <label className="label">Meta Description (max 160 chars)</label>
            <textarea value={form.metaDescription} onChange={(e) => set("metaDescription", e.target.value)}
              maxLength={160} rows={3} className="textarea"
              placeholder="Learn how to make the best butter chicken tacos at home…" />
          </div>
          <div>
            <label className="label">Keywords (comma-separated)</label>
            <input type="text" value={form.keywords.join(", ")}
              onChange={(e) => set("keywords", e.target.value.split(",").map((k) => k.trim()).filter(Boolean))}
              className="input" placeholder="butter chicken tacos, easy butter chicken, Indian fusion tacos" />
          </div>
        </div>
      )}

      {/* Bottom save bar */}
      <div className="flex gap-3 mt-8 pt-6 border-t border-gray-100">
        <button onClick={() => handleSave(false)} disabled={saving} className="btn-secondary flex-1 sm:flex-none">
          Save Draft
        </button>
        <button onClick={() => handleSave(true)} disabled={saving} className="btn-primary flex-1 sm:flex-none">
          {saving ? "Publishing…" : "Publish Recipe"}
        </button>
      </div>
    </div>
  );
}
