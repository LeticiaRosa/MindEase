## Context

The `web-mfe-auth` micro-frontend currently has a Clean Architecture folder scaffold (`domain/`, `application/`, `infrastructure/`, `presentation/`) with **zero code** in any of those directories. All production code lives in flat top-level folders:

- `src/hooks/userAuth.ts` — a 291-line monolith containing an `AuthenticationService` class (Supabase SDK calls), React Query queries/mutations, an `onAuthStateChange` listener, and helper functions that normalize results into `{ success, error, user }` shapes.
- `src/components/` — 5 React components (Auth, SignIn, SignUp, SignInWithPassword, SignInWithMagicLink) that embed Zod validation schemas and call `useAuth()` directly.
- `src/utils/supabase.ts` — Supabase client creation.
- `src/utils/database.types.ts` — `User` and `AuthError` type definitions.
- `src/lib/utils.ts` — duplicate `cn()` helper already provided by `@repo/ui`.

The Module Federation entry point (`src/export.tsx`) re-exports the `Auth` component. The host app (`web-host`) consumes `auth/auth` and `auth/useAuth`.

## Goals / Non-Goals

**Goals:**

- Populate the existing Clean Architecture folders with properly layered code
- Make domain and application layers framework-agnostic (no React, no Supabase imports)
- Enable unit testing of business logic without infrastructure dependencies
- Preserve the existing public API: the `Auth` component (default export) and `useAuth` hook
- Keep Module Federation contract unchanged (`./auth` → `src/export.tsx`)

**Non-Goals:**

- Changing authentication behavior or adding new auth methods
- Migrating away from Supabase or React Query
- Modifying the host app (`web-host`) or shared UI package (`@repo/ui`)
- Adding new features (password reset, profile management)
- Changing the `@repo/ui` shared component library
- Restructuring any code outside `apps/web-mfe-auth/src/`

## Decisions

### 1. Domain layer: pure TypeScript, zero dependencies

**Decision**: The `domain/` layer will contain only plain TypeScript types, interfaces, and Zod schemas with no framework imports.

**Rationale**: Clean Architecture mandates the domain is the innermost layer. Keeping it dependency-free means it can be tested trivially and reused across web and mobile.

**Alternatives considered**:

- Keep Zod schemas in components — rejected because schemas encode domain validation rules, not presentation concerns
- Use class-based entities — rejected because TypeScript interfaces + Zod provide the same guarantees with less ceremony in a React codebase

**Structure**:

```
domain/
  entities/
    User.ts              — User type
    AuthResult.ts        — AuthResult<T> response type
  interfaces/
    IAuthRepository.ts   — contract for auth operations
  valueObjects/
    authSchemas.ts       — Zod schemas (loginSchema, signUpSchema, magicLinkSchema)
```

### 2. Application layer: use cases as pure async functions

**Decision**: Each auth operation becomes a standalone use case function that receives an `IAuthRepository` via parameter injection.

**Rationale**: Function-based use cases are simpler and more idiomatic in TypeScript/React than class-based ones. Parameter injection avoids DI container complexity while still inverting the dependency.

**Alternatives considered**:

- Class-based use cases with constructor injection — rejected as over-engineering for 4 simple operations
- Keeping logic in hooks — rejected because it couples business rules to React

**Structure**:

```
application/
  useCases/
    signIn.ts
    signUp.ts
    signOut.ts
    signInWithMagicLink.ts
  dtos/
    AuthInput.ts         — input DTOs for each use case
    AuthOutput.ts        — unified AuthResult output type (re-exports from domain)
```

### 3. Infrastructure layer: adapter pattern for Supabase

**Decision**: Create a `SupabaseAuthRepository` class that implements `IAuthRepository`. Move the Supabase client creation to `infrastructure/api/clients/supabaseClient.ts`. Move the magic-link tracking insert into the adapter.

**Rationale**: The adapter pattern makes the Supabase dependency swappable and testable via mock implementations.

**Alternatives considered**:

- Multiple small adapters per operation — rejected because all operations use the same Supabase client
- keeping Supabase client in `utils/` — rejected because it's infrastructure

**Structure**:

```
infrastructure/
  api/
    clients/
      supabaseClient.ts  — createClient() setup
  adapters/
    SupabaseAuthRepository.ts — implements IAuthRepository
```

### 4. Presentation layer: thin hooks + relocated components

**Decision**: Move all UI components to `presentation/components/`. Create a thin `useAuth` hook in `presentation/hooks/` that instantiates `SupabaseAuthRepository`, wires use cases, and uses React Query for caching and state.

**Rationale**: The presentation hook is the composition root — it wires infrastructure to application to domain. Components stay focused on rendering.

**Alternatives considered**:

- Context-based dependency injection — rejected as unnecessary complexity for a single micro-frontend
- Keeping components in `src/components/` — rejected because the scaffold expects `presentation/components/`

**Structure**:

```
presentation/
  hooks/
    useAuth.ts           — composition root: creates repo, wraps use cases in React Query
  components/
    Auth.tsx
    SignIn.tsx
    SignUp.tsx
    SignIn/
      SignInWithPassword.tsx
      SignInWithMagicLink.tsx
```

### 5. Remove `src/lib/utils.ts`

**Decision**: Delete the local `cn()` helper and update any imports to use `@repo/ui` instead.

**Rationale**: It's a 1:1 duplicate. Single source of truth.

### 6. Update entry points in place

**Decision**: Keep `src/export.tsx`, `src/App.tsx`, and `src/main.tsx` at their current paths but update their imports to point to `presentation/`.

**Rationale**: Module Federation configuration references these exact paths. Moving them would require updating `vite.config.ts` and the host app.

### 7. Export `useAuth` from the Module Federation boundary

**Decision**: Add a named `useAuth` export from `src/export.tsx` alongside the existing default `Auth` export, since the host already declares `auth/useAuth` in its type definitions.

**Rationale**: The host's `src/auth.d.ts` and `src/@types/federation.d.ts` already expect this export. Currently `export.tsx` only exports `Auth`.

## Risks / Trade-offs

- **[Path changes break imports during migration]** → Mitigation: migrate bottom-up (domain first, then application, then infrastructure, then presentation), updating imports at each step. Run `pnpm check-types --filter web-mfe-auth` after each layer.
- **[Supabase client singleton must be shared]** → Mitigation: the adapter holds a reference to a single `supabaseClient` module export, same pattern as today.
- **[React Query cache keys must stay consistent]** → Mitigation: centralize `AUTH_KEYS` in the presentation hook (same location they're used). No external consumers depend on these keys.
- **[Module Federation consumers could break]** → Mitigation: the exposed entry point path (`src/export.tsx`) and its default export (`Auth`) remain unchanged. Only internal imports change.
- **[Over-abstraction for a small module]** → Trade-off accepted: the architecture guidelines in `ARCHITECTURE.md` and `AGENTS.md` mandate Clean Architecture. The auth module is small, but consistency across the monorepo justifies the structure.

## Migration Plan

1. Create domain layer files (entities, interfaces, value objects)
2. Create application layer files (use cases, DTOs)
3. Create infrastructure layer files (Supabase client, adapter)
4. Create presentation layer files (hooks, components — copy + update imports)
5. Update `src/export.tsx`, `src/App.tsx`, `src/main.tsx` to use new paths
6. Delete old files (`src/components/`, `src/hooks/`, `src/utils/`, `src/lib/`)
7. Run `pnpm lint --filter web-mfe-auth && pnpm check-types --filter web-mfe-auth`
8. Smoke test: `pnpm dev:auth` → verify sign-in, sign-up, magic link flows work

## Open Questions

_(None — the scope is well-defined and the migration is purely structural.)_
