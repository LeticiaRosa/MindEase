import type { IRoutineRepository } from "@/domain/interfaces/IRoutineRepository";

export class ReorderRoutines {
  private readonly repository: IRoutineRepository;

  constructor(repository: IRoutineRepository) {
    this.repository = repository;
  }

  async execute(
    updates: Array<{ id: string; position: number }>,
  ): Promise<void> {
    return this.repository.reorderRoutines(updates);
  }
}
