import { describe, it, expect } from "vitest";
import { DEFAULT_TIMER_PREFERENCES } from "@/domain/entities/TimerPreferences";

describe("TimerPreferences defaults", () => {
  it("has sensible default values", () => {
    expect(DEFAULT_TIMER_PREFERENCES.focusDuration).toBe(25);
    expect(DEFAULT_TIMER_PREFERENCES.breakDuration).toBe(5);
    expect(DEFAULT_TIMER_PREFERENCES.longBreakDuration).toBe(15);
    expect(DEFAULT_TIMER_PREFERENCES.cyclesBeforeLongBreak).toBe(4);
  });

  it("all defaults are positive integers", () => {
    Object.values(DEFAULT_TIMER_PREFERENCES).forEach((v) => {
      expect(v).toBeGreaterThan(0);
      expect(Number.isInteger(v)).toBe(true);
    });
  });
});
