import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { v4 as uuidv4 } from "uuid";

// ── Tailwind class merging ──────────────────────────────────────
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ── Slug generation ────────────────────────────────────────────
const SEO_PREFIXES = ["easy", "best", "quick"] as const;

export function generateSlug(title: string): string {
  const prefix = SEO_PREFIXES[Math.floor(Math.random() * SEO_PREFIXES.length)];
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
  return `${prefix}-${base}-recipe`;
}

export function toSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

// ── UUID ───────────────────────────────────────────────────────
export function generateId(): string {
  return uuidv4();
}

// ── Token (for email confirmation) ────────────────────────────
export function generateToken(): string {
  const array = new Uint8Array(32);
  if (typeof crypto !== "undefined") {
    crypto.getRandomValues(array);
  }
  return Array.from(array, (b) => b.toString(16).padStart(2, "0")).join("");
}

// ── Time formatting ────────────────────────────────────────────
export function formatTime(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}min` : `${h}h`;
}

export function formatTimer(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function minutesToISO(minutes: number): string {
  if (minutes < 60) return `PT${minutes}M`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `PT${h}H${m}M` : `PT${h}H`;
}

// ── Date formatting ────────────────────────────────────────────
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatDateShort(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function timeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return formatDateShort(dateString);
}

// ── Reading time ───────────────────────────────────────────────
export function estimateReadingTime(text: string): number {
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}

// ── SEO auto-generation ─────────────────────────────────────────
export function generateSeoTitle(title: string): string {
  return `Best ${title} Recipe (Easy & Quick)`;
}

export function generateMetaDescription(
  title: string,
  prepTime: number,
  totalTime: number,
  mainKeyword?: string
): string {
  const keyword = mainKeyword || `${title}`;
  const desc = `Learn how to make the best ${keyword} at home. Easy step-by-step recipe with tips. Ready in just ${totalTime} minutes. Perfect for busy home cooks!`;
  // Truncate to 160 chars
  return desc.length > 160 ? desc.substring(0, 157) + "..." : desc;
}

// ── Cloudinary URL builder ─────────────────────────────────────
export function cloudinaryUrl(
  publicId: string,
  options: {
    width?: number;
    height?: number;
    quality?: string;
    format?: string;
    crop?: string;
  } = {}
): string {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!cloudName) return publicId; // Fallback to raw URL

  const {
    width,
    height,
    quality = "auto",
    format = "auto",
    crop = "fill",
  } = options;

  const transforms = [
    `f_${format}`,
    `q_${quality}`,
    width ? `w_${width}` : "",
    height ? `h_${height}` : "",
    width || height ? `c_${crop}` : "",
  ]
    .filter(Boolean)
    .join(",");

  return `https://res.cloudinary.com/${cloudName}/image/upload/${transforms}/${publicId}`;
}

// ── Number formatting ──────────────────────────────────────────
export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}

// ── Truncate text ──────────────────────────────────────────────
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).replace(/\s+\S*$/, "") + "…";
}

// ── Debounce ───────────────────────────────────────────────────
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

// ── Validation helpers ─────────────────────────────────────────
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ── Array utilities ────────────────────────────────────────────
export function chunk<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

export function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// ── hCaptcha verification ──────────────────────────────────────
export async function verifyHCaptcha(token: string): Promise<boolean> {
  const secret = process.env.HCAPTCHA_SECRET_KEY;
  if (!secret) {
    // Dev mode: skip verification
    console.warn("hCaptcha secret not configured — skipping verification in dev");
    return true;
  }

  const res = await fetch("https://hcaptcha.com/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ secret, response: token }),
  });

  const data = await res.json();
  return data.success === true;
}
