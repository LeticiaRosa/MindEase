import type { OnboardingState } from "@/domain/entities/OnboardingState";

export interface IOnboardingStateRepository {
  load(): Promise<OnboardingState>;
  save(state: OnboardingState): Promise<void>;
  clear(): Promise<void>;
}
