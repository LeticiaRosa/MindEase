## 1. Dependencies & Configuration

- [ ] 1.1 Add `@supabase/supabase-js`, `expo-secure-store`, `expo-linking`, `@tanstack/react-query`, `react-hook-form`, `@hookform/resolvers`, `zod`, and `expo-constants` to `apps/mobile/package.json`
- [ ] 1.2 Run `pnpm install --filter @mindease/mobile` to hoist new packages
- [ ] 1.3 Register `scheme: "mindease"` in `apps/mobile/app.json` under the `expo` key
- [ ] 1.4 Add `apps/mobile/.env.example` with `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY` placeholders
- [ ] 1.5 Verify `apps/mobile/.env` has both env vars populated (do not commit values)

## 2. Domain Layer

- [ ] 2.1 Create `apps/mobile/src/domain/entities/User.ts` (match `web-mfe-auth` shape)
- [ ] 2.2 Create `apps/mobile/src/domain/entities/AuthResult.ts` (generic `AuthResult<T>`)
- [ ] 2.3 Create `apps/mobile/src/domain/interfaces/IAuthRepository.ts` with `signIn`, `signUp`, `signOut`, `signInWithMagicLink`, `getUser`, `getSession`, `trackMagicLinkRequest`, and `onAuthStateChange`
- [ ] 2.4 Create `apps/mobile/src/domain/valueObjects/authSchemas.ts` with `zod` schemas for `signInSchema` (email + password ≥ 8 chars) and `signUpSchema` (email + password + optional fullName)
- [ ] 2.5 Create `apps/mobile/src/domain/entities/Task.ts` (id, title, status, checklistSteps)
- [ ] 2.6 Create `apps/mobile/src/domain/entities/Routine.ts` (id, name, steps, isActive)
- [ ] 2.7 Create `apps/mobile/src/domain/interfaces/ITaskRepository.ts` with `getTasks(): Promise<Task[]>`
- [ ] 2.8 Create `apps/mobile/src/domain/interfaces/IRoutineRepository.ts` with `getRoutines(): Promise<Routine[]>`

## 3. Infrastructure Layer

- [ ] 3.1 Create `apps/mobile/src/infrastructure/api/clients/supabaseClient.ts` — initialise Supabase with `createClient` using `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, passing a SecureStore-backed storage adapter
- [ ] 3.2 Create the SecureStore adapter object (`getItem`, `setItem`, `removeItem`) wrapping `expo-secure-store` APIs
- [ ] 3.3 Create `apps/mobile/src/infrastructure/adapters/SupabaseAuthRepository.ts` implementing `IAuthRepository` (mirror `web-mfe-auth`'s adapter, adapting imports for React Native)
- [ ] 3.4 Implement `trackMagicLinkRequest` in `SupabaseAuthRepository` as a no-op (delegated to Supabase rate-limiting)
- [ ] 3.5 Create `apps/mobile/src/infrastructure/adapters/SupabaseTaskRepository.ts` implementing `ITaskRepository.getTasks()` via a Supabase query
- [ ] 3.6 Create `apps/mobile/src/infrastructure/adapters/SupabaseRoutineRepository.ts` implementing `IRoutineRepository.getRoutines()` via a Supabase query

## 4. Application Layer

- [ ] 4.1 Create `apps/mobile/src/application/useCases/signIn.ts` (same shape as `web-mfe-auth`)
- [ ] 4.2 Create `apps/mobile/src/application/useCases/signUp.ts`
- [ ] 4.3 Create `apps/mobile/src/application/useCases/signOut.ts`
- [ ] 4.4 Create `apps/mobile/src/application/useCases/signInWithMagicLink.ts`

## 5. Presentation — Auth Context & Hook

- [ ] 5.1 Create `apps/mobile/src/presentation/contexts/AuthContext.tsx` — subscribe to `supabaseClient.auth.onAuthStateChange`, expose `{ user, session, isLoading }` via context
- [ ] 5.2 Create `apps/mobile/src/presentation/hooks/useAuth.ts` — thin `useContext(AuthContext)` wrapper
- [ ] 5.3 Add `AppState` active-event listener in `AuthContext` that calls `supabase.auth.startAutoRefresh()` / `stopAutoRefresh()` to handle background token refresh

## 6. Presentation — Root Layout & Providers

- [ ] 6.1 Rewrite `apps/mobile/app/_layout.tsx` to wrap children in `QueryClientProvider` (TanStack Query) and `AuthProvider`
- [ ] 6.2 Add `Stack` navigator with two groups: `(auth)` and `(app)`
- [ ] 6.3 Remove the static placeholder from `apps/mobile/app/index.tsx` and replace it with a redirect to `/(auth)/login` (or `/(app)/dashboard` if session exists)

## 7. Presentation — Auth Group Routing & Screens

- [ ] 7.1 Create `apps/mobile/app/(auth)/_layout.tsx` — if `user` is non-null, redirect to `/(app)/dashboard`
- [ ] 7.2 Create `apps/mobile/app/(auth)/login.tsx` — `LoginScreen` with email/password fields using `react-hook-form` + `signInSchema` zod validation; calls `signIn` use-case on submit; navigates to `/(app)/dashboard` on success; shows inline error on failure
- [ ] 7.3 Add "Entrar com link mágico" option to `LoginScreen` that switches to a magic-link email field
- [ ] 7.4 Create `apps/mobile/app/(auth)/register.tsx` — `RegisterScreen` with email, password, and optional fullName fields; `react-hook-form` + `signUpSchema`; calls `signUp` use-case; navigates to `/(app)/dashboard` on success
- [ ] 7.5 Create `apps/mobile/app/(auth)/magic-link-callback.tsx` — on mount, reads `Linking.getInitialURL()` and listens to `Linking.addEventListener`; extracts `access_token` and `refresh_token`; calls `supabase.auth.setSession()`; navigates to `/(app)/dashboard` on success or shows error with back link on failure
- [ ] 7.6 Verify LoginScreen and RegisterScreen use `fontSizes.base` minimum and `spacing.md` padding from `@repo/ui/theme`
- [ ] 7.7 Verify all form error messages appear inline below each field (no alert dialogs)

## 8. Presentation — App Group Routing & Dashboard Screen

- [ ] 8.1 Create `apps/mobile/app/(app)/_layout.tsx` — if `user` is null (and not loading), redirect to `/(auth)/login`
- [ ] 8.2 Create `apps/mobile/src/presentation/hooks/useTasks.ts` — `useQuery` wrapping `SupabaseTaskRepository.getTasks()`
- [ ] 8.3 Create `apps/mobile/src/presentation/hooks/useRoutines.ts` — `useQuery` wrapping `SupabaseRoutineRepository.getRoutines()`
- [ ] 8.4 Create `apps/mobile/src/presentation/components/TaskStatusSection.tsx` — renders a labelled group of task cards for one status; shows empty-state message when no tasks
- [ ] 8.5 Create `apps/mobile/src/presentation/components/TaskCard.tsx` — displays task title and checklist progress (`x/y` steps); minimum `fontSizes.base`, `spacing.md` padding
- [ ] 8.6 Create `apps/mobile/src/presentation/components/ActiveRoutineStrip.tsx` — horizontally scrollable strip of routine steps; highlights the current step; hidden when no active routine
- [ ] 8.7 Create `apps/mobile/src/presentation/components/CognitiveAlertBanner.tsx` — dismissible full-width banner using React Native `View` + `Text`; no animations
- [ ] 8.8 Create `apps/mobile/src/presentation/components/BrainTodayBottomSheet.tsx` — modal bottom sheet with five cognitive-state options; persists selection to AsyncStorage under `mindease:brain-state` with a `YYYY-MM-DD` date key; skippable with "Pular por hoje"
- [ ] 8.9 Create `apps/mobile/src/presentation/components/UserMenu.tsx` — simple dropdown/action-sheet showing user email and a "Sair" option that calls `signOut` use-case
- [ ] 8.10 Create `apps/mobile/src/presentation/components/DashboardHeader.tsx` — sticky header with MindEase logo, `UserMenu`, and optional `CognitiveAlertBanner`
- [ ] 8.11 Create `apps/mobile/app/(app)/dashboard.tsx` — `DashboardScreen` composing `DashboardHeader`, `BrainTodayBottomSheet` (shown on first daily visit), `ActiveRoutineStrip`, and `TaskStatusSection` × 3 inside a `ScrollView`
- [ ] 8.12 Verify Dashboard renders sections in order: header → routine strip (if active) → "A fazer" → "Em andamento" → "Concluído"

## 9. Quality & Lint

- [ ] 9.1 Run `pnpm check-types --filter @mindease/mobile` and fix all TypeScript errors
- [ ] 9.2 Run `pnpm lint --filter @mindease/mobile` and fix all ESLint errors
- [ ] 9.3 Confirm no `any` types introduced (use proper generics or `unknown`)
- [ ] 9.4 Confirm all interactive elements in auth screens have an accessible `accessibilityLabel`
- [ ] 9.5 Update `AGENTS.md` environment variables section to mention `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY` for the mobile app
