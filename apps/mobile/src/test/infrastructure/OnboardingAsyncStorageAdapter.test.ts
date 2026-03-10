import { beforeEach, describe, expect, it, vi } from "vitest";
import { ONBOARDING_STATE_STORAGE_KEY } from "@/domain/entities/OnboardingState";
import { OnboardingAsyncStorageAdapter } from "@/infrastructure/adapters/OnboardingAsyncStorageAdapter";

const store: Record<string, string> = {};

vi.mock("@react-native-async-storage/async-storage", () => ({
  default: {
    getItem: vi.fn(async (key: string) => store[key] ?? null),
    setItem: vi.fn(async (key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn(async (key: string) => {
      delete store[key];
    }),
  },
}));

describe("OnboardingAsyncStorageAdapter", () => {
  const adapter = new OnboardingAsyncStorageAdapter();

  beforeEach(() => {
    Object.keys(store).forEach((key) => delete store[key]);
  });

  it("saves and restores onboarding state for resume", async () => {
    await adapter.save({
      status: "pending",
      currentStep: 2,
      updatedAt: new Date().toISOString(),
    });

    await expect(adapter.load()).resolves.toMatchObject({
      status: "pending",
      currentStep: 2,
    });
  });

  it("falls back safely when state is corrupt", async () => {
    store[ONBOARDING_STATE_STORAGE_KEY] = "{invalid";
    const loaded = await adapter.load();

    expect(loaded.status).toBe("pending");
    expect(loaded.currentStep).toBe(1);
  });

  it("persists completion state", async () => {
    await adapter.save({
      status: "completed",
      currentStep: 3,
      updatedAt: new Date().toISOString(),
    });

    const loaded = await adapter.load();
    expect(loaded.status).toBe("completed");
    expect(loaded.currentStep).toBe(3);
  });
});
