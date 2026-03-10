import { vi } from "vitest";

export type AppStateStatus = "active" | "inactive" | "background";

export const mockIsReduceMotionEnabled = vi.fn<() => Promise<boolean>>(
  async () => false,
);

export const mockAccessibilityAddEventListener = vi.fn(
  (_event: string, _listener: (value: boolean) => void) => ({
    remove: vi.fn(),
  }),
);

export const AccessibilityInfo = {
  isReduceMotionEnabled: mockIsReduceMotionEnabled,
  addEventListener: mockAccessibilityAddEventListener,
};

export const AppState = {
  currentState: "active" as AppStateStatus,
  addEventListener: vi.fn(
    (_event: string, _listener: (state: AppStateStatus) => void) => ({
      remove: vi.fn(),
    }),
  ),
};
