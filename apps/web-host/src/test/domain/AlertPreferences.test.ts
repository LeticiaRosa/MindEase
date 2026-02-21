import { describe, it, expect } from "vitest";
import {
  DEFAULT_ALERT_PREFERENCES,
  type AlertPreferences,
} from "@/domain/entities/AlertPreferences";
import { alertPreferencesSchema } from "@/application/dtos/AlertPreferencesDTO";

describe("AlertPreferences", () => {
  it("DEFAULT_ALERT_PREFERENCES has correct shape", () => {
    expect(DEFAULT_ALERT_PREFERENCES).toMatchObject({
      triggers: expect.arrayContaining([
        "same-task-too-long",
        "task-switching",
        "inactivity",
      ]),
      tone: "direto",
      intensity: "moderado",
      sameTaskThresholdMin: 30,
      taskSwitchThreshold: 3,
      inactivityThresholdMin: 10,
    });
  });

  it("DEFAULT_ALERT_PREFERENCES is JSON round-trippable", () => {
    const parsed = JSON.parse(
      JSON.stringify(DEFAULT_ALERT_PREFERENCES),
    ) as AlertPreferences;
    expect(parsed).toEqual(DEFAULT_ALERT_PREFERENCES);
  });

  describe("alertPreferencesSchema", () => {
    it("validates a valid preferences object", () => {
      expect(() =>
        alertPreferencesSchema.parse(DEFAULT_ALERT_PREFERENCES),
      ).not.toThrow();
    });

    it("rejects an empty triggers array", () => {
      const result = alertPreferencesSchema.safeParse({
        ...DEFAULT_ALERT_PREFERENCES,
        triggers: [],
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "Selecione pelo menos um gatilho",
        );
      }
    });

    it("rejects an invalid tone value", () => {
      const result = alertPreferencesSchema.safeParse({
        ...DEFAULT_ALERT_PREFERENCES,
        tone: "unknown",
      });
      expect(result.success).toBe(false);
    });

    it("rejects an invalid intensity value", () => {
      const result = alertPreferencesSchema.safeParse({
        ...DEFAULT_ALERT_PREFERENCES,
        intensity: "max",
      });
      expect(result.success).toBe(false);
    });
  });
});
