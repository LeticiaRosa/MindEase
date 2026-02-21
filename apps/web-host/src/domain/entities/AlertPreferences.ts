import type {
  AlertIntensity,
  AlertTone,
  AlertTrigger,
} from "@/domain/valueObjects/AlertTypes";

export interface AlertPreferences {
  triggers: AlertTrigger[];
  tone: AlertTone;
  intensity: AlertIntensity;
  /** Threshold in minutes before "same-task-too-long" fires. Default 30. */
  sameTaskThresholdMin: number;
  /** Number of task switches before "task-switching" fires. Default 3. */
  taskSwitchThreshold: number;
  /** Minutes of inactivity before "inactivity" fires. Default 10. */
  inactivityThresholdMin: number;
}

export const DEFAULT_ALERT_PREFERENCES: AlertPreferences = {
  triggers: ["same-task-too-long", "task-switching", "inactivity"],
  tone: "direto",
  intensity: "moderado",
  sameTaskThresholdMin: 30,
  taskSwitchThreshold: 3,
  inactivityThresholdMin: 10,
};

export const ALERT_PREFERENCES_STORAGE_KEY = (userId: string) =>
  `mindease:alert-prefs:${userId}`;
