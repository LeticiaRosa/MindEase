import { ScrollView, View, Text, StyleSheet } from "react-native";
import type { Routine } from "@/domain/entities/Routine";
import { colors, fontSizes, spacing, borderRadius } from "@repo/ui/theme";

interface ActiveRoutineStripProps {
  routine: Routine;
}

export function ActiveRoutineStrip({ routine }: ActiveRoutineStripProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{routine.name}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {routine.steps.map((step, index) => (
          <View
            key={step.id}
            style={[styles.step, step.completed && styles.stepCompleted]}
          >
            <Text
              style={[
                styles.stepIndex,
                step.completed && styles.stepIndexCompleted,
              ]}
            >
              {index + 1}
            </Text>
            <Text
              style={[
                styles.stepTitle,
                step.completed && styles.stepTitleCompleted,
              ]}
              numberOfLines={2}
            >
              {step.title}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.xl,
  },
  label: {
    fontSize: fontSizes.sm,
    fontWeight: "600",
    color: colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
  },
  scrollContent: {
    paddingRight: spacing.md,
    gap: spacing.sm,
  },
  step: {
    width: 100,
    padding: spacing.sm,
    backgroundColor: colors.muted,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  stepCompleted: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  stepIndex: {
    fontSize: fontSizes.xs,
    color: colors.mutedForeground,
    fontWeight: "700",
    marginBottom: 4,
  },
  stepIndexCompleted: {
    color: colors.primaryForeground,
  },
  stepTitle: {
    fontSize: fontSizes.sm,
    color: colors.textPrimary,
  },
  stepTitleCompleted: {
    color: colors.primaryForeground,
  },
});
