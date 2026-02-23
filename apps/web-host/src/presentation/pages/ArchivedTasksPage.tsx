import { useNavigate } from "react-router-dom";
import { ArchiveRestore, ChevronLeft, Inbox } from "lucide-react";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui";
import { cn } from "@repo/ui";
import { useArchivedTasks } from "@/presentation/hooks/useArchivedTasks";
import {
  TASK_STATUS_LABELS,
  RESTORABLE_STATUSES,
  type RestorableStatus,
} from "@/domain/valueObjects/TaskStatus";
import { Logo } from "../components/Logo";

function ArchivedTaskItem({
  task,
  onRestore,
}: {
  task: {
    id: string;
    title: string;
    routineId: string;
    statusUpdatedAt: string;
  };
  onRestore: (id: string, status: RestorableStatus) => void;
}) {
  const archivedAt = new Date(task.statusUpdatedAt).toLocaleDateString(
    undefined,
    { year: "numeric", month: "short", day: "numeric" },
  );

  return (
    <article
      className={cn(
        "flex items-center justify-between gap-3 rounded-lg border border-border/50 bg-card px-4 py-3",
        "transition-colors duration-150",
      )}
      aria-label={`Archived task: ${task.title}`}
    >
      <div className="flex flex-col gap-0.5 min-w-0">
        <p className="text-sm font-medium truncate">{task.title}</p>
        <span className="text-xs text-muted-foreground">
          Archived on {archivedAt}
        </span>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger
          className="shrink-0 inline-flex items-center gap-1.5 h-7 px-2 text-xs font-medium rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label={`Restore task: ${task.title}`}
        >
          <ArchiveRestore className="size-3" />
          Restore
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          {RESTORABLE_STATUSES.map((status) => (
            <DropdownMenuItem
              key={status}
              className="gap-2 cursor-pointer text-xs focus-visible:ring-2 focus-visible:ring-ring"
              onSelect={() => {
                onRestore(task.id, status as RestorableStatus);
              }}
            >
              {TASK_STATUS_LABELS[status]}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </article>
  );
}

export default function ArchivedTasksPage() {
  const navigate = useNavigate();
  const { archivedTasks, isLoading, restoreTask } = useArchivedTasks();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border/50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              aria-label="Voltar"
            >
              <ChevronLeft className="size-5" />
            </Button>
            <div>
              <h1 className="text-lg font-semibold tracking-tight">
                Archived Tasks
              </h1>
            </div>
          </div>
          <Logo />
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8">
        {isLoading ? (
          <div
            className="flex flex-col gap-3"
            role="status"
            aria-label="Loading archived tasks"
          >
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-16 rounded-lg bg-muted/30 animate-pulse"
              />
            ))}
          </div>
        ) : archivedTasks.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-20 text-center">
            <Inbox className="size-10 text-muted-foreground/40" aria-hidden />
            <p className="text-sm text-muted-foreground">
              No archived tasks yet.
            </p>
            <p className="text-xs text-muted-foreground/70">
              Archive a task from the board to keep it out of sight without
              deleting it.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <p className="text-xs text-muted-foreground mb-1">
              {archivedTasks.length}{" "}
              {archivedTasks.length === 1 ? "task" : "tasks"} archived. Select a
              status to restore any task back to the board.
            </p>
            {archivedTasks.map((task) => (
              <ArchivedTaskItem
                key={task.id}
                task={task}
                onRestore={restoreTask}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
