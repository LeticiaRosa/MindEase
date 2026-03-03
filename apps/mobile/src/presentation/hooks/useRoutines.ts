import { useQuery } from "@tanstack/react-query";
import type { Routine } from "@/domain/entities/Routine";
import { SupabaseRoutineRepository } from "@/infrastructure/adapters/SupabaseRoutineRepository";
import { GetRoutines } from "@/application/useCases/GetRoutines";

const repository = new SupabaseRoutineRepository();
const getRoutines = new GetRoutines(repository);

export function useRoutines() {
  return useQuery<Routine[]>({
    queryKey: ["routines"],
    queryFn: () => getRoutines.execute(),
  });
}
