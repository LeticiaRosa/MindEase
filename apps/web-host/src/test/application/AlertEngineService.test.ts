import { describe, it, expect } from "vitest";
import {
  evaluateAlert,
  isTriggerConditionMet,
  evaluateAlerts,
} from "@/application/services/AlertEngineService";
import { DEFAULT_ALERT_PREFERENCES } from "@/domain/entities/AlertPreferences";
import type { ActivitySignals } from "@/domain/entities/ActivitySignals";
import { DEFAULT_ACTIVITY_SIGNALS } from "@/domain/entities/ActivitySignals";

const baseSignals: ActivitySignals = {
  ...DEFAULT_ACTIVITY_SIGNALS,
  lastInteractionMs: Date.now(),
};

describe("AlertEngineService", () => {
  describe("evaluateAlert — channel mapping", () => {
    it("discreto intensity maps to icon channel", () => {
      const payload = evaluateAlert("inactivity", "focado", {
        ...DEFAULT_ALERT_PREFERENCES,
        intensity: "discreto",
      });
      expect(payload.channel).toBe("icon");
    });

    it("moderado intensity maps to toast channel", () => {
      const payload = evaluateAlert("inactivity", "focado", {
        ...DEFAULT_ALERT_PREFERENCES,
        intensity: "moderado",
      });
      expect(payload.channel).toBe("toast");
    });

    it("ativo intensity maps to modal channel", () => {
      const payload = evaluateAlert("inactivity", "focado", {
        ...DEFAULT_ALERT_PREFERENCES,
        intensity: "ativo",
      });
      expect(payload.channel).toBe("modal");
    });
  });

  describe("evaluateAlert — message content", () => {
    it("returns a non-empty message for ansioso + acolhedor + same-task-too-long", () => {
      const payload = evaluateAlert("same-task-too-long", "ansioso", {
        ...DEFAULT_ALERT_PREFERENCES,
        tone: "acolhedor",
      });
      expect(payload.message.length).toBeGreaterThan(0);
      // Should contain a calming hint (pausa/respir)
      expect(
        payload.message.toLowerCase().includes("pausa") ||
          payload.message.toLowerCase().includes("respir"),
      ).toBe(true);
    });

    it("falls back gracefully when brain state is null", () => {
      const payload = evaluateAlert(
        "task-switching",
        null,
        DEFAULT_ALERT_PREFERENCES,
      );
      expect(payload.message.length).toBeGreaterThan(0);
    });

    it("returns the trigger in the payload", () => {
      const payload = evaluateAlert(
        "task-switching",
        "focado",
        DEFAULT_ALERT_PREFERENCES,
      );
      expect(payload.trigger).toBe("task-switching");
    });
  });

  describe("isTriggerConditionMet", () => {
    it("same-task-too-long fires when threshold is exceeded", () => {
      const signals: ActivitySignals = {
        ...baseSignals,
        timeOnCurrentTaskMs: 31 * 60 * 1000, // 31 min
      };
      expect(
        isTriggerConditionMet(
          "same-task-too-long",
          signals,
          DEFAULT_ALERT_PREFERENCES,
        ),
      ).toBe(true);
    });

    it("same-task-too-long does NOT fire below threshold", () => {
      const signals: ActivitySignals = {
        ...baseSignals,
        timeOnCurrentTaskMs: 10 * 60 * 1000, // 10 min
      };
      expect(
        isTriggerConditionMet(
          "same-task-too-long",
          signals,
          DEFAULT_ALERT_PREFERENCES,
        ),
      ).toBe(false);
    });

    it("task-switching fires at threshold", () => {
      const signals: ActivitySignals = { ...baseSignals, taskSwitchCount: 3 };
      expect(
        isTriggerConditionMet(
          "task-switching",
          signals,
          DEFAULT_ALERT_PREFERENCES,
        ),
      ).toBe(true);
    });

    it("returns false for disabled trigger", () => {
      const signals: ActivitySignals = { ...baseSignals, taskSwitchCount: 10 };
      expect(
        isTriggerConditionMet("task-switching", signals, {
          ...DEFAULT_ALERT_PREFERENCES,
          triggers: ["inactivity"],
        }),
      ).toBe(false);
    });
  });

  describe("evaluateAlerts — cool-down logic", () => {
    it("suppresses a trigger within cool-down period", () => {
      const now = Date.now();
      const signals: ActivitySignals = {
        ...baseSignals,
        taskSwitchCount: 5,
      };
      const lastFiredAt = { "task-switching": now - 5 * 60 * 1000 }; // 5 min ago
      const result = evaluateAlerts(
        signals,
        DEFAULT_ALERT_PREFERENCES,
        "focado",
        lastFiredAt,
        15 * 60 * 1000,
        () => now,
      );
      expect(result).toBeNull();
    });

    it("fires a different trigger even when one is in cool-down", () => {
      const now = Date.now();
      const signals: ActivitySignals = {
        ...baseSignals,
        taskSwitchCount: 5,
        timeOnCurrentTaskMs: 31 * 60 * 1000,
      };
      // task-switching in cool-down, same-task-too-long is not
      const lastFiredAt = { "task-switching": now - 5 * 60 * 1000 };
      const result = evaluateAlerts(
        signals,
        {
          ...DEFAULT_ALERT_PREFERENCES,
          triggers: ["task-switching", "same-task-too-long"],
        },
        "focado",
        lastFiredAt,
        15 * 60 * 1000,
        () => now,
      );
      expect(result?.trigger).toBe("same-task-too-long");
    });
  });
});
