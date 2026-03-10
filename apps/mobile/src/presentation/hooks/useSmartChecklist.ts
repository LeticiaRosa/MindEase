import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAlert } from "@/presentation/contexts/AlertContext";
import { taskRepository as repository } from "@/infrastructure/factories/repositories";
import { ToggleChecklistStep } from "@/application/useCases/ToggleChecklistStep";
import { AddChecklistStep } from "@/application/useCases/AddChecklistStep";
import { DeleteChecklistStep } from "@/application/useCases/DeleteChecklistStep";
import { UpdateChecklistStep } from "@/application/useCases/UpdateChecklistStep";
import type { ChecklistStep } from "@/domain/entities/ChecklistStep";

const toggleStep = new ToggleChecklistStep(repository);
const createStep = new AddChecklistStep(repository);
const deleteStep = new DeleteChecklistStep(repository);
const updateStepUseCase = new UpdateChecklistStep(repository);

export function useSmartChecklist(taskId: string) {
  const queryClient = useQueryClient();
  const { showAlert } = useAlert();
  const qKey = ["checklist_steps", taskId];

  const { data: steps = [] } = useQuery<ChecklistStep[]>({
    queryKey: qKey,
    queryFn: () => repository.getChecklistSteps(taskId),
  });

  const completedSteps = steps
    .filter((s) => s.completed)
    .sort((a, b) => a.position - b.position);
  const incompleteSteps = steps
    .filter((s) => !s.completed)
    .sort((a, b) => a.position - b.position);
  const currentStep = incompleteSteps[0] ?? null;
  const remainingCount = Math.max(0, incompleteSteps.length - 1);
  const allDone = steps.length > 0 && incompleteSteps.length === 0;

  const toggleMutation = useMutation({
    mutationFn: ({ id, completed }: { id: string; completed: boolean }) =>
      toggleStep.execute(id, completed),
    onMutate: async ({ id, completed }) => {
      await queryClient.cancelQueries({ queryKey: qKey });
      const previous = queryClient.getQueryData<ChecklistStep[]>(qKey);
      queryClient.setQueryData<ChecklistStep[]>(qKey, (old = []) =>
        old.map((s) => (s.id === id ? { ...s, completed } : s)),
      );
      return { previous };
    },
    onError: (_, __, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(qKey, ctx.previous);
      showAlert("Erro", "Falha ao atualizar etapa", "error");
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: qKey }),
  });

  const createMutation = useMutation({
    mutationFn: (title: string) => createStep.execute(taskId, title),
    onMutate: async (title) => {
      await queryClient.cancelQueries({ queryKey: qKey });
      const previous = queryClient.getQueryData<ChecklistStep[]>(qKey);
      const optimistic: ChecklistStep = {
        id: `optimistic-${Date.now()}`,
        taskId,
        title,
        completed: false,
        position: steps.length,
        createdAt: new Date().toISOString(),
      };
      queryClient.setQueryData<ChecklistStep[]>(qKey, (old = []) => [
        ...old,
        optimistic,
      ]);
      return { previous };
    },
    onSuccess: () => {
      showAlert("Sucesso", "Etapa adicionada", "success");
    },
    onError: (_, __, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(qKey, ctx.previous);
      showAlert("Erro", "Falha ao adicionar step", "error");
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: qKey }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteStep.execute(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: qKey });
      const previous = queryClient.getQueryData<ChecklistStep[]>(qKey);
      queryClient.setQueryData<ChecklistStep[]>(qKey, (old = []) =>
        old.filter((s) => s.id !== id),
      );
      return { previous };
    },
    onSuccess: () => {
      showAlert("Sucesso", "Etapa removida", "success");
    },
    onError: (_, __, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(qKey, ctx.previous);
      showAlert("Erro", "Falha ao remover etapa", "error");
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: qKey }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, title }: { id: string; title: string }) =>
      updateStepUseCase.execute(id, title),
    onMutate: async ({ id, title }) => {
      await queryClient.cancelQueries({ queryKey: qKey });
      const previous = queryClient.getQueryData<ChecklistStep[]>(qKey);
      queryClient.setQueryData<ChecklistStep[]>(qKey, (old = []) =>
        old.map((s) => (s.id === id ? { ...s, title } : s)),
      );
      return { previous };
    },
    onSuccess: () => {
      showAlert("Sucesso", "Etapa atualizada", "success");
    },
    onError: (_, __, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(qKey, ctx.previous);
      showAlert("Erro", "Falha ao atualizar etapa", "error");
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: qKey }),
  });

  return {
    steps,
    completedSteps,
    incompleteSteps,
    currentStep,
    remainingCount,
    allDone,
    totalSteps: steps.length,
    completedCount: completedSteps.length,
    toggleStep: (id: string, completed: boolean) =>
      toggleMutation.mutate({ id, completed }),
    createStep: createMutation.mutate,
    deleteStep: deleteMutation.mutate,
    updateStep: (id: string, title: string) =>
      updateMutation.mutate({ id, title }),
  };
}
