## ADDED Requirements

### Requirement: Activity signals are tracked via a shared context

The system SHALL maintain an `ActivitySignalsContext` that accumulates observable activity events: `taskSwitchCount`, `timeOnCurrentTaskMs`, `lastInteractionMs`, `plannedTaskDurationMs`, `currentTaskIsComplex`. Components such as `KanbanBoard` and `FocusTimer` SHALL write into this context. The alert engine reads from it.

#### Scenario: Task switch increments counter

- **WHEN** the user moves a task to a different Kanban column or selects a different active task
- **THEN** `taskSwitchCount` in `ActivitySignalsContext` increments by 1

#### Scenario: Inactivity timer updates

- **WHEN** no user interaction event (click, keypress, scroll) is detected for more than 60 seconds
- **THEN** `lastInteractionMs` reflects the last recorded interaction timestamp and the engine can compute idle time

---

### Requirement: Alert engine evaluates triggers on a regular tick

`useAlertEngine` SHALL set up a 60-second `setInterval` tick that evaluates all enabled triggers against the current activity signals and preferences. It SHALL dispatch at most one alert per tick. The engine SHALL be mounted in `Dashboard`.

#### Scenario: No triggers fire when user is active

- **WHEN** `taskSwitchCount < 3`, `timeOnCurrentTaskMs < 1800000` (30 min), and last interaction was < 5 minutes ago
- **THEN** no alert is dispatched on the next tick

#### Scenario: Same-task-too-long trigger fires

- **WHEN** `timeOnCurrentTaskMs` exceeds the configured threshold (default 30 min) and `same-task-too-long` trigger is enabled
- **THEN** an `AlertPayload` is dispatched on the next tick

#### Scenario: Task-switching trigger fires

- **WHEN** `taskSwitchCount` reaches or exceeds the configured threshold (default 3) within the session
- **THEN** an `AlertPayload` is dispatched on the next tick and `taskSwitchCount` is reset to 0

#### Scenario: Engine cleanup on unmount

- **WHEN** the `Dashboard` component unmounts
- **THEN** the `setInterval` is cleared and no further alerts are dispatched

---

### Requirement: Alert payload is determined by intensity and brain state × tone

The pure function `AlertEngineService.evaluate(trigger, brainState, preferences)` SHALL return an `AlertPayload { channel: 'icon' | 'toast' | 'modal', message: string }`. The `channel` SHALL be determined solely by `preferences.intensity`. The `message` SHALL be looked up from `alertMessages.ts` using `(trigger, brainState ?? 'focado', preferences.tone)`.

#### Scenario: Discreto intensity maps to icon channel

- **WHEN** `preferences.intensity === 'discreto'`
- **THEN** `AlertPayload.channel === 'icon'` regardless of trigger or brain state

#### Scenario: Moderado intensity maps to toast channel

- **WHEN** `preferences.intensity === 'moderado'`
- **THEN** `AlertPayload.channel === 'toast'`

#### Scenario: Ativo intensity maps to modal channel

- **WHEN** `preferences.intensity === 'ativo'`
- **THEN** `AlertPayload.channel === 'modal'`

#### Scenario: Brain state shapes message copy

- **WHEN** brain state is `'ansioso'` and trigger is `'same-task-too-long'` and tone is `'acolhedor'`
- **THEN** the message contains a calming suggestion (e.g., includes a breathing or pause prompt)

---

### Requirement: Alert dispatch respects a per-trigger cool-down

The engine SHALL suppress firing the same trigger type again until at least 15 minutes have elapsed since the last dispatch of that trigger. This prevents alert fatigue.

#### Scenario: Same trigger suppressed within cool-down

- **WHEN** `same-task-too-long` fired 10 minutes ago
- **THEN** even if the condition is still met on the next tick, no alert is dispatched for that trigger

#### Scenario: Different trigger not suppressed

- **WHEN** `same-task-too-long` is in cool-down but `inactivity` condition is met
- **THEN** the `inactivity` alert IS dispatched (different trigger type)

---

### Requirement: Alert is rendered at the correct UI channel

`useAlertEngine` SHALL route each `AlertPayload` to the appropriate presentation layer: `'icon'` → sets `alertBannerActive` state in `CognitiveAlertBanner`; `'toast'` → calls `sonner.toast(message)`; `'modal'` → sets `lightModalOpen` state in `CognitiveAlertModal`.

#### Scenario: Toast appears for moderado intensity

- **WHEN** an `AlertPayload` with `channel: 'toast'` is dispatched
- **THEN** a sonner toast renders with the payload message in the bottom-right corner, auto-dismissing after 6 seconds

#### Scenario: Modal is non-blocking

- **WHEN** an `AlertPayload` with `channel: 'modal'` is dispatched
- **THEN** `CognitiveAlertModal` opens as a shadcn `Dialog` that does not use `aria-modal` to freeze background scrolling, allowing the user to continue working without closing it

#### Scenario: Icon pulses when discreto alert is active

- **WHEN** an `AlertPayload` with `channel: 'icon'` is dispatched
- **THEN** the `CognitiveAlertBanner` icon adopts a CSS animation class that pulses at a slow rate (≤ 1 Hz), stopping after 30 seconds or when the user dismisses it

---

### Requirement: Engine is fully unit-testable via injected signals

`AlertEngineService.evaluate` SHALL be a pure function with no side effects. `useAlertEngine` SHALL accept an optional `clockFn` parameter (defaults to `Date.now`) to allow deterministic time-based tests without real timers.

#### Scenario: Pure function returns correct payload

- **WHEN** `AlertEngineService.evaluate` is called with a mock trigger, brain state, and preferences
- **THEN** it returns the expected `AlertPayload` without touching DOM, context, or localStorage

#### Scenario: Injected clock enables deterministic tests

- **WHEN** `useAlertEngine` is rendered with a `clockFn` that returns a fixed timestamp
- **THEN** cool-down logic behaves predictably based on that fixed time
