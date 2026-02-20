import type { ITaskRepository } from "@/domain/interfaces/ITaskRepository";
import type { ChecklistStep } from "@/domain/entities/ChecklistStep";

export class ToggleChecklistStep {
  constructor(private readonly repository: ITaskRepository) {}

  async execute(id: string, completed: boolean): Promise<ChecklistStep> {
    return this.repository.updateChecklistStep(id, { completed });
  }
}
