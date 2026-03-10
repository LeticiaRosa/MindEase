import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  Modal,
  LayoutAnimation,
  Platform,
  UIManager,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusTimer } from "@/presentation/hooks/useFocusTimer";
import { useTheme } from "@/presentation/contexts/ThemePreferencesContext";
import { CircularProgress } from "./CircularProgress";
import { SmartChecklist } from "./SmartChecklist";
import { Play, Pause, RotateCcw, Square, X } from "lucide-react-native";
import { useSmartChecklist } from "../hooks/useSmartChecklist";

function animateLayoutIfAllowed(allowAnimation: boolean) {
  if (!allowAnimation) return;

  if (
    Platform.OS === "android" &&
    UIManager.setLayoutAnimationEnabledExperimental
  ) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
}

interface FocusTimerFocusProps {
  taskId: string;
  taskTitle: string;
  visible: boolean;
  onClose: () => void;
}

const RING_SIZE = 192;
const RING_STROKE = 8;
const CONTROL_SIZE = 56;
const PRIMARY_CONTROL_SIZE = 80;

const MODE_DESCRIPTIONS: Record<string, string> = {
  focus: "Mantenha o foco. Um passo de cada vez.",
  break: "Descanse a mente. Você mereceu.",
  long_break: "Faça uma pausa mais longa antes da próxima sessão.",
};

export function FocusTimerFocus({
  taskId,
  taskTitle,
  visible,
  onClose,
}: FocusTimerFocusProps) {
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
  const {
    resolvedColors,
    resolvedFontSizes,
    resolvedSpacing,
    resolvedBorderRadius,
    isReducedMotion,
  } = useTheme();
  const { currentStep } = useSmartChecklist(taskId);
  const [showChecklist, setShowChecklist] = useState(false);
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const contentTranslateY = useRef(new Animated.Value(22)).current;
  const ringScale = useRef(new Animated.Value(1)).current;
  const shouldAnimateFocus = !isReducedMotion && isRunning;

  const modeDescription = MODE_DESCRIPTIONS[mode] ?? "";
  const modeColor =
    mode === "focus" ? resolvedColors.primary : resolvedColors.ring;

  const handleStop = async () => {
    await stop();
    onClose();
  };

  const toggleChecklist = () => {
    animateLayoutIfAllowed(!isReducedMotion);
    setShowChecklist((prev) => !prev);
  };

  useEffect(() => {
    if (!visible) {
      contentOpacity.setValue(0);
      contentTranslateY.setValue(22);
      ringScale.setValue(1);
      return;
    }

    if (!shouldAnimateFocus) {
      contentOpacity.setValue(1);
      contentTranslateY.setValue(0);
      ringScale.setValue(1);
      return;
    }

    Animated.parallel([
      Animated.timing(contentOpacity, {
        toValue: 1,
        duration: 360,
        useNativeDriver: true,
      }),
      Animated.spring(contentTranslateY, {
        toValue: 0,
        tension: 55,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(ringScale, {
          toValue: 1.06,
          duration: 1300,
          useNativeDriver: true,
        }),
        Animated.timing(ringScale, {
          toValue: 1,
          duration: 1300,
          useNativeDriver: true,
        }),
      ]),
    );

    loop.start();
    return () => {
      loop.stop();
      ringScale.setValue(1);
    };
  }, [
    visible,
    shouldAnimateFocus,
    contentOpacity,
    contentTranslateY,
    ringScale,
  ]);

  return (
    <Modal
      visible={visible}
      animationType={shouldAnimateFocus ? "fade" : "none"}
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <SafeAreaView
        style={{ flex: 1, backgroundColor: resolvedColors.background }}
      >
        <Animated.ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            padding: resolvedSpacing.xl,
            alignItems: "center",
          }}
          keyboardShouldPersistTaps="handled"
          style={{
            opacity: contentOpacity,
            transform: [{ translateY: contentTranslateY }],
          }}
        >
          {/* Close button */}
          <Pressable
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel="Sair do foco"
            style={{
              alignSelf: "flex-end",
              flexDirection: "row",
              alignItems: "center",
              gap: resolvedSpacing.xs,
              paddingVertical: resolvedSpacing.xs,
              paddingHorizontal: resolvedSpacing.sm,
              marginBottom: resolvedSpacing.lg,
            }}
          >
            <X size={18} color={resolvedColors.mutedForeground} />
            <Text
              style={{
                fontSize: resolvedFontSizes.base,
                color: resolvedColors.mutedForeground,
              }}
            >
              Sair do Foco
            </Text>
          </Pressable>
          {/* Task title */}
          <Text
            numberOfLines={2}
            style={{
              fontSize: resolvedFontSizes.lg,
              color: resolvedColors.mutedForeground,
              textAlign: "center",
              marginBottom: resolvedSpacing.lg,
              fontWeight: "700",
            }}
          >
            {taskTitle}
          </Text>

          {currentStep && currentStep.title && (
            <Text
              style={{
                fontSize: resolvedFontSizes.sm,
                color: resolvedColors.mutedForeground,
                marginBottom: resolvedSpacing.md,
              }}
            >
              {currentStep.title}
            </Text>
          )}
          {/* Large circular progress ring with time and cycle centered */}
          <Animated.View
            style={{
              width: RING_SIZE,
              height: RING_SIZE,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: resolvedSpacing.xl,
              transform: [{ scale: ringScale }],
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
                  fontSize: 48,
                  fontWeight: "300",
                  color: resolvedColors.textPrimary,
                  fontVariant: ["tabular-nums"],
                }}
              >
                {formattedTime}
              </Text>
              <Text
                style={{
                  fontSize: resolvedFontSizes.sm,
                  color: resolvedColors.mutedForeground,
                  marginTop: 2,
                }}
              >
                {currentCycle} / {cyclesBeforeLongBreak}
              </Text>
            </View>
          </Animated.View>

          {/* Mode description */}
          <Text
            style={{
              fontSize: resolvedFontSizes.sm,
              color: resolvedColors.mutedForeground,
              textAlign: "center",
              marginBottom: resolvedSpacing.xl,
              paddingHorizontal: resolvedSpacing.xl,
            }}
          >
            {modeDescription}
          </Text>
          {/* Controls */}
          <View
            style={{
              flexDirection: "row",
              gap: resolvedSpacing.md,
              alignItems: "center",
              marginBottom: resolvedSpacing.xl,
            }}
          >
            {/* Reset */}
            <Pressable
              onPress={reset}
              accessibilityRole="button"
              accessibilityLabel="Reiniciar timer"
              style={{
                backgroundColor: resolvedColors.muted,
                borderRadius: resolvedBorderRadius.full,
                width: CONTROL_SIZE,
                height: CONTROL_SIZE,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <RotateCcw size={24} color={resolvedColors.mutedForeground} />
            </Pressable>

            {/* Play / Pause */}
            <Pressable
              onPress={isRunning ? pause : start}
              accessibilityRole="button"
              accessibilityLabel={isRunning ? "Pausar" : "Iniciar"}
              style={{
                backgroundColor: modeColor,
                borderRadius: resolvedBorderRadius.full,
                width: PRIMARY_CONTROL_SIZE,
                height: PRIMARY_CONTROL_SIZE,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {isRunning ? (
                <Pause size={32} color={resolvedColors.primaryForeground} />
              ) : (
                <Play size={32} color={resolvedColors.primaryForeground} />
              )}
            </Pressable>

            {/* Stop */}
            <Pressable
              onPress={handleStop}
              accessibilityRole="button"
              accessibilityLabel="Parar e salvar tempo"
              style={{
                backgroundColor: resolvedColors.destructive,
                borderRadius: resolvedBorderRadius.full,
                width: CONTROL_SIZE,
                height: CONTROL_SIZE,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Square size={24} color={resolvedColors.destructiveForeground} />
            </Pressable>
          </View>

          {/* Collapsible checklist — hidden for dashboard timer */}
          {taskId !== "dashboard" && (
            <View style={{ width: "100%" }}>
              <Pressable
                onPress={toggleChecklist}
                accessibilityRole="button"
                accessibilityLabel={
                  showChecklist ? "Ocultar etapas" : "Mostrar etapas"
                }
                style={{
                  alignItems: "center",
                  paddingVertical: resolvedSpacing.sm,
                  backgroundColor: resolvedColors.muted,
                  borderRadius: resolvedBorderRadius.md,
                  marginBottom: showChecklist ? resolvedSpacing.md : 0,
                }}
              >
                <Text
                  style={{
                    fontSize: resolvedFontSizes.sm,
                    color: resolvedColors.mutedForeground,
                    fontWeight: "600",
                  }}
                >
                  {showChecklist ? "Ocultar etapas" : "Mostrar etapas"}
                </Text>
              </Pressable>
              {showChecklist && (
                <View
                  style={{
                    backgroundColor: resolvedColors.card,
                    borderRadius: resolvedBorderRadius.md,
                    padding: resolvedSpacing.md,
                  }}
                >
                  <SmartChecklist taskId={taskId} />
                </View>
              )}
            </View>
          )}
        </Animated.ScrollView>
      </SafeAreaView>
    </Modal>
  );
}
