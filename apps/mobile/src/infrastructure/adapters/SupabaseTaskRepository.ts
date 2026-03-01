import type { Task } from "@/domain/entities/Task";
import type { ITaskRepository } from "@/domain/interfaces/ITaskRepository";
import supabaseClient from "@/infrastructure/api/clients/supabaseClient";

export class SupabaseTaskRepository implements ITaskRepository {
  async getTasks(): Promise<Task[]> {
    const { data, error } = await supabaseClient
      .from("tasks")
      .select("*, checklist_steps(*)")
      .order("position", { ascending: true });

    if (error) {
      console.error("SupabaseTaskRepository.getTasks error:", error.message);
      return [];
    }

    return (data ?? []).map((row) => ({
      id: row.id,
      userId: row.user_id,
      routineId: row.routine_id,
      title: row.title,
      description: row.description ?? undefined,
      status: row.status,
      position: row.position,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      statusUpdatedAt: row.status_updated_at,
      totalTimeSpent: row.total_time_spent ?? 0,
      checklistSteps: (row.checklist_steps ?? []).map(
        (step: {
          id: string;
          task_id: string;
          title: string;
          completed: boolean;
          position: number;
          created_at: string;
        }) => ({
          id: step.id,
          taskId: step.task_id,
          title: step.title,
          completed: step.completed,
          position: step.position,
          createdAt: step.created_at,
        }),
      ),
    }));
  }
}
