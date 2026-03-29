"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "@/lib/firebase/auth";
import toast from "react-hot-toast";

export default function AdminLoginPage() {
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [loading,  setLoading]  = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/admin";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signIn(email, password);
      router.push(redirect);
      toast.success("Welcome back!");
    } catch (err: any) {
      toast.error("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3" role="img" aria-hidden>🌶️</div>
          <h1 className="font-display font-bold text-2xl text-gray-900">Admin Login</h1>
          <p className="text-sm text-gray-400 mt-1">Spice & Simmer CMS</p>
        </div>

        <form onSubmit={handleSubmit} className="card p-6 sm:p-8 space-y-5">
          <div>
            <label htmlFor="admin-email" className="label">Email</label>
            <input
              id="admin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input"
              placeholder="admin@spiceandsimmer.com"
              autoComplete="email"
            />
          </div>
          <div>
            <label htmlFor="admin-password" className="label">Password</label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input"
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-4">
          <a href="/" className="hover:text-gray-600 transition-colors">← Back to site</a>
        </p>
      </div>
    </div>
  );
}
