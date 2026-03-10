import { View, Text, FlatList } from "react-native";
import type { Task } from "@/domain/entities/Task";
import type { TaskStatus } from "@/domain/valueObjects/TaskStatus";
import { TaskCard } from "./TaskCard";
import { useTheme } from "@/presentation/contexts/ThemePreferencesContext";

interface TaskGroupProps {
  title: string;
  tasks: Task[];
  showCreate?: boolean;
  onCreateTask?: (title: string) => void;
  onDeleteTask: (id: string) => void;
  onArchiveTask?: (id: string) => void;
  onUpdateTask?: (
    id: string,
    params: { title?: string; description?: string },
  ) => void;
  onStatusChangeTask?: (id: string, newStatus: TaskStatus) => void;
  emptyMessage?: string;
}

export function TaskGroup({
  tasks,
  onDeleteTask,
  onArchiveTask,
  onUpdateTask,
  onStatusChangeTask,
  emptyMessage = "Nenhuma tarefa aqui ainda",
}: TaskGroupProps) {
  const {
    resolvedColors,
    resolvedFontSizes,
    resolvedSpacing,
    resolvedBorderRadius,
  } = useTheme();

  return (
    <View style={{ marginBottom: resolvedSpacing.xl }}>
      {tasks.length === 0 ? (
        <View
          style={{
            padding: resolvedSpacing.md,
            backgroundColor: resolvedColors.muted,
            borderRadius: resolvedBorderRadius.md,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: resolvedFontSizes.sm,
              color: resolvedColors.mutedForeground,
            }}
          >
            {emptyMessage}
          </Text>
        </View>
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <TaskCard
              task={item}
              onDelete={onDeleteTask}
              onArchive={onArchiveTask}
              onUpdate={onUpdateTask}
              onStatusChange={onStatusChangeTask}
            />
          )}
        />
      )}
    </View>
  );
}
