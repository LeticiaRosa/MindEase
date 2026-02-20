import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { cn } from "@repo/ui";
import type { Task } from "@/domain/entities/Task";
import type { TaskStatus } from "@/domain/valueObjects/TaskStatus";
import { TASK_STATUS_LABELS } from "@/domain/valueObjects/TaskStatus";
import { TaskCard } from "@/presentation/components/TaskCard";
import { TaskCreateForm } from "@/presentation/components/TaskCreateForm";

interface KanbanColumnProps {
  status: TaskStatus;
  tasks: Task[];
  onCreateTask: (title: string) => void;
  onDeleteTask: (id: string) => void;
}

const COLUMN_STYLES: Record<TaskStatus, string> = {
  todo: "border-t-2 border-t-muted-foreground/30",
  in_progress: "border-t-2 border-t-primary/50",
  done: "border-t-2 border-t-green-500/50",
};

export function KanbanColumn({
  status,
  tasks,
  onCreateTask,
  onDeleteTask,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <section
      aria-label={`${TASK_STATUS_LABELS[status]} column`}
      className={cn(
        "flex flex-col w-72 shrink-0 rounded-xl bg-muted/20 border border-border/50",
        COLUMN_STYLES[status],
        "transition-colors duration-200",
        isOver && "bg-muted/40 border-primary/30",
      )}
    >
      {/* Column header */}
      <header className="flex items-center justify-between px-4 py-3">
        <h2 className="text-sm font-semibold text-foreground">
          {TASK_STATUS_LABELS[status]}
        </h2>
        <span
          className="text-xs text-muted-foreground tabular-nums bg-muted px-1.5 py-0.5 rounded-full"
          aria-label={`${tasks.length} tasks`}
        >
          {tasks.length}
        </span>
      </header>

      {/* Task list */}
      <div
        ref={setNodeRef}
        className="flex flex-col gap-2 px-3 min-h-24 flex-1"
      >
        <SortableContext
          items={tasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.length === 0 ? (
            <p className="text-xs text-muted-foreground/60 italic text-center py-4">
              {status === "todo" ? "No tasks yet" : "Nothing here yet"}
            </p>
          ) : (
            tasks.map((task) => (
              <TaskCard key={task.id} task={task} onDelete={onDeleteTask} />
            ))
          )}
        </SortableContext>
      </div>

      {/* Create task (only in TODO column) */}
      {status === "todo" && (
        <div className="px-3 pb-3 pt-1">
          <TaskCreateForm onSubmit={onCreateTask} />
        </div>
      )}
    </section>
  );
}
