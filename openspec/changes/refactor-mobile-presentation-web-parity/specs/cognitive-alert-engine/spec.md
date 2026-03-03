## MODIFIED Requirements

### Requirement: Activity signals are tracked via a shared context

The system SHALL maintain an `ActivitySignalsContext` that accumulates observable activity events: `taskSwitchCount`, `timeOnCurrentTaskMs`, `lastInteractionMs`, `plannedTaskDurationMs`, `currentTaskIsComplex`. On **web**, components such as `KanbanBoard` and `FocusTimer` write into this context. On **mobile**, `TaskGroup` swipe-status-changes and `FocusTimer` write into this context. The alert engine reads from it on both platforms.

#### Scenario: Task switch increments counter (web)

- **WHEN** the user moves a task to a different Kanban column or selects a different active task
- **THEN** `taskSwitchCount` in `ActivitySignalsContext` increments by 1

#### Scenario: Task switch increments counter (mobile)

- **WHEN** the user swipes a task card to change its status or selects a different task for the focus timer
- **THEN** `taskSwitchCount` in `ActivitySignalsContext` increments by 1

#### Scenario: Inactivity timer updates (web)

- **WHEN** no user interaction event (click, keypress, scroll) is detected for more than 60 seconds
- **THEN** `lastInteractionMs` reflects the last recorded interaction timestamp and the engine can compute idle time

#### Scenario: Inactivity timer updates (mobile)

- **WHEN** no user interaction event (touch, scroll) is detected for more than 60 seconds and the app is in foreground
- **THEN** `lastInteractionMs` reflects the last recorded interaction timestamp

---

### Requirement: Alert engine evaluates triggers on a regular tick

`useAlertEngine` SHALL set up a 60-second `setInterval` tick that evaluates all enabled triggers against the current activity signals and preferences. It SHALL dispatch at most one alert per tick. On **mobile**, the tick interval SHALL be paused when `AppState` transitions to background and resumed on foreground.

#### Scenario: No triggers fire when user is active

- **WHEN** `taskSwitchCount < 3`, `timeOnCurrentTaskMs < 1800000` (30 min), and last interaction was < 5 minutes ago
- **THEN** no alert is dispatched on the next tick

#### Scenario: Same-task-too-long trigger fires

- **WHEN** `timeOnCurrentTaskMs` exceeds the configured threshold (default 30 min) and `same-task-too-long` trigger is enabled
- **THEN** an `AlertPayload` is dispatched on the next tick

#### Scenario: Engine cleanup on unmount

- **WHEN** the `Dashboard` component unmounts
- **THEN** the `setInterval` is cleared and no further alerts are dispatched

#### Scenario: Engine pauses in background (mobile)

- **WHEN** the app transitions to `background` state on mobile
- **THEN** the `setInterval` is cleared and no alerts fire while backgrounded

#### Scenario: Engine resumes on foreground (mobile)

- **WHEN** the app transitions back to `active` state on mobile
- **THEN** the `setInterval` resumes with a fresh 60-second cycle

---

### Requirement: Alert is rendered at the correct UI channel

`useAlertEngine` SHALL route each `AlertPayload` to the appropriate presentation layer. Channel mapping is platform-specific:

- `'icon'` → On **web**: sets `alertBannerActive` in `CognitiveAlertBanner`. On **mobile**: sets `bannerActive` in `CognitiveAlertBanner` component.
- `'toast'` → On **web**: calls `sonner.toast(message)`. On **mobile**: displays a non-blocking toast notification (via `Alert.alert()` or `react-native-toast-message`).
- `'modal'` → On **web**: opens `CognitiveAlertModal` as a non-blocking `Dialog`. On **mobile**: presents a React Native `Modal` or bottom sheet with the alert message and a dismiss button.

#### Scenario: Toast appears for moderado intensity (web)

- **WHEN** an `AlertPayload` with `channel: 'toast'` is dispatched on web
- **THEN** a sonner toast renders with the payload message in the bottom-right corner, auto-dismissing after 6 seconds

#### Scenario: Toast appears for moderado intensity (mobile)

- **WHEN** an `AlertPayload` with `channel: 'toast'` is dispatched on mobile
- **THEN** a non-blocking toast notification appears with the alert message, auto-dismissing after 6 seconds

#### Scenario: Modal is non-blocking (web)

- **WHEN** an `AlertPayload` with `channel: 'modal'` is dispatched on web
- **THEN** `CognitiveAlertModal` opens as a shadcn `Dialog` that does not use `aria-modal` to freeze background scrolling

#### Scenario: Modal is non-blocking (mobile)

- **WHEN** an `AlertPayload` with `channel: 'modal'` is dispatched on mobile
- **THEN** a `CognitiveAlertModal` opens as a React Native `Modal` with `transparent` background, allowing the user to dismiss it and continue using the app

#### Scenario: Icon banner on mobile

- **WHEN** an `AlertPayload` with `channel: 'icon'` is dispatched on mobile
- **THEN** the `CognitiveAlertBanner` component in the dashboard header shows the alert message with a dismiss button, auto-clearing after 30 seconds
