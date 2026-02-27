import type { Task } from "@/domain/entities/Task";
import type { ChecklistStep } from "@/domain/entities/ChecklistStep";
import type { TimerPreferences } from "@/domain/entities/TimerPreferences";
import type { TaskStatus } from "@/domain/valueObjects/TaskStatus";

export interface ITaskRepository {
  // Tasks
  getTasks(routineId: string): Promise<Task[]>;
  getArchivedTasks(): Promise<Task[]>;
  createTask(
    routineId: string,
    title: string,
    description?: string,
  ): Promise<Task>;
  updateTask(
    id: string,
    updates: Partial<
      Pick<Task, "title" | "description" | "status" | "position">
    >,
  ): Promise<Task>;
  deleteTask(id: string): Promise<void>;
  addTaskTimeSpent(id: string, secondsToAdd: number): Promise<Task>;
  reorderTasks(
    updates: Array<{
      id: string;
      position: number;
      status: TaskStatus;
      previousStatus: TaskStatus;
    }>,
  ): Promise<void>;

  // Checklist steps
  getChecklistSteps(taskId: string): Promise<ChecklistStep[]>;
  createChecklistStep(taskId: string, title: string): Promise<ChecklistStep>;
  updateChecklistStep(
    id: string,
    updates: Partial<Pick<ChecklistStep, "title" | "completed" | "position">>,
  ): Promise<ChecklistStep>;
  deleteChecklistStep(id: string): Promise<void>;

  // Timer preferences
  getTimerPreferences(): Promise<TimerPreferences | null>;
  updateTimerPreferences(
    prefs: Partial<Omit<TimerPreferences, "userId">>,
  ): Promise<TimerPreferences>;
}
