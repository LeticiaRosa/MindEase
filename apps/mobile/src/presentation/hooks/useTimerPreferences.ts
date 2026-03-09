import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useAuth } from "@/presentation/hooks/useAuth";
import { useAlert } from "@/presentation/contexts/AlertContext";
import { SupabaseTimerPreferencesRepository } from "@/infrastructure/adapters/SupabaseTimerPreferencesRepository";
import { useTimerContext } from "@/presentation/contexts/TimerContext";
import {
  DEFAULT_TIMER_PREFERENCES,
  type TimerPreferences,
} from "@/domain/entities/TimerPreferences";

const repository = new SupabaseTimerPreferencesRepository();

export function useTimerPreferences() {
  const queryClient = useQueryClient();
  const { syncPreferences } = useTimerContext();
  const { showAlert } = useAlert();
  const { user, loading } = useAuth();
  const userId = user?.id ?? null;

  const { data: preferences } = useQuery<TimerPreferences | null>({
    queryKey: ["timer_preferences", userId],
    queryFn: () =>
      userId ? repository.getPreferences(userId) : Promise.resolve(null),
    enabled: !loading && Boolean(userId),
  });

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
    mutationFn: (prefs: Partial<Omit<TimerPreferences, "userId">>) => {
      if (!userId) return Promise.reject(new Error("No user"));
      return repository.savePreferences(userId, prefs);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["timer_preferences", userId], data);
      syncPreferences({
        focusDuration: data.focusDuration,
        breakDuration: data.breakDuration,
        longBreakDuration: data.longBreakDuration,
        cyclesBeforeLongBreak: data.cyclesBeforeLongBreak,
      });
    },
    onError: () => {
      showAlert("Erro", "Falha ao salvar preferências", "error");
    },
    onSettled: () =>
      queryClient.invalidateQueries({
        queryKey: ["timer_preferences", userId],
      }),
  });

  const effective = preferences ?? {
    userId: "",
    ...DEFAULT_TIMER_PREFERENCES,
  };

  return {
    preferences: effective,
    updatePreferences: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
  };
}
