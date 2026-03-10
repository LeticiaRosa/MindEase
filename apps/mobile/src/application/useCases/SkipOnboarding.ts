import type { IOnboardingStateRepository } from "@/domain/interfaces/IOnboardingStateRepository";
import type { OnboardingState } from "@/domain/entities/OnboardingState";

export class SkipOnboarding {
  private readonly repository: IOnboardingStateRepository;

  constructor(repository: IOnboardingStateRepository) {
    this.repository = repository;
  }

  async execute(): Promise<OnboardingState> {
    const current = await this.repository.load();
    const next: OnboardingState = {
      status: "skipped",
      currentStep: current.currentStep,
      updatedAt: new Date().toISOString(),
    };

    await this.repository.save(next);
    return next;
  }
}
