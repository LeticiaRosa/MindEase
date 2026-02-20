// Stub for the federated "auth/auth" module — used in tests only.
// The real implementation is provided at runtime by the web-mfe-auth remote.

export function useAuth() {
  // This stub is fully overridden by vi.mock('auth/auth', ...) in each test file.
  throw new Error("useAuth stub: override with vi.mock in your test file");
}
