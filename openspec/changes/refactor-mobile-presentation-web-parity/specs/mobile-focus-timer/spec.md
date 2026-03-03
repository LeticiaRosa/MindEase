## ADDED Requirements

### Requirement: Timer state machine matches web-host Pomodoro implementation

The mobile `TimerContext` SHALL implement the same `useReducer`-based state machine as `web-host`, supporting per-task timers with modes: `focus`, `break`, `long_break`. Each task timer SHALL have state: `mode`, `remainingSeconds`, `isRunning`, `isPaused`, `elapsedSeconds`, `currentCycle`.

#### Scenario: Starting a timer for a task

- **WHEN** the user starts a timer for task A
- **THEN** `TimerContext` creates a timer entry for task A in `focus` mode, `isRunning: true`, `remainingSeconds` set from preferences `focusDuration`

#### Scenario: Starting a new task pauses the previous

- **WHEN** task A's timer is running and the user starts a timer for task B
- **THEN** task A's timer is paused (`isRunning: false, isPaused: true`) and task B's timer starts

#### Scenario: Timer tick decrements remaining seconds

- **WHEN** a timer is running and 1 second elapses
- **THEN** `remainingSeconds` decrements by 1 and `elapsedSeconds` increments by 1 (for focus mode only)

---

### Requirement: Timer auto-advances through Pomodoro cycle

When a focus session completes, the timer SHALL automatically transition to break mode. After a configured number of cycles, it SHALL transition to long_break.

#### Scenario: Focus complete transitions to break

- **WHEN** `remainingSeconds` reaches 0 in `focus` mode and `currentCycle < totalCycles`
- **THEN** the timer transitions to `break` mode with `remainingSeconds` set from `breakDuration` preference

#### Scenario: Break complete transitions to next focus

- **WHEN** `remainingSeconds` reaches 0 in `break` mode
- **THEN** `currentCycle` increments by 1 and the timer transitions back to `focus` mode

#### Scenario: Final cycle triggers long break

- **WHEN** `remainingSeconds` reaches 0 in `focus` mode and `currentCycle === totalCycles`
- **THEN** the timer transitions to `long_break` mode with `remainingSeconds` set from `longBreakDuration` preference

---

### Requirement: Timer persists elapsed time to Supabase on stop

When the user manually stops a timer (not pause), the system SHALL save the accumulated `elapsedSeconds` to the task's `totalTimeSpent` via `repository.addTaskTimeSpent(taskId, elapsedSeconds)`.

#### Scenario: Stop saves elapsed time

- **WHEN** the user stops a running focus timer that has accumulated 300 `elapsedSeconds`
- **THEN** `addTaskTimeSpent(taskId, 300)` is called and the timer state is reset

#### Scenario: Pause does not save time

- **WHEN** the user pauses a timer
- **THEN** no persistence call is made; `elapsedSeconds` is preserved in state for later resumption

---

### Requirement: Timer UI renders compact inline and full-screen focus mode

The `FocusTimer` component SHALL render a compact inline timer on the task card. Tapping it SHALL expand to a `FocusTimerFocus` full-screen overlay with a large ring indicator, play/pause/reset/stop controls, and the focused task's checklist.

#### Scenario: Compact timer shows on active task card

- **WHEN** a timer is running for a task
- **THEN** the task card shows a compact timer badge with formatted `mm:ss`, mode label, and a small progress ring

#### Scenario: Tap compact timer opens focus mode

- **WHEN** the user taps the compact timer badge
- **THEN** a full-screen `FocusTimerFocus` overlay opens with: large circular progress ring, `mm:ss` display, mode label, play/pause/reset/stop buttons, and the task's smart checklist below

#### Scenario: Focus mode overlay does not navigate away

- **WHEN** `FocusTimerFocus` is open
- **THEN** it renders as a React Native `Modal` overlaying the dashboard, not as a route navigation (back gesture dismisses it)

---

### Requirement: Timer handles AppState transitions

The timer SHALL pause the `setInterval` tick when the app moves to background and resume it on foreground. On resume, elapsed real time SHALL be calculated and applied to the timer state.

#### Scenario: App backgrounds during focus

- **WHEN** the app moves to `background` state while a timer is running
- **THEN** the `setInterval` is cleared and the background timestamp is recorded

#### Scenario: App foregrounds after 30 seconds

- **WHEN** the app returns to `active` state after 30 seconds in background
- **THEN** the timer state is adjusted by subtracting 30 seconds from `remainingSeconds` (clamped to 0) and adding 30 to `elapsedSeconds`, then the `setInterval` resumes

---

### Requirement: Timer preferences are configurable

The user SHALL be able to configure focus duration, break duration, long-break duration, and total cycles via the user menu's timer preferences panel. Preferences SHALL be persisted to Supabase via `useTimerPreferences` hook.

#### Scenario: Default preferences applied on first use

- **WHEN** no timer preferences exist for the user
- **THEN** defaults are used: focus 25 min, break 5 min, long break 15 min, 4 cycles

#### Scenario: Changing preferences updates running timers

- **WHEN** the user changes focus duration from 25 to 30 minutes and saves
- **THEN** the currently running timer (if any) is NOT affected, but the next timer started uses 30 minutes
