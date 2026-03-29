"use client";

import {
  useState, useEffect, useRef, useCallback,
} from "react";
import Image from "next/image";
import type { RecipeStep } from "@/types";
import { formatTimer } from "@/lib/utils/helpers";

// ── Step Timer ─────────────────────────────────────────────────
function StepTimer({ seconds, stepNumber }: { seconds: number; stepNumber: number }) {
  const [remaining, setRemaining] = useState(seconds);
  const [running, setRunning]     = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    if (running && remaining > 0) {
      intervalRef.current = setInterval(() => {
        setRemaining((r) => {
          if (r <= 1) {
            clearInterval(intervalRef.current);
            setRunning(false);
            // Audio alert
            try {
              const audio = new Audio("/sounds/timer-done.mp3");
              audio.play().catch(() => {});
            } catch {}
            // Browser notification
            if (typeof Notification !== "undefined" && Notification.permission === "granted") {
              new Notification(`⏰ Step ${stepNumber} timer done!`, {
                body: "Time to move on to the next step.",
                icon: "/images/logo.png",
              });
            }
            return 0;
          }
          return r - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [running, stepNumber]);

  const handleStart = () => {
    if (typeof Notification !== "undefined" && Notification.permission === "default") {
      Notification.requestPermission();
    }
    setRunning(true);
  };

  const pct = Math.round(((seconds - remaining) / seconds) * 100);

  return (
    <div className="mt-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
      {/* Progress arc */}
      <div className="flex items-center gap-4">
        {/* Circular progress */}
        <div className="relative w-12 h-12 flex-shrink-0">
          <svg className="w-12 h-12 -rotate-90" viewBox="0 0 48 48">
            <circle cx="24" cy="24" r="20" fill="none" stroke="#e5e7eb" strokeWidth="4" />
            <circle
              cx="24" cy="24" r="20"
              fill="none"
              stroke={remaining === 0 ? "#22c55e" : "#f97316"}
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 20}`}
              strokeDashoffset={`${2 * Math.PI * 20 * (1 - pct / 100)}`}
              className="transition-all duration-1000"
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-gray-700">
            {remaining === 0 ? "✓" : `${pct}%`}
          </span>
        </div>

        {/* Time display */}
        <div className="flex-1">
          <span className="font-mono text-xl font-bold text-gray-900">
            {formatTimer(remaining)}
          </span>
          {remaining === 0 && (
            <span className="ml-2 text-green-500 text-sm font-semibold">Done!</span>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {!running && remaining > 0 && (
            <button
              onClick={handleStart}
              className="btn-primary btn-sm"
              aria-label="Start timer"
            >
              ▶ Start
            </button>
          )}
          {running && (
            <button
              onClick={() => setRunning(false)}
              className="btn-secondary btn-sm"
              aria-label="Pause timer"
            >
              ⏸ Pause
            </button>
          )}
          <button
            onClick={() => { setRunning(false); setRemaining(seconds); }}
            className="btn-secondary btn-sm"
            aria-label="Reset timer"
          >
            ↺
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Step Card ──────────────────────────────────────────────────
function StepCard({
  step,
  isDone,
  onToggle,
  recipeTitle,
}: {
  step: RecipeStep;
  isDone: boolean;
  onToggle: (n: number) => void;
  recipeTitle: string;
}) {
  return (
    <div
      id={`step-${step.stepNumber}`}
      className={`step-card ${isDone ? "step-card-done" : "step-card-active"}`}
      aria-label={`Step ${step.stepNumber}: ${step.title}`}
    >
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <span
          className={`w-8 h-8 rounded-full text-white text-sm font-bold flex items-center justify-center flex-shrink-0 mt-0.5 ${
            isDone ? "bg-green-500" : "bg-brand-500"
          }`}
          aria-hidden="true"
        >
          {isDone ? "✓" : step.stepNumber}
        </span>
        <h3 className="text-base sm:text-lg font-bold text-gray-900 leading-snug">
          {step.title}
        </h3>
        {isDone && (
          <span className="ml-auto text-green-500 text-xl flex-shrink-0" aria-hidden>✓</span>
        )}
      </div>

      {/* Step image */}
      {step.image && (
        <div className="relative w-full rounded-xl overflow-hidden mb-4 bg-gray-100"
          style={{ aspectRatio: "16/9" }}
        >
          <Image
            src={step.image}
            alt={`Step ${step.stepNumber}: ${step.title} — ${recipeTitle}`}
            fill
            sizes="(max-width: 1024px) 100vw, 66vw"
            className="object-cover"
            loading="lazy"
          />
        </div>
      )}

      {/* Description */}
      <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-3">
        {step.description}
      </p>

      {/* Timer */}
      {step.timer && step.timer > 0 && (
        <StepTimer seconds={step.timer} stepNumber={step.stepNumber} />
      )}

      {/* Tip */}
      {step.tip && (
        <div className="tip-box" role="note" aria-label="Pro tip">
          <p className="tip-text">
            <span aria-hidden>💡 </span>
            <strong>Tip: </strong>
            {step.tip}
          </p>
        </div>
      )}

      {/* Mark done button */}
      <button
        onClick={() => onToggle(step.stepNumber)}
        className={`mt-4 w-full sm:w-auto btn btn-sm transition-all ${
          isDone
            ? "bg-green-500 text-white hover:bg-green-600 border-transparent"
            : "btn-secondary hover:border-green-400 hover:text-green-700 hover:bg-green-50"
        }`}
        aria-pressed={isDone}
      >
        {isDone ? "✓ Done" : "Mark as done"}
      </button>
    </div>
  );
}

// ── Cook Mode (full-screen) ────────────────────────────────────
function CookMode({
  steps,
  recipeTitle,
  onExit,
}: {
  steps: RecipeStep[];
  recipeTitle: string;
  onExit: () => void;
}) {
  const [current, setCurrent] = useState(0);
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);
  const step = steps[current];

  // Acquire Wake Lock
  useEffect(() => {
    const acquire = async () => {
      try {
        if ("wakeLock" in navigator) {
          wakeLockRef.current = await navigator.wakeLock.request("screen");
        }
      } catch {
        // Graceful fallback — user will need to keep screen on manually
      }
    };
    acquire();
    return () => {
      wakeLockRef.current?.release().catch(() => {});
    };
  }, []);

  // Keyboard nav
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        setCurrent((c) => Math.min(steps.length - 1, c + 1));
      }
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        setCurrent((c) => Math.max(0, c - 1));
      }
      if (e.key === "Escape") onExit();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [steps.length, onExit]);

  return (
    <div className="cook-mode-overlay" role="dialog" aria-modal="true" aria-label="Cook mode">
      {/* Header */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-100 bg-white flex-shrink-0">
        <div>
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">
            {recipeTitle}
          </p>
          <p className="text-sm font-bold text-gray-700">
            Step {current + 1} of {steps.length}
          </p>
        </div>

        {/* Progress pills */}
        <div className="hidden sm:flex items-center gap-1">
          {steps.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-2 h-2 rounded-full transition-all ${
                i === current ? "bg-brand-500 w-4" : i < current ? "bg-green-400" : "bg-gray-200"
              }`}
              aria-label={`Go to step ${i + 1}`}
            />
          ))}
        </div>

        <button
          onClick={onExit}
          className="btn-secondary btn-sm"
          aria-label="Exit cook mode"
        >
          ✕ Exit
        </button>
      </div>

      {/* Step content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 sm:px-8 py-6 sm:py-8">
          {/* Phase label */}
          <span className={`badge mb-4 ${
            step.phase === "prep" ? "badge-yellow" :
            step.phase === "cooking" ? "badge-orange" : "badge-green"
          }`}>
            {step.phase.charAt(0).toUpperCase() + step.phase.slice(1)} Phase
          </span>

          <h2 className="font-display text-2xl sm:text-3xl font-bold text-gray-900 mb-5 text-balance">
            {step.title}
          </h2>

          {step.image && (
            <div className="relative w-full rounded-2xl overflow-hidden mb-6 bg-gray-100"
              style={{ aspectRatio: "4/3" }}
            >
              <Image
                src={step.image}
                alt={step.title}
                fill
                sizes="(max-width: 640px) 100vw, 640px"
                className="object-cover"
              />
            </div>
          )}

          <p className="text-lg sm:text-xl leading-relaxed text-gray-700 mb-6">
            {step.description}
          </p>

          {step.tip && (
            <div className="tip-box">
              <p className="tip-text text-base">💡 {step.tip}</p>
            </div>
          )}

          {step.timer && step.timer > 0 && (
            <StepTimer seconds={step.timer} stepNumber={step.stepNumber} />
          )}
        </div>
      </div>

      {/* Navigation footer */}
      <div className="flex items-center gap-3 px-4 sm:px-6 py-4 border-t border-gray-100 bg-white flex-shrink-0">
        <button
          onClick={() => setCurrent((c) => Math.max(0, c - 1))}
          disabled={current === 0}
          className="flex-1 btn-secondary btn-lg disabled:opacity-40"
          aria-label="Previous step"
        >
          ← Prev
        </button>

        {/* Mobile step counter */}
        <span className="text-sm font-bold text-gray-500 whitespace-nowrap sm:hidden">
          {current + 1}/{steps.length}
        </span>

        {current < steps.length - 1 ? (
          <button
            onClick={() => setCurrent((c) => c + 1)}
            className="flex-1 btn-primary btn-lg"
            aria-label="Next step"
          >
            Next →
          </button>
        ) : (
          <button
            onClick={onExit}
            className="flex-1 bg-green-500 text-white rounded-2xl font-bold text-base min-h-[52px] hover:bg-green-600 transition-colors"
          >
            🎉 Done!
          </button>
        )}
      </div>
    </div>
  );
}

// ── Main RecipeSteps Component ─────────────────────────────────
interface RecipeStepsProps {
  steps: RecipeStep[];
  recipeId: string;
  recipeTitle: string;
}

export default function RecipeSteps({ steps, recipeId, recipeTitle }: RecipeStepsProps) {
  const [cookMode, setCookMode] = useState(false);
  const key = `done-${recipeId}`;

  // Persist completed steps for the session
  const [done, setDone] = useState<number[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      return JSON.parse(sessionStorage.getItem(key) || "[]");
    } catch {
      return [];
    }
  });

  const toggleDone = useCallback((num: number) => {
    setDone((prev) => {
      const next = prev.includes(num)
        ? prev.filter((n) => n !== num)
        : [...prev, num];
      try {
        sessionStorage.setItem(key, JSON.stringify(next));
      } catch {}
      return next;
    });
  }, [key]);

  const resetAll = () => {
    setDone([]);
    try { sessionStorage.removeItem(key); } catch {}
  };

  const doneCount = done.length;
  const pct = Math.round((doneCount / steps.length) * 100);

  // Group steps by phase
  const phases: Array<{ phase: string; steps: RecipeStep[] }> = [];
  for (const step of steps) {
    const last = phases[phases.length - 1];
    if (last && last.phase === step.phase) {
      last.steps.push(step);
    } else {
      phases.push({ phase: step.phase, steps: [step] });
    }
  }

  const PHASE_LABELS: Record<string, string> = {
    prep:     "Prep Phase",
    cooking:  "Cooking Phase",
    finishing: "Finishing Phase",
  };

  if (cookMode) {
    return (
      <CookMode
        steps={steps}
        recipeTitle={recipeTitle}
        onExit={() => setCookMode(false)}
      />
    );
  }

  return (
    <div>
      {/* Progress bar + actions */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-gray-500">
            {doneCount} / {steps.length} steps done
          </span>
          <div className="flex items-center gap-3">
            <span className="font-bold text-brand-600">{pct}%</span>
            {doneCount > 0 && (
              <button
                onClick={resetAll}
                className="text-xs text-gray-400 hover:text-gray-600 transition-colors underline"
              >
                Reset
              </button>
            )}
          </div>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden" role="progressbar"
          aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}
        >
          <div
            className="h-full bg-gradient-to-r from-brand-500 to-brand-600 rounded-full transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Jump to step pills */}
      <div className="flex flex-wrap gap-2 mb-6" role="navigation" aria-label="Jump to step">
        {steps.map((s) => (
          <button
            key={s.stepNumber}
            onClick={() =>
              document
                .getElementById(`step-${s.stepNumber}`)
                ?.scrollIntoView({ behavior: "smooth", block: "start" })
            }
            className={`min-w-[36px] min-h-[36px] rounded-full text-sm font-bold transition-all ${
              done.includes(s.stepNumber)
                ? "bg-green-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-brand-100 hover:text-brand-700"
            }`}
            aria-label={`Jump to step ${s.stepNumber}${done.includes(s.stepNumber) ? " (done)" : ""}`}
          >
            {s.stepNumber}
          </button>
        ))}
      </div>

      {/* Cook Mode button */}
      <button
        onClick={() => setCookMode(true)}
        className="btn-primary mb-8 gap-2 no-print"
        aria-label="Enter cook mode — full screen step-by-step"
      >
        <span aria-hidden>👨‍🍳</span>
        Enter Cook Mode
      </button>

      {/* Phases + steps */}
      {phases.map(({ phase, steps: phaseSteps }) => (
        <div key={phase}>
          {/* Phase divider */}
          <div className="phase-divider" aria-label={`${PHASE_LABELS[phase] || phase} begins`}>
            <div className="phase-divider-line" aria-hidden />
            <span className="phase-divider-label">
              {PHASE_LABELS[phase] || phase}
            </span>
            <div className="phase-divider-line" aria-hidden />
          </div>

          {phaseSteps.map((step) => (
            <StepCard
              key={step.stepNumber}
              step={step}
              isDone={done.includes(step.stepNumber)}
              onToggle={toggleDone}
              recipeTitle={recipeTitle}
            />
          ))}
        </div>
      ))}

      {/* Completion banner */}
      {pct === 100 && (
        <div className="mt-6 p-5 bg-green-50 border border-green-200 rounded-2xl text-center animate-fade-in">
          <div className="text-4xl mb-2" role="img" aria-label="Celebration">🎉</div>
          <h3 className="font-display font-bold text-green-800 text-lg mb-1">
            Recipe complete!
          </h3>
          <p className="text-sm text-green-600">
            Great job! Don&apos;t forget to leave a review below.
          </p>
        </div>
      )}
    </div>
  );
}
