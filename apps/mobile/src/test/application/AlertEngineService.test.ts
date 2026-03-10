import { describe, expect, it } from "vitest";
import {
  evaluateAlert,
  evaluateAlerts,
  isTriggerConditionMet,
} from "@/application/services/AlertEngineService";
import { DEFAULT_ALERT_PREFERENCES } from "@/domain/entities/AlertPreferences";
import {
  DEFAULT_ACTIVITY_SIGNALS,
  type ActivitySignals,
} from "@/domain/entities/ActivitySignals";

const baseSignals: ActivitySignals = {
  ...DEFAULT_ACTIVITY_SIGNALS,
  lastInteractionMs: Date.now(),
};

describe("AlertEngineService", () => {
  describe("evaluateAlert", () => {
    it("maps discreto intensity to icon channel", () => {
      const payload = evaluateAlert("inactivity", "focado", {
        ...DEFAULT_ALERT_PREFERENCES,
        intensity: "discreto",
      });

      expect(payload.channel).toBe("icon");
    });

    it("maps ativo intensity to modal channel", () => {
      const payload = evaluateAlert("inactivity", "focado", {
        ...DEFAULT_ALERT_PREFERENCES,
        intensity: "ativo",
      });

      expect(payload.channel).toBe("modal");
    });

    it("returns fallback message when brain state is null", () => {
      const payload = evaluateAlert(
        "task-switching",
        null,
        DEFAULT_ALERT_PREFERENCES,
      );

      expect(payload.message.length).toBeGreaterThan(0);
      expect(payload.trigger).toBe("task-switching");
    });
  });

  describe("isTriggerConditionMet", () => {
    it("fires same-task-too-long above threshold", () => {
      const signals: ActivitySignals = {
        ...baseSignals,
        timeOnCurrentTaskMs: 31 * 60 * 1000,
      };

      expect(
        isTriggerConditionMet(
          "same-task-too-long",
          signals,
          DEFAULT_ALERT_PREFERENCES,
        ),
      ).toBe(true);
    });

    it("does not fire disabled trigger", () => {
      const signals: ActivitySignals = {
        ...baseSignals,
        taskSwitchCount: 5,
      };

      expect(
        isTriggerConditionMet("task-switching", signals, {
          ...DEFAULT_ALERT_PREFERENCES,
          triggers: ["inactivity"],
        }),
      ).toBe(false);
    });
  });

  describe("evaluateAlerts", () => {
    it("suppresses trigger during cooldown", () => {
      const now = Date.now();
      const signals: ActivitySignals = {
        ...baseSignals,
        taskSwitchCount: 6,
      };

      const result = evaluateAlerts(
        signals,
        DEFAULT_ALERT_PREFERENCES,
        "focado",
        { "task-switching": now - 5 * 60 * 1000 },
        15 * 60 * 1000,
        () => now,
      );

      expect(result).toBeNull();
    });

    it("fires another trigger when one is cooling down", () => {
      const now = Date.now();
      const signals: ActivitySignals = {
        ...baseSignals,
        taskSwitchCount: 6,
        timeOnCurrentTaskMs: 31 * 60 * 1000,
      };

      const result = evaluateAlerts(
        signals,
        {
          ...DEFAULT_ALERT_PREFERENCES,
          triggers: ["task-switching", "same-task-too-long"],
        },
        "focado",
        { "task-switching": now - 5 * 60 * 1000 },
        15 * 60 * 1000,
        () => now,
      );

      expect(result?.trigger).toBe("same-task-too-long");
    });
  });
});
