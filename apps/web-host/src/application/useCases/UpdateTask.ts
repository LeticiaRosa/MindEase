import type { ITaskRepository } from "@/domain/interfaces/ITaskRepository";
import type { Task } from "@/domain/entities/Task";

export interface UpdateTaskParams {
  title?: string;
  description?: string;
}

export class UpdateTask {
  private readonly repository: ITaskRepository;

  constructor(repository: ITaskRepository) {
    this.repository = repository;
  }

  async execute(id: string, params: UpdateTaskParams): Promise<Task> {
    if (!params.title && !params.description) {
      throw new Error(
        "At least one field (title or description) must be provided",
      );
    }

    return this.repository.updateTask(id, params);
  }
}
