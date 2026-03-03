import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  type ActivitySignals,
  DEFAULT_ACTIVITY_SIGNALS,
} from "@/domain/entities/ActivitySignals";

// ─── Context value ────────────────────────────────────────────────────────────

interface ActivitySignalsContextValue {
  signals: ActivitySignals;
  recordTaskSwitch: () => void;
  resetSwitchCount: () => void;
  setCurrentTask: (params: {
    startedAt: number;
    plannedDurationMs?: number;
    isComplex?: boolean;
  }) => void;
  clearCurrentTask: () => void;
  recordInteraction: () => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const ActivitySignalsContext = createContext<
  ActivitySignalsContextValue | undefined
>(undefined);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function ActivitySignalsProvider({ children }: { children: ReactNode }) {
  const [signals, setSignals] = useState<ActivitySignals>(() => ({
    ...DEFAULT_ACTIVITY_SIGNALS,
    lastInteractionMs: Date.now(),
  }));

  const taskStartRef = useRef<number | null>(null);

  // Update timeOnCurrentTaskMs every 60 seconds
  useEffect(() => {
    const id = setInterval(() => {
      if (taskStartRef.current !== null) {
        setSignals((prev) => ({
          ...prev,
          timeOnCurrentTaskMs:
            Date.now() - (taskStartRef.current ?? Date.now()),
        }));
      }
    }, 60_000);
    return () => clearInterval(id);
  }, []);

  const recordTaskSwitch = useCallback(() => {
    setSignals((prev) => ({
      ...prev,
      taskSwitchCount: prev.taskSwitchCount + 1,
    }));
  }, []);

  const resetSwitchCount = useCallback(() => {
    setSignals((prev) => ({ ...prev, taskSwitchCount: 0 }));
  }, []);

  const setCurrentTask = useCallback(
    ({
      startedAt,
      plannedDurationMs = 0,
      isComplex = false,
    }: {
      startedAt: number;
      plannedDurationMs?: number;
      isComplex?: boolean;
    }) => {
      taskStartRef.current = startedAt;
      setSignals((prev) => ({
        ...prev,
        timeOnCurrentTaskMs: Date.now() - startedAt,
        plannedTaskDurationMs: plannedDurationMs,
        currentTaskIsComplex: isComplex,
      }));
    },
    [],
  );

  const clearCurrentTask = useCallback(() => {
    taskStartRef.current = null;
    setSignals((prev) => ({
      ...prev,
      timeOnCurrentTaskMs: 0,
      plannedTaskDurationMs: 0,
      currentTaskIsComplex: false,
    }));
  }, []);

  const recordInteraction = useCallback(() => {
    setSignals((prev) => ({ ...prev, lastInteractionMs: Date.now() }));
  }, []);

  return (
    <ActivitySignalsContext.Provider
      value={{
        signals,
        recordTaskSwitch,
        resetSwitchCount,
        setCurrentTask,
        clearCurrentTask,
        recordInteraction,
      }}
    >
      {children}
    </ActivitySignalsContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useActivitySignals(): ActivitySignalsContextValue {
  const ctx = useContext(ActivitySignalsContext);
  if (!ctx) {
    throw new Error(
      "useActivitySignals must be used inside ActivitySignalsProvider",
    );
  }
  return ctx;
}
