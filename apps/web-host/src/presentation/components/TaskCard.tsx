import { useState, useEffect } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Trash2,
  ChevronDown,
  ChevronUp,
  Timer,
  Move,
  Archive,
  Pencil,
} from "lucide-react";
import { Button, Tooltip, TooltipTrigger, TooltipContent } from "@repo/ui";
import { cn } from "@repo/ui";
import type { Task } from "@/domain/entities/Task";
import { SmartChecklist } from "@/presentation/components/SmartChecklist";
import { FocusTimer } from "@/presentation/components/FocusTimer";
import { useTimerContext } from "@/presentation/contexts/TimerContext";
import { FocusTimerFocus } from "./FocusTimerFocus";
import { useThemePreferences } from "../contexts/ThemePreferencesContext";
import { TaskEditForm } from "./TaskEditForm";
import type { UpdateTaskParams } from "@/application/useCases/UpdateTask";

interface TaskCardProps {
  task: Task;
  onDelete: (id: string) => void;
  onArchive?: (id: string) => void;
  onUpdate?: (id: string, params: UpdateTaskParams) => void;
}

export function TaskCard({
  task,
  onDelete,
  onArchive,
  onUpdate,
}: TaskCardProps) {
  const { mode, helpers, complexity } = useThemePreferences();
  const [checklistOpen, setChecklistOpen] = useState(mode === "detail");
  const [timerOpen, setTimerOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  useEffect(() => {
    setChecklistOpen(mode === "detail");
  }, [mode]);
  const [timerFocusOpen, setTimerFocusOpen] = useState(false);
  const { state: timerState } = useTimerContext();
  const taskTimer = timerState.timers[task.id];
  const isTimerActive = taskTimer?.status === "running";

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

  const toLocaleRelativeTime = () => {
    const now = new Date();
    const updatedAt = new Date(task.statusUpdatedAt);
    const diffMs = now.getTime() - updatedAt.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? "s" : ""} ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24)
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  };

  const formatTimeSpent = (seconds: number) => {
    if (seconds === 0) return null;
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
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
      <div className="flex justify-end items-center">
        {/* Date in Status */}
        {task.totalTimeSpent > 0 && (
          <span
            className="mx-2 shrink-0 px-2 py-0.5 text-xs font-medium rounded-full bg-primary/10 text-primary border border-primary/20"
            aria-label={`Total time spent: ${formatTimeSpent(task.totalTimeSpent)}`}
          >
            {formatTimeSpent(task.totalTimeSpent)}
          </span>
        )}

        {/* Focus indicator */}
        {isTimerActive && (
          <span
            className="shrink-0 size-2 rounded-full bg-primary animate-pulse mx-2"
            aria-label="Timer active"
            role="status"
          />
        )}

        {onUpdate && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="shrink-0 size-7 text-muted-foreground/50 hover:text-foreground transition-colors focus-visible:ring-2 focus-visible:ring-ring"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  setEditDialogOpen(true);
                }}
                aria-label={`Edit task: ${task.title}`}
              >
                <Pencil className="size-3" />
              </Button>
            </TooltipTrigger>
            {helpers === "show" && (
              <TooltipContent>
                <p>Edit task</p>
              </TooltipContent>
            )}
          </Tooltip>
        )}

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className="shrink-0 size-7 text-muted-foreground/50 hover:text-destructive transition-colors focus-visible:ring-2 focus-visible:ring-ring "
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                onDelete(task.id);
              }}
              aria-label={`Delete task: ${task.title}`}
            >
              <Trash2 className="size-3" />
            </Button>
          </TooltipTrigger>
          {helpers === "show" && (
            <TooltipContent>
              <p>Delete task</p>
            </TooltipContent>
          )}
        </Tooltip>

        {onArchive && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="shrink-0 size-7 text-muted-foreground/50 hover:text-muted-foreground transition-colors focus-visible:ring-2 focus-visible:ring-ring"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  onArchive(task.id);
                }}
                aria-label={`Archive task: ${task.title}`}
              >
                <Archive className="size-3" />
              </Button>
            </TooltipTrigger>
            {helpers === "show" && (
              <TooltipContent>
                <p>Archive task</p>
              </TooltipContent>
            )}
          </Tooltip>
        )}
      </div>
      {/* Drag handle + title row */}
      <div className="flex items-center gap-2">
        {/* Drag handle */}
        <span
          {...listeners}
          {...attributes}
          className="flex w-full items-center gap-2 cursor-grab active:cursor-grabbing focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring rounded"
          aria-label="Drag to reorder"
          tabIndex={0}
          id="dnd"
        >
          {/* Title */}
          <div>
            <div className="flex items-center justify-start gap-2">
              <Move
                className="size-3 text-muted-foreground"
                aria-hidden="true"
              />
              <p className="flex-1 text-sm font-medium min-w-0 wrap-break-word">
                {task.title}
              </p>
            </div>
            {/* Total time spent badge */}
            {complexity === "complex" && task.statusUpdatedAt && (
              <span
                className="flex justify-end text-xs text-muted-foreground shrink-0 font-light py-2"
                aria-label={`Status updated at ${new Date(
                  task.statusUpdatedAt,
                ).toLocaleString()}`}
              >
                Created {toLocaleRelativeTime()}
              </span>
            )}
          </div>
        </span>
      </div>

      {/* Action row */}
      <div className="flex items-center mt-2">
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

        <Button
          size="sm"
          variant="ghost"
          className={cn(
            "h-6 px-4 text-xs text-muted-foreground hover:text-foreground gap-1 focus-visible:ring-2 focus-visible:ring-ring",
            isTimerActive && "text-primary",
          )}
          onClick={() => setTimerFocusOpen((v) => !v)}
          aria-expanded={timerFocusOpen}
          aria-label={timerFocusOpen ? "Hide focus timer" : "Show focus timer"}
        >
          <Timer className="size-3" />
          Focus
        </Button>

        <div className="flex-1" />
      </div>

      {/* Timer (collapsible) */}
      {timerOpen && (
        <div className="mt-2 animate-in fade-in slide-in-from-top-1 duration-200">
          <FocusTimer taskId={task.id} />
        </div>
      )}

      {/* Focus Timer (collapsible) */}
      {timerFocusOpen && (
        <FocusTimerFocus
          taskId={task.id}
          taskTitle={task.title}
          onClose={() => setTimerFocusOpen(false)}
        />
      )}

      {/* Checklist (collapsible) */}

      {checklistOpen && (
        <div className="mt-2 animate-in fade-in slide-in-from-top-1 duration-200">
          <SmartChecklist taskId={task.id} />
        </div>
      )}

      {/* Edit Dialog */}
      {onUpdate && (
        <TaskEditForm
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          taskId={task.id}
          initialTitle={task.title}
          initialDescription={task.description}
          onSubmit={onUpdate}
        />
      )}
    </article>
  );
}
