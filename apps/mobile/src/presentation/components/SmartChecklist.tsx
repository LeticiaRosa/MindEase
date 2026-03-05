import { useState } from "react";
import {
  View,
  Text,
  Pressable,
  TextInput,
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
  const [editingStepId, setEditingStepId] = useState<string | null>(null);
  const [editingStepValue, setEditingStepValue] = useState("");

  const upcomingSteps = incompleteSteps.slice(1);

  const startEditing = (id: string, currentTitle: string) => {
    setEditingStepId(id);
    setEditingStepValue(currentTitle);
  };

  const saveEditing = () => {
    if (editingStepId && editingStepValue.trim()) {
      updateStep(editingStepId, editingStepValue.trim());
    }
    setEditingStepId(null);
    setEditingStepValue("");
  };

  const cancelEditing = () => {
    setEditingStepId(null);
    setEditingStepValue("");
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
                  flexDirection: "row",
                  alignItems: "center",
                  gap: resolvedSpacing.md,
                  paddingVertical: resolvedSpacing.xs,
                  paddingHorizontal: resolvedSpacing.sm,
                  opacity: 0.6,
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
                {editingStepId === step.id ? (
                  <View style={{ flex: 1, gap: resolvedSpacing.xs }}>
                    <TextInput
                      value={editingStepValue}
                      onChangeText={setEditingStepValue}
                      onSubmitEditing={saveEditing}
                      returnKeyType="done"
                      autoFocus
                      style={{
                        fontSize: resolvedFontSizes.sm,
                        color: resolvedColors.textPrimary,
                        borderBottomWidth: 1,
                        borderBottomColor: resolvedColors.ring,
                        paddingVertical: resolvedSpacing.xs,
                      }}
                    />
                    <View
                      style={{ flexDirection: "row", gap: resolvedSpacing.sm }}
                    >
                      <Pressable
                        onPress={saveEditing}
                        accessibilityRole="button"
                        accessibilityLabel="Salvar edição"
                        style={{
                          paddingHorizontal: resolvedSpacing.sm,
                          paddingVertical: resolvedSpacing.xs,
                          backgroundColor: resolvedColors.primary,
                          borderRadius: resolvedBorderRadius.sm,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: resolvedFontSizes.xs,
                            color: resolvedColors.primaryForeground,
                            fontWeight: "600",
                          }}
                        >
                          Salvar
                        </Text>
                      </Pressable>
                      <Pressable
                        onPress={cancelEditing}
                        accessibilityRole="button"
                        accessibilityLabel="Cancelar edição"
                        style={{
                          paddingHorizontal: resolvedSpacing.sm,
                          paddingVertical: resolvedSpacing.xs,
                          backgroundColor: resolvedColors.muted,
                          borderRadius: resolvedBorderRadius.sm,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: resolvedFontSizes.xs,
                            color: resolvedColors.mutedForeground,
                            fontWeight: "600",
                          }}
                        >
                          Cancelar
                        </Text>
                      </Pressable>
                    </View>
                  </View>
                ) : (
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
                )}
                {editingStepId !== step.id && (
                  <>
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
                      <Text
                        style={{
                          color: resolvedColors.mutedForeground,
                          fontSize: resolvedFontSizes.sm,
                        }}
                      >
                        ✎
                      </Text>
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
                      <Text
                        style={{
                          color: resolvedColors.mutedForeground,
                          fontSize: resolvedFontSizes.sm,
                        }}
                      >
                        ✕
                      </Text>
                    </Pressable>
                  </>
                )}
              </View>
            ))}
        </View>
      )}
      {/* Current step */}
      {currentStep && (
        <View
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
          {editingStepId === currentStep.id ? (
            <View style={{ flex: 1, gap: resolvedSpacing.xs }}>
              <TextInput
                value={editingStepValue}
                onChangeText={setEditingStepValue}
                onSubmitEditing={saveEditing}
                returnKeyType="done"
                autoFocus
                style={{
                  fontSize: resolvedFontSizes.base,
                  color: resolvedColors.textPrimary,
                  borderBottomWidth: 1,
                  borderBottomColor: resolvedColors.ring,
                  paddingVertical: resolvedSpacing.xs,
                }}
              />
              <View style={{ flexDirection: "row", gap: resolvedSpacing.sm }}>
                <Pressable
                  onPress={saveEditing}
                  accessibilityRole="button"
                  accessibilityLabel="Salvar edição"
                  style={{
                    paddingHorizontal: resolvedSpacing.sm,
                    paddingVertical: resolvedSpacing.xs,
                    backgroundColor: resolvedColors.primary,
                    borderRadius: resolvedBorderRadius.sm,
                  }}
                >
                  <Text
                    style={{
                      fontSize: resolvedFontSizes.xs,
                      color: resolvedColors.primaryForeground,
                      fontWeight: "600",
                    }}
                  >
                    Salvar
                  </Text>
                </Pressable>
                <Pressable
                  onPress={cancelEditing}
                  accessibilityRole="button"
                  accessibilityLabel="Cancelar edição"
                  style={{
                    paddingHorizontal: resolvedSpacing.sm,
                    paddingVertical: resolvedSpacing.xs,
                    backgroundColor: resolvedColors.muted,
                    borderRadius: resolvedBorderRadius.sm,
                  }}
                >
                  <Text
                    style={{
                      fontSize: resolvedFontSizes.xs,
                      color: resolvedColors.mutedForeground,
                      fontWeight: "600",
                    }}
                  >
                    Cancelar
                  </Text>
                </Pressable>
              </View>
            </View>
          ) : (
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
          )}
          {editingStepId !== currentStep.id && (
            <>
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
                <Text
                  style={{
                    color: resolvedColors.mutedForeground,
                    fontSize: resolvedFontSizes.base,
                  }}
                >
                  ✎
                </Text>
              </Pressable>
              <Pressable
                onPress={() => deleteStep(currentStep.id)}
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
                <Text
                  style={{
                    color: resolvedColors.mutedForeground,
                    fontSize: resolvedFontSizes.base,
                  }}
                >
                  ✕
                </Text>
              </Pressable>
            </>
          )}
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
                  flexDirection: "row",
                  alignItems: "center",
                  gap: resolvedSpacing.sm,
                  paddingVertical: resolvedSpacing.xs,
                  paddingHorizontal: resolvedSpacing.sm,
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
                {editingStepId === step.id ? (
                  <View style={{ flex: 1, gap: resolvedSpacing.xs }}>
                    <TextInput
                      value={editingStepValue}
                      onChangeText={setEditingStepValue}
                      onSubmitEditing={saveEditing}
                      returnKeyType="done"
                      autoFocus
                      style={{
                        fontSize: resolvedFontSizes.sm,
                        color: resolvedColors.textPrimary,
                        borderBottomWidth: 1,
                        borderBottomColor: resolvedColors.ring,
                        paddingVertical: resolvedSpacing.xs,
                      }}
                    />
                    <View
                      style={{ flexDirection: "row", gap: resolvedSpacing.sm }}
                    >
                      <Pressable
                        onPress={saveEditing}
                        accessibilityRole="button"
                        accessibilityLabel="Salvar edição"
                        style={{
                          paddingHorizontal: resolvedSpacing.sm,
                          paddingVertical: resolvedSpacing.xs,
                          backgroundColor: resolvedColors.primary,
                          borderRadius: resolvedBorderRadius.sm,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: resolvedFontSizes.xs,
                            color: resolvedColors.primaryForeground,
                            fontWeight: "600",
                          }}
                        >
                          Salvar
                        </Text>
                      </Pressable>
                      <Pressable
                        onPress={cancelEditing}
                        accessibilityRole="button"
                        accessibilityLabel="Cancelar edição"
                        style={{
                          paddingHorizontal: resolvedSpacing.sm,
                          paddingVertical: resolvedSpacing.xs,
                          backgroundColor: resolvedColors.muted,
                          borderRadius: resolvedBorderRadius.sm,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: resolvedFontSizes.xs,
                            color: resolvedColors.mutedForeground,
                            fontWeight: "600",
                          }}
                        >
                          Cancelar
                        </Text>
                      </Pressable>
                    </View>
                  </View>
                ) : (
                  <Text
                    style={{
                      flex: 1,
                      fontSize: resolvedFontSizes.sm,
                      color: resolvedColors.mutedForeground,
                    }}
                  >
                    {step.title}
                  </Text>
                )}
                {editingStepId !== step.id && (
                  <>
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
                      <Text
                        style={{
                          color: resolvedColors.mutedForeground,
                          fontSize: resolvedFontSizes.sm,
                        }}
                      >
                        ✎
                      </Text>
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
                      <Text
                        style={{
                          color: resolvedColors.mutedForeground,
                          fontSize: resolvedFontSizes.sm,
                        }}
                      >
                        ✕
                      </Text>
                    </Pressable>
                  </>
                )}
              </View>
            ))}
        </View>
      )}

      {/* Add step form */}
      <AddStepForm onSubmit={createStep} />
    </View>
  );
}
