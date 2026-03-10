import type { IOnboardingStateRepository } from "@/domain/interfaces/IOnboardingStateRepository";
import type { OnboardingState } from "@/domain/entities/OnboardingState";

export class GetOnboardingState {
  constructor(private readonly repository: IOnboardingStateRepository) {}

  async execute(): Promise<OnboardingState> {
    return this.repository.load();
  }
}
