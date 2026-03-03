import { useRef } from "react";
import { View, Text, Pressable, Animated } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import type { Task } from "@/domain/entities/Task";
import { useTheme } from "@/presentation/contexts/ThemePreferencesContext";

interface TaskCardProps {
  task: Task;
  onPress?: () => void;
  onSwipeRight?: () => void;
  onSwipeLeft?: () => void;
  onLongPress?: () => void;
}

export function TaskCard({
  task,
  onPress,
  onSwipeRight,
  onSwipeLeft,
  onLongPress,
}: TaskCardProps) {
  const {
    resolvedColors,
    resolvedFontSizes,
    resolvedSpacing,
    resolvedBorderRadius,
  } = useTheme();
  const swipeableRef = useRef<Swipeable>(null);

  const steps = task.checklistSteps ?? [];
  const completedSteps = steps.filter((s) => s.completed).length;
  const hasSteps = steps.length > 0;
  const hasTimer = task.totalTimeSpent > 0;

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const h = Math.floor(m / 60);
    if (h > 0) return `${h}h ${m % 60}m`;
    return `${m}m`;
  };

  const renderRightAction = (
    _progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>,
  ) => {
    if (!onSwipeLeft) return null;
    const scale = dragX.interpolate({
      inputRange: [-80, 0],
      outputRange: [1, 0],
      extrapolate: "clamp",
    });
    return (
      <Animated.View
        style={{
          backgroundColor: resolvedColors.destructive,
          justifyContent: "center",
          alignItems: "flex-end",
          paddingHorizontal: resolvedSpacing.lg,
          borderRadius: resolvedBorderRadius.md,
          marginBottom: resolvedSpacing.sm,
          transform: [{ scale }],
        }}
      >
        <Text
          style={{
            color: resolvedColors.destructiveForeground,
            fontSize: resolvedFontSizes.sm,
            fontWeight: "600",
          }}
        >
          ← Voltar
        </Text>
      </Animated.View>
    );
  };

  const renderLeftAction = (
    _progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>,
  ) => {
    if (!onSwipeRight) return null;
    const scale = dragX.interpolate({
      inputRange: [0, 80],
      outputRange: [0, 1],
      extrapolate: "clamp",
    });
    return (
      <Animated.View
        style={{
          backgroundColor: resolvedColors.primary,
          justifyContent: "center",
          paddingHorizontal: resolvedSpacing.lg,
          borderRadius: resolvedBorderRadius.md,
          marginBottom: resolvedSpacing.sm,
          transform: [{ scale }],
        }}
      >
        <Text
          style={{
            color: resolvedColors.primaryForeground,
            fontSize: resolvedFontSizes.sm,
            fontWeight: "600",
          }}
        >
          Avançar →
        </Text>
      </Animated.View>
    );
  };

  const handleSwipeRight = () => {
    swipeableRef.current?.close();
    onSwipeRight?.();
  };

  const handleSwipeLeft = () => {
    swipeableRef.current?.close();
    onSwipeLeft?.();
  };

  return (
    <Swipeable
      ref={swipeableRef}
      renderLeftActions={renderLeftAction}
      renderRightActions={renderRightAction}
      onSwipeableOpen={(direction) => {
        if (direction === "left") handleSwipeRight();
        else handleSwipeLeft();
      }}
      overshootLeft={false}
      overshootRight={false}
    >
      <Pressable
        onPress={onPress}
        onLongPress={onLongPress}
        accessibilityRole="button"
        accessibilityLabel={task.title}
        style={{
          backgroundColor: resolvedColors.background,
          borderWidth: 1,
          borderColor: resolvedColors.border,
          borderRadius: resolvedBorderRadius.md,
          padding: resolvedSpacing.md,
          marginBottom: resolvedSpacing.sm,
        }}
      >
        <Text
          numberOfLines={2}
          style={{
            fontSize: resolvedFontSizes.base,
            color: resolvedColors.textPrimary,
            fontWeight: "500",
          }}
        >
          {task.title}
        </Text>

        {/* Metadata row */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: resolvedSpacing.md,
            marginTop: hasSteps || hasTimer ? resolvedSpacing.xs : 0,
          }}
        >
          {hasSteps && (
            <Text
              style={{
                fontSize: resolvedFontSizes.sm,
                color: resolvedColors.mutedForeground,
              }}
            >
              ✓ {completedSteps}/{steps.length}
            </Text>
          )}
          {hasTimer && (
            <Text
              style={{
                fontSize: resolvedFontSizes.sm,
                color: resolvedColors.mutedForeground,
              }}
            >
              ⏱ {formatTime(task.totalTimeSpent)}
            </Text>
          )}
        </View>
      </Pressable>
    </Swipeable>
  );
}
