"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import type { Blog } from "@/types";
import { toSlug, generateId } from "@/lib/utils/helpers";
import { createBlog, updateBlog } from "@/lib/firebase/queries";

interface BlogEditorProps {
  blog?: Blog;
  isEdit?: boolean;
}

const EMPTY_BLOG = {
  title: "", slug: "", content: "", excerpt: "",
  seoTitle: "", metaDescription: "",
  tags: [], image: "",
  status: "draft" as const,
  relatedRecipes: [], relatedBlogs: [],
  readingTime: 5,
};

export default function BlogEditor({ blog, isEdit = false }: BlogEditorProps) {
  const router = useRouter();
  const [form,   setForm]   = useState(blog || EMPTY_BLOG);
  const [saving, setSaving] = useState(false);
  const [slugEdited, setSlugEdited] = useState(isEdit);

  // Auto-slug from title
  useEffect(() => {
    if (slugEdited || !form.title) return;
    setForm((f) => ({ ...f, slug: toSlug(form.title) }));
  }, [form.title, slugEdited]);

  const set = (key: string, val: any) => setForm((f) => ({ ...f, [key]: val }));

  const handleSave = async (publish = false) => {
    if (!form.title || !form.content) {
      toast.error("Title and content are required");
      return;
    }
    setSaving(true);
    try {
      const data = {
        ...form,
        author: { name: "Admin", uid: "admin" },
        status: publish ? "published" as const : "draft" as const,
        publishedAt: publish ? new Date().toISOString() : blog?.publishedAt,
        readingTime: Math.ceil(form.content.split(" ").length / 200),
      };

      if (isEdit && blog?.id) {
        await updateBlog(blog.id, data);
        toast.success(publish ? "Published!" : "Draft saved!");
      } else {
        const id = await createBlog(data as any);
        toast.success(publish ? "Published!" : "Draft saved!");
        router.push(`/admin/blogs/${id}/edit`);
      }
    } catch (err: any) {
      toast.error(err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 sm:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
        <h1 className="font-display text-2xl font-bold text-gray-900">
          {isEdit ? "Edit Blog Post" : "New Blog Post"}
        </h1>
        <div className="flex gap-2">
          <button onClick={() => handleSave(false)} disabled={saving} className="btn-secondary">
            Save Draft
          </button>
          <button onClick={() => handleSave(true)} disabled={saving} className="btn-primary">
            {saving ? "Publishing…" : "Publish"}
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Title + slug */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="sm:col-span-2">
            <label className="label">Title *</label>
            <input type="text" value={form.title} onChange={(e) => set("title", e.target.value)}
              className="input text-lg font-display" placeholder="Your blog post title" required />
          </div>
          <div>
            <label className="label">Slug</label>
            <input type="text" value={form.slug}
              onChange={(e) => { setSlugEdited(true); set("slug", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-")); }}
              className="input font-mono text-sm" />
          </div>
          <div>
            <label className="label">Hero Image URL</label>
            <input type="url" value={form.image} onChange={(e) => set("image", e.target.value)}
              className="input" placeholder="https://res.cloudinary.com/…" />
          </div>
        </div>

        {/* Excerpt */}
        <div>
          <label className="label">Excerpt (shown in cards)</label>
          <textarea value={form.excerpt} onChange={(e) => set("excerpt", e.target.value)}
            rows={2} maxLength={300} className="textarea" placeholder="Short summary of this post…" />
        </div>

        {/* Content — plain HTML/Markdown */}
        <div>
          <label className="label">Content (HTML) *</label>
          <p className="text-xs text-gray-400 mb-1">
            Write in HTML. Use &lt;h2&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;strong&gt;, etc.
            In production, replace with a rich text editor like TipTap or Quill.
          </p>
          <textarea
            value={form.content}
            onChange={(e) => set("content", e.target.value)}
            rows={20}
            className="textarea font-mono text-sm"
            placeholder="<h2>Introduction</h2><p>Your blog post content here…</p>"
            required
          />
        </div>

        {/* SEO */}
        <div className="card-flat p-5 space-y-4">
          <h2 className="font-display font-bold text-gray-900">SEO Settings</h2>
          <div>
            <label className="label">SEO Title (max 70 chars)</label>
            <input type="text" value={form.seoTitle} onChange={(e) => set("seoTitle", e.target.value)}
              maxLength={70} className="input" />
            <p className="text-xs text-gray-400 mt-1">{form.seoTitle.length}/70</p>
          </div>
          <div>
            <label className="label">Meta Description (max 160 chars)</label>
            <textarea value={form.metaDescription} onChange={(e) => set("metaDescription", e.target.value)}
              maxLength={160} rows={2} className="textarea" />
            <p className="text-xs text-gray-400 mt-1">{form.metaDescription.length}/160</p>
          </div>
          <div>
            <label className="label">Tags (comma-separated)</label>
            <input type="text" value={form.tags.join(", ")}
              onChange={(e) => set("tags", e.target.value.split(",").map((t) => t.trim()).filter(Boolean))}
              className="input" placeholder="spices, tips, fusion cooking" />
          </div>
        </div>
      </div>

      {/* Bottom save */}
      <div className="flex gap-3 mt-8 pt-6 border-t border-gray-100">
        <button onClick={() => handleSave(false)} disabled={saving} className="btn-secondary">Save Draft</button>
        <button onClick={() => handleSave(true)} disabled={saving} className="btn-primary">Publish Post</button>
      </div>
    </div>
  );
}
