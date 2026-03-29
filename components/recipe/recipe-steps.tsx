'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Check, Play, Pause, RotateCcw, Lightbulb, ChefHat, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Step {
  stepNumber: number
  phase: 'prep' | 'cooking' | 'finishing'
  title: string
  description: string
  image?: string
  timer?: number
  tip?: string
}

interface RecipeStepsProps {
  steps: Step[]
  recipeId: string
  recipeTitle: string
}

export function RecipeSteps({ steps, recipeId, recipeTitle }: RecipeStepsProps) {
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [cookModeActive, setCookModeActive] = useState(false)
  const [currentCookStep, setCurrentCookStep] = useState(0)

  // Persist completed steps in sessionStorage
  useEffect(() => {
    const saved = sessionStorage.getItem(`done-${recipeId}`)
    if (saved) {
      setCompletedSteps(JSON.parse(saved))
    }
  }, [recipeId])

  const toggleStep = (stepNumber: number) => {
    setCompletedSteps((prev) => {
      const next = prev.includes(stepNumber)
        ? prev.filter((n) => n !== stepNumber)
        : [...prev, stepNumber]
      sessionStorage.setItem(`done-${recipeId}`, JSON.stringify(next))
      return next
    })
  }

  const progress = (completedSteps.length / steps.length) * 100

  const phases = ['prep', 'cooking', 'finishing'] as const
  const phaseLabels = { prep: 'Preparation', cooking: 'Cooking', finishing: 'Finishing' }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl sm:text-2xl font-serif font-bold text-foreground">
          Instructions
        </h2>
        <Button onClick={() => setCookModeActive(true)} className="min-h-[44px]">
          <ChefHat className="w-4 h-4 mr-2" />
          Cook Mode
        </Button>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
          <span>
            {completedSteps.length} of {steps.length} steps complete
          </span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Jump to Step Pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        {steps.map((step) => (
          <button
            key={step.stepNumber}
            onClick={() =>
              document.getElementById(`step-${step.stepNumber}`)?.scrollIntoView({ behavior: 'smooth' })
            }
            className={cn(
              'min-w-[36px] min-h-[36px] rounded-full text-sm font-medium transition-colors',
              completedSteps.includes(step.stepNumber)
                ? 'bg-green-500 text-white'
                : 'bg-muted text-muted-foreground hover:bg-primary/20'
            )}
          >
            {step.stepNumber}
          </button>
        ))}
      </div>

      {/* Steps by Phase */}
      {phases.map((phase) => {
        const phaseSteps = steps.filter((s) => s.phase === phase)
        if (phaseSteps.length === 0) return null

        return (
          <div key={phase}>
            {/* Phase Header */}
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground px-3">
                {phaseLabels[phase]}
              </span>
              <div className="flex-1 h-px bg-border" />
            </div>

            {/* Phase Steps */}
            {phaseSteps.map((step) => (
              <StepCard
                key={step.stepNumber}
                step={step}
                recipeTitle={recipeTitle}
                completed={completedSteps.includes(step.stepNumber)}
                onToggle={() => toggleStep(step.stepNumber)}
              />
            ))}
          </div>
        )
      })}

      {/* Cook Mode Overlay */}
      {cookModeActive && (
        <CookMode
          steps={steps}
          currentStep={currentCookStep}
          setCurrentStep={setCurrentCookStep}
          onExit={() => setCookModeActive(false)}
          recipeTitle={recipeTitle}
        />
      )}
    </div>
  )
}

interface StepCardProps {
  step: Step
  recipeTitle: string
  completed: boolean
  onToggle: () => void
}

function StepCard({ step, recipeTitle, completed, onToggle }: StepCardProps) {
  return (
    <div
      id={`step-${step.stepNumber}`}
      className={cn(
        'rounded-xl border p-4 sm:p-6 mb-4 transition-all scroll-mt-24',
        completed
          ? 'opacity-60 border-green-300 bg-green-50/50'
          : 'border-border bg-card'
      )}
    >
      {/* Step Header */}
      <div className="flex items-center gap-3 mb-3">
        <span
          className={cn(
            'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0',
            completed
              ? 'bg-green-500 text-white'
              : 'bg-primary text-primary-foreground'
          )}
        >
          {completed ? <Check className="w-4 h-4" /> : step.stepNumber}
        </span>
        <h3 className="text-base sm:text-lg font-semibold text-foreground">
          {step.title}
        </h3>
      </div>

      {/* Step Image */}
      {step.image && (
        <div className="relative w-full h-40 sm:h-52 mb-4 rounded-lg overflow-hidden">
          <Image
            src={step.image}
            alt={`Step ${step.stepNumber}: ${step.title} - ${recipeTitle}`}
            fill
            className="object-cover"
            loading="lazy"
          />
        </div>
      )}

      {/* Description */}
      <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-4">
        {step.description}
      </p>

      {/* Timer */}
      {step.timer && <StepTimer seconds={step.timer} stepNumber={step.stepNumber} />}

      {/* Tip */}
      {step.tip && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg p-3 mt-3">
          <p className="text-sm text-yellow-800 flex items-start gap-2">
            <Lightbulb className="w-4 h-4 flex-shrink-0 mt-0.5" />
            {step.tip}
          </p>
        </div>
      )}

      {/* Mark Done Button */}
      <Button
        onClick={onToggle}
        variant={completed ? 'secondary' : 'outline'}
        className="mt-4 min-h-[44px]"
      >
        {completed ? (
          <>
            <Check className="w-4 h-4 mr-2" />
            Done
          </>
        ) : (
          'Mark as done'
        )}
      </Button>
    </div>
  )
}

interface StepTimerProps {
  seconds: number
  stepNumber: number
}

function StepTimer({ seconds, stepNumber }: StepTimerProps) {
  const [remaining, setRemaining] = useState(seconds)
  const [running, setRunning] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (running && remaining > 0) {
      intervalRef.current = setInterval(() => {
        setRemaining((r) => {
          if (r <= 1) {
            if (intervalRef.current) clearInterval(intervalRef.current)
            setRunning(false)
            // Audio alert
            try {
              new Audio('/sounds/timer-done.mp3').play()
            } catch {
              // Silently fail
            }
            // Browser notification
            if (Notification.permission === 'granted') {
              new Notification(`Step ${stepNumber} timer done!`)
            }
            return 0
          }
          return r - 1
        })
      }, 1000)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [running, remaining, stepNumber])

  const mins = Math.floor(remaining / 60)
  const secs = remaining % 60

  const requestNotificationPermission = () => {
    if (Notification.permission !== 'granted') {
      Notification.requestPermission()
    }
  }

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <span className="text-sm font-mono bg-muted px-3 py-1 rounded-lg">
        {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
      </span>
      <Button
        onClick={() => {
          setRunning(true)
          requestNotificationPermission()
        }}
        disabled={running || remaining === 0}
        size="sm"
        className="min-h-[36px]"
      >
        <Play className="w-3 h-3 mr-1" />
        Start
      </Button>
      <Button
        onClick={() => setRunning(false)}
        disabled={!running}
        size="sm"
        variant="outline"
        className="min-h-[36px]"
      >
        <Pause className="w-3 h-3 mr-1" />
        Pause
      </Button>
      <Button
        onClick={() => {
          setRunning(false)
          setRemaining(seconds)
        }}
        size="sm"
        variant="outline"
        className="min-h-[36px]"
      >
        <RotateCcw className="w-3 h-3 mr-1" />
        Reset
      </Button>
    </div>
  )
}

interface CookModeProps {
  steps: Step[]
  currentStep: number
  setCurrentStep: (step: number) => void
  onExit: () => void
  recipeTitle: string
}

function CookMode({ steps, currentStep, setCurrentStep, onExit, recipeTitle }: CookModeProps) {
  const step = steps[currentStep]
  const wakeLockRef = useRef<WakeLockSentinel | null>(null)

  useEffect(() => {
    // Request wake lock
    const requestWakeLock = async () => {
      try {
        wakeLockRef.current = await navigator.wakeLock.request('screen')
      } catch {
        // Graceful fallback
      }
    }
    requestWakeLock()

    return () => {
      if (wakeLockRef.current) {
        wakeLockRef.current.release()
      }
    }
  }, [])

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-border">
        <span className="text-sm text-muted-foreground">
          Step {currentStep + 1} of {steps.length}
        </span>
        <Button onClick={onExit} variant="outline" className="min-h-[44px]">
          <X className="w-4 h-4 mr-2" />
          Exit
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 max-w-2xl mx-auto w-full">
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-foreground mb-4">
          {step.title}
        </h2>
        {step.image && (
          <div className="relative w-full h-48 sm:h-64 rounded-xl overflow-hidden mb-6">
            <Image
              src={step.image}
              alt={`Step ${step.stepNumber}: ${step.title} - ${recipeTitle}`}
              fill
              className="object-cover"
            />
          </div>
        )}
        <p className="text-lg sm:text-xl leading-relaxed text-muted-foreground mb-6">
          {step.description}
        </p>
        {step.tip && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-xl mb-6">
            <p className="text-base text-yellow-800 flex items-start gap-2">
              <Lightbulb className="w-5 h-5 flex-shrink-0 mt-0.5" />
              {step.tip}
            </p>
          </div>
        )}
        {step.timer && <StepTimer seconds={step.timer} stepNumber={step.stepNumber} />}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between px-4 py-4 border-t border-border gap-3">
        <Button
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
          variant="outline"
          className="flex-1 min-h-[52px]"
        >
          Previous
        </Button>
        <Button
          onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
          disabled={currentStep === steps.length - 1}
          className="flex-1 min-h-[52px]"
        >
          Next
        </Button>
      </div>
    </div>
  )
}
