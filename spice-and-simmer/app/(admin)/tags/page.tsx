"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { getAllTags, createTag, deleteTag } from "@/lib/firebase/queries";
import type { Tag } from "@/types";

export default function AdminTagsPage() {
  const [tags,    setTags]    = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [name,    setName]    = useState("");
  const [saving,  setSaving]  = useState(false);

  useEffect(() => {
    getAllTags().then(setTags).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    try {
      await createTag(name.trim());
      const updated = await getAllTags();
      setTags(updated);
      setName("");
      toast.success("Tag created!");
    } catch { toast.error("Failed"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string, tagName: string) => {
    if (!confirm(`Delete tag "${tagName}"?`)) return;
    await deleteTag(id);
    setTags((t) => t.filter((x) => x.id !== id));
    toast.success("Tag deleted");
  };

  return (
    <div className="p-6 sm:p-8 max-w-2xl mx-auto">
      <h1 className="font-display text-2xl font-bold text-gray-900 mb-8">Tags</h1>

      {/* Add tag form */}
      <form onSubmit={handleAdd} className="card p-5 mb-8">
        <h2 className="font-display font-bold text-gray-900 text-lg mb-4">Add New Tag</h2>
        <div className="flex gap-3">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Quick Weeknight"
            className="input flex-1"
            required
          />
          <button type="submit" disabled={saving} className="btn-primary whitespace-nowrap">
            {saving ? "Adding…" : "Add Tag"}
          </button>
        </div>
      </form>

      {/* Tags list */}
      <div className="card p-5">
        <h2 className="font-display font-bold text-gray-900 text-lg mb-4">
          All Tags ({tags.length})
        </h2>
        {loading ? (
          <p className="text-gray-400 text-sm text-center py-8">Loading…</p>
        ) : tags.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-8">No tags yet.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <div
                key={tag.id}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-full group"
              >
                <span className="text-sm text-gray-700 font-medium">#{tag.name}</span>
                <button
                  onClick={() => handleDelete(tag.id, tag.name)}
                  className="w-4 h-4 rounded-full bg-gray-300 text-gray-600 hover:bg-red-500 hover:text-white transition-colors flex items-center justify-center text-[10px] font-bold"
                  aria-label={`Delete tag ${tag.name}`}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
