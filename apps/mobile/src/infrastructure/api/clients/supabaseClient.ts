import { createClient } from "@supabase/supabase-js";
import * as SecureStore from "expo-secure-store";

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

/**
 * SecureStore adapter with value chunking.
 *
 * expo-secure-store has a 2 KB value size limit on iOS.
 * Supabase session tokens can exceed this limit, so values larger than
 * the chunk size are split across multiple SecureStore keys.
 */
const CHUNK_SIZE = 1900; // safe margin below 2048
const CHUNK_DIVIDER = "__chunk__";

const SecureStoreAdapter = {
  async getItem(key: string): Promise<string | null> {
    const numChunksRaw = await SecureStore.getItemAsync(`${key}__numChunks`);

    if (numChunksRaw === null) {
      return SecureStore.getItemAsync(key);
    }

    const numChunks = parseInt(numChunksRaw, 10);
    const chunks: string[] = [];

    for (let i = 0; i < numChunks; i++) {
      const chunk = await SecureStore.getItemAsync(
        `${key}${CHUNK_DIVIDER}${i}`,
      );
      if (chunk === null) return null;
      chunks.push(chunk);
    }

    return chunks.join("");
  },

  async setItem(key: string, value: string): Promise<void> {
    if (value.length <= CHUNK_SIZE) {
      await SecureStore.setItemAsync(key, value);
      // Clean up any old chunks in case this key was previously chunked
      const oldNumChunks = await SecureStore.getItemAsync(`${key}__numChunks`);
      if (oldNumChunks !== null) {
        const n = parseInt(oldNumChunks, 10);
        await SecureStore.deleteItemAsync(`${key}__numChunks`);
        for (let i = 0; i < n; i++) {
          await SecureStore.deleteItemAsync(`${key}${CHUNK_DIVIDER}${i}`);
        }
      }
      return;
    }

    const numChunks = Math.ceil(value.length / CHUNK_SIZE);
    await SecureStore.setItemAsync(`${key}__numChunks`, String(numChunks));
    // Remove non-chunked entry if it existed before
    await SecureStore.deleteItemAsync(key);

    for (let i = 0; i < numChunks; i++) {
      const chunk = value.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);
      await SecureStore.setItemAsync(`${key}${CHUNK_DIVIDER}${i}`, chunk);
    }
  },

  async removeItem(key: string): Promise<void> {
    const numChunksRaw = await SecureStore.getItemAsync(`${key}__numChunks`);

    if (numChunksRaw !== null) {
      const numChunks = parseInt(numChunksRaw, 10);
      await SecureStore.deleteItemAsync(`${key}__numChunks`);
      for (let i = 0; i < numChunks; i++) {
        await SecureStore.deleteItemAsync(`${key}${CHUNK_DIVIDER}${i}`);
      }
    }

    await SecureStore.deleteItemAsync(key);
  },
};

const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    storage: SecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export default supabaseClient;
