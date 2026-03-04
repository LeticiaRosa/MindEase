## ADDED Requirements

### Requirement: Full-screen focus overlay displays timer ring

The system SHALL render a full-screen modal overlay (`FocusTimerFocus`) that displays an SVG circular progress ring showing the remaining time for the current Pomodoro session. The ring SHALL use `react-native-svg` `Circle` elements with `strokeDasharray`/`strokeDashoffset` to indicate progress. The time SHALL be displayed in `MM:SS` format centered inside the ring using a large monospace font.

#### Scenario: User opens focus mode for a task

- **WHEN** the user triggers focus mode for a task (via the inline timer badge)
- **THEN** the system renders a full-screen modal with the task title, a circular progress ring, the formatted time inside the ring, the current mode label, and cycle indicator (`N / M`)

#### Scenario: Timer ring animates on each tick

- **WHEN** the timer is running and a second elapses
- **THEN** the ring's `strokeDashoffset` updates to reflect the new remaining time proportion

### Requirement: Focus overlay shows contextual mode descriptions

The system SHALL display a contextual description below the mode label that changes based on the current timer mode: "Mantenha o foco. Um passo de cada vez." for `focus`, "Descanse a mente. Você mereceu." for `break`, and "Faça uma pausa mais longa antes da próxima sessão." for `long_break`.

#### Scenario: Mode label and description update on mode change

- **WHEN** the timer transitions from focus to break (or break to focus, or to long_break)
- **THEN** the mode label updates to "Foco", "Pausa", or "Pausa Longa" and the contextual description updates accordingly

### Requirement: Focus overlay provides start/pause/reset/stop controls

The system SHALL display control buttons: a primary start/resume button, a pause button (when running), a reset button, and a stop button. The stop button SHALL persist elapsed focus time to Supabase via `addTaskTimeSpent` and close the overlay. All buttons SHALL have a minimum touch target of 44×44 points.

#### Scenario: User starts the timer from focus mode

- **WHEN** the user presses the start button while the timer is idle or paused
- **THEN** the timer begins counting down and the start button is replaced with a pause button

#### Scenario: User pauses the timer

- **WHEN** the user presses the pause button while the timer is running
- **THEN** the timer pauses and the pause button is replaced with a resume button

#### Scenario: User resets the timer

- **WHEN** the user presses the reset button
- **THEN** the timer resets to the initial duration for the current mode and returns to idle state

#### Scenario: User stops and saves time

- **WHEN** the user presses the stop button
- **THEN** the elapsed focus time is persisted to Supabase, the timer is cleared, and the focus overlay closes

### Requirement: Focus overlay includes collapsible smart checklist

The system SHALL render a collapsible section below the timer controls that contains the `SmartChecklist` component for the focused task. The section SHALL default to collapsed. A toggle button labeled "Mostrar etapas" / "Ocultar etapas" SHALL expand/collapse the checklist.

#### Scenario: User expands checklist in focus mode

- **WHEN** the user presses "Mostrar etapas" in the focus overlay
- **THEN** the SmartChecklist for the focused task is rendered below the controls and the button label changes to "Ocultar etapas"

#### Scenario: User collapses checklist in focus mode

- **WHEN** the user presses "Ocultar etapas"
- **THEN** the SmartChecklist is hidden and the button label reverts to "Mostrar etapas"

#### Scenario: Dashboard-level timer has no checklist toggle

- **WHEN** the `taskId` is "dashboard"
- **THEN** the checklist toggle is not rendered

### Requirement: Focus overlay exit via close button

The system SHALL display a close/exit button in the top-right area of the overlay with the label "✕ Sair do foco". Pressing it SHALL close the modal without stopping the timer (timer continues running in the background).

#### Scenario: User exits focus mode without stopping

- **WHEN** the user presses the close button
- **THEN** the focus overlay closes and the timer continues running; the inline FocusTimer badge reflects the running state

### Requirement: Focus overlay respects safe area and theme

The system SHALL wrap content in `SafeAreaView` and use `ThemePreferencesContext` for all colors, font sizes, spacing, and border radii. The overlay background SHALL use the theme's `background` color.

#### Scenario: Theme change reflected in focus mode

- **WHEN** the user has a non-default theme active (e.g., high contrast)
- **THEN** all focus overlay elements use the resolved theme colors, font sizes, and spacing
