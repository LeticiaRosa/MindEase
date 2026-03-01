import { ScrollView, View, StyleSheet, RefreshControl } from "react-native";
import { useAuth } from "@/presentation/hooks/useAuth";
import { useTasks } from "@/presentation/hooks/useTasks";
import { useRoutines } from "@/presentation/hooks/useRoutines";
import { useAlertEngine } from "@/presentation/hooks/useAlertEngine";
import { DashboardHeader } from "@/presentation/components/DashboardHeader";
import { BrainTodayBottomSheet } from "@/presentation/components/BrainTodayBottomSheet";
import { ActiveRoutineStrip } from "@/presentation/components/ActiveRoutineStrip";
import { TaskStatusSection } from "@/presentation/components/TaskStatusSection";
import { TaskStatus } from "@/domain/valueObjects/TaskStatus";
import { colors, spacing } from "@repo/ui/theme";

export default function DashboardScreen() {
  const { user } = useAuth();
  const {
    data: tasks = [],
    isLoading: tasksLoading,
    refetch: refetchTasks,
  } = useTasks();
  const { data: routines = [], refetch: refetchRoutines } = useRoutines();
  const { bannerActive, bannerMessage, dismissBanner } = useAlertEngine();

  const activeRoutine = routines.find((r) => r.isActive) ?? null;

  const todoTasks = tasks.filter((t) => t.status === TaskStatus.TODO);
  const inProgressTasks = tasks.filter(
    (t) => t.status === TaskStatus.IN_PROGRESS,
  );
  const doneTasks = tasks.filter((t) => t.status === TaskStatus.DONE);

  async function onRefresh() {
    await Promise.all([refetchTasks(), refetchRoutines()]);
  }

  return (
    <View style={styles.root}>
      {user && (
        <DashboardHeader
          user={user}
          alertMessage={bannerActive ? bannerMessage : undefined}
          onDismissAlert={dismissBanner}
        />
      )}

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={tasksLoading}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      >
        {activeRoutine && <ActiveRoutineStrip routine={activeRoutine} />}

        {/* Task sections in order: A fazer → Em andamento → Concluído */}
        <TaskStatusSection title="A fazer" tasks={todoTasks} />
        <TaskStatusSection title="Em andamento" tasks={inProgressTasks} />
        <TaskStatusSection title="Concluído" tasks={doneTasks} />
      </ScrollView>

      <BrainTodayBottomSheet onDismiss={() => {}} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing["3xl"],
  },
});
