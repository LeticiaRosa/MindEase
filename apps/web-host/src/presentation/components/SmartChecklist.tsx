import { useRef, useEffect, useState } from "react";
import { Check, Trash2, ChevronDown, ChevronUp, Pencil } from "lucide-react";
import {
  Checkbox,
  Progress,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@repo/ui";
import { cn } from "@repo/ui";
import { useSmartChecklist } from "@/presentation/hooks/useSmartChecklist";
import { AddStepDialog } from "@/presentation/components/AddStepDialog";
import { EditStepDialog } from "@/presentation/components/EditStepDialog";
import { ConfirmDeleteDialog } from "@/presentation/components/ConfirmDeleteDialog";
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
    updateStep,
  } = useSmartChecklist(taskId);

  const upcomingSteps = incompleteSteps.slice(1);

  const currentCheckboxRef = useRef<HTMLButtonElement>(null);
  const prevCurrentIdRef = useRef<string | null>(null);
  const { mode, helpers, complexity } = useThemePreferences();
  const [animatingId, setAnimatingId] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(mode === "detail");
  const animateTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [showAllStepsConcluded, setShowAllStepsConcluded] = useState(
    mode === "detail",
  );
  const [editingStep, setEditingStep] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const [deletingStepId, setDeletingStepId] = useState<string | null>(null);

  useEffect(() => {
    setShowAll(mode === "detail");
    setShowAllStepsConcluded(mode === "detail");
  }, [mode]);

  const startEditingStep = (stepId: string, currentTitle: string) => {
    setEditingStep({ id: stepId, title: currentTitle });
  };

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
        <AddStepDialog onSubmit={createStep} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 pt-1 overflow-auto">
      {/* Progress indicator */}
      {complexity === "complex" && totalSteps > 0 && (
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
            ? "Hide concluded steps"
            : `${completedSteps.length} ${completedSteps.length === 1 ? "step concluded" : "steps concluded"}`}
        </button>
      )}
      {showAllStepsConcluded &&
        completedSteps.map((step) => (
          <div
            key={step.id}
            className="flex flex-col p-2 rounded-md bg-muted/40 border-2 border-border/30  opacity-80 transition-opacity duration-300  "
          >
            <div className="flex items-center gap-2">
              <Checkbox
                id={`step-${step.id}`}
                checked
                onCheckedChange={() => toggleStep(step.id, false)}
                className="flex items-center gap-2 shrink-0"
                aria-label={`Unmark: ${step.title}`}
              />
              <span className="text-xs line-through text-muted-foreground flex-1 min-w-0">
                {step.title}
              </span>
            </div>
            <div className="flex flex-row justify-end items-center gap-0.5 pl-6">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => startEditingStep(step.id, step.title)}
                    className="p-1.5 shrink-0 text-muted-foreground/50 hover:text-foreground transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring rounded"
                    aria-label={`Edit step: ${step.title}`}
                  >
                    <Pencil className="size-3 text-muted-foreground" />
                  </button>
                </TooltipTrigger>
                {helpers === "show" && (
                  <TooltipContent>
                    <p>Edit step</p>
                  </TooltipContent>
                )}
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => setDeletingStepId(step.id)}
                    className="p-1.5 shrink-0 text-muted-foreground/50 hover:text-destructive transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring rounded"
                    aria-label={`Remove step: ${step.title}`}
                  >
                    <Trash2 className="size-3 text-muted-foreground" />
                  </button>
                </TooltipTrigger>
                {helpers === "show" && (
                  <TooltipContent>
                    <p>Remove step</p>
                  </TooltipContent>
                )}
              </Tooltip>
            </div>
          </div>
        ))}

      {/* Current prominent step */}
      {currentStep && (
        <div
          className={cn(
            "flex flex-col gap-0.5 p-2 rounded-md bg-muted/40 border-2 border-black/40 transition-all duration-300",
            animatingId === currentStep.id &&
              "animate-in fade-in slide-in-from-bottom-1",
          )}
        >
          <div className="flex items-center gap-2">
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
              className="text-sm font-medium flex-1 min-w-0 cursor-pointer py-2"
            >
              {currentStep.title}
            </label>
          </div>
          <div className="flex flex-row justify-end items-center gap-0.5 pl-6">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() =>
                    startEditingStep(currentStep.id, currentStep.title)
                  }
                  className="p-1.5 shrink-0 text-muted-foreground/50 hover:text-foreground transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring rounded"
                  aria-label={`Edit step: ${currentStep.title}`}
                >
                  <Pencil className="size-3" />
                </button>
              </TooltipTrigger>
              {helpers === "show" && (
                <TooltipContent>
                  <p>Edit step</p>
                </TooltipContent>
              )}
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setDeletingStepId(currentStep.id)}
                  className="p-1.5 shrink-0 text-muted-foreground/50 hover:text-destructive transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring rounded"
                  aria-label={`Remove step: ${currentStep.title}`}
                >
                  <Trash2 className="size-3" />
                </button>
              </TooltipTrigger>
              {helpers === "show" && (
                <TooltipContent>
                  <p>Remove step</p>
                </TooltipContent>
              )}
            </Tooltip>
          </div>
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
              ? "Hide pending steps "
              : `${remainingCount} more ${remainingCount === 1 ? "step pending" : "steps pending"}`}
          </button>

          {showAll && (
            <div className="flex flex-col gap-2">
              {upcomingSteps.map((step) => (
                <div
                  key={step.id}
                  className="flex flex-col p-2 rounded-md bg-muted/40 border border-border/30 opacity-80 transition-opacity duration-300  "
                >
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id={`step-upcoming-${step.id}`}
                      checked={false}
                      onCheckedChange={() => toggleStep(step.id, true)}
                      className="shrink-0"
                      aria-label={`Complete: ${step.title}`}
                    />
                    <label
                      htmlFor={`step-upcoming-${step.id}`}
                      className="text-xs flex-1 min-w-0 cursor-pointer text-muted-foreground"
                    >
                      {step.title}
                    </label>
                  </div>
                  <div className="flex flex-row justify-end items-center gap-0.5 pl-6">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => startEditingStep(step.id, step.title)}
                          className="p-1.5 shrink-0 text-muted-foreground/50 hover:text-foreground transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring rounded"
                          aria-label={`Edit step: ${step.title}`}
                        >
                          <Pencil className="size-3 text-muted-foreground" />
                        </button>
                      </TooltipTrigger>
                      {helpers === "show" && (
                        <TooltipContent>
                          <p>Edit step</p>
                        </TooltipContent>
                      )}
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => setDeletingStepId(step.id)}
                          className="p-1.5 shrink-0 text-muted-foreground/50 hover:text-destructive transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring rounded"
                          aria-label={`Remove step: ${step.title}`}
                        >
                          <Trash2 className="size-3 text-muted-foreground" />
                        </button>
                      </TooltipTrigger>
                      {helpers === "show" && (
                        <TooltipContent>
                          <p>Remove step</p>
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Add step dialog */}
      <AddStepDialog onSubmit={createStep} />

      {/* Edit step dialog */}
      <EditStepDialog
        step={editingStep}
        onSave={updateStep}
        onClose={() => setEditingStep(null)}
      />

      {/* Delete step confirmation */}
      <ConfirmDeleteDialog
        open={deletingStepId !== null}
        title="Excluir etapa?"
        description="Esta etapa será removida permanentemente. Esta ação não pode ser desfeita."
        onConfirm={() => {
          if (deletingStepId) deleteStep(deletingStepId);
          setDeletingStepId(null);
        }}
        onCancel={() => setDeletingStepId(null)}
      />
    </div>
  );
}
