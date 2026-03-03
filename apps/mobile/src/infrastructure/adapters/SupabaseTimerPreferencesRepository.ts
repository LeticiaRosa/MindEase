import type { TimerPreferences } from "@/domain/entities/TimerPreferences";
import { DEFAULT_TIMER_PREFERENCES } from "@/domain/entities/TimerPreferences";
import type { ITimerPreferencesRepository } from "@/domain/interfaces/ITimerPreferencesRepository";
import supabaseClient from "@/infrastructure/api/clients/supabaseClient";

export class SupabaseTimerPreferencesRepository implements ITimerPreferencesRepository {
  async getPreferences(_userId: string): Promise<TimerPreferences | null> {
    const { data, error } = await supabaseClient
      .from("timer_preferences")
      .select("*")
      .single();

    if (error?.code === "PGRST116") return null;
    if (error) throw new Error(error.message);
    return this.mapTimerPreferences(data);
  }

  async savePreferences(
    userId: string,
    prefs: Partial<Omit<TimerPreferences, "userId">>,
  ): Promise<TimerPreferences> {
    const mapped = {
      user_id: userId,
      focus_duration: prefs.focusDuration,
      break_duration: prefs.breakDuration,
      long_break_duration: prefs.longBreakDuration,
      cycles_before_long_break: prefs.cyclesBeforeLongBreak,
      updated_at: new Date().toISOString(),
    };

    const cleaned = Object.fromEntries(
      Object.entries(mapped).filter(([, v]) => v !== undefined),
    );

    const { data, error } = await supabaseClient
      .from("timer_preferences")
      .upsert(cleaned)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return this.mapTimerPreferences(data);
  }

  private mapTimerPreferences(row: Record<string, unknown>): TimerPreferences {
    return {
      userId: row.user_id as string,
      focusDuration:
        (row.focus_duration as number) ??
        DEFAULT_TIMER_PREFERENCES.focusDuration,
      breakDuration:
        (row.break_duration as number) ??
        DEFAULT_TIMER_PREFERENCES.breakDuration,
      longBreakDuration:
        (row.long_break_duration as number) ??
        DEFAULT_TIMER_PREFERENCES.longBreakDuration,
      cyclesBeforeLongBreak:
        (row.cycles_before_long_break as number) ??
        DEFAULT_TIMER_PREFERENCES.cyclesBeforeLongBreak,
    };
  }
}
