import type { AlertPreferences } from "@/domain/entities/AlertPreferences";
import type { IAlertPreferencesRepository } from "@/domain/interfaces/IAlertPreferencesRepository";
import { alertPreferencesSchema } from "@/application/dtos/AlertPreferencesDTO";

export const SaveAlertPreferences = {
  execute(
    userId: string,
    preferences: AlertPreferences,
    repository: IAlertPreferencesRepository,
  ): AlertPreferences {
    const validated = alertPreferencesSchema.parse(preferences);
    repository.save(userId, validated);
    return validated;
  },
};
