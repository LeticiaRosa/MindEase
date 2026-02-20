import type { User } from "@/domain/entities/User";
import type { AuthResult } from "@/domain/entities/AuthResult";
import type {
  IAuthRepository,
  AuthStateCallback,
} from "@/domain/interfaces/IAuthRepository";
import supabaseClient from "@/infrastructure/api/clients/supabaseClient";

export class SupabaseAuthRepository implements IAuthRepository {
  async signIn(email: string, password: string): Promise<AuthResult<User>> {
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return {
        success: false,
        error: {
          message: error.message,
          status: error.status ?? 500,
        },
      };
    }

    return { success: true, data: data.user as User };
  }

  async signUp(
    email: string,
    password: string,
    fullName?: string,
  ): Promise<AuthResult<User>> {
    const { data, error } = await supabaseClient.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      return {
        success: false,
        error: {
          message: error.message,
          status: error.status ?? 500,
        },
      };
    }

    return { success: true, data: data.user as User };
  }

  async signOut(): Promise<AuthResult<void>> {
    const { error } = await supabaseClient.auth.signOut();

    if (error) {
      return {
        success: false,
        error: {
          message: error.message,
          status: error.status ?? 500,
        },
      };
    }

    return { success: true };
  }

  async signInWithMagicLink(
    email: string,
    redirectTo?: string,
  ): Promise<AuthResult<void>> {
    const { error } = await supabaseClient.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo:
          redirectTo || `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      return {
        success: false,
        error: {
          message: error.message,
          status: error.status ?? 500,
        },
      };
    }

    return { success: true };
  }

  async getUser(): Promise<User | null> {
    const { data } = await supabaseClient.auth.getUser();
    return (data.user as User) ?? null;
  }

  async getSession(): Promise<unknown> {
    const { data } = await supabaseClient.auth.getSession();
    return data.session;
  }

  async trackMagicLinkRequest(email: string): Promise<void> {
    await supabaseClient.from("magic_link_requests").insert({
      email,
      used: false,
    });
  }

  onAuthStateChange(callback: AuthStateCallback): { unsubscribe: () => void } {
    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        callback("SIGNED_IN", session.user as User);
      } else if (event === "SIGNED_OUT") {
        callback("SIGNED_OUT", null);
      }
    });

    return { unsubscribe: () => subscription.unsubscribe() };
  }
}
