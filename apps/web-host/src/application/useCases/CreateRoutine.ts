import type { IRoutineRepository } from "@/domain/interfaces/IRoutineRepository";
import type { Routine } from "@/domain/entities/Routine";

export class CreateRoutine {
  private readonly repository: IRoutineRepository;

  constructor(repository: IRoutineRepository) {
    this.repository = repository;
  }

  async execute(name: string, icon?: string): Promise<Routine> {
    const trimmed = name.trim();
    if (!trimmed) throw new Error("Routine name cannot be empty");
    if (trimmed.length > 40)
      throw new Error("Routine name cannot exceed 40 characters");
    return this.repository.createRoutine(trimmed, icon);
  }
}
