import {
  type AlertPreferences,
  ALERT_PREFERENCES_STORAGE_KEY,
  DEFAULT_ALERT_PREFERENCES,
} from "@/domain/entities/AlertPreferences";
import type { IAlertPreferencesRepository } from "@/domain/interfaces/IAlertPreferencesRepository";

export class AlertPreferencesLocalStorageAdapter implements IAlertPreferencesRepository {
  save(userId: string, preferences: AlertPreferences): void {
    try {
      localStorage.setItem(
        ALERT_PREFERENCES_STORAGE_KEY(userId),
        JSON.stringify(preferences),
      );
    } catch (err) {
      console.warn("[AlertPreferences] Failed to persist preferences:", err);
    }
  }

  load(userId: string): AlertPreferences {
    try {
      const raw = localStorage.getItem(ALERT_PREFERENCES_STORAGE_KEY(userId));
      if (!raw) return { ...DEFAULT_ALERT_PREFERENCES };
      return JSON.parse(raw) as AlertPreferences;
    } catch (err) {
      console.warn(
        "[AlertPreferences] Failed to load preferences, using defaults:",
        err,
      );
      return { ...DEFAULT_ALERT_PREFERENCES };
    }
  }
}
