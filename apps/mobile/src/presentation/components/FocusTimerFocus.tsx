import { View, Text, Pressable, Modal } from "react-native";
import { useFocusTimer } from "@/presentation/hooks/useFocusTimer";
import { useTheme } from "@/presentation/contexts/ThemePreferencesContext";

interface FocusTimerFocusProps {
  taskId: string;
  taskTitle: string;
  visible: boolean;
  onClose: () => void;
}

export function FocusTimerFocus({
  taskId,
  taskTitle,
  visible,
  onClose,
}: FocusTimerFocusProps) {
  const {
    isRunning,
    isPaused,
    mode,
    formattedTime,
    progress,
    currentCycle,
    cyclesBeforeLongBreak,
    start,
    pause,
    reset,
    stop,
  } = useFocusTimer(taskId);
  const {
    resolvedColors,
    resolvedFontSizes,
    resolvedSpacing,
    resolvedBorderRadius,
  } = useTheme();

  const modeLabel =
    mode === "focus" ? "Foco" : mode === "long_break" ? "Pausa Longa" : "Pausa";

  const modeColor =
    mode === "focus" ? resolvedColors.primary : resolvedColors.ring;

  const handleStop = async () => {
    await stop();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: resolvedColors.background,
          justifyContent: "center",
          alignItems: "center",
          padding: resolvedSpacing.xl,
        }}
      >
        {/* Close button */}
        <Pressable
          onPress={onClose}
          style={{
            position: "absolute",
            top: resolvedSpacing.xl * 2,
            right: resolvedSpacing.lg,
          }}
          accessibilityLabel="Minimizar timer"
        >
          <Text
            style={{
              fontSize: resolvedFontSizes.xl,
              color: resolvedColors.mutedForeground,
            }}
          >
            ✕
          </Text>
        </Pressable>

        {/* Task name */}
        <Text
          numberOfLines={2}
          style={{
            fontSize: resolvedFontSizes.lg,
            color: resolvedColors.mutedForeground,
            textAlign: "center",
            marginBottom: resolvedSpacing.lg,
          }}
        >
          {taskTitle}
        </Text>

        {/* Mode label */}
        <Text
          style={{
            fontSize: resolvedFontSizes.xl,
            fontWeight: "600",
            color: modeColor,
            marginBottom: resolvedSpacing.md,
          }}
        >
          {modeLabel}
        </Text>

        {/* Timer display */}
        <Text
          style={{
            fontSize: 64,
            fontWeight: "300",
            fontVariant: ["tabular-nums"],
            color: resolvedColors.textPrimary,
            marginBottom: resolvedSpacing.sm,
          }}
        >
          {formattedTime}
        </Text>

        {/* Progress bar */}
        <View
          style={{
            width: "80%",
            height: 8,
            backgroundColor: resolvedColors.muted,
            borderRadius: 4,
            overflow: "hidden",
            marginBottom: resolvedSpacing.md,
          }}
        >
          <View
            style={{
              width: `${progress * 100}%`,
              height: "100%",
              backgroundColor: modeColor,
              borderRadius: 4,
            }}
          />
        </View>

        {/* Cycle indicator */}
        <Text
          style={{
            fontSize: resolvedFontSizes.sm,
            color: resolvedColors.mutedForeground,
            marginBottom: resolvedSpacing.xl,
          }}
        >
          Ciclo {currentCycle} de {cyclesBeforeLongBreak}
        </Text>

        {/* Controls */}
        <View
          style={{
            flexDirection: "row",
            gap: resolvedSpacing.md,
            alignItems: "center",
          }}
        >
          <Pressable
            onPress={reset}
            accessibilityLabel="Reiniciar timer"
            style={{
              backgroundColor: resolvedColors.muted,
              borderRadius: resolvedBorderRadius.full,
              width: 56,
              height: 56,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{ fontSize: 24, color: resolvedColors.mutedForeground }}
            >
              ↺
            </Text>
          </Pressable>

          <Pressable
            onPress={isRunning ? pause : start}
            accessibilityLabel={isRunning ? "Pausar" : "Iniciar"}
            style={{
              backgroundColor: modeColor,
              borderRadius: resolvedBorderRadius.full,
              width: 80,
              height: 80,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                fontSize: 32,
                color: resolvedColors.primaryForeground,
              }}
            >
              {isRunning ? "⏸" : "▶"}
            </Text>
          </Pressable>

          <Pressable
            onPress={handleStop}
            accessibilityLabel="Parar e salvar tempo"
            style={{
              backgroundColor: resolvedColors.destructive,
              borderRadius: resolvedBorderRadius.full,
              width: 56,
              height: 56,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                fontSize: 24,
                color: resolvedColors.destructiveForeground,
              }}
            >
              ■
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
