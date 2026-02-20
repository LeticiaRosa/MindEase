import type { ITaskRepository } from "@/domain/interfaces/ITaskRepository";
import type { Task } from "@/domain/entities/Task";
import type { TaskStatus } from "@/domain/valueObjects/TaskStatus";

export class UpdateTaskStatus {
  constructor(private readonly repository: ITaskRepository) {}

  async execute(id: string, status: TaskStatus): Promise<Task> {
    return this.repository.updateTask(id, { status });
  }
}
