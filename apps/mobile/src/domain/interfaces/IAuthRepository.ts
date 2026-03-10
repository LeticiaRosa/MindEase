import type { User } from "../entities/User";
import type { AuthResult } from "../entities/AuthResult";

export type AuthStateEvent = "SIGNED_IN" | "SIGNED_OUT";

export type AuthStateCallback = (
  event: AuthStateEvent,
  user: User | null,
) => void;

export interface IAuthRepository {
  signIn(email: string, password: string): Promise<AuthResult<User>>;
  signUp(
    email: string,
    password: string,
    fullName?: string,
    redirectTo?: string,
  ): Promise<AuthResult<User>>;
  signOut(): Promise<AuthResult<void>>;
  signInWithMagicLink(
    email: string,
    redirectTo?: string,
  ): Promise<AuthResult<void>>;
  getUser(): Promise<User | null>;
  getSession(): Promise<unknown>;
  setSession(
    accessToken: string,
    refreshToken: string,
  ): Promise<AuthResult<User>>;
  exchangeCodeForSession(authCode: string): Promise<AuthResult<User>>;
  trackMagicLinkRequest(email: string): Promise<void>;
  onAuthStateChange(callback: AuthStateCallback): { unsubscribe: () => void };
}
