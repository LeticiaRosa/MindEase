import type { AlertPreferences } from "@/domain/entities/AlertPreferences";

export interface IAlertPreferencesRepository {
  save(userId: string, preferences: AlertPreferences): void;
  load(userId: string): AlertPreferences;
}
