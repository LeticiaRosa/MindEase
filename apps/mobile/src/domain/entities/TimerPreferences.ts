export interface TimerPreferences {
  userId: string;
  focusDuration: number;
  breakDuration: number;
  longBreakDuration: number;
  cyclesBeforeLongBreak: number;
}

export const DEFAULT_TIMER_PREFERENCES: Omit<TimerPreferences, "userId"> = {
  focusDuration: 25,
  breakDuration: 5,
  longBreakDuration: 15,
  cyclesBeforeLongBreak: 4,
};
