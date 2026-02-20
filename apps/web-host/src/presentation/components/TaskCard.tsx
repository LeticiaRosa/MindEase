import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Trash2, ChevronDown, ChevronUp, Timer } from "lucide-react";
import { Button } from "@repo/ui";
import { cn } from "@repo/ui";
import type { Task } from "@/domain/entities/Task";
import { SmartChecklist } from "@/presentation/components/SmartChecklist";
import { FocusTimer } from "@/presentation/components/FocusTimer";
import { useTimerContext } from "@/presentation/contexts/TimerContext";

interface TaskCardProps {
  task: Task;
  onDelete: (id: string) => void;
}

export function TaskCard({ task, onDelete }: TaskCardProps) {
  const [checklistOpen, setChecklistOpen] = useState(false);
  const [timerOpen, setTimerOpen] = useState(false);
  const { state: timerState } = useTimerContext();
  const isTimerActive =
    timerState.activeTaskId === task.id && timerState.status === "running";

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition: transition ?? "transform 200ms ease-in-out",
  };

  return (
    <article
      ref={setNodeRef}
      style={style}
      className={cn(
        "group relative bg-card border border-border rounded-lg p-3 shadow-xs",
        "transition-all duration-200 ease-in-out",
        "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-1",
        isDragging && "opacity-50 scale-95 shadow-lg ring-2 ring-primary/30",
      )}
      aria-label={`Task: ${task.title}`}
    >
      {/* Drag handle + title row */}
      <div className="flex items-start gap-2">
        {/* Drag handle */}
        <button
          {...listeners}
          {...attributes}
          className="shrink-0 mt-0.5 cursor-grab active:cursor-grabbing text-muted-foreground/40 hover:text-muted-foreground transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring rounded"
          aria-label="Drag to reorder"
          tabIndex={0}
        >
          <svg
            className="size-4"
            fill="currentColor"
            viewBox="0 0 16 16"
            aria-hidden="true"
          >
            <circle cx="5" cy="5" r="1.2" />
            <circle cx="11" cy="5" r="1.2" />
            <circle cx="5" cy="8" r="1.2" />
            <circle cx="11" cy="8" r="1.2" />
            <circle cx="5" cy="11" r="1.2" />
            <circle cx="11" cy="11" r="1.2" />
          </svg>
        </button>

        {/* Title */}
        <p className="flex-1 text-sm font-medium min-w-0 break-words">
          {task.title}
        </p>

        {/* Focus indicator */}
        {isTimerActive && (
          <span
            className="shrink-0 size-2 rounded-full bg-primary animate-pulse mt-1.5"
            aria-label="Timer active"
            role="status"
          />
        )}
      </div>

      {/* Action row */}
      <div className="flex items-center gap-1 mt-2">
        <Button
          size="sm"
          variant="ghost"
          className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground gap-1 focus-visible:ring-2 focus-visible:ring-ring"
          onClick={() => setChecklistOpen((v) => !v)}
          aria-expanded={checklistOpen}
          aria-label={checklistOpen ? "Hide checklist" : "Show checklist"}
        >
          {checklistOpen ? (
            <ChevronUp className="size-3" />
          ) : (
            <ChevronDown className="size-3" />
          )}
          Steps
        </Button>

        <Button
          size="sm"
          variant="ghost"
          className={cn(
            "h-6 px-2 text-xs text-muted-foreground hover:text-foreground gap-1 focus-visible:ring-2 focus-visible:ring-ring",
            isTimerActive && "text-primary",
          )}
          onClick={() => setTimerOpen((v) => !v)}
          aria-expanded={timerOpen}
          aria-label={timerOpen ? "Hide timer" : "Show timer"}
        >
          <Timer className="size-3" />
          Timer
        </Button>

        <div className="flex-1" />

        <Button
          size="icon"
          variant="ghost"
          className="size-6 text-muted-foreground/50 hover:text-destructive transition-colors focus-visible:ring-2 focus-visible:ring-ring"
          onClick={() => onDelete(task.id)}
          aria-label={`Delete task: ${task.title}`}
        >
          <Trash2 className="size-3" />
        </Button>
      </div>

      {/* Timer (collapsible) */}
      {timerOpen && (
        <div className="mt-2 animate-in fade-in slide-in-from-top-1 duration-200">
          <FocusTimer taskId={task.id} />
        </div>
      )}

      {/* Checklist (collapsible) */}
      {checklistOpen && (
        <div className="mt-2 animate-in fade-in slide-in-from-top-1 duration-200">
          <SmartChecklist taskId={task.id} />
        </div>
      )}
    </article>
  );
}
