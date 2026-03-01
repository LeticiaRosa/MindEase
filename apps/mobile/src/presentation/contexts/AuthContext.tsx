import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { AppState, type AppStateStatus } from "react-native";
import type { Session } from "@supabase/supabase-js";
import type { User } from "@/domain/entities/User";
import supabaseClient from "@/infrastructure/api/clients/supabaseClient";

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  session: null,
  isLoading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const appStateRef = useRef(AppState.currentState);

  useEffect(() => {
    // Load initial session
    supabaseClient.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setUser((s?.user as User) ?? null);
      setIsLoading(false);
    });

    // Subscribe to auth state changes
    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      setUser((s?.user as User) ?? null);
      setIsLoading(false);
    });

    // Handle token refresh on app foreground
    const appStateSub = AppState.addEventListener(
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

    return () => {
      subscription.unsubscribe();
      appStateSub.remove();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, session, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext(): AuthContextValue {
  return useContext(AuthContext);
}
