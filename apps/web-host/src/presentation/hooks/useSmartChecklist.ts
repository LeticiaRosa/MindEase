import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@repo/ui";

import { SupabaseTaskRepository } from "@/infrastructure/adapters/SupabaseTaskRepository";
import { ToggleChecklistStep } from "@/application/useCases/ToggleChecklistStep";
import { CreateChecklistStep } from "@/application/useCases/CreateChecklistStep";
import { DeleteChecklistStep } from "@/application/useCases/DeleteChecklistStep";
import type { ChecklistStep } from "@/domain/entities/ChecklistStep";

const repository = new SupabaseTaskRepository();
const toggleStep = new ToggleChecklistStep(repository);
const createStep = new CreateChecklistStep(repository);
const deleteStep = new DeleteChecklistStep(repository);

export function useSmartChecklist(taskId: string) {
  const queryClient = useQueryClient();
  const qKey = ["checklist_steps", taskId];
  const toast = useToast();

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
    },
    onSuccess: (_, { completed }) => {
      if (completed) {
        const newIncomplete = steps.filter((s) => !s.completed).length - 1;
        if (newIncomplete === 0) {
          toast.info("All steps complete!", { duration: 3000 });
        }
      }
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
    onError: (_, __, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(qKey, ctx.previous);
      toast.error("Failed to add step");
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
    onError: (_, __, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(qKey, ctx.previous);
      toast.error("Failed to remove step");
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
  };
}
