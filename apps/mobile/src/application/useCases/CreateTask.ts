import type { ITaskRepository } from "@/domain/interfaces/ITaskRepository";
import type { Task } from "@/domain/entities/Task";
import type { TaskStatus } from "@/domain/valueObjects/TaskStatus";

export class CreateTask {
  private readonly repository: ITaskRepository;

  constructor(repository: ITaskRepository) {
    this.repository = repository;
  }

  async execute(
    routineId: string,
    title: string,
    description?: string,
    status?: TaskStatus,
  ): Promise<Task> {
    if (!title.trim()) throw new Error("Task title cannot be empty");
    return this.repository.createTask(
      routineId,
      title.trim(),
      description?.trim(),
      status,
    );
  }
}
