import type { Routine } from "@/domain/entities/Routine";

export interface IRoutineRepository {
  getRoutines(): Promise<Routine[]>;
  createRoutine(name: string, icon?: string): Promise<Routine>;
  updateRoutine(
    id: string,
    updates: Partial<Pick<Routine, "name" | "icon">>,
  ): Promise<Routine>;
  deleteRoutine(id: string): Promise<void>;
  reorderRoutines(
    updates: Array<{ id: string; position: number }>,
  ): Promise<void>;
}
