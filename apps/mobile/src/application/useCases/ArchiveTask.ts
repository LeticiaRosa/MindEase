import type { ITaskRepository } from "@/domain/interfaces/ITaskRepository";
import type { Task } from "@/domain/entities/Task";

export class ArchiveTask {
  private readonly repository: ITaskRepository;

  constructor(repository: ITaskRepository) {
    this.repository = repository;
  }

  async execute(id: string): Promise<Task> {
    return this.repository.archiveTask(id);
  }
}
