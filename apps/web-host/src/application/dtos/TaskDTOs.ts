import type { TaskStatus } from "@/domain/valueObjects/TaskStatus";

export interface TaskDTO {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  position: number;
  createdAt: string;
  updatedAt: string;
}

export interface ChecklistStepDTO {
  id: string;
  taskId: string;
  title: string;
  completed: boolean;
  position: number;
  createdAt: string;
}
