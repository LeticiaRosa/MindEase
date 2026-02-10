export type TaskStatus = "todo" | "in-progress" | "done";

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  steps: string[];
  completedSteps: number[];
  createdAt: Date;
}
