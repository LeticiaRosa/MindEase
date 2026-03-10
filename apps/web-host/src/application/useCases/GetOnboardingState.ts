import type { IOnboardingStateRepository } from "@/domain/interfaces/IOnboardingStateRepository";
import type { OnboardingState } from "@/domain/entities/OnboardingState";

export class GetOnboardingState {
  private readonly repository: IOnboardingStateRepository;

  constructor(repository: IOnboardingStateRepository) {
    this.repository = repository;
  }

  async execute(): Promise<OnboardingState> {
    return this.repository.load();
  }
}
