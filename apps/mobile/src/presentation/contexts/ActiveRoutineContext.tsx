import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "@/presentation/hooks/useAuth";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ActiveRoutineContextValue {
  activeRoutineId: string | null;
  setActiveRoutineId: (id: string) => void;
  userId: string | null;
  isHydrated: boolean;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const ActiveRoutineContext = createContext<ActiveRoutineContextValue | null>(
  null,
);

// ─── Helpers ──────────────────────────────────────────────────────────────────

function storageKey(userId: string): string {
  return `mindease:activeRoutine:${userId}`;
}

// ─── Provider ─────────────────────────────────────────────────────────────────

interface ActiveRoutineProviderProps {
  children: ReactNode;
}

export function ActiveRoutineProvider({
  children,
}: ActiveRoutineProviderProps) {
  const { user } = useAuth();
  const userId = user?.id ?? null;
  const [activeRoutineId, setActiveRoutineIdState] = useState<string | null>(
    null,
  );
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    if (!userId) {
      setActiveRoutineIdState(null);
      setIsHydrated(true);
      return;
    }
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(storageKey(userId));
        setActiveRoutineIdState(stored);
      } catch {
        // Ignore
      } finally {
        setIsHydrated(true);
      }
    })();
  }, [userId]);

  const setActiveRoutineId = useCallback(
    (id: string) => {
      setActiveRoutineIdState(id);
      if (userId) {
        AsyncStorage.setItem(storageKey(userId), id).catch(() => {});
      }
    },
    [userId],
  );

  return (
    <ActiveRoutineContext.Provider
      value={{ activeRoutineId, setActiveRoutineId, userId, isHydrated }}
    >
      {children}
    </ActiveRoutineContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useActiveRoutine(): ActiveRoutineContextValue {
  const ctx = useContext(ActiveRoutineContext);
  if (!ctx) {
    throw new Error(
      "useActiveRoutine must be used within ActiveRoutineProvider",
    );
  }
  return ctx;
}
