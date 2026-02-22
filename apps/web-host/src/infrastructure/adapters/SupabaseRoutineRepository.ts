import type { Routine } from "@/domain/entities/Routine";
import type { IRoutineRepository } from "@/domain/interfaces/IRoutineRepository";
import supabaseClient from "@/infrastructure/api/clients/supabaseClient";

export class SupabaseRoutineRepository implements IRoutineRepository {
  async getRoutines(): Promise<Routine[]> {
    const { data, error } = await supabaseClient
      .from("routines")
      .select("*")
      .order("position", { ascending: true });

    if (error) throw new Error(error.message);
    return (data ?? []).map(this.mapRoutine);
  }

  async createRoutine(name: string, icon = "notebook-pen"): Promise<Routine> {
    const { data: existing } = await supabaseClient
      .from("routines")
      .select("position")
      .order("position", { ascending: false })
      .limit(1)
      .single();

    const nextPosition = (existing?.position ?? -1) + 1;

    const { data, error } = await supabaseClient
      .from("routines")
      .insert({ name, icon, position: nextPosition })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return this.mapRoutine(data);
  }

  async updateRoutine(
    id: string,
    updates: Partial<Pick<Routine, "name" | "icon">>,
  ): Promise<Routine> {
    const { data, error } = await supabaseClient
      .from("routines")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return this.mapRoutine(data);
  }

  async deleteRoutine(id: string): Promise<void> {
    const { error } = await supabaseClient
      .from("routines")
      .delete()
      .eq("id", id);
    if (error) throw new Error(error.message);
  }

  async reorderRoutines(
    updates: Array<{ id: string; position: number }>,
  ): Promise<void> {
    await Promise.all(
      updates.map(({ id, position }) =>
        supabaseClient
          .from("routines")
          .update({ position, updated_at: new Date().toISOString() })
          .eq("id", id),
      ),
    );
  }

  // ─── Mapper ──────────────────────────────────────────────────────────

  private mapRoutine(row: Record<string, unknown>): Routine {
    return {
      id: row.id as string,
      userId: row.user_id as string,
      name: row.name as string,
      icon: row.icon as string,
      position: row.position as number,
      createdAt: row.created_at as string,
      updatedAt: row.updated_at as string,
    };
  }
}
