import type { ITaskRepository } from "@/domain/interfaces/ITaskRepository";

export class DeleteTask {
  private readonly repository: ITaskRepository;

  constructor(repository: ITaskRepository) {
    this.repository = repository;
  }

  async execute(id: string): Promise<void> {
    return this.repository.deleteTask(id);
  }
}
