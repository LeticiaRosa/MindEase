import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SupabaseTaskRepository } from "@/infrastructure/adapters/SupabaseTaskRepository";
import { CreateTask } from "@/application/useCases/CreateTask";
import { UpdateTaskStatus } from "@/application/useCases/UpdateTaskStatus";
import { ReorderTasks } from "@/application/useCases/ReorderTasks";
import { DeleteTask } from "@/application/useCases/DeleteTask";
import type { Task } from "@/domain/entities/Task";
import type { TaskStatus } from "@/domain/valueObjects/TaskStatus";
import { useToast } from "@repo/ui";

const repository = new SupabaseTaskRepository();
const createTask = new CreateTask(repository);
const updateTaskStatus = new UpdateTaskStatus(repository);
const reorderTasks = new ReorderTasks(repository);
const deleteTask = new DeleteTask(repository);

export function useTaskKanban(routineId: string) {
  const queryClient = useQueryClient();
  const toast = useToast();

  const { data: tasks = [], isLoading } = useQuery<Task[]>({
    queryKey: ["tasks", routineId],
    queryFn: () => repository.getTasks(routineId),
    enabled: Boolean(routineId),
  });

  const createMutation = useMutation({
    mutationFn: (title: string) => createTask.execute(routineId, title),
    onMutate: async (title) => {
      await queryClient.cancelQueries({ queryKey: ["tasks", routineId] });
      const previous = queryClient.getQueryData<Task[]>(["tasks", routineId]);
      const optimistic: Task = {
        id: `optimistic-${Date.now()}`,
        userId: "",
        routineId,
        title,
        status: "todo",
        position: previous?.length ?? 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        statusUpdatedAt: new Date().toISOString(),
      };
      queryClient.setQueryData<Task[]>(["tasks", routineId], (old = []) => [
        ...old,
        optimistic,
      ]);
      return { previous };
    },
    onError: (_, __, ctx) => {
      if (ctx?.previous)
        queryClient.setQueryData(["tasks", routineId], ctx.previous);
      toast.error("Failed to create task");
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
      if (status === "done")
        toast.success("Task completed", { duration: 3000 });
      return { previous };
    },
    onError: (_, __, ctx) => {
      if (ctx?.previous)
        queryClient.setQueryData(["tasks", routineId], ctx.previous);
      toast.error("Failed to update task");
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ["tasks", routineId] }),
  });

  const reorderMutation = useMutation({
    mutationFn: (
      updates: Array<{ id: string; position: number; status: TaskStatus }>,
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
      toast.error("Failed to reorder tasks");
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
    onError: (_, __, ctx) => {
      if (ctx?.previous)
        queryClient.setQueryData(["tasks", routineId], ctx.previous);
      toast.error("Failed to delete task");
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
    onError: (_, __, ctx) => {
      if (ctx?.previous)
        queryClient.setQueryData(["tasks", routineId], ctx.previous);
      toast.error("Failed to archive task");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", routineId] });
      queryClient.invalidateQueries({ queryKey: ["archivedTasks"] });
    },
  });

  const tasksByStatus = (status: TaskStatus) =>
    tasks
      .filter((t) => t.status === status)
      .sort((a, b) => a.position - b.position);

  return {
    tasks,
    isLoading,
    tasksByStatus,
    createTask: createMutation.mutate,
    updateTaskStatus: updateStatusMutation.mutate,
    reorderTasks: reorderMutation.mutate,
    deleteTask: (id: string) => {
      deleteMutation.mutate(id);
      toast.info("Task deleted", {
        duration: 3000,
        action: {
          label: "Undo",
          onClick: () =>
            queryClient.invalidateQueries({ queryKey: ["tasks", routineId] }),
        },
      });
    },
    archiveTask: (id: string) => {
      archiveMutation.mutate(id);
      toast.info("Task archived", {
        duration: 3000,
        action: {
          label: "View",
          onClick: () => {
            window.location.href = "/archived-tasks";
          },
        },
      });
    },
  };
}
