import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { SupabaseTaskRepository } from "@/infrastructure/adapters/SupabaseTaskRepository";
import { UpdateTimerPreferences } from "@/application/useCases/UpdateTimerPreferences";
import { DEFAULT_TIMER_PREFERENCES } from "@/domain/entities/TimerPreferences";
import type { TimerPreferences } from "@/domain/entities/TimerPreferences";
import { useTimerContext } from "@/presentation/contexts/TimerContext";

const repository = new SupabaseTaskRepository();
const updatePreferences = new UpdateTimerPreferences(repository);

export function useTimerPreferences() {
  const queryClient = useQueryClient();
  const { syncPreferences } = useTimerContext();

  const { data: preferences } = useQuery<TimerPreferences | null>({
    queryKey: ["timer_preferences"],
    queryFn: () => repository.getTimerPreferences(),
  });

  // Sync loaded preferences into the timer context
  useEffect(() => {
    if (preferences) {
      syncPreferences({
        focusDuration: preferences.focusDuration,
        breakDuration: preferences.breakDuration,
        longBreakDuration: preferences.longBreakDuration,
        cyclesBeforeLongBreak: preferences.cyclesBeforeLongBreak,
      });
    }
  }, [preferences, syncPreferences]);

  const updateMutation = useMutation({
    mutationFn: (prefs: Partial<Omit<TimerPreferences, "userId">>) =>
      updatePreferences.execute(prefs),
    onSuccess: (data) => {
      queryClient.setQueryData(["timer_preferences"], data);
      syncPreferences({
        focusDuration: data.focusDuration,
        breakDuration: data.breakDuration,
        longBreakDuration: data.longBreakDuration,
        cyclesBeforeLongBreak: data.cyclesBeforeLongBreak,
      });
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ["timer_preferences"] }),
  });

  const effective = preferences ?? { userId: "", ...DEFAULT_TIMER_PREFERENCES };

  return {
    preferences: effective,
    updatePreferences: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
  };
}
