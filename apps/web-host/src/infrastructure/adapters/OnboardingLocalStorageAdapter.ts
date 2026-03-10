import {
  DEFAULT_ONBOARDING_STATE,
  ONBOARDING_STATE_STORAGE_KEY,
  type OnboardingState,
} from "@/domain/entities/OnboardingState";
import type { IOnboardingStateRepository } from "@/domain/interfaces/IOnboardingStateRepository";

export class OnboardingLocalStorageAdapter implements IOnboardingStateRepository {
  async load(): Promise<OnboardingState> {
    try {
      const raw = localStorage.getItem(ONBOARDING_STATE_STORAGE_KEY);
      if (!raw) return DEFAULT_ONBOARDING_STATE;

      const parsed = JSON.parse(raw) as Partial<OnboardingState>;
      const status = parsed.status;
      const currentStep = parsed.currentStep;

      if (
        (status !== "pending" &&
          status !== "completed" &&
          status !== "skipped") ||
        (currentStep !== 1 && currentStep !== 2 && currentStep !== 3)
      ) {
        return DEFAULT_ONBOARDING_STATE;
      }

      return {
        status,
        currentStep,
        updatedAt:
          typeof parsed.updatedAt === "string"
            ? parsed.updatedAt
            : DEFAULT_ONBOARDING_STATE.updatedAt,
      };
    } catch {
      return DEFAULT_ONBOARDING_STATE;
    }
  }

  async save(state: OnboardingState): Promise<void> {
    localStorage.setItem(ONBOARDING_STATE_STORAGE_KEY, JSON.stringify(state));
  }

  async clear(): Promise<void> {
    localStorage.removeItem(ONBOARDING_STATE_STORAGE_KEY);
  }
}
