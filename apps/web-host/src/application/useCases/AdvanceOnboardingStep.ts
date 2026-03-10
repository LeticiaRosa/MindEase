import type { IOnboardingStateRepository } from "@/domain/interfaces/IOnboardingStateRepository";
import type { OnboardingState } from "@/domain/entities/OnboardingState";

export class AdvanceOnboardingStep {
  private readonly repository: IOnboardingStateRepository;

  constructor(repository: IOnboardingStateRepository) {
    this.repository = repository;
  }

  async execute(): Promise<OnboardingState> {
    const current = await this.repository.load();
    if (current.status === "completed") return current;

    const nextStep = Math.min(current.currentStep + 1, 3) as 1 | 2 | 3;
    const next: OnboardingState = {
      status: "in_progress",
      currentStep: nextStep,
      updatedAt: new Date().toISOString(),
    };

    await this.repository.save(next);
    return next;
  }
}
