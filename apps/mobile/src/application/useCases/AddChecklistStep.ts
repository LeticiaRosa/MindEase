import type { ITaskRepository } from "@/domain/interfaces/ITaskRepository";
import type { ChecklistStep } from "@/domain/entities/ChecklistStep";

export class AddChecklistStep {
  private readonly repository: ITaskRepository;

  constructor(repository: ITaskRepository) {
    this.repository = repository;
  }

  async execute(taskId: string, title: string): Promise<ChecklistStep> {
    if (!title.trim()) throw new Error("Step title cannot be empty");
    return this.repository.addChecklistStep(taskId, title.trim());
  }
}
