import { defineConfig } from "vitest/config";
import { resolve } from "path";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    css: false, // Don't process CSS in tests
    env: {
      VITE_SUPABASE_URL: "https://test.supabase.co",
      VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY: "test-anon-key",
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
      // Point @repo/ui to source so tests don't require a build step
      "@repo/ui": resolve(__dirname, "../../packages/ui/src"),
      // Stub for the federated auth MFE module (resolved at runtime only)
      // "auth/useAuth": resolve(
      //   __dirname,
      //   "./src/test/__mocks__/auth-useAuth.stub.ts",
      // ),
    },
  },
});
