import type { Task } from "../entities/Task";
import type { ChecklistStep } from "../entities/ChecklistStep";
import type { TaskStatus } from "../valueObjects/TaskStatus";

export interface ITaskRepository {
  // Tasks
  getTasks(): Promise<Task[]>;
  getTasksByRoutine(routineId: string): Promise<Task[]>;
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
  updateTaskStatus(id: string, status: TaskStatus): Promise<Task>;
  deleteTask(id: string): Promise<void>;
  reorderTasks(
    updates: Array<{
      id: string;
      position: number;
      status: TaskStatus;
      previousStatus: TaskStatus;
    }>,
  ): Promise<void>;
  archiveTask(id: string): Promise<Task>;
  restoreTask(id: string, status: TaskStatus): Promise<Task>;
  addTaskTimeSpent(id: string, secondsToAdd: number): Promise<void>;

  // Checklist steps
  getChecklistSteps(taskId: string): Promise<ChecklistStep[]>;
  addChecklistStep(taskId: string, title: string): Promise<ChecklistStep>;
  updateChecklistStep(
    id: string,
    updates: Partial<Pick<ChecklistStep, "title" | "completed" | "position">>,
  ): Promise<ChecklistStep>;
  deleteChecklistStep(id: string): Promise<void>;
  toggleChecklistStep(id: string, completed: boolean): Promise<ChecklistStep>;
}
