import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useAuth } from "auth/auth";
import {
  type AlertPreferences,
  DEFAULT_ALERT_PREFERENCES,
} from "@/domain/entities/AlertPreferences";
import { LoadAlertPreferences } from "@/application/useCases/LoadAlertPreferences";
import { SaveAlertPreferences } from "@/application/useCases/SaveAlertPreferences";
import { AlertPreferencesLocalStorageAdapter } from "@/infrastructure/adapters/AlertPreferencesLocalStorageAdapter";

// ─── Singleton adapter (no need to recreate each render) ──────────────────────

const repository = new AlertPreferencesLocalStorageAdapter();

// ─── Context value ────────────────────────────────────────────────────────────

interface AlertPreferencesContextValue {
  preferences: AlertPreferences;
  savePreferences: (prefs: AlertPreferences) => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AlertPreferencesContext = createContext<
  AlertPreferencesContextValue | undefined
>(undefined);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AlertPreferencesProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { user } = useAuth();
  const userId = user?.id ?? "anonymous";

  const [preferences, setPreferences] = useState<AlertPreferences>(() =>
    LoadAlertPreferences.execute(userId, repository),
  );

  // Re-hydrate when the user identity changes (e.g., after login)
  useEffect(() => {
    setPreferences(LoadAlertPreferences.execute(userId, repository));
  }, [userId]);

  const savePreferences = useCallback(
    (prefs: AlertPreferences) => {
      const validated = SaveAlertPreferences.execute(userId, prefs, repository);
      setPreferences(validated);
    },
    [userId],
  );

  return (
    <AlertPreferencesContext.Provider value={{ preferences, savePreferences }}>
      {children}
    </AlertPreferencesContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
// eslint-disable-next-line react-refresh/only-export-components
export function useAlertPreferences(): AlertPreferencesContextValue {
  const ctx = useContext(AlertPreferencesContext);
  if (!ctx)
    throw new Error(
      "useAlertPreferences must be used inside AlertPreferencesProvider",
    );
  return ctx;
}

export { DEFAULT_ALERT_PREFERENCES };
