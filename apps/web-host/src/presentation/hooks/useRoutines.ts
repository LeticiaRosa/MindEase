import { useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SupabaseRoutineRepository } from "@/infrastructure/adapters/SupabaseRoutineRepository";
import { CreateRoutine } from "@/application/useCases/CreateRoutine";
import { UpdateRoutine } from "@/application/useCases/UpdateRoutine";
import { DeleteRoutine } from "@/application/useCases/DeleteRoutine";
import type { Routine } from "@/domain/entities/Routine";
import { useActiveRoutine } from "@/presentation/hooks/useActiveRoutine";
import { useToast } from "@repo/ui";

// ─── Singletons ───────────────────────────────────────────────────────────────

const repository = new SupabaseRoutineRepository();
const createRoutine = new CreateRoutine(repository);
const updateRoutine = new UpdateRoutine(repository);
const deleteRoutine = new DeleteRoutine(repository);

// ─── Default seed routines ────────────────────────────────────────────────────

const DEFAULT_ROUTINES = [
  { name: "Trabalho", icon: "briefcase-business" },
  { name: "Estudo", icon: "notebook-pen" },
] as const;

function normalize(value: string): string {
  return value.trim().toLocaleLowerCase("pt-BR");
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useRoutines() {
  const queryClient = useQueryClient();
  const toast = useToast();
  const { activeRoutineId, setActiveRoutineId } = useActiveRoutine();
  const isSeedingDefaultRoutinesRef = useRef(false);

  const { data: routines = [], isLoading } = useQuery<Routine[]>({
    queryKey: ["routines"],
    queryFn: () => repository.getRoutines(),
  });

  // Keep mandatory default Kanbans available for onboarding and first use.
  useEffect(() => {
    if (isLoading || isSeedingDefaultRoutinesRef.current) return;

    const existingNames = new Set(
      routines.map((routine) => normalize(routine.name)),
    );
    const missingDefaults = DEFAULT_ROUTINES.filter(
      (routine) => !existingNames.has(normalize(routine.name)),
    );

    if (missingDefaults.length === 0) {
      return;
    }

    isSeedingDefaultRoutinesRef.current = true;

    // Insert sequentially to avoid race conditions between tabs/devices.
    const seedRoutines = async () => {
      try {
        for (const routine of missingDefaults) {
          try {
            await repository.createRoutine(routine.name, routine.icon);
          } catch {
            // Ignore duplicate insertion errors in concurrent sessions.
          }
        }

        await queryClient.invalidateQueries({ queryKey: ["routines"] });
      } finally {
        isSeedingDefaultRoutinesRef.current = false;
      }
    };

    seedRoutines();
  }, [isLoading, routines, queryClient]);

  // 5.2 Fallback: if stored ID is not in fetched routines, default to first
  useEffect(() => {
    if (isLoading || routines.length === 0) return;

    const isValid =
      activeRoutineId !== null &&
      routines.some((r) => r.id === activeRoutineId);

    if (!isValid) {
      const trabalhoRoutine = routines.find(
        (routine) => normalize(routine.name) === "trabalho",
      );
      const fallbackRoutine = trabalhoRoutine ?? routines[0];
      if (fallbackRoutine) setActiveRoutineId(fallbackRoutine.id);
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
      if (ctx?.previous) queryClient.setQueryData(["routines"], ctx.previous);
      toast.error("Falha ao criar Kanban");
    },
    onSuccess: () => {
      toast.success("Kanban criado com sucesso");
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
    onError: (_, __, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(["routines"], ctx.previous);
      toast.error("Falha ao atualizar Kanban");
    },
    onSuccess: () => {
      toast.success("Kanban atualizado");
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
    onError: (_, __, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(["routines"], ctx.previous);
      toast.error("Falha ao remover Kanban");
    },
    onSuccess: () => {
      toast.success("Kanban removido");
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["routines"] }),
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
      if (ctx?.previous) queryClient.setQueryData(["routines"], ctx.previous);
      toast.error("Falha ao reordenar Kanbans");
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["routines"] }),
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
