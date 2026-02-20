import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useRef,
  useEffect,
  type ReactNode,
} from "react";

// ─── State ───────────────────────────────────────────────────────────────────

export type TimerStatus = "idle" | "running" | "paused";
export type TimerMode = "focus" | "break" | "long_break";

export interface TimerState {
  status: TimerStatus;
  mode: TimerMode;
  activeTaskId: string | null;
  secondsRemaining: number;
  totalSeconds: number;
  currentCycle: number;
  cyclesBeforeLongBreak: number;
  focusDuration: number; // in minutes
  breakDuration: number;
  longBreakDuration: number;
}

const DEFAULT_STATE: TimerState = {
  status: "idle",
  mode: "focus",
  activeTaskId: null,
  secondsRemaining: 25 * 60,
  totalSeconds: 25 * 60,
  currentCycle: 1,
  cyclesBeforeLongBreak: 4,
  focusDuration: 25,
  breakDuration: 5,
  longBreakDuration: 15,
};

// ─── Actions ─────────────────────────────────────────────────────────────────

type TimerAction =
  | { type: "START"; taskId: string }
  | { type: "PAUSE" }
  | { type: "RESET" }
  | { type: "TICK" }
  | { type: "NEXT_MODE" }
  | {
      type: "SET_PREFERENCES";
      focusDuration: number;
      breakDuration: number;
      longBreakDuration: number;
      cyclesBeforeLongBreak: number;
    }
  | {
      type: "SYNC_PREFERENCES";
      focusDuration: number;
      breakDuration: number;
      longBreakDuration: number;
      cyclesBeforeLongBreak: number;
    };

function timerReducer(state: TimerState, action: TimerAction): TimerState {
  switch (action.type) {
    case "START":
      // If a different task's timer was running, reset to focus for the new task
      if (state.activeTaskId && state.activeTaskId !== action.taskId) {
        return {
          ...state,
          status: "running",
          mode: "focus",
          activeTaskId: action.taskId,
          secondsRemaining: state.focusDuration * 60,
          totalSeconds: state.focusDuration * 60,
          currentCycle: 1,
        };
      }
      return { ...state, status: "running", activeTaskId: action.taskId };

    case "PAUSE":
      return { ...state, status: "paused" };

    case "RESET":
      return {
        ...state,
        status: "idle",
        mode: "focus",
        secondsRemaining: state.focusDuration * 60,
        totalSeconds: state.focusDuration * 60,
        currentCycle: 1,
        activeTaskId: null,
      };

    case "TICK":
      if (state.status !== "running" || state.secondsRemaining <= 0)
        return state;
      return { ...state, secondsRemaining: state.secondsRemaining - 1 };

    case "NEXT_MODE": {
      const isCompletingFocus = state.mode === "focus";
      const nextCycle = isCompletingFocus
        ? state.currentCycle + 1
        : state.currentCycle;
      const isLongBreak =
        isCompletingFocus && nextCycle > state.cyclesBeforeLongBreak;

      if (!isCompletingFocus) {
        // Break ended → back to focus
        const cycle = isLongBreak ? 1 : nextCycle;
        return {
          ...state,
          mode: "focus",
          currentCycle: cycle,
          status: "idle",
          secondsRemaining: state.focusDuration * 60,
          totalSeconds: state.focusDuration * 60,
        };
      }

      if (isLongBreak) {
        return {
          ...state,
          mode: "long_break",
          currentCycle: 1,
          status: "idle",
          secondsRemaining: state.longBreakDuration * 60,
          totalSeconds: state.longBreakDuration * 60,
        };
      }

      return {
        ...state,
        mode: "break",
        currentCycle: nextCycle,
        status: "idle",
        secondsRemaining: state.breakDuration * 60,
        totalSeconds: state.breakDuration * 60,
      };
    }

    case "SET_PREFERENCES":
    case "SYNC_PREFERENCES":
      return {
        ...state,
        focusDuration: action.focusDuration,
        breakDuration: action.breakDuration,
        longBreakDuration: action.longBreakDuration,
        cyclesBeforeLongBreak: action.cyclesBeforeLongBreak,
        // Reset timer to new focus duration if idle
        ...(state.status === "idle" && state.mode === "focus"
          ? {
              secondsRemaining: action.focusDuration * 60,
              totalSeconds: action.focusDuration * 60,
            }
          : {}),
      };

    default:
      return state;
  }
}

// ─── Context ─────────────────────────────────────────────────────────────────

interface TimerContextValue {
  state: TimerState;
  start: (taskId: string) => void;
  pause: () => void;
  reset: () => void;
  nextMode: () => void;
  syncPreferences: (prefs: {
    focusDuration: number;
    breakDuration: number;
    longBreakDuration: number;
    cyclesBeforeLongBreak: number;
  }) => void;
}

const TimerContext = createContext<TimerContextValue | null>(null);

export function TimerProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(timerReducer, DEFAULT_STATE);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Tick every second when running
  useEffect(() => {
    if (state.status === "running") {
      intervalRef.current = setInterval(() => dispatch({ type: "TICK" }), 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [state.status]);

  const start = useCallback(
    (taskId: string) => dispatch({ type: "START", taskId }),
    [],
  );
  const pause = useCallback(() => dispatch({ type: "PAUSE" }), []);
  const reset = useCallback(() => dispatch({ type: "RESET" }), []);
  const nextMode = useCallback(() => dispatch({ type: "NEXT_MODE" }), []);
  const syncPreferences = useCallback(
    (prefs: {
      focusDuration: number;
      breakDuration: number;
      longBreakDuration: number;
      cyclesBeforeLongBreak: number;
    }) => dispatch({ type: "SYNC_PREFERENCES", ...prefs }),
    [],
  );

  return (
    <TimerContext.Provider
      value={{ state, start, pause, reset, nextMode, syncPreferences }}
    >
      {children}
    </TimerContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTimerContext(): TimerContextValue {
  const ctx = useContext(TimerContext);
  if (!ctx)
    throw new Error("useTimerContext must be used within TimerProvider");
  return ctx;
}
