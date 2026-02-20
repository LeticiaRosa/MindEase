declare module "auth/auth" {
  import type { User } from "@supabase/supabase-js";

  interface UseAuthReturn {
    user: User | null;
    loading: boolean;
    error: { message: string } | null;
    signIn: (
      email: string,
      password: string,
    ) => Promise<
      | { success: true; user: User | null }
      | { success: false; error: { message: string; status?: number } }
    >;
    signUp: (
      email: string,
      password: string,
      fullName?: string,
    ) => Promise<
      | { success: true; user: User | null }
      | { success: false; error: { message: string; status?: number } }
    >;
    signOut: () => Promise<
      { success: true } | { success: false; error: { message: string } }
    >;
  }

  export function useAuth(): UseAuthReturn;
}
