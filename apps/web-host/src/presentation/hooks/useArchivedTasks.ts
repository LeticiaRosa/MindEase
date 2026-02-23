import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SupabaseTaskRepository } from "@/infrastructure/adapters/SupabaseTaskRepository";
import { UpdateTaskStatus } from "@/application/useCases/UpdateTaskStatus";
import type { Task } from "@/domain/entities/Task";
import type { RestorableStatus } from "@/domain/valueObjects/TaskStatus";
import { useToast } from "@repo/ui";

const repository = new SupabaseTaskRepository();
const updateTaskStatus = new UpdateTaskStatus(repository);

export function useArchivedTasks() {
  const queryClient = useQueryClient();
  const toast = useToast();

  const { data: archivedTasks = [], isLoading } = useQuery<Task[]>({
    queryKey: ["archivedTasks"],
    queryFn: () => repository.getArchivedTasks(),
  });

  const restoreMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: RestorableStatus }) =>
      updateTaskStatus.execute(id, status),
    onMutate: async ({ id }) => {
      await queryClient.cancelQueries({ queryKey: ["archivedTasks"] });
      const previous = queryClient.getQueryData<Task[]>(["archivedTasks"]);
      queryClient.setQueryData<Task[]>(["archivedTasks"], (old = []) =>
        old.filter((t) => t.id !== id),
      );
      return { previous };
    },
    onSuccess: (task) => {
      toast.success(`Task restored to "${task.status.replace("_", " ")}"`, {
        duration: 3000,
      });
      // Invalidate the routine's task list so it reflects the restored task
      queryClient.invalidateQueries({ queryKey: ["tasks", task.routineId] });
    },
    onError: (_, __, ctx) => {
      if (ctx?.previous)
        queryClient.setQueryData(["archivedTasks"], ctx.previous);
      toast.error("Failed to restore task");
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ["archivedTasks"] }),
  });

  return {
    archivedTasks,
    isLoading,
    restoreTask: (id: string, status: RestorableStatus) =>
      restoreMutation.mutate({ id, status }),
  };
}
