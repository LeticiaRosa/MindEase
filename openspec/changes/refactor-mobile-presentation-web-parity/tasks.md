## 1. Dependencies and setup

- [x] 1.1 Install `react-native-gesture-handler` and `react-native-reanimated` as explicit dependencies in `apps/mobile/package.json` (already transitive via expo-router, but needed for direct imports)
- [x] 1.2 Install `react-native-draggable-flatlist` in `apps/mobile`
- [x] 1.3 Verify `babel.config.js` includes the `react-native-reanimated/plugin` (required for Reanimated)
- [x] 1.4 Run `pnpm install` from root and verify the app still builds with `pnpm check-types --filter @mindease/mobile`

## 2. Domain layer — extend interfaces and add DTOs

- [x] 2.1 Extend `ITaskRepository` in `src/domain/interfaces/ITaskRepository.ts` with: `getTasksByRoutine`, `createTask`, `updateTask`, `updateTaskStatus`, `deleteTask`, `reorderTasks`, `archiveTask`, `getArchivedTasks`, `restoreTask`, `addTaskTimeSpent`, `addChecklistStep`, `updateChecklistStep`, `deleteChecklistStep`, `toggleChecklistStep`
- [x] 2.2 Create `src/domain/interfaces/ITimerPreferencesRepository.ts` with `getPreferences(userId)` and `savePreferences(userId, prefs)` methods
- [x] 2.3 Extend `IRoutineRepository` in `src/domain/interfaces/IRoutineRepository.ts` with: `createRoutine`, `updateRoutine`, `deleteRoutine`, `reorderRoutines`
- [x] 2.4 Create `src/application/dtos/CreateTaskInput.ts` and `UpdateTaskInput.ts`
- [x] 2.5 Create `src/application/dtos/CreateRoutineInput.ts` and `UpdateRoutineInput.ts`
- [x] 2.6 Create `src/application/dtos/TimerPreferencesDTO.ts` with `focusDuration`, `breakDuration`, `longBreakDuration`, `totalCycles` fields and defaults
- [x] 2.7 Create `src/domain/entities/AlertPreferences.ts` with `AlertPreferences` interface and `DEFAULT_ALERT_PREFERENCES` constant (matching web-host's domain model)
- [x] 2.8 Create `src/domain/entities/BrainState.ts` with `BrainStateValue` type and the 5 state definitions (focado, cansado, sobrecarregado, ansioso, disperso) if not already present

## 3. Application layer — use cases

- [x] 3.1 Create `src/application/useCases/CreateTask.ts` — class-based use case with `ITaskRepository` DI
- [x] 3.2 Create `src/application/useCases/UpdateTask.ts` — class-based use case
- [x] 3.3 Create `src/application/useCases/UpdateTaskStatus.ts` — class-based use case
- [x] 3.4 Create `src/application/useCases/DeleteTask.ts` — class-based use case
- [x] 3.5 Create `src/application/useCases/ArchiveTask.ts` — class-based use case
- [x] 3.6 Create `src/application/useCases/RestoreTask.ts` — class-based use case
- [x] 3.7 Create `src/application/useCases/GetArchivedTasks.ts` — class-based use case
- [x] 3.8 Create `src/application/useCases/ReorderTasks.ts` — class-based use case
- [x] 3.9 Create `src/application/useCases/AddChecklistStep.ts` — class-based use case
- [x] 3.10 Create `src/application/useCases/UpdateChecklistStep.ts` — class-based use case
- [x] 3.11 Create `src/application/useCases/DeleteChecklistStep.ts` — class-based use case
- [x] 3.12 Create `src/application/useCases/ToggleChecklistStep.ts` — class-based use case
- [x] 3.13 Create `src/application/useCases/CreateRoutine.ts` — class-based use case
- [x] 3.14 Create `src/application/useCases/UpdateRoutine.ts` — class-based use case
- [x] 3.15 Create `src/application/useCases/DeleteRoutine.ts` — class-based use case
- [x] 3.16 Create `src/application/useCases/ReorderRoutines.ts` — class-based use case
- [x] 3.17 Create `src/application/useCases/SaveAlertPreferences.ts` — function-based use case accepting adapter + userId + preferences
- [x] 3.18 Create `src/application/useCases/LoadAlertPreferences.ts` — function-based use case accepting adapter + userId
- [x] 3.19 Create `src/application/useCases/RecordBrainState.ts` — function-based use case accepting `BrainStateValue` and writing to `AsyncStorage` with day key
- [x] 3.20 Create `src/application/useCases/AddTaskTimeSpent.ts` — class-based use case

## 4. Infrastructure layer — extend repository adapters

- [x] 4.1 Implement all new `ITaskRepository` methods in `SupabaseTaskRepository`: `getTasksByRoutine`, `createTask`, `updateTask`, `updateTaskStatus`, `deleteTask`, `reorderTasks`, `archiveTask`, `getArchivedTasks`, `restoreTask`, `addTaskTimeSpent`, `addChecklistStep`, `updateChecklistStep`, `deleteChecklistStep`, `toggleChecklistStep`
- [x] 4.2 Implement all new `IRoutineRepository` methods in `SupabaseRoutineRepository`: `createRoutine`, `updateRoutine`, `deleteRoutine`, `reorderRoutines`
- [x] 4.3 Create `src/infrastructure/adapters/SupabaseTimerPreferencesRepository.ts` implementing `ITimerPreferencesRepository`
- [x] 4.4 Create `src/infrastructure/adapters/AlertPreferencesAsyncStorageAdapter.ts` — reads/writes `mindease:alert-prefs:<userId>` from `AsyncStorage`, returns `DEFAULT_ALERT_PREFERENCES` on missing/corrupt
- [x] 4.5 Run `pnpm check-types --filter @mindease/mobile` to verify all interfaces, adapters, and use cases type-check

## 5. Theme preferences context

- [x] 5.1 Create `src/presentation/contexts/ThemePreferencesContext.tsx` with 6 dimensions (theme, fontSize, spacing, mode, helpers, complexity), `AsyncStorage` persistence under `mindease:theme-preferences`, `isHydrated` flag, and resolved token objects (`resolvedColors`, `resolvedFontSizes`, `resolvedSpacing`) from `@repo/ui/theme`
- [x] 5.2 Create `useTheme()` convenience hook exporting the context value
- [x] 5.3 Verify that `@repo/ui/theme` exports `darkColors`, `softColors`, `highContrastColors` alongside `colors`; add scaling logic for font size (sm/md/lg) and spacing (compact/default/relaxed) dimensions

## 6. Brain-today context

- [x] 6.1 Create `src/presentation/contexts/BrainTodayContext.tsx` — manages `BrainStateValue | null`, reads from `AsyncStorage` with day key `mindease:brain-today:<YYYY-MM-DD>` on mount, exposes `setBrainState(value)`, `brainState`, `hasAnsweredToday`, `isHydrated`
- [x] 6.2 Refactor `BrainTodayBottomSheet.tsx` to consume `useBrainToday()` context instead of managing its own `AsyncStorage` logic

## 7. Alert preferences context

- [x] 7.1 Create `src/presentation/contexts/AlertPreferencesContext.tsx` — loads per-user alert preferences via `LoadAlertPreferences` use case + `AlertPreferencesAsyncStorageAdapter`, re-hydrates on user change, exposes `preferences` and `savePreferences()` wrapper

## 8. Activity signals context

- [x] 8.1 Create `src/presentation/contexts/ActivitySignalsContext.tsx` — tracks `taskSwitchCount`, `timeOnCurrentTaskMs`, `lastInteractionMs`, `plannedTaskDurationMs`, `currentTaskIsComplex`; updates `timeOnCurrentTaskMs` every 60s; exposes `recordTaskSwitch()`, `setCurrentTask()`, `recordInteraction()`

## 9. Timer context

- [x] 9.1 Create `src/presentation/contexts/TimerContext.tsx` — port web-host's `useReducer`-based Pomodoro state machine with per-task timers, same actions (START, PAUSE, RESET, STOP, TICK, NEXT_MODE, SET_PREFERENCES, SYNC_PREFERENCES), same `TaskTimerState` shape
- [x] 9.2 Add `AppState` listener inside `TimerProvider` to clear `setInterval` on background and resume with elapsed-time correction on foreground

## 10. Active routine context

- [x] 10.1 Create `src/presentation/contexts/ActiveRoutineContext.tsx` — stores `activeRoutineId` in `AsyncStorage` under `mindease:activeRoutine:<userId>`, fetches userId from auth, exposes `activeRoutineId` / `setActiveRoutineId`, `isHydrated`

## 11. Layout wiring — context providers

- [x] 11.1 Update `app/_layout.tsx` to wrap `QueryClientProvider > ThemePreferencesProvider > Stack`
- [x] 11.2 Update `app/(app)/_layout.tsx` to wrap children with `BrainTodayProvider > AlertPreferencesProvider > ActivitySignalsProvider > Stack`; wait for `ThemePreferencesContext.isHydrated` before rendering
- [x] 11.3 Register new routes in `app/(app)/` Stack: `manage-routines`, `archived-tasks`, `cognitive-alert-config`

## 12. Auth screen decomposition

- [x] 12.1 Create `src/presentation/components/SignIn.tsx` — tab wrapper with "Senha" / "Link Mágico" tabs, rendering `SignInWithPassword` or `SignInWithMagicLink`
- [x] 12.2 Create `src/presentation/components/SignInWithPassword.tsx` — `react-hook-form` + `zodResolver(signInSchema)`, `Controller`-based, calls `useAuth().signIn`, shows inline errors, loading state
- [x] 12.3 Create `src/presentation/components/SignInWithMagicLink.tsx` — email form with success state (checkmark + instructions + resend), calls `useAuth().signInWithMagicLink`
- [x] 12.4 Create `src/presentation/components/SignUp.tsx` — 4 fields (fullName, email, password, confirmPassword), `react-hook-form` + `zodResolver(signUpSchema)`, calls `useAuth().signUp`
- [x] 12.5 Rewrite `app/(auth)/login.tsx` as thin wrapper rendering `<SignIn />`
- [x] 12.6 Rewrite `app/(auth)/register.tsx` as thin wrapper rendering `<SignUp />`
- [x] 12.7 Update auth components to use `useTheme()` resolved tokens instead of static `colors`/`spacing` imports
- [x] 12.8 Verify auth flow works end-to-end: password login, magic-link send, sign-up, navigation between login/register

## 13. Task management hook and components

- [x] 13.1 Create `src/presentation/hooks/useTaskKanban.ts` — fetches tasks by `activeRoutineId`, exposes mutations (createTask, updateTaskStatus, updateTask, deleteTask, archiveTask, reorderTasks) with optimistic updates + rollback, wires through use cases
- [x] 13.2 Create `src/presentation/components/TaskGroup.tsx` — collapsible section with title, count badge, task list, and inline `TaskCreateForm`; uses `Animated` for collapse/expand
- [x] 13.3 Create `src/presentation/components/TaskCreateForm.tsx` — inline text input for creating tasks, `react-hook-form` + `zod` validation
- [x] 13.4 Rewrite `src/presentation/components/TaskCard.tsx` — swipeable card (swipe right → advance status, swipe left → regress status), long-press → action sheet (edit, delete, archive, move), compact timer badge, checklist summary
- [x] 13.5 Create `src/presentation/components/TaskEditForm.tsx` — modal form with title and description fields, pre-filled, calls `updateTask` mutation
- [x] 13.6 Delete old `src/presentation/components/TaskStatusSection.tsx` (replaced by `TaskGroup`)

## 14. Smart checklist hook and components

- [x] 14.1 Create `src/presentation/hooks/useSmartChecklist.ts` — CRUD for checklist steps (toggle, create, delete, update) with optimistic updates; exposes `currentStep`, `remainingCount`, `allDone`, `completedCount`
- [x] 14.2 Create `src/presentation/components/SmartChecklist.tsx` — expandable checklist with step toggling, current-step highlight, add/edit/delete, summary/detail mode from `useTheme().mode`
- [x] 14.3 Create `src/presentation/components/AddStepForm.tsx` — inline text input for adding a new checklist step

## 15. Focus timer hook and components

- [x] 15.1 Create `src/presentation/hooks/useFocusTimer.ts` — wraps `TimerContext` for a specific `taskId`, auto-advance on completion, saves elapsed time on stop via `AddTaskTimeSpent` use case
- [x] 15.2 Create `src/presentation/hooks/useTimerPreferences.ts` — loads/saves timer preferences via `SupabaseTimerPreferencesRepository`
- [x] 15.3 Create `src/presentation/components/FocusTimer.tsx` — compact inline timer badge (mm:ss, mode label, small progress ring) rendered on active task card
- [x] 15.4 Create `src/presentation/components/FocusTimerFocus.tsx` — full-screen `Modal` overlay with large circular progress ring, controls (play/pause/reset/stop), task title, and `SmartChecklist` below
- [x] 15.5 Create `src/presentation/components/TimerPreferencesPanel.tsx` — sliders/steppers for focus/break/long-break durations and cycle count, used inside user menu bottom sheet

## 16. Routine management hook and screen

- [x] 16.1 Rewrite `src/presentation/hooks/useRoutines.ts` — full CRUD mutations (create, update, delete, reorder) with optimistic updates, default seeding ("Estudo"/"Trabalho") when user has none, active-routine fallback logic
- [x] 16.2 Create `src/presentation/components/Routine.tsx` — routine selector (horizontal pills or dropdown) for the dashboard, reads/writes `ActiveRoutineContext`
- [x] 16.3 Create `src/presentation/components/RoutineIcon.tsx` — icon registry mapping icon names to RN-compatible icons (same 12 icons as web-host)
- [x] 16.4 Create `src/presentation/components/IconPicker.tsx` — bottom sheet or modal with icon grid for routine creation/editing
- [x] 16.5 Create `app/(app)/manage-routines.tsx` — routine management screen with `DraggableFlatList` for reorder, swipe-to-delete, inline rename, icon picker, create button

## 17. User menu bottom sheet

- [x] 17.1 Create `src/presentation/components/UserMenuBottomSheet.tsx` — replaces `UserMenu.tsx`; sections: user info, timer preferences (collapsible), appearance settings (collapsible), navigation links (Gerenciar Kanbans, Alertas Cognitivos, Tarefas Arquivadas), sign out
- [x] 17.2 Create `src/presentation/components/AppearancePanel.tsx` — segmented controls for theme/fontSize/spacing, toggles for mode/helpers/complexity, consumes and writes to `ThemePreferencesContext`
- [x] 17.3 Delete old `src/presentation/components/UserMenu.tsx`

## 18. Archived tasks screen

- [x] 18.1 Create `src/presentation/hooks/useArchivedTasks.ts` — fetches via `GetArchivedTasks` use case, restore mutation via `RestoreTask` with optimistic update, query invalidation
- [x] 18.2 Create `app/(app)/archived-tasks.tsx` — screen with header (back arrow + title "Tarefas Arquivadas"), `FlatList` of archived task cards with "Restaurar" action (status picker), empty state

## 19. Cognitive alert engine upgrade

- [x] 19.1 Port `AlertEngineService` (or import from shared package if available) with `evaluate(trigger, brainState, preferences)` pure function and `alertMessages` lookup table
- [x] 19.2 Rewrite `src/presentation/hooks/useAlertEngine.ts` — integrate `ActivitySignalsContext`, `AlertPreferencesContext`, `BrainTodayContext`; 60-second tick with `AppState` pause/resume; 3 channels (banner, toast via `Alert.alert`, modal); per-trigger 15-minute cooldown
- [x] 19.3 Update `src/presentation/components/CognitiveAlertBanner.tsx` — add auto-clear after 30 seconds, consume theme tokens
- [x] 19.4 Create `src/presentation/components/CognitiveAlertModal.tsx` — non-blocking `Modal` with alert message and dismiss button

## 20. Cognitive alert configuration screen

- [x] 20.1 Create `app/(app)/cognitive-alert-config.tsx` — 3-step progressive disclosure form (Triggers → Tone → Intensity) with `react-hook-form` + `zod`, calls `SaveAlertPreferences` use case on submit, back navigation header

## 21. Dashboard rewrite

- [x] 21.1 Rewrite `app/(app)/dashboard.tsx` — wrap content in `TimerProvider > ActiveRoutineProvider`; render `DashboardHeader` (logo + alert banner + user menu trigger), `Routine` selector, three `TaskGroup` sections (TODO, IN_PROGRESS, DONE), `BrainTodayBottomSheet`, `CognitiveAlertModal`, full-screen `FocusTimerFocus` overlay
- [x] 21.2 Update `src/presentation/components/DashboardHeader.tsx` — replace `UserMenu` with `UserMenuBottomSheet` trigger, consume theme tokens
- [x] 21.3 Implement complexity toggle: hide timer badges, focus mode button, manage-routines link, and archived-tasks link when `complexity === "simple"`
- [x] 21.4 Delete old `src/presentation/components/ActiveRoutineStrip.tsx` (replaced by `Routine` selector)
- [x] 21.5 Ensure pull-to-refresh calls `refetchTasks()`, `refetchRoutines()`, and re-hydrates alert preferences in parallel

## 22. Theme migration for existing components

- [x] 22.1 Update `app/index.tsx` to use `useTheme().resolvedColors` instead of static `colors` import
- [x] 22.2 Update `app/(app)/_layout.tsx` and `app/(auth)/_layout.tsx` to use `useTheme().resolvedColors` for loading indicator
- [x] 22.3 Update `app/(auth)/magic-link-callback.tsx` to use theme tokens
- [x] 22.4 Audit all components under `src/presentation/components/` to confirm none directly import `colors`/`spacing`/`fontSizes` from `@repo/ui/theme` for rendering — all should use `useTheme()`

## 23. Verification

- [x] 23.1 Run `pnpm check-types --filter @mindease/mobile` and fix all TypeScript errors
- [x] 23.2 Run `pnpm lint --filter @mindease/mobile` and fix all ESLint violations
- [x] 23.3 Verify no file under `src/presentation/` or `app/` imports `supabaseClient` directly or instantiates repository classes outside of hooks
- [x] 23.4 Verify auth flow end-to-end: password login, magic-link send, sign-up, sign-out
- [x] 23.5 Verify task CRUD: create, edit, swipe status change, delete, archive from dashboard
- [x] 23.6 Verify checklist CRUD: expand, toggle step, add step, edit step, delete step
- [x] 23.7 Verify focus timer: start, pause, stop (with time persistence), auto-advance, AppState handling
- [x] 23.8 Verify routine management: create, rename, delete, reorder, icon change, active routine switch
- [x] 23.9 Verify theme system: switch theme/fontSize/spacing, confirm all components re-render with new tokens, persistence across restart
- [x] 23.10 Verify cognitive alerts: engine tick fires, banner/toast/modal channels work, config screen saves preferences
- [x] 23.11 Verify brain-today check-in: shows once per day, skip works, state available to engine
- [x] 23.12 Verify archived tasks: list displays, restore to specific status works
- [x] 23.13 Verify complexity toggle: simple hides timer/archive/manage-routines, complex shows all
