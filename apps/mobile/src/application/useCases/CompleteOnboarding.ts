import type { IOnboardingStateRepository } from "@/domain/interfaces/IOnboardingStateRepository";
import type { OnboardingState } from "@/domain/entities/OnboardingState";

export class CompleteOnboarding {
  constructor(private readonly repository: IOnboardingStateRepository) {}

  async execute(): Promise<OnboardingState> {
    const next: OnboardingState = {
      status: "completed",
      currentStep: 3,
      updatedAt: new Date().toISOString(),
    };

    await this.repository.save(next);
    return next;
  }
}
