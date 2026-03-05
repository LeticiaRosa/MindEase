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
import { CognitiveAlertModal } from "@/presentation/components/CognitiveAlertModal";
import type { Task } from "@/domain/entities/Task";
import { TaskStatus } from "@/domain/valueObjects/TaskStatus";

export default function DashboardScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { routines, isLoading: routinesLoading } = useRoutines();
  const { activeRoutineId, setActiveRoutineId } = useActiveRoutine();
  const { resolvedColors, resolvedSpacing } = useTheme();

  // Default to first routine if none selected
  const effectiveRoutineId = activeRoutineId ?? routines[0]?.id ?? "";

  const {
    tasks: _tasks,
    isLoading: tasksLoading,
    tasksByStatus,
    createTask,
    updateTask,
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

  const todoTasks = tasksByStatus("todo");
  const inProgressTasks = tasksByStatus("in_progress");
  const doneTasks = tasksByStatus("done");

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
          onDeleteTask={deleteTask}
          onArchiveTask={archiveTask}
          onUpdateTask={updateTask}
          emptyMessage="Nenhuma tarefa pendente"
        />
        <TaskGroup
          title="Em andamento"
          tasks={inProgressTasks}
          onDeleteTask={deleteTask}
          onArchiveTask={archiveTask}
          onUpdateTask={updateTask}
          emptyMessage="Nenhuma tarefa em andamento"
        />
        <TaskGroup
          title="Concluído"
          tasks={doneTasks}
          onDeleteTask={deleteTask}
          onArchiveTask={archiveTask}
          onUpdateTask={updateTask}
          emptyMessage="Nenhuma tarefa concluída"
        />
      </ScrollView>

      {/* Brain Today check-in */}
      <BrainTodayBottomSheet />

      {/* Alert modal */}
      {modalPayload && (
        <CognitiveAlertModal payload={modalPayload} onDismiss={dismissModal} />
      )}
    </View>
  );
}
