## Context

The mobile app (`apps/mobile`) is an Expo 52 + React Native 0.76 application using expo-router for navigation. It already has a 4-layer structure (`domain/`, `application/`, `infrastructure/`, `presentation/`) but deviates from the patterns established in the web apps (`web-mfe-auth`, `web-host`).

Current state:
- **Auth** is managed by a React context (`AuthContext`) that calls `supabaseClient` directly, bypassing the repository/use-case chain.
- **Route screens** (`login.tsx`, `register.tsx`) instantiate `SupabaseAuthRepository` at module scope and call use cases inline.
- **`magic-link-callback.tsx`** imports `supabaseClient` directly to call `setSession`.
- **`UserMenu.tsx`** instantiates its own `SupabaseAuthRepository` and calls `signOut` directly.
- **`useTasks` / `useRoutines`** hooks call repository methods directly without going through use cases.
- No application DTOs exist.

The web apps provide the target patterns:
- `web-mfe-auth` uses a `useAuth` hook backed by `@tanstack/react-query` (query for user, mutations for auth operations, `onAuthStateChange` subscription for cache invalidation).
- `web-host` uses class-based use cases with constructor DI for task/routine operations, plus DTOs for serialization boundaries.

Constraint: The mobile environment requires `AppState` listeners for token auto-refresh (start on foreground, stop on background) — this must be preserved. expo-secure-store chunking for session persistence is handled at the `supabaseClient` level and is unaffected by this refactor.

## Goals / Non-Goals

**Goals:**
- Align the mobile auth hook with `web-mfe-auth`'s `@tanstack/react-query`-based pattern (query + mutations + auth state subscription).
- Remove `AuthContext`/`AuthProvider` in favor of the query-based hook.
- Eliminate all direct `supabaseClient` and repository instantiation from presentation/route layers.
- Add class-based use cases for `GetTasks` and `GetRoutines` (matching `web-host` patterns).
- Add application DTOs (`AuthInput.ts`, `TaskDTOs.ts`, `RoutineDTOs.ts`).
- Wire `useTasks`/`useRoutines` hooks through use cases.
- Ensure the project checklist items are addressed: _"Casos de uso implementados"_, _"Uso de interfaces/adapters"_, _"Domínio isolado da UI"_, _"Coerência cognitiva Web/Mobile"_, _"Separação de estado global"_.

**Non-Goals:**
- Adding new features (task CRUD, Pomodoro, checklist management) — this is purely structural refactoring.
- Changing the Supabase client configuration or secure-store adapter.
- Modifying domain entities, interfaces, or value objects (they are already correct).
- Refactoring `useAlertEngine` — it's a self-contained timer hook with no external dependencies.
- Changing the expo-router file-based routing structure.
- Replacing React Native `StyleSheet` with any other styling solution.

## Decisions

### 1. Replace AuthContext with query-based useAuth hook

**Decision**: Delete `AuthContext.tsx` and rewrite `useAuth.ts` to use `@tanstack/react-query` queries and mutations, exactly mirroring `web-mfe-auth/src/presentation/hooks/useAuth.ts`.

**Rationale**: The web `useAuth` pattern provides automatic cache invalidation, deduplication of concurrent auth checks, and a clean separation — the hook owns the repository instance and wires it through use cases. The context pattern creates a global provider dependency and calls supabaseClient directly.

**Alternatives considered**:
- _Keep the context but wire it through use cases_ — Adds complexity without consistency gain. Both web apps use the query pattern.
- _Use Zustand for auth state_ — Over-engineering; react-query already handles the caching and state needs.

**Mobile-specific adaptation**: The `AppState` foreground/background listener for `startAutoRefresh`/`stopAutoRefresh` will be placed inside a `useEffect` within the new `useAuth` hook, since it's auth-lifecycle-related. This replaces the context's `useEffect`.

### 2. Magic-link callback via auth repository, not raw supabaseClient

**Decision**: Add a `setSession(accessToken, refreshToken)` method to `IAuthRepository` and implement it in `SupabaseAuthRepository`. The callback screen will use `useAuth` + this new repository method instead of importing `supabaseClient` directly.

**Rationale**: Direct `supabaseClient` imports in presentation layer violate the architecture boundary. The repository already abstracts all other auth operations.

**Alternatives considered**:
- _Keep the direct import since it's a one-off_ — Breaks the pattern; callback handling is part of the auth domain.
- _Add a `handleMagicLinkCallback` use case_ — Appropriate since useAuth mutations should wrap use cases consistently.

### 3. Class-based use cases for GetTasks and GetRoutines

**Decision**: Create `GetTasks` and `GetRoutines` as class-based use cases with constructor DI (matching `web-host`'s `CreateTask`, `UpdateTask`, etc.).

```typescript
class GetTasks {
  constructor(private repository: ITaskRepository) {}
  async execute(): Promise<Task[]> { return this.repository.getTasks(); }
}
```

**Rationale**: Even though these are thin wrappers now, they establish the pattern for future CRUD operations (which are on the roadmap) and satisfy the checklist requirement _"Casos de uso implementados — use cases independentes e testáveis"_.

**Alternatives considered**:
- _Function-based use cases (like web-mfe-auth's auth use cases)_ — The auth use cases in both web apps use functions because auth is a cross-cutting concern with a different lifecycle. Domain-specific operations (tasks, routines) follow the class pattern in web-host. We stay consistent.

### 4. DTOs mirror web-host naming and structure

**Decision**: Create three DTO files:
- `application/dtos/AuthInput.ts` — matches `web-mfe-auth`
- `application/dtos/TaskDTOs.ts` — matches `web-host`
- `application/dtos/RoutineDTOs.ts` — matches `web-host`

**Rationale**: DTOs define the contract between application and presentation layers. Even when they currently mirror entities closely, they serve as the serialization boundary and make the architecture explicitly layered per the _"Uso de interfaces/adapters"_ checklist item.

### 5. Hook wiring pattern: repository → use case → hook

**Decision**: Each presentation hook (`useTasks`, `useRoutines`, `useAuth`) instantiates its repository and use case(s) at module scope (matching web-host's pattern), then uses react-query for state management.

```typescript
const repository = new SupabaseTaskRepository();
const getTasks = new GetTasks(repository);

export function useTasks() {
  return useQuery({ queryKey: ["tasks"], queryFn: () => getTasks.execute() });
}
```

**Rationale**: Module-scope instantiation avoids re-creating instances on every render. React-query handles caching, deduplication, and re-fetching. This is the exact pattern used in `web-host`.

### 6. Root layout simplification

**Decision**: Remove `AuthProvider` from `app/_layout.tsx`. The `QueryClientProvider` remains (it's already there). Auth state flows through `useAuth()` (react-query-backed), which any component can call.

**Rationale**: Eliminates one provider nesting level, reduces bundle of root layout, and aligns with how `web-host/src/main.tsx` works (QueryClientProvider at root, no AuthProvider).

## Risks / Trade-offs

**[Auth state race during refactor]** → The `onAuthStateChange` subscription must be established early. In the new hook, the subscription runs in a `useEffect` on first mount. Since `useAuth()` is called by the root index screen and both layout guards, the subscription will be active before any route renders. Risk is low.

**[AppState refresh logic loss]** → The `AppState` listener currently lives in `AuthContext`. Moving it to `useAuth` means it's tied to the hook's lifecycle rather than a permanent provider. Mitigation: The root `_layout.tsx` renders the index screen which immediately calls `useAuth()`, ensuring the hook mounts early and stays mounted for the app's lifetime.

**[Magic-link deep linking breakage]** → Adding `setSession` to `IAuthRepository` changes the interface. Mitigation: This is additive (new method), not a modification of existing signatures. The existing `getSession` method already exists.

**[Thin use cases seem like boilerplate]** → `GetTasks` and `GetRoutines` are pass-through wrappers today. Trade-off accepted: They satisfy the architecture checklist requirement and provide the hook point for future logic (filtering by routine, pagination, caching strategies).

**[Module-scope singletons in hooks]** → Repository and use-case instances are created at module scope, making them effectively singletons. This is the established pattern in both web apps. Risk: None for the current architecture since repositories are stateless. If stateful repositories are ever needed, DI containers would replace module-scope instantiation.
