import React, { useEffect } from "react";
import { act, create } from "react-test-renderer";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ReactNode } from "react";
import {
  ThemePreferencesProvider,
  useTheme,
} from "@/presentation/contexts/ThemePreferencesContext";
import {
  mockAccessibilityAddEventListener,
  mockIsReduceMotionEnabled,
} from "@/test/mocks/react-native";

const mockGetItem = vi.hoisted(() => vi.fn());
const mockSetItem = vi.hoisted(() => vi.fn());

const mockLoad = vi.hoisted(() => vi.fn());
const mockUpsert = vi.hoisted(() => vi.fn());

vi.mock("@react-native-async-storage/async-storage", () => ({
  default: {
    getItem: mockGetItem,
    setItem: mockSetItem,
  },
}));

vi.mock("@/presentation/hooks/useAuth", () => ({
  useAuth: () => ({ user: null }),
}));

vi.mock(
  "@/infrastructure/adapters/SupabaseUserCognitivePreferencesRepository",
  () => ({
    SupabaseUserCognitivePreferencesRepository:
      function MockSupabaseUserCognitivePreferencesRepository() {
        return {
          load: mockLoad,
          upsert: mockUpsert,
        };
      },
  }),
);

vi.mock("@/infrastructure/errors/mapSupabaseError", () => ({
  mapSupabaseError: () => "mapped-error",
}));

interface ThemeSnapshot {
  theme: string;
  fontSize: string;
  spacing: string;
  mode: string;
  complexity: string;
  reduceMotion: boolean;
  isReducedMotion: boolean;
  isHydrated: boolean;
  updatePreferences: (patch: Record<string, unknown>) => void;
}

const onThemeSnapshot = vi.fn<(snapshot: ThemeSnapshot) => void>();

function ThemeConsumer() {
  const theme = useTheme();

  useEffect(() => {
    onThemeSnapshot({
      theme: theme.theme,
      fontSize: theme.fontSize,
      spacing: theme.spacing,
      mode: theme.mode,
      complexity: theme.complexity,
      reduceMotion: theme.reduceMotion,
      isReducedMotion: theme.isReducedMotion,
      isHydrated: theme.isHydrated,
      updatePreferences: theme.updatePreferences as (
        patch: Record<string, unknown>,
      ) => void,
    });
  }, [theme]);

  return null;
}

function getLatestSnapshot(): ThemeSnapshot | null {
  const latest = onThemeSnapshot.mock.calls.at(-1)?.[0] ?? null;
  return latest;
}

function Wrapper({ children }: { children: ReactNode }) {
  return <ThemePreferencesProvider>{children}</ThemePreferencesProvider>;
}

describe("ThemePreferencesContext", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    onThemeSnapshot.mockReset();

    mockGetItem.mockResolvedValue(null);
    mockSetItem.mockResolvedValue(undefined);
    mockIsReduceMotionEnabled.mockResolvedValue(false);
    mockLoad.mockResolvedValue(null);
    mockUpsert.mockResolvedValue(undefined);
    mockAccessibilityAddEventListener.mockReturnValue({ remove: vi.fn() });
  });

  it("hydrates local preferences and combines with system reduce-motion", async () => {
    mockGetItem.mockResolvedValueOnce(
      JSON.stringify({
        theme: "soft",
        fontSize: "lg",
        spacing: "relaxed",
        mode: "detail",
        complexity: "complex",
        reduceMotion: false,
      }),
    );
    mockIsReduceMotionEnabled.mockResolvedValueOnce(true);

    await act(async () => {
      create(
        <Wrapper>
          <ThemeConsumer />
        </Wrapper>,
      );
      await Promise.resolve();
      await Promise.resolve();
    });

    const snapshot = getLatestSnapshot();

    expect(snapshot).not.toBeNull();
    expect(snapshot?.theme).toBe("soft");
    expect(snapshot?.fontSize).toBe("lg");
    expect(snapshot?.isHydrated).toBe(true);
    expect(snapshot?.isReducedMotion).toBe(true);
  });

  it("persists updates in AsyncStorage", async () => {
    await act(async () => {
      create(
        <Wrapper>
          <ThemeConsumer />
        </Wrapper>,
      );
      await Promise.resolve();
      await Promise.resolve();
    });

    const initialSnapshot = getLatestSnapshot();
    expect(initialSnapshot).not.toBeNull();

    await act(async () => {
      initialSnapshot?.updatePreferences({
        theme: "dark",
        reduceMotion: true,
      });
      await Promise.resolve();
    });

    expect(mockSetItem).toHaveBeenCalled();
    const payload = String(mockSetItem.mock.calls.at(-1)?.[1] ?? "");
    expect(payload).toContain('"theme":"dark"');
    expect(payload).toContain('"reduceMotion":true');
  });

  it("unsubscribes reduce-motion listener on unmount", async () => {
    const remove = vi.fn();
    mockAccessibilityAddEventListener.mockReturnValueOnce({ remove });

    let root: ReturnType<typeof create> | null = null;

    await act(async () => {
      root = create(
        <Wrapper>
          <ThemeConsumer />
        </Wrapper>,
      );
      await Promise.resolve();
    });

    await act(async () => {
      root?.unmount();
    });

    expect(remove).toHaveBeenCalledTimes(1);
  });
});
