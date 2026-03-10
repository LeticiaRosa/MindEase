export type OnboardingStateValue = "pending" | "completed" | "skipped";

export interface UserCognitivePreferences {
  theme: "default" | "soft" | "high-contrast" | "dark";
  fontSize: "sm" | "md" | "lg";
  spacing: "compact" | "default" | "relaxed";
  mode: "resume" | "detail";
  helpers: "show" | "hide";
  complexity: "simple" | "complex";
  reduceMotion: boolean;
  onboardingState: OnboardingStateValue;
  currentStep: 1 | 2 | 3 | 4 | 5;
  onboardingCompletedAt: string | null;
  updatedAt: string;
}

export const DEFAULT_USER_COGNITIVE_PREFERENCES: UserCognitivePreferences = {
  theme: "default",
  fontSize: "md",
  spacing: "default",
  mode: "resume",
  helpers: "show",
  complexity: "simple",
  reduceMotion: false,
  onboardingState: "pending",
  currentStep: 1,
  onboardingCompletedAt: null,
  updatedAt: new Date(0).toISOString(),
};
