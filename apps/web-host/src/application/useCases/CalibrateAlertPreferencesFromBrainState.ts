import {
  DEFAULT_ALERT_PREFERENCES,
  type AlertPreferences,
} from "@/domain/entities/AlertPreferences";
import type { BrainStateValue } from "@/domain/valueObjects/BrainState";

const CALIBRATION_BY_BRAIN_STATE: Record<BrainStateValue, AlertPreferences> = {
  focado: {
    ...DEFAULT_ALERT_PREFERENCES,
    tone: "direto",
    intensity: "discreto",
    sameTaskThresholdMin: 45,
    taskSwitchThreshold: 4,
    inactivityThresholdMin: 15,
  },
  cansado: {
    ...DEFAULT_ALERT_PREFERENCES,
    tone: "acolhedor",
    intensity: "moderado",
    sameTaskThresholdMin: 25,
    taskSwitchThreshold: 3,
    inactivityThresholdMin: 8,
  },
  sobrecarregado: {
    ...DEFAULT_ALERT_PREFERENCES,
    tone: "acolhedor",
    intensity: "ativo",
    sameTaskThresholdMin: 20,
    taskSwitchThreshold: 2,
    inactivityThresholdMin: 5,
  },
  ansioso: {
    ...DEFAULT_ALERT_PREFERENCES,
    tone: "acolhedor",
    intensity: "ativo",
    sameTaskThresholdMin: 20,
    taskSwitchThreshold: 2,
    inactivityThresholdMin: 5,
  },
  disperso: {
    ...DEFAULT_ALERT_PREFERENCES,
    tone: "sugestao",
    intensity: "moderado",
    sameTaskThresholdMin: 20,
    taskSwitchThreshold: 2,
    inactivityThresholdMin: 6,
  },
};

export const CalibrateAlertPreferencesFromBrainState = {
  execute(brainState: BrainStateValue): AlertPreferences {
    return { ...CALIBRATION_BY_BRAIN_STATE[brainState] };
  },
};
