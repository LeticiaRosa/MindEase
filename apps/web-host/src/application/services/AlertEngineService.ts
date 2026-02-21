import type { AlertPreferences } from "@/domain/entities/AlertPreferences";
import type { AlertPayload } from "@/domain/entities/AlertPayload";
import type { ActivitySignals } from "@/domain/entities/ActivitySignals";
import type { BrainStateValue } from "@/domain/valueObjects/BrainState";
import type { AlertTrigger } from "@/domain/valueObjects/AlertTypes";
import { getAlertMessage } from "@/lib/alertMessages";

/** Maps intensity level to the UI channel used for delivery. */
function resolveChannel(
  preferences: AlertPreferences,
): AlertPayload["channel"] {
  switch (preferences.intensity) {
    case "discreto":
      return "icon";
    case "ativo":
      return "modal";
    default:
      return "toast";
  }
}

/**
 * Pure function: evaluates whether the given trigger condition is met given
 * the current activity signals and preferences.
 */
export function isTriggerConditionMet(
  trigger: AlertTrigger,
  signals: ActivitySignals,
  preferences: AlertPreferences,
  clockFn: () => number = Date.now,
): boolean {
  if (!preferences.triggers.includes(trigger)) return false;

  switch (trigger) {
    case "same-task-too-long": {
      const thresholdMs = preferences.sameTaskThresholdMin * 60 * 1000;
      return signals.timeOnCurrentTaskMs >= thresholdMs;
    }
    case "task-switching":
      return signals.taskSwitchCount >= preferences.taskSwitchThreshold;
    case "inactivity": {
      const idleMs = clockFn() - signals.lastInteractionMs;
      return idleMs >= preferences.inactivityThresholdMin * 60 * 1000;
    }
    case "time-overrun":
      return (
        signals.plannedTaskDurationMs > 0 &&
        signals.timeOnCurrentTaskMs > signals.plannedTaskDurationMs
      );
    case "complex-task":
      return signals.currentTaskIsComplex;
    default:
      return false;
  }
}

/**
 * Pure function: given a trigger, brain state, and preferences, returns the
 * AlertPayload to dispatch. Does NOT produce any side effects.
 */
export function evaluateAlert(
  trigger: AlertTrigger,
  brainState: BrainStateValue | null,
  preferences: AlertPreferences,
): AlertPayload {
  const effectiveBrainState: BrainStateValue = brainState ?? "focado";
  const message = getAlertMessage(
    trigger,
    effectiveBrainState,
    preferences.tone,
  );
  const channel = resolveChannel(preferences);
  return { channel, message, trigger };
}

/**
 * Evaluates all enabled triggers against current signals and returns the first
 * matching AlertPayload, or null if no trigger fires.
 */
export function evaluateAlerts(
  signals: ActivitySignals,
  preferences: AlertPreferences,
  brainState: BrainStateValue | null,
  lastFiredAt: Partial<Record<AlertTrigger, number>>,
  coolDownMs = 15 * 60 * 1000,
  clockFn: () => number = Date.now,
): AlertPayload | null {
  const now = clockFn();

  for (const trigger of preferences.triggers) {
    const lastFired = lastFiredAt[trigger] ?? 0;
    if (now - lastFired < coolDownMs) continue; // still in cool-down
    if (isTriggerConditionMet(trigger, signals, preferences, clockFn)) {
      return evaluateAlert(trigger, brainState, preferences);
    }
  }

  return null;
}
