import { beforeEach, describe, expect, it, vi } from "vitest";
import { OnboardingLocalStorageAdapter } from "@/infrastructure/adapters/OnboardingLocalStorageAdapter";
import { ONBOARDING_STATE_STORAGE_KEY } from "@/domain/entities/OnboardingState";

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

describe("OnboardingLocalStorageAdapter", () => {
  const adapter = new OnboardingLocalStorageAdapter();

  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  it("saves and loads onboarding state", async () => {
    const state = {
      status: "pending" as const,
      currentStep: 2 as const,
      updatedAt: new Date().toISOString(),
    };

    await adapter.save(state);
    await expect(adapter.load()).resolves.toEqual(state);
  });

  it("falls back to defaults on invalid status", async () => {
    localStorageStore[ONBOARDING_STATE_STORAGE_KEY] = JSON.stringify({
      status: "unknown",
      currentStep: 2,
      updatedAt: new Date().toISOString(),
    });

    const loaded = await adapter.load();
    expect(loaded.status).toBe("pending");
    expect(loaded.currentStep).toBe(1);
  });

  it("falls back to defaults on corrupt json", async () => {
    localStorageStore[ONBOARDING_STATE_STORAGE_KEY] = "{bad-json";
    const loaded = await adapter.load();

    expect(loaded.status).toBe("pending");
    expect(loaded.currentStep).toBe(1);
  });

  it("clears onboarding state", async () => {
    await adapter.save({
      status: "completed",
      currentStep: 5,
      updatedAt: new Date().toISOString(),
    });
    await adapter.clear();

    await expect(adapter.load()).resolves.toMatchObject({
      status: "pending",
      currentStep: 1,
    });
  });
});
