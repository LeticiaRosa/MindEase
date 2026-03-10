import { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  Pressable,
  TextInput,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useTheme } from "@/presentation/contexts/ThemePreferencesContext";
import { useOnboarding } from "@/presentation/contexts/OnboardingContext";
import { useRoutines } from "@/presentation/hooks/useRoutines";
import { useActiveRoutine } from "@/presentation/contexts/ActiveRoutineContext";
import { SupabaseTaskRepository } from "@/infrastructure/adapters/SupabaseTaskRepository";
import { CreateTask } from "@/application/useCases/CreateTask";
import { useAlert } from "@/presentation/contexts/AlertContext";
import { AppearancePreferencesPanel } from "@/presentation/components/AppearanceFloatingButton";

const taskRepository = new SupabaseTaskRepository();
const createTaskUseCase = new CreateTask(taskRepository);

export function GuidedOnboardingScreen() {
  const [title, setTitle] = useState("");
  const [createdTaskTitle, setCreatedTaskTitle] = useState("");
  const [savingTask, setSavingTask] = useState(false);

  const { state, start, nextStep, complete, skip } = useOnboarding();
  const { routines, isLoading: routinesLoading } = useRoutines();
  const { activeRoutineId, setActiveRoutineId } = useActiveRoutine();
  const { showAlert } = useAlert();
  const {
    resolvedColors,
    resolvedSpacing,
    resolvedFontSizes,
    resolvedBorderRadius,
    complexity,
    updatePreferences,
  } = useTheme();

  const step = state.currentStep;
  const effectiveRoutineId = useMemo(
    () => activeRoutineId ?? routines[0]?.id ?? "",
    [activeRoutineId, routines],
  );

  useEffect(() => {
    start().catch(() => {});
  }, [start]);

  useEffect(() => {
    if (activeRoutineId) {
      return;
    }

    const trabalhoRoutine = routines.find(
      (routine) =>
        routine.name.trim().toLocaleLowerCase("pt-BR") === "trabalho",
    );

    const defaultRoutine = trabalhoRoutine ?? routines[0];
    if (defaultRoutine?.id) {
      setActiveRoutineId(defaultRoutine.id);
    }
  }, [activeRoutineId, routines, setActiveRoutineId]);

  const finish = async () => {
    if (!effectiveRoutineId) {
      showAlert(
        "Atencao",
        "Crie ou selecione um Kanban para continuar",
        "info",
      );
      return;
    }

    try {
      setSavingTask(true);
      const normalizedTitle = title.trim();
      await createTaskUseCase.execute(effectiveRoutineId, normalizedTitle);
      setCreatedTaskTitle(normalizedTitle);
      await nextStep();
      showAlert("Sucesso", "Task criada no To Do", "success");
    } catch {
      showAlert("Erro", "Nao foi possivel criar a primeira tarefa", "error");
    } finally {
      setSavingTask(false);
    }
  };

  const completeFlow = async () => {
    try {
      await complete();
      showAlert("Sucesso", "Onboarding concluido", "success");
    } catch {
      showAlert("Erro", "Nao foi possivel concluir onboarding", "error");
    }
  };

  const skipFlow = async () => {
    try {
      await skip();
      showAlert("Sucesso", "Onboarding pulado", "success");
    } catch {
      showAlert("Erro", "Nao foi possivel pular onboarding", "error");
    }
  };

  const pill = (label: string, active: boolean, onPress: () => void) => (
    <Pressable
      key={label}
      onPress={onPress}
      style={{
        paddingHorizontal: resolvedSpacing.md,
        paddingVertical: resolvedSpacing.sm,
        borderRadius: resolvedBorderRadius.full,
        backgroundColor: active
          ? resolvedColors.primary
          : resolvedColors.accent,
      }}
    >
      <Text
        style={{
          color: active
            ? resolvedColors.primaryForeground
            : resolvedColors.textPrimary,
          fontSize: resolvedFontSizes.sm,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: resolvedColors.background,
        padding: resolvedSpacing.lg,
        justifyContent: "center",
      }}
    >
      <View
        style={{
          borderWidth: 1,
          borderColor: resolvedColors.border,
          borderRadius: resolvedBorderRadius.xl,
          backgroundColor: resolvedColors.card,
          padding: resolvedSpacing.lg,
          gap: resolvedSpacing.md,
        }}
      >
        <Text
          style={{
            color: resolvedColors.mutedForeground,
            fontSize: resolvedFontSizes.sm,
          }}
        >
          Passo {step} de 5
        </Text>
        <Text
          style={{
            color: resolvedColors.textPrimary,
            fontSize: resolvedFontSizes.xl,
            fontWeight: "600",
          }}
        >
          Configuracao guiada inicial
        </Text>

        {step === 1 && (
          <>
            <Text
              style={{
                color: resolvedColors.textSecondary,
                fontSize: resolvedFontSizes.sm,
              }}
            >
              Escolha o nivel de complexidade
            </Text>
            <View style={styles.row}>
              {pill("Simples", complexity === "simple", () =>
                updatePreferences({ complexity: "simple" }),
              )}
              {pill("Completo", complexity === "complex", () =>
                updatePreferences({ complexity: "complex" }),
              )}
            </View>
            <Pressable
              onPress={() => nextStep()}
              style={[
                styles.primaryButton,
                { backgroundColor: resolvedColors.primary },
              ]}
            >
              <Text style={{ color: resolvedColors.primaryForeground }}>
                Continuar
              </Text>
            </Pressable>
            <Pressable
              onPress={skipFlow}
              style={[
                styles.secondaryButton,
                { borderColor: resolvedColors.border },
              ]}
            >
              <Text style={{ color: resolvedColors.textPrimary }}>
                Pular onboarding
              </Text>
            </Pressable>
          </>
        )}

        {step === 2 && (
          <>
            <AppearancePreferencesPanel title="Ajuste visual para conforto" />
            <Pressable
              onPress={() => nextStep()}
              style={[
                styles.primaryButton,
                { backgroundColor: resolvedColors.primary },
              ]}
            >
              <Text style={{ color: resolvedColors.primaryForeground }}>
                Continuar
              </Text>
            </Pressable>
            <Pressable
              onPress={skipFlow}
              style={[
                styles.secondaryButton,
                { borderColor: resolvedColors.border },
              ]}
            >
              <Text style={{ color: resolvedColors.textPrimary }}>
                Pular onboarding
              </Text>
            </Pressable>
          </>
        )}

        {step === 3 && (
          <>
            <Text
              style={{
                color: resolvedColors.textSecondary,
                fontSize: resolvedFontSizes.sm,
              }}
            >
              Crie sua primeira tarefa para To Do
            </Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="Ex.: Revisar resumo da aula por 20 minutos"
              placeholderTextColor={resolvedColors.mutedForeground}
              editable={!savingTask && !routinesLoading}
              style={{
                borderWidth: 1,
                borderColor: resolvedColors.border,
                borderRadius: resolvedBorderRadius.md,
                paddingHorizontal: resolvedSpacing.md,
                paddingVertical: resolvedSpacing.sm,
                color: resolvedColors.textPrimary,
              }}
            />
            <Pressable
              disabled={savingTask || routinesLoading || !title.trim()}
              onPress={finish}
              style={({ pressed }) => [
                styles.primaryButton,
                {
                  backgroundColor: resolvedColors.primary,
                  opacity:
                    pressed || savingTask || routinesLoading || !title.trim()
                      ? 0.7
                      : 1,
                },
              ]}
            >
              {savingTask ? (
                <ActivityIndicator color={resolvedColors.primaryForeground} />
              ) : (
                <Text style={{ color: resolvedColors.primaryForeground }}>
                  Criar task e continuar
                </Text>
              )}
            </Pressable>
            <Pressable
              onPress={skipFlow}
              disabled={savingTask}
              style={[
                styles.secondaryButton,
                {
                  borderColor: resolvedColors.border,
                  opacity: savingTask ? 0.6 : 1,
                },
              ]}
            >
              <Text style={{ color: resolvedColors.textPrimary }}>
                Pular onboarding
              </Text>
            </Pressable>
          </>
        )}

        {step === 4 && (
          <>
            <Text
              style={{
                color: resolvedColors.textSecondary,
                fontSize: resolvedFontSizes.sm,
              }}
            >
              O que e um Kanban?
            </Text>
            <Text
              style={{
                color: resolvedColors.textSecondary,
                fontSize: resolvedFontSizes.sm,
              }}
            >
              Kanban e um quadro que organiza tarefas por etapa. No MindEase,
              voce comeca pelo card To Do, move para Doing quando iniciar e
              finaliza em Done quando concluir.
            </Text>
            <View style={[styles.kanbanRow, { gap: resolvedSpacing.sm }]}>
              <View
                style={[
                  styles.kanbanColumn,
                  {
                    borderColor: resolvedColors.border,
                    backgroundColor: resolvedColors.background,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.kanbanTitle,
                    { color: resolvedColors.textPrimary },
                  ]}
                >
                  To Do
                </Text>
                <View
                  style={[
                    styles.kanbanPlaceholder,
                    { borderColor: resolvedColors.border },
                  ]}
                >
                  <Text
                    style={{
                      color: resolvedColors.mutedForeground,
                      fontSize: resolvedFontSizes.xs,
                    }}
                  >
                    tarefas novas
                  </Text>
                </View>
              </View>
              <View
                style={[
                  styles.kanbanColumn,
                  {
                    borderColor: resolvedColors.border,
                    backgroundColor: resolvedColors.background,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.kanbanTitle,
                    { color: resolvedColors.textPrimary },
                  ]}
                >
                  Doing
                </Text>
                <View
                  style={[
                    styles.kanbanPlaceholder,
                    { borderColor: resolvedColors.border },
                  ]}
                >
                  <Text
                    style={{
                      color: resolvedColors.mutedForeground,
                      fontSize: resolvedFontSizes.xs,
                    }}
                  >
                    em andamento
                  </Text>
                </View>
              </View>
              <View
                style={[
                  styles.kanbanColumn,
                  {
                    borderColor: resolvedColors.border,
                    backgroundColor: resolvedColors.background,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.kanbanTitle,
                    { color: resolvedColors.textPrimary },
                  ]}
                >
                  Done
                </Text>
                <View
                  style={[
                    styles.kanbanPlaceholder,
                    { borderColor: resolvedColors.border },
                  ]}
                >
                  <Text
                    style={{
                      color: resolvedColors.mutedForeground,
                      fontSize: resolvedFontSizes.xs,
                    }}
                  >
                    concluidas
                  </Text>
                </View>
              </View>
            </View>
            <Pressable
              onPress={() => nextStep()}
              style={[
                styles.primaryButton,
                { backgroundColor: resolvedColors.primary },
              ]}
            >
              <Text style={{ color: resolvedColors.primaryForeground }}>
                Entendi, continuar
              </Text>
            </Pressable>
            <Pressable
              onPress={skipFlow}
              style={[
                styles.secondaryButton,
                { borderColor: resolvedColors.border },
              ]}
            >
              <Text style={{ color: resolvedColors.textPrimary }}>
                Pular onboarding
              </Text>
            </Pressable>
          </>
        )}

        {step === 5 && (
          <>
            <Text
              style={{
                color: resolvedColors.textSecondary,
                fontSize: resolvedFontSizes.sm,
              }}
            >
              Como sua task aparece no To Do
            </Text>
            <Text
              style={{
                color: resolvedColors.textSecondary,
                fontSize: resolvedFontSizes.sm,
              }}
            >
              A task criada no passo anterior entra automaticamente no card To
              Do. Isso acontece da mesma forma no mobile e na web.
            </Text>
            <View style={[styles.kanbanRow, { gap: resolvedSpacing.sm }]}>
              <View
                style={[
                  styles.kanbanColumn,
                  {
                    borderColor: resolvedColors.border,
                    backgroundColor: resolvedColors.background,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.kanbanTitle,
                    { color: resolvedColors.textPrimary },
                  ]}
                >
                  To Do
                </Text>
                <View
                  style={[
                    styles.taskCard,
                    {
                      borderColor: resolvedColors.border,
                      backgroundColor: resolvedColors.card,
                    },
                  ]}
                >
                  <Text
                    style={{
                      color: resolvedColors.textPrimary,
                      fontSize: resolvedFontSizes.xs,
                    }}
                  >
                    {createdTaskTitle || title.trim() || "Sua primeira task"}
                  </Text>
                </View>
              </View>
              <View
                style={[
                  styles.kanbanColumn,
                  {
                    borderColor: resolvedColors.border,
                    backgroundColor: resolvedColors.background,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.kanbanTitle,
                    { color: resolvedColors.textPrimary },
                  ]}
                >
                  Doing
                </Text>
                <View
                  style={[
                    styles.kanbanPlaceholder,
                    { borderColor: resolvedColors.border },
                  ]}
                >
                  <Text
                    style={{
                      color: resolvedColors.mutedForeground,
                      fontSize: resolvedFontSizes.xs,
                    }}
                  >
                    vazio
                  </Text>
                </View>
              </View>
              <View
                style={[
                  styles.kanbanColumn,
                  {
                    borderColor: resolvedColors.border,
                    backgroundColor: resolvedColors.background,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.kanbanTitle,
                    { color: resolvedColors.textPrimary },
                  ]}
                >
                  Done
                </Text>
                <View
                  style={[
                    styles.kanbanPlaceholder,
                    { borderColor: resolvedColors.border },
                  ]}
                >
                  <Text
                    style={{
                      color: resolvedColors.mutedForeground,
                      fontSize: resolvedFontSizes.xs,
                    }}
                  >
                    vazio
                  </Text>
                </View>
              </View>
            </View>
            <Pressable
              onPress={completeFlow}
              style={[
                styles.primaryButton,
                { backgroundColor: resolvedColors.primary },
              ]}
            >
              <Text style={{ color: resolvedColors.primaryForeground }}>
                Concluir onboarding
              </Text>
            </Pressable>
            <Pressable
              onPress={skipFlow}
              style={[
                styles.secondaryButton,
                { borderColor: resolvedColors.border },
              ]}
            >
              <Text style={{ color: resolvedColors.textPrimary }}>
                Pular onboarding
              </Text>
            </Pressable>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  block: {
    gap: 8,
  },
  kanbanRow: {
    flexDirection: "row",
    alignItems: "stretch",
  },
  kanbanColumn: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    padding: 8,
    gap: 6,
  },
  kanbanTitle: {
    fontSize: 12,
    fontWeight: "600",
  },
  kanbanPlaceholder: {
    minHeight: 44,
    borderWidth: 1,
    borderStyle: "dashed",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
  },
  taskCard: {
    minHeight: 44,
    borderWidth: 1,
    borderRadius: 8,
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  primaryButton: {
    minHeight: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  secondaryButton: {
    minHeight: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    borderWidth: 1,
  },
});
