import { type FormEvent, useEffect, useMemo, useState } from "react";
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
  const [createdTaskTitle, setCreatedTaskTitle] = useState("");
  const [savingTask, setSavingTask] = useState(false);

  const { state, start, nextStep, complete, skip } = useOnboarding();
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

  const handleCreateFirstTask = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!effectiveRoutineId) {
      toast.error("Crie ou selecione um Kanban para continuar");
      return;
    }

    try {
      setSavingTask(true);
      const normalizedTitle = title.trim();
      await createTaskUseCase.execute(effectiveRoutineId, normalizedTitle);
      setCreatedTaskTitle(normalizedTitle);
      await nextStep();
      toast.success("Task criada no To Do. Vamos visualizar no quadro.");
    } catch {
      toast.error("Nao foi possivel criar a primeira tarefa");
    } finally {
      setSavingTask(false);
    }
  };

  const handleCompleteOnboarding = async () => {
    try {
      await complete();
      toast.success("Onboarding concluido. Bem-vindo ao MindEase!");
    } catch {
      toast.error("Nao foi possivel concluir onboarding");
    }
  };

  const handleSkipOnboarding = async () => {
    try {
      await skip();
      toast.success("Onboarding pulado. Você pode refazer no menu de usuário.");
    } catch {
      toast.error("Nao foi possivel pular onboarding");
    }
  };

  return (
    <section className="min-h-screen bg-background px-6 py-8 flex items-center justify-center">
      <div className="w-full max-w-2xl rounded-2xl border border-border bg-card p-8 shadow-sm space-y-6">
        <header className="space-y-2">
          <p className="text-sm text-muted-foreground">Passo {step} de 5</p>
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
            <Button
              variant="ghost"
              className="w-full"
              onClick={handleSkipOnboarding}
            >
              Pular onboarding
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
            <Button
              variant="ghost"
              className="w-full"
              onClick={handleSkipOnboarding}
            >
              Pular onboarding
            </Button>
          </div>
        )}

        {step === 3 && (
          <form className="space-y-4" onSubmit={handleCreateFirstTask}>
            <h2 className="text-lg font-medium text-foreground">
              Crie sua primeira tarefa para To Do
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
              {savingTask ? "Criando task..." : "Criar task e continuar"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={handleSkipOnboarding}
              disabled={savingTask}
            >
              Pular onboarding
            </Button>
          </form>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-foreground">
              O que é um Kanban
            </h2>
            <p className="text-sm text-muted-foreground">
              Kanban é um quadro para organizar tarefas por etapa. No MindEase,
              você começa em To Do, move para Doing ao iniciar e marca como Done
              quando concluir.
            </p>
            <div
              className="grid gap-3 sm:grid-cols-3"
              aria-label="Desenho simples de kanban"
            >
              <div className="rounded-lg border border-border bg-background p-3">
                <p className="text-xs font-medium text-foreground">To Do</p>
                <div className="mt-2 rounded-md border border-dashed border-border px-2 py-3 text-center text-xs text-muted-foreground">
                  tarefas novas
                </div>
              </div>
              <div className="rounded-lg border border-border bg-background p-3">
                <p className="text-xs font-medium text-foreground">Doing</p>
                <div className="mt-2 rounded-md border border-dashed border-border px-2 py-3 text-center text-xs text-muted-foreground">
                  em andamento
                </div>
              </div>
              <div className="rounded-lg border border-border bg-background p-3">
                <p className="text-xs font-medium text-foreground">Done</p>
                <div className="mt-2 rounded-md border border-dashed border-border px-2 py-3 text-center text-xs text-muted-foreground">
                  concluidas
                </div>
              </div>
            </div>
            <Button className="w-full" onClick={() => nextStep()}>
              Entendi, continuar
            </Button>
            <Button
              variant="ghost"
              className="w-full"
              onClick={handleSkipOnboarding}
            >
              Pular onboarding
            </Button>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-foreground">
              Como sua task aparece no To Do
            </h2>
            <p className="text-sm text-muted-foreground">
              A task criada no passo anterior entra automaticamente no card To
              Do. Esse comportamento é igual no mobile e no web.
            </p>
            <div
              className="grid gap-3 sm:grid-cols-3"
              aria-label="Desenho completo do quadro com task"
            >
              <div className="rounded-lg border border-border bg-background p-3">
                <p className="text-xs font-medium text-foreground">To Do</p>
                <div className="mt-2 rounded-md border border-border bg-card px-2 py-2 text-xs text-foreground">
                  {createdTaskTitle || title.trim() || "Sua primeira task"}
                </div>
              </div>
              <div className="rounded-lg border border-border bg-background p-3">
                <p className="text-xs font-medium text-foreground">Doing</p>
                <div className="mt-2 rounded-md border border-dashed border-border px-2 py-3 text-center text-xs text-muted-foreground">
                  vazio
                </div>
              </div>
              <div className="rounded-lg border border-border bg-background p-3">
                <p className="text-xs font-medium text-foreground">Done</p>
                <div className="mt-2 rounded-md border border-dashed border-border px-2 py-3 text-center text-xs text-muted-foreground">
                  vazio
                </div>
              </div>
            </div>
            <Button className="w-full" onClick={handleCompleteOnboarding}>
              Concluir onboarding
            </Button>
            <Button
              variant="ghost"
              className="w-full"
              onClick={handleSkipOnboarding}
            >
              Pular onboarding
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
