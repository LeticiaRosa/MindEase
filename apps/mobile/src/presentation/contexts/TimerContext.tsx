import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useRef,
  useEffect,
  type ReactNode,
} from "react";
import { AppState, type AppStateStatus } from "react-native";
import {
  timerReducer,
  getDefaultTaskTimer,
  TIMER_DEFAULT_STATE,
  type TimerState,
  type TaskTimerState,
  type TimerStatus,
  type TimerMode,
} from "@/application/services/TimerService";

export type { TimerStatus, TimerMode, TaskTimerState, TimerState };

// ─── Context ─────────────────────────────────────────────────────────────────

interface TimerContextValue {
  state: TimerState;
  start: (taskId: string) => void;
  pause: (taskId: string) => void;
  reset: (taskId: string) => void;
  stop: (taskId: string) => number;
  nextMode: (taskId: string) => void;
  syncPreferences: (prefs: {
    focusDuration: number;
    breakDuration: number;
    longBreakDuration: number;
    cyclesBeforeLongBreak: number;
  }) => void;
  getTimerState: (taskId: string) => TaskTimerState;
}

const TimerContext = createContext<TimerContextValue | null>(null);

export function TimerProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(timerReducer, TIMER_DEFAULT_STATE);
  const intervalsRef = useRef<Map<string, ReturnType<typeof setInterval>>>(
    new Map(),
  );
  const stateRef = useRef(state);
  stateRef.current = state;

  // Manage per-task tick intervals
  useEffect(() => {
    const intervals = intervalsRef.current;
    const runningTaskIds = Object.entries(state.timers)
      .filter(([, timer]) => timer.status === "running")
      .map(([taskId]) => taskId);

    for (const taskId of runningTaskIds) {
      if (!intervals.has(taskId)) {
        const interval = setInterval(
          () => dispatch({ type: "TICK", taskId }),
          1000,
        );
        intervals.set(taskId, interval);
      }
    }
    for (const [taskId, interval] of intervals.entries()) {
      if (!runningTaskIds.includes(taskId)) {
        clearInterval(interval);
        intervals.delete(taskId);
      }
    }
    return () => {
      for (const interval of intervals.values()) {
        clearInterval(interval);
      }
      intervals.clear();
    };
  }, [state.timers]);

  // AppState listener: correct timers after returning from background
  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      (nextState: AppStateStatus) => {
        if (nextState === "active") {
          dispatch({ type: "BACKGROUND_CORRECTION", now: Date.now() });
        }
      },
    );
    return () => subscription.remove();
  }, []);

  const start = useCallback(
    (taskId: string) => dispatch({ type: "START", taskId }),
    [],
  );
  const pause = useCallback(
    (taskId: string) => dispatch({ type: "PAUSE", taskId }),
    [],
  );
  const reset = useCallback(
    (taskId: string) => dispatch({ type: "RESET", taskId }),
    [],
  );
  const stop = useCallback((taskId: string): number => {
    const timer = stateRef.current.timers[taskId];
    if (!timer) return 0;
    let finalElapsedSeconds = timer.elapsedSeconds;
    if (
      timer.mode === "focus" &&
      timer.startTime &&
      timer.status === "running"
    ) {
      finalElapsedSeconds += Math.floor((Date.now() - timer.startTime) / 1000);
    }
    dispatch({ type: "STOP", taskId });
    return finalElapsedSeconds;
  }, []);
  const nextMode = useCallback(
    (taskId: string) => dispatch({ type: "NEXT_MODE", taskId }),
    [],
  );
  const syncPreferences = useCallback(
    (prefs: {
      focusDuration: number;
      breakDuration: number;
      longBreakDuration: number;
      cyclesBeforeLongBreak: number;
    }) => dispatch({ type: "SYNC_PREFERENCES", ...prefs }),
    [],
  );
  const getTimerState = useCallback((taskId: string): TaskTimerState => {
    return (
      stateRef.current.timers[taskId] ||
      getDefaultTaskTimer(stateRef.current.globalPreferences.focusDuration)
    );
  }, []);

  return (
    <TimerContext.Provider
      value={{
        state,
        start,
        pause,
        reset,
        stop,
        nextMode,
        syncPreferences,
        getTimerState,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
}

export function useTimerContext(): TimerContextValue {
  const ctx = useContext(TimerContext);
  if (!ctx)
    throw new Error("useTimerContext must be used within TimerProvider");
  return ctx;
}
