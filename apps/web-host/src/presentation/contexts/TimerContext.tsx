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

export interface TaskTimerState {
  status: TimerStatus;
  mode: TimerMode;
  secondsRemaining: number;
  totalSeconds: number;
  currentCycle: number;
}

export interface TimerState {
  timers: Record<string, TaskTimerState>; // taskId -> timer state
  globalPreferences: {
    focusDuration: number; // in minutes
    breakDuration: number;
    longBreakDuration: number;
    cyclesBeforeLongBreak: number;
  };
}

const DEFAULT_STATE: TimerState = {
  timers: {},
  globalPreferences: {
    focusDuration: 25,
    breakDuration: 5,
    longBreakDuration: 15,
    cyclesBeforeLongBreak: 4,
  },
};

function getDefaultTaskTimer(focusDuration: number): TaskTimerState {
  return {
    status: "idle",
    mode: "focus",
    secondsRemaining: focusDuration * 60,
    totalSeconds: focusDuration * 60,
    currentCycle: 1,
  };
}

// ─── Actions ─────────────────────────────────────────────────────────────────

type TimerAction =
  | { type: "START"; taskId: string }
  | { type: "PAUSE"; taskId: string }
  | { type: "RESET"; taskId: string }
  | { type: "TICK"; taskId: string }
  | { type: "NEXT_MODE"; taskId: string }
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
    case "START": {
      const { taskId } = action;
      const existingTimer = state.timers[taskId];

      // Pause all other running timers
      const pausedTimers: Record<string, TaskTimerState> = {};
      for (const [id, timer] of Object.entries(state.timers)) {
        if (id !== taskId && timer.status === "running") {
          pausedTimers[id] = { ...timer, status: "paused" };
        } else {
          pausedTimers[id] = timer;
        }
      }

      if (!existingTimer) {
        // Create new timer for this task
        return {
          ...state,
          timers: {
            ...pausedTimers,
            [taskId]: {
              ...getDefaultTaskTimer(state.globalPreferences.focusDuration),
              status: "running",
            },
          },
        };
      }

      // Resume existing timer
      return {
        ...state,
        timers: {
          ...pausedTimers,
          [taskId]: {
            ...existingTimer,
            status: "running",
          },
        },
      };
    }

    case "PAUSE": {
      const { taskId } = action;
      const timer = state.timers[taskId];
      if (!timer) return state;

      return {
        ...state,
        timers: {
          ...state.timers,
          [taskId]: {
            ...timer,
            status: "paused",
          },
        },
      };
    }

    case "RESET": {
      const { taskId } = action;
      const timer = state.timers[taskId];
      if (!timer) return state;

      return {
        ...state,
        timers: {
          ...state.timers,
          [taskId]: getDefaultTaskTimer(state.globalPreferences.focusDuration),
        },
      };
    }

    case "TICK": {
      const { taskId } = action;
      const timer = state.timers[taskId];
      if (!timer || timer.status !== "running" || timer.secondsRemaining <= 0) {
        return state;
      }

      return {
        ...state,
        timers: {
          ...state.timers,
          [taskId]: {
            ...timer,
            secondsRemaining: timer.secondsRemaining - 1,
          },
        },
      };
    }

    case "NEXT_MODE": {
      const { taskId } = action;
      const timer = state.timers[taskId];
      if (!timer) return state;

      const isCompletingFocus = timer.mode === "focus";
      const nextCycle = isCompletingFocus
        ? timer.currentCycle + 1
        : timer.currentCycle;
      const isLongBreak =
        isCompletingFocus &&
        nextCycle > state.globalPreferences.cyclesBeforeLongBreak;

      if (!isCompletingFocus) {
        // Break ended → back to focus
        const cycle = isLongBreak ? 1 : nextCycle;
        return {
          ...state,
          timers: {
            ...state.timers,
            [taskId]: {
              mode: "focus",
              currentCycle: cycle,
              status: "idle",
              secondsRemaining: state.globalPreferences.focusDuration * 60,
              totalSeconds: state.globalPreferences.focusDuration * 60,
            },
          },
        };
      }

      if (isLongBreak) {
        return {
          ...state,
          timers: {
            ...state.timers,
            [taskId]: {
              mode: "long_break",
              currentCycle: 1,
              status: "idle",
              secondsRemaining: state.globalPreferences.longBreakDuration * 60,
              totalSeconds: state.globalPreferences.longBreakDuration * 60,
            },
          },
        };
      }

      return {
        ...state,
        timers: {
          ...state.timers,
          [taskId]: {
            mode: "break",
            currentCycle: nextCycle,
            status: "idle",
            secondsRemaining: state.globalPreferences.breakDuration * 60,
            totalSeconds: state.globalPreferences.breakDuration * 60,
          },
        },
      };
    }

    case "SET_PREFERENCES":
    case "SYNC_PREFERENCES":
      return {
        ...state,
        globalPreferences: {
          focusDuration: action.focusDuration,
          breakDuration: action.breakDuration,
          longBreakDuration: action.longBreakDuration,
          cyclesBeforeLongBreak: action.cyclesBeforeLongBreak,
        },
      };

    default:
      return state;
  }
}

// ─── Context ─────────────────────────────────────────────────────────────────

interface TimerContextValue {
  state: TimerState;
  start: (taskId: string) => void;
  pause: (taskId: string) => void;
  reset: (taskId: string) => void;
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
  const [state, dispatch] = useReducer(timerReducer, DEFAULT_STATE);
  const intervalsRef = useRef<Map<string, ReturnType<typeof setInterval>>>(
    new Map(),
  );

  // Tick every second for each running timer
  useEffect(() => {
    const intervals = intervalsRef.current;
    const runningTaskIds = Object.entries(state.timers)
      .filter(([, timer]) => timer.status === "running")
      .map(([taskId]) => taskId);

    // Start intervals for new running timers
    for (const taskId of runningTaskIds) {
      if (!intervals.has(taskId)) {
        const interval = setInterval(
          () => dispatch({ type: "TICK", taskId }),
          1000,
        );
        intervals.set(taskId, interval);
      }
    }

    // Clear intervals for stopped timers
    for (const [taskId, interval] of intervals.entries()) {
      if (!runningTaskIds.includes(taskId)) {
        clearInterval(interval);
        intervals.delete(taskId);
      }
    }

    // Cleanup all intervals on unmount
    return () => {
      for (const interval of intervals.values()) {
        clearInterval(interval);
      }
      intervals.clear();
    };
  }, [state.timers]);

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
  const getTimerState = useCallback(
    (taskId: string): TaskTimerState => {
      return (
        state.timers[taskId] ||
        getDefaultTaskTimer(state.globalPreferences.focusDuration)
      );
    },
    [state.timers, state.globalPreferences.focusDuration],
  );

  return (
    <TimerContext.Provider
      value={{
        state,
        start,
        pause,
        reset,
        nextMode,
        syncPreferences,
        getTimerState,
      }}
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
