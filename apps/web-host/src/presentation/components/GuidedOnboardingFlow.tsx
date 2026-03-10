import { FormEvent, useEffect, useMemo, useState } from "react";
import { Button, Input, useToast } from "@repo/ui";
import { useThemePreferences } from "@/presentation/contexts/ThemePreferencesContext";
import { useOnboarding } from "@/presentation/contexts/OnboardingContext";
import { useRoutines } from "@/presentation/hooks/useRoutines";
import { useActiveRoutine } from "@/presentation/hooks/useActiveRoutine";
import { AppearanceMenuPanel } from "@/presentation/components/AppearanceMenuPanel";
import { SupabaseTaskRepository } from "@/infrastructure/adapters/SupabaseTaskRepository";
import { CreateTask } from "@/application/useCases/CreateTask";

const taskRepository = new SupabaseTaskRepository();
const createTaskUseCase = new CreateTask(taskRepository);

export function GuidedOnboardingFlow() {
  const toast = useToast();
  const [title, setTitle] = useState("");
  const [savingTask, setSavingTask] = useState(false);

  const { state, start, nextStep, complete } = useOnboarding();
  const { updatePreferences, complexity } = useThemePreferences();
  const { routines, isLoading: routinesLoading } = useRoutines();
  const { activeRoutineId, setActiveRoutineId } = useActiveRoutine();

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

  const handleCreateFirstTask = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!effectiveRoutineId) {
      toast.error("Crie ou selecione um Kanban para continuar");
      return;
    }

    try {
      setSavingTask(true);
      await createTaskUseCase.execute(effectiveRoutineId, title);
      await complete();
      toast.success("Onboarding concluido. Bem-vindo ao MindEase!");
    } catch {
      toast.error("Nao foi possivel criar a primeira tarefa");
    } finally {
      setSavingTask(false);
    }
  };

  return (
    <section className="min-h-screen bg-background px-6 py-8 flex items-center justify-center">
      <div className="w-full max-w-2xl rounded-2xl border border-border bg-card p-8 shadow-sm space-y-6">
        <header className="space-y-2">
          <p className="text-sm text-muted-foreground">Passo {step} de 3</p>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Configuração guiada inicial
          </h1>
          <p className="text-sm text-muted-foreground">
            Vamos ajustar o app para você com menos sobrecarga e mais foco.
          </p>
        </header>

        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-foreground">
              Escolha o nível de complexidade
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <Button
                variant={complexity === "simple" ? "default" : "outline"}
                className="h-auto py-4"
                onClick={() => updatePreferences({ complexity: "simple" })}
              >
                Simples: menos decisões por tela
              </Button>
              <Button
                variant={complexity === "complex" ? "default" : "outline"}
                className="h-auto py-4"
                onClick={() => updatePreferences({ complexity: "complex" })}
              >
                Completo: mais opções e atalhos
              </Button>
            </div>
            <Button className="w-full" onClick={() => nextStep()}>
              Continuar
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <h2 className="text-lg font-medium text-foreground">
              Ajuste visual para conforto
            </h2>
            <AppearanceMenuPanel alwaysOpen />
            <Button className="w-full" onClick={() => nextStep()}>
              Continuar
            </Button>
          </div>
        )}

        {step === 3 && (
          <form className="space-y-4" onSubmit={handleCreateFirstTask}>
            <h2 className="text-lg font-medium text-foreground">
              Crie sua primeira tarefa
            </h2>
            <p className="text-sm text-muted-foreground">
              Digite uma tarefa pequena para iniciar com clareza.
            </p>
            <Input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Ex.: Revisar resumo da aula por 20 minutos"
              disabled={savingTask || routinesLoading}
              required
            />
            <Button
              type="submit"
              className="w-full"
              disabled={savingTask || routinesLoading || !title.trim()}
            >
              {savingTask ? "Finalizando..." : "Concluir onboarding"}
            </Button>
          </form>
        )}
      </div>
    </section>
  );
}
