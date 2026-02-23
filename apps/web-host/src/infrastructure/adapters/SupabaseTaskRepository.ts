import type { Task } from "@/domain/entities/Task";
import type { ChecklistStep } from "@/domain/entities/ChecklistStep";
import type { TimerPreferences } from "@/domain/entities/TimerPreferences";
import { DEFAULT_TIMER_PREFERENCES } from "@/domain/entities/TimerPreferences";
import type { ITaskRepository } from "@/domain/interfaces/ITaskRepository";
import type { TaskStatus } from "@/domain/valueObjects/TaskStatus";
import supabaseClient from "@/infrastructure/api/clients/supabaseClient";

export class SupabaseTaskRepository implements ITaskRepository {
  // ─── Tasks ───────────────────────────────────────────────────────────

  async getTasks(routineId: string): Promise<Task[]> {
    const { data, error } = await supabaseClient
      .from("tasks")
      .select("*")
      .eq("routine_id", routineId)
      .neq("status", "archived")
      .order("position", { ascending: true });

    if (error) throw new Error(error.message);

    return (data ?? []).map(this.mapTask);
  }

  async getArchivedTasks(): Promise<Task[]> {
    const { data, error } = await supabaseClient
      .from("tasks")
      .select("*")
      .eq("status", "archived")
      .order("status_updated_at", { ascending: false });

    if (error) throw new Error(error.message);

    return (data ?? []).map(this.mapTask);
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
      .select()
      .single();

    if (error) throw new Error(error.message);
    return this.mapTask(data);
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
      .select()
      .single();

    if (error) throw new Error(error.message);
    return this.mapTask(data);
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
    // Batch update: execute in parallel since Supabase doesn't support bulk update with different values
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

  // ─── Checklist Steps ─────────────────────────────────────────────────

  async getChecklistSteps(taskId: string): Promise<ChecklistStep[]> {
    const { data, error } = await supabaseClient
      .from("checklist_steps")
      .select("*")
      .eq("task_id", taskId)
      .order("position", { ascending: true });

    if (error) throw new Error(error.message);
    return (data ?? []).map(this.mapChecklistStep);
  }

  async createChecklistStep(
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

  // ─── Timer Preferences ───────────────────────────────────────────────

  async getTimerPreferences(): Promise<TimerPreferences | null> {
    const { data, error } = await supabaseClient
      .from("timer_preferences")
      .select("*")
      .single();

    if (error?.code === "PGRST116") return null; // No rows found
    if (error) throw new Error(error.message);
    return this.mapTimerPreferences(data);
  }

  async updateTimerPreferences(
    prefs: Partial<Omit<TimerPreferences, "userId">>,
  ): Promise<TimerPreferences> {
    const { data: user } = await supabaseClient.auth.getUser();
    const userId = user.user?.id;
    if (!userId) throw new Error("Not authenticated");

    const mapped = {
      user_id: userId,
      focus_duration: prefs.focusDuration,
      break_duration: prefs.breakDuration,
      long_break_duration: prefs.longBreakDuration,
      cycles_before_long_break: prefs.cyclesBeforeLongBreak,
      updated_at: new Date().toISOString(),
    };

    // Remove undefined keys
    const cleaned = Object.fromEntries(
      Object.entries(mapped).filter(([, v]) => v !== undefined),
    );

    const { data, error } = await supabaseClient
      .from("timer_preferences")
      .upsert(cleaned)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return this.mapTimerPreferences(data);
  }

  // ─── Mappers ─────────────────────────────────────────────────────────

  private mapTask(row: Record<string, unknown>): Task {
    return {
      id: row.id as string,
      userId: row.user_id as string,
      routineId: row.routine_id as string,
      title: row.title as string,
      description: row.description as string | undefined,
      status: row.status as TaskStatus,
      position: row.position as number,
      createdAt: row.created_at as string,
      updatedAt: row.updated_at as string,
      statusUpdatedAt: row.status_updated_at as string,
    };
  }

  private mapChecklistStep(row: Record<string, unknown>): ChecklistStep {
    return {
      id: row.id as string,
      taskId: row.task_id as string,
      title: row.title as string,
      completed: row.completed as boolean,
      position: row.position as number,
      createdAt: row.created_at as string,
    };
  }

  private mapTimerPreferences(row: Record<string, unknown>): TimerPreferences {
    return {
      userId: row.user_id as string,
      focusDuration:
        (row.focus_duration as number) ??
        DEFAULT_TIMER_PREFERENCES.focusDuration,
      breakDuration:
        (row.break_duration as number) ??
        DEFAULT_TIMER_PREFERENCES.breakDuration,
      longBreakDuration:
        (row.long_break_duration as number) ??
        DEFAULT_TIMER_PREFERENCES.longBreakDuration,
      cyclesBeforeLongBreak:
        (row.cycles_before_long_break as number) ??
        DEFAULT_TIMER_PREFERENCES.cyclesBeforeLongBreak,
    };
  }
}
