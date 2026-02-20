import type { ITaskRepository } from "@/domain/interfaces/ITaskRepository";
import type { TaskStatus } from "@/domain/valueObjects/TaskStatus";

export class ReorderTasks {
  constructor(private readonly repository: ITaskRepository) {}

  async execute(
    updates: Array<{ id: string; position: number; status: TaskStatus }>,
  ): Promise<void> {
    return this.repository.reorderTasks(updates);
  }
}
