import { View, Text, Pressable } from "react-native";
import { useFocusTimer } from "@/presentation/hooks/useFocusTimer";
import { useTheme } from "@/presentation/contexts/ThemePreferencesContext";

interface FocusTimerProps {
  taskId: string;
  onExpand?: () => void;
}

export function FocusTimer({ taskId, onExpand }: FocusTimerProps) {
  const { isActive, isRunning, isPaused, mode, formattedTime, start, pause } =
    useFocusTimer(taskId);
  const {
    resolvedColors,
    resolvedFontSizes,
    resolvedSpacing,
    resolvedBorderRadius,
  } = useTheme();

  const modeLabel =
    mode === "focus" ? "Foco" : mode === "long_break" ? "Pausa longa" : "Pausa";
  const modeColor =
    mode === "focus" ? resolvedColors.primary : resolvedColors.ring;

  if (!isActive) {
    return (
      <Pressable
        onPress={start}
        accessibilityLabel="Iniciar timer de foco"
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: resolvedSpacing.xs,
          backgroundColor: resolvedColors.muted,
          borderRadius: resolvedBorderRadius.sm,
          paddingHorizontal: resolvedSpacing.sm,
          paddingVertical: resolvedSpacing.xs,
        }}
      >
        <Text
          style={{
            fontSize: resolvedFontSizes.sm,
            color: resolvedColors.mutedForeground,
          }}
        >
          ▶ Foco
        </Text>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={onExpand}
      onLongPress={isRunning ? pause : start}
      accessibilityLabel={`Timer ${modeLabel}: ${formattedTime}`}
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: resolvedSpacing.xs,
        backgroundColor: modeColor,
        borderRadius: resolvedBorderRadius.sm,
        paddingHorizontal: resolvedSpacing.sm,
        paddingVertical: resolvedSpacing.xs,
      }}
    >
      <Text
        style={{
          fontSize: resolvedFontSizes.sm,
          color: resolvedColors.primaryForeground,
          fontWeight: "600",
        }}
      >
        {isPaused ? "⏸" : "●"} {formattedTime}
      </Text>
    </Pressable>
  );
}
