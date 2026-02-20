## ADDED Requirements

### Requirement: Pomodoro-style focus timer

The system SHALL provide a focus timer with start, pause, and reset controls. The timer SHALL count down from a configurable focus duration and display the remaining time with gentle visual feedback (e.g., a circular progress ring or a soft progress bar). The timer SHALL NOT use aggressive colors, flashing, or sudden visual changes.

#### Scenario: Start a focus session

- **WHEN** the user clicks the "Start" button on the timer
- **THEN** the timer begins counting down from the configured focus duration and the display updates every second with a smooth progress indicator

#### Scenario: Pause a focus session

- **WHEN** the user clicks "Pause" while the timer is running
- **THEN** the countdown stops, the remaining time is preserved, and the user can resume by clicking "Start" again

#### Scenario: Reset a focus session

- **WHEN** the user clicks "Reset"
- **THEN** the timer returns to the full configured focus duration and enters the idle state

#### Scenario: Timer displays remaining time

- **WHEN** the timer is running
- **THEN** the display shows minutes and seconds remaining (e.g., "24:37") with smooth transitions between seconds (no flicker)

### Requirement: Focus and break cycle management

The timer SHALL alternate between focus periods and break periods. After a configurable number of focus cycles, the system SHALL offer a long break. Each transition SHALL be communicated via a gentle toast notification.

#### Scenario: Focus period ends, break starts

- **WHEN** the focus timer reaches zero
- **THEN** the system shows a gentle toast ("Focus session complete — time for a break") and automatically prepares the break timer with the configured break duration

#### Scenario: Long break after configured cycles

- **WHEN** the user completes the configured number of focus cycles (default: 4)
- **THEN** the system offers a long break with the configured long break duration instead of a regular break

#### Scenario: Cycle count is visible

- **WHEN** the timer is active
- **THEN** the display shows the current cycle number (e.g., "Cycle 2 of 4") in a non-intrusive manner

### Requirement: Adjustable timer durations

The system SHALL allow the user to configure focus duration, break duration, long break duration, and cycles before a long break. These preferences SHALL persist to Supabase and apply to all future timer sessions.

#### Scenario: Default timer values

- **WHEN** a user has not configured timer preferences
- **THEN** the system uses defaults: 25 min focus, 5 min break, 15 min long break, 4 cycles before long break

#### Scenario: User updates timer preferences

- **WHEN** the user changes the focus duration to 15 minutes in the settings panel
- **THEN** the preference saves to the database and the next timer session uses 15 minutes

#### Scenario: Preferences persist across sessions

- **WHEN** the user sets custom timer durations and reloads the page
- **THEN** the custom durations are loaded from the database and applied

### Requirement: Timer per-task association

The timer SHALL be associated with a specific task. When a user starts a timer on a task, the task card SHALL display a focus indicator. Only one timer SHALL be active at a time across all tasks.

#### Scenario: Start timer on a task

- **WHEN** the user starts the timer from a task card
- **THEN** the timer begins counting down and the task card shows a focus indicator

#### Scenario: Only one active timer

- **WHEN** the user starts a timer on task B while task A's timer is running
- **THEN** task A's timer stops and resets, and task B's timer starts

#### Scenario: Timer state is local

- **WHEN** the user refreshes the page while a timer is running
- **THEN** the timer resets to idle (active countdown is not persisted)
