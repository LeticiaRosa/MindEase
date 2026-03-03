## Why

The mobile app (`apps/mobile`) already follows the same 4-layer Clean Architecture as the web apps (`web-mfe-auth`, `web-host`), but several inconsistencies remain:

1. **Auth layer mismatch** — The mobile `useAuth` hook simply re-exports a context-based state, while the web equivalent (`web-mfe-auth`) uses `@tanstack/react-query` mutations/queries wrapping use cases with full cache invalidation. The mobile `AuthContext` calls `supabaseClient` directly instead of going through the repository/use-case stack.
2. **Route-level presentation leaks** — Auth screens (`login.tsx`, `register.tsx`, `magic-link-callback.tsx`) instantiate `SupabaseAuthRepository` at module scope and call use cases inline, mixing presentation and application orchestration. The web apps delegate this entirely to hooks.
3. **No application DTOs** — The mobile `application/` layer has use cases but no DTOs (`dtos/` is present in `web-mfe-auth` as `AuthInput.ts`). The host uses rich DTOs for tasks, routines, and alerts.
4. **Missing use-case patterns for domain features** — Tasks/routines in mobile only have repository calls inside hooks; there are no use cases for `getTasks`, `getRoutines`, or any future CRUD operations — unlike `web-host` which has class-based use cases with constructor DI.
5. **Inconsistent hook wiring** — `useTasks` and `useRoutines` instantiate concrete Supabase repositories at module scope without passing through use cases. In `web-host`, hooks instantiate repositories and use cases together, keeping the dependency chain clean.
6. **Dashboard component directly imports use case + repository** — `UserMenu.tsx` instantiates `SupabaseAuthRepository` and calls `signOut` use case directly, bypassing any central auth hook.

Aligning mobile with the web patterns ensures a consistent developer experience, simplifies code reviews across apps, and makes the architecture portable for future features (task CRUD, routine management, Pomodoro timers).

## What Changes

- **Refactor `AuthContext` → query-based `useAuth` hook**: Replace the React context with a `@tanstack/react-query`-based `useAuth` hook that mirrors `web-mfe-auth`'s pattern (query for user, mutations for signIn/signUp/signOut/signInWithMagicLink, cache invalidation on auth state change).
- **Remove `AuthProvider` from root layout**: Since auth state will be managed by react-query, the context provider becomes unnecessary.
- **Extract auth orchestration from route screens**: `login.tsx`, `register.tsx`, and `magic-link-callback.tsx` should use `useAuth()` hook methods instead of directly calling use cases and instantiating repositories.
- **Add application DTOs**: Create `AuthInput.ts` (matching `web-mfe-auth`) and `TaskDTOs.ts`, `RoutineDTOs.ts` (matching `web-host`) in `src/application/dtos/`.
- **Add task/routine use cases**: Create class-based use cases (`GetTasks`, `GetRoutines`) with constructor DI following `web-host`'s pattern, so hooks go through the use-case layer instead of calling repositories directly.
- **Refactor `useTasks` / `useRoutines` hooks**: Wire them through use cases instead of directly calling repositories.
- **Refactor `UserMenu` component**: Use `useAuth()` hook's `signOut` method instead of instantiating repository + use case inline.
- **Refactor `magic-link-callback.tsx`**: Use the auth repository through the `useAuth` hook instead of importing `supabaseClient` directly.
- **Standardize `application/services/` directory**: Create the directory (or keep it empty with a README, matching `web-mfe-auth`).

## Capabilities

### New Capabilities

- `mobile-auth-hook`: Refactored query-based `useAuth` hook for mobile, mirroring `web-mfe-auth`'s pattern with `@tanstack/react-query` mutations, cache invalidation, and centralized auth state — replacing the context-based approach.
- `mobile-use-case-layer`: Class-based use cases for tasks and routines (GetTasks, GetRoutines) and application DTOs, aligning mobile's application layer with `web-host`'s patterns.

### Modified Capabilities

_(none — no existing spec-level requirements are changing, only internal implementation alignment)_

## Impact

- **Code affected**: All files under `apps/mobile/src/presentation/` (hooks, contexts, components) and `apps/mobile/app/` (route screens). New files in `apps/mobile/src/application/dtos/` and `apps/mobile/src/application/useCases/`.
- **Deleted files**: `src/presentation/contexts/AuthContext.tsx` (replaced by query-based hook).
- **Dependencies**: No new packages — `@tanstack/react-query` is already installed.
- **APIs**: No backend/API changes.
- **Risk**: Auth flow disruption during refactor — must ensure session persistence and deep-link handling (magic-link callback) remain intact with the new query-based approach. The `AppState` foreground/background token refresh logic needs to be preserved in the new hook.
