## Why

The `@mindease/mobile` app currently renders only a static placeholder screen with no authentication or real functionality, while the web apps already have a full Clean Architecture auth flow and a cognitive dashboard. Users who need accessibility support from MindEase on mobile have no working experience today, and the mobile codebase has no parity with the established patterns from `web-mfe-auth` and `web-host`.

## What Changes

- Introduce a Clean Architecture layer structure (`domain/`, `application/`, `infrastructure/`, `presentation/`) inside `apps/mobile/` mirroring `web-mfe-auth` and `web-host`.
- Add Supabase authentication (sign-in with password, sign-up, sign-out) adapted for React Native / Expo.
- Add magic-link sign-in with Expo deep-link callback handling.
- Introduce a protected route guard: unauthenticated users are redirected to the login screen via expo-router.
- Introduce a `useAuth` hook (session state, loading, user) scoped to mobile.
- Add a `LoginScreen` and `RegisterScreen` with `react-hook-form` + `zod` validation, matching the sign-in/sign-up forms in `web-mfe-auth`.
- Add a `DashboardScreen` adapted for React Native: task summary (Kanban-style status list), active routine display, and cognitive alert banner.
- Persist session across app restarts using Expo SecureStore as the Supabase storage adapter.
- Wire up expo-router file-based routing: `(auth)/login`, `(auth)/register`, `(auth)/magic-link-callback`, `(app)/dashboard` (protected).

## Capabilities

### New Capabilities

- `mobile-auth`: Authentication screens and domain logic for React Native — sign-in with password, sign-up, sign-out, magic-link flow, session persistence via SecureStore, `useAuth` hook, `IAuthRepository` interface, and `SupabaseAuthRepository` adapter.
- `mobile-dashboard`: Cognitive dashboard screen for React Native — task status summary, active routine strip, cognitive alert banner, focus timer entry point, and user menu. Adapts the web `Dashboard` feature to React Native + expo-router.

### Modified Capabilities

_(none — no existing spec-level requirements are changing)_

## Impact

- **`apps/mobile/`**: New folder structure (`domain/`, `application/`, `infrastructure/`, `presentation/`), new screens, new hooks, updated `_layout.tsx` and routing.
- **`apps/mobile/package.json`**: New dependencies — `@supabase/supabase-js`, `expo-secure-store`, `expo-linking`, `@tanstack/react-query`, `react-hook-form`, `@hookform/resolvers`, `zod`.
- **`apps/mobile/.env`**: Requires `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
- **`packages/ui`**: No changes required — theme tokens (`colors`, `fontSizes`, `spacing`) are already consumed by mobile.
- **Supabase project**: Must have redirect URL for deep-link (`mindease://magic-link-callback`) added to allowed redirect URLs.
- **No breaking changes** to `web-host` or `web-mfe-auth`.
