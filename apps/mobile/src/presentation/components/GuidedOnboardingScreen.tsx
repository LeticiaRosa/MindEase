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
  const [savingTask, setSavingTask] = useState(false);

  const { state, start, nextStep, complete } = useOnboarding();
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
    if (!activeRoutineId && routines[0]?.id) {
      setActiveRoutineId(routines[0].id);
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
      await createTaskUseCase.execute(effectiveRoutineId, title.trim());
      await complete();
      showAlert("Sucesso", "Onboarding concluido", "success");
    } catch {
      showAlert("Erro", "Nao foi possivel criar a primeira tarefa", "error");
    } finally {
      setSavingTask(false);
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
          Passo {step} de 3
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
              Crie sua primeira tarefa
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
                  Concluir onboarding
                </Text>
              )}
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
  primaryButton: {
    minHeight: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
});
