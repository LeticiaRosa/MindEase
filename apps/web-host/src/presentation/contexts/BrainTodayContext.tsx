import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import {
  BRAIN_STATE_SESSION_KEY,
  type BrainStateValue,
} from "@/domain/valueObjects/BrainState";
import { RecordBrainState } from "@/application/useCases/RecordBrainState";

// ─── Context value ────────────────────────────────────────────────────────────

interface BrainTodayContextValue {
  brainState: BrainStateValue | null;
  recordState: (state: BrainStateValue) => void;
  skip: () => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const BrainTodayContext = createContext<BrainTodayContextValue | undefined>(
  undefined,
);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function BrainTodayProvider({ children }: { children: ReactNode }) {
  const [brainState, setBrainState] = useState<BrainStateValue | null>(() => {
    return (
      (sessionStorage.getItem(BRAIN_STATE_SESSION_KEY) as BrainStateValue) ??
      null
    );
  });

  const recordState = useCallback((state: BrainStateValue) => {
    RecordBrainState.execute(state);
    setBrainState(state);
  }, []);

  const skip = useCallback(() => {
    RecordBrainState.skip();
    // Mark as skipped with a sentinel so modal doesn't re-open this session
    sessionStorage.setItem(BRAIN_STATE_SESSION_KEY, "__skipped__");
    setBrainState(null);
  }, []);

  return (
    <BrainTodayContext.Provider value={{ brainState, recordState, skip }}>
      {children}
    </BrainTodayContext.Provider>
  );
}

// ─── Hook & utility ──────────────────────────────────────────────────────────

// eslint-disable-next-line react-refresh/only-export-components
export function useBrainToday(): BrainTodayContextValue {
  const ctx = useContext(BrainTodayContext);
  if (!ctx)
    throw new Error("useBrainToday must be used inside BrainTodayProvider");
  return ctx;
}

/** Returns true when the user has already answered or skipped the modal this session. */
// eslint-disable-next-line react-refresh/only-export-components
export function hasBrainStateForSession(): boolean {
  return sessionStorage.getItem(BRAIN_STATE_SESSION_KEY) !== null;
}
