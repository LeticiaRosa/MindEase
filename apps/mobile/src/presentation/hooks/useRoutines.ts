import { useQuery } from "@tanstack/react-query";
import type { Routine } from "@/domain/entities/Routine";
import { SupabaseRoutineRepository } from "@/infrastructure/adapters/SupabaseRoutineRepository";

const repository = new SupabaseRoutineRepository();

export function useRoutines() {
  return useQuery<Routine[]>({
    queryKey: ["routines"],
    queryFn: () => repository.getRoutines(),
  });
}
