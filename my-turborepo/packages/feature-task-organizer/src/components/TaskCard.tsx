import { StyleSheet, Text, View, Pressable } from "react-native";
import type { Task } from "../types";

interface TaskCardProps {
  task: Task;
  onToggleStep: (stepIndex: number) => void;
}

export function TaskCard({ task, onToggleStep }: TaskCardProps) {
  const progress =
    task.steps.length > 0
      ? Math.round((task.completedSteps.length / task.steps.length) * 100)
      : 0;

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{task.title}</Text>
        {task.steps.length > 0 && (
          <Text style={styles.progress}>{progress}%</Text>
        )}
      </View>

      {task.description && (
        <Text style={styles.description}>{task.description}</Text>
      )}

      <View style={styles.steps}>
        {task.steps.map((step, index) => {
          const completed = task.completedSteps.includes(index);
          return (
            <Pressable
              key={index}
              style={styles.stepRow}
              onPress={() => onToggleStep(index)}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: completed }}
            >
              <View style={[styles.checkbox, completed && styles.checkboxDone]}>
                {completed && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={[styles.stepText, completed && styles.stepTextDone]}>
                {step}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Barra de progresso visual */}
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progress}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    flex: 1,
  },
  progress: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#6C63FF",
  },
  description: {
    fontSize: 13,
    color: "#888",
    marginBottom: 10,
  },
  steps: {
    marginTop: 8,
    gap: 6,
  },
  stepRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#D0D0D0",
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxDone: {
    backgroundColor: "#6C63FF",
    borderColor: "#6C63FF",
  },
  checkmark: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  stepText: {
    fontSize: 14,
    color: "#555",
  },
  stepTextDone: {
    textDecorationLine: "line-through",
    color: "#BBB",
  },
  progressBar: {
    height: 4,
    backgroundColor: "#F0F0F0",
    borderRadius: 2,
    marginTop: 12,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#6C63FF",
    borderRadius: 2,
  },
});
