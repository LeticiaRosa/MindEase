import {
  DEFAULT_USER_COGNITIVE_PREFERENCES,
  type OnboardingStateValue,
  type UserCognitivePreferences,
} from "@/domain/entities/UserCognitivePreferences";
import type { OnboardingState } from "@/domain/entities/OnboardingState";
import supabaseClient from "@/infrastructure/api/clients/supabaseClient";

type DbRecord = {
  user_id: string;
  theme: UserCognitivePreferences["theme"];
  font_size: UserCognitivePreferences["fontSize"];
  spacing: UserCognitivePreferences["spacing"];
  mode: UserCognitivePreferences["mode"];
  complexity: UserCognitivePreferences["complexity"];
  reduce_motion: boolean;
  onboarding_state: OnboardingStateValue;
  current_step: 1 | 2 | 3 | 4 | 5;
  onboarding_completed_at: string | null;
  updated_at: string;
};

export class SupabaseUserCognitivePreferencesRepository {
  async load(userId: string): Promise<UserCognitivePreferences | null> {
    const { data, error } = await supabaseClient
      .from("user_cognitive_preferences")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle<DbRecord>();

    if (error) {
      throw new Error(error.message);
    }

    if (!data) {
      return null;
    }

    return this.mapRow(data);
  }

  async upsert(
    userId: string,
    patch: Partial<UserCognitivePreferences>,
  ): Promise<UserCognitivePreferences> {
    const mapped = {
      user_id: userId,
      ...(patch.theme ? { theme: patch.theme } : {}),
      ...(patch.fontSize ? { font_size: patch.fontSize } : {}),
      ...(patch.spacing ? { spacing: patch.spacing } : {}),
      ...(patch.mode ? { mode: patch.mode } : {}),
      ...(patch.complexity ? { complexity: patch.complexity } : {}),
      ...(typeof patch.reduceMotion === "boolean"
        ? { reduce_motion: patch.reduceMotion }
        : {}),
      ...(patch.onboardingState
        ? { onboarding_state: patch.onboardingState }
        : {}),
      ...(patch.currentStep ? { current_step: patch.currentStep } : {}),
      ...(patch.onboardingCompletedAt !== undefined
        ? { onboarding_completed_at: patch.onboardingCompletedAt }
        : {}),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabaseClient
      .from("user_cognitive_preferences")
      .upsert(mapped)
      .select("*")
      .single<DbRecord>();

    if (error) {
      throw new Error(error.message);
    }

    return this.mapRow(data);
  }

  async loadOnboardingState(userId: string): Promise<OnboardingState | null> {
    const prefs = await this.load(userId);
    if (!prefs) {
      return null;
    }

    return {
      status: prefs.onboardingState,
      currentStep: prefs.currentStep,
      updatedAt: prefs.updatedAt,
    };
  }

  async saveOnboardingState(
    userId: string,
    state: OnboardingState,
  ): Promise<OnboardingState> {
    const updated = await this.upsert(userId, {
      onboardingState: state.status,
      currentStep: state.currentStep,
      onboardingCompletedAt:
        state.status === "completed" ? new Date().toISOString() : null,
    });

    return {
      status: updated.onboardingState,
      currentStep: updated.currentStep,
      updatedAt: updated.updatedAt,
    };
  }

  private mapRow(row: DbRecord): UserCognitivePreferences {
    return {
      ...DEFAULT_USER_COGNITIVE_PREFERENCES,
      theme: row.theme,
      fontSize: row.font_size,
      spacing: row.spacing,
      mode: row.mode,
      complexity: row.complexity,
      reduceMotion: row.reduce_motion,
      onboardingState: row.onboarding_state,
      currentStep: row.current_step,
      onboardingCompletedAt: row.onboarding_completed_at,
      updatedAt: row.updated_at,
    };
  }
}
