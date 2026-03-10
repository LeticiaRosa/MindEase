import type { IOnboardingStateRepository } from "@/domain/interfaces/IOnboardingStateRepository";
import type { OnboardingState } from "@/domain/entities/OnboardingState";

export class StartOnboarding {
  private readonly repository: IOnboardingStateRepository;

  constructor(repository: IOnboardingStateRepository) {
    this.repository = repository;
  }

  async execute(): Promise<OnboardingState> {
    const current = await this.repository.load();
    if (current.status === "completed") return current;

    const next: OnboardingState = {
      status: "in_progress",
      currentStep: current.currentStep,
      updatedAt: new Date().toISOString(),
    };

    await this.repository.save(next);
    return next;
  }
}
