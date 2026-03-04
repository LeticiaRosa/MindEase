import { useState } from "react";
import { ScrollView, View, RefreshControl } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/presentation/hooks/useAuth";
import { useTaskKanban } from "@/presentation/hooks/useTaskKanban";
import { useRoutines } from "@/presentation/hooks/useRoutines";
import { useAlertEngine } from "@/presentation/hooks/useAlertEngine";
import { useActiveRoutine } from "@/presentation/contexts/ActiveRoutineContext";
import { useTheme } from "@/presentation/contexts/ThemePreferencesContext";
import { DashboardHeader } from "@/presentation/components/DashboardHeader";
import { BrainTodayBottomSheet } from "@/presentation/components/BrainTodayBottomSheet";
import { RoutineSelector } from "@/presentation/components/RoutineSelector";
import { TaskGroup } from "@/presentation/components/TaskGroup";
import { TaskEditForm } from "@/presentation/components/TaskEditForm";
import { CognitiveAlertModal } from "@/presentation/components/CognitiveAlertModal";
import { FocusTimerFocus } from "@/presentation/components/FocusTimerFocus";
import type { Task } from "@/domain/entities/Task";
import { TaskStatus } from "@/domain/valueObjects/TaskStatus";

const STATUS_ADVANCE: Record<string, string> = {
  todo: "in_progress",
  in_progress: "done",
};
const STATUS_REGRESS: Record<string, string> = {
  in_progress: "todo",
  done: "in_progress",
};

export default function DashboardScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { routines, isLoading: routinesLoading } = useRoutines();
  const { activeRoutineId, setActiveRoutineId } = useActiveRoutine();
  const { resolvedColors, resolvedSpacing } = useTheme();

  // Default to first routine if none selected
  const effectiveRoutineId = activeRoutineId ?? routines[0]?.id ?? "";

  const {
    tasks,
    isLoading: tasksLoading,
    tasksByStatus,
    createTask,
    updateTask,
    updateTaskStatus,
    deleteTask,
    archiveTask,
  } = useTaskKanban(effectiveRoutineId);

  const {
    bannerActive,
    bannerMessage,
    modalPayload,
    dismissBanner,
    dismissModal,
  } = useAlertEngine();

  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [focusTaskId, setFocusTaskId] = useState<string | null>(null);

  const focusedTask = focusTaskId
    ? (tasks.find((t) => t.id === focusTaskId) ?? null)
    : null;

  const todoTasks = tasksByStatus("todo");
  const inProgressTasks = tasksByStatus("in_progress");
  const doneTasks = tasksByStatus("done");

  const handleSwipeRight = (task: Task) => {
    const next = STATUS_ADVANCE[task.status];
    if (next) updateTaskStatus({ id: task.id, status: next as Task["status"] });
  };

  const handleSwipeLeft = (task: Task) => {
    const prev = STATUS_REGRESS[task.status];
    if (prev) updateTaskStatus({ id: task.id, status: prev as Task["status"] });
  };

  return (
    <View style={{ flex: 1, backgroundColor: resolvedColors.background }}>
      {user && (
        <DashboardHeader
          user={user}
          alertMessage={bannerActive ? bannerMessage : undefined}
          onDismissAlert={dismissBanner}
        />
      )}

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          padding: resolvedSpacing.lg,
          paddingBottom: resolvedSpacing["3xl"],
        }}
        refreshControl={
          <RefreshControl
            refreshing={tasksLoading}
            onRefresh={() => {}}
            tintColor={resolvedColors.primary}
          />
        }
      >
        {/* Routine selector */}
        {routines.length > 0 && (
          <View style={{ marginBottom: resolvedSpacing.xl }}>
            <RoutineSelector
              routines={routines}
              activeRoutineId={effectiveRoutineId}
              onSelect={setActiveRoutineId}
              onManage={() => router.push("/(app)/manage-routines")}
            />
          </View>
        )}

        {/* Kanban columns */}
        <TaskGroup
          title="A fazer"
          tasks={todoTasks}
          showCreate
          onCreateTask={createTask}
          onPressTask={setEditingTask}
          onSwipeRight={handleSwipeRight}
          onLongPress={setEditingTask}
          onExpandFocus={(task) => setFocusTaskId(task.id)}
          emptyMessage="Nenhuma tarefa pendente"
        />
        <TaskGroup
          title="Em andamento"
          tasks={inProgressTasks}
          onPressTask={setEditingTask}
          onSwipeRight={handleSwipeRight}
          onSwipeLeft={handleSwipeLeft}
          onLongPress={setEditingTask}
          onExpandFocus={(task) => setFocusTaskId(task.id)}
          emptyMessage="Nenhuma tarefa em andamento"
        />
        <TaskGroup
          title="Concluído"
          tasks={doneTasks}
          onPressTask={setEditingTask}
          onSwipeLeft={handleSwipeLeft}
          onLongPress={setEditingTask}
          onExpandFocus={(task) => setFocusTaskId(task.id)}
          emptyMessage="Nenhuma tarefa concluída"
        />
      </ScrollView>

      {/* Brain Today check-in */}
      <BrainTodayBottomSheet />

      {/* Task edit modal */}
      {editingTask && (
        <TaskEditForm
          task={editingTask}
          visible
          onClose={() => setEditingTask(null)}
          onSave={updateTask}
          onDelete={deleteTask}
          onArchive={archiveTask}
        />
      )}

      {/* Alert modal */}
      {modalPayload && (
        <CognitiveAlertModal payload={modalPayload} onDismiss={dismissModal} />
      )}

      {/* Focus mode overlay */}
      {focusTaskId && (
        <FocusTimerFocus
          taskId={focusTaskId}
          taskTitle={focusedTask?.title ?? ""}
          visible
          onClose={() => setFocusTaskId(null)}
        />
      )}
    </View>
  );
}
