import { useRef, useEffect, useState } from "react";
import { Check, X, ChevronDown, ChevronUp } from "lucide-react";
import { Checkbox, Progress } from "@repo/ui";
import { cn } from "@repo/ui";
import { useSmartChecklist } from "@/presentation/hooks/useSmartChecklist";
import { AddStepForm } from "@/presentation/components/AddStepForm";
import { useThemePreferences } from "@/presentation/contexts/ThemePreferencesContext";

interface SmartChecklistProps {
  taskId: string;
}

export function SmartChecklist({ taskId }: SmartChecklistProps) {
  const {
    completedSteps,
    incompleteSteps,
    currentStep,
    remainingCount,
    allDone,
    totalSteps,
    completedCount,
    toggleStep,
    createStep,
    deleteStep,
  } = useSmartChecklist(taskId);

  const upcomingSteps = incompleteSteps.slice(1);

  const currentCheckboxRef = useRef<HTMLButtonElement>(null);
  const prevCurrentIdRef = useRef<string | null>(null);
  const { mode } = useThemePreferences();
  const [animatingId, setAnimatingId] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(mode === "detail");
  const animateTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [showAllStepsConcluded, setShowAllStepsConcluded] = useState(
    mode === "detail",
  );

  useEffect(() => {
    setShowAll(mode === "detail");
    setShowAllStepsConcluded(mode === "detail");
  }, [mode]);

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
      {completedSteps.length > 0 && (
        <button
          onClick={() => setShowAllStepsConcluded((v) => !v)}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors w-fit focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring rounded"
          aria-expanded={showAllStepsConcluded}
          aria-label={
            showAllStepsConcluded
              ? "Hide concluded steps"
              : `Show ${completedSteps.length} ${completedSteps.length === 1 ? "step concluded" : "steps concluded"}`
          }
        >
          {showAllStepsConcluded ? (
            <ChevronUp className="size-3" />
          ) : (
            <ChevronDown className="size-3" />
          )}
          {showAllStepsConcluded
            ? "Hide steps"
            : `${completedSteps.length} ${completedSteps.length === 1 ? "step concluded" : "steps concluded"}`}
        </button>
      )}
      {showAllStepsConcluded &&
        completedSteps.map((step) => (
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

      {/* Upcoming steps — toggled */}
      {remainingCount > 0 && (
        <>
          <button
            onClick={() => setShowAll((v) => !v)}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors w-fit focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring rounded"
            aria-expanded={showAll}
            aria-label={
              showAll
                ? "Hide remaining steps"
                : `Show ${remainingCount} more ${remainingCount === 1 ? "step" : "steps"}`
            }
          >
            {showAll ? (
              <ChevronUp className="size-3" />
            ) : (
              <ChevronDown className="size-3" />
            )}
            {showAll
              ? "Hide steps"
              : `${remainingCount} more ${remainingCount === 1 ? "step pending" : "steps pending"}`}
          </button>

          {showAll && (
            <div className="flex flex-col gap-1 pl-1 border-l border-border/40">
              {upcomingSteps.map((step) => (
                <div key={step.id} className="flex items-center gap-2 py-0.5">
                  <Checkbox
                    id={`step-upcoming-${step.id}`}
                    checked={false}
                    onCheckedChange={() => toggleStep(step.id, true)}
                    className="shrink-0"
                    aria-label={`Complete: ${step.title}`}
                  />
                  <label
                    htmlFor={`step-upcoming-${step.id}`}
                    className="text-xs flex-1 min-w-0 truncate cursor-pointer text-muted-foreground"
                  >
                    {step.title}
                  </label>
                  <button
                    onClick={() => deleteStep(step.id)}
                    className="shrink-0 text-muted-foreground/50 hover:text-destructive transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring rounded"
                    aria-label={`Remove step: ${step.title}`}
                  >
                    <X className="size-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Add step form */}
      <AddStepForm onSubmit={createStep} />
    </div>
  );
}
