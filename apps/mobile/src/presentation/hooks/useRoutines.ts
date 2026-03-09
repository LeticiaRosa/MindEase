import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAlert } from "@/presentation/contexts/AlertContext";
import type { Routine } from "@/domain/entities/Routine";
import { SupabaseRoutineRepository } from "@/infrastructure/adapters/SupabaseRoutineRepository";
import { GetRoutines } from "@/application/useCases/GetRoutines";
import { CreateRoutine } from "@/application/useCases/CreateRoutine";
import { UpdateRoutine } from "@/application/useCases/UpdateRoutine";
import { DeleteRoutine } from "@/application/useCases/DeleteRoutine";
import { ReorderRoutines } from "@/application/useCases/ReorderRoutines";

const repository = new SupabaseRoutineRepository();
const getRoutines = new GetRoutines(repository);
const createRoutine = new CreateRoutine(repository);
const updateRoutine = new UpdateRoutine(repository);
const deleteRoutine = new DeleteRoutine(repository);
const reorderRoutines = new ReorderRoutines(repository);

export function useRoutines() {
  const queryClient = useQueryClient();
  const { showAlert } = useAlert();

  const { data: routines = [], isLoading } = useQuery<Routine[]>({
    queryKey: ["routines"],
    queryFn: () => getRoutines.execute(),
  });

  const createMutation = useMutation({
    mutationFn: ({ name, icon }: { name: string; icon?: string }) =>
      createRoutine.execute(name, icon),
    onMutate: async ({ name, icon }) => {
      await queryClient.cancelQueries({ queryKey: ["routines"] });
      const previous = queryClient.getQueryData<Routine[]>(["routines"]);
      const optimistic: Routine = {
        id: `optimistic-${Date.now()}`,
        userId: "",
        name,
        icon,
        position: previous?.length ?? 0,
        isActive: true,
        steps: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      queryClient.setQueryData<Routine[]>(["routines"], (old = []) => [
        ...old,
        optimistic,
      ]);
      return { previous };
    },
    onSuccess: () => {
      showAlert("Sucesso", "Rotina criada", "success");
    },
    onError: (_, __, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(["routines"], ctx.previous);
      showAlert("Erro", "Falha ao criar rotina", "error");
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["routines"] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<Pick<Routine, "name" | "icon">>;
    }) => updateRoutine.execute(id, updates),
    onMutate: async ({ id, updates }) => {
      await queryClient.cancelQueries({ queryKey: ["routines"] });
      const previous = queryClient.getQueryData<Routine[]>(["routines"]);
      queryClient.setQueryData<Routine[]>(["routines"], (old = []) =>
        old.map((r) => (r.id === id ? { ...r, ...updates } : r)),
      );
      return { previous };
    },
    onSuccess: () => {
      showAlert("Sucesso", "Rotina atualizada", "success");
    },
    onError: (_, __, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(["routines"], ctx.previous);
      showAlert("Erro", "Falha ao atualizar rotina", "error");
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["routines"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteRoutine.execute(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["routines"] });
      const previous = queryClient.getQueryData<Routine[]>(["routines"]);
      queryClient.setQueryData<Routine[]>(["routines"], (old = []) =>
        old.filter((r) => r.id !== id),
      );
      return { previous };
    },
    onSuccess: () => {
      showAlert("Sucesso", "Rotina excluída", "success");
    },
    onError: (_, __, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(["routines"], ctx.previous);
      showAlert("Erro", "Falha ao excluir rotina", "error");
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["routines"] }),
  });

  const reorderMutation = useMutation({
    mutationFn: (updates: Array<{ id: string; position: number }>) =>
      reorderRoutines.execute(updates),
    onMutate: async (updates) => {
      await queryClient.cancelQueries({ queryKey: ["routines"] });
      const previous = queryClient.getQueryData<Routine[]>(["routines"]);
      queryClient.setQueryData<Routine[]>(["routines"], (old = []) =>
        old
          .map((r) => {
            const upd = updates.find((u) => u.id === r.id);
            return upd ? { ...r, position: upd.position } : r;
          })
          .sort((a, b) => a.position - b.position),
      );
      return { previous };
    },
    onError: (_, __, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(["routines"], ctx.previous);
      showAlert("Erro", "Falha ao reordenar rotinas", "error");
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["routines"] }),
  });

  return {
    routines: routines.sort((a, b) => a.position - b.position),
    isLoading,
    createRoutine: (name: string, icon?: string) =>
      createMutation.mutate({ name, icon }),
    updateRoutine: (
      id: string,
      updates: Partial<Pick<Routine, "name" | "icon">>,
    ) => updateMutation.mutate({ id, updates }),
    deleteRoutine: (id: string) => deleteMutation.mutate(id),
    reorderRoutines: reorderMutation.mutate,
  };
}
