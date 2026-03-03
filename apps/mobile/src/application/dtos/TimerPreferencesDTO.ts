export interface TimerPreferencesDTO {
  focusDuration: number;
  breakDuration: number;
  longBreakDuration: number;
  totalCycles: number;
}

export const DEFAULT_TIMER_PREFERENCES_DTO: TimerPreferencesDTO = {
  focusDuration: 25,
  breakDuration: 5,
  longBreakDuration: 15,
  totalCycles: 4,
};
