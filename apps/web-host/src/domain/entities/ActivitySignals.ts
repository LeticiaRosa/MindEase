export interface ActivitySignals {
  /** How many times the user switched tasks in this session. */
  taskSwitchCount: number;
  /** Milliseconds spent on the current task (0 if none active). */
  timeOnCurrentTaskMs: number;
  /** Timestamp (ms) of the last recorded user interaction. */
  lastInteractionMs: number;
  /** Planned duration of the current task in ms (0 if not set). */
  plannedTaskDurationMs: number;
  /** Whether the current task is flagged as complex. */
  currentTaskIsComplex: boolean;
}

export const DEFAULT_ACTIVITY_SIGNALS: ActivitySignals = {
  taskSwitchCount: 0,
  timeOnCurrentTaskMs: 0,
  lastInteractionMs: Date.now(),
  plannedTaskDurationMs: 0,
  currentTaskIsComplex: false,
};
