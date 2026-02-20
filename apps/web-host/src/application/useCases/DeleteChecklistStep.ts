import type { ITaskRepository } from "@/domain/interfaces/ITaskRepository";

export class DeleteChecklistStep {
  constructor(private readonly repository: ITaskRepository) {}

  async execute(id: string): Promise<void> {
    return this.repository.deleteChecklistStep(id);
  }
}
