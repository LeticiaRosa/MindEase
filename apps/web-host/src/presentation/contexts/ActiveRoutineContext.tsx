import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import supabaseClient from "@/infrastructure/api/clients/supabaseClient";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ActiveRoutineContextValue {
  activeRoutineId: string | null;
  setActiveRoutineId: (id: string) => void;
  userId: string | null;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const ActiveRoutineContext = createContext<ActiveRoutineContextValue | null>(
  null,
);

// ─── Helpers ─────────────────────────────────────────────────────────────────

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
  const [userId, setUserId] = useState<string | null>(null);
  const [activeRoutineId, setActiveRoutineIdState] = useState<string | null>(
    null,
  );

  useEffect(() => {
    supabaseClient.auth.getUser().then(({ data }) => {
      const uid = data.user?.id ?? null;
      setUserId(uid);
      if (uid) {
        const stored = localStorage.getItem(storageKey(uid));
        setActiveRoutineIdState(stored);
      }
    });
  }, []);

  const setActiveRoutineId = useCallback(
    (id: string) => {
      setActiveRoutineIdState(id);
      if (userId) {
        localStorage.setItem(storageKey(userId), id);
      }
    },
    [userId],
  );

  return (
    <ActiveRoutineContext.Provider
      value={{ activeRoutineId, setActiveRoutineId, userId }}
    >
      {children}
    </ActiveRoutineContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useActiveRoutine(): ActiveRoutineContextValue {
  const ctx = useContext(ActiveRoutineContext);
  if (!ctx)
    throw new Error(
      "useActiveRoutine must be used within ActiveRoutineProvider",
    );
  return ctx;
}
