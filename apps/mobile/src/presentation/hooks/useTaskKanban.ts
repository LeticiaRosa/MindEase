import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAlert } from "@/presentation/contexts/AlertContext";
import { SupabaseTaskRepository } from "@/infrastructure/adapters/SupabaseTaskRepository";
import { CreateTask } from "@/application/useCases/CreateTask";
import { UpdateTask } from "@/application/useCases/UpdateTask";
import { UpdateTaskStatus } from "@/application/useCases/UpdateTaskStatus";
import { ReorderTasks } from "@/application/useCases/ReorderTasks";
import { DeleteTask } from "@/application/useCases/DeleteTask";
import type { Task } from "@/domain/entities/Task";
import type { TaskStatus } from "@/domain/valueObjects/TaskStatus";

const repository = new SupabaseTaskRepository();
const createTask = new CreateTask(repository);
const updateTask = new UpdateTask(repository);
const updateTaskStatus = new UpdateTaskStatus(repository);
const reorderTasks = new ReorderTasks(repository);
const deleteTask = new DeleteTask(repository);

export interface UpdateTaskParams {
  title?: string;
  description?: string;
}

export function useTaskKanban(routineId: string) {
  const queryClient = useQueryClient();
  const { showAlert } = useAlert();

  const { data: tasks = [], isLoading } = useQuery<Task[]>({
    queryKey: ["tasks", routineId],
    queryFn: () => repository.getTasksByRoutine(routineId),
    enabled: Boolean(routineId),
  });

  const createMutation = useMutation({
    mutationFn: ({ title, status }: { title: string; status?: TaskStatus }) =>
      createTask.execute(routineId, title, undefined, status),
    onMutate: async ({ title, status }) => {
      await queryClient.cancelQueries({ queryKey: ["tasks", routineId] });
      const previous = queryClient.getQueryData<Task[]>(["tasks", routineId]);
      const optimistic: Task = {
        id: `optimistic-${Date.now()}`,
        userId: "",
        routineId,
        title,
        status: status ?? "todo",
        position: previous?.length ?? 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        statusUpdatedAt: new Date().toISOString(),
        totalTimeSpent: 0,
      };
      queryClient.setQueryData<Task[]>(["tasks", routineId], (old = []) => [
        ...old,
        optimistic,
      ]);
      return { previous };
    },
    onSuccess: () => {
      showAlert("Sucesso", "Tarefa criada", "success");
    },
    onError: (_, __, ctx) => {
      if (ctx?.previous)
        queryClient.setQueryData(["tasks", routineId], ctx.previous);
      showAlert("Erro", "Falha ao criar tarefa", "error");
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ["tasks", routineId] }),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: TaskStatus }) =>
      updateTaskStatus.execute(id, status),
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: ["tasks", routineId] });
      const previous = queryClient.getQueryData<Task[]>(["tasks", routineId]);
      queryClient.setQueryData<Task[]>(["tasks", routineId], (old = []) =>
        old.map((t) => (t.id === id ? { ...t, status } : t)),
      );
      return { previous };
    },
    onSuccess: (task) => {
      showAlert(
        "Sucesso",
        `Status atualizado para "${task.status}"`,
        "success",
      );
    },
    onError: (_, __, ctx) => {
      if (ctx?.previous)
        queryClient.setQueryData(["tasks", routineId], ctx.previous);
      showAlert("Erro", "Falha ao atualizar tarefa", "error");
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ["tasks", routineId] }),
  });

  const reorderMutation = useMutation({
    mutationFn: (
      updates: Array<{
        id: string;
        position: number;
        status: TaskStatus;
        previousStatus: TaskStatus;
      }>,
    ) => reorderTasks.execute(updates),
    onMutate: async (updates) => {
      await queryClient.cancelQueries({ queryKey: ["tasks", routineId] });
      const previous = queryClient.getQueryData<Task[]>(["tasks", routineId]);
      queryClient.setQueryData<Task[]>(["tasks", routineId], (old = []) =>
        old.map((t) => {
          const upd = updates.find((u) => u.id === t.id);
          return upd ? { ...t, status: upd.status, position: upd.position } : t;
        }),
      );
      return { previous };
    },
    onError: (_, __, ctx) => {
      if (ctx?.previous)
        queryClient.setQueryData(["tasks", routineId], ctx.previous);
      showAlert("Erro", "Falha ao reordenar tarefas", "error");
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ["tasks", routineId] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteTask.execute(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["tasks", routineId] });
      const previous = queryClient.getQueryData<Task[]>(["tasks", routineId]);
      queryClient.setQueryData<Task[]>(["tasks", routineId], (old = []) =>
        old.filter((t) => t.id !== id),
      );
      return { previous };
    },
    onSuccess: () => {
      showAlert("Sucesso", "Tarefa excluída", "success");
    },
    onError: (_, __, ctx) => {
      if (ctx?.previous)
        queryClient.setQueryData(["tasks", routineId], ctx.previous);
      showAlert("Erro", "Falha ao deletar tarefa", "error");
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ["tasks", routineId] }),
  });

  const archiveMutation = useMutation({
    mutationFn: (id: string) => updateTaskStatus.execute(id, "archived"),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["tasks", routineId] });
      const previous = queryClient.getQueryData<Task[]>(["tasks", routineId]);
      queryClient.setQueryData<Task[]>(["tasks", routineId], (old = []) =>
        old.filter((t) => t.id !== id),
      );
      return { previous };
    },
    onSuccess: () => {
      showAlert("Sucesso", "Tarefa arquivada com sucesso", "success");
    },
    onError: (_, __, ctx) => {
      if (ctx?.previous)
        queryClient.setQueryData(["tasks", routineId], ctx.previous);
      showAlert("Erro", "Falha ao arquivar tarefa", "error");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", routineId] });
      queryClient.invalidateQueries({ queryKey: ["archivedTasks"] });
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: ({ id, params }: { id: string; params: UpdateTaskParams }) =>
      updateTask.execute(id, params),
    onMutate: async ({ id, params }) => {
      await queryClient.cancelQueries({ queryKey: ["tasks", routineId] });
      const previous = queryClient.getQueryData<Task[]>(["tasks", routineId]);
      queryClient.setQueryData<Task[]>(["tasks", routineId], (old = []) =>
        old.map((t) => (t.id === id ? { ...t, ...params } : t)),
      );
      return { previous };
    },
    onSuccess: () => {
      showAlert("Sucesso", "Tarefa atualizada", "success");
    },
    onError: (_, __, ctx) => {
      if (ctx?.previous)
        queryClient.setQueryData(["tasks", routineId], ctx.previous);
      showAlert("Erro", "Falha ao atualizar tarefa", "error");
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ["tasks", routineId] }),
  });

  const tasksByStatus = (status: TaskStatus) =>
    tasks
      .filter((t) => t.status === status)
      .sort((a, b) => a.position - b.position);

  return {
    tasks,
    isLoading,
    tasksByStatus,
    createTask: (title: string, status?: TaskStatus) =>
      createMutation.mutate({ title, status }),
    updateTask: (id: string, params: UpdateTaskParams) =>
      updateTaskMutation.mutate({ id, params }),
    updateTaskStatus: updateStatusMutation.mutate,
    reorderTasks: reorderMutation.mutate,
    deleteTask: (id: string) => deleteMutation.mutate(id),
    archiveTask: (id: string) => archiveMutation.mutate(id),
  };
}
