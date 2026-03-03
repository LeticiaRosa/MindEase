import type { IRoutineRepository } from "@/domain/interfaces/IRoutineRepository";
import type { Routine } from "@/domain/entities/Routine";

export class UpdateRoutine {
  private readonly repository: IRoutineRepository;

  constructor(repository: IRoutineRepository) {
    this.repository = repository;
  }

  async execute(
    id: string,
    updates: Partial<Pick<Routine, "name" | "icon">>,
  ): Promise<Routine> {
    if (updates.name !== undefined) {
      const trimmed = updates.name.trim();
      if (!trimmed) throw new Error("Routine name cannot be empty");
      if (trimmed.length > 40)
        throw new Error("Routine name cannot exceed 40 characters");
      updates = { ...updates, name: trimmed };
    }
    return this.repository.updateRoutine(id, updates);
  }
}
