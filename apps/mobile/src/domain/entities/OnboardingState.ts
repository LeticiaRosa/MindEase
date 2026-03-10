export type OnboardingStatus = "pending" | "completed" | "skipped";

export interface OnboardingState {
  status: OnboardingStatus;
  currentStep: 1 | 2 | 3 | 4 | 5;
  updatedAt: string;
}

export const ONBOARDING_STATE_STORAGE_KEY = "mindease:onboarding-state:v1";

export const DEFAULT_ONBOARDING_STATE: OnboardingState = {
  status: "pending",
  currentStep: 1,
  updatedAt: new Date(0).toISOString(),
};
