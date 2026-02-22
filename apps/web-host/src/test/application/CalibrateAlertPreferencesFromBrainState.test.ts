import { describe, it, expect } from "vitest";
import { CalibrateAlertPreferencesFromBrainState } from "@/application/useCases/CalibrateAlertPreferencesFromBrainState";

describe("CalibrateAlertPreferencesFromBrainState", () => {
  it("returns a calmer profile for focado", () => {
    expect(
      CalibrateAlertPreferencesFromBrainState.execute("focado"),
    ).toMatchObject({
      tone: "direto",
      intensity: "discreto",
      sameTaskThresholdMin: 45,
      taskSwitchThreshold: 4,
      inactivityThresholdMin: 15,
    });
  });

  it("returns a stronger support profile for sobrecarregado", () => {
    expect(
      CalibrateAlertPreferencesFromBrainState.execute("sobrecarregado"),
    ).toMatchObject({
      tone: "acolhedor",
      intensity: "ativo",
      sameTaskThresholdMin: 20,
      taskSwitchThreshold: 2,
      inactivityThresholdMin: 5,
    });
  });
});
