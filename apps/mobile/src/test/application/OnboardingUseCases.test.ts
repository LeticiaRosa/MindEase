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
import { SkipOnboarding } from "@/application/useCases/SkipOnboarding";
import { ResetOnboarding } from "@/application/useCases/ResetOnboarding";

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
  it("progresses onboarding from pending and advances to step 2", async () => {
    const repo = new InMemoryOnboardingRepo();

    await new StartOnboarding(repo).execute();
    const advanced = await new AdvanceOnboardingStep(repo).execute();

    expect(advanced.status).toBe("pending");
    expect(advanced.currentStep).toBe(2);
  });

  it("keeps step capped at 5 and completes with persisted final state", async () => {
    const repo = new InMemoryOnboardingRepo({
      status: "pending",
      currentStep: 5,
      updatedAt: new Date().toISOString(),
    });

    const advanced = await new AdvanceOnboardingStep(repo).execute();
    expect(advanced.currentStep).toBe(5);

    const completed = await new CompleteOnboarding(repo).execute();
    const loaded = await new GetOnboardingState(repo).execute();

    expect(completed.status).toBe("completed");
    expect(loaded.status).toBe("completed");
    expect(loaded.currentStep).toBe(5);
  });

  it("supports skip and reset transitions", async () => {
    const repo = new InMemoryOnboardingRepo();
    const skipped = await new SkipOnboarding(repo).execute();

    expect(skipped.status).toBe("skipped");

    const reset = await new ResetOnboarding(repo).execute();
    expect(reset.status).toBe("pending");
    expect(reset.currentStep).toBe(1);
  });
});
