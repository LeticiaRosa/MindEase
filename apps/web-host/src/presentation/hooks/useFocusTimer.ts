import { useEffect } from "react";
import { useToast } from "@repo/ui";
import { useTimerContext } from "@/presentation/contexts/TimerContext";

export function useFocusTimer(taskId: string) {
  const { state, start, pause, reset, nextMode, getTimerState } =
    useTimerContext();
  const toast = useToast();

  const timer = getTimerState(taskId);
  const isActive = !!state.timers[taskId];
  const isRunning = timer.status === "running";
  const isPaused = timer.status === "paused";

  const minutesRemaining = Math.floor(timer.secondsRemaining / 60);
  const secondsRemainder = timer.secondsRemaining % 60;
  const progress = 1 - timer.secondsRemaining / timer.totalSeconds;

  const formattedTime = `${String(minutesRemaining).padStart(2, "0")}:${String(secondsRemainder).padStart(2, "0")}`;

  // Auto-advance to next mode when timer reaches zero
  useEffect(() => {
    if (!isActive || !isRunning) return;
    if (timer.secondsRemaining === 0) {
      const modeLabel =
        timer.mode === "focus"
          ? "Focus session complete — time for a break"
          : "Break complete — ready to focus?";
      toast.info(modeLabel, { duration: 4000 });
      nextMode(taskId);
    }
  }, [
    isActive,
    isRunning,
    timer.secondsRemaining,
    timer.mode,
    nextMode,
    taskId,
    toast,
  ]);

  return {
    isActive,
    isRunning,
    isPaused,
    mode: timer.mode,
    formattedTime,
    progress,
    currentCycle: timer.currentCycle,
    cyclesBeforeLongBreak: state.globalPreferences.cyclesBeforeLongBreak,
    start: () => start(taskId),
    pause: () => pause(taskId),
    reset: () => reset(taskId),
  };
}
