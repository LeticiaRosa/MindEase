import type { IOnboardingStateRepository } from "@/domain/interfaces/IOnboardingStateRepository";
import type { OnboardingState } from "@/domain/entities/OnboardingState";

export class AdvanceOnboardingStep {
  private readonly repository: IOnboardingStateRepository;

  constructor(repository: IOnboardingStateRepository) {
    this.repository = repository;
  }

  async execute(): Promise<OnboardingState> {
    const current = await this.repository.load();
    if (current.status !== "pending") return current;

    const nextStep = Math.min(current.currentStep + 1, 5) as 1 | 2 | 3 | 4 | 5;
    const next: OnboardingState = {
      status: "pending",
      currentStep: nextStep,
      updatedAt: new Date().toISOString(),
    };

    await this.repository.save(next);
    return next;
  }
}
