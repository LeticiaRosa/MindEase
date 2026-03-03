## Why

The mobile app (`apps/mobile`) shares the same Clean Architecture layers as the web apps, but its presentation layer is far behind: the dashboard is read-only (no task CRUD, no checklists, no timer), auth screens are monolithic 300+ line files instead of small composable components, and features like theme preferences, routine management, cognitive alert configuration, and archived tasks don't exist at all. Aligning the mobile presentation layer with `web-host` and `web-mfe-auth` closes this feature gap, gives users a consistent cross-platform experience, and makes future feature work a single change across both platforms instead of two.

## What Changes

- **Decompose auth screens**: Split `login.tsx` (371 lines) and `register.tsx` (289 lines) into small focused components mirroring `web-mfe-auth`'s pattern — `SignInWithPassword`, `SignInWithMagicLink`, `SignUp` — each with its own `react-hook-form` + `zod` form, plus a tabbed `SignIn` wrapper.
- **Add task CRUD + status management**: Replace the read-only `TaskStatusSection`/`TaskCard` with interactive components supporting create, edit, delete, status change (swipe or action menu — mobile-adapted equivalent of web's DnD Kanban), and archive.
- **Add smart checklists**: Implement per-task progressive-disclosure checklists matching `web-host`'s `SmartChecklist` — toggle steps, add/edit/delete steps, summary/detail modes.
- **Add focus timer (Pomodoro)**: Implement a per-task Pomodoro timer with focus/break/long-break modes, matching `web-host`'s `TimerContext` state machine, adapted for mobile (background timers via `expo-notifications` or `expo-task-manager`).
- **Add theme/appearance preferences**: Implement the 6-dimension theme system (colour theme, font size, spacing, mode, helpers, complexity) persisted via `AsyncStorage`, matching `web-host`'s `ThemePreferencesContext`.
- **Add routine management CRUD**: Replace the read-only `useRoutines` with full CRUD (create, rename, delete, reorder, icon selection) matching `web-host`'s `RoutineManagementPage` and `useRoutines` hook.
- **Enrich user menu**: Replace the minimal modal (email + sign out) with a full settings panel matching `web-host`'s `UserMenuDropdown` — user info, timer config, appearance controls, focus mode toggle, cognitive alert link.
- **Add archived tasks screen**: New screen listing archived tasks with restore capability, matching `web-host`'s `ArchivedTasksPage`.
- **Add cognitive alert configuration screen**: New screen with trigger/tone/intensity settings, matching `web-host`'s `CognitiveAlertConfigPage`.
- **Add context providers**: Introduce mobile equivalents of `web-host`'s 6 contexts (`ThemePreferences`, `BrainToday`, `AlertPreferences`, `ActivitySignals`, `Timer`, `ActiveRoutine`) using `AsyncStorage` instead of `localStorage`/`sessionStorage`.
- **Upgrade cognitive alert engine**: Replace the simple interval-based rotating messages with the full rule-based engine matching `web-host`'s `useAlertEngine` (triggers, channels, cooldown), adapted for mobile notification channels.
- **Redesign dashboard layout**: Restructure the dashboard to integrate all new features (routine selector, kanban-style task view, focus timer, alert engine, brain-today check-in) in a cohesive mobile-native layout.

## Capabilities

### New Capabilities

- `mobile-auth-presentation`: Decomposed auth screen components (SignIn tabs, SignInWithPassword, SignInWithMagicLink, SignUp) matching `web-mfe-auth`'s component architecture, adapted for React Native with `Controller`-based forms.
- `mobile-task-management`: Task CRUD (create, edit, delete, status change, archive) with optimistic mutations, swipe-based status transitions, and grouped task views — the mobile equivalent of `web-host`'s Kanban board.
- `mobile-smart-checklist`: Per-task progressive-disclosure checklists with toggle, add, edit, delete steps and summary/detail modes, adapted from `web-host`'s `SmartChecklist`.
- `mobile-focus-timer`: Pomodoro timer with focus/break/long-break state machine, per-task tracking, elapsed time persistence, and background timer support via Expo APIs.
- `mobile-theme-preferences`: 6-dimension appearance system (colour theme, font size, spacing, mode, helpers visibility, complexity) persisted to `AsyncStorage`, with a context provider and settings UI.
- `mobile-routine-management`: Routine CRUD (create, rename, delete, reorder, icon picker) with active-routine selection persisted to `AsyncStorage`, matching `web-host`'s routine features.
- `mobile-user-menu`: Rich user menu bottom sheet with user info, timer preferences, appearance controls, cognitive alert shortcut, and sign-out — matching `web-host`'s `UserMenuDropdown` adapted for mobile patterns.
- `mobile-archived-tasks`: Dedicated screen listing archived tasks with restore-to-status capability, matching `web-host`'s `ArchivedTasksPage`.
- `mobile-dashboard-layout`: Cohesive dashboard screen integrating routine selector, task management, focus timer, alert engine, and brain-today check-in with context provider wiring at the layout level.

### Modified Capabilities

- `brain-today-check-in`: Add mobile platform requirements — `AsyncStorage` with day-key persistence (instead of `sessionStorage`), React Native `Modal` or bottom sheet (instead of shadcn `Dialog`), same 5 cognitive states and skip behaviour.
- `cognitive-alert-engine`: Add mobile platform requirements — adapted dispatch channels (RN toast via `react-native-toast-message` or similar for moderado, RN `Modal` for ativo, inline banner for discreto), `AppState`-aware tick pausing on background.
- `cognitive-alert-config`: Add mobile platform requirements — `AsyncStorage` persistence (instead of `localStorage`), expo-router navigation (instead of React Router), React Native form controls (instead of shadcn form components).

## Impact

- **Code affected**: All files under `apps/mobile/app/` (route screens) and `apps/mobile/src/presentation/` (hooks, components, contexts). New files for contexts (~6), components (~15-20), hooks (~5-7), and screens (~3-4).
- **Deleted/replaced files**: Current `login.tsx`, `register.tsx`, `dashboard.tsx` route screens will be substantially rewritten. `TaskStatusSection.tsx`, `TaskCard.tsx`, `ActiveRoutineStrip.tsx` will be replaced with richer equivalents. `UserMenu.tsx` will be replaced with the enriched version.
- **New dependencies**: Potentially `react-native-gesture-handler` (swipe actions), `react-native-reanimated` (smooth transitions), `expo-notifications` or `expo-task-manager` (background timer), `react-native-toast-message` (toast channel). All must be Expo-compatible.
- **APIs**: No backend/API changes — all features use existing Supabase endpoints and the same repository/use-case stack already in the infrastructure layer.
- **Shared packages**: `@repo/ui/theme` token imports may need extensions for new theme dimensions. Domain entities and use cases from previous refactor (`refactor-mobile-clean-architecture`) are reused as-is; new use cases needed for task CRUD, checklist CRUD, routine CRUD, timer preferences, and archived tasks.
- **Risk**: Large surface area — auth flow, dashboard, and all new features touching the same layout tree. AppState/background timer handling needs careful testing on both iOS and Android. Optimistic mutations require thorough error-rollback coverage.
