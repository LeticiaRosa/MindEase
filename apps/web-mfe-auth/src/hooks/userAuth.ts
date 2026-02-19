import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AuthError, AuthResponse, Session } from "@supabase/supabase-js";
import type { User } from "../utils/database.types";
import supabase from "../utils/supabase";

// Chaves centralizadas para o React Query
const AUTH_KEYS = {
  user: ["auth", "user"] as const,
  session: ["auth", "session"] as const,
} as const;

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: (AuthError & { message: string; status: number }) | null;
}

// Classe de serviço para operações de autenticação
class AuthenticationService {
  public async signIn(email: string, password: string): Promise<AuthResponse> {
    return await supabase.auth.signInWithPassword({ email, password });
  }

  public async signUp(
    email: string,
    password: string,
    fullName?: string,
  ): Promise<AuthResponse> {
    return await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });
  }

  public async signOut() {
    return await supabase.auth.signOut();
  }

  public async signInWithMagicLink(email: string, redirectTo?: string) {
    return await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectTo || window.location.origin,
      },
    });
  }

  public async getSession(): Promise<Session | null> {
    const { data } = await supabase.auth.getSession();
    return data.session;
  }

  public async getUser(): Promise<User | null> {
    const { data } = await supabase.auth.getUser();
    return data.user as User | null;
  }
}

// Instâncias dos serviços
const authService = new AuthenticationService();

export function useAuth() {
  const queryClient = useQueryClient();

  // Query para obter o usuário atual
  const {
    data: user,
    isLoading: userLoading,
    error: userError,
  } = useQuery({
    queryKey: AUTH_KEYS.user,
    queryFn: () => authService.getUser(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false,
  });

  // Mutations para autenticação
  const signInMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authService.signIn(email, password),
    onSuccess: (data: AuthResponse) => {
      if (data.data.user) {
        queryClient.setQueryData(AUTH_KEYS.user, data.data.user);
        queryClient.invalidateQueries({ queryKey: AUTH_KEYS.session });
      }
    },
    onError: (error: AuthError) => {
      console.error("Sign in error:", error);
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
    }) => authService.signUp(email, password, fullName),
    onSuccess: (data: AuthResponse) => {
      if (data.data.user) {
        queryClient.setQueryData(AUTH_KEYS.user, data.data.user);
        queryClient.invalidateQueries({ queryKey: AUTH_KEYS.session });
      }
    },
    onError: (error: AuthError) => {
      console.error("Sign up error:", error);
    },
  });

  const signOutMutation = useMutation({
    mutationFn: () => authService.signOut(),
    onSuccess: () => {
      queryClient.setQueryData(AUTH_KEYS.user, null);
      queryClient.removeQueries({ queryKey: AUTH_KEYS.session });
    },
    onError: (error) => {
      console.error("Sign out error:", error);
    },
  });

  const signInWithMagicLinkMutation = useMutation({
    mutationFn: ({
      email,
      redirectTo,
    }: {
      email: string;
      redirectTo?: string;
    }) => authService.signInWithMagicLink(email, redirectTo),
    onSuccess: () => {
      // Magic link will authenticate on callback, no immediate user update
    },
    onError: (error: AuthError) => {
      console.error("Magic link error:", error);
    },
  });

  // Listen para mudanças de estado de autenticação
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        queryClient.setQueryData(AUTH_KEYS.user, session.user as User);
      } else if (event === "SIGNED_OUT") {
        queryClient.setQueryData(AUTH_KEYS.user, null);
      }
    });

    return () => subscription.unsubscribe();
  }, [queryClient]);

  // Helper functions
  const signIn = async (email: string, password: string) => {
    try {
      const result = await signInMutation.mutateAsync({ email, password });

      if (result.error) {
        return {
          success: false,
          error: {
            message: result.error.message,
            status: result.error.status,
          },
        };
      }

      return { success: true, user: result.data.user };
    } catch (error: unknown) {
      const authError = error as AuthError;
      return {
        success: false,
        error: {
          message: authError?.message || "Erro inesperado ao fazer login",
          status: authError?.status || 500,
        },
      };
    }
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    try {
      const result = await signUpMutation.mutateAsync({
        email,
        password,
        fullName,
      });

      if (result.error) {
        return {
          success: false,
          error: {
            message: result.error.message,
            status: result.error.status,
          },
        };
      }

      return { success: true, user: result.data.user };
    } catch (error: unknown) {
      const authError = error as AuthError;
      return {
        success: false,
        error: {
          message: authError?.message || "Erro inesperado ao criar conta",
          status: authError?.status || 500,
        },
      };
    }
  };

  const signOut = async () => {
    try {
      await signOutMutation.mutateAsync();
      return { success: true };
    } catch (error: unknown) {
      const authError = error as AuthError;
      return {
        success: false,
        error: {
          message: authError?.message || "Erro inesperado ao fazer logout",
          status: authError?.status || 500,
        },
      };
    }
  };

  const signInWithMagicLink = async (email: string, redirectTo?: string) => {
    try {
      const result = await signInWithMagicLinkMutation.mutateAsync({
        email,
        redirectTo,
      });

      if (result.error) {
        return {
          success: false,
          error: {
            message: result.error.message,
            status: result.error.status,
          },
        };
      }

      // Log magic link request to our tracking table
      try {
        await supabase.from("magic_link_requests").insert({
          email,
          used: false,
        });
      } catch (trackingError) {
        console.warn("Failed to track magic link request:", trackingError);
      }

      return { success: true };
    } catch (error: unknown) {
      const authError = error as AuthError;
      return {
        success: false,
        error: {
          message: authError?.message || "Erro ao enviar magic link",
          status: authError?.status || 500,
        },
      };
    }
  };

  return {
    user,
    loading:
      userLoading ||
      signInMutation.isPending ||
      signUpMutation.isPending ||
      signOutMutation.isPending ||
      signInWithMagicLinkMutation.isPending,
    error: userError ? userError : null,
    signIn,
    signUp,
    signOut,
    signInWithMagicLink,
  };
}
