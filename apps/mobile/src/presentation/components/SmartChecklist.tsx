import { useState } from "react";
import {
  View,
  Text,
  Pressable,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import { useSmartChecklist } from "@/presentation/hooks/useSmartChecklist";
import { AddStepForm } from "./AddStepForm";
import { useTheme } from "@/presentation/contexts/ThemePreferencesContext";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface SmartChecklistProps {
  taskId: string;
}

export function SmartChecklist({ taskId }: SmartChecklistProps) {
  const {
    currentStep,
    remainingCount,
    completedSteps,
    allDone,
    totalSteps,
    completedCount,
    toggleStep,
    createStep,
    deleteStep,
  } = useSmartChecklist(taskId);
  const [showCompleted, setShowCompleted] = useState(false);
  const {
    resolvedColors,
    resolvedFontSizes,
    resolvedSpacing,
    resolvedBorderRadius,
  } = useTheme();

  if (totalSteps === 0) {
    return (
      <View style={{ gap: resolvedSpacing.xs }}>
        <Text
          style={{
            fontSize: resolvedFontSizes.sm,
            color: resolvedColors.mutedForeground,
          }}
        >
          Nenhuma etapa ainda
        </Text>
        <AddStepForm onSubmit={createStep} />
      </View>
    );
  }

  return (
    <View style={{ gap: resolvedSpacing.sm }}>
      {/* Progress */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: resolvedSpacing.sm,
        }}
      >
        <View
          style={{
            flex: 1,
            height: 6,
            backgroundColor: resolvedColors.muted,
            borderRadius: 3,
            overflow: "hidden",
          }}
        >
          <View
            style={{
              width: `${(completedCount / totalSteps) * 100}%`,
              height: "100%",
              backgroundColor: allDone
                ? resolvedColors.primary
                : resolvedColors.ring,
              borderRadius: 3,
            }}
          />
        </View>
        <Text
          style={{
            fontSize: resolvedFontSizes.xs,
            color: resolvedColors.mutedForeground,
          }}
        >
          {completedCount}/{totalSteps}
        </Text>
      </View>

      {/* Current step (focus) */}
      {currentStep && (
        <Pressable
          onPress={() => toggleStep(currentStep.id, true)}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: false }}
          accessibilityLabel={`Etapa atual: ${currentStep.title}`}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: resolvedSpacing.sm,
            backgroundColor: resolvedColors.card,
            borderWidth: 2,
            borderColor: resolvedColors.ring,
            borderRadius: resolvedBorderRadius.md,
            padding: resolvedSpacing.md,
          }}
        >
          <View
            style={{
              width: 22,
              height: 22,
              borderRadius: 11,
              borderWidth: 2,
              borderColor: resolvedColors.ring,
              alignItems: "center",
              justifyContent: "center",
            }}
          />
          <Text
            style={{
              flex: 1,
              fontSize: resolvedFontSizes.base,
              color: resolvedColors.textPrimary,
              fontWeight: "500",
            }}
          >
            {currentStep.title}
          </Text>
          <Pressable
            onPress={() => deleteStep(currentStep.id)}
            hitSlop={8}
            accessibilityLabel="Remover etapa"
          >
            <Text
              style={{
                color: resolvedColors.mutedForeground,
                fontSize: resolvedFontSizes.base,
              }}
            >
              ✕
            </Text>
          </Pressable>
        </Pressable>
      )}

      {/* Remaining count */}
      {remainingCount > 0 && (
        <Text
          style={{
            fontSize: resolvedFontSizes.sm,
            color: resolvedColors.mutedForeground,
          }}
        >
          +{remainingCount} etapa{remainingCount > 1 ? "s" : ""} restante
          {remainingCount > 1 ? "s" : ""}
        </Text>
      )}

      {/* All done state */}
      {allDone && (
        <Text
          style={{
            fontSize: resolvedFontSizes.base,
            color: resolvedColors.primary,
            fontWeight: "600",
            textAlign: "center",
          }}
        >
          ✓ Todas as etapas concluídas!
        </Text>
      )}

      {/* Completed steps toggle */}
      {completedSteps.length > 0 && (
        <View>
          <Pressable
            onPress={() => {
              LayoutAnimation.configureNext(
                LayoutAnimation.Presets.easeInEaseOut,
              );
              setShowCompleted((prev) => !prev);
            }}
          >
            <Text
              style={{
                fontSize: resolvedFontSizes.sm,
                color: resolvedColors.mutedForeground,
              }}
            >
              {showCompleted ? "▼" : "▶"} {completedSteps.length} concluída
              {completedSteps.length > 1 ? "s" : ""}
            </Text>
          </Pressable>
          {showCompleted &&
            completedSteps.map((step) => (
              <Pressable
                key={step.id}
                onPress={() => toggleStep(step.id, false)}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: true }}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: resolvedSpacing.sm,
                  paddingVertical: resolvedSpacing.xs,
                  paddingHorizontal: resolvedSpacing.sm,
                  opacity: 0.6,
                }}
              >
                <View
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 11,
                    backgroundColor: resolvedColors.primary,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      color: resolvedColors.primaryForeground,
                      fontSize: 12,
                    }}
                  >
                    ✓
                  </Text>
                </View>
                <Text
                  style={{
                    fontSize: resolvedFontSizes.sm,
                    color: resolvedColors.mutedForeground,
                    textDecorationLine: "line-through",
                    flex: 1,
                  }}
                >
                  {step.title}
                </Text>
              </Pressable>
            ))}
        </View>
      )}

      {/* Add step form */}
      <AddStepForm onSubmit={createStep} />
    </View>
  );
}
