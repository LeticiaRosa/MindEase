import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";
import { SupabaseTaskRepository } from "@/infrastructure/adapters/SupabaseTaskRepository";
import { UpdateTaskStatus } from "@/application/useCases/UpdateTaskStatus";
import type { Task } from "@/domain/entities/Task";
import type { TaskStatus } from "@/domain/valueObjects/TaskStatus";

const repository = new SupabaseTaskRepository();
const updateTaskStatus = new UpdateTaskStatus(repository);

export function useArchivedTasks() {
  const queryClient = useQueryClient();

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
      Alert.alert("Sucesso", `Tarefa restaurada para "${task.status}"`);
      queryClient.invalidateQueries({ queryKey: ["tasks", task.routineId] });
    },
    onError: (_, __, ctx) => {
      if (ctx?.previous)
        queryClient.setQueryData(["archivedTasks"], ctx.previous);
      Alert.alert("Erro", "Falha ao restaurar tarefa");
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
