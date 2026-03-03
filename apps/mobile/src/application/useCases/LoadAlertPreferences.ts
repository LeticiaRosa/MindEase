import type { AlertPreferences } from "@/domain/entities/AlertPreferences";
import type { IAlertPreferencesRepository } from "@/domain/interfaces/IAlertPreferencesRepository";

export const LoadAlertPreferences = {
  async execute(
    userId: string,
    repository: IAlertPreferencesRepository,
  ): Promise<AlertPreferences> {
    return repository.load(userId);
  },
};
