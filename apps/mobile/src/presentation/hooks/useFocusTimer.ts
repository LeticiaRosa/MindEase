import { useEffect } from "react";
import { Alert } from "react-native";
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
  const queryClient = useQueryClient();

  const timer = getTimerState(taskId);
  const isActive = !!state.timers[taskId];
  const isRunning = timer.status === "running";
  const isPaused = timer.status === "paused";

  const minutesRemaining = Math.floor(timer.secondsRemaining / 60);
  const secondsRemainder = timer.secondsRemaining % 60;
  const progress = 1 - timer.secondsRemaining / timer.totalSeconds;

  const formattedTime = `${String(minutesRemaining).padStart(2, "0")}:${String(secondsRemainder).padStart(2, "0")}`;

  useEffect(() => {
    if (!isActive || !isRunning) return;
    if (timer.secondsRemaining === 0) {
      const modeLabel =
        timer.mode === "focus"
          ? "Sessão de foco concluída — hora de uma pausa"
          : "Pausa concluída — pronto para focar?";
      Alert.alert("Timer", modeLabel);
      nextMode(taskId);
    }
  }, [
    isActive,
    isRunning,
    timer.secondsRemaining,
    timer.mode,
    nextMode,
    taskId,
  ]);

  const stop = async () => {
    const elapsedSeconds = stopTimer(taskId);
    if (elapsedSeconds > 0 && taskId !== "dashboard") {
      try {
        await repository.addTaskTimeSpent(taskId, elapsedSeconds);
        queryClient.invalidateQueries({ queryKey: ["tasks"] });
      } catch (error) {
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
