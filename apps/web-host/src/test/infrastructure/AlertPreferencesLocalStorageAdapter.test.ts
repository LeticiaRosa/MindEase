import { beforeEach, describe, it, expect, vi } from "vitest";
import { AlertPreferencesLocalStorageAdapter } from "@/infrastructure/adapters/AlertPreferencesLocalStorageAdapter";
import { DEFAULT_ALERT_PREFERENCES } from "@/domain/entities/AlertPreferences";

// Lightweight localStorage mock
const localStorageStore: Record<string, string> = {};
const localStorageMock = {
  getItem: vi.fn((key: string) => localStorageStore[key] ?? null),
  setItem: vi.fn((key: string, value: string) => {
    localStorageStore[key] = value;
  }),
  removeItem: vi.fn((key: string) => {
    delete localStorageStore[key];
  }),
  clear: vi.fn(() => {
    Object.keys(localStorageStore).forEach((k) => delete localStorageStore[k]);
  }),
};
vi.stubGlobal("localStorage", localStorageMock);

describe("AlertPreferencesLocalStorageAdapter", () => {
  const adapter = new AlertPreferencesLocalStorageAdapter();
  const userId = "user-123";

  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  it("save and load round-trip returns same preferences", () => {
    const prefs = { ...DEFAULT_ALERT_PREFERENCES, intensity: "ativo" as const };
    adapter.save(userId, prefs);
    const loaded = adapter.load(userId);
    expect(loaded).toEqual(prefs);
  });

  it("returns DEFAULT_ALERT_PREFERENCES when key is missing", () => {
    const loaded = adapter.load("unknown-user");
    expect(loaded).toEqual(DEFAULT_ALERT_PREFERENCES);
  });

  it("returns DEFAULT_ALERT_PREFERENCES on corrupt JSON without throwing", () => {
    localStorageStore[`mindease:alert-prefs:${userId}`] = "{ bad json :::";
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    expect(() => adapter.load(userId)).not.toThrow();
    const loaded = adapter.load(userId);
    expect(loaded).toEqual(DEFAULT_ALERT_PREFERENCES);
    warnSpy.mockRestore();
  });
});
