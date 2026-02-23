import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCorners,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates, arrayMove } from "@dnd-kit/sortable";
import type { Task } from "@/domain/entities/Task";
import type { TaskStatus } from "@/domain/valueObjects/TaskStatus";
import { TaskStatus as TS } from "@/domain/valueObjects/TaskStatus";
import { KanbanColumn } from "@/presentation/components/KanbanColumn";
import { TaskCard } from "@/presentation/components/TaskCard";
import { useTaskKanban } from "@/presentation/hooks/useTaskKanban";
import { useActivitySignals } from "@/presentation/contexts/ActivitySignalsContext";
import { useActiveRoutine } from "@/presentation/contexts/ActiveRoutineContext";

const COLUMNS: TaskStatus[] = [TS.TODO, TS.IN_PROGRESS, TS.DONE];

export function KanbanBoard() {
  const { activeRoutineId } = useActiveRoutine();
  const {
    tasks,
    isLoading,
    tasksByStatus,
    createTask,
    reorderTasks,
    deleteTask,
    archiveTask,
  } = useTaskKanban(activeRoutineId ?? "");
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const { recordTaskSwitch, setCurrentTask } = useActivitySignals();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find((t) => t.id === event.active.id);
    setActiveTask(task ?? null);
  };

  const handleDragOver = () => {
    // Visual feedback handled by droppable `isOver` state in KanbanColumn
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeTask = tasks.find((t) => t.id === activeId);
    if (!activeTask) return;

    // Dropped on a column?
    const targetStatus = COLUMNS.includes(overId as TaskStatus)
      ? (overId as TaskStatus)
      : (tasks.find((t) => t.id === overId)?.status ?? activeTask.status);

    const columnTasks = tasks
      .filter((t) => t.status === targetStatus)
      .sort((a, b) => a.position - b.position);

    let reordered: Task[];

    if (activeTask.status !== targetStatus) {
      // Moving to a different column — record task switch signal
      recordTaskSwitch();
      setCurrentTask({ startedAt: Date.now(), isComplex: false });
      // append at end
      reordered = [
        ...columnTasks.filter((t) => t.id !== activeId),
        { ...activeTask, status: targetStatus },
      ];
    } else {
      // Sorting within the same column
      const oldIndex = columnTasks.findIndex((t) => t.id === activeId);
      const newIndex = columnTasks.findIndex((t) => t.id === overId);
      if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return;
      reordered = arrayMove(columnTasks, oldIndex, newIndex);
    }

    const updates = reordered.map((t, i) => {
      const original = tasks.find((task) => task.id === t.id);
      return {
        id: t.id,
        position: i,
        status: targetStatus,
        previousStatus: original?.status ?? targetStatus,
      };
    });

    reorderTasks(updates);
  };

  if (isLoading) {
    return (
      <div
        className="flex gap-6 overflow-x-auto pb-4"
        role="status"
        aria-label="Loading tasks"
      >
        {COLUMNS.map((col) => (
          <div
            key={col}
            className="w-72 shrink-0 h-48 rounded-xl bg-muted/20 border border-border/50 animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div
        className="flex gap-6 overflow-x-auto pb-4 min-h-[60vh]"
        role="region"
        aria-label="Task board"
      >
        {COLUMNS.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            tasks={tasksByStatus(status)}
            onCreateTask={createTask}
            onDeleteTask={deleteTask}
            onArchiveTask={archiveTask}
          />
        ))}
      </div>

      {/* Drag overlay — translucent preview */}
      <DragOverlay>
        {activeTask ? (
          <div className="opacity-80 scale-105 shadow-xl rotate-1">
            <TaskCard
              task={activeTask}
              onDelete={() => {}}
              onArchive={undefined}
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
