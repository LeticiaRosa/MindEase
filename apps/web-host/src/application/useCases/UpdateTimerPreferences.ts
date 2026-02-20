import type { ITaskRepository } from "@/domain/interfaces/ITaskRepository";
import type { TimerPreferences } from "@/domain/entities/TimerPreferences";

export class UpdateTimerPreferences {
  constructor(private readonly repository: ITaskRepository) {}

  async execute(
    prefs: Partial<Omit<TimerPreferences, "userId">>,
  ): Promise<TimerPreferences> {
    return this.repository.updateTimerPreferences(prefs);
  }
}
