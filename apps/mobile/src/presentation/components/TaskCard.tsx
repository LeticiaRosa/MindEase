import { useState, useEffect } from "react";
import { View, Text, Pressable } from "react-native";
import {
  Trash2,
  ChevronDown,
  ChevronUp,
  Timer,
  Move,
  Archive,
  Pencil,
} from "lucide-react-native";
import type { Task } from "@/domain/entities/Task";
import { useTheme } from "@/presentation/contexts/ThemePreferencesContext";
import { useTimerContext } from "@/presentation/contexts/TimerContext";
import { SmartChecklist } from "@/presentation/components/SmartChecklist";
import { FocusTimer } from "@/presentation/components/FocusTimer";
import { FocusTimerFocus } from "./FocusTimerFocus";
import { TaskEditForm } from "./TaskEditForm";
import type { UpdateTaskParams } from "@/application/useCases/UpdateTask";

interface TaskCardProps {
  task: Task;
  onDelete: (id: string) => void;
  onArchive?: (id: string) => void;
  onUpdate?: (id: string, params: UpdateTaskParams) => void;
}

export function TaskCard({
  task,
  onDelete,
  onArchive,
  onUpdate,
}: TaskCardProps) {
  const {
    mode,
    helpers,
    complexity,
    resolvedColors,
    resolvedFontSizes,
    resolvedSpacing,
    resolvedBorderRadius,
  } = useTheme();
  const [checklistOpen, setChecklistOpen] = useState(mode === "detail");
  const [timerOpen, setTimerOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [timerFocusOpen, setTimerFocusOpen] = useState(false);

  useEffect(() => {
    setChecklistOpen(mode === "detail");
  }, [mode]);

  const { state: timerState } = useTimerContext();
  const taskTimer = timerState.timers[task.id];
  const isTimerActive = taskTimer?.status === "running";

  const toLocaleRelativeTime = () => {
    const now = new Date();
    const updatedAt = new Date(task.statusUpdatedAt);
    const diffMs = now.getTime() - updatedAt.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? "s" : ""} ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24)
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  };

  const formatTimeSpent = (seconds: number) => {
    if (seconds === 0) return null;
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const iconColor = resolvedColors.mutedForeground;

  return (
    <View
      accessibilityLabel={`Task: ${task.title}`}
      style={{
        backgroundColor: resolvedColors.card,
        borderWidth: 1,
        borderColor: resolvedColors.border,
        borderRadius: resolvedBorderRadius.lg,
        padding: resolvedSpacing.sm,
        shadowColor: resolvedColors.foreground,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
        marginBottom: resolvedSpacing.sm,
      }}
    >
      {/* Top action row */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: resolvedSpacing.xs,
          paddingVertical: resolvedSpacing.sm,
        }}
      >
        {/* Time spent badge */}
        {task.totalTimeSpent > 0 && (
          <View
            accessibilityLabel={`Total time spent: ${formatTimeSpent(task.totalTimeSpent)}`}
            style={{
              paddingHorizontal: resolvedSpacing.sm,
              paddingVertical: 2,
              backgroundColor: resolvedColors.primary + "1A",
              borderWidth: 1,
              borderColor: resolvedColors.primary + "33",
              borderRadius: 9999,
            }}
          >
            <Text
              style={{
                fontSize: resolvedFontSizes.sm,
                fontWeight: "500",
                color: resolvedColors.primary,
              }}
            >
              {formatTimeSpent(task.totalTimeSpent)}
            </Text>
          </View>
        )}

        {/* Focus indicator */}
        {isTimerActive && (
          <View
            accessibilityLabel="Timer active"
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: resolvedColors.primary,
              marginHorizontal: resolvedSpacing.xs,
            }}
          />
        )}

        {/* Edit button */}
        {onUpdate && (
          <Pressable
            onPress={() => setEditDialogOpen(true)}
            accessibilityRole="button"
            accessibilityLabel={`Edit task: ${task.title}`}
            hitSlop={8}
            style={{
              padding: resolvedSpacing.md - 2,
              backgroundColor: resolvedColors.muted,
              borderRadius: 9999,
            }}
          >
            <Pencil size={18} color={iconColor} />
          </Pressable>
        )}

        {/* Archive button */}
        {onArchive && (
          <Pressable
            onPress={() => onArchive(task.id)}
            accessibilityRole="button"
            accessibilityLabel={`Archive task: ${task.title}`}
            hitSlop={8}
            style={{
              padding: resolvedSpacing.md - 2,
              backgroundColor: resolvedColors.muted,
              borderRadius: 9999,
            }}
          >
            <Archive size={18} color={iconColor} />
          </Pressable>
        )}

        {/* Delete button */}
        <Pressable
          onPress={() => onDelete(task.id)}
          accessibilityRole="button"
          accessibilityLabel={`Delete task: ${task.title}`}
          hitSlop={8}
          style={{
            padding: resolvedSpacing.md - 2,
            backgroundColor: resolvedColors.muted,
            borderRadius: 9999,
          }}
        >
          <Trash2 size={18} color={resolvedColors.destructive} />
        </Pressable>
      </View>

      {/* Title row */}
      <View style={{ flex: 1 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: resolvedSpacing.sm,
            paddingTop: resolvedSpacing.xs,
          }}
        >
          <Text
            style={{
              flex: 1,
              fontSize: resolvedFontSizes.base,
              fontWeight: "500",
              color: resolvedColors.textPrimary,
              paddingHorizontal: resolvedSpacing.sm,
            }}
          >
            {task.title}
          </Text>
        </View>
        {task.statusUpdatedAt && (
          <Text
            accessibilityLabel={`Status updated at ${new Date(task.statusUpdatedAt).toLocaleString()}`}
            style={{
              textAlign: "right",
              fontSize: resolvedFontSizes.xs,
              color: resolvedColors.mutedForeground,
              fontWeight: "300",
              paddingVertical: resolvedSpacing.xs,
            }}
          >
            Created {toLocaleRelativeTime()}
          </Text>
        )}
      </View>

      {/* Action row */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: resolvedSpacing.md,
          gap: resolvedSpacing.xs,
        }}
      >
        {/* Steps toggle */}
        <Pressable
          onPress={() => setChecklistOpen((v) => !v)}
          accessibilityRole="button"
          accessibilityState={{ expanded: checklistOpen }}
          accessibilityLabel={
            checklistOpen ? "Hide checklist" : "Show checklist"
          }
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 4,
            padding: resolvedSpacing.sm,
            backgroundColor: resolvedColors.muted,
            borderRadius: 9999,
          }}
        >
          {checklistOpen ? (
            <ChevronUp size={20} color={iconColor} />
          ) : (
            <ChevronDown size={20} color={iconColor} />
          )}
          <Text style={{ fontSize: resolvedFontSizes.sm, color: iconColor }}>
            Steps
          </Text>
        </Pressable>

        {/* Timer toggle */}
        <Pressable
          onPress={() => setTimerOpen((v) => !v)}
          accessibilityRole="button"
          accessibilityState={{ expanded: timerOpen }}
          accessibilityLabel={timerOpen ? "Hide timer" : "Show timer"}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 4,
            padding: resolvedSpacing.sm,
            backgroundColor: resolvedColors.muted,
            borderRadius: 9999,
          }}
        >
          <Timer
            size={20}
            color={isTimerActive ? resolvedColors.primary : iconColor}
          />
          <Text
            style={{
              fontSize: resolvedFontSizes.md,
              color: isTimerActive ? resolvedColors.primary : iconColor,
            }}
          >
            Timer
          </Text>
        </Pressable>

        {/* Focus toggle */}
        <Pressable
          onPress={() => setTimerFocusOpen((v) => !v)}
          accessibilityRole="button"
          accessibilityState={{ expanded: timerFocusOpen }}
          accessibilityLabel={
            timerFocusOpen ? "Hide focus timer" : "Show focus timer"
          }
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 4,
            padding: resolvedSpacing.sm,
            backgroundColor: resolvedColors.muted,
            borderRadius: 9999,
          }}
        >
          <Timer
            size={20}
            color={isTimerActive ? resolvedColors.primary : iconColor}
          />
          <Text
            style={{
              fontSize: resolvedFontSizes.md,
              color: isTimerActive ? resolvedColors.primary : iconColor,
            }}
          >
            Focus
          </Text>
        </Pressable>

        <View style={{ flex: 1 }} />
      </View>

      {/* Timer (collapsible) */}
      {timerOpen && (
        <View style={{ marginTop: resolvedSpacing.xs }}>
          <FocusTimer taskId={task.id} />
        </View>
      )}

      {/* Focus Timer (modal) */}
      <FocusTimerFocus
        taskId={task.id}
        taskTitle={task.title}
        visible={timerFocusOpen}
        onClose={() => setTimerFocusOpen(false)}
      />

      {/* Checklist (collapsible) */}
      {checklistOpen && (
        <View style={{ marginTop: resolvedSpacing.xs }}>
          <SmartChecklist taskId={task.id} />
        </View>
      )}

      {/* Edit Dialog */}
      {onUpdate && (
        <TaskEditForm
          task={task}
          visible={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          onSave={onUpdate}
        />
      )}
    </View>
  );
}
