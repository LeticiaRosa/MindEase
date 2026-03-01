## Context

`apps/mobile` is a React Native + Expo 52 app that currently renders a single static placeholder screen. The web apps (`web-mfe-auth`, `web-host`) implement a full authentication flow and cognitive dashboard using Clean Architecture (domain → application → infrastructure → presentation). Mobile has no equivalent layer structure, no Supabase integration, and no routing beyond the default expo-router scaffold.

This design introduces auth and dashboard capabilities to mobile while staying consistent with the architectural patterns already established on web.

## Goals / Non-Goals

**Goals:**
- Establish the Clean Architecture folder structure inside `apps/mobile/`.
- Implement Supabase authentication (password sign-in, sign-up, sign-out, magic-link) using the same domain interfaces as `web-mfe-auth`.
- Persist sessions across app restarts via `expo-secure-store`.
- Add expo-router file-based routing with an `(auth)` group (public) and an `(app)` group (protected).
- Build a `DashboardScreen` that surfaces task status summary, active routine strip, cognitive alert banner, and Brain Today check-in.
- Reuse `@repo/ui` theme tokens (`colors`, `fontSizes`, `spacing`) for consistent visual language.

**Non-Goals:**
- Module Federation does not exist on mobile; auth is not a remote micro-frontend.
- shadcn/ui components are web-only and will NOT be ported; React Native primitives + StyleSheet are used instead.
- The full Kanban drag-and-drop interface is out of scope — the Dashboard shows a read-only grouped task list.
- Push notifications, biometric auth, and offline sync are out of scope for this change.

## Decisions

### 1. Replicate folder structure from `web-mfe-auth` / `web-host`

**Decision:** Introduce `domain/`, `application/`, `infrastructure/`, and `presentation/` directories inside `apps/mobile/src/` with sub-folders matching the web conventions (`entities/`, `interfaces/`, `valueObjects/`, `useCases/`, `adapters/`, `api/clients/`, `components/`, `hooks/`, `pages/`).

**Rationale:** Consistent architecture across web and mobile reduces cognitive overhead, makes onboarding easier, and means auth logic (use-cases, interfaces) can be reviewed in a familiar context. Diverging would create two maintenance paths for the same domain.

**Alternative considered:** Copy only files wholesale from `web-mfe-auth`. Rejected because direct copy would import React DOM dependencies that don't work in React Native, and would skip the opportunity to adapt types and adapters for the mobile runtime.

---

### 2. SecureStore as Supabase session storage adapter

**Decision:** Pass a custom `storage` object to the Supabase client that delegates to `expo-secure-store` (`getItem`, `setItem`, `removeItem`).

**Rationale:** Access tokens are sensitive credentials. `expo-secure-store` encrypts values using the device keychain (iOS) or Android Keystore — significantly more secure than `AsyncStorage`. Supabase `@supabase/supabase-js` v2 accepts any storage adapter implementing the `SupportedStorage` interface.

**Alternative considered:** `AsyncStorage`. Not chosen because it stores data in plaintext on the file system.

---

### 3. expo-router group routing for auth guard

**Decision:** Use expo-router's file-based group convention:
- `app/(auth)/_layout.tsx` — redirects authenticated users to `/(app)/dashboard`
- `app/(auth)/login.tsx`, `app/(auth)/register.tsx`, `app/(auth)/magic-link-callback.tsx`
- `app/(app)/_layout.tsx` — redirects unauthenticated users to `/(auth)/login`
- `app/(app)/dashboard.tsx`

The root `app/_layout.tsx` wraps everything in `QueryClientProvider` + `AuthProvider`.

**Rationale:** expo-router's group layouts are idiomatic for auth gating in Expo apps. Centralising the redirect in the layout means individual screens never need to check auth themselves. Mirrors the `ProtectedRoute` and `AuthWrapper` pattern already used on web.

**Alternative considered:** Single flat route list with imperative `router.replace` in each screen. Rejected as it scatters auth logic and is harder to reason about.

---

### 4. AuthProvider context for reactive session state

**Decision:** Create `presentation/contexts/AuthContext.tsx` that subscribes to `supabaseClient.auth.onAuthStateChange` and exposes `{ user, session, isLoading }` to all screens via context. The `useAuth` hook is a thin wrapper over `useContext(AuthContext)`.

**Rationale:** Auth state must be available across the entire navigation tree. The same pattern is used in `web-mfe-auth` via `presentation/hooks/useAuth.ts`. A context provider at the root layout is the standard React approach and avoids prop-drilling or global singletons.

---

### 5. TanStack Query for dashboard data fetching

**Decision:** Add `@tanstack/react-query` to `apps/mobile` and wrap the root layout in `QueryClientProvider`. Dashboard hooks (`useTasks`, `useRoutines`) use `useQuery` with Supabase repository calls as query functions.

**Rationale:** Already a shared dependency in the monorepo (listed as a singleton in module federation config). Using it on mobile keeps data-fetching patterns consistent and gives caching, loading states, and error handling out of the box.

---

### 6. No shadcn/ui — React Native StyleSheet + @repo/ui theme tokens

**Decision:** All React Native UI is built with `View`, `Text`, `TouchableOpacity`, `FlatList`, `ScrollView` etc. styled via `StyleSheet.create`. Visual tokens (`colors`, `fontSizes`, `spacing`, `radii`) are imported from `@repo/ui/theme`.

**Rationale:** shadcn/ui components render HTML elements and depend on Radix UI which is DOM-only. The theme token package already supports React Native (it exports plain JS objects). This gives design consistency without requiring a separate mobile component library.

---

### 7. Magic-link deep-link scheme

**Decision:** Register the Expo deep-link scheme `mindease` in `app.json` (`scheme: "mindease"`). The redirect URL for magic links is `mindease://magic-link-callback`. The `magic-link-callback` screen extracts `access_token`/`refresh_token` from the URL params and calls `supabase.auth.setSession()`.

**Rationale:** Expo Linking handles the URL scheme automatically once registered. The pattern mirrors the `MagicLinkCallbackPage` in `web-mfe-auth` that exchanges tokens via `supabase.auth.exchangeCodeForSession()`.

**Alternative considered:** Universal links (HTTPS). Requires domain verification setup that is out of scope for this change.

## Risks / Trade-offs

- **SecureStore key size limit (2 KB on iOS):** Supabase session tokens can approach this limit. Mitigation: compress or split the stored value if needed; monitor session token size on upgrade.
- **Deep-link cold-start race on Android:** The app may initialise before `expo-linking` delivers the URL. Mitigation: listen to `Linking.addEventListener` in the callback screen and also call `Linking.getInitialURL()` on mount.
- **TanStack Query version alignment:** The monorepo pins `@tanstack/react-query`. Adding it to mobile must use the exact same version. Mitigation: install via workspace protocol if the package is hoisted, otherwise pin to the same semver.
- **Token refresh on background:** Supabase JS v2 auto-refreshes tokens via timers, but timers may be throttled in React Native background mode. Mitigation: re-check session on `AppState` `active` events.

## Migration Plan

1. Add new dependencies to `apps/mobile/package.json` and run `pnpm install`.
2. Register `scheme: "mindease"` in `app.json`.
3. Create domain, application, and infrastructure layers (no UI changes yet).
4. Add `AuthProvider` and `QueryClientProvider` to root layout.
5. Create `(auth)` group layouts and screens.
6. Create `(app)` group layout and `DashboardScreen`.
7. Remove the old placeholder `app/index.tsx` (redirect root to `/(auth)/login` or `/(app)/dashboard` based on session).
8. Run `pnpm lint --filter @mindease/mobile` and `pnpm check-types --filter @mindease/mobile`.

**Rollback:** The old `app/index.tsx` and `app/_layout.tsx` can be restored; no database migrations are involved.

## Open Questions

- Should `trackMagicLinkRequest` (rate-limit tracking) be implemented on mobile, or omitted since the mobile app has no server-side session tracking? Current inclination: implement as a no-op or delegate to Supabase's built-in rate limiting.
- Should `BrainTodayModal` on mobile use `AsyncStorage` (instead of `sessionStorage`) with a daily TTL, or a simple in-memory flag? AsyncStorage with a `YYYY-MM-DD` key is preferred for persistence across backgrounding.
