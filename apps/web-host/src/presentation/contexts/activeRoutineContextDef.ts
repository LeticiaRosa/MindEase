import { createContext } from "react";

export interface ActiveRoutineContextValue {
  activeRoutineId: string | null;
  setActiveRoutineId: (id: string) => void;
  userId: string | null;
}

export const ActiveRoutineContext =
  createContext<ActiveRoutineContextValue | null>(null);
