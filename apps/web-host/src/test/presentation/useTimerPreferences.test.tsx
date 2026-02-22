import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import type { ReactNode } from "react";
import {
  TimerProvider,
  useTimerContext,
} from "@/presentation/contexts/TimerContext";
import { useTimerPreferences } from "@/presentation/hooks/useTimerPreferences";

const { getTimerPreferencesMock, authState } = vi.hoisted(() => ({
  getTimerPreferencesMock: vi.fn(),
  authState: {
    user: null as { id: string } | null,
    loading: true,
  },
}));

vi.mock("auth/auth", () => ({
  useAuth: () => ({
    user: authState.user,
    loading: authState.loading,
    error: null,
    signIn: vi.fn(),
    signUp: vi.fn(),
    signOut: vi.fn(),
  }),
}));

vi.mock("@/infrastructure/adapters/SupabaseTaskRepository", () => ({
  SupabaseTaskRepository: class SupabaseTaskRepository {
    getTimerPreferences = getTimerPreferencesMock;
    updateTimerPreferences = vi.fn();
  },
}));

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <TimerProvider>{children}</TimerProvider>
      </QueryClientProvider>
    );
  };
}

describe("useTimerPreferences", () => {
  beforeEach(() => {
    authState.user = null;
    authState.loading = true;
    getTimerPreferencesMock.mockReset();
  });

  it("loads and syncs preferences when auth finishes", async () => {
    getTimerPreferencesMock.mockResolvedValue({
      userId: "user-1",
      focusDuration: 10,
      breakDuration: 5,
      longBreakDuration: 20,
      cyclesBeforeLongBreak: 3,
    });

    const { result, rerender } = renderHook(
      () => {
        useTimerPreferences();
        return useTimerContext().state;
      },
      {
        wrapper: createWrapper(),
      },
    );

    expect(getTimerPreferencesMock).not.toHaveBeenCalled();
    expect(result.current.focusDuration).toBe(25);

    authState.user = { id: "user-1" };
    authState.loading = false;
    rerender();

    await waitFor(() => {
      expect(getTimerPreferencesMock).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
      expect(result.current.focusDuration).toBe(10);
      expect(result.current.secondsRemaining).toBe(10 * 60);
    });
  });
});
