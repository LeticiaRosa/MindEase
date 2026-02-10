import { useState } from "react";
import { StyleSheet, Text, View, ScrollView, Pressable } from "react-native";
import { TaskCard } from "../components/TaskCard";
import { PomodoroTimer } from "../components/PomodoroTimer";
import type { Task } from "../types";

const SAMPLE_TASKS: Task[] = [
  {
    id: "1",
    title: "Ler capítulo de estudo",
    description: "Capítulo 3 — Neurociência Cognitiva",
    status: "todo",
    steps: ["Ler páginas 40-55", "Fazer anotações", "Revisar pontos-chave"],
    completedSteps: [],
    createdAt: new Date(),
  },
  {
    id: "2",
    title: "Organizar agenda da semana",
    status: "in-progress",
    steps: ["Listar compromissos", "Definir prioridades", "Bloquear horários"],
    completedSteps: [0],
    createdAt: new Date(),
  },
  {
    id: "3",
    title: "Exercício de respiração",
    status: "done",
    steps: ["5 minutos de respiração guiada"],
    completedSteps: [0],
    createdAt: new Date(),
  },
];

const STATUS_LABELS: Record<string, string> = {
  todo: "📋 A Fazer",
  "in-progress": "⏳ Em Progresso",
  done: "✅ Concluída",
};

export function TaskOrganizerScreen() {
  const [tasks, setTasks] = useState<Task[]>(SAMPLE_TASKS);
  const [showTimer, setShowTimer] = useState(false);

  const groupedTasks = {
    todo: tasks.filter((t) => t.status === "todo"),
    "in-progress": tasks.filter((t) => t.status === "in-progress"),
    done: tasks.filter((t) => t.status === "done"),
  };

  const handleToggleStep = (taskId: string, stepIndex: number) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id !== taskId) return task;
        const completed = task.completedSteps.includes(stepIndex)
          ? task.completedSteps.filter((i) => i !== stepIndex)
          : [...task.completedSteps, stepIndex];
        return { ...task, completedSteps: completed };
      }),
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Organizador de Tarefas</Text>
        <Pressable
          style={styles.timerButton}
          onPress={() => setShowTimer(!showTimer)}
        >
          <Text style={styles.timerButtonText}>
            {showTimer ? "Fechar Timer" : "🍅 Pomodoro"}
          </Text>
        </Pressable>
      </View>

      {showTimer && (
        <View style={styles.timerSection}>
          <PomodoroTimer />
        </View>
      )}

      {(["todo", "in-progress", "done"] as const).map((status) => (
        <View key={status} style={styles.column}>
          <Text style={styles.columnTitle}>
            {STATUS_LABELS[status]} ({groupedTasks[status].length})
          </Text>
          {groupedTasks[status].map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onToggleStep={(stepIndex) => handleToggleStep(task.id, stepIndex)}
            />
          ))}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F7FF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 24,
    paddingBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#6C63FF",
  },
  timerButton: {
    backgroundColor: "#FF6B6B",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  timerButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 13,
  },
  timerSection: {
    marginHorizontal: 16,
    marginBottom: 8,
  },
  column: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  columnTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#555",
    marginBottom: 8,
  },
});
