import type { IRoutineRepository } from "@/domain/interfaces/IRoutineRepository";
import type { Routine } from "@/domain/entities/Routine";

export class GetRoutines {
  private readonly repository: IRoutineRepository;

  constructor(repository: IRoutineRepository) {
    this.repository = repository;
  }

  async execute(): Promise<Routine[]> {
    return this.repository.getRoutines();
  }
}
