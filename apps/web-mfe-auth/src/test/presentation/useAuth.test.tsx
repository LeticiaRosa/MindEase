import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import type { User } from "@/domain/entities/User";

const mockRepository = vi.hoisted(() => ({
  signIn: vi.fn(),
  signUp: vi.fn(),
  signOut: vi.fn(),
  signInWithMagicLink: vi.fn(),
  getUser: vi.fn(),
  getSession: vi.fn(),
  trackMagicLinkRequest: vi.fn(),
  onAuthStateChange: vi.fn(),
}));

const mockSignInUseCase = vi.hoisted(() => vi.fn());
const mockSignUpUseCase = vi.hoisted(() => vi.fn());
const mockSignOutUseCase = vi.hoisted(() => vi.fn());
const mockSignInWithMagicLinkUseCase = vi.hoisted(() => vi.fn());

vi.mock("@/infrastructure/adapters/SupabaseAuthRepository", () => ({
  SupabaseAuthRepository: function MockSupabaseAuthRepository() {
    return mockRepository;
  },
}));

vi.mock("@/application/useCases/signIn", () => ({
  signIn: mockSignInUseCase,
}));

vi.mock("@/application/useCases/signUp", () => ({
  signUp: mockSignUpUseCase,
}));

vi.mock("@/application/useCases/signOut", () => ({
  signOut: mockSignOutUseCase,
}));

vi.mock("@/application/useCases/signInWithMagicLink", () => ({
  signInWithMagicLink: mockSignInWithMagicLinkUseCase,
}));

import { useAuth } from "@/presentation/hooks/useAuth";

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });

  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
}

describe("useAuth", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockRepository.getUser.mockResolvedValue(null);
    mockRepository.onAuthStateChange.mockReturnValue({ unsubscribe: vi.fn() });
    mockSignInUseCase.mockResolvedValue({ success: true, data: null });
    mockSignUpUseCase.mockResolvedValue({ success: true, data: null });
    mockSignOutUseCase.mockResolvedValue({ success: true });
    mockSignInWithMagicLinkUseCase.mockResolvedValue({ success: true });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("loads current user from query", async () => {
    const user: User = {
      id: "user-1",
      email: "ana@example.com",
    };

    mockRepository.getUser.mockResolvedValueOnce(user);

    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.user?.id).toBe("user-1");
    });

    expect(mockRepository.getUser).toHaveBeenCalledTimes(1);
    expect(result.current.loading).toBe(false);
  });

  it("returns success when signIn use case succeeds", async () => {
    const user: User = {
      id: "user-2",
      email: "bia@example.com",
    };

    mockSignInUseCase.mockResolvedValueOnce({ success: true, data: user });

    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    });

    const response = await act(async () => {
      return result.current.signIn("bia@example.com", "123456");
    });

    expect(mockSignInUseCase).toHaveBeenCalledWith(
      mockRepository,
      "bia@example.com",
      "123456",
    );
    expect(response).toEqual({ success: true, user });
  });

  it("returns failure when signIn use case fails", async () => {
    mockSignInUseCase.mockResolvedValueOnce({
      success: false,
      error: { message: "Credenciais inválidas", status: 401 },
    });

    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    });

    const response = await act(async () => {
      return result.current.signIn("bia@example.com", "wrong-password");
    });

    expect(response).toEqual({
      success: false,
      error: { message: "Credenciais inválidas", status: 401 },
    });
  });

  it("unsubscribes auth listener on unmount", () => {
    const unsubscribe = vi.fn();
    mockRepository.onAuthStateChange.mockReturnValueOnce({ unsubscribe });

    const { unmount } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    });

    unmount();

    expect(unsubscribe).toHaveBeenCalledTimes(1);
  });
});
