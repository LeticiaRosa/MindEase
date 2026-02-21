import type { BrainStateValue } from "@/domain/valueObjects/BrainState";
import { BRAIN_STATE_SESSION_KEY } from "@/domain/valueObjects/BrainState";

export const RecordBrainState = {
  execute(state: BrainStateValue): void {
    sessionStorage.setItem(BRAIN_STATE_SESSION_KEY, state);
  },

  skip(): void {
    // Intentionally write nothing — engine will default to 'focado'
  },

  read(): BrainStateValue | null {
    return (
      (sessionStorage.getItem(BRAIN_STATE_SESSION_KEY) as BrainStateValue) ??
      null
    );
  },
};
