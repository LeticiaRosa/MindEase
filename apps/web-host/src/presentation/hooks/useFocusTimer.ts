import { useEffect } from "react";
import { useToast } from "@repo/ui";
import { useTimerContext } from "@/presentation/contexts/TimerContext";
import { SupabaseTaskRepository } from "@/infrastructure/adapters/SupabaseTaskRepository";
import { useQueryClient } from "@tanstack/react-query";

const repository = new SupabaseTaskRepository();

export function useFocusTimer(taskId: string) {
  const {
    state,
    start,
    pause,
    reset,
    stop: stopTimer,
    nextMode,
    getTimerState,
  } = useTimerContext();
  const toast = useToast();
  const queryClient = useQueryClient();

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

  const stop = async () => {
    const elapsedSeconds = stopTimer(taskId);

    if (elapsedSeconds > 0 && taskId !== "dashboard") {
      try {
        await repository.addTaskTimeSpent(taskId, elapsedSeconds);
        queryClient.invalidateQueries({ queryKey: ["tasks"] });
        toast.success(
          `Time tracked: ${Math.floor(elapsedSeconds / 60)}m ${elapsedSeconds % 60}s`,
          {
            duration: 3000,
          },
        );
      } catch (error) {
        toast.error("Failed to save time tracking");
        console.error("Error saving time:", error);
      }
    }
  };

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
    stop,
  };
}
