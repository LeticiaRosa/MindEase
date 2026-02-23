import type { ITaskRepository } from "@/domain/interfaces/ITaskRepository";
import type { TimerPreferences } from "@/domain/entities/TimerPreferences";

export class UpdateTimerPreferences {
  private readonly repository: ITaskRepository;

  constructor(repository: ITaskRepository) {
    this.repository = repository;
  }

  async execute(
    prefs: Partial<Omit<TimerPreferences, "userId">>,
  ): Promise<TimerPreferences> {
    return this.repository.updateTimerPreferences(prefs);
  }
}
