import type { ITaskRepository } from "@/domain/interfaces/ITaskRepository";
import type { Task } from "@/domain/entities/Task";

export class GetTasks {
  private readonly repository: ITaskRepository;

  constructor(repository: ITaskRepository) {
    this.repository = repository;
  }

  async execute(): Promise<Task[]> {
    return this.repository.getTasks();
  }
}
