"use client";
// ============================================================
// Firebase Auth Helpers — client-side
// ============================================================
import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth";
import { auth } from "./client";

/** Sign in admin user */
export async function signIn(email: string, password: string): Promise<User> {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  // Set session cookie (server sets httpOnly cookie via /api/admin/session)
  const token = await cred.user.getIdToken();
  await fetch("/api/admin/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });
  return cred.user;
}

/** Sign out */
export async function signOut(): Promise<void> {
  await firebaseSignOut(auth);
  await fetch("/api/admin/session", { method: "DELETE" });
}

/** Get current user (client-side) */
export function getCurrentUser(): User | null {
  return auth.currentUser;
}

/** Subscribe to auth state changes */
export function subscribeToAuthState(
  callback: (user: User | null) => void
): () => void {
  return onAuthStateChanged(auth, callback);
}

/** Get fresh ID token */
export async function getIdToken(): Promise<string | null> {
  const user = auth.currentUser;
  if (!user) return null;
  return user.getIdToken();
}
