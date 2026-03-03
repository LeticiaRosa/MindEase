import type { Task } from "@/domain/entities/Task";
import type { ChecklistStep } from "@/domain/entities/ChecklistStep";
import type { ITaskRepository } from "@/domain/interfaces/ITaskRepository";
import type { TaskStatus } from "@/domain/valueObjects/TaskStatus";
import supabaseClient from "@/infrastructure/api/clients/supabaseClient";

export class SupabaseTaskRepository implements ITaskRepository {
  // ─── Tasks ───────────────────────────────────────────────────────────

  async getTasks(): Promise<Task[]> {
    const { data, error } = await supabaseClient
      .from("tasks")
      .select("*, checklist_steps(*)")
      .neq("status", "archived")
      .order("position", { ascending: true });

    if (error) {
      console.error("SupabaseTaskRepository.getTasks error:", error.message);
      return [];
    }

    return (data ?? []).map((row) => this.mapTaskWithSteps(row));
  }

  async getTasksByRoutine(routineId: string): Promise<Task[]> {
    const { data, error } = await supabaseClient
      .from("tasks")
      .select("*, checklist_steps(*)")
      .eq("routine_id", routineId)
      .neq("status", "archived")
      .order("position", { ascending: true });

    if (error) throw new Error(error.message);

    return (data ?? []).map((row) => this.mapTaskWithSteps(row));
  }

  async getArchivedTasks(): Promise<Task[]> {
    const { data, error } = await supabaseClient
      .from("tasks")
      .select("*, checklist_steps(*)")
      .eq("status", "archived")
      .order("status_updated_at", { ascending: false });

    if (error) throw new Error(error.message);

    return (data ?? []).map((row) => this.mapTaskWithSteps(row));
  }

  async createTask(
    routineId: string,
    title: string,
    description?: string,
  ): Promise<Task> {
    const { data: existing } = await supabaseClient
      .from("tasks")
      .select("position")
      .eq("routine_id", routineId)
      .eq("status", "todo")
      .order("position", { ascending: false })
      .limit(1)
      .single();

    const nextPosition = (existing?.position ?? -1) + 1;

    const { data, error } = await supabaseClient
      .from("tasks")
      .insert({
        routine_id: routineId,
        title,
        description,
        status: "todo",
        position: nextPosition,
      })
      .select("*, checklist_steps(*)")
      .single();

    if (error) throw new Error(error.message);
    return this.mapTaskWithSteps(data);
  }

  async updateTask(
    id: string,
    updates: Partial<
      Pick<Task, "title" | "description" | "status" | "position">
    >,
  ): Promise<Task> {
    const { data, error } = await supabaseClient
      .from("tasks")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
        ...(updates.status
          ? { status_updated_at: new Date().toISOString() }
          : {}),
      })
      .eq("id", id)
      .select("*, checklist_steps(*)")
      .single();

    if (error) throw new Error(error.message);
    return this.mapTaskWithSteps(data);
  }

  async updateTaskStatus(id: string, status: TaskStatus): Promise<Task> {
    return this.updateTask(id, { status });
  }

  async deleteTask(id: string): Promise<void> {
    const { error } = await supabaseClient.from("tasks").delete().eq("id", id);
    if (error) throw new Error(error.message);
  }

  async reorderTasks(
    updates: Array<{
      id: string;
      position: number;
      status: TaskStatus;
      previousStatus: TaskStatus;
    }>,
  ): Promise<void> {
    const now = new Date().toISOString();
    await Promise.all(
      updates.map(({ id, position, status, previousStatus }) =>
        supabaseClient
          .from("tasks")
          .update({
            position,
            status,
            updated_at: now,
            ...(previousStatus !== status ? { status_updated_at: now } : {}),
          })
          .eq("id", id),
      ),
    );
  }

  async archiveTask(id: string): Promise<Task> {
    return this.updateTask(id, { status: "archived" as TaskStatus });
  }

  async restoreTask(id: string, status: TaskStatus): Promise<Task> {
    return this.updateTask(id, { status });
  }

  async addTaskTimeSpent(id: string, secondsToAdd: number): Promise<void> {
    const { data: currentTask, error: fetchError } = await supabaseClient
      .from("tasks")
      .select("total_time_spent")
      .eq("id", id)
      .single();

    if (fetchError) throw new Error(fetchError.message);

    const currentTotal = (currentTask.total_time_spent as number) ?? 0;
    const newTotal = currentTotal + secondsToAdd;

    const { error } = await supabaseClient
      .from("tasks")
      .update({
        total_time_spent: newTotal,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) throw new Error(error.message);
  }

  // ─── Checklist Steps ─────────────────────────────────────────────────

  async getChecklistSteps(taskId: string): Promise<ChecklistStep[]> {
    const { data, error } = await supabaseClient
      .from("checklist_steps")
      .select("*")
      .eq("task_id", taskId)
      .order("position", { ascending: true });
    if (error) throw new Error(error.message);
    return (data ?? []).map((step: Record<string, unknown>) =>
      this.mapChecklistStep(step),
    );
  }

  async addChecklistStep(
    taskId: string,
    title: string,
  ): Promise<ChecklistStep> {
    const { data: existing } = await supabaseClient
      .from("checklist_steps")
      .select("position")
      .eq("task_id", taskId)
      .order("position", { ascending: false })
      .limit(1)
      .single();

    const nextPosition = (existing?.position ?? -1) + 1;

    const { data, error } = await supabaseClient
      .from("checklist_steps")
      .insert({
        task_id: taskId,
        title,
        completed: false,
        position: nextPosition,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return this.mapChecklistStep(data);
  }

  async updateChecklistStep(
    id: string,
    updates: Partial<Pick<ChecklistStep, "title" | "completed" | "position">>,
  ): Promise<ChecklistStep> {
    const { data, error } = await supabaseClient
      .from("checklist_steps")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return this.mapChecklistStep(data);
  }

  async deleteChecklistStep(id: string): Promise<void> {
    const { error } = await supabaseClient
      .from("checklist_steps")
      .delete()
      .eq("id", id);
    if (error) throw new Error(error.message);
  }

  async toggleChecklistStep(
    id: string,
    completed: boolean,
  ): Promise<ChecklistStep> {
    return this.updateChecklistStep(id, { completed });
  }

  // ─── Mappers ─────────────────────────────────────────────────────────

  private mapTaskWithSteps(row: Record<string, unknown>): Task {
    return {
      id: row.id as string,
      userId: row.user_id as string,
      routineId: row.routine_id as string,
      title: row.title as string,
      description: (row.description as string | undefined) ?? undefined,
      status: row.status as TaskStatus,
      position: row.position as number,
      createdAt: row.created_at as string,
      updatedAt: row.updated_at as string,
      statusUpdatedAt: row.status_updated_at as string,
      totalTimeSpent: (row.total_time_spent as number) ?? 0,
      checklistSteps: (
        (row.checklist_steps as Array<Record<string, unknown>>) ?? []
      ).map((step) => this.mapChecklistStep(step)),
    };
  }

  private mapChecklistStep(step: Record<string, unknown>): ChecklistStep {
    return {
      id: step.id as string,
      taskId: step.task_id as string,
      title: step.title as string,
      completed: step.completed as boolean,
      position: step.position as number,
      createdAt: step.created_at as string,
    };
  }
}
