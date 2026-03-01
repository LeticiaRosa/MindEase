import type { Routine } from "../entities/Routine";

export interface IRoutineRepository {
  getRoutines(): Promise<Routine[]>;
}
