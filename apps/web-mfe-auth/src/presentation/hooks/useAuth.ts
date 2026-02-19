import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { User } from "@/domain/entities/User";
import type { AuthResult } from "@/domain/entities/AuthResult";
import { SupabaseAuthRepository } from "@/infrastructure/adapters/SupabaseAuthRepository";
import { signIn as signInUseCase } from "@/application/useCases/signIn";
import { signUp as signUpUseCase } from "@/application/useCases/signUp";
import { signOut as signOutUseCase } from "@/application/useCases/signOut";
import { signInWithMagicLink as signInWithMagicLinkUseCase } from "@/application/useCases/signInWithMagicLink";

const AUTH_KEYS = {
  user: ["auth", "user"] as const,
  session: ["auth", "session"] as const,
} as const;

const repository = new SupabaseAuthRepository();

export function useAuth() {
  const queryClient = useQueryClient();

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
    }: {
      email: string;
      password: string;
      fullName?: string;
    }) => signUpUseCase(repository, email, password, fullName),
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

  const signIn = async (email: string, password: string) => {
    const result = await signInMutation.mutateAsync({ email, password });
    if (result.success) {
      return { success: true as const, user: result.data };
    }
    return { success: false as const, error: result.error };
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    const result = await signUpMutation.mutateAsync({
      email,
      password,
      fullName,
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

  return {
    user,
    loading:
      userLoading ||
      signInMutation.isPending ||
      signUpMutation.isPending ||
      signOutMutation.isPending ||
      signInWithMagicLinkMutation.isPending,
    error: userError ?? null,
    signIn,
    signUp,
    signOut,
    signInWithMagicLink,
  };
}
