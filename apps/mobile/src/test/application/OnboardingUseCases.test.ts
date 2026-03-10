import { describe, expect, it } from "vitest";
import {
  DEFAULT_ONBOARDING_STATE,
  type OnboardingState,
} from "@/domain/entities/OnboardingState";
import type { IOnboardingStateRepository } from "@/domain/interfaces/IOnboardingStateRepository";
import { GetOnboardingState } from "@/application/useCases/GetOnboardingState";
import { StartOnboarding } from "@/application/useCases/StartOnboarding";
import { AdvanceOnboardingStep } from "@/application/useCases/AdvanceOnboardingStep";
import { CompleteOnboarding } from "@/application/useCases/CompleteOnboarding";

class InMemoryOnboardingRepo implements IOnboardingStateRepository {
  private state: OnboardingState;

  constructor(initialState?: OnboardingState) {
    this.state = initialState ?? DEFAULT_ONBOARDING_STATE;
  }

  async load(): Promise<OnboardingState> {
    return this.state;
  }

  async save(state: OnboardingState): Promise<void> {
    this.state = state;
  }

  async clear(): Promise<void> {
    this.state = DEFAULT_ONBOARDING_STATE;
  }
}

describe("Mobile onboarding use cases", () => {
  it("progresses onboarding from not_started to in_progress and step 2", async () => {
    const repo = new InMemoryOnboardingRepo();

    await new StartOnboarding(repo).execute();
    const advanced = await new AdvanceOnboardingStep(repo).execute();

    expect(advanced.status).toBe("in_progress");
    expect(advanced.currentStep).toBe(2);
  });

  it("keeps step capped at 3 and completes with persisted final state", async () => {
    const repo = new InMemoryOnboardingRepo({
      status: "in_progress",
      currentStep: 3,
      updatedAt: new Date().toISOString(),
    });

    const advanced = await new AdvanceOnboardingStep(repo).execute();
    expect(advanced.currentStep).toBe(3);

    const completed = await new CompleteOnboarding(repo).execute();
    const loaded = await new GetOnboardingState(repo).execute();

    expect(completed.status).toBe("completed");
    expect(loaded.status).toBe("completed");
    expect(loaded.currentStep).toBe(3);
  });
});
