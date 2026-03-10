export type OnboardingStatus = "not_started" | "in_progress" | "completed";

export interface OnboardingState {
  status: OnboardingStatus;
  currentStep: 1 | 2 | 3;
  updatedAt: string;
}

export const ONBOARDING_STATE_STORAGE_KEY = "mindease:onboarding-state:v1";

export const DEFAULT_ONBOARDING_STATE: OnboardingState = {
  status: "not_started",
  currentStep: 1,
  updatedAt: new Date(0).toISOString(),
};
