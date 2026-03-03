import type { TimerPreferences } from "../entities/TimerPreferences";

export interface ITimerPreferencesRepository {
  getPreferences(userId: string): Promise<TimerPreferences | null>;
  savePreferences(
    userId: string,
    prefs: Partial<Omit<TimerPreferences, "userId">>,
  ): Promise<TimerPreferences>;
}
