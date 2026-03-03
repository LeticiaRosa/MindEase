import type { ITaskRepository } from "@/domain/interfaces/ITaskRepository";

export class AddTaskTimeSpent {
  private readonly repository: ITaskRepository;

  constructor(repository: ITaskRepository) {
    this.repository = repository;
  }

  async execute(id: string, seconds: number): Promise<void> {
    if (seconds <= 0) return;
    return this.repository.addTaskTimeSpent(id, seconds);
  }
}
