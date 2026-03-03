## 1. Dependencies and setup

- [ ] 1.1 Install `react-native-gesture-handler` and `react-native-reanimated` as explicit dependencies in `apps/mobile/package.json` (already transitive via expo-router, but needed for direct imports)
- [ ] 1.2 Install `react-native-draggable-flatlist` in `apps/mobile`
- [ ] 1.3 Verify `babel.config.js` includes the `react-native-reanimated/plugin` (required for Reanimated)
- [ ] 1.4 Run `pnpm install` from root and verify the app still builds with `pnpm check-types --filter @mindease/mobile`

## 2. Domain layer — extend interfaces and add DTOs

- [ ] 2.1 Extend `ITaskRepository` in `src/domain/interfaces/ITaskRepository.ts` with: `getTasksByRoutine`, `createTask`, `updateTask`, `updateTaskStatus`, `deleteTask`, `reorderTasks`, `archiveTask`, `getArchivedTasks`, `restoreTask`, `addTaskTimeSpent`, `addChecklistStep`, `updateChecklistStep`, `deleteChecklistStep`, `toggleChecklistStep`
- [ ] 2.2 Create `src/domain/interfaces/ITimerPreferencesRepository.ts` with `getPreferences(userId)` and `savePreferences(userId, prefs)` methods
- [ ] 2.3 Extend `IRoutineRepository` in `src/domain/interfaces/IRoutineRepository.ts` with: `createRoutine`, `updateRoutine`, `deleteRoutine`, `reorderRoutines`
- [ ] 2.4 Create `src/application/dtos/CreateTaskInput.ts` and `UpdateTaskInput.ts`
- [ ] 2.5 Create `src/application/dtos/CreateRoutineInput.ts` and `UpdateRoutineInput.ts`
- [ ] 2.6 Create `src/application/dtos/TimerPreferencesDTO.ts` with `focusDuration`, `breakDuration`, `longBreakDuration`, `totalCycles` fields and defaults
- [ ] 2.7 Create `src/domain/entities/AlertPreferences.ts` with `AlertPreferences` interface and `DEFAULT_ALERT_PREFERENCES` constant (matching web-host's domain model)
- [ ] 2.8 Create `src/domain/entities/BrainState.ts` with `BrainStateValue` type and the 5 state definitions (focado, cansado, sobrecarregado, ansioso, disperso) if not already present

## 3. Application layer — use cases

- [ ] 3.1 Create `src/application/useCases/CreateTask.ts` — class-based use case with `ITaskRepository` DI
- [ ] 3.2 Create `src/application/useCases/UpdateTask.ts` — class-based use case
- [ ] 3.3 Create `src/application/useCases/UpdateTaskStatus.ts` — class-based use case
- [ ] 3.4 Create `src/application/useCases/DeleteTask.ts` — class-based use case
- [ ] 3.5 Create `src/application/useCases/ArchiveTask.ts` — class-based use case
- [ ] 3.6 Create `src/application/useCases/RestoreTask.ts` — class-based use case
- [ ] 3.7 Create `src/application/useCases/GetArchivedTasks.ts` — class-based use case
- [ ] 3.8 Create `src/application/useCases/ReorderTasks.ts` — class-based use case
- [ ] 3.9 Create `src/application/useCases/AddChecklistStep.ts` — class-based use case
- [ ] 3.10 Create `src/application/useCases/UpdateChecklistStep.ts` — class-based use case
- [ ] 3.11 Create `src/application/useCases/DeleteChecklistStep.ts` — class-based use case
- [ ] 3.12 Create `src/application/useCases/ToggleChecklistStep.ts` — class-based use case
- [ ] 3.13 Create `src/application/useCases/CreateRoutine.ts` — class-based use case
- [ ] 3.14 Create `src/application/useCases/UpdateRoutine.ts` — class-based use case
- [ ] 3.15 Create `src/application/useCases/DeleteRoutine.ts` — class-based use case
- [ ] 3.16 Create `src/application/useCases/ReorderRoutines.ts` — class-based use case
- [ ] 3.17 Create `src/application/useCases/SaveAlertPreferences.ts` — function-based use case accepting adapter + userId + preferences
- [ ] 3.18 Create `src/application/useCases/LoadAlertPreferences.ts` — function-based use case accepting adapter + userId
- [ ] 3.19 Create `src/application/useCases/RecordBrainState.ts` — function-based use case accepting `BrainStateValue` and writing to `AsyncStorage` with day key
- [ ] 3.20 Create `src/application/useCases/AddTaskTimeSpent.ts` — class-based use case

## 4. Infrastructure layer — extend repository adapters

- [ ] 4.1 Implement all new `ITaskRepository` methods in `SupabaseTaskRepository`: `getTasksByRoutine`, `createTask`, `updateTask`, `updateTaskStatus`, `deleteTask`, `reorderTasks`, `archiveTask`, `getArchivedTasks`, `restoreTask`, `addTaskTimeSpent`, `addChecklistStep`, `updateChecklistStep`, `deleteChecklistStep`, `toggleChecklistStep`
- [ ] 4.2 Implement all new `IRoutineRepository` methods in `SupabaseRoutineRepository`: `createRoutine`, `updateRoutine`, `deleteRoutine`, `reorderRoutines`
- [ ] 4.3 Create `src/infrastructure/adapters/SupabaseTimerPreferencesRepository.ts` implementing `ITimerPreferencesRepository`
- [ ] 4.4 Create `src/infrastructure/adapters/AlertPreferencesAsyncStorageAdapter.ts` — reads/writes `mindease:alert-prefs:<userId>` from `AsyncStorage`, returns `DEFAULT_ALERT_PREFERENCES` on missing/corrupt
- [ ] 4.5 Run `pnpm check-types --filter @mindease/mobile` to verify all interfaces, adapters, and use cases type-check

## 5. Theme preferences context

- [ ] 5.1 Create `src/presentation/contexts/ThemePreferencesContext.tsx` with 6 dimensions (theme, fontSize, spacing, mode, helpers, complexity), `AsyncStorage` persistence under `mindease:theme-preferences`, `isHydrated` flag, and resolved token objects (`resolvedColors`, `resolvedFontSizes`, `resolvedSpacing`) from `@repo/ui/theme`
- [ ] 5.2 Create `useTheme()` convenience hook exporting the context value
- [ ] 5.3 Verify that `@repo/ui/theme` exports `darkColors`, `softColors`, `highContrastColors` alongside `colors`; add scaling logic for font size (sm/md/lg) and spacing (compact/default/relaxed) dimensions

## 6. Brain-today context

- [ ] 6.1 Create `src/presentation/contexts/BrainTodayContext.tsx` — manages `BrainStateValue | null`, reads from `AsyncStorage` with day key `mindease:brain-today:<YYYY-MM-DD>` on mount, exposes `setBrainState(value)`, `brainState`, `hasAnsweredToday`, `isHydrated`
- [ ] 6.2 Refactor `BrainTodayBottomSheet.tsx` to consume `useBrainToday()` context instead of managing its own `AsyncStorage` logic

## 7. Alert preferences context

- [ ] 7.1 Create `src/presentation/contexts/AlertPreferencesContext.tsx` — loads per-user alert preferences via `LoadAlertPreferences` use case + `AlertPreferencesAsyncStorageAdapter`, re-hydrates on user change, exposes `preferences` and `savePreferences()` wrapper

## 8. Activity signals context

- [ ] 8.1 Create `src/presentation/contexts/ActivitySignalsContext.tsx` — tracks `taskSwitchCount`, `timeOnCurrentTaskMs`, `lastInteractionMs`, `plannedTaskDurationMs`, `currentTaskIsComplex`; updates `timeOnCurrentTaskMs` every 60s; exposes `recordTaskSwitch()`, `setCurrentTask()`, `recordInteraction()`

## 9. Timer context

- [ ] 9.1 Create `src/presentation/contexts/TimerContext.tsx` — port web-host's `useReducer`-based Pomodoro state machine with per-task timers, same actions (START, PAUSE, RESET, STOP, TICK, NEXT_MODE, SET_PREFERENCES, SYNC_PREFERENCES), same `TaskTimerState` shape
- [ ] 9.2 Add `AppState` listener inside `TimerProvider` to clear `setInterval` on background and resume with elapsed-time correction on foreground

## 10. Active routine context

- [ ] 10.1 Create `src/presentation/contexts/ActiveRoutineContext.tsx` — stores `activeRoutineId` in `AsyncStorage` under `mindease:activeRoutine:<userId>`, fetches userId from auth, exposes `activeRoutineId` / `setActiveRoutineId`, `isHydrated`

## 11. Layout wiring — context providers

- [ ] 11.1 Update `app/_layout.tsx` to wrap `QueryClientProvider > ThemePreferencesProvider > Stack`
- [ ] 11.2 Update `app/(app)/_layout.tsx` to wrap children with `BrainTodayProvider > AlertPreferencesProvider > ActivitySignalsProvider > Stack`; wait for `ThemePreferencesContext.isHydrated` before rendering
- [ ] 11.3 Register new routes in `app/(app)/` Stack: `manage-routines`, `archived-tasks`, `cognitive-alert-config`

## 12. Auth screen decomposition

- [ ] 12.1 Create `src/presentation/components/SignIn.tsx` — tab wrapper with "Senha" / "Link Mágico" tabs, rendering `SignInWithPassword` or `SignInWithMagicLink`
- [ ] 12.2 Create `src/presentation/components/SignInWithPassword.tsx` — `react-hook-form` + `zodResolver(signInSchema)`, `Controller`-based, calls `useAuth().signIn`, shows inline errors, loading state
- [ ] 12.3 Create `src/presentation/components/SignInWithMagicLink.tsx` — email form with success state (checkmark + instructions + resend), calls `useAuth().signInWithMagicLink`
- [ ] 12.4 Create `src/presentation/components/SignUp.tsx` — 4 fields (fullName, email, password, confirmPassword), `react-hook-form` + `zodResolver(signUpSchema)`, calls `useAuth().signUp`
- [ ] 12.5 Rewrite `app/(auth)/login.tsx` as thin wrapper rendering `<SignIn />`
- [ ] 12.6 Rewrite `app/(auth)/register.tsx` as thin wrapper rendering `<SignUp />`
- [ ] 12.7 Update auth components to use `useTheme()` resolved tokens instead of static `colors`/`spacing` imports
- [ ] 12.8 Verify auth flow works end-to-end: password login, magic-link send, sign-up, navigation between login/register

## 13. Task management hook and components

- [ ] 13.1 Create `src/presentation/hooks/useTaskKanban.ts` — fetches tasks by `activeRoutineId`, exposes mutations (createTask, updateTaskStatus, updateTask, deleteTask, archiveTask, reorderTasks) with optimistic updates + rollback, wires through use cases
- [ ] 13.2 Create `src/presentation/components/TaskGroup.tsx` — collapsible section with title, count badge, task list, and inline `TaskCreateForm`; uses `Animated` for collapse/expand
- [ ] 13.3 Create `src/presentation/components/TaskCreateForm.tsx` — inline text input for creating tasks, `react-hook-form` + `zod` validation
- [ ] 13.4 Rewrite `src/presentation/components/TaskCard.tsx` — swipeable card (swipe right → advance status, swipe left → regress status), long-press → action sheet (edit, delete, archive, move), compact timer badge, checklist summary
- [ ] 13.5 Create `src/presentation/components/TaskEditForm.tsx` — modal form with title and description fields, pre-filled, calls `updateTask` mutation
- [ ] 13.6 Delete old `src/presentation/components/TaskStatusSection.tsx` (replaced by `TaskGroup`)

## 14. Smart checklist hook and components

- [ ] 14.1 Create `src/presentation/hooks/useSmartChecklist.ts` — CRUD for checklist steps (toggle, create, delete, update) with optimistic updates; exposes `currentStep`, `remainingCount`, `allDone`, `completedCount`
- [ ] 14.2 Create `src/presentation/components/SmartChecklist.tsx` — expandable checklist with step toggling, current-step highlight, add/edit/delete, summary/detail mode from `useTheme().mode`
- [ ] 14.3 Create `src/presentation/components/AddStepForm.tsx` — inline text input for adding a new checklist step

## 15. Focus timer hook and components

- [ ] 15.1 Create `src/presentation/hooks/useFocusTimer.ts` — wraps `TimerContext` for a specific `taskId`, auto-advance on completion, saves elapsed time on stop via `AddTaskTimeSpent` use case
- [ ] 15.2 Create `src/presentation/hooks/useTimerPreferences.ts` — loads/saves timer preferences via `SupabaseTimerPreferencesRepository`
- [ ] 15.3 Create `src/presentation/components/FocusTimer.tsx` — compact inline timer badge (mm:ss, mode label, small progress ring) rendered on active task card
- [ ] 15.4 Create `src/presentation/components/FocusTimerFocus.tsx` — full-screen `Modal` overlay with large circular progress ring, controls (play/pause/reset/stop), task title, and `SmartChecklist` below
- [ ] 15.5 Create `src/presentation/components/TimerPreferencesPanel.tsx` — sliders/steppers for focus/break/long-break durations and cycle count, used inside user menu bottom sheet

## 16. Routine management hook and screen

- [ ] 16.1 Rewrite `src/presentation/hooks/useRoutines.ts` — full CRUD mutations (create, update, delete, reorder) with optimistic updates, default seeding ("Estudo"/"Trabalho") when user has none, active-routine fallback logic
- [ ] 16.2 Create `src/presentation/components/Routine.tsx` — routine selector (horizontal pills or dropdown) for the dashboard, reads/writes `ActiveRoutineContext`
- [ ] 16.3 Create `src/presentation/components/RoutineIcon.tsx` — icon registry mapping icon names to RN-compatible icons (same 12 icons as web-host)
- [ ] 16.4 Create `src/presentation/components/IconPicker.tsx` — bottom sheet or modal with icon grid for routine creation/editing
- [ ] 16.5 Create `app/(app)/manage-routines.tsx` — routine management screen with `DraggableFlatList` for reorder, swipe-to-delete, inline rename, icon picker, create button

## 17. User menu bottom sheet

- [ ] 17.1 Create `src/presentation/components/UserMenuBottomSheet.tsx` — replaces `UserMenu.tsx`; sections: user info, timer preferences (collapsible), appearance settings (collapsible), navigation links (Gerenciar Kanbans, Alertas Cognitivos, Tarefas Arquivadas), sign out
- [ ] 17.2 Create `src/presentation/components/AppearancePanel.tsx` — segmented controls for theme/fontSize/spacing, toggles for mode/helpers/complexity, consumes and writes to `ThemePreferencesContext`
- [ ] 17.3 Delete old `src/presentation/components/UserMenu.tsx`

## 18. Archived tasks screen

- [ ] 18.1 Create `src/presentation/hooks/useArchivedTasks.ts` — fetches via `GetArchivedTasks` use case, restore mutation via `RestoreTask` with optimistic update, query invalidation
- [ ] 18.2 Create `app/(app)/archived-tasks.tsx` — screen with header (back arrow + title "Tarefas Arquivadas"), `FlatList` of archived task cards with "Restaurar" action (status picker), empty state

## 19. Cognitive alert engine upgrade

- [ ] 19.1 Port `AlertEngineService` (or import from shared package if available) with `evaluate(trigger, brainState, preferences)` pure function and `alertMessages` lookup table
- [ ] 19.2 Rewrite `src/presentation/hooks/useAlertEngine.ts` — integrate `ActivitySignalsContext`, `AlertPreferencesContext`, `BrainTodayContext`; 60-second tick with `AppState` pause/resume; 3 channels (banner, toast via `Alert.alert`, modal); per-trigger 15-minute cooldown
- [ ] 19.3 Update `src/presentation/components/CognitiveAlertBanner.tsx` — add auto-clear after 30 seconds, consume theme tokens
- [ ] 19.4 Create `src/presentation/components/CognitiveAlertModal.tsx` — non-blocking `Modal` with alert message and dismiss button

## 20. Cognitive alert configuration screen

- [ ] 20.1 Create `app/(app)/cognitive-alert-config.tsx` — 3-step progressive disclosure form (Triggers → Tone → Intensity) with `react-hook-form` + `zod`, calls `SaveAlertPreferences` use case on submit, back navigation header

## 21. Dashboard rewrite

- [ ] 21.1 Rewrite `app/(app)/dashboard.tsx` — wrap content in `TimerProvider > ActiveRoutineProvider`; render `DashboardHeader` (logo + alert banner + user menu trigger), `Routine` selector, three `TaskGroup` sections (TODO, IN_PROGRESS, DONE), `BrainTodayBottomSheet`, `CognitiveAlertModal`, full-screen `FocusTimerFocus` overlay
- [ ] 21.2 Update `src/presentation/components/DashboardHeader.tsx` — replace `UserMenu` with `UserMenuBottomSheet` trigger, consume theme tokens
- [ ] 21.3 Implement complexity toggle: hide timer badges, focus mode button, manage-routines link, and archived-tasks link when `complexity === "simple"`
- [ ] 21.4 Delete old `src/presentation/components/ActiveRoutineStrip.tsx` (replaced by `Routine` selector)
- [ ] 21.5 Ensure pull-to-refresh calls `refetchTasks()`, `refetchRoutines()`, and re-hydrates alert preferences in parallel

## 22. Theme migration for existing components

- [ ] 22.1 Update `app/index.tsx` to use `useTheme().resolvedColors` instead of static `colors` import
- [ ] 22.2 Update `app/(app)/_layout.tsx` and `app/(auth)/_layout.tsx` to use `useTheme().resolvedColors` for loading indicator
- [ ] 22.3 Update `app/(auth)/magic-link-callback.tsx` to use theme tokens
- [ ] 22.4 Audit all components under `src/presentation/components/` to confirm none directly import `colors`/`spacing`/`fontSizes` from `@repo/ui/theme` for rendering — all should use `useTheme()`

## 23. Verification

- [ ] 23.1 Run `pnpm check-types --filter @mindease/mobile` and fix all TypeScript errors
- [ ] 23.2 Run `pnpm lint --filter @mindease/mobile` and fix all ESLint violations
- [ ] 23.3 Verify no file under `src/presentation/` or `app/` imports `supabaseClient` directly or instantiates repository classes outside of hooks
- [ ] 23.4 Verify auth flow end-to-end: password login, magic-link send, sign-up, sign-out
- [ ] 23.5 Verify task CRUD: create, edit, swipe status change, delete, archive from dashboard
- [ ] 23.6 Verify checklist CRUD: expand, toggle step, add step, edit step, delete step
- [ ] 23.7 Verify focus timer: start, pause, stop (with time persistence), auto-advance, AppState handling
- [ ] 23.8 Verify routine management: create, rename, delete, reorder, icon change, active routine switch
- [ ] 23.9 Verify theme system: switch theme/fontSize/spacing, confirm all components re-render with new tokens, persistence across restart
- [ ] 23.10 Verify cognitive alerts: engine tick fires, banner/toast/modal channels work, config screen saves preferences
- [ ] 23.11 Verify brain-today check-in: shows once per day, skip works, state available to engine
- [ ] 23.12 Verify archived tasks: list displays, restore to specific status works
- [ ] 23.13 Verify complexity toggle: simple hides timer/archive/manage-routines, complex shows all
