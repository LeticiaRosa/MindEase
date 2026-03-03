import type { ITaskRepository } from "@/domain/interfaces/ITaskRepository";
import type { TaskStatus } from "@/domain/valueObjects/TaskStatus";

export class ReorderTasks {
  private readonly repository: ITaskRepository;

  constructor(repository: ITaskRepository) {
    this.repository = repository;
  }

  async execute(
    updates: Array<{
      id: string;
      position: number;
      status: TaskStatus;
      previousStatus: TaskStatus;
    }>,
  ): Promise<void> {
    return this.repository.reorderTasks(updates);
  }
}
