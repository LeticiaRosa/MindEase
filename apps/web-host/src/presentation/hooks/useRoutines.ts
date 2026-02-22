import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SupabaseRoutineRepository } from "@/infrastructure/adapters/SupabaseRoutineRepository";
import { CreateRoutine } from "@/application/useCases/CreateRoutine";
import { UpdateRoutine } from "@/application/useCases/UpdateRoutine";
import { DeleteRoutine } from "@/application/useCases/DeleteRoutine";
import type { Routine } from "@/domain/entities/Routine";
import { useActiveRoutine } from "@/presentation/contexts/ActiveRoutineContext";
import { useToast } from "@repo/ui";

// ─── Singletons ───────────────────────────────────────────────────────────────

const repository = new SupabaseRoutineRepository();
const createRoutine = new CreateRoutine(repository);
const updateRoutine = new UpdateRoutine(repository);
const deleteRoutine = new DeleteRoutine(repository);

// ─── Default seed routines ────────────────────────────────────────────────────

const DEFAULT_ROUTINES = [
  { name: "Estudo", icon: "notebook-pen" },
  { name: "Trabalho", icon: "briefcase-business" },
] as const;

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useRoutines() {
  const queryClient = useQueryClient();
  const toast = useToast();
  const { activeRoutineId, setActiveRoutineId } = useActiveRoutine();

  const { data: routines = [], isLoading } = useQuery<Routine[]>({
    queryKey: ["routines"],
    queryFn: () => repository.getRoutines(),
  });

  // 6.1 Seed default routines when user has none
  useEffect(() => {
    if (isLoading || routines.length > 0) return;

    // 6.2 Insert as sequential to avoid race — unique constraint handles concurrent inserts silently
    const seedRoutines = async () => {
      for (const r of DEFAULT_ROUTINES) {
        try {
          await repository.createRoutine(r.name, r.icon);
        } catch {
          // Unique constraint violation — ignore (concurrent tab race condition)
        }
      }
      await queryClient.invalidateQueries({ queryKey: ["routines"] });
    };

    seedRoutines();
  }, [isLoading, routines.length, queryClient]);

  // 5.2 Fallback: if stored ID is not in fetched routines, default to first
  useEffect(() => {
    if (isLoading || routines.length === 0) return;

    const isValid =
      activeRoutineId !== null &&
      routines.some((r) => r.id === activeRoutineId);

    if (!isValid) {
      const first = routines[0];
      if (first) setActiveRoutineId(first.id);
    }
  }, [routines, isLoading, activeRoutineId, setActiveRoutineId]);

  // ─── Mutations ──────────────────────────────────────────────────────────

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
        icon: icon ?? "notebook-pen",
        position: previous?.length ?? 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      queryClient.setQueryData<Routine[]>(["routines"], (old = []) => [
        ...old,
        optimistic,
      ]);
      return { previous };
    },
    onError: (_, __, ctx) => {
      if (ctx?.previous)
        queryClient.setQueryData(["routines"], ctx.previous);
      toast.error("Falha ao criar Kanban");
    },
    onSuccess: () => {
      toast.success("Kanban criado com sucesso");
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ["routines"] }),
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
    onError: (_, __, ctx) => {
      if (ctx?.previous)
        queryClient.setQueryData(["routines"], ctx.previous);
      toast.error("Falha ao atualizar Kanban");
    },
    onSuccess: () => {
      toast.success("Kanban atualizado");
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ["routines"] }),
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
    onError: (_, __, ctx) => {
      if (ctx?.previous)
        queryClient.setQueryData(["routines"], ctx.previous);
      toast.error("Falha ao remover Kanban");
    },
    onSuccess: () => {
      toast.success("Kanban removido");
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ["routines"] }),
  });

  const reorderMutation = useMutation({
    mutationFn: (updates: Array<{ id: string; position: number }>) =>
      repository.reorderRoutines(updates),
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
      if (ctx?.previous)
        queryClient.setQueryData(["routines"], ctx.previous);
      toast.error("Falha ao reordenar Kanbans");
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ["routines"] }),
  });

  return {
    routines,
    isLoading,
    activeRoutineId,
    createRoutine: createMutation.mutate,
    updateRoutine: updateMutation.mutate,
    deleteRoutine: deleteMutation.mutate,
    reorderRoutines: reorderMutation.mutate,
  };
}
