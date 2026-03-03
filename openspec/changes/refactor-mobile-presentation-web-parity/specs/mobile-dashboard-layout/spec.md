## ADDED Requirements

### Requirement: Dashboard integrates all feature contexts at layout level

The `(app)/_layout.tsx` SHALL wrap child screens with the required context providers in the correct order: `ThemePreferencesProvider` → `BrainTodayProvider` → `AlertPreferencesProvider` → `ActivitySignalsProvider` → children. `TimerProvider` and `ActiveRoutineProvider` SHALL be mounted inside the dashboard screen specifically (matching web-host's `ProtectedRoute` + `Dashboard` pattern).

#### Scenario: Context providers are present

- **WHEN** the app layout mounts for an authenticated user
- **THEN** `ThemePreferencesContext`, `BrainTodayContext`, `AlertPreferencesContext`, and `ActivitySignalsContext` are all available to child components

#### Scenario: Dashboard adds timer and routine contexts

- **WHEN** the dashboard screen mounts
- **THEN** `TimerProvider` and `ActiveRoutineProvider` wrap the dashboard content, making `useTimer()` and `useActiveRoutine()` available

---

### Requirement: Dashboard header displays logo, alert banner, and user menu

The dashboard header SHALL render: the "🧠 MindEase" logo on the left, a `CognitiveAlertBanner` below when an alert is active, and the `UserMenuBottomSheet` trigger (avatar) on the right.

#### Scenario: Header layout matches web

- **WHEN** the dashboard renders
- **THEN** the header shows the logo text, user avatar button, and conditionally the alert banner

#### Scenario: Alert banner appears when engine dispatches icon channel

- **WHEN** the alert engine dispatches an `icon` channel alert
- **THEN** `CognitiveAlertBanner` appears in the header with the alert message and a dismiss button

---

### Requirement: Dashboard renders routine selector above task groups

Below the header, the dashboard SHALL render a routine selector followed by the task groups for the active routine.

#### Scenario: Routine selector and tasks visible

- **WHEN** the dashboard renders with routines and tasks
- **THEN** the routine selector row is above the task groups, showing the active routine highlighted

#### Scenario: Switching routine reloads task content

- **WHEN** the user selects a different routine
- **THEN** the task groups re-render with tasks for the newly selected routine

---

### Requirement: Dashboard supports pull-to-refresh

The dashboard `ScrollView` SHALL have a `RefreshControl` that refetches tasks, routines, and alert preferences on pull.

#### Scenario: Pull to refresh updates all data

- **WHEN** the user pulls down on the dashboard scroll view
- **THEN** `refetchTasks()`, `refetchRoutines()`, and alert preference rehydration all execute in parallel

---

### Requirement: Brain-today check-in is shown before dashboard content

On first render within a session (day-scoped on mobile), the `BrainTodayBottomSheet` SHALL appear before the dashboard content is interactive, matching the web's `BrainTodayModal` pattern.

#### Scenario: First open today shows check-in

- **WHEN** an authenticated user opens the dashboard for the first time today
- **THEN** the `BrainTodayBottomSheet` is presented

#### Scenario: Already answered today skips check-in

- **WHEN** the user has already answered the brain-state check-in today (day key exists in `AsyncStorage`)
- **THEN** the bottom sheet is NOT shown and the dashboard is immediately interactive

---

### Requirement: Dashboard complexity adapts based on user preference

When `complexity` is `"simple"`, the dashboard SHALL hide advanced features (timer, manage-routines link, archived-tasks link). When `"complex"`, all features are visible.

#### Scenario: Simple mode hides timer

- **WHEN** `complexity` is `"simple"`
- **THEN** `FocusTimer` components on task cards are hidden and the focus mode button in the header is removed

#### Scenario: Complex mode shows all features

- **WHEN** `complexity` is `"complex"`
- **THEN** task cards show timer badges, header shows focus mode button, and navigation links to manage-routines and archived-tasks are available

---

### Requirement: Dashboard uses theme tokens for all visual styling

Every visual element on the dashboard (backgrounds, text, borders, spacing) SHALL use tokens from `useTheme()` context, ensuring the full theme (colors, font size, spacing) is applied consistently.

#### Scenario: Dark theme applies to dashboard

- **WHEN** the user has dark theme selected
- **THEN** the dashboard background uses `resolvedColors.background`, text uses `resolvedColors.foreground`, and all card/section styles use the resolved dark palette

#### Scenario: Large font size applies to dashboard

- **WHEN** `fontSize` is `"lg"`
- **THEN** all text on the dashboard uses the larger resolved font size tokens
