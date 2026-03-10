import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useAuth } from "@/presentation/hooks/useAuth";
import {
  type AlertPreferences,
  DEFAULT_ALERT_PREFERENCES,
} from "@/domain/entities/AlertPreferences";
import { LoadAlertPreferences } from "@/application/useCases/LoadAlertPreferences";
import { SaveAlertPreferences } from "@/application/useCases/SaveAlertPreferences";
import { alertPreferencesRepository as repository } from "@/infrastructure/factories/repositories";

// ─── Context value ────────────────────────────────────────────────────────────

interface AlertPreferencesContextValue {
  preferences: AlertPreferences;
  savePreferences: (prefs: AlertPreferences) => Promise<void>;
  isHydrated: boolean;
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

  const [preferences, setPreferences] = useState<AlertPreferences>(
    DEFAULT_ALERT_PREFERENCES,
  );
  const [isHydrated, setIsHydrated] = useState(false);

  // Re-hydrate when the user identity changes
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const loaded = await LoadAlertPreferences.execute(userId, repository);
        if (!cancelled) setPreferences(loaded);
      } catch {
        // Keep defaults
      } finally {
        if (!cancelled) setIsHydrated(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const savePreferences = useCallback(
    async (prefs: AlertPreferences) => {
      const validated = await SaveAlertPreferences.execute(
        userId,
        prefs,
        repository,
      );
      setPreferences(validated);
    },
    [userId],
  );

  return (
    <AlertPreferencesContext.Provider
      value={{ preferences, savePreferences, isHydrated }}
    >
      {children}
    </AlertPreferencesContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAlertPreferences(): AlertPreferencesContextValue {
  const ctx = useContext(AlertPreferencesContext);
  if (!ctx) {
    throw new Error(
      "useAlertPreferences must be used inside AlertPreferencesProvider",
    );
  }
  return ctx;
}

export { DEFAULT_ALERT_PREFERENCES };
