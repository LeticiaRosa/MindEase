import { SupabaseTaskRepository } from "@/infrastructure/adapters/SupabaseTaskRepository";
import { SupabaseRoutineRepository } from "@/infrastructure/adapters/SupabaseRoutineRepository";
import { AlertPreferencesAsyncStorageAdapter } from "@/infrastructure/adapters/AlertPreferencesAsyncStorageAdapter";
import { SupabaseAuthRepository } from "@/infrastructure/adapters/SupabaseAuthRepository";
import { SupabaseTimerPreferencesRepository } from "@/infrastructure/adapters/SupabaseTimerPreferencesRepository";

export const taskRepository = new SupabaseTaskRepository();
export const routineRepository = new SupabaseRoutineRepository();
export const alertPreferencesRepository =
  new AlertPreferencesAsyncStorageAdapter();
export const authRepository = new SupabaseAuthRepository();
export const timerPreferencesRepository =
  new SupabaseTimerPreferencesRepository();
