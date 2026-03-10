import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { OnboardingState } from "@/domain/entities/OnboardingState";
import { DEFAULT_ONBOARDING_STATE } from "@/domain/entities/OnboardingState";
import { OnboardingAsyncStorageAdapter } from "@/infrastructure/adapters/OnboardingAsyncStorageAdapter";
import { GetOnboardingState } from "@/application/useCases/GetOnboardingState";
import { StartOnboarding } from "@/application/useCases/StartOnboarding";
import { AdvanceOnboardingStep } from "@/application/useCases/AdvanceOnboardingStep";
import { CompleteOnboarding } from "@/application/useCases/CompleteOnboarding";

interface OnboardingContextValue {
  state: OnboardingState;
  isHydrated: boolean;
  shouldShowOnboarding: boolean;
  start: () => Promise<void>;
  nextStep: () => Promise<void>;
  complete: () => Promise<void>;
}

const repository = new OnboardingAsyncStorageAdapter();
const getOnboardingState = new GetOnboardingState(repository);
const startOnboarding = new StartOnboarding(repository);
const advanceOnboardingStep = new AdvanceOnboardingStep(repository);
const completeOnboarding = new CompleteOnboarding(repository);

const OnboardingContext = createContext<OnboardingContextValue | undefined>(
  undefined,
);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<OnboardingState>(DEFAULT_ONBOARDING_STATE);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    (async () => {
      const loaded = await getOnboardingState.execute();
      setState(loaded);
      setIsHydrated(true);
    })();
  }, []);

  const start = useCallback(async () => {
    const next = await startOnboarding.execute();
    setState(next);
  }, []);

  const nextStep = useCallback(async () => {
    const next = await advanceOnboardingStep.execute();
    setState(next);
  }, []);

  const complete = useCallback(async () => {
    const next = await completeOnboarding.execute();
    setState(next);
  }, []);

  return (
    <OnboardingContext.Provider
      value={{
        state,
        isHydrated,
        shouldShowOnboarding: state.status !== "completed",
        start,
        nextStep,
        complete,
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
