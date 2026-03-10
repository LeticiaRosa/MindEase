import { useContext } from "react";
import {
  ActiveRoutineContext,
  type ActiveRoutineContextValue,
} from "../contexts/activeRoutineContextDef";

export function useActiveRoutine(): ActiveRoutineContextValue {
  const ctx = useContext(ActiveRoutineContext);
  if (!ctx)
    throw new Error(
      "useActiveRoutine must be used within ActiveRoutineProvider",
    );
  return ctx;
}
