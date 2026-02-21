import type { AlertPreferences } from "@/domain/entities/AlertPreferences";
import type { IAlertPreferencesRepository } from "@/domain/interfaces/IAlertPreferencesRepository";

export const LoadAlertPreferences = {
  execute(
    userId: string,
    repository: IAlertPreferencesRepository,
  ): AlertPreferences {
    return repository.load(userId);
  },
};
