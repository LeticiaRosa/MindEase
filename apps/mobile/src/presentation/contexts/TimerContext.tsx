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

// ─── State ───────────────────────────────────────────────────────────────────

export type TimerStatus = "idle" | "running" | "paused";
export type TimerMode = "focus" | "break" | "long_break";

export interface TaskTimerState {
  status: TimerStatus;
  mode: TimerMode;
  secondsRemaining: number;
  totalSeconds: number;
  currentCycle: number;
  startTime: number | null;
  elapsedSeconds: number;
}

export interface TimerState {
  timers: Record<string, TaskTimerState>;
  globalPreferences: {
    focusDuration: number;
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
    startTime: null,
    elapsedSeconds: 0,
  };
}

// ─── Actions ─────────────────────────────────────────────────────────────────

type TimerAction =
  | { type: "START"; taskId: string }
  | { type: "PAUSE"; taskId: string }
  | { type: "RESET"; taskId: string }
  | { type: "STOP"; taskId: string }
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
    }
  | { type: "BACKGROUND_CORRECTION"; now: number };

function timerReducer(state: TimerState, action: TimerAction): TimerState {
  switch (action.type) {
    case "START": {
      const { taskId } = action;
      const existingTimer = state.timers[taskId];
      const pausedTimers: Record<string, TaskTimerState> = {};
      for (const [id, timer] of Object.entries(state.timers)) {
        if (id !== taskId && timer.status === "running") {
          pausedTimers[id] = { ...timer, status: "paused" };
        } else {
          pausedTimers[id] = timer;
        }
      }
      if (!existingTimer) {
        return {
          ...state,
          timers: {
            ...pausedTimers,
            [taskId]: {
              ...getDefaultTaskTimer(state.globalPreferences.focusDuration),
              status: "running",
              startTime: Date.now(),
              elapsedSeconds: 0,
            },
          },
        };
      }
      const resumeStartTime =
        existingTimer.mode === "focus" ? Date.now() : existingTimer.startTime;
      return {
        ...state,
        timers: {
          ...pausedTimers,
          [taskId]: {
            ...existingTimer,
            status: "running",
            startTime: resumeStartTime,
          },
        },
      };
    }

    case "PAUSE": {
      const { taskId } = action;
      const timer = state.timers[taskId];
      if (!timer) return state;
      let newElapsedSeconds = timer.elapsedSeconds;
      if (
        timer.mode === "focus" &&
        timer.startTime &&
        timer.status === "running"
      ) {
        const sessionDuration = Math.floor(
          (Date.now() - timer.startTime) / 1000,
        );
        newElapsedSeconds += sessionDuration;
      }
      return {
        ...state,
        timers: {
          ...state.timers,
          [taskId]: {
            ...timer,
            status: "paused",
            startTime: null,
            elapsedSeconds: newElapsedSeconds,
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

    case "STOP": {
      const { taskId } = action;
      const timer = state.timers[taskId];
      if (!timer) return state;
      const newTimers = { ...state.timers };
      delete newTimers[taskId];
      return { ...state, timers: newTimers };
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
              startTime: null,
              elapsedSeconds: 0,
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
              startTime: null,
              elapsedSeconds: 0,
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
            startTime: null,
            elapsedSeconds: 0,
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

    case "BACKGROUND_CORRECTION": {
      // Correct timers that were running while app was in background
      const corrected: Record<string, TaskTimerState> = {};
      for (const [taskId, timer] of Object.entries(state.timers)) {
        if (timer.status === "running" && timer.startTime) {
          const elapsedSinceStart = Math.floor(
            (action.now - timer.startTime) / 1000,
          );
          const consumed = timer.totalSeconds - timer.secondsRemaining;
          const drift = Math.max(0, elapsedSinceStart - consumed);
          const newRemaining = Math.max(0, timer.secondsRemaining - drift);
          corrected[taskId] = { ...timer, secondsRemaining: newRemaining };
        } else {
          corrected[taskId] = timer;
        }
      }
      return { ...state, timers: corrected };
    }

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
  const [state, dispatch] = useReducer(timerReducer, DEFAULT_STATE);
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

  // AppState listener: pause intervals on background, correct on foreground
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
      const sessionDuration = Math.floor((Date.now() - timer.startTime) / 1000);
      finalElapsedSeconds += sessionDuration;
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
