import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  type AlertPreferences,
  ALERT_PREFERENCES_STORAGE_KEY,
  DEFAULT_ALERT_PREFERENCES,
} from "@/domain/entities/AlertPreferences";
import type { IAlertPreferencesRepository } from "@/domain/interfaces/IAlertPreferencesRepository";

export class AlertPreferencesAsyncStorageAdapter implements IAlertPreferencesRepository {
  async save(userId: string, preferences: AlertPreferences): Promise<void> {
    try {
      await AsyncStorage.setItem(
        ALERT_PREFERENCES_STORAGE_KEY(userId),
        JSON.stringify(preferences),
      );
    } catch (err) {
      console.warn("[AlertPreferences] Failed to persist preferences:", err);
    }
  }

  async load(userId: string): Promise<AlertPreferences> {
    try {
      const raw = await AsyncStorage.getItem(
        ALERT_PREFERENCES_STORAGE_KEY(userId),
      );
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
