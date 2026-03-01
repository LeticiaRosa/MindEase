import { View, Text, StyleSheet } from "react-native";
import type { Task } from "@/domain/entities/Task";
import { colors, fontSizes, spacing, borderRadius } from "@repo/ui/theme";

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  const steps = task.checklistSteps ?? [];
  const completedSteps = steps.filter((s) => s.completed).length;
  const hasSteps = steps.length > 0;

  return (
    <View style={styles.card}>
      <Text style={styles.title} numberOfLines={2}>
        {task.title}
      </Text>
      {hasSteps && (
        <Text style={styles.steps}>
          {completedSteps}/{steps.length} etapas
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: fontSizes.base,
    color: colors.textPrimary,
    fontWeight: "500",
  },
  steps: {
    fontSize: fontSizes.sm,
    color: colors.mutedForeground,
    marginTop: spacing.xs,
  },
});
