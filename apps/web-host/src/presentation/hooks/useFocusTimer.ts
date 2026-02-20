import { useEffect } from "react";
import { useToast } from "@repo/ui";
import { useTimerContext } from "@/presentation/contexts/TimerContext";

export function useFocusTimer(taskId: string) {
  const { state, start, pause, reset, nextMode } = useTimerContext();
  const toast = useToast();

  const isActive = state.activeTaskId === taskId;
  const isRunning = isActive && state.status === "running";
  const isPaused = isActive && state.status === "paused";

  const minutesRemaining = isActive
    ? Math.floor(state.secondsRemaining / 60)
    : state.focusDuration;
  const secondsRemainder = isActive ? state.secondsRemaining % 60 : 0;
  const progress = isActive
    ? 1 - state.secondsRemaining / state.totalSeconds
    : 0;

  const formattedTime = `${String(minutesRemaining).padStart(2, "0")}:${String(secondsRemainder).padStart(2, "0")}`;

  // Auto-advance to next mode when timer reaches zero
  useEffect(() => {
    if (!isActive || !isRunning) return;
    if (state.secondsRemaining === 0) {
      const modeLabel =
        state.mode === "focus"
          ? "Focus session complete — time for a break"
          : "Break complete — ready to focus?";
      toast.info(modeLabel, { duration: 4000 });
      nextMode();
    }
  }, [
    isActive,
    isRunning,
    state.secondsRemaining,
    state.mode,
    nextMode,
    toast,
  ]);

  return {
    isActive,
    isRunning,
    isPaused,
    mode: state.mode,
    formattedTime,
    progress,
    currentCycle: state.currentCycle,
    cyclesBeforeLongBreak: state.cyclesBeforeLongBreak,
    start: () => start(taskId),
    pause,
    reset,
  };
}
