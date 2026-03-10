import { useState, useEffect, useRef } from "react";
import { View, Text, Pressable, PanResponder, Animated } from "react-native";
import {
  Trash2,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Timer,
  Archive,
  Pencil,
} from "lucide-react-native";
import type { TaskStatus } from "@/domain/valueObjects/TaskStatus";
import { TASK_STATUS_LABELS } from "@/domain/valueObjects/TaskStatus";
import type { Task } from "@/domain/entities/Task";
import { useTheme } from "@/presentation/contexts/ThemePreferencesContext";
import { useTimerContext } from "@/presentation/contexts/TimerContext";
import { SmartChecklist } from "@/presentation/components/SmartChecklist";
import { FocusTimer } from "@/presentation/components/FocusTimer";
import { FocusTimerFocus } from "./FocusTimerFocus";
import { TaskEditForm } from "./TaskEditForm";
import { ConfirmDeleteDialog } from "./ConfirmDeleteDialog";
import type { UpdateTaskParams } from "@/application/useCases/UpdateTask";

const STATUS_FLOW: TaskStatus[] = ["todo", "in_progress", "done"];
const SWIPE_THRESHOLD = 64;

interface TaskCardProps {
  task: Task;
  onDelete: (id: string) => void;
  onArchive?: (id: string) => void;
  onUpdate?: (id: string, params: UpdateTaskParams) => void;
  onStatusChange?: (id: string, newStatus: TaskStatus) => void;
}

export function TaskCard({
  task,
  onDelete,
  onArchive,
  onUpdate,
  onStatusChange,
}: TaskCardProps) {
  const {
    mode,
    resolvedColors,
    resolvedFontSizes,
    resolvedSpacing,
    resolvedBorderRadius,
    complexity,
    isReducedMotion,
  } = useTheme();
  const [checklistOpen, setChecklistOpen] = useState(mode === "detail");
  const [timerOpen, setTimerOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [timerFocusOpen, setTimerFocusOpen] = useState(false);

  useEffect(() => {
    setChecklistOpen(mode === "detail");
  }, [mode]);

  const { state: timerState } = useTimerContext();
  const taskTimer = timerState.timers[task.id];
  const isTimerActive = taskTimer?.status === "running";

  const toLocaleRelativeTime = () => {
    const now = new Date();
    const updatedAt = new Date(task.createdAt);
    const diffMs = now.getTime() - updatedAt.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return "agora mesmo";
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? "s" : ""} atrás`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24)
      return `${diffHours} hora${diffHours > 1 ? "s" : ""} atrás`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} dia${diffDays > 1 ? "s" : ""} atrás`;
  };

  const formatTimeSpent = (seconds: number) => {
    if (seconds === 0) return null;
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const iconColor = resolvedColors.mutedForeground;

  // ─── Swipe to change status ───────────────────────────────────────────
  const dragX = useRef(new Animated.Value(0)).current;
  const moveAnim = useRef(new Animated.Value(0)).current;
  const [swipeHint, setSwipeHint] = useState<"prev" | "next" | null>(null);
  const previousStatusRef = useRef(task.status);

  useEffect(() => {
    if (previousStatusRef.current === task.status) return;
    previousStatusRef.current = task.status;

    if (isReducedMotion) {
      moveAnim.setValue(0);
      return;
    }

    moveAnim.setValue(0);
    Animated.sequence([
      Animated.timing(moveAnim, {
        toValue: 1,
        duration: 190,
        useNativeDriver: true,
      }),
      Animated.timing(moveAnim, {
        toValue: 0,
        duration: 260,
        useNativeDriver: true,
      }),
    ]).start();
  }, [task.status, isReducedMotion, moveAnim]);

  // Keep mutable refs so PanResponder (created once) always sees fresh values
  const onStatusChangeRef = useRef(onStatusChange);
  onStatusChangeRef.current = onStatusChange;
  const taskIdRef = useRef(task.id);
  taskIdRef.current = task.id;
  const taskStatusRef = useRef(task.status);
  taskStatusRef.current = task.status;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, { dx, dy }) =>
        Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy) * 1.5,
      onPanResponderMove: (_, { dx }) => {
        dragX.setValue(dx);
        const idx = STATUS_FLOW.indexOf(taskStatusRef.current as TaskStatus);
        if (dx < -24 && idx > 0) {
          setSwipeHint("prev");
        } else if (dx > 24 && idx < STATUS_FLOW.length - 1) {
          setSwipeHint("next");
        } else {
          setSwipeHint(null);
        }
      },
      onPanResponderRelease: (_, { dx }) => {
        const idx = STATUS_FLOW.indexOf(taskStatusRef.current as TaskStatus);
        const canMovePrev = dx < -SWIPE_THRESHOLD && idx > 0;
        const canMoveNext =
          dx > SWIPE_THRESHOLD && idx < STATUS_FLOW.length - 1;

        if (canMovePrev || canMoveNext) {
          const targetStatus = canMovePrev
            ? STATUS_FLOW[idx - 1]
            : STATUS_FLOW[idx + 1];

          if (isReducedMotion) {
            dragX.setValue(0);
            setSwipeHint(null);
            onStatusChangeRef.current?.(taskIdRef.current, targetStatus);
            return;
          }

          Animated.timing(dragX, {
            toValue: canMovePrev ? -170 : 170,
            duration: 220,
            useNativeDriver: true,
          }).start(() => {
            dragX.setValue(0);
            setSwipeHint(null);
            onStatusChangeRef.current?.(taskIdRef.current, targetStatus);
          });
          return;
        }

        Animated.spring(dragX, {
          toValue: 0,
          useNativeDriver: true,
          tension: 120,
          friction: 10,
        }).start();
        setSwipeHint(null);
      },
      onPanResponderTerminate: () => {
        Animated.spring(dragX, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
        setSwipeHint(null);
      },
    }),
  ).current;

  const currentIdx = STATUS_FLOW.indexOf(task.status as TaskStatus);
  const prevStatus = currentIdx > 0 ? STATUS_FLOW[currentIdx - 1] : null;
  const nextStatus =
    currentIdx < STATUS_FLOW.length - 1 ? STATUS_FLOW[currentIdx + 1] : null;

  return (
    <View style={{ marginBottom: resolvedSpacing.sm }}>
      {/* Prev hint — appears on the left, same side the user drags toward */}
      {swipeHint === "prev" && prevStatus && (
        <View
          accessibilityElementsHidden
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            bottom: 0,
            width: 100,
            borderRadius: resolvedBorderRadius.lg,
            backgroundColor: resolvedColors.muted,
            justifyContent: "center",
            alignItems: "center",
            gap: 4,
          }}
        >
          <ChevronLeft size={20} color={resolvedColors.mutedForeground} />
          <Text
            style={{
              fontSize: resolvedFontSizes.xs,
              color: resolvedColors.mutedForeground,
              fontWeight: "600",
            }}
          >
            {TASK_STATUS_LABELS[prevStatus]}
          </Text>
        </View>
      )}
      {/* Next hint — appears on the right, same side the user drags toward */}
      {swipeHint === "next" && nextStatus && (
        <View
          accessibilityElementsHidden
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 100,
            borderRadius: resolvedBorderRadius.lg,
            backgroundColor: resolvedColors.primary + "1A",
            justifyContent: "center",
            alignItems: "center",
            gap: 4,
          }}
        >
          <ChevronRight size={20} color={resolvedColors.primary} />
          <Text
            style={{
              fontSize: resolvedFontSizes.xs,
              color: resolvedColors.primary,
              fontWeight: "600",
            }}
          >
            {TASK_STATUS_LABELS[nextStatus]}
          </Text>
        </View>
      )}
      <Animated.View
        accessibilityLabel={`Task: ${task.title}`}
        accessibilityHint={
          onStatusChange
            ? "Deslize para a direita para avançar o status, ou para a esquerda para retroceder"
            : undefined
        }
        style={[
          {
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
          },
          {
            transform: [
              { translateX: dragX },
              {
                scale: moveAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 1.06],
                }),
              },
            ],
          },
        ]}
        {...(onStatusChange ? panResponder.panHandlers : {})}
      >
        {!isReducedMotion && (
          <Animated.View
            pointerEvents="none"
            style={{
              position: "absolute",
              inset: -1,
              borderRadius: resolvedBorderRadius.lg,
              borderWidth: 2,
              borderColor: resolvedColors.primary,
              opacity: moveAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.65],
              }),
            }}
          />
        )}

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
              accessibilityLabel={`Arquivar task: ${task.title}`}
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
            onPress={() => setConfirmDeleteOpen(true)}
            accessibilityRole="button"
            accessibilityLabel={`Excluir task: ${task.title}`}
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
          {complexity === "complex" && task.statusUpdatedAt && (
            <Text
              accessibilityLabel={`Status atualizado em ${new Date(task.statusUpdatedAt).toLocaleString()}`}
              style={{
                textAlign: "right",
                fontSize: resolvedFontSizes.xs,
                color: resolvedColors.mutedForeground,
                fontWeight: "300",
                paddingVertical: resolvedSpacing.xs,
              }}
            >
              Criado a {toLocaleRelativeTime()}
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
          {complexity === "complex" && (
            <Pressable
              onPress={() => setTimerOpen((v) => !v)}
              accessibilityRole="button"
              accessibilityState={{ expanded: timerOpen }}
              accessibilityLabel={
                timerOpen ? "Ocultar temporizador" : "Mostrar temporizador"
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
                  fontSize: resolvedFontSizes.sm,
                  color: isTimerActive ? resolvedColors.primary : iconColor,
                }}
              >
                Timer
              </Text>
            </Pressable>
          )}
          {/* Focus toggle */}
          <Pressable
            onPress={() => setTimerFocusOpen((v) => !v)}
            accessibilityRole="button"
            accessibilityState={{ expanded: timerFocusOpen }}
            accessibilityLabel={
              timerFocusOpen
                ? "Ocultar temporizador de foco"
                : "Mostrar temporizador de foco"
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
                fontSize: resolvedFontSizes.sm,
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

        {/* Delete confirmation */}
        <ConfirmDeleteDialog
          open={confirmDeleteOpen}
          title="Excluir tarefa?"
          description="Esta tarefa e todos os seus passos serão removidos permanentemente. Esta ação não pode ser desfeita."
          onConfirm={() => {
            onDelete(task.id);
            setConfirmDeleteOpen(false);
          }}
          onCancel={() => setConfirmDeleteOpen(false)}
        />
      </Animated.View>
    </View>
  );
}
