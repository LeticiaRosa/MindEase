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

describe("Onboarding use cases", () => {
  it("loads onboarding state", async () => {
    const repo = new InMemoryOnboardingRepo({
      status: "pending",
      currentStep: 2,
      updatedAt: new Date().toISOString(),
    });

    const result = await new GetOnboardingState(repo).execute();
    expect(result.status).toBe("pending");
    expect(result.currentStep).toBe(2);
  });

  it("starts onboarding as pending", async () => {
    const repo = new InMemoryOnboardingRepo(DEFAULT_ONBOARDING_STATE);
    const result = await new StartOnboarding(repo).execute();

    expect(result.status).toBe("pending");
    expect(result.currentStep).toBe(1);
  });

  it("advances onboarding step and caps at step 3", async () => {
    const repo = new InMemoryOnboardingRepo({
      status: "pending",
      currentStep: 2,
      updatedAt: new Date().toISOString(),
    });

    const firstAdvance = await new AdvanceOnboardingStep(repo).execute();
    expect(firstAdvance.currentStep).toBe(3);

    const secondAdvance = await new AdvanceOnboardingStep(repo).execute();
    expect(secondAdvance.currentStep).toBe(3);
  });

  it("completes onboarding and pins step 3", async () => {
    const repo = new InMemoryOnboardingRepo({
      status: "pending",
      currentStep: 2,
      updatedAt: new Date().toISOString(),
    });

    const result = await new CompleteOnboarding(repo).execute();
    expect(result.status).toBe("completed");
    expect(result.currentStep).toBe(3);
  });

  it("skips onboarding", async () => {
    const repo = new InMemoryOnboardingRepo(DEFAULT_ONBOARDING_STATE);
    const result = await new SkipOnboarding(repo).execute();

    expect(result.status).toBe("skipped");
  });

  it("resets onboarding to pending step 1", async () => {
    const repo = new InMemoryOnboardingRepo({
      status: "completed",
      currentStep: 3,
      updatedAt: new Date().toISOString(),
    });

    const result = await new ResetOnboarding(repo).execute();
    expect(result.status).toBe("pending");
    expect(result.currentStep).toBe(1);
  });
});
