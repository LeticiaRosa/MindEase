import { useState } from "react";
import {
  View,
  Text,
  Pressable,
  FlatList,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import type { Task } from "@/domain/entities/Task";
import { TaskCard } from "./TaskCard";
import { TaskCreateForm } from "./TaskCreateForm";
import { useTheme } from "@/presentation/contexts/ThemePreferencesContext";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface TaskGroupProps {
  title: string;
  tasks: Task[];
  showCreate?: boolean;
  onCreateTask?: (title: string) => void;
  onPressTask?: (task: Task) => void;
  onSwipeRight?: (task: Task) => void;
  onSwipeLeft?: (task: Task) => void;
  onLongPress?: (task: Task) => void;
  onExpandFocus?: (task: Task) => void;
  emptyMessage?: string;
}

export function TaskGroup({
  title,
  tasks,
  showCreate = false,
  onCreateTask,
  onPressTask,
  onSwipeRight,
  onSwipeLeft,
  onLongPress,
  onExpandFocus,
  emptyMessage = "Nenhuma tarefa aqui ainda",
}: TaskGroupProps) {
  const [collapsed, setCollapsed] = useState(false);
  const {
    resolvedColors,
    resolvedFontSizes,
    resolvedSpacing,
    resolvedBorderRadius,
  } = useTheme();

  const toggleCollapse = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setCollapsed((prev) => !prev);
  };

  return (
    <View style={{ marginBottom: resolvedSpacing.xl }}>
      {/* Header */}
      <Pressable
        onPress={toggleCollapse}
        accessibilityRole="button"
        accessibilityLabel={`${title}, ${tasks.length} tarefas${collapsed ? ", recolhido" : ""}`}
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: resolvedSpacing.sm,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: resolvedSpacing.sm,
          }}
        >
          <Text
            style={{
              fontSize: resolvedFontSizes.lg,
              fontWeight: "600",
              color: resolvedColors.textPrimary,
            }}
          >
            {collapsed ? "▶" : "▼"} {title}
          </Text>
        </View>
        <View
          style={{
            backgroundColor: resolvedColors.muted,
            paddingHorizontal: resolvedSpacing.sm,
            paddingVertical: 2,
            borderRadius: 999,
          }}
        >
          <Text
            style={{
              fontSize: resolvedFontSizes.sm,
              color: resolvedColors.mutedForeground,
            }}
          >
            {tasks.length}
          </Text>
        </View>
      </Pressable>

      {/* Content */}
      {!collapsed && (
        <>
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
                  onPress={() => onPressTask?.(item)}
                  onSwipeRight={() => onSwipeRight?.(item)}
                  onSwipeLeft={() => onSwipeLeft?.(item)}
                  onLongPress={() => onLongPress?.(item)}
                  onExpandFocus={() => onExpandFocus?.(item)}
                />
              )}
            />
          )}

          {showCreate && onCreateTask && (
            <View style={{ marginTop: resolvedSpacing.sm }}>
              <TaskCreateForm onSubmit={onCreateTask} />
            </View>
          )}
        </>
      )}
    </View>
  );
}
