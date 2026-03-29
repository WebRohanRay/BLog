"use client";

import { useState, useCallback } from "react";
import toast from "react-hot-toast";

interface UseCloudinaryUploadReturn {
  uploading: boolean;
  uploadImage: (file: File, folder?: string) => Promise<string | null>;
  UploadButton: React.FC<{ onUpload: (url: string) => void; label?: string }>;
}

export function useCloudinaryUpload(): UseCloudinaryUploadReturn {
  const [uploading, setUploading] = useState(false);

  const uploadImage = useCallback(async (file: File, folder = "spice-and-simmer"): Promise<string | null> => {
    setUploading(true);
    try {
      // Get signed upload params from server
      const sigRes = await fetch("/api/admin/upload", { method: "POST" });
      if (!sigRes.ok) throw new Error("Failed to get upload signature");
      const { signature, timestamp, apiKey, cloudName, uploadPreset } = await sigRes.json();

      // Upload directly to Cloudinary
      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", apiKey);
      formData.append("timestamp", timestamp);
      formData.append("signature", signature);
      formData.append("upload_preset", uploadPreset);
      formData.append("folder", folder);

      const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: "POST", body: formData }
      );
      const data = await uploadRes.json();
      if (!uploadRes.ok) throw new Error(data.error?.message || "Upload failed");

      return data.secure_url as string;
    } catch (err: any) {
      toast.error(err.message || "Image upload failed");
      return null;
    } finally {
      setUploading(false);
    }
  }, []);

  const UploadButton: React.FC<{ onUpload: (url: string) => void; label?: string }> = ({
    onUpload,
    label = "Upload Image",
  }) => (
    <label className={`btn-secondary btn-sm cursor-pointer gap-2 ${uploading ? "opacity-60 pointer-events-none" : ""}`}>
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      {uploading ? "Uploading…" : label}
      <input
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          const url = await uploadImage(file);
          if (url) onUpload(url);
        }}
      />
    </label>
  );

  return { uploading, uploadImage, UploadButton };
}
