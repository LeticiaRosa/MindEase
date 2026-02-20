import type { ITaskRepository } from "@/domain/interfaces/ITaskRepository";
import type { ChecklistStep } from "@/domain/entities/ChecklistStep";

export class CreateChecklistStep {
  constructor(private readonly repository: ITaskRepository) {}

  async execute(taskId: string, title: string): Promise<ChecklistStep> {
    if (!title.trim()) throw new Error("Step title cannot be empty");
    return this.repository.createChecklistStep(taskId, title.trim());
  }
}
