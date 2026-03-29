"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { getAllCategories, createCategory, deleteCategory } from "@/lib/firebase/queries";
import type { Category } from "@/types";
import { toSlug } from "@/lib/utils/helpers";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", slug: "", seoIntro: "", image: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getAllCategories().then(setCategories).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await createCategory({ ...form, slug: form.slug || toSlug(form.name) });
      const updated = await getAllCategories();
      setCategories(updated);
      setForm({ name: "", slug: "", seoIntro: "", image: "" });
      toast.success("Category created!");
    } catch { toast.error("Failed"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete category "${name}"? This won't delete recipes in it.`)) return;
    await deleteCategory(id);
    setCategories((c) => c.filter((x) => x.id !== id));
    toast.success("Deleted");
  };

  return (
    <div className="p-6 sm:p-8 max-w-3xl mx-auto">
      <h1 className="font-display text-2xl font-bold text-gray-900 mb-8">Categories</h1>

      {/* Add form */}
      <form onSubmit={handleAdd} className="card p-5 mb-8 space-y-4">
        <h2 className="font-display font-bold text-gray-900 text-lg">Add New Category</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Name *</label>
            <input type="text" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value, slug: toSlug(e.target.value) }))}
              required className="input" placeholder="Fusion Mains" />
          </div>
          <div>
            <label className="label">Slug *</label>
            <input type="text" value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
              required className="input font-mono text-sm" placeholder="fusion-mains" />
          </div>
        </div>
        <div>
          <label className="label">SEO Intro (300-500 words)</label>
          <textarea value={form.seoIntro} onChange={(e) => setForm((f) => ({ ...f, seoIntro: e.target.value }))}
            rows={4} className="textarea" placeholder="Describe this category for SEO…" />
        </div>
        <div>
          <label className="label">Image URL</label>
          <input type="url" value={form.image} onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
            className="input" placeholder="https://res.cloudinary.com/…" />
        </div>
        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? "Adding…" : "Add Category"}
        </button>
      </form>

      {/* Existing list */}
      <div className="card overflow-hidden">
        <table className="table-base">
          <thead><tr><th>Name</th><th>Slug</th><th>Actions</th></tr></thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={3} className="text-center py-8 text-gray-400">Loading…</td></tr>
            ) : categories.length === 0 ? (
              <tr><td colSpan={3} className="text-center py-8 text-gray-400">No categories yet.</td></tr>
            ) : categories.map((cat) => (
              <tr key={cat.id}>
                <td className="font-semibold text-sm">{cat.name}</td>
                <td><code className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{cat.slug}</code></td>
                <td>
                  <button onClick={() => handleDelete(cat.id, cat.name)} className="btn-danger btn-sm text-xs">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
