import { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Pressable,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import {
  Check,
  ChevronDown,
  ChevronUp,
  Pencil,
  Trash2,
} from "lucide-react-native";
import { useSmartChecklist } from "@/presentation/hooks/useSmartChecklist";
import { AddStepForm } from "./AddStepForm";
import { ConfirmDeleteDialog } from "./ConfirmDeleteDialog";
import { StepFormModal } from "./StepFormModal";
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
    incompleteSteps,
    completedSteps,
    remainingCount,
    allDone,
    totalSteps,
    completedCount,
    toggleStep,
    createStep,
    deleteStep,
    updateStep,
  } = useSmartChecklist(taskId);
  const {
    mode,
    complexity,
    resolvedColors,
    resolvedFontSizes,
    resolvedSpacing,
    resolvedBorderRadius,
  } = useTheme();

  const [showAllStepsConcluded, setShowAllStepsConcluded] = useState(
    mode === "detail",
  );
  const [showAll, setShowAll] = useState(mode === "detail");
  const [animatingId, setAnimatingId] = useState<string | null>(null);
  const prevCurrentIdRef = useRef<string | null>(null);
  const animateTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [editingStep, setEditingStep] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const [deletingStepId, setDeletingStepId] = useState<string | null>(null);

  const upcomingSteps = incompleteSteps.slice(1);

  useEffect(() => {
    setShowAll(mode === "detail");
    setShowAllStepsConcluded(mode === "detail");
  }, [mode]);

  useEffect(() => {
    const currentId = currentStep?.id ?? null;
    if (currentId && currentId !== prevCurrentIdRef.current) {
      const wasActive = prevCurrentIdRef.current !== null;
      prevCurrentIdRef.current = currentId;
      const t1 = setTimeout(() => {
        if (wasActive) {
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
          setAnimatingId(currentId);
        }
      }, 20);
      animateTimerRef.current = setTimeout(() => setAnimatingId(null), 370);
      return () => {
        clearTimeout(t1);
        if (animateTimerRef.current) clearTimeout(animateTimerRef.current);
      };
    }
  }, [currentStep?.id]);

  const startEditing = (id: string, currentTitle: string) => {
    setEditingStep({ id, title: currentTitle });
  };

  if (totalSteps === 0) {
    return (
      <View style={{ gap: resolvedSpacing.xs }}>
        <Text
          style={{
            fontSize: resolvedFontSizes.sm,
            color: resolvedColors.mutedForeground,
            fontStyle: "italic",
          }}
        >
          Divida esta tarefa em etapas menores.
        </Text>
        <AddStepForm onSubmit={createStep} />
      </View>
    );
  }

  return (
    <View style={{ gap: resolvedSpacing.sm }}>
      {/* Progress bar — only in complex mode */}
      {complexity === "complex" && totalSteps > 0 && (
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
                backgroundColor: resolvedColors.primary,
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
      )}

      {/* Completed steps section */}
      {completedSteps.length > 0 && (
        <View>
          <Pressable
            onPress={() => {
              LayoutAnimation.configureNext(
                LayoutAnimation.Presets.easeInEaseOut,
              );
              setShowAllStepsConcluded((prev) => !prev);
            }}
            accessibilityRole="button"
            accessibilityState={{ expanded: showAllStepsConcluded }}
            accessibilityLabel={
              showAllStepsConcluded
                ? "Ocultar etapas concluídas"
                : `Mostrar ${completedSteps.length} etapa${completedSteps.length === 1 ? "" : "s"} concluída${completedSteps.length === 1 ? "" : "s"}`
            }
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: resolvedSpacing.xs,
              paddingVertical: resolvedSpacing.xs,
            }}
          >
            {showAllStepsConcluded ? (
              <ChevronUp size={12} color={resolvedColors.mutedForeground} />
            ) : (
              <ChevronDown size={12} color={resolvedColors.mutedForeground} />
            )}
            <Text
              style={{
                fontSize: resolvedFontSizes.sm,
                color: resolvedColors.mutedForeground,
              }}
            >
              {showAllStepsConcluded
                ? "Ocultar etapas concluídas"
                : `${completedSteps.length} etapa${completedSteps.length === 1 ? "" : "s"} concluída${completedSteps.length === 1 ? "" : "s"}`}
            </Text>
          </Pressable>
          {showAllStepsConcluded &&
            completedSteps.map((step) => (
              <View
                key={step.id}
                style={{
                  paddingVertical: resolvedSpacing.xs,
                  paddingHorizontal: resolvedSpacing.sm,
                  borderRadius: resolvedBorderRadius.md,
                  backgroundColor: resolvedColors.muted + "66",
                  borderWidth: 2,
                  borderColor: resolvedColors.border + "4D",
                  opacity: 0.8,
                  gap: resolvedSpacing.xs,
                  marginBottom: resolvedSpacing.xs,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: resolvedSpacing.sm,
                  }}
                >
                  <Pressable
                    onPress={() => toggleStep(step.id, false)}
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: true }}
                    accessibilityLabel={`Desmarcar etapa: ${step.title}`}
                    hitSlop={8}
                    style={{
                      width: 22,
                      height: 22,
                      minWidth: 30,
                      minHeight: 30,
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
                  </Pressable>
                  <Text
                    style={{
                      flex: 1,
                      fontSize: resolvedFontSizes.sm,
                      color: resolvedColors.mutedForeground,
                      textDecorationLine: "line-through",
                    }}
                  >
                    {step.title}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    gap: 2,
                    paddingLeft: 38,
                  }}
                >
                  <Pressable
                    onPress={() => startEditing(step.id, step.title)}
                    hitSlop={8}
                    accessibilityRole="button"
                    accessibilityLabel={`Editar etapa: ${step.title}`}
                    style={{
                      minWidth: 44,
                      minHeight: 44,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Pencil size={12} color={resolvedColors.mutedForeground} />
                  </Pressable>
                  <Pressable
                    onPress={() => setDeletingStepId(step.id)}
                    hitSlop={8}
                    accessibilityRole="button"
                    accessibilityLabel={`Remover etapa: ${step.title}`}
                    style={{
                      minWidth: 44,
                      minHeight: 44,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Trash2 size={12} color={resolvedColors.mutedForeground} />
                  </Pressable>
                </View>
              </View>
            ))}
        </View>
      )}

      {/* Current prominent step */}
      {currentStep && (
        <View
          style={{
            gap: resolvedSpacing.xs,
            backgroundColor: resolvedColors.muted + "66",
            borderWidth: 2,
            borderColor: resolvedColors.ring,
            borderRadius: resolvedBorderRadius.md,
            paddingHorizontal: resolvedSpacing.sm,
            paddingVertical: resolvedSpacing.xs,
            opacity: animatingId === currentStep.id ? 0.85 : 1,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: resolvedSpacing.sm,
            }}
          >
            <Pressable
              onPress={() => toggleStep(currentStep.id, true)}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: false }}
              accessibilityLabel={`Concluir: ${currentStep.title}`}
              hitSlop={8}
              style={{
                width: 22,
                height: 22,
                minWidth: 30,
                minHeight: 30,
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
                paddingVertical: resolvedSpacing.xs,
              }}
            >
              {currentStep.title}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
              alignItems: "center",
              gap: 2,
              paddingLeft: 38,
            }}
          >
            <Pressable
              onPress={() => startEditing(currentStep.id, currentStep.title)}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel={`Editar etapa: ${currentStep.title}`}
              style={{
                minWidth: 44,
                minHeight: 44,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Pencil size={12} color={resolvedColors.mutedForeground} />
            </Pressable>
            <Pressable
              onPress={() => setDeletingStepId(currentStep.id)}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel={`Remover etapa: ${currentStep.title}`}
              style={{
                minWidth: 44,
                minHeight: 44,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Trash2 size={12} color={resolvedColors.mutedForeground} />
            </Pressable>
          </View>
        </View>
      )}

      {/* All done */}
      {allDone && (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: resolvedSpacing.xs,
          }}
        >
          <Check size={12} color={resolvedColors.primary} />
          <Text
            style={{
              fontSize: resolvedFontSizes.sm,
              color: resolvedColors.mutedForeground,
            }}
          >
            Todas as etapas concluídas!
          </Text>
        </View>
      )}

      {/* Upcoming steps — toggled */}
      {remainingCount > 0 && (
        <View>
          <Pressable
            onPress={() => {
              LayoutAnimation.configureNext(
                LayoutAnimation.Presets.easeInEaseOut,
              );
              setShowAll((prev) => !prev);
            }}
            accessibilityRole="button"
            accessibilityState={{ expanded: showAll }}
            accessibilityLabel={
              showAll
                ? "Ocultar etapas pendentes"
                : `${remainingCount} etapa${remainingCount === 1 ? "" : "s"} pendente${remainingCount === 1 ? "" : "s"}`
            }
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: resolvedSpacing.xs,
              paddingVertical: resolvedSpacing.xs,
            }}
          >
            {showAll ? (
              <ChevronUp size={12} color={resolvedColors.mutedForeground} />
            ) : (
              <ChevronDown size={12} color={resolvedColors.mutedForeground} />
            )}
            <Text
              style={{
                fontSize: resolvedFontSizes.sm,
                color: resolvedColors.mutedForeground,
              }}
            >
              {showAll
                ? "Ocultar etapas pendentes"
                : `${remainingCount} etapa${remainingCount === 1 ? "" : "s"} pendente${remainingCount === 1 ? "" : "s"}`}
            </Text>
          </Pressable>
          {showAll && (
            <View style={{ gap: resolvedSpacing.sm }}>
              {upcomingSteps.map((step) => (
                <View
                  key={step.id}
                  style={{
                    paddingVertical: resolvedSpacing.xs,
                    paddingHorizontal: resolvedSpacing.sm,
                    borderRadius: resolvedBorderRadius.md,
                    backgroundColor: resolvedColors.muted + "66",
                    borderWidth: 1,
                    borderColor: resolvedColors.border + "4D",
                    opacity: 0.8,
                    gap: resolvedSpacing.xs,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: resolvedSpacing.sm,
                    }}
                  >
                    <Pressable
                      onPress={() => toggleStep(step.id, true)}
                      accessibilityRole="checkbox"
                      accessibilityState={{ checked: false }}
                      accessibilityLabel={`Concluir: ${step.title}`}
                      hitSlop={8}
                      style={{
                        width: 22,
                        height: 22,
                        minWidth: 30,
                        minHeight: 30,
                        borderRadius: 11,
                        borderWidth: 2,
                        borderColor: resolvedColors.muted,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    />
                    <Text
                      style={{
                        flex: 1,
                        fontSize: resolvedFontSizes.sm,
                        color: resolvedColors.mutedForeground,
                      }}
                    >
                      {step.title}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "flex-end",
                      alignItems: "center",
                      gap: 2,
                      paddingLeft: 38,
                    }}
                  >
                    <Pressable
                      onPress={() => startEditing(step.id, step.title)}
                      hitSlop={8}
                      accessibilityRole="button"
                      accessibilityLabel={`Editar etapa: ${step.title}`}
                      style={{
                        minWidth: 44,
                        minHeight: 44,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Pencil
                        size={12}
                        color={resolvedColors.mutedForeground}
                      />
                    </Pressable>
                    <Pressable
                      onPress={() => setDeletingStepId(step.id)}
                      hitSlop={8}
                      accessibilityRole="button"
                      accessibilityLabel={`Remover etapa: ${step.title}`}
                      style={{
                        minWidth: 44,
                        minHeight: 44,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Trash2
                        size={12}
                        color={resolvedColors.mutedForeground}
                      />
                    </Pressable>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      )}

      {/* Add step form */}
      <AddStepForm onSubmit={createStep} />

      {/* Delete step confirmation */}
      <ConfirmDeleteDialog
        open={deletingStepId !== null}
        title="Excluir etapa?"
        description="Esta etapa será removida permanentemente. Esta ação não pode ser desfeita."
        onConfirm={() => {
          if (deletingStepId) deleteStep(deletingStepId);
          setDeletingStepId(null);
        }}
        onCancel={() => setDeletingStepId(null)}
      />

      {/* Edit step modal */}
      <StepFormModal
        visible={editingStep !== null}
        modalTitle="Editar etapa"
        saveLabel="Salvar"
        initialValue={editingStep?.title ?? ""}
        onSave={(title) => {
          if (editingStep) updateStep(editingStep.id, title);
          setEditingStep(null);
        }}
        onClose={() => setEditingStep(null)}
      />
    </View>
  );
}
