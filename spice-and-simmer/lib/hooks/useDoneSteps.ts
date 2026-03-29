"use client";

import { useState, useCallback } from "react";

export function useDoneSteps(recipeId: string) {
  const storageKey = `done-steps-${recipeId}`;

  const [done, setDone] = useState<number[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      return JSON.parse(sessionStorage.getItem(storageKey) || "[]");
    } catch {
      return [];
    }
  });

  const toggle = useCallback(
    (stepNumber: number) => {
      setDone((prev) => {
        const next = prev.includes(stepNumber)
          ? prev.filter((n) => n !== stepNumber)
          : [...prev, stepNumber];
        try {
          sessionStorage.setItem(storageKey, JSON.stringify(next));
        } catch {}
        return next;
      });
    },
    [storageKey]
  );

  const reset = useCallback(() => {
    setDone([]);
    try { sessionStorage.removeItem(storageKey); } catch {}
  }, [storageKey]);

  const isStepDone = useCallback(
    (stepNumber: number) => done.includes(stepNumber),
    [done]
  );

  return { done, toggle, reset, isStepDone };
}
