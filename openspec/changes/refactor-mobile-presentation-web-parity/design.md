## Context

The mobile app (`apps/mobile`) shares the same 4-layer Clean Architecture as the web apps (domain → application → infrastructure → presentation), the same Supabase backend, and the same `@repo/ui/theme` tokens. However its presentation layer is substantially behind: a read-only dashboard, monolithic auth screens, zero context providers, a trivial alert engine, and no task CRUD, checklists, timer, theme, routine management, or archived-tasks features.

The web host (`apps/web-host`) has 6 context providers, 7 hooks with full optimistic CRUD, 19 components including a DnD Kanban, Pomodoro timer, smart checklists, and a 6-dimension theme system. The auth MFE (`apps/web-mfe-auth`) decomposes auth into small focused components (SignIn tabs, SignInWithPassword, SignInWithMagicLink, SignUp) with `react-hook-form` + `zod` + toast feedback.

This design covers how the mobile presentation layer should be restructured to reach functional parity with web, adapted for React Native constraints (no CSS, no DnD-kit, no localStorage/sessionStorage, no DOM).

## Goals / Non-Goals

**Goals:**

- Reach **feature parity** with `web-host`'s presentation layer for: task CRUD, smart checklists, focus timer, theme/appearance, routine management, archived tasks, cognitive alert engine + config, brain-today check-in, and enriched user menu.
- Decompose auth screens into small focused components matching `web-mfe-auth`'s architecture.
- Introduce the same 6 context providers as web-host, adapted for mobile storage (`AsyncStorage` instead of `localStorage`/`sessionStorage`).
- Maintain identical Clean Architecture wiring: hooks → use cases → repositories → Supabase.
- Extend domain interfaces (`ITaskRepository`, `IRoutineRepository`) to match web-host's capabilities (CRUD, reorder, archive, checklist CRUD, time tracking).
- Keep the shared `@repo/ui/theme` token system as the single source of truth for colours, spacing, and font sizes across platforms.

**Non-Goals:**

- **Drag-and-drop Kanban**: Mobile will use swipe actions and action menus for status transitions instead of `@dnd-kit`. A Kanban-style visual layout is not a goal — grouped sections with swipe/reorder are preferred.
- **Module Federation**: Mobile is a standalone Expo app, not a micro-frontend.
- **Pixel-perfect web clone**: Components are adapted for React Native patterns (Modals → bottom sheets, DropdownMenu → action sheets, shadcn Cards → RN `View` + theme tokens).
- **Offline-first architecture**: Optimistic mutations with rollback match web, but full offline queue/sync is out of scope.
- **Background timer notifications**: The Pomodoro timer will work in foreground only for this change. `expo-notifications` local alerts for timer completion are a nice-to-have, not required.
- **Tests**: Test creation is tracked in the implementation tasks but is not part of this design document.

## Decisions

### 1. Auth screen decomposition — tabbed components pattern

**Decision**: Split `login.tsx` into `SignIn.tsx` (tab wrapper), `SignInWithPassword.tsx`, and `SignInWithMagicLink.tsx`. Split `register.tsx` into `SignUp.tsx`. Route files become thin wrappers.

**Rationale**: Mirrors `web-mfe-auth`'s exact component tree. Each form component manages its own `useForm` + `zod` resolver, making them independently testable. The route file (`login.tsx`) just renders `<SignIn />`, keeping expo-router conventions clean.

**Alternative considered**: Keeping a single component with conditional rendering (current approach) — rejected because it produces 370+ line files mixing two distinct flows with separate validation schemas.

### 2. Task status management — swipe actions + long-press menu instead of DnD

**Decision**: Use `react-native-gesture-handler` `Swipeable` for quick status transitions (swipe right → advance to next status, swipe left → go back) and a long-press context menu for full actions (edit, delete, archive, move to specific status).

**Rationale**: DnD between columns is not ergonomic on mobile. Swipe is the native mobile idiom (Mail, Reminders, Todoist all use it). Long-press reveals the full action set without cluttering the card.

**Alternative considered**: `react-native-draggable-flatlist` for reorder within a status group — this is still appropriate for **reorder** (position change within same status) and will be used there, just not for status transitions.

### 3. Dashboard layout — grouped sections with collapsible headers instead of Kanban columns

**Decision**: Keep the vertical `ScrollView` layout with `RefreshControl`, but replace dumb `TaskStatusSection` blocks with interactive `TaskGroup` sections (collapsible, with count badge, create-inline form at top). Active routine selector sits above the task groups.

**Rationale**: Three side-by-side Kanban columns don't fit mobile viewport widths. Vertical grouped sections are the standard mobile pattern (Apple Reminders, Google Tasks). Collapsible sections reduce cognitive overload.

**Alternative considered**: Horizontal tab navigation between status groups — rejected because it hides task counts and breaks the "see everything at a glance" principle of the web Kanban.

### 4. Context providers — same 6 contexts adapted for AsyncStorage

**Decision**: Create mobile equivalents of all 6 web-host contexts:

| Context                   | Web storage              | Mobile storage              | Notes                                                                                                                 |
| ------------------------- | ------------------------ | --------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `ThemePreferencesContext` | `localStorage`           | `AsyncStorage`              | Same 6 dimensions; applies `colors`/`spacing`/`fontSize` objects from `@repo/ui/theme` instead of CSS data-attributes |
| `BrainTodayContext`       | `sessionStorage`         | `AsyncStorage` with day-key | Already partially implemented in `BrainTodayBottomSheet`; extract to context                                          |
| `AlertPreferencesContext` | `localStorage` per-user  | `AsyncStorage` per-user     | Same `AlertPreferences` interface                                                                                     |
| `ActivitySignalsContext`  | In-memory                | In-memory                   | Same signal shape; tracks task switches and time-on-task                                                              |
| `TimerContext`            | In-memory (`useReducer`) | In-memory (`useReducer`)    | Same state machine; same per-task timer model                                                                         |
| `ActiveRoutineContext`    | `localStorage` per-user  | `AsyncStorage` per-user     | Same pattern                                                                                                          |

**Rationale**: Exact context parity means hooks can consume the same data shape across platforms. The only difference is the storage adapter (sync `localStorage` vs async `AsyncStorage`), which is encapsulated inside each provider.

**AsyncStorage async loading pattern**: Each context will expose an `isHydrated` boolean. The provider performs an initial `AsyncStorage.getItem` on mount and sets `isHydrated = true` once loaded. Components consuming the context can show a skeleton/spinner until hydrated.

### 5. Theme system — runtime style objects instead of CSS data-attributes

**Decision**: `ThemePreferencesContext` on mobile will resolve the selected theme/fontSize/spacing to concrete JS token objects (`resolvedColors`, `resolvedFontSizes`, `resolvedSpacing`) from `@repo/ui/theme` exports. Components use `useTheme()` to get these resolved tokens instead of `StyleSheet.create` with static imports.

**Rationale**: Web applies theme via CSS `data-theme` attribute on `<html>`. React Native has no CSS cascade. The equivalent is a context that provides the concrete token object (e.g., `darkColors` when theme is `"dark"`, `softColors` when theme is `"soft"`). Components call `const { resolvedColors, resolvedFontSizes } = useTheme()` and use those in inline styles or `StyleSheet.create` calls.

**Alternative considered**: A global `StyleSheet` factory that rebuilds all sheets on theme change — rejected because React context + re-render is simpler and React Native's reconciler handles it efficiently.

### 6. Focus timer — same `useReducer` state machine, no background task

**Decision**: Port the web `TimerContext`'s `useReducer` logic verbatim (same actions, same state shape, same per-task timer model). Use `setInterval` for 1-second ticks. Add `AppState` handling: pause tick interval on background, resume on foreground.

**Rationale**: The timer state machine is pure logic — no DOM or browser APIs. The only adaptation needed is pausing the interval when the app backgrounds (otherwise it's killed by the OS). `AppState` detection is already proven in `useAuth`'s auto-refresh pattern.

**Alternative considered**: `expo-task-manager` for background execution — classified as non-goal. Background timer completion notifications can be added later with `expo-notifications.scheduleNotificationAsync`.

### 7. Smart checklist — reuse domain entities, add CRUD to repository interface

**Decision**: Extend `ITaskRepository` to include checklist step operations: `addChecklistStep`, `updateChecklistStep`, `deleteChecklistStep`, `toggleChecklistStep`. Mirror web-host's `useSmartChecklist` hook with progressive disclosure (current step highlight, summary count, expand/collapse).

**Rationale**: Domain entities (`ChecklistStep`) already exist in mobile. Only the repository methods and the presentation hook/component are missing.

### 8. Routine management — new screen with FlatList + swipe actions

**Decision**: Add a new route `(app)/manage-routines.tsx` with the routine management screen. Use `FlatList` with drag-to-reorder (`react-native-draggable-flatlist`) and swipe-to-delete. Inline rename via text input, icon picker via a bottom-sheet grid.

**Rationale**: Matches `web-host`'s `RoutineManagementPage` feature set (CRUD + reorder + icon picker) using mobile-native interaction patterns. `react-native-draggable-flatlist` is the standard library for list reordering on RN.

### 9. User menu — bottom sheet instead of dropdown

**Decision**: Replace the simple `Modal` with an `@gorhom/bottom-sheet` or a custom bottom-sheet component. Sections: user info, timer preferences, appearance settings (theme/fontSize/spacing selectors), mode/helpers/complexity toggles, navigation links (Manage Kanbans, Cognitive Alerts, Archived Tasks), sign out.

**Rationale**: Dropdown menus don't exist natively on mobile. Bottom sheets are the standard pattern (Google Sheets, Spotify, Instagram). They provide progressive disclosure and can grow without spatial constraints.

**Dependency consideration**: If `@gorhom/bottom-sheet` adds too much overhead, a simple `Modal` with `Animated.View` slide-up transition is acceptable. The critical part is the content structure, not the container.

### 10. Navigation structure — new routes under (app)/

**Decision**: Add new expo-router routes:

```
(app)/
  dashboard.tsx          (existing — rewrite)
  manage-routines.tsx    (new)
  archived-tasks.tsx     (new)
  cognitive-alert-config.tsx (new)
```

All protected by the existing `(app)/_layout.tsx` auth guard.

**Rationale**: expo-router's file-based routing makes this straightforward. Each screen is a standalone route, matching web-host's router structure (`/dashboard`, `/settings/routines`, `/archived-tasks`, `/settings/cognitive-alerts`).

### 11. Optimistic mutations — same `onMutate`/`onError` rollback pattern

**Decision**: Port web-host's optimistic update pattern for all mutations. Each `useMutation` does: `onMutate` → snapshot query cache → apply optimistic update → return snapshot; `onError` → restore snapshot from context; `onSettled` → invalidate queries.

**Rationale**: Identical pattern across platforms. React Query's cache manipulation API is platform-agnostic.

### 12. Domain interface extensions

**Decision**: Extend mobile's repository interfaces to match web-host capabilities:

**`ITaskRepository`** additions:

- `getTasksByRoutine(routineId: string): Promise<Task[]>`
- `createTask(input: CreateTaskInput): Promise<Task>`
- `updateTask(id: string, input: UpdateTaskInput): Promise<Task>`
- `updateTaskStatus(id: string, status: TaskStatus): Promise<Task>`
- `deleteTask(id: string): Promise<void>`
- `reorderTasks(tasks: { id: string; position: number }[]): Promise<void>`
- `archiveTask(id: string): Promise<Task>`
- `getArchivedTasks(): Promise<Task[]>`
- `restoreTask(id: string, status: TaskStatus): Promise<Task>`
- `addTaskTimeSpent(id: string, seconds: number): Promise<void>`
- `addChecklistStep(taskId: string, title: string): Promise<ChecklistStep>`
- `updateChecklistStep(id: string, input: Partial<ChecklistStep>): Promise<ChecklistStep>`
- `deleteChecklistStep(id: string): Promise<void>`
- `toggleChecklistStep(id: string): Promise<ChecklistStep>`

**`IRoutineRepository`** additions:

- `createRoutine(input: CreateRoutineInput): Promise<Routine>`
- `updateRoutine(id: string, input: UpdateRoutineInput): Promise<Routine>`
- `deleteRoutine(id: string): Promise<void>`
- `reorderRoutines(routines: { id: string; position: number }[]): Promise<void>`

**Rationale**: Mirror web-host's repository capabilities exactly. Implementation in `SupabaseTaskRepository`/`SupabaseRoutineRepository` follows the same Supabase query patterns already used in web-host's infrastructure layer.

### 13. Alert engine upgrade — full rule engine with mobile channels

**Decision**: Replace the simple interval-based engine with the full `AlertEngineService.evaluateAlerts()` logic from web-host. Channels adapted for mobile:

| Channel         | Web                                       | Mobile                                                  |
| --------------- | ----------------------------------------- | ------------------------------------------------------- |
| `toast`         | `sonner.toast()`                          | `react-native-toast-message` or `Alert.alert()` for now |
| `icon` (banner) | `CognitiveAlertBanner` with pulsing state | Same `CognitiveAlertBanner` component (already exists)  |
| `modal`         | shadcn `Dialog`                           | React Native `Modal` or bottom sheet                    |

`ActivitySignalsContext` feeds the engine with the same signal shape as web. `AppState` listener pauses/resumes the 60-second tick interval.

### 14. New dependency decisions

| Package                           | Purpose                                        | Required?                                       |
| --------------------------------- | ---------------------------------------------- | ----------------------------------------------- |
| `react-native-gesture-handler`    | Swipe actions on task cards                    | Yes — already peer dep of expo-router           |
| `react-native-reanimated`         | Smooth transitions, bottom sheet animations    | Yes — already peer dep of expo-router           |
| `react-native-draggable-flatlist` | Reorder tasks within a group, reorder routines | Yes — new dependency                            |
| `react-native-toast-message`      | Toast channel for alert engine                 | Nice-to-have — can start with `Alert.alert()`   |
| `@gorhom/bottom-sheet`            | Rich user menu, icon picker                    | Nice-to-have — can use RN `Modal` with Animated |

`react-native-gesture-handler` and `react-native-reanimated` are already transitive dependencies via expo-router/react-navigation; they just need explicit installation for direct import.

## Risks / Trade-offs

- **Large surface area** → Many files touched simultaneously (auth screens, dashboard, all hooks, all components, new contexts, new routes, extended repositories). Mitigation: implement in clearly scoped phases — first infrastructure/domain extensions, then contexts, then auth decomposition, then dashboard features one at a time.

- **AsyncStorage async hydration** → Unlike `localStorage` (synchronous), `AsyncStorage` is async. Components may flash default state before hydration completes. Mitigation: each context exposes `isHydrated`; the `(app)/_layout.tsx` waits for critical contexts (theme, active routine) before rendering children.

- **Timer accuracy in background** → `setInterval` stops when app is backgrounded on iOS/Android. Mitigation: on foreground resume, calculate elapsed real time since last tick and adjust timer state accordingly. Exact Pomodoro precision is not critical for accessibility purposes.

- **Gesture handler conflicts** → Swipeable cards inside ScrollView can conflict with scroll gestures. Mitigation: set `activeOffsetX` threshold on swipe gesture (e.g., 20px) so small horizontal movements are ignored and scroll takes priority.

- **Bundle size increase** → Adding `react-native-draggable-flatlist` and potentially `@gorhom/bottom-sheet`. Mitigation: both are well-maintained, tree-shakeable expo-compatible libraries. Combined added size < 100KB.

- **Auth flow regression** → Rewriting auth screens risks breaking deep-link magic-link callback, which is critical and difficult to test. Mitigation: `useAuth` hook and `magic-link-callback.tsx` route logic remain unchanged — only the visual form components are refactored.

## Open Questions

- **Toast library**: Should we use `react-native-toast-message` for a richer toast experience or keep using `Alert.alert()` for simplicity? This affects alert engine's moderado channel and mutation feedback.
- **Bottom sheet library**: `@gorhom/bottom-sheet` vs. custom `Animated.View`-based solution vs. Expo's built-in `Modal`? Affects user menu, brain-today, and icon picker UX quality.
- **Reorder within status group**: Is within-group task reorder (drag to change position) needed for mobile MVP, or is it enough to just change status via swipe and sort by `createdAt`?
