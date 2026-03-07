import { useState } from "react";
import {
  View,
  Text,
  Pressable,
  TextInput,
  LayoutAnimation,
  Modal,
  KeyboardAvoidingView,
  Platform,
  UIManager,
} from "react-native";
import { Pencil, Trash2 } from "lucide-react-native";
import { useSmartChecklist } from "@/presentation/hooks/useSmartChecklist";
import { AddStepForm } from "./AddStepForm";
import { ConfirmDeleteDialog } from "./ConfirmDeleteDialog";
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
    resolvedColors,
    resolvedFontSizes,
    resolvedSpacing,
    resolvedBorderRadius,
  } = useTheme();

  const defaultExpanded = mode === "detail";
  const [showCompleted, setShowCompleted] = useState(false);
  const [showUpcoming, setShowUpcoming] = useState(defaultExpanded);
  const [editingStep, setEditingStep] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const [deletingStepId, setDeletingStepId] = useState<string | null>(null);

  const upcomingSteps = incompleteSteps.slice(1);

  const startEditing = (id: string, currentTitle: string) => {
    setEditingStep({ id, title: currentTitle });
  };

  const saveEditing = () => {
    if (editingStep && editingStep.title.trim()) {
      updateStep(editingStep.id, editingStep.title.trim());
    }
    setEditingStep(null);
  };

  const cancelEditing = () => {
    setEditingStep(null);
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
      {/* Progress bar */}
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

      {/* All done */}
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
      {/* Completed steps section */}
      {completedSteps.length > 0 && (
        <View>
          <Pressable
            onPress={() => {
              LayoutAnimation.configureNext(
                LayoutAnimation.Presets.easeInEaseOut,
              );
              setShowCompleted((prev) => !prev);
            }}
            accessibilityRole="button"
            accessibilityLabel={`${showCompleted ? "Ocultar" : "Mostrar"} ${completedSteps.length} etapa${completedSteps.length > 1 ? "s" : ""} concluída${completedSteps.length > 1 ? "s" : ""}`}
            style={{ paddingVertical: resolvedSpacing.xs }}
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
              <View
                key={step.id}
                style={{
                  paddingVertical: resolvedSpacing.xs,
                  paddingHorizontal: resolvedSpacing.sm,
                  opacity: 0.6,
                  gap: resolvedSpacing.xs,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: resolvedSpacing.md,
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
                    alignItems: "center",
                    paddingLeft: 38,
                  }}
                >
                  <Pressable
                    onPress={() => startEditing(step.id, step.title)}
                    hitSlop={8}
                    accessibilityRole="button"
                    accessibilityLabel="Editar etapa"
                    style={{
                      minWidth: 44,
                      minHeight: 44,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Pencil size={14} color={resolvedColors.mutedForeground} />
                  </Pressable>
                  <Pressable
                    onPress={() => deleteStep(step.id)}
                    hitSlop={8}
                    accessibilityRole="button"
                    accessibilityLabel="Remover etapa"
                    style={{
                      minWidth: 44,
                      minHeight: 44,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Trash2 size={14} color={resolvedColors.mutedForeground} />
                  </Pressable>
                </View>
              </View>
            ))}
        </View>
      )}
      {/* Current step */}
      {currentStep && (
        <View
          style={{
            gap: resolvedSpacing.xs,
            backgroundColor: resolvedColors.card,
            borderWidth: 2,
            borderColor: resolvedColors.ring,
            borderRadius: resolvedBorderRadius.md,
            paddingHorizontal: resolvedSpacing.sm,
            paddingVertical: resolvedSpacing.xs,
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
              accessibilityLabel={`Marcar etapa como concluída: ${currentStep.title}`}
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
              }}
            >
              {currentStep.title}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingLeft: 38,
            }}
          >
            <Pressable
              onPress={() => startEditing(currentStep.id, currentStep.title)}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Editar etapa"
              style={{
                minWidth: 44,
                minHeight: 44,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Pencil size={16} color={resolvedColors.mutedForeground} />
            </Pressable>
            <Pressable
              onPress={() => setDeletingStepId(currentStep.id)}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Remover etapa"
              style={{
                minWidth: 44,
                minHeight: 44,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Trash2 size={16} color={resolvedColors.mutedForeground} />
            </Pressable>
          </View>
        </View>
      )}

      {/* Upcoming steps section */}
      {upcomingSteps.length > 0 && (
        <View>
          <Pressable
            onPress={() => {
              LayoutAnimation.configureNext(
                LayoutAnimation.Presets.easeInEaseOut,
              );
              setShowUpcoming((prev) => !prev);
            }}
            accessibilityRole="button"
            accessibilityLabel={`${showUpcoming ? "Ocultar" : "Mostrar"} ${upcomingSteps.length} etapa${upcomingSteps.length > 1 ? "s" : ""} restante${upcomingSteps.length > 1 ? "s" : ""}`}
            style={{ paddingVertical: resolvedSpacing.xs }}
          >
            <Text
              style={{
                fontSize: resolvedFontSizes.sm,
                color: resolvedColors.mutedForeground,
              }}
            >
              {showUpcoming ? "▼" : "▶"} +{upcomingSteps.length} etapa
              {upcomingSteps.length > 1 ? "s" : ""} restante
              {upcomingSteps.length > 1 ? "s" : ""}
            </Text>
          </Pressable>
          {showUpcoming &&
            upcomingSteps.map((step) => (
              <View
                key={step.id}
                style={{
                  paddingVertical: resolvedSpacing.xs,
                  paddingHorizontal: resolvedSpacing.sm,
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
                    accessibilityLabel={`Marcar etapa como concluída: ${step.title}`}
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
                    alignItems: "center",
                    paddingLeft: 38,
                  }}
                >
                  <Pressable
                    onPress={() => startEditing(step.id, step.title)}
                    hitSlop={8}
                    accessibilityRole="button"
                    accessibilityLabel="Editar etapa"
                    style={{
                      minWidth: 44,
                      minHeight: 44,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Pencil size={14} color={resolvedColors.mutedForeground} />
                  </Pressable>
                  <Pressable
                    onPress={() => setDeletingStepId(step.id)}
                    hitSlop={8}
                    accessibilityRole="button"
                    accessibilityLabel="Remover etapa"
                    style={{
                      minWidth: 44,
                      minHeight: 44,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Trash2 size={14} color={resolvedColors.mutedForeground} />
                  </Pressable>
                </View>
              </View>
            ))}
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
      <Modal
        visible={editingStep !== null}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={cancelEditing}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1, backgroundColor: resolvedColors.background }}
        >
          {/* Header */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              padding: resolvedSpacing.lg,
              borderBottomWidth: 1,
              borderBottomColor: resolvedColors.border,
            }}
          >
            <Pressable
              onPress={cancelEditing}
              accessibilityRole="button"
              accessibilityLabel="Cancelar edição"
            >
              <Text
                style={{
                  color: resolvedColors.mutedForeground,
                  fontSize: resolvedFontSizes.base,
                }}
              >
                Cancelar
              </Text>
            </Pressable>
            <Text
              style={{
                fontSize: resolvedFontSizes.lg,
                fontWeight: "600",
                color: resolvedColors.textPrimary,
              }}
            >
              Editar Etapa
            </Text>
            <Pressable
              onPress={saveEditing}
              accessibilityRole="button"
              accessibilityLabel="Salvar edição"
            >
              <Text
                style={{
                  color: resolvedColors.primary,
                  fontSize: resolvedFontSizes.base,
                  fontWeight: "600",
                  opacity: editingStep?.title.trim() ? 1 : 0.4,
                }}
              >
                Salvar
              </Text>
            </Pressable>
          </View>

          {/* Body */}
          <View
            style={{
              padding: resolvedSpacing.lg,
              gap: resolvedSpacing.xs,
            }}
          >
            <Text
              style={{
                fontSize: resolvedFontSizes.sm,
                fontWeight: "600",
                color: resolvedColors.mutedForeground,
              }}
            >
              Título
            </Text>
            <TextInput
              value={editingStep?.title}
              onChangeText={(text) =>
                setEditingStep((prev) =>
                  prev ? { ...prev, title: text } : null,
                )
              }
              placeholder="Nome da etapa"
              placeholderTextColor={resolvedColors.mutedForeground}
              multiline
              numberOfLines={12}
              textAlignVertical="top"
              style={{
                backgroundColor: resolvedColors.card,
                borderWidth: 1,
                borderColor: resolvedColors.border,
                borderRadius: resolvedBorderRadius.md,
                paddingHorizontal: resolvedSpacing.md,
                paddingVertical: resolvedSpacing.sm,
                fontSize: resolvedFontSizes.base,
                color: resolvedColors.textPrimary,
                minHeight: 200,
              }}
            />
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}
