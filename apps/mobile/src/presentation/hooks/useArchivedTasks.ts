import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAlert } from "@/presentation/contexts/AlertContext";
import { taskRepository as repository } from "@/infrastructure/factories/repositories";
import { UpdateTaskStatus } from "@/application/useCases/UpdateTaskStatus";
import type { Task } from "@/domain/entities/Task";
import type { TaskStatus } from "@/domain/valueObjects/TaskStatus";

const updateTaskStatus = new UpdateTaskStatus(repository);

export function useArchivedTasks() {
  const queryClient = useQueryClient();
  const { showAlert } = useAlert();

  const { data: archivedTasks = [], isLoading } = useQuery<Task[]>({
    queryKey: ["archivedTasks"],
    queryFn: () => repository.getArchivedTasks(),
  });

  const restoreMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: TaskStatus }) =>
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
      showAlert(
        "Sucesso",
        `Tarefa restaurada para "${task.status}"`,
        "success",
      );
      queryClient.invalidateQueries({ queryKey: ["tasks", task.routineId] });
    },
    onError: (_, __, ctx) => {
      if (ctx?.previous)
        queryClient.setQueryData(["archivedTasks"], ctx.previous);
      showAlert("Erro", "Falha ao restaurar tarefa", "error");
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ["archivedTasks"] }),
  });

  return {
    archivedTasks,
    isLoading,
    restoreTask: (id: string, status: TaskStatus) =>
      restoreMutation.mutate({ id, status }),
  };
}
