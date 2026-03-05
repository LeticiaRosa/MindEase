import { View, Text, Pressable } from "react-native";
import { useFocusTimer } from "@/presentation/hooks/useFocusTimer";
import { useTheme } from "@/presentation/contexts/ThemePreferencesContext";
import { CircularProgress } from "./CircularProgress";
import { Timer } from "lucide-react-native";

interface FocusTimerProps {
  taskId: string;
  onExpand?: () => void;
}

const RING_SIZE = 80;
const RING_STROKE = 5;
const CONTROL_SIZE = 44;

export function FocusTimer({ taskId, onExpand }: FocusTimerProps) {
  const {
    isRunning,
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
  const { resolvedColors, resolvedFontSizes, resolvedSpacing } = useTheme();

  const modeLabel =
    mode === "focus" ? "Foco" : mode === "long_break" ? "Pausa longa" : "Pausa";
  const modeColor =
    mode === "focus" ? resolvedColors.primary : resolvedColors.ring;

  return (
    <View
      style={{
        flexDirection: "row",
        gap: resolvedSpacing["2xl"],
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Ring with time centered — tapping expands to focus mode */}
      <Pressable
        onPress={onExpand}
        accessibilityRole="button"
        accessibilityLabel={`Timer ${modeLabel}: ${formattedTime}. Toque para modo foco`}
      >
        <View
          style={{
            width: RING_SIZE,
            height: RING_SIZE,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View style={{ position: "absolute" }}>
            <CircularProgress
              size={RING_SIZE}
              strokeWidth={RING_STROKE}
              progress={progress}
              trackColor={resolvedColors.muted}
              progressColor={modeColor}
            />
          </View>
          <View style={{ alignItems: "center" }}>
            <Text
              style={{
                fontSize: resolvedFontSizes.xs,
                fontWeight: "600",
                color: resolvedColors.textPrimary,
              }}
            >
              {formattedTime}
            </Text>
            <Text
              style={{
                fontSize: 9,
                color: resolvedColors.mutedForeground,
              }}
            >
              {modeLabel}
            </Text>
            <Text
              style={{
                fontSize: 9,
                color: resolvedColors.mutedForeground,
              }}
            >
              {currentCycle}/{cyclesBeforeLongBreak}
            </Text>
          </View>
        </View>
      </Pressable>

      {/* Controls */}
      <View style={{ flexDirection: "row", gap: resolvedSpacing.sm }}>
        {/* Play / Pause */}
        <Pressable
          onPress={isRunning ? pause : start}
          accessibilityRole="button"
          accessibilityLabel={isRunning ? "Pausar timer" : "Iniciar timer"}
          style={{
            width: CONTROL_SIZE,
            height: CONTROL_SIZE,
            borderRadius: CONTROL_SIZE / 2,
            backgroundColor: modeColor,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              fontSize: resolvedFontSizes.base,
              color: resolvedColors.primaryForeground,
            }}
          >
            {isRunning ? "⏸" : "▶"}
          </Text>
        </Pressable>

        {/* Reset */}
        <Pressable
          onPress={reset}
          accessibilityRole="button"
          accessibilityLabel="Reiniciar timer"
          style={{
            width: CONTROL_SIZE,
            height: CONTROL_SIZE,
            borderRadius: CONTROL_SIZE / 2,
            backgroundColor: resolvedColors.muted,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              fontSize: resolvedFontSizes.base,
              color: resolvedColors.mutedForeground,
            }}
          >
            ↺
          </Text>
        </Pressable>

        {/* Stop */}
        <Pressable
          onPress={stop}
          accessibilityRole="button"
          accessibilityLabel="Parar e salvar tempo"
          style={{
            width: CONTROL_SIZE,
            height: CONTROL_SIZE,
            borderRadius: CONTROL_SIZE / 2,
            backgroundColor: resolvedColors.destructive,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              fontSize: resolvedFontSizes.base,
              color: resolvedColors.destructiveForeground,
            }}
          >
            ■
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
