import { useRef, useEffect, useState } from "react";
import { Check, X, ChevronDown } from "lucide-react";
import { Checkbox, Progress } from "@repo/ui";
import { cn } from "@repo/ui";
import { useSmartChecklist } from "@/presentation/hooks/useSmartChecklist";
import { AddStepForm } from "@/presentation/components/AddStepForm";

interface SmartChecklistProps {
  taskId: string;
}

export function SmartChecklist({ taskId }: SmartChecklistProps) {
  const {
    completedSteps,
    currentStep,
    remainingCount,
    allDone,
    totalSteps,
    completedCount,
    toggleStep,
    createStep,
    deleteStep,
  } = useSmartChecklist(taskId);

  const currentCheckboxRef = useRef<HTMLButtonElement>(null);
  const prevCurrentIdRef = useRef<string | null>(null);
  const [animatingId, setAnimatingId] = useState<string | null>(null);
  const animateTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-focus next step when current step changes (using ref to avoid cascading renders)
  useEffect(() => {
    const currentId = currentStep?.id ?? null;
    if (currentId && currentId !== prevCurrentIdRef.current) {
      const wasActive = prevCurrentIdRef.current !== null;
      prevCurrentIdRef.current = currentId;
      // Defer setState so it doesn't fire synchronously inside the effect
      const t1 = setTimeout(() => {
        if (wasActive) setAnimatingId(currentId);
        currentCheckboxRef.current?.focus();
      }, 20);
      animateTimerRef.current = setTimeout(() => setAnimatingId(null), 370);
      return () => {
        clearTimeout(t1);
        if (animateTimerRef.current) clearTimeout(animateTimerRef.current);
      };
    }
  }, [currentStep?.id]);

  if (totalSteps === 0) {
    return (
      <div className="flex flex-col gap-2 pt-1">
        <p className="text-xs text-muted-foreground italic">
          Break this task into smaller steps.
        </p>
        <AddStepForm onSubmit={createStep} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 pt-1">
      {/* Progress indicator */}
      {totalSteps > 0 && (
        <div className="flex items-center gap-2">
          <Progress
            value={(completedCount / totalSteps) * 100}
            className="h-1.5 flex-1"
            aria-label={`${completedCount} of ${totalSteps} steps complete`}
          />
          <span className="text-xs text-muted-foreground tabular-nums shrink-0">
            {completedCount}/{totalSteps}
          </span>
        </div>
      )}

      {/* Completed steps — dimmed */}
      {completedSteps.map((step) => (
        <div
          key={step.id}
          className="flex items-center gap-2 opacity-40 transition-opacity duration-300"
        >
          <Checkbox
            id={`step-${step.id}`}
            checked
            onCheckedChange={() => toggleStep(step.id, false)}
            className="shrink-0"
            aria-label={`Unmark: ${step.title}`}
          />
          <span className="text-xs line-through text-muted-foreground flex-1 min-w-0 truncate">
            {step.title}
          </span>
          <button
            onClick={() => deleteStep(step.id)}
            className="shrink-0 text-muted-foreground/50 hover:text-destructive transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring rounded"
            aria-label={`Remove step: ${step.title}`}
          >
            <X className="size-3" />
          </button>
        </div>
      ))}

      {/* Current prominent step */}
      {currentStep && (
        <div
          className={cn(
            "flex items-start gap-2 p-2 rounded-md bg-muted/40 border border-border/30 transition-all duration-300",
            animatingId === currentStep.id &&
              "animate-in fade-in slide-in-from-bottom-1",
          )}
        >
          <Checkbox
            id={`step-${currentStep.id}`}
            ref={currentCheckboxRef}
            checked={false}
            onCheckedChange={() => toggleStep(currentStep.id, true)}
            className="shrink-0 mt-0.5"
            aria-label={`Complete: ${currentStep.title}`}
          />
          <label
            htmlFor={`step-${currentStep.id}`}
            className="text-sm font-medium flex-1 min-w-0 cursor-pointer"
          >
            {currentStep.title}
          </label>
          <button
            onClick={() => deleteStep(currentStep.id)}
            className="shrink-0 text-muted-foreground/50 hover:text-destructive transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring rounded"
            aria-label={`Remove step: ${currentStep.title}`}
          >
            <X className="size-3" />
          </button>
        </div>
      )}

      {/* All done */}
      {allDone && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground animate-in fade-in duration-300">
          <Check className="size-3 text-green-600" />
          All steps complete!
        </div>
      )}

      {/* Remaining steps count */}
      {remainingCount > 0 && (
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <ChevronDown className="size-3" />
          {remainingCount} more {remainingCount === 1 ? "step" : "steps"}
        </div>
      )}

      {/* Add step form */}
      <AddStepForm onSubmit={createStep} />
    </div>
  );
}
