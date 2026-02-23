import type { ITaskRepository } from "@/domain/interfaces/ITaskRepository";
import type { ChecklistStep } from "@/domain/entities/ChecklistStep";

export class ToggleChecklistStep {
  private readonly repository: ITaskRepository;

  constructor(repository: ITaskRepository) {
    this.repository = repository;
  }

  async execute(id: string, completed: boolean): Promise<ChecklistStep> {
    return this.repository.updateChecklistStep(id, { completed });
  }
}
