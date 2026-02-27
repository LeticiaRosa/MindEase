import type { ITaskRepository } from "@/domain/interfaces/ITaskRepository";
import type { ChecklistStep } from "@/domain/entities/ChecklistStep";

export class UpdateChecklistStep {
  private readonly repository: ITaskRepository;

  constructor(repository: ITaskRepository) {
    this.repository = repository;
  }

  async execute(id: string, title: string): Promise<ChecklistStep> {
    if (!title.trim()) {
      throw new Error("Step title cannot be empty");
    }

    return this.repository.updateChecklistStep(id, { title: title.trim() });
  }
}
