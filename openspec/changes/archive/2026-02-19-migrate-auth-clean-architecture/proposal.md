## Why

The `web-mfe-auth` micro-frontend has Clean Architecture folder scaffolding (`domain/`, `application/`, `infrastructure/`, `presentation/`) but all real code lives in flat `components/`, `hooks/`, and `utils/` directories. The monolithic `useAuth` hook (291 lines) mixes Supabase SDK calls, React Query orchestration, auth state management, and raw database writes in a single file. Validation schemas are embedded inside UI components, and domain types live in `utils/`. This makes the code hard to test, extend, or swap infrastructure (e.g., replacing Supabase) without touching every layer.

## What Changes

- **Decompose** `src/hooks/userAuth.ts` into separate domain, application, and infrastructure layers
- **Extract** `AuthenticationService` class into an infrastructure adapter (`SupabaseAuthRepository`) implementing a domain-level `IAuthRepository` interface
- **Move** `User` and `AuthError` types from `src/utils/database.types.ts` into `src/domain/entities/`
- **Extract** Zod validation schemas from component files into `src/domain/valueObjects/`
- **Create** use cases (`SignInUseCase`, `SignUpUseCase`, `SignOutUseCase`, `SignInWithMagicLinkUseCase`) in `src/application/useCases/`
- **Create** DTOs for auth input/output shapes in `src/application/dtos/`
- **Move** Supabase client from `src/utils/supabase.ts` to `src/infrastructure/api/clients/`
- **Move** UI components from `src/components/` to `src/presentation/components/`
- **Create** thin presentation hooks in `src/presentation/hooks/` that wire use cases to React Query
- **Remove** redundant `src/lib/utils.ts` (duplicate of `@repo/ui`'s `cn()`)
- **Remove** empty old directories (`src/components/`, `src/hooks/`, `src/utils/`, `src/lib/`) after migration
- **Update** `src/export.tsx` and `src/App.tsx` imports to point to new locations

## Capabilities

### New Capabilities

- `auth-domain-layer`: Domain entities (`User`, `AuthError`), value objects (validation schemas), and repository interface (`IAuthRepository`) — zero framework dependencies
- `auth-application-layer`: Use cases (`SignIn`, `SignUp`, `SignOut`, `SignInWithMagicLink`) and DTOs that orchestrate domain logic without infrastructure coupling
- `auth-infrastructure-layer`: `SupabaseAuthRepository` adapter implementing `IAuthRepository`, Supabase client configuration, and magic-link database operations
- `auth-presentation-layer`: Relocated UI components and new thin hooks bridging use cases to React Query for the presentation layer

### Modified Capabilities

_(No existing specs in `openspec/specs/` — nothing to modify.)_

## Impact

- **Code**: All files under `apps/web-mfe-auth/src/` are affected — components, hooks, utilities, and entry points will be moved or rewritten
- **Imports**: Every internal import path changes; `src/export.tsx`, `src/App.tsx`, and `src/main.tsx` must be updated
- **Module Federation**: The exposed entry point (`./auth` → `src/export.tsx`) stays the same, but its internal imports change
- **Dependencies**: No new external dependencies — Supabase SDK, React Query, react-hook-form, and zod remain
- **Tests**: Existing tests (if any) will break due to path changes; new architecture enables isolated unit tests per layer
- **Risk**: Low — purely structural refactor with no behavior changes; the public API (`Auth` component, `useAuth` hook via Module Federation) remains identical
