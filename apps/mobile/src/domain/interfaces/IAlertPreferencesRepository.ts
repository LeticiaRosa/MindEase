import type { AlertPreferences } from "../entities/AlertPreferences";

export interface IAlertPreferencesRepository {
  save(userId: string, preferences: AlertPreferences): Promise<void>;
  load(userId: string): Promise<AlertPreferences>;
}
