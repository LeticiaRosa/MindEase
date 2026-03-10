import { useEffect, useRef } from "react";
import { AppState, type AppStateStatus } from "react-native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { User } from "@/domain/entities/User";
import type { AuthResult } from "@/domain/entities/AuthResult";
import { authRepository as repository } from "@/infrastructure/factories/repositories";
import { signIn as signInUseCase } from "@/application/useCases/signIn";
import { signUp as signUpUseCase } from "@/application/useCases/signUp";
import { signOut as signOutUseCase } from "@/application/useCases/signOut";
import { signInWithMagicLink as signInWithMagicLinkUseCase } from "@/application/useCases/signInWithMagicLink";
import { handleMagicLinkCallback as handleMagicLinkCallbackUseCase } from "@/application/useCases/handleMagicLinkCallback";
import { exchangeAuthCodeForSession as exchangeAuthCodeForSessionUseCase } from "@/application/useCases/exchangeAuthCodeForSession";
import supabaseClient from "@/infrastructure/api/clients/supabaseClient";

const AUTH_KEYS = {
  user: ["auth", "user"] as const,
  session: ["auth", "session"] as const,
} as const;

export function useAuth() {
  const queryClient = useQueryClient();
  const appStateRef = useRef(AppState.currentState);

  const {
    data: user,
    isLoading: userLoading,
    error: userError,
  } = useQuery({
    queryKey: AUTH_KEYS.user,
    queryFn: () => repository.getUser(),
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  const signInMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      signInUseCase(repository, email, password),
    onSuccess: (result: AuthResult<User>) => {
      if (result.success && result.data) {
        queryClient.setQueryData(AUTH_KEYS.user, result.data);
        queryClient.invalidateQueries({ queryKey: AUTH_KEYS.session });
      }
    },
  });

  const signUpMutation = useMutation({
    mutationFn: ({
      email,
      password,
      fullName,
      redirectTo,
    }: {
      email: string;
      password: string;
      fullName?: string;
      redirectTo?: string;
    }) => signUpUseCase(repository, email, password, fullName, redirectTo),
    onSuccess: (result: AuthResult<User>) => {
      if (result.success && result.data) {
        queryClient.setQueryData(AUTH_KEYS.user, result.data);
        queryClient.invalidateQueries({ queryKey: AUTH_KEYS.session });
      }
    },
  });

  const signOutMutation = useMutation({
    mutationFn: () => signOutUseCase(repository),
    onSuccess: (result: AuthResult<void>) => {
      if (result.success) {
        queryClient.setQueryData(AUTH_KEYS.user, null);
        queryClient.removeQueries({ queryKey: AUTH_KEYS.session });
      }
    },
  });

  const signInWithMagicLinkMutation = useMutation({
    mutationFn: ({
      email,
      redirectTo,
    }: {
      email: string;
      redirectTo?: string;
    }) => signInWithMagicLinkUseCase(repository, email, redirectTo),
  });

  const handleMagicLinkCallbackMutation = useMutation({
    mutationFn: ({
      accessToken,
      refreshToken,
    }: {
      accessToken: string;
      refreshToken: string;
    }) => handleMagicLinkCallbackUseCase(repository, accessToken, refreshToken),
    onSuccess: (result: AuthResult<User>) => {
      if (result.success && result.data) {
        queryClient.setQueryData(AUTH_KEYS.user, result.data);
        queryClient.invalidateQueries({ queryKey: AUTH_KEYS.session });
      }
    },
  });

  const exchangeAuthCodeForSessionMutation = useMutation({
    mutationFn: ({ authCode }: { authCode: string }) =>
      exchangeAuthCodeForSessionUseCase(repository, authCode),
    onSuccess: (result: AuthResult<User>) => {
      if (result.success && result.data) {
        queryClient.setQueryData(AUTH_KEYS.user, result.data);
        queryClient.invalidateQueries({ queryKey: AUTH_KEYS.session });
      }
    },
  });

  // Auth state change listener — keeps query cache in sync
  useEffect(() => {
    const { unsubscribe } = repository.onAuthStateChange((event, user) => {
      if (event === "SIGNED_IN" && user) {
        queryClient.setQueryData(AUTH_KEYS.user, user);
      } else if (event === "SIGNED_OUT") {
        queryClient.setQueryData(AUTH_KEYS.user, null);
      }
    });

    return () => unsubscribe();
  }, [queryClient]);

  // AppState foreground/background listener — auto-refresh tokens
  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      (nextState: AppStateStatus) => {
        if (
          appStateRef.current.match(/inactive|background/) &&
          nextState === "active"
        ) {
          supabaseClient.auth.startAutoRefresh();
        } else if (
          appStateRef.current === "active" &&
          nextState.match(/inactive|background/)
        ) {
          supabaseClient.auth.stopAutoRefresh();
        }
        appStateRef.current = nextState;
      },
    );

    return () => subscription.remove();
  }, []);

  // Convenience wrappers — match web-mfe-auth pattern
  const signIn = async (email: string, password: string) => {
    const result = await signInMutation.mutateAsync({ email, password });
    if (result.success) {
      return { success: true as const, user: result.data };
    }
    return { success: false as const, error: result.error };
  };

  const signUp = async (
    email: string,
    password: string,
    fullName?: string,
    redirectTo?: string,
  ) => {
    const result = await signUpMutation.mutateAsync({
      email,
      password,
      fullName,
      redirectTo,
    });
    if (result.success) {
      return { success: true as const, user: result.data };
    }
    return { success: false as const, error: result.error };
  };

  const signOut = async () => {
    const result = await signOutMutation.mutateAsync();
    if (result.success) {
      return { success: true as const };
    }
    return { success: false as const, error: result.error };
  };

  const signInWithMagicLink = async (email: string, redirectTo?: string) => {
    const result = await signInWithMagicLinkMutation.mutateAsync({
      email,
      redirectTo,
    });
    if (result.success) {
      return { success: true as const };
    }
    return { success: false as const, error: result.error };
  };

  const handleMagicLinkCallback = async (
    accessToken: string,
    refreshToken: string,
  ) => {
    const result = await handleMagicLinkCallbackMutation.mutateAsync({
      accessToken,
      refreshToken,
    });
    if (result.success) {
      return { success: true as const, user: result.data };
    }
    return { success: false as const, error: result.error };
  };

  const exchangeAuthCodeForSession = async (authCode: string) => {
    const result = await exchangeAuthCodeForSessionMutation.mutateAsync({
      authCode,
    });
    if (result.success) {
      return { success: true as const, user: result.data };
    }
    return { success: false as const, error: result.error };
  };

  return {
    user,
    loading:
      userLoading ||
      signInMutation.isPending ||
      signUpMutation.isPending ||
      signOutMutation.isPending ||
      signInWithMagicLinkMutation.isPending ||
      handleMagicLinkCallbackMutation.isPending ||
      exchangeAuthCodeForSessionMutation.isPending,
    error: userError ?? null,
    signIn,
    signUp,
    signOut,
    signInWithMagicLink,
    handleMagicLinkCallback,
    exchangeAuthCodeForSession,
  };
}
