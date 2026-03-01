import { View, Text, StyleSheet } from "react-native";
import type { Task } from "@/domain/entities/Task";
import { TaskCard } from "./TaskCard";
import { colors, fontSizes, spacing } from "@repo/ui/theme";

interface TaskStatusSectionProps {
  title: string;
  tasks: Task[];
  emptyMessage?: string;
}

export function TaskStatusSection({
  title,
  tasks,
  emptyMessage = "Nenhuma tarefa aqui ainda",
}: TaskStatusSectionProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.count}>{tasks.length}</Text>
      </View>

      {tasks.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>{emptyMessage}</Text>
        </View>
      ) : (
        tasks.map((task) => <TaskCard key={task.id} task={task} />)
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.xl,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: fontSizes.lg,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  count: {
    fontSize: fontSizes.sm,
    color: colors.mutedForeground,
    backgroundColor: colors.muted,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 999,
  },
  emptyState: {
    padding: spacing.md,
    backgroundColor: colors.muted,
    borderRadius: 8,
    alignItems: "center",
  },
  emptyText: {
    fontSize: fontSizes.sm,
    color: colors.mutedForeground,
  },
});
