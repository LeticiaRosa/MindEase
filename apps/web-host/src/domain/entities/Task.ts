import type { TaskStatus } from "@/domain/valueObjects/TaskStatus";

export interface Task {
  id: string;
  userId: string;
  routineId: string;
  title: string;
  description?: string;
  status: TaskStatus;
  position: number;
  createdAt: string;
  updatedAt: string;
  statusUpdatedAt: string;
}
