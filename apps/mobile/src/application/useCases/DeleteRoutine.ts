import type { IRoutineRepository } from "@/domain/interfaces/IRoutineRepository";

export class DeleteRoutine {
  private readonly repository: IRoutineRepository;

  constructor(repository: IRoutineRepository) {
    this.repository = repository;
  }

  async execute(id: string): Promise<void> {
    try {
      await this.repository.deleteRoutine(id);
    } catch {
      // Silent on non-existent routine
    }
  }
}
