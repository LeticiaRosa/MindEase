import { SupabaseTaskRepository } from "@/infrastructure/adapters/SupabaseTaskRepository";
import { SupabaseRoutineRepository } from "@/infrastructure/adapters/SupabaseRoutineRepository";
import { AlertPreferencesLocalStorageAdapter } from "@/infrastructure/adapters/AlertPreferencesLocalStorageAdapter";

// Module-level singletons. Each is created once per JS module lifetime,
// keeping the same instance across React renders without factory overhead.
export const taskRepository = new SupabaseTaskRepository();
export const routineRepository = new SupabaseRoutineRepository();
export const alertPreferencesRepository =
  new AlertPreferencesLocalStorageAdapter();
