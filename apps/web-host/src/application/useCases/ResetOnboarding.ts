import type { IOnboardingStateRepository } from "@/domain/interfaces/IOnboardingStateRepository";
import type { OnboardingState } from "@/domain/entities/OnboardingState";

export class ResetOnboarding {
  private readonly repository: IOnboardingStateRepository;

  constructor(repository: IOnboardingStateRepository) {
    this.repository = repository;
  }

  async execute(): Promise<OnboardingState> {
    const next: OnboardingState = {
      status: "pending",
      currentStep: 1,
      updatedAt: new Date().toISOString(),
    };

    await this.repository.save(next);
    return next;
  }
}
