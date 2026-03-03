import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { BrainStateValue } from "@/domain/entities/BrainState";
import { RecordBrainState } from "@/application/useCases/RecordBrainState";

// ─── Context value ────────────────────────────────────────────────────────────

interface BrainTodayContextValue {
  brainState: BrainStateValue | null;
  hasAnsweredToday: boolean;
  isHydrated: boolean;
  setBrainState: (value: BrainStateValue) => void;
  skip: () => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const BrainTodayContext = createContext<BrainTodayContextValue | undefined>(
  undefined,
);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function BrainTodayProvider({ children }: { children: ReactNode }) {
  const [brainState, setBrainStateInternal] = useState<BrainStateValue | null>(
    null,
  );
  const [hasAnsweredToday, setHasAnsweredToday] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate from AsyncStorage on mount
  useEffect(() => {
    (async () => {
      try {
        const answered = await RecordBrainState.hasAnsweredToday();
        setHasAnsweredToday(answered);
        if (answered) {
          const stored = await RecordBrainState.read();
          setBrainStateInternal(stored);
        }
      } catch {
        // Continue with defaults
      } finally {
        setIsHydrated(true);
      }
    })();
  }, []);

  const setBrainState = useCallback((value: BrainStateValue) => {
    setBrainStateInternal(value);
    setHasAnsweredToday(true);
    RecordBrainState.execute(value).catch(() => {});
  }, []);

  const skip = useCallback(() => {
    setHasAnsweredToday(true);
    setBrainStateInternal(null);
    RecordBrainState.skip().catch(() => {});
  }, []);

  return (
    <BrainTodayContext.Provider
      value={{ brainState, hasAnsweredToday, isHydrated, setBrainState, skip }}
    >
      {children}
    </BrainTodayContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useBrainToday(): BrainTodayContextValue {
  const ctx = useContext(BrainTodayContext);
  if (!ctx) {
    throw new Error("useBrainToday must be used inside BrainTodayProvider");
  }
  return ctx;
}
