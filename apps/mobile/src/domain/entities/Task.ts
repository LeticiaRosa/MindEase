import type { ChecklistStep } from "./ChecklistStep";
import type { TaskStatus } from "../valueObjects/TaskStatus";

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
  totalTimeSpent: number;
  checklistSteps?: ChecklistStep[];
}
