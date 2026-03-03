import AsyncStorage from "@react-native-async-storage/async-storage";
import type { BrainStateValue } from "@/domain/entities/BrainState";
import { BRAIN_STATE_STORAGE_KEY } from "@/domain/entities/BrainState";

function getDayKey(): string {
  return `${BRAIN_STATE_STORAGE_KEY}:${new Date().toISOString().split("T")[0]}`;
}

export const RecordBrainState = {
  async execute(state: BrainStateValue): Promise<void> {
    await AsyncStorage.setItem(getDayKey(), state);
  },

  async skip(): Promise<void> {
    await AsyncStorage.setItem(getDayKey(), "__skipped__");
  },

  async read(): Promise<BrainStateValue | null> {
    const value = await AsyncStorage.getItem(getDayKey());
    if (!value || value === "__skipped__") return null;
    return value as BrainStateValue;
  },

  async hasAnsweredToday(): Promise<boolean> {
    const value = await AsyncStorage.getItem(getDayKey());
    return value !== null;
  },
};
