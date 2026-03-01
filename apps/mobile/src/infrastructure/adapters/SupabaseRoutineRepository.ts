import type { Routine } from "@/domain/entities/Routine";
import type { IRoutineRepository } from "@/domain/interfaces/IRoutineRepository";
import supabaseClient from "@/infrastructure/api/clients/supabaseClient";

export class SupabaseRoutineRepository implements IRoutineRepository {
  async getRoutines(): Promise<Routine[]> {
    const { data, error } = await supabaseClient
      .from("routines")
      .select("*, routine_steps(*)")
      .order("position", { ascending: true });

    if (error) {
      console.error(
        "SupabaseRoutineRepository.getRoutines error:",
        error.message,
      );
      return [];
    }

    return (data ?? []).map((row) => ({
      id: row.id,
      userId: row.user_id,
      name: row.name,
      icon: row.icon ?? undefined,
      position: row.position,
      isActive: row.is_active ?? false,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      steps: (row.routine_steps ?? [])
        .sort(
          (a: { position: number }, b: { position: number }) =>
            a.position - b.position,
        )
        .map(
          (step: {
            id: string;
            routine_id: string;
            title: string;
            position: number;
            completed: boolean;
          }) => ({
            id: step.id,
            routineId: step.routine_id,
            title: step.title,
            position: step.position,
            completed: step.completed ?? false,
          }),
        ),
    }));
  }
}
