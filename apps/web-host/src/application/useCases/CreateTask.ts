import type { ITaskRepository } from "@/domain/interfaces/ITaskRepository";
import type { Task } from "@/domain/entities/Task";

export class CreateTask {
  constructor(private readonly repository: ITaskRepository) {}

  async execute(
    routineId: string,
    title: string,
    description?: string,
  ): Promise<Task> {
    if (!title.trim()) throw new Error("Task title cannot be empty");
    return this.repository.createTask(
      routineId,
      title.trim(),
      description?.trim(),
    );
  }
}
