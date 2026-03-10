import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useAuth } from "@/presentation/hooks/useAuth";
import type { OnboardingState } from "@/domain/entities/OnboardingState";
import { DEFAULT_ONBOARDING_STATE } from "@/domain/entities/OnboardingState";
import { HybridOnboardingRepository } from "@/infrastructure/adapters/HybridOnboardingRepository";
import { GetOnboardingState } from "@/application/useCases/GetOnboardingState";
import { StartOnboarding } from "@/application/useCases/StartOnboarding";
import { AdvanceOnboardingStep } from "@/application/useCases/AdvanceOnboardingStep";
import { CompleteOnboarding } from "@/application/useCases/CompleteOnboarding";
import { SkipOnboarding } from "@/application/useCases/SkipOnboarding";
import { ResetOnboarding } from "@/application/useCases/ResetOnboarding";

interface OnboardingContextValue {
  state: OnboardingState;
  isHydrated: boolean;
  shouldShowOnboarding: boolean;
  start: () => Promise<void>;
  nextStep: () => Promise<void>;
  complete: () => Promise<void>;
  skip: () => Promise<void>;
  reset: () => Promise<void>;
}

const OnboardingContext = createContext<OnboardingContextValue | undefined>(
  undefined,
);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const currentUserId = user?.id ?? null;
  const [state, setState] = useState<OnboardingState>(DEFAULT_ONBOARDING_STATE);
  const [hydratedForUserId, setHydratedForUserId] = useState<
    string | null | undefined
  >(undefined);

  const isHydrated = hydratedForUserId === currentUserId;

  useEffect(() => {
    const repository = new HybridOnboardingRepository(currentUserId);
    const getOnboardingState = new GetOnboardingState(repository);
    let cancelled = false;

    (async () => {
      const loaded = await getOnboardingState.execute();
      if (cancelled) {
        return;
      }

      setState(loaded);
      setHydratedForUserId(currentUserId);
    })();

    return () => {
      cancelled = true;
    };
  }, [currentUserId]);

  const start = useCallback(async () => {
    const repository = new HybridOnboardingRepository(user?.id ?? null);
    const startOnboarding = new StartOnboarding(repository);
    const next = await startOnboarding.execute();
    setState(next);
  }, [user?.id]);

  const nextStep = useCallback(async () => {
    const repository = new HybridOnboardingRepository(user?.id ?? null);
    const advanceOnboardingStep = new AdvanceOnboardingStep(repository);
    const next = await advanceOnboardingStep.execute();
    setState(next);
  }, [user?.id]);

  const complete = useCallback(async () => {
    const repository = new HybridOnboardingRepository(user?.id ?? null);
    const completeOnboarding = new CompleteOnboarding(repository);
    const next = await completeOnboarding.execute();
    setState(next);
  }, [user?.id]);

  const skip = useCallback(async () => {
    const repository = new HybridOnboardingRepository(user?.id ?? null);
    const skipOnboarding = new SkipOnboarding(repository);
    const next = await skipOnboarding.execute();
    setState(next);
  }, [user?.id]);

  const reset = useCallback(async () => {
    const repository = new HybridOnboardingRepository(user?.id ?? null);
    const resetOnboarding = new ResetOnboarding(repository);
    const next = await resetOnboarding.execute();
    setState(next);
  }, [user?.id]);

  return (
    <OnboardingContext.Provider
      value={{
        state,
        isHydrated,
        shouldShowOnboarding: isHydrated && state.status === "pending",
        start,
        nextStep,
        complete,
        skip,
        reset,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding(): OnboardingContextValue {
  const ctx = useContext(OnboardingContext);
  if (!ctx) {
    throw new Error("useOnboarding must be used inside OnboardingProvider");
  }
  return ctx;
}
