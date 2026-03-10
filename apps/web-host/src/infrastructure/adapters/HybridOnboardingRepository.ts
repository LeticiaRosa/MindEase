import type { OnboardingState } from "@/domain/entities/OnboardingState";
import type { IOnboardingStateRepository } from "@/domain/interfaces/IOnboardingStateRepository";
import { mapSupabaseError } from "@/infrastructure/errors/mapSupabaseError";
import { OnboardingLocalStorageAdapter } from "./OnboardingLocalStorageAdapter";
import { SupabaseUserCognitivePreferencesRepository } from "./SupabaseUserCognitivePreferencesRepository";

const ENABLE_REMOTE_SYNC =
  import.meta.env.VITE_ENABLE_REMOTE_PREFERENCES_SYNC !== "false";

const localRepository = new OnboardingLocalStorageAdapter();
const remoteRepository = new SupabaseUserCognitivePreferencesRepository();

export class HybridOnboardingRepository implements IOnboardingStateRepository {
  private readonly userId: string | null;

  constructor(userId: string | null) {
    this.userId = userId;
  }

  async load(): Promise<OnboardingState> {
    const local = await localRepository.load();

    if (!this.userId || !ENABLE_REMOTE_SYNC) {
      return local;
    }

    try {
      const remote = await remoteRepository.loadOnboardingState(this.userId);
      if (!remote) {
        await remoteRepository.saveOnboardingState(this.userId, local);
        return local;
      }

      await localRepository.save(remote);
      return remote;
    } catch (error) {
      console.warn("[HybridOnboardingRepository] remote-load-failed", {
        userId: this.userId,
        reason: mapSupabaseError(error),
        error,
      });
      return local;
    }
  }

  async save(state: OnboardingState): Promise<void> {
    await localRepository.save(state);

    if (!this.userId || !ENABLE_REMOTE_SYNC) {
      return;
    }

    try {
      await remoteRepository.saveOnboardingState(this.userId, state);
    } catch (error) {
      console.warn("[HybridOnboardingRepository] remote-save-failed", {
        userId: this.userId,
        reason: mapSupabaseError(error),
        error,
      });
    }
  }

  async clear(): Promise<void> {
    await localRepository.clear();
  }
}
