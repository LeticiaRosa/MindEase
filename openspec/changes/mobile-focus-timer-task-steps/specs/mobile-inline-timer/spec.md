## ADDED Requirements

### Requirement: Inline timer displays circular progress ring

The system SHALL render an inline `FocusTimer` widget that, when active, displays a small SVG circular progress ring (using `react-native-svg`) alongside the formatted time (`MM:SS`), the current mode label ("Foco" / "Pausa" / "Pausa Longa"), and the cycle indicator. The ring SHALL update its `strokeDashoffset` on each timer tick.

#### Scenario: Timer is active and running

- **WHEN** the timer is running for a task
- **THEN** the inline widget shows a circular ring with progress, the formatted countdown, and the mode/cycle label

#### Scenario: Timer is active and paused

- **WHEN** the timer is paused for a task
- **THEN** the inline widget shows the ring at the paused progress, a "⏸" indicator, and the paused time

### Requirement: Inline timer provides play/pause controls

The system SHALL display a play button when the timer is idle or paused, and a pause button when running. Tapping play SHALL start or resume the timer. Tapping pause SHALL pause it. All controls SHALL have a minimum touch target of 44×44 points.

#### Scenario: User starts the timer from inline widget

- **WHEN** the user taps the play button on the inline timer
- **THEN** the timer starts (or resumes) and the button switches to a pause icon

#### Scenario: User pauses from inline widget

- **WHEN** the user taps the pause button on the inline timer
- **THEN** the timer pauses and the button switches to a play icon

### Requirement: Inline timer provides reset and stop controls when active

The system SHALL display reset and stop buttons when the timer is active (running or paused). The reset button SHALL reset the timer to the initial duration. The stop button SHALL persist elapsed time and clear the timer.

#### Scenario: User resets from inline widget

- **WHEN** the user taps the reset button on the active inline timer
- **THEN** the timer resets to the initial focus duration and enters idle state

#### Scenario: User stops from inline widget

- **WHEN** the user taps the stop button on the active inline timer
- **THEN** the elapsed focus time is persisted to Supabase and the timer is cleared

### Requirement: Inactive timer shows start button

When no timer is active for a task, the system SHALL render a compact "▶ Foco" button that starts the timer on press.

#### Scenario: No timer active for task

- **WHEN** no timer session exists for the task
- **THEN** the system renders a compact "▶ Foco" pressable that starts the timer on tap

### Requirement: Inline timer expand action opens focus mode

The system SHALL accept an `onExpand` callback. When the active timer widget is tapped (not its play/pause controls), it SHALL invoke `onExpand` to signal the parent to open the full-screen focus overlay.

#### Scenario: User taps active timer badge

- **WHEN** the user taps the active inline timer badge (not the play/pause button)
- **THEN** the `onExpand` callback fires and the parent opens `FocusTimerFocus`

### Requirement: Inline timer is integrated into TaskCard

The system SHALL render the `FocusTimer` widget inside `TaskCard` below the task title metadata row. The timer widget SHALL receive the task ID and an `onExpand` callback that triggers focus mode.

#### Scenario: TaskCard shows inline timer

- **WHEN** a task card is rendered
- **THEN** the inline FocusTimer widget is visible below the metadata, allowing the user to start/control the timer directly from the card

#### Scenario: TaskCard timer badge launches focus mode

- **WHEN** the user taps the active timer badge on a TaskCard
- **THEN** the dashboard opens the full-screen `FocusTimerFocus` for that task

### Requirement: Inline timer respects theme preferences

The system SHALL use `ThemePreferencesContext` for all colors, font sizes, spacing, and border radii in the inline timer widget.

#### Scenario: Theme applied to inline timer

- **WHEN** the user has custom theme settings (colors, font size, spacing)
- **THEN** the inline timer widget renders with the resolved theme values
