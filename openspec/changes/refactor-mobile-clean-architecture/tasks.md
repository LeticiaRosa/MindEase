## 1. Domain layer — extend IAuthRepository

- [ ] 1.1 Add `setSession(accessToken: string, refreshToken: string): Promise<AuthResult<User>>` to `IAuthRepository` interface in `src/domain/interfaces/IAuthRepository.ts`

## 2. Infrastructure layer — implement setSession

- [ ] 2.1 Implement `setSession` in `SupabaseAuthRepository` calling `supabaseClient.auth.setSession({ access_token, refresh_token })` and mapping result to `AuthResult<User>`

## 3. Application DTOs

- [ ] 3.1 Create `src/application/dtos/AuthInput.ts` with `SignInInput`, `SignUpInput`, and `MagicLinkInput` interfaces (matching `web-mfe-auth`)
- [ ] 3.2 Create `src/application/dtos/TaskDTOs.ts` with `TaskDTO` and `ChecklistStepDTO` interfaces (matching `web-host`)
- [ ] 3.3 Create `src/application/dtos/RoutineDTOs.ts` with `RoutineDTO` interface (matching `web-host`)

## 4. Application use cases

- [ ] 4.1 Create `src/application/useCases/GetTasks.ts` — class-based use case with `ITaskRepository` constructor DI and `execute()` method
- [ ] 4.2 Create `src/application/useCases/GetRoutines.ts` — class-based use case with `IRoutineRepository` constructor DI and `execute()` method
- [ ] 4.3 Create `src/application/useCases/handleMagicLinkCallback.ts` — function-based use case accepting `IAuthRepository`, `accessToken`, `refreshToken`, delegating to `repository.setSession()` with error handling

## 5. Rewrite useAuth hook (query-based)

- [ ] 5.1 Rewrite `src/presentation/hooks/useAuth.ts` to use `@tanstack/react-query` — `useQuery` for `getUser()`, `useMutation` for signIn/signUp/signOut/signInWithMagicLink/handleMagicLinkCallback, cache invalidation on auth state change via `onAuthStateChange` subscription
- [ ] 5.2 Add `AppState` foreground/background listener inside `useAuth` for `startAutoRefresh`/`stopAutoRefresh` (ported from `AuthContext`)
- [ ] 5.3 Expose aggregated `loading` boolean (user query loading OR any mutation pending)

## 6. Remove AuthContext and AuthProvider

- [ ] 6.1 Delete `src/presentation/contexts/AuthContext.tsx`
- [ ] 6.2 Update `app/_layout.tsx` — remove `AuthProvider` import and wrapper, keep `QueryClientProvider > Stack`

## 7. Refactor route screens to use useAuth

- [ ] 7.1 Refactor `app/(auth)/login.tsx` — remove `SupabaseAuthRepository` instantiation and direct use-case imports, use `useAuth().signIn()` and `useAuth().signInWithMagicLink()` instead
- [ ] 7.2 Refactor `app/(auth)/register.tsx` — remove `SupabaseAuthRepository` instantiation and direct use-case imports, use `useAuth().signUp()` instead
- [ ] 7.3 Refactor `app/(auth)/magic-link-callback.tsx` — remove direct `supabaseClient` import, use `useAuth()` hook to handle session establishment via `handleMagicLinkCallback` mutation

## 8. Refactor presentation components

- [ ] 8.1 Refactor `src/presentation/components/UserMenu.tsx` — remove `SupabaseAuthRepository` instantiation and `signOut` use-case import, use `useAuth().signOut()` instead

## 9. Wire hooks through use cases

- [ ] 9.1 Refactor `src/presentation/hooks/useTasks.ts` — instantiate `SupabaseTaskRepository` + `GetTasks` at module scope, wire `useQuery` queryFn through `getTasks.execute()`
- [ ] 9.2 Refactor `src/presentation/hooks/useRoutines.ts` — instantiate `SupabaseRoutineRepository` + `GetRoutines` at module scope, wire `useQuery` queryFn through `getRoutines.execute()`

## 10. Verification

- [ ] 10.1 Run `pnpm check-types --filter @mindease/mobile` and fix any TypeScript errors
- [ ] 10.2 Run `pnpm lint --filter @mindease/mobile` and fix any ESLint violations
- [ ] 10.3 Verify no file under `src/presentation/` or `app/` imports `supabaseClient` directly or instantiates repository classes outside of hooks
- [ ] 10.4 Verify auth flow works end-to-end: password login, sign-up, sign-out, magic-link request
